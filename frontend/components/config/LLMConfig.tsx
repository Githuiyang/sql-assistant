"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Settings, CheckCircle2, XCircle, Loader2 } from "lucide-react"
import { getLLMService } from "@/lib/api/llm"
import { ZhipuRecommendation } from "@/components/config/ZhipuRecommendation"

export interface LLMProviderConfig {
  provider: "openai" | "gemini" | "qianwen" | "kimi" | "zhipu" | "deepseek"
  name: string
  models: string[]
  recommended: string
}

const PROVIDERS: LLMProviderConfig[] = [
  {
    provider: "openai",
    name: "ChatGPT (OpenAI)",
    models: ["gpt-4", "gpt-4-turbo", "gpt-3.5-turbo"],
    recommended: "gpt-4"
  },
  {
    provider: "deepseek",
    name: "DeepSeek",
    models: ["deepseek-chat", "deepseek-coder"],
    recommended: "deepseek-chat"
  },
  {
    provider: "qianwen",
    name: "千问 (阿里云)",
    models: ["qwen-turbo", "qwen-plus", "qwen-max"],
    recommended: "qwen-plus"
  },
  {
    provider: "kimi",
    name: "Kimi (月之暗面)",
    models: ["moonshot-v1-8k", "moonshot-v1-32k", "moonshot-v1-128k"],
    recommended: "moonshot-v1-8k"
  },
  {
    provider: "gemini",
    name: "Gemini (Google)",
    models: ["gemini-pro", "gemini-1.5-pro"],
    recommended: "gemini-pro"
  },
  {
    provider: "zhipu",
    name: "智谱 (清华)",
    models: ["glm-4", "glm-3-turbo"],
    recommended: "glm-4"
  }
]

export interface LLMConfigData {
  provider: string
  apiKey: string
  model: string
}

interface LLMConfigProps {
  onConfigChange?: (config: LLMConfigData | null) => void
  showTitle?: boolean
}

