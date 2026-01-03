import { NextRequest, NextResponse } from "next/server"
import { getLLMService } from "@/lib/api/llm"
import { buildDictionaryPrompt } from "@/lib/prompts/dictionary"

export async function POST(request: NextRequest) {
  try {
    const { sessionId, sqlContents, csvFiles, llmConfig } = await request.json()

    // 验证输入
    if (!sessionId || !sqlContents || !csvFiles || !llmConfig) {
      return NextResponse.json(
        { error: "缺少必要参数" },
        { status: 400 }
      )
    }

    // 构建 Prompt
    const prompt = buildDictionaryPrompt(
      sqlContents.map((sql: any) => ({
        code: typeof sql === 'string' ? sql : sql.code,
        description: typeof sql === 'string' ? '' : (sql.description || ''),
      })),
      csvFiles.map((f: { name: string; size: number }) => ({
        name: f.name,
        rowCount: Math.floor(Math.random() * 100) + 10, // 简化处理
        columns: ["column1", "column2", "column3"], // 简化处理
      }))
    )

    // 调用大模型生成字典
    const llmService = getLLMService()
    let response
    try {
      response = await llmService.generateFromPrompt(prompt, llmConfig)
    } catch (llmError) {
      console.error("大模型调用失败:", llmError)
      return NextResponse.json(
        {
          error: "大模型调用失败: " + (llmError instanceof Error ? llmError.message : "未知错误"),
          details: llmError instanceof Error ? llmError.stack : undefined
        },
        { status: 500 }
      )
    }

    // 打印原始响应用于调试
    console.log("大模型原始响应:", response.content)
    console.log("响应长度:", response.content.length)

    // 解析生成的 JSON
    let dictionaryData
    try {
      const jsonMatch = response.content.match(/```json\n([\s\S]*?)\n```/)
      if (jsonMatch) {
        console.log("找到JSON代码块，解析中...")
        dictionaryData = JSON.parse(jsonMatch[1])
      } else {
        console.log("未找到JSON代码块，尝试直接解析...")
        dictionaryData = JSON.parse(response.content)
      }
    } catch (e) {
      // 如果解析失败，返回详细的错误信息和原始内容
      console.error("JSON解析失败:", e)
      console.error("原始响应内容:", response.content)

      return NextResponse.json(
        {
          error: "字典生成失败：大模型返回的内容格式不正确",
          details: e instanceof Error ? e.message : "未知错误",
          rawResponse: response.content,
          responsePreview: response.content.substring(0, 500) // 前500字符预览
        },
        { status: 500 }
      )
    }

    // 只返回生成的字典数据，不保存到数据库
    // 数据保存由前端在浏览器端处理
    return NextResponse.json({
      success: true,
      dictionary: dictionaryData,
      warnings: dictionaryData.warnings || [],
    })
  } catch (error) {
    console.error("字典生成错误:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "字典生成失败" },
      { status: 500 }
    )
  }
}
