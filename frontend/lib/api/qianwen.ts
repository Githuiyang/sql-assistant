import { LLMProvider, LLMMessage, LLMOptions, LLMResponse, LLMStreamChunk } from "./base"

/**
 * 千问 API 提供商
 */
export class QianwenProvider implements LLMProvider {
  name = "Qianwen" as const
  baseURL = "https://dashscope.aliyuncs.com/compatible-mode/v1"

  async generate(messages: LLMMessage[], options: LLMOptions): Promise<LLMResponse> {
    const response = await fetch(`${this.baseURL}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${options.apiKey}`,
      },
      body: JSON.stringify({
        model: options.model || "qwen-plus",
        messages,
        temperature: options.temperature || 0.7,
        max_tokens: options.maxTokens || 4000,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error?.message || "千问 API 请求失败")
    }

    const data = await response.json()
    return {
      content: data.choices[0].message.content,
      usage: {
        promptTokens: data.usage?.prompt_tokens || 0,
        completionTokens: data.usage?.completion_tokens || 0,
        totalTokens: data.usage?.total_tokens || 0,
      },
    }
  }

  async *generateStream(
    messages: LLMMessage[],
    options: LLMOptions
  ): AsyncGenerator<LLMStreamChunk> {
    const response = await fetch(`${this.baseURL}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${options.apiKey}`,
      },
      body: JSON.stringify({
        model: options.model || "qwen-plus",
        messages,
        temperature: options.temperature || 0.7,
        max_tokens: options.maxTokens || 4000,
        stream: true,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error?.message || "千问 API 请求失败")
    }

    const reader = response.body?.getReader()
    if (!reader) {
      throw new Error("无法读取响应流")
    }

    const decoder = new TextDecoder()

    try {
      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value, { stream: true })
        const lines = chunk.split("\n").filter((line) => line.trim() !== "")

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6)
            if (data === "[DONE]") {
              yield { content: "", done: true }
              return
            }

            try {
              const parsed = JSON.parse(data)
              const content = parsed.choices[0]?.delta?.content
              if (content) {
                yield { content, done: false }
              }
            } catch (e) {
              // 忽略无效的 JSON
            }
          }
        }
      }
    } finally {
      reader.releaseLock()
    }
  }
}
