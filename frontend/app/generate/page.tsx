"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/layout/Header"
import { SQLGenerator } from "@/components/generate/SQLGenerator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Database } from "lucide-react"
import { getDB } from "@/lib/db"

export default function GeneratePage() {
  const router = useRouter()
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [hasDictionary, setHasDictionary] = useState(false)
  const [pendingQuery, setPendingQuery] = useState<string | null>(null)

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

      // Check if dictionary exists
      const db = getDB()
      await db.init()
      const existingDict = await db.getCompleteFieldDictionary(session.id)

      if (existingDict) {
        setHasDictionary(true)
      }

      // Check for pending query from suggestions
      const pending = localStorage.getItem("pendingQuery")
      if (pending) {
        setPendingQuery(pending)
        localStorage.removeItem("pendingQuery") // Clear after use
      }
    } catch (error) {
      console.error("Failed to load data:", error)
    } finally {
      setLoading(false)
    }
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
              未找到会话信息，请先从首页导入数据
            </AlertDescription>
          </Alert>
        </main>
      </div>
    )
  }

  if (!hasDictionary) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-12">
          <Alert className="border-warning/30 bg-warning/5">
            <AlertDescription className="text-warning text-sm">
              未找到字段字典，请先生成字段字典
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
                生成SQL
              </h1>
              <p className="text-xs text-muted-foreground font-mono mt-1">
                SQL GENERATION // NATURAL LANGUAGE PROCESSING
              </p>
            </div>
          </div>
        </div>

        {/* 数据概览 */}
        <div className="max-w-4xl mx-auto mb-6">
          <div className="flex items-center space-x-2 p-4 bg-muted/20 border-minimal rounded">
            <Database className="h-4 w-4 text-primary" />
            <span className="text-xs text-muted-foreground font-mono">
              SESSION: {sessionId}
            </span>
          </div>
        </div>

        {/* SQL生成器 */}
        <div className="max-w-4xl mx-auto">
          <SQLGenerator
            sessionId={sessionId}
            initialQuery={pendingQuery}
          />
        </div>
      </main>
    </div>
  )
}
