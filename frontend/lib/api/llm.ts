import { LLMProvider, LLMMessage, LLMOptions, LLMResponse, LLMStreamChunk } from "./base"
import { OpenAIProvider } from "./openai"
import { ZhipuProvider } from "./zhipu"
import { GeminiProvider } from "./gemini"
import { DeepSeekProvider } from "./deepseek"
import { QianwenProvider } from "./qianwen"
import { KimiProvider } from "./kimi"

/**
 * 支持的大模型提供商类型
 */
export type LLMProviderType = "openai" | "gemini" | "qianwen" | "kimi" | "zhipu" | "deepseek"

/**
 * 大模型配置
 */
export interface LLMConfig {
  provider: LLMProviderType
  apiKey: string
  model?: string
}

/**
 * 大模型服务管理器
 */
export class LLMService {
  private providers: Map<LLMProviderType, LLMProvider>

  constructor() {
    this.providers = new Map()
    this.registerProvider("openai", new OpenAIProvider())
    this.registerProvider("zhipu", new ZhipuProvider())
    this.registerProvider("gemini", new GeminiProvider())
    this.registerProvider("deepseek", new DeepSeekProvider())
    this.registerProvider("qianwen", new QianwenProvider())
    this.registerProvider("kimi", new KimiProvider())
  }

  /**
   * 注册提供商
   */
  private registerProvider(type: LLMProviderType, provider: LLMProvider) {
    this.providers.set(type, provider)
  }

  /**
   * 获取提供商实例
   */
  private getProvider(type: LLMProviderType): LLMProvider {
    const provider = this.providers.get(type)
    if (!provider) {
      throw new Error(`不支持的提供商: ${type}`)
    }
    return provider
  }

  /**
   * 生成文本
   */
  async generate(
    messages: LLMMessage[],
    config: LLMConfig
  ): Promise<LLMResponse> {
    const provider = this.getProvider(config.provider)
    return provider.generate(messages, {
      apiKey: config.apiKey,
      model: config.model,
      temperature: 0.7,
      maxTokens: 4000,
    })
  }

  /**
   * 流式生成文本
   */
  async *generateStream(
    messages: LLMMessage[],
    config: LLMConfig
  ): AsyncGenerator<LLMStreamChunk> {
    const provider = this.getProvider(config.provider)
    yield* provider.generateStream(messages, {
      apiKey: config.apiKey,
      model: config.model,
      temperature: 0.7,
      maxTokens: 4000,
    })
  }

  /**
   * 便捷方法：单个 prompt 生成
   */
  async generateFromPrompt(
    prompt: string,
    config: LLMConfig
  ): Promise<LLMResponse> {
    const messages: LLMMessage[] = [
      { role: "user", content: prompt }
    ]
    return this.generate(messages, config)
  }

  /**
   * 便捷方法：流式单个 prompt
   */
  async *generateFromPromptStream(
    prompt: string,
    config: LLMConfig
  ): AsyncGenerator<LLMStreamChunk> {
    const messages: LLMMessage[] = [
      { role: "user", content: prompt }
    ]
    yield* this.generateStream(messages, config)
  }
}

/**
 * 全局 LLM 服务实例
 */
let llmServiceInstance: LLMService | null = null

/**
 * 获取 LLM 服务实例（单例）
 */
export function getLLMService(): LLMService {
  if (!llmServiceInstance) {
    llmServiceInstance = new LLMService()
  }
  return llmServiceInstance
}

/**
 * 重置 LLM 服务实例
 */
export function resetLLMService() {
  llmServiceInstance = null
}
