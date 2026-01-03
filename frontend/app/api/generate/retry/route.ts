import { NextRequest, NextResponse } from "next/server"
import { getLLMService } from "@/lib/api/llm"
import { buildSQLFixPrompt } from "@/lib/prompts/sqlfix"

export async function POST(request: NextRequest) {
  try {
    const { sessionId, naturalLanguage, originalSQL, errorMessage, fieldDictionary, llmConfig } = await request.json()

    // 验证输入
    if (!sessionId || !naturalLanguage || !originalSQL || !errorMessage || !fieldDictionary || !llmConfig) {
      return NextResponse.json(
        { error: "缺少必要参数" },
        { status: 400 }
      )
    }

    // 构建 Prompt
    const prompt = buildSQLFixPrompt(
      naturalLanguage,
      originalSQL,
      errorMessage,
      fieldDictionary
    )

    console.log("SQL修复请求：")
    console.log("- 原始SQL:", originalSQL.substring(0, 100))
    console.log("- 错误信息:", errorMessage.substring(0, 200))

    // 调用大模型修复SQL
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

    console.log("大模型修复响应:", response.content.substring(0, 200))

    // 解析生成的 JSON
    let sqlResult
    try {
      const jsonMatch = response.content.match(/```json\n([\s\S]*?)\n```/)
      let jsonContent = jsonMatch ? jsonMatch[1] : response.content

      // 修复多行字符串问题
      jsonContent = jsonContent.replace(/"\s*\n\s+"/g, " ")
      jsonContent = jsonContent.replace(/\n/g, " ").replace(/\s+/g, " ")

      console.log("尝试解析修复后的JSON...")
      sqlResult = JSON.parse(jsonContent)
    } catch (e) {
      console.error("JSON解析失败:", e)
      return NextResponse.json(
        {
          error: "SQL修复失败：大模型返回的内容格式不正确",
          details: e instanceof Error ? e.message : "未知错误",
          rawResponse: response.content,
          responsePreview: response.content.substring(0, 500)
        },
        { status: 500 }
      )
    }

    // 返回修复后的SQL数据
    return NextResponse.json({
      success: true,
      sql: sqlResult.sql,
      explanation: sqlResult.explanation,
      isValid: sqlResult.isValid ?? true,
      warnings: sqlResult.warnings || [],
      isFixed: true, // 标记这是修复后的SQL
    })
  } catch (error) {
    console.error("SQL修复错误:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "SQL修复失败" },
      { status: 500 }
    )
  }
}
