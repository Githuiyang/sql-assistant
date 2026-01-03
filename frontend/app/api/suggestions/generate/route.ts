import { NextRequest, NextResponse } from "next/server";
import { buildQuerySuggestionsPrompt } from "@/lib/prompts/suggestions";
import { getLLMService } from "@/lib/api/llm";

export async function POST(request: NextRequest) {
  try {
    const { dictionary, llmConfig } = await request.json();

    if (!dictionary || !llmConfig) {
      return NextResponse.json(
        { success: false, error: "缺少必要参数" },
        { status: 400 }
      );
    }

    // 构建Prompt
    const prompt = buildQuerySuggestionsPrompt(dictionary);

    // 调用LLM
    const llmService = getLLMService();
    const response = await llmService.generateFromPrompt(prompt, llmConfig);

    // 解析响应
    let result;
    try {
      const responseText = response.content;

      // 尝试从响应中提取JSON
      const jsonMatch = responseText.match(/```json\s*([\s\S]*?)\s*```/);
      if (jsonMatch) {
        result = JSON.parse(jsonMatch[1]);
      } else {
        // 如果没有代码块标记，尝试直接解析
        result = JSON.parse(responseText);
      }
    } catch (parseError) {
      console.error("Failed to parse LLM response:", response.content);
      return NextResponse.json(
        {
          success: false,
          error: "解析响应失败",
          details: response.content,
        },
        { status: 500 }
      );
    }

    // 验证结果格式
    if (!result.suggestions || !Array.isArray(result.suggestions)) {
      throw new Error("响应格式不正确：缺少suggestions数组");
    }

    return NextResponse.json({
      success: true,
      suggestions: result.suggestions,
      summary: result.summary,
    });
  } catch (error) {
    console.error("Query suggestions generation error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "生成查询建议失败",
      },
      { status: 500 }
    );
  }
}
