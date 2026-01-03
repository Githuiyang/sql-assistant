"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/layout/Header"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { History, Trash2, ChevronDown, ChevronUp, Database, Code, FileText, Clock, Settings, Bug } from "lucide-react"
import { getDB } from "@/lib/db"
import { formatDistanceToNow } from "date-fns"
import { zhCN } from "date-fns/locale"
import { DatabaseDebug } from "@/components/debug/DatabaseDebug"

interface Project {
  id: number
  sessionId: string
  sqlContents: Array<{ code: string; description: string }>
  csvFiles: Array<{ name: string; size: number }>
  llmConfig: {
    provider: string
    model: string
  }
  fieldDictionary?: any
  createdAt: string
  updatedAt: string
}

interface SQLHistory {
  id: number
  sessionId: string
  naturalLanguage: string
  generatedSQL: string
  isValid: boolean
  llmProvider: string
  llmModel?: string
  generatedAt: string
}

export default function HistoryPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [sqlHistories, setSqlHistories] = useState<Record<string, SQLHistory[]>>({})
  const [loading, setLoading] = useState(true)
  const [expandedProjects, setExpandedProjects] = useState<Set<number>>(new Set())
  const [cleanupInfo, setCleanupInfo] = useState<string | null>(null)

  useEffect(() => {
    loadData()
    checkAndCleanup()
  }, [])

  const loadData = async () => {
    try {
      const db = getDB()
      await db.init()

      const allProjects = await db.getAllProjects()
      setProjects(allProjects.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()))

      // 加载每个项目的SQL历史
      const histories: Record<string, SQLHistory[]> = {}
      for (const project of allProjects) {
        const history = await db.getSQLHistory(project.sessionId)
        histories[project.sessionId] = history.sort((a, b) => new Date(b.generatedAt).getTime() - new Date(a.generatedAt).getTime())
      }
      setSqlHistories(histories)
    } catch (error) {
      console.error("Failed to load history:", error)
    } finally {
      setLoading(false)
    }
  }

  const checkAndCleanup = async () => {
    try {
      const db = getDB()
      await db.init()

      const lastCleanup = await db.getLastCleanupTime()
      const now = new Date()
      const hoursSinceLastCleanup = lastCleanup
        ? (now.getTime() - lastCleanup.getTime()) / (1000 * 60 * 60)
        : 25 // 如果从未清理，设为超过24小时

      if (hoursSinceLastCleanup >= 24) {
        const deletedCount = await db.cleanOldProjects()
        await db.saveLastCleanupTime()

        if (deletedCount > 0) {
          setCleanupInfo(`已自动清理 ${deletedCount} 个超过7天的项目`)
          setTimeout(() => setCleanupInfo(null), 5000)
          loadData() // 重新加载数据
        }
      }

      // 计算下次清理时间
      if (projects.length > 0) {
        const oldestProject = projects[projects.length - 1]
        const createdDate = new Date(oldestProject.createdAt)
        const expireDate = new Date(createdDate)
        expireDate.setDate(expireDate.getDate() + 7)
        const daysUntilCleanup = Math.ceil((expireDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
        if (daysUntilCleanup <= 3) {
          setCleanupInfo(`${daysUntilCleanup > 0 ? `${daysUntilCleanup}天后` : "即将"}开始清理最早的项目数据`)
        }
      }
    } catch (error) {
      console.error("Cleanup check failed:", error)
    }
  }

  const toggleProject = (projectId: number) => {
    const newExpanded = new Set(expandedProjects)
    if (newExpanded.has(projectId)) {
      newExpanded.delete(projectId)
    } else {
      newExpanded.add(projectId)
    }
    setExpandedProjects(newExpanded)
  }

  const handleDeleteProject = async (sessionId: string, projectId: number) => {
    if (!confirm("确定要删除这个项目吗？此操作不可撤销。")) {
      return
    }

    try {
      const db = getDB()
      await db.deleteProject(sessionId)

      // 更新状态
      setProjects(prev => prev.filter(p => p.id !== projectId))
      setSqlHistories(prev => {
        const newHistories = { ...prev }
        delete newHistories[sessionId]
        return newHistories
      })

      setCleanupInfo("项目已删除")
      setTimeout(() => setCleanupInfo(null), 3000)
    } catch (error) {
      console.error("Failed to delete project:", error)
      setCleanupInfo("删除失败，请重试")
      setTimeout(() => setCleanupInfo(null), 3000)
    }
  }

  const getProviderDisplayName = (provider: string) => {
    const names: Record<string, string> = {
      openai: "ChatGPT",
      gemini: "Gemini",
      zhipu: "智谱AI",
      deepseek: "DeepSeek",
      qianwen: "千问",
      kimi: "Kimi",
    }
    return names[provider] || provider
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-12">
          <div className="flex items-center justify-center space-x-3">
            <div className="h-6 w-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm text-muted-foreground">加载中...</span>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-12">
        {/* 页面标题 */}
        <div className="mb-12 animate-slide-up">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-1 h-12 bg-primary"></div>
            <div>
              <h1 className="text-3xl font-light tracking-tight text-foreground">
                历史记录
              </h1>
              <p className="text-xs text-muted-foreground font-mono mt-1">
                PROJECT HISTORY // SESSION MANAGEMENT
              </p>
            </div>
          </div>
        </div>

        {/* 7天自动清除提示 */}
        <Alert className="border-primary/30 bg-primary/5 mb-6">
          <AlertDescription className="text-xs text-muted-foreground">
            <div className="flex items-start space-x-2">
              <Clock className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-primary font-medium mb-1">数据保留策略</p>
                <p>所有项目数据将保存7天，7天后自动清除。请及时导出重要数据。</p>
              </div>
            </div>
          </AlertDescription>
        </Alert>

        {/* 清理提示信息 */}
        {cleanupInfo && (
          <Alert className="border-info/30 bg-info/5 mb-6">
            <AlertDescription className="text-info text-xs">
              {cleanupInfo}
            </AlertDescription>
          </Alert>
        )}

        {/* 数据库调试工具 */}
        <div className="mb-6">
          <DatabaseDebug />
        </div>

        {/* 项目列表 */}
        {projects.length === 0 ? (
          <Card className="border-minimal bg-card">
            <CardContent className="p-12 text-center">
              <History className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-sm text-muted-foreground">暂无历史记录</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4 max-w-6xl mx-auto">
            {projects.map((project) => {
              const isExpanded = expandedProjects.has(project.id)
              const projectSqlHistories = sqlHistories[project.sessionId] || []

              return (
                <Card key={project.id} className="border-minimal bg-card overflow-hidden">
                  <CardContent className="p-0">
                    {/* 项目头部 */}
                    <div
                      className="p-4 cursor-pointer hover:bg-muted/20 transition-colors"
                      onClick={() => toggleProject(project.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Database className="h-4 w-4 text-primary" />
                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="text-sm font-mono text-foreground">
                                项目 {project.id}
                              </span>
                              <span className="text-[10px] px-2 py-0.5 bg-primary/20 text-primary rounded-full font-mono">
                                {project.sqlContents.length} 段SQL
                              </span>
                              {project.fieldDictionary && (
                                <span className="text-[10px] px-2 py-0.5 bg-success/20 text-success rounded-full font-mono">
                                  已生成字典
                                </span>
                              )}
                            </div>
                            <div className="flex items-center space-x-3 mt-1 text-xs text-muted-foreground">
                              <span>{getProviderDisplayName(project.llmConfig.provider)}</span>
                              <span>•</span>
                              <span>{project.llmConfig.model}</span>
                              <span>•</span>
                              <span>{formatDistanceToNow(new Date(project.createdAt), { locale: zhCN, addSuffix: true })}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDeleteProject(project.sessionId, project.id)
                            }}
                            variant="ghost"
                            size="sm"
                            className="h-8 px-2 text-muted-foreground hover:text-error hover:bg-error/10"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                          {isExpanded ? (
                            <ChevronUp className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <ChevronDown className="h-4 w-4 text-muted-foreground" />
                          )}
                        </div>
                      </div>
                    </div>

                    {/* 展开内容 */}
                    {isExpanded && (
                      <div className="border-t border-minimal p-4 space-y-6">
                        {/* SQL内容 */}
                        <div>
                          <div className="flex items-center space-x-2 mb-3">
                            <Code className="h-4 w-4 text-primary" />
                            <h4 className="text-sm font-semibold text-foreground">SQL代码</h4>
                          </div>
                          <div className="space-y-2">
                            {project.sqlContents.map((sql, index) => (
                              <div key={index} className="p-3 bg-muted/20 rounded border-minimal">
                                <div className="text-[10px] text-muted-foreground mb-1">
                                  片段 {index + 1}
                                </div>
                                <div className="text-xs text-foreground mb-2">
                                  {sql.description || "无描述"}
                                </div>
                                <pre className="text-xs font-mono text-muted-foreground overflow-x-auto whitespace-pre-wrap">
                                  {sql.code.substring(0, 200)}{sql.code.length > 200 ? "..." : ""}
                                </pre>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* 字段字典 */}
                        {project.fieldDictionary && (
                          <div>
                            <div className="flex items-center space-x-2 mb-3">
                              <Database className="h-4 w-4 text-success" />
                              <h4 className="text-sm font-semibold text-foreground">字段字典</h4>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                              {project.fieldDictionary.tables.map((table: any, index: number) => (
                                <div key={index} className="p-2 bg-success/5 rounded border-minimal border-success/20">
                                  <div className="text-xs font-mono text-success font-medium">
                                    {table.tableName}
                                  </div>
                                  <div className="text-[10px] text-muted-foreground mt-1">
                                    {table.fields.length} 个字段
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* 模型配置 */}
                        <div>
                          <div className="flex items-center space-x-2 mb-3">
                            <Settings className="h-4 w-4 text-warning" />
                            <h4 className="text-sm font-semibold text-foreground">模型配置</h4>
                          </div>
                          <div className="flex items-center space-x-4 text-xs">
                            <span className="text-muted-foreground">提供商:</span>
                            <span className="text-foreground font-medium">{getProviderDisplayName(project.llmConfig.provider)}</span>
                            <span className="text-muted-foreground">•</span>
                            <span className="text-muted-foreground">模型:</span>
                            <span className="text-foreground font-medium">{project.llmConfig.model}</span>
                          </div>
                        </div>

                        {/* SQL生成历史 */}
                        {projectSqlHistories.length > 0 && (
                          <div>
                            <div className="flex items-center space-x-2 mb-3">
                              <FileText className="h-4 w-4 text-primary" />
                              <h4 className="text-sm font-semibold text-foreground">生成的SQL ({projectSqlHistories.length})</h4>
                            </div>
                            <div className="space-y-2">
                              {projectSqlHistories.map((history) => (
                                <div key={history.id} className="p-3 bg-primary/5 rounded border-minimal">
                                  <div className="flex items-start justify-between mb-2">
                                    <div className="flex-1">
                                      <div className="text-xs text-foreground mb-1">
                                        {history.naturalLanguage}
                                      </div>
                                      <div className="text-[10px] text-muted-foreground">
                                        {formatDistanceToNow(new Date(history.generatedAt), { locale: zhCN, addSuffix: true })}
                                      </div>
                                    </div>
                                    {history.isValid && (
                                      <span className="text-[10px] px-2 py-0.5 bg-success/20 text-success rounded-full font-mono">
                                        已校验
                                      </span>
                                    )}
                                  </div>
                                  <pre className="text-xs font-mono text-foreground overflow-x-auto whitespace-pre-wrap bg-background p-2 rounded">
                                    {history.generatedSQL}
                                  </pre>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
