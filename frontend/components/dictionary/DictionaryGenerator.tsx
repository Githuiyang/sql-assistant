"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2, Settings } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useRouter } from "next/navigation"
import { getDB } from "@/lib/db"
import { CheckCircle2 } from "lucide-react"

interface DictionaryGeneratorProps {
  sessionId: string
  sqlContents: Array<{ code: string; description: string }>
  csvFiles: Array<{ name: string; size: number }>
  onGenerated: (dictionary: any) => void
}

export function DictionaryGenerator({
  sessionId,
  sqlContents,
  csvFiles,
  onGenerated,
}: DictionaryGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)
  const [llmConfig, setLLMConfig] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    // Load LLM config from localStorage
    const savedConfig = localStorage.getItem("llmConfig")
    if (savedConfig) {
      try {
        setLLMConfig(JSON.parse(savedConfig))
      } catch (e) {
        console.error("Failed to load LLM config:", e)
      }
    }
  }, [])

  const handleGenerate = async () => {
    if (!llmConfig) {
      setError("请先配置大模型API密钥")
      return
    }

    setIsGenerating(true)
    setError(null)

    try {
      const response = await fetch("/api/dictionary/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          sqlContents,
          csvFiles,
          llmConfig: {
            provider: llmConfig.provider,
            apiKey: llmConfig.apiKey,
            model: llmConfig.model,
          },
        }),
      })

      const data = await response.json()

      if (data.success) {
        // 保存到IndexedDB
        const db = getDB()
        await db.init()
        await db.saveFieldDictionary({
          sessionId,
          tables: data.dictionary.tables,
          relations: data.dictionary.relations,
          isComplete: data.dictionary.isComplete ?? true,
        })

        // 更新项目信息（添加字段字典）
        const project = await db.getProject(sessionId)
        if (project) {
          await db.saveProject({
            ...project,
            fieldDictionary: data.dictionary,
          })
        }

        setSaved(true)
        setTimeout(() => setSaved(false), 3000)

        onGenerated(data.dictionary)
      } else {
        setError("生成失败: " + data.error)
      }
    } catch (err) {
      setError("生成失败: " + (err instanceof Error ? err.message : "未知错误"))
    } finally {
      setIsGenerating(false)
    }
  }

  if (!llmConfig) {
    return (
      <div className="space-y-6">
        <Card className="border-minimal bg-card">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Settings className="h-5 w-5 text-primary" />
              <div>
                <h3 className="text-sm font-semibold text-foreground">需要配置大模型</h3>
                <p className="text-xs text-muted-foreground font-mono mt-0.5">
                  LLM CONFIGURATION REQUIRED
                </p>
              </div>
            </div>

            <Alert className="border-warning/30 bg-warning/5 mb-4">
              <AlertDescription className="text-warning text-xs">
                生成字段字典需要先配置大模型API密钥
              </AlertDescription>
            </Alert>

            <Button
              onClick={() => router.push("/")}
              className="w-full bg-primary text-primary-foreground hover:scale-105"
            >
              返回首页配置
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* 生成按钮 */}
      <div className="flex justify-center">
        <Button
          onClick={handleGenerate}
          disabled={isGenerating}
          className={`px-12 py-3 text-sm ${
            isGenerating
              ? "bg-muted/30 text-muted-foreground cursor-not-allowed"
              : "bg-primary text-primary-foreground hover:scale-105 hover:shadow-lg"
          } transition-all duration-200`}
        >
          {isGenerating ? (
            <span className="flex items-center space-x-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>生成中...</span>
            </span>
          ) : (
            "生成字段字典"
          )}
        </Button>
      </div>

      {/* 错误提示 */}
      {error && (
        <Alert className="border-error/30 bg-error/5">
          <AlertDescription className="text-error text-sm">
            {error}
          </AlertDescription>
        </Alert>
      )}

      {/* 保存成功提示 */}
      {saved && (
        <Alert className="border-success/30 bg-success/5">
          <AlertDescription className="text-success text-sm flex items-center space-x-2">
            <CheckCircle2 className="h-4 w-4" />
            <span>字典已保存，刷新页面不会丢失</span>
          </AlertDescription>
        </Alert>
      )}

      {/* 说明卡片 */}
      <Card className="border-minimal bg-card">
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
              <p>基于导入的 SQL 和 CSV 自动分析表结构</p>
            </div>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
              <p>提取字段信息、数据类型和关联关系</p>
            </div>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
              <p>使用已配置的大模型：{llmConfig.provider} - {llmConfig.model}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
