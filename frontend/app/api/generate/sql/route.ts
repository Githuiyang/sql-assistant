import { NextRequest, NextResponse } from "next/server"
import { getLLMService } from "@/lib/api/llm"
import { buildSQLGenerationPrompt } from "@/lib/prompts/sqlgen"

export async function POST(request: NextRequest) {
  try {
    const { sessionId, naturalLanguage, fieldDictionary, llmConfig } = await request.json()

    // 验证输入
    if (!sessionId || !naturalLanguage || !fieldDictionary || !llmConfig) {
      return NextResponse.json(
        { error: "缺少必要参数" },
        { status: 400 }
      )
    }

    // 构建 Prompt
    const prompt = buildSQLGenerationPrompt(naturalLanguage, fieldDictionary)

    // 调用大模型生成SQL
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
    let sqlResult
    try {
      const jsonMatch = response.content.match(/```json\n([\s\S]*?)\n```/)
      let jsonContent = jsonMatch ? jsonMatch[1] : response.content

      // 修复大模型返回的多行字符串问题
      // 1. 将类似 "sql": "SELECT ... "\n         "FROM ..." 转换为单行字符串
      jsonContent = jsonContent.replace(/"\s*\n\s+"/g, " ")

      // 2. 移除JSON中的换行符（除了在字符串内部）
      jsonContent = jsonContent.replace(/\n/g, " ").replace(/\s+/g, " ")

      console.log("尝试解析JSON...")
      console.log("JSON内容预览:", jsonContent.substring(0, 200))

      sqlResult = JSON.parse(jsonContent)
    } catch (e) {
      // 如果解析失败，返回详细的错误信息和原始内容
      console.error("JSON解析失败:", e)
      console.error("原始响应内容:", response.content)

      // 尝试提供更友好的错误信息
      let errorMessage = "SQL生成失败：大模型返回的内容格式不正确"
      let suggestions: string[] = []

      // 检查响应内容中是否包含无法生成SQL的提示
      const lowerContent = response.content.toLowerCase()
      if (lowerContent.includes("无法") || lowerContent.includes("不能") || lowerContent.includes("不足") ||
          lowerContent.includes("缺少") || lowerContent.includes("没有") || lowerContent.includes("不存在")) {
        errorMessage = "SQL生成失败：字段字典可能缺少必要的表或字段"
        suggestions.push("请检查您的需求是否与导入的SQL相关")
        suggestions.push("建议上传包含相关表和字段的SQL代码")
        suggestions.push("您可以重新生成字段字典或补充更多SQL示例")
      } else {
        suggestions.push("请重试，或尝试更换不同的表述方式")
        suggestions.push("如果问题持续，可能是大模型返回格式异常")
      }

      return NextResponse.json(
        {
          error: errorMessage,
          details: e instanceof Error ? e.message : "未知错误",
          rawResponse: response.content,
          responsePreview: response.content.substring(0, 500),
          suggestions: suggestions.length > 0 ? suggestions : undefined
        },
        { status: 500 }
      )
    }

    // 返回生成的SQL数据，不保存到数据库
    // 数据保存由前端在浏览器端处理
    return NextResponse.json({
      success: true,
      sql: sqlResult.sql,
      explanation: sqlResult.explanation,
      isValid: sqlResult.isValid ?? true,
      warnings: sqlResult.warnings || [],
    })
  } catch (error) {
    console.error("SQL生成错误:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "SQL生成失败" },
      { status: 500 }
    )
  }
}
