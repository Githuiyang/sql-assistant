"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Loader2, Lightbulb, ArrowRight, TrendingUp, Users, ShoppingCart, AlertTriangle } from "lucide-react"
import { useRouter } from "next/navigation"

interface QuerySuggestion {
  id: number
  title: string
  description: string
  query: string
  category: string
  tables: string[]
  businessValue: string
}

interface QuerySuggestionsProps {
  sessionId: string
  dictionary: any
  llmConfig: any
}

export function QuerySuggestions({ sessionId, dictionary, llmConfig }: QuerySuggestionsProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [suggestions, setSuggestions] = useState<QuerySuggestion[]>([])
  const [summary, setSummary] = useState<string>("")
  const [error, setError] = useState<string | null>(null)
  const [showAll, setShowAll] = useState(false)

  const generateSuggestions = async () => {
    if (!llmConfig) {
      setError("请先配置大模型API密钥")
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/suggestions/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dictionary,
          llmConfig: {
            provider: llmConfig.provider,
            apiKey: llmConfig.apiKey,
            model: llmConfig.model,
          },
        }),
      })

      const data = await response.json()

      if (data.success) {
        setSuggestions(data.suggestions)
        setSummary(data.summary)
      } else {
        setError(data.error || "生成失败")
      }
    } catch (err) {
      setError("生成失败: " + (err instanceof Error ? err.message : "未知错误"))
    } finally {
      setLoading(false)
    }
  }

  const handleUseSuggestion = (query: string) => {
    // 将查询需求保存到localStorage，然后跳转到生成页面
    localStorage.setItem("pendingQuery", query)
    router.push("/generate")
  }

  const getCategoryIcon = (category: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      "统计分析": <TrendingUp className="h-4 w-4" />,
      "趋势分析": <TrendingUp className="h-4 w-4" />,
      "用户画像": <Users className="h-4 w-4" />,
      "异常检测": <AlertTriangle className="h-4 w-4" />,
      "排名榜单": <ShoppingCart className="h-4 w-4" />,
    }
    return iconMap[category] || <Lightbulb className="h-4 w-4" />
  }

  const getCategoryColor = (category: string) => {
    const colorMap: Record<string, string> = {
      "统计分析": "bg-primary/20 text-primary border-primary/30",
      "趋势分析": "bg-success/20 text-success border-success/30",
      "用户画像": "bg-info/20 text-info border-info/30",
      "异常检测": "bg-warning/20 text-warning border-warning/30",
      "排名榜单": "bg-purple-20 text-purple border-purple/30",
      "基础查询": "bg-muted/20 text-muted-foreground border-muted/30",
      "对比分析": "bg-blue-20 text-blue border-blue/30",
      "关联分析": "bg-indigo-20 text-indigo border-indigo/30",
      "漏斗分析": "bg-pink-20 text-pink border-pink/30",
      "数据完整性": "bg-orange/20 text-orange border-orange/30",
    }
    return colorMap[category] || "bg-muted/20 text-muted-foreground border-muted/30"
  }

  if (suggestions.length === 0 && !loading) {
    return (
      <Card className="border-minimal bg-card">
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Lightbulb className="h-6 w-6 text-primary" />
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-2">
                想要查询灵感？
              </h3>
              <p className="text-xs text-muted-foreground max-w-md mx-auto leading-relaxed">
                基于您的字段字典，AI可以智能分析并生成10个实用的查询场景建议，帮助您快速上手数据分析
              </p>
            </div>
            <Button
              onClick={generateSuggestions}
              className="mx-auto bg-primary text-primary-foreground hover:scale-105 transition-all"
            >
              <Lightbulb className="h-4 w-4 mr-2" />
              生成查询建议
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {/* 总体分析 */}
      {summary && (
        <Alert className="border-info/30 bg-info/5">
          <AlertDescription className="text-xs text-muted-foreground">
            <div className="flex items-start space-x-2">
              <Lightbulb className="h-4 w-4 text-info mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-info font-medium mb-1">数据库分析总结</p>
                <p>{summary}</p>
              </div>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* 错误提示 */}
      {error && (
        <Alert className="border-error/30 bg-error/5">
          <AlertDescription className="text-error text-xs">
            {error}
          </AlertDescription>
        </Alert>
      )}

      {/* 建议列表 */}
      <div className="space-y-3">
        {(showAll ? suggestions : suggestions.slice(0, 3)).map((suggestion) => (
          <Card
            key={suggestion.id}
            className="border-minimal bg-card hover:border-primary/30 transition-all"
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  {/* 标题和分类 */}
                  <div className="flex items-center space-x-3 mb-2">
                    <h4 className="text-sm font-semibold text-foreground">
                      {suggestion.id}. {suggestion.title}
                    </h4>
                    <Badge className={`text-xs ${getCategoryColor(suggestion.category)}`}>
                      <div className="flex items-center space-x-1">
                        {getCategoryIcon(suggestion.category)}
                        <span>{suggestion.category}</span>
                      </div>
                    </Badge>
                  </div>

                  {/* 描述 */}
                  <p className="text-xs text-muted-foreground mb-2 leading-relaxed">
                    {suggestion.description}
                  </p>

                  {/* 涉及的表 */}
                  <div className="flex items-center space-x-2 mb-3">
                    <span className="text-[10px] text-muted-foreground">涉及表:</span>
                    <div className="flex items-center space-x-1">
                      {suggestion.tables.map((table) => (
                        <Badge
                          key={table}
                          variant="outline"
                          className="text-[10px] border-minimal"
                        >
                          {table}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* 业务价值 */}
                  <div className="flex items-start space-x-2 p-2 bg-muted/20 rounded">
                    <TrendingUp className="h-3 w-3 text-primary mt-0.5 flex-shrink-0" />
                    <p className="text-[10px] text-muted-foreground leading-relaxed">
                      <span className="font-medium text-primary">业务价值:</span>{" "}
                      {suggestion.businessValue}
                    </p>
                  </div>
                </div>

                {/* 使用按钮 */}
                <Button
                  size="sm"
                  onClick={() => handleUseSuggestion(suggestion.query)}
                  className="ml-4 bg-success text-success-foreground hover:scale-105 transition-all"
                >
                  使用
                  <ArrowRight className="h-3 w-3 ml-1" />
                </Button>
              </div>

              {/* 查询需求预览 */}
              <div className="mt-3 pt-3 border-minimal border-t">
                <div className="text-[10px] text-muted-foreground mb-1">查询需求:</div>
                <p className="text-xs text-foreground font-mono bg-background p-2 rounded border-minimal">
                  {suggestion.query}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 加载状态 */}
      {loading && (
        <Card className="border-minimal bg-card">
          <CardContent className="p-12 text-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
            <p className="text-sm text-muted-foreground">正在分析字段字典并生成查询建议...</p>
          </CardContent>
        </Card>
      )}

      {/* 展开/收起按钮 */}
      {!loading && suggestions.length > 3 && (
        <div className="text-center">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowAll(!showAll)}
            className="border-dashed border-2 hover:border-primary/50 transition-all"
          >
            {showAll ? "收起建议" : `查看全部 ${suggestions.length} 个建议`}
          </Button>
        </div>
      )}

      {/* 重新生成按钮 */}
      {!loading && suggestions.length > 0 && (
        <div className="text-center">
          <Button
            size="sm"
            variant="ghost"
            onClick={generateSuggestions}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            重新生成建议
          </Button>
        </div>
      )}
    </div>
  )
}
