import { LLMProvider, LLMMessage, LLMOptions, LLMResponse, LLMStreamChunk } from "./base"

/**
 * Gemini API 提供商
 */
export class GeminiProvider implements LLMProvider {
  name = "Gemini" as const
  baseURL = "https://generativelanguage.googleapis.com/v1beta"

  async generate(messages: LLMMessage[], options: LLMOptions): Promise<LLMResponse> {
    const model = options.model || "gemini-pro"

    // Convert OpenAI format to Gemini format
    const contents = messages
      .filter(m => m.role !== "system")
      .map(m => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }]
      }))

    const systemInstruction = messages.find(m => m.role === "system")?.content

    const url = new URL(`${this.baseURL}/models/${model}:generateContent`)
    url.searchParams.append("key", options.apiKey!)

    const requestBody: any = { contents }
    if (systemInstruction) {
      requestBody.systemInstruction = { parts: [{ text: systemInstruction }] }
    }

    const response = await fetch(url.toString(), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error?.message || "Gemini API 请求失败")
    }

    const data = await response.json()
    const content = data.candidates?.[0]?.content?.parts?.[0]?.text || ""

    return {
      content,
      usage: {
        promptTokens: data.usageMetadata?.promptTokenCount || 0,
        completionTokens: data.usageMetadata?.candidatesTokenCount || 0,
        totalTokens: data.usageMetadata?.totalTokenCount || 0,
      },
    }
  }

  async *generateStream(
    messages: LLMMessage[],
    options: LLMOptions
  ): AsyncGenerator<LLMStreamChunk> {
    const model = options.model || "gemini-pro"

    const contents = messages
      .filter(m => m.role !== "system")
      .map(m => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }]
      }))

    const systemInstruction = messages.find(m => m.role === "system")?.content

    const url = new URL(`${this.baseURL}/models/${model}:streamGenerateContent`)
    url.searchParams.append("key", options.apiKey!)

    const requestBody: any = { contents }
    if (systemInstruction) {
      requestBody.systemInstruction = { parts: [{ text: systemInstruction }] }
    }

    const response = await fetch(url.toString(), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error?.message || "Gemini API 请求失败")
    }

    const reader = response.body?.getReader()
    if (!reader) {
      throw new Error("无法读取响应流")
    }

    const decoder = new TextDecoder()

    try {
      let buffer = ""

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split("\n")
        buffer = lines.pop() || ""

        for (const line of lines) {
          if (line.trim().startsWith("data:")) {
            const jsonStr = line.trim().slice(5).trim()
            if (jsonStr === "[DONE]") continue

            try {
              const parsed = JSON.parse(jsonStr)
              const content = parsed.candidates?.[0]?.content?.parts?.[0]?.text
              if (content) {
                yield { content, done: false }
              }
            } catch (e) {
              // Ignore invalid JSON
            }
          }
        }
      }

      yield { content: "", done: true }
    } finally {
      reader.releaseLock()
    }
  }
}
