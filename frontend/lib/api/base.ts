/**
 * 大模型提供商统一接口
 */

export interface LLMMessage {
  role: "system" | "user" | "assistant"
  content: string
}

export interface LLMOptions {
  apiKey: string
  model?: string
  temperature?: number
  maxTokens?: number
}

export interface LLMResponse {
  content: string
  usage?: {
    promptTokens: number
    completionTokens: number
    totalTokens: number
  }
}

export interface LLMStreamChunk {
  content: string
  done: boolean
}

/**
 * 大模型提供商接口
 */
export interface LLMProvider {
  name: string
  generate(messages: LLMMessage[], options: LLMOptions): Promise<LLMResponse>
  generateStream(messages: LLMMessage[], options: LLMOptions): AsyncGenerator<LLMStreamChunk>
}
