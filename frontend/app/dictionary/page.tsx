"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/layout/Header"
import { Card, CardContent } from "@/components/ui/card"
import { Database, Loader2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { DictionaryGenerator } from "@/components/dictionary/DictionaryGenerator"
import { DictionaryEditor } from "@/components/dictionary/DictionaryEditor"
import { QuerySuggestions } from "@/components/dictionary/QuerySuggestions"
import { getDB } from "@/lib/db"

export default function DictionaryPage() {
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [sqlContents, setSqlContents] = useState<Array<{ code: string; description: string }>>([])
  const [csvFiles, setCsvFiles] = useState<Array<{ name: string; size: number }>>([])
  const [dictionary, setDictionary] = useState<any>(null)
  const [llmConfig, setLlmConfig] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      // Get session ID from localStorage
      const currentSession = localStorage.getItem("currentSession")
      if (!currentSession) {
        setLoading(false)
        return
      }

      const session = JSON.parse(currentSession)
      setSessionId(session.id)
      setSqlContents(session.sqlContents || [])
      setCsvFiles(session.csvFiles || [])

      // Load LLM config
      const savedConfig = localStorage.getItem("llmConfig")
      if (savedConfig) {
        try {
          setLlmConfig(JSON.parse(savedConfig))
        } catch (e) {
          console.error("Failed to load LLM config:", e)
        }
      }

      // Check if dictionary already exists
      const db = getDB()
      await db.init()
      const existingDict = await db.getCompleteFieldDictionary(session.id)

      if (existingDict) {
        setDictionary(existingDict)
      }
    } catch (error) {
      console.error("Failed to load data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDictionaryGenerated = (generatedDictionary: any) => {
    setDictionary(generatedDictionary)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-12">
          <div className="flex items-center justify-center space-x-3">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <span className="text-sm text-muted-foreground">加载中...</span>
          </div>
        </main>
      </div>
    )
  }

  if (!sessionId) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-12">
          <Alert className="border-warning/30 bg-warning/5">
            <AlertDescription className="text-warning text-sm">
              未找到导入数据，请先从首页导入 SQL 和 CSV 文件
            </AlertDescription>
          </Alert>
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
                字段字典
              </h1>
              <p className="text-xs text-muted-foreground font-mono mt-1">
                FIELD DICTIONARY // DATA SCHEMA
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto">
          {/* 数据概览 */}
          <Card className="border-minimal bg-card mb-6">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Database className="h-5 w-5 text-primary" />
                <div>
                  <h3 className="text-sm font-semibold text-foreground">导入数据</h3>
                  <p className="text-xs text-muted-foreground font-mono mt-0.5">
                    IMPORTED DATA
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <div className="text-muted-foreground mb-1">SQL 段落</div>
                  <div className="text-foreground font-mono">{sqlContents.length} 段</div>
                </div>
                <div>
                  <div className="text-muted-foreground mb-1">CSV 文件</div>
                  <div className="text-foreground font-mono">{csvFiles.length} 个</div>
                </div>
              </div>

              {/* SQL描述统计 */}
              {sqlContents.length > 0 && (
                <div className="mt-4 pt-4 border-minimal border-t">
                  <div className="text-xs text-muted-foreground mb-2">SQL片段用途说明：</div>
                  <div className="space-y-1">
                    {sqlContents.slice(0, 3).map((sql, index) => (
                      <div key={index} className="flex items-start space-x-2">
                        <div className="w-1 h-1 bg-primary rounded-full mt-1.5 flex-shrink-0"></div>
                        <div className="text-xs text-foreground flex-1">
                          <span className="text-muted-foreground">片段{index + 1}:</span> {sql.description || "无描述"}
                        </div>
                      </div>
                    ))}
                    {sqlContents.length > 3 && (
                      <div className="text-xs text-muted-foreground pl-3">
                        ...还有 {sqlContents.length - 3} 段
                      </div>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* 生成器或编辑器 */}
          {dictionary ? (
            <>
              <DictionaryEditor
                sessionId={sessionId}
                dictionary={dictionary}
                onDictionaryChange={setDictionary}
              />

              {/* 查询建议 */}
              <div className="mt-8">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-1 h-12 bg-success"></div>
                  <div>
                    <h2 className="text-2xl font-light tracking-tight text-foreground">
                      查询建议
                    </h2>
                    <p className="text-xs text-muted-foreground font-mono mt-1">
                      QUERY SUGGESTIONS // AI INSIGHTS
                    </p>
                  </div>
                </div>

                <QuerySuggestions
                  sessionId={sessionId}
                  dictionary={dictionary}
                  llmConfig={llmConfig}
                />
              </div>
            </>
          ) : (
            <DictionaryGenerator
              sessionId={sessionId}
              sqlContents={sqlContents}
              csvFiles={csvFiles}
              onGenerated={handleDictionaryGenerated}
            />
          )}
        </div>
      </main>
    </div>
  )
}

