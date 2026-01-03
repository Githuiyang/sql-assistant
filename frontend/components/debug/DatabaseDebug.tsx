"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { getDB } from "@/lib/db"

export function DatabaseDebug() {
  const [dbInfo, setDbInfo] = useState<any>(null)

  const checkDatabase = async () => {
    try {
      const db = getDB()
      await db.init()

      const projects = await db.getAllProjects()
      const importRecords = await db.getImportRecord("test")
      const dictionaries = await db.getFieldDictionaries("test")
      const sqlHistory = await db.getSQLHistory("test")

      setDbInfo({
        projects: projects.length,
        projectList: projects.slice(0, 3),
        sqlHistoryCount: projects.reduce((sum, p) => sum + (sqlHistory.filter(h => h.sessionId === p.sessionId).length), 0),
        databaseVersion: 2,
        lastCleanup: await db.getLastCleanupTime(),
      })
    } catch (error) {
      setDbInfo({
        error: error instanceof Error ? error.message : "Unknown error",
      })
    }
  }

  const clearDatabase = async () => {
    if (!confirm("确定要清空所有数据库吗？这将删除所有项目和历史记录。")) {
      return
    }

    try {
      // 删除IndexedDB
      indexedDB.deleteDatabase("sql-assistant-db")
      setDbInfo({ message: "数据库已清空，请刷新页面" })
    } catch (error) {
      setDbInfo({
        error: error instanceof Error ? error.message : "Unknown error",
      })
    }
  }

  return (
    <Card className="border-minimal bg-card">
      <CardContent className="p-4">
        <div className="space-y-4">
          <h3 className="text-sm font-semibold">数据库调试</h3>

          <div className="flex space-x-2">
            <Button onClick={checkDatabase} size="sm">
              检查数据库
            </Button>
            <Button onClick={clearDatabase} variant="destructive" size="sm">
              清空数据库
            </Button>
          </div>

          {dbInfo && (
            <div className="p-3 bg-muted/20 rounded text-xs space-y-1">
              {dbInfo.error ? (
                <p className="text-error">错误: {dbInfo.error}</p>
              ) : dbInfo.message ? (
                <p className="text-success">{dbInfo.message}</p>
              ) : (
                <>
                  <p>数据库版本: {dbInfo.databaseVersion}</p>
                  <p>项目数量: {dbInfo.projects}</p>
                  <p>SQL历史记录: {dbInfo.sqlHistoryCount}</p>
                  {dbInfo.lastCleanup && (
                    <p>上次清理: {new Date(dbInfo.lastCleanup).toLocaleString()}</p>
                  )}
                  {dbInfo.projectList && dbInfo.projectList.length > 0 && (
                    <div className="mt-2">
                      <p className="font-medium">最近3个项目:</p>
                      {dbInfo.projectList.map((p: any) => (
                        <div key={p.id} className="ml-2 text-muted-foreground">
                          - 项目{p.id}: {p.sqlContents?.length || 0}段SQL
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