export function LLMConfig({ onConfigChange, showTitle = true }: LLMConfigProps) {
  const [selectedProvider, setSelectedProvider] = useState<string>("openai")
  const [apiKey, setApiKey] = useState("")
  const [selectedModel, setSelectedModel] = useState("gpt-4")
  const [isValidating, setIsValidating] = useState(false)
  const [validationResult, setValidationResult] = useState<{
    success: boolean
    message: string
  } | null>(null)

  // Load saved config on mount
  useEffect(() => {
    const savedConfig = localStorage.getItem("llmConfig")
    if (savedConfig) {
      try {
        const config = JSON.parse(savedConfig)
        setSelectedProvider(config.provider)
        setApiKey(config.apiKey)
        setSelectedModel(config.model)
        if (onConfigChange) {
          onConfigChange(config)
        }
      } catch (e) {
        console.error("Failed to load saved config:", e)
      }
    }
  }, [onConfigChange])

  const provider = PROVIDERS.find(p => p.provider === selectedProvider)

  // Update model when provider changes
  useEffect(() => {
    if (provider) {
      setSelectedModel(provider.recommended)
    }
  }, [selectedProvider, provider])

  const handleValidate = async () => {
    if (!apiKey) {
      setValidationResult({
        success: false,
        message: "请输入 API Key"
      })
      return
    }

    setIsValidating(true)
    setValidationResult(null)

    try {
      const llmService = getLLMService()
      // Send a simple test request
      const response = await llmService.generateFromPrompt(
        "Hello",
        {
          provider: selectedProvider as any,
          apiKey,
          model: selectedModel
        }
      )

      if (response.content) {
        setValidationResult({
          success: true,
          message: "连接成功！API 密钥有效"
        })

        // Save to localStorage
        const config: LLMConfigData = {
          provider: selectedProvider,
          apiKey,
          model: selectedModel
        }
        localStorage.setItem("llmConfig", JSON.stringify(config))

        if (onConfigChange) {
          onConfigChange(config)
        }
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "未知错误"
      setValidationResult({
        success: false,
        message: `验证失败: ${errorMessage}`
      })
    } finally {
      setIsValidating(false)
    }
  }

  const handleSave = () => {
    if (!apiKey) {
      setValidationResult({
        success: false,
        message: "请输入 API Key"
      })
      return
    }

    const config: LLMConfigData = {
      provider: selectedProvider,
      apiKey,
      model: selectedModel
    }
    localStorage.setItem("llmConfig", JSON.stringify(config))

    if (onConfigChange) {
      onConfigChange(config)
    }

    setValidationResult({
      success: true,
      message: "配置已保存"
    })
  }

  return (
    <div className="space-y-4">
      {/* 智谱AI推荐卡片 */}
      <ZhipuRecommendation />

      {/* 配置卡片 */}
      <Card className="border-minimal bg-card">
        <CardContent className="p-6">
          {showTitle && (
            <div className="flex items-center space-x-3 mb-6">
              <Settings className="h-5 w-5 text-primary" />
              <div>
                <h3 className="text-sm font-semibold text-foreground">大模型配置</h3>
                <p className="text-xs text-muted-foreground font-mono mt-0.5">
                  LLM CONFIGURATION
                </p>
              </div>
            </div>
          )}

          <div className="space-y-4">
            {/* Provider Selection */}
            <div>
            <Label className="text-xs text-muted-foreground mb-2 block">
              选择大模型提供商
            </Label>
            <div className="grid grid-cols-2 gap-2">
              {PROVIDERS.map((p) => (
                <button
                  key={p.provider}
                  onClick={() => setSelectedProvider(p.provider)}
                  className={`px-3 py-2 text-xs rounded border transition-all ${
                    selectedProvider === p.provider
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-transparent text-muted-foreground border-minimal hover:border-primary/50"
                  }`}
                >
                  {p.name}
                </button>
              ))}
            </div>
          </div>

          {/* Model Selection */}
          {provider && (
            <div>
              <Label className="text-xs text-muted-foreground mb-2 block">
                模型版本
              </Label>
              <div className="space-y-2">
                {provider.models.map((model) => (
                  <button
                    key={model}
                    onClick={() => setSelectedModel(model)}
                    className={`w-full px-3 py-2 text-xs rounded border text-left transition-all flex items-center justify-between ${
                      selectedModel === model
                        ? "bg-primary/10 text-primary border-primary"
                        : "bg-transparent text-muted-foreground border-minimal hover:border-primary/50"
                    }`}
                  >
                    <span className="font-mono">{model}</span>
                    {model === provider.recommended && (
                      <span className="text-[10px] px-2 py-0.5 bg-primary/20 text-primary rounded">
                        推荐
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* API Key Input */}
          <div>
            <Label className="text-xs text-muted-foreground mb-2 block">
              API 密钥
            </Label>
            <Input
              type="password"
              placeholder="输入您的 API Key..."
              value={apiKey}
              onChange={(e) => {
                setApiKey(e.target.value)
                setValidationResult(null)
              }}
              className="font-mono text-xs"
            />
          </div>

          {/* Validation Result */}
          {validationResult && (
            <Alert className={`border-minimal ${
              validationResult.success
                ? "border-success/30 bg-success/5"
                : "border-error/30 bg-error/5"
            }`}>
              <AlertDescription className={`text-xs flex items-center space-x-2 ${
                validationResult.success ? "text-success" : "text-error"
              }`}>
                {validationResult.success ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : (
                  <XCircle className="h-4 w-4" />
                )}
                <span>{validationResult.message}</span>
              </AlertDescription>
            </Alert>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-2">
            <Button
              onClick={handleValidate}
              disabled={!apiKey || isValidating}
              className={`flex-1 text-xs ${
                !apiKey || isValidating
                  ? "bg-muted/30 text-muted-foreground cursor-not-allowed"
                  : "bg-primary text-primary-foreground hover:scale-105"
              } transition-all`}
            >
              {isValidating ? (
                <span className="flex items-center space-x-2">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  <span>验证中...</span>
                </span>
              ) : (
                "验证连接"
              )}
            </Button>

            <Button
              onClick={handleSave}
              disabled={!apiKey}
              variant="outline"
              className="flex-1 text-xs border-minimal hover:scale-105 transition-all"
            >
              保存配置
            </Button>
          </div>

          {/* Security Notice */}
          <div className="pt-3 border-minimal border-t">
            <div className="flex items-center space-x-2">
              <div className="h-px bg-primary/20 flex-1"></div>
              <span className="text-[10px] text-muted-foreground font-mono">
                ENCRYPTED · LOCAL STORAGE
              </span>
              <div className="h-px bg-primary/20 flex-1"></div>
            </div>
            <p className="text-[10px] text-muted-foreground mt-2 text-center leading-relaxed">
              API 密钥将加密存储在本地浏览器中，不会上传到任何服务器
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
    </div>
  )
}
