"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Sparkles, Code, Copy, Download, CheckCircle2, AlertTriangle, RefreshCw } from "lucide-react"
import { getDB } from "@/lib/db"
import { getLLMService } from "@/lib/api/llm"

interface SQLGeneratorProps {
  sessionId: string
  initialQuery?: string | null
}

interface SQLResult {
  sql: string
  explanation: string
  isValid: boolean
  warnings: string[]
  isFixed?: boolean
}

export function SQLGenerator({ sessionId, initialQuery }: SQLGeneratorProps) {
  const [naturalLanguage, setNaturalLanguage] = useState("")
  const [generating, setGenerating] = useState(false)
  const [result, setResult] = useState<SQLResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  // 错误反馈相关状态
  const [showErrorFeedback, setShowErrorFeedback] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [fixing, setFixing] = useState(false)

  // 初始化查询
  useEffect(() => {
    if (initialQuery) {
      setNaturalLanguage(initialQuery)
    }
  }, [initialQuery])

  // 示例提示
  const examples = [
    "查询所有订单金额大于1000的用户信息",
    "统计每个月的订单总数和总金额",
    "查找购买过产品A但未购买产品B的用户",
    "查询最近7天注册的用户及其订单数量"
  ]

  const handleGenerate = async () => {
    if (!naturalLanguage.trim()) {
      setError("请输入您的需求")
      return
    }

    setGenerating(true)
    setError(null)
    setResult(null)

    try {
      // 获取字段字典
      const db = getDB()
      await db.init()
      const fieldDictionary = await db.getCompleteFieldDictionary(sessionId)

      if (!fieldDictionary) {
        throw new Error("未找到字段字典，请先生成字段字典")
      }

      // 获取LLM配置
      const llmConfigStr = localStorage.getItem("llmConfig")
      if (!llmConfigStr) {
        throw new Error("未配置大模型，请先配置")
      }

      const llmConfig = JSON.parse(llmConfigStr)

      // 调用生成API
      const response = await fetch("/api/generate/sql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sessionId,
          naturalLanguage,
          fieldDictionary,
          llmConfig,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        // 构建友好的错误信息
        let errorMsg = data.error || "生成失败"
        if (data.suggestions && data.suggestions.length > 0) {
          errorMsg += "\n\n建议：\n" + data.suggestions.map((s: string, i: number) => `${i + 1}. ${s}`).join("\n")
        }
        throw new Error(errorMsg)
      }

      // 检查SQL是否为null（大模型无法生成的情况）
      if (data.sql === null || data.sql === undefined) {
        setResult({
          sql: "",
          explanation: data.explanation || "无法生成SQL",
          isValid: false,
          warnings: data.warnings || [],
        })
      } else {
        setResult({
          sql: data.sql,
          explanation: data.explanation,
          isValid: data.isValid ?? true,
          warnings: data.warnings || [],
        })

        // 只在成功时保存到历史记录
        await db.saveSQLHistory({
          sessionId,
          naturalLanguage,
          generatedSQL: data.sql,
          isValid: data.isValid ?? true,
          validationMessage: data.explanation,
          llmProvider: llmConfig.provider,
          llmModel: llmConfig.model,
        })
      }
    } catch (err) {
      console.error("生成失败:", err)
      setError(err instanceof Error ? err.message : "生成失败")
    } finally {
      setGenerating(false)
    }
  }

  const handleCopy = async () => {
    if (!result?.sql) return

    try {
      await navigator.clipboard.writeText(result.sql)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("复制失败:", err)
    }
  }

  const handleDownload = () => {
    if (!result?.sql) return

    const blob = new Blob([result.sql], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `generated-sql-${Date.now()}.sql`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleFixError = async () => {
    if (!errorMessage.trim() || !result?.sql) {
      setError("请输入错误信息")
      return
    }

    setFixing(true)
    setError(null)

    try {
      // 获取字段字典
      const db = getDB()
      await db.init()
      const fieldDictionary = await db.getCompleteFieldDictionary(sessionId)

      if (!fieldDictionary) {
        throw new Error("未找到字段字典")
      }

      // 获取LLM配置
      const llmConfigStr = localStorage.getItem("llmConfig")
      if (!llmConfigStr) {
        throw new Error("未配置大模型")
      }

      const llmConfig = JSON.parse(llmConfigStr)

      // 调用修复API
      const response = await fetch("/api/generate/retry", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sessionId,
          naturalLanguage,
          originalSQL: result.sql,
          errorMessage,
          fieldDictionary,
          llmConfig,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "修复失败")
      }

      // 检查是否修复成功
      if (data.sql === null || data.sql === undefined) {
        // 无法修复
        setResult({
          sql: result.sql, // 保留原SQL
          explanation: data.explanation || "无法修复SQL",
          isValid: false,
          warnings: data.warnings || [],
          isFixed: false,
        })
        setShowErrorFeedback(false)
      } else {
        // 修复成功
        setResult({
          sql: data.sql,
          explanation: data.explanation,
          isValid: data.isValid ?? true,
          warnings: data.warnings || [],
          isFixed: true,
        })

        // 保存修复后的SQL到历史
        await db.saveSQLHistory({
          sessionId,
          naturalLanguage: `${naturalLanguage} (已修复)`,
          generatedSQL: data.sql,
          isValid: data.isValid ?? true,
          validationMessage: data.explanation,
          llmProvider: llmConfig.provider,
          llmModel: llmConfig.model,
        })

        setShowErrorFeedback(false)
        setErrorMessage("")
      }
    } catch (err) {
      console.error("修复失败:", err)
      setError(err instanceof Error ? err.message : "修复失败")
    } finally {
      setFixing(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* 输入区域 */}
      <Card className="border-minimal bg-card">
        <CardContent className="p-6">
          <div className="mb-4">
            <div className="flex items-center space-x-2 mb-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-semibold text-foreground">描述您的需求</h3>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              用自然语言描述您想要查询的数据，系统将基于字段字典为您生成SQL查询语句
            </p>
          </div>

          <Textarea
            value={naturalLanguage}
            onChange={(e) => setNaturalLanguage(e.target.value)}
            placeholder="例如：查询所有订单金额大于1000的用户信息"
            className="min-h-[120px] text-sm bg-background border-minimal resize-none mb-4"
            disabled={generating}
          />

          {/* 示例提示 */}
          <div className="mb-4">
            <p className="text-xs text-muted-foreground mb-2">💡 示例：</p>
            <div className="flex flex-wrap gap-2">
              {examples.map((example, index) => (
                <button
                  key={index}
                  onClick={() => setNaturalLanguage(example)}
                  className="text-[10px] px-2 py-1 bg-muted/30 hover:bg-muted/50 text-muted-foreground hover:text-foreground rounded-sm transition-all border-minimal"
                  disabled={generating}
                >
                  {example}
                </button>
              ))}
            </div>
          </div>

          <Button
            onClick={handleGenerate}
            disabled={generating || !naturalLanguage.trim()}
            className="w-full bg-primary text-primary-foreground hover:scale-105 transition-all"
          >
            {generating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                生成中...
              </>
            ) : (
              <>
                <Code className="h-4 w-4 mr-2" />
                生成SQL
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* 错误提示 */}
      {error && (
        <Alert className="border-error/30 bg-error/5">
          <AlertDescription className="text-error text-xs whitespace-pre-line">
            {error}
          </AlertDescription>
        </Alert>
      )}

      {/* 结果展示 */}
      {result && (
        <Card className="border-minimal bg-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                {result.isFixed ? (
                  <RefreshCw className="h-4 w-4 text-primary" />
                ) : result.isValid ? (
                  <CheckCircle2 className="h-4 w-4 text-success" />
                ) : (
                  <AlertTriangle className="h-4 w-4 text-warning" />
                )}
                <h3 className="text-sm font-semibold text-foreground">
                  {result.isFixed ? "修复后的SQL" : result.isValid ? "生成的SQL" : "无法生成SQL"}
                </h3>
              </div>

              {result.sql && (
                <div className="flex items-center space-x-2">
                  <Button
                    onClick={handleCopy}
                    variant="ghost"
                    size="sm"
                    className="h-8 px-3 text-xs hover:bg-primary/10"
                  >
                    {copied ? (
                      <>
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        已复制
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3 mr-1" />
                        复制
                      </>
                    )}
                  </Button>

                  <Button
                    onClick={handleDownload}
                    variant="ghost"
                    size="sm"
                    className="h-8 px-3 text-xs hover:bg-primary/10"
                  >
                    <Download className="h-3 w-3 mr-1" />
                    下载
                  </Button>

                  {/* 反馈错误按钮 */}
                  <Button
                    onClick={() => setShowErrorFeedback(!showErrorFeedback)}
                    variant="ghost"
                    size="sm"
                    className="h-8 px-3 text-xs hover:bg-warning/10 text-warning"
                  >
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    反馈错误
                  </Button>
                </div>
              )}
            </div>

            {/* SQL代码 */}
            {result.sql ? (
              <div className="mb-4 p-4 bg-muted/20 rounded border-minimal">
                <pre className="text-xs font-mono text-foreground overflow-x-auto whitespace-pre-wrap">
                  {result.sql}
                </pre>
              </div>
            ) : (
              <Alert className="border-warning/30 bg-warning/5 mb-4">
                <AlertDescription className="text-warning text-xs">
                  <div className="flex items-start space-x-2">
                    <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold mb-2">无法生成SQL查询</p>
                      <p className="leading-relaxed">{result.explanation}</p>
                    </div>
                  </div>
                </AlertDescription>
              </Alert>
            )}

            {/* 说明 */}
            {result.sql && (
              <div className={`mb-4 p-4 rounded border-minimal ${result.isFixed ? "bg-primary/10" : "bg-primary/5"}`}>
                <p className="text-xs text-muted-foreground mb-1">
                  {result.isFixed ? "🔧 修复说明：" : "📝 说明："}
                </p>
                <p className="text-sm text-foreground leading-relaxed">
                  {result.explanation}
                </p>
              </div>
            )}

            {/* 错误反馈区域 */}
            {showErrorFeedback && result.sql && (
              <div className="mb-4 p-4 bg-warning/5 rounded border-minimal border-warning/30">
                <div className="flex items-center space-x-2 mb-3">
                  <AlertTriangle className="h-4 w-4 text-warning" />
                  <h4 className="text-sm font-semibold text-foreground">反馈SQL执行错误</h4>
                </div>
                <p className="text-xs text-muted-foreground mb-3">
                  如果SQL执行报错，请将完整的错误信息粘贴到下方，系统将尝试自动修复
                </p>
                <Textarea
                  value={errorMessage}
                  onChange={(e) => setErrorMessage(e.target.value)}
                  placeholder="粘贴完整的错误信息...&#10;&#10;例如：&#10;Error: Column 'lower_dt' does not exist. Did you mean one of the following? [dt, end_dt, start_dt]"
                  className="text-xs bg-background border-minimal mb-3 min-h-[100px]"
                  disabled={fixing}
                />
                <div className="flex items-center space-x-2">
                  <Button
                    onClick={handleFixError}
                    disabled={fixing || !errorMessage.trim()}
                    className="text-xs bg-warning text-warning-foreground hover:scale-105"
                  >
                    {fixing ? (
                      <>
                        <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                        修复中...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="h-3 w-3 mr-1" />
                        修复SQL
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={() => {
                      setShowErrorFeedback(false)
                      setErrorMessage("")
                    }}
                    variant="ghost"
                    size="sm"
                    className="text-xs"
                    disabled={fixing}
                  >
                    取消
                  </Button>
                </div>
              </div>
            )}

            {/* 警告 */}
            {result.warnings.length > 0 && (
              <Alert className="border-warning/30 bg-warning/5">
                <AlertDescription className="text-warning text-xs">
                  <div className="flex items-start space-x-2">
                    <AlertTriangle className="h-3 w-3 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold mb-1">注意事项：</p>
                      <ul className="space-y-1">
                        {result.warnings.map((warning, index) => (
                          <li key={index}>• {warning}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
