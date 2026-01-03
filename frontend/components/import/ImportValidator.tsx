"use client"

import { useState, useCallback } from "react"
import { CheckCircle2, AlertCircle, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { SQLCardUploader } from "./SQLCardUploader"
import { CSVUploader } from "./CSVUploader"
import { validateSQLList } from "@/lib/validators/sql"
import { validateCSVFileList } from "@/lib/validators/csv"
import { getDB } from "@/lib/db"

interface SQLSegment {
  code: string
  description: string
}

interface ImportValidatorProps {
  onValidationComplete: (isValid: boolean, data?: { sqlContents: SQLSegment[]; csvFiles: File[] }) => void
  minSQLCount?: number
  csvOptional?: boolean
}

export function ImportValidator({
  onValidationComplete,
  minSQLCount = 5,
  csvOptional = true
}: ImportValidatorProps) {
  const [sqlContents, setSqlContents] = useState<SQLSegment[]>([])
  const [csvFiles, setCsvFiles] = useState<File[]>([])
  const [showReminder, setShowReminder] = useState(true)
  const [isValidating, setIsValidating] = useState(false)

  // 验证导入数据
  const validateImport = useCallback(() => {
    // Extract just the code field for validation
    const sqlCodes = sqlContents.map(s => s.code)
    const sqlValidation = validateSQLList(sqlCodes)
    const csvValidation = validateCSVFileList(csvFiles)

    // CSV是可选的，所以不检查匹配
    const allErrors = [
      ...(sqlValidation.errors || []),
      ...(!csvOptional ? csvValidation.errors || [] : [])
    ]

    const hasErrors = allErrors.some(e => e.severity === "error")
    const isValid = !hasErrors && sqlContents.length >= minSQLCount

    return {
      isValid,
      errors: allErrors,
      sqlCount: sqlContents.length,
      csvCount: csvFiles.length
    }
  }, [sqlContents, csvFiles, minSQLCount, csvOptional])

  // 处理提交
  const handleSubmit = useCallback(() => {
    setIsValidating(true)

    // 模拟异步验证
    setTimeout(() => {
      const validation = validateImport()

      if (validation.isValid) {
        // Generate session ID
        const sessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

        // Get LLM config
        const llmConfigStr = localStorage.getItem("llmConfig")
        const llmConfig = llmConfigStr ? JSON.parse(llmConfigStr) : null

        // Save to localStorage
        const sessionData = {
          id: sessionId,
          sqlContents: sqlContents.map(s => ({ code: s.code, description: s.description })),
          csvFiles: csvFiles.map(f => ({ name: f.name, size: f.size })),
          createdAt: new Date().toISOString()
        }
        localStorage.setItem("currentSession", JSON.stringify(sessionData))

        // Save to database (async, don't wait)
        if (llmConfig) {
          const db = getDB()
          db.init().then(() => {
            db.saveProject({
              sessionId,
              sqlContents,
              csvFiles: csvFiles.map(f => ({ name: f.name, size: f.size })),
              llmConfig: {
                provider: llmConfig.provider,
                model: llmConfig.model,
              },
            })
          }).catch(err => console.error("Failed to save project:", err))
        }

        onValidationComplete(true, {
          sqlContents,
          csvFiles
        })
      }

      setIsValidating(false)
    }, 500)
  }, [sqlContents, csvFiles, validateImport, onValidationComplete])

  const validation = validateImport()
  const canSubmit = validation.isValid && !isValidating

  return (
    <>
      {/* 前置提醒弹窗 */}
      <Dialog open={showReminder} onOpenChange={setShowReminder}>
        <DialogContent className="border-minimal bg-card max-w-md">
          <DialogHeader>
            <DialogTitle className="text-foreground flex items-center space-x-2">
              <Info className="h-5 w-5 text-primary" />
              <span>重要提醒</span>
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 bg-primary rounded-full mt-1.5 flex-shrink-0"></div>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  请务必上传<span className="text-primary font-semibold">已生效、可直接使用</span>的 SQL 语句
                </p>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 bg-warning rounded-full mt-1.5 flex-shrink-0"></div>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  本地历史数据将在<span className="text-warning font-semibold">7天后自动完全清除</span>
                </p>
              </div>
            </div>

            <Alert className="border-minimal bg-muted/30">
              <AlertDescription className="text-[10px] text-muted-foreground font-mono">
                DATA PRIVACY PROTECTION ENABLED
              </AlertDescription>
            </Alert>
          </div>
          <div className="flex justify-end pt-4">
            <Button
              onClick={() => setShowReminder(false)}
              className="bg-primary text-primary-foreground hover:scale-105"
            >
              我知道了
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 导入区域 */}
      <div className="space-y-6">
        {/* SQL 上传 */}
        <SQLCardUploader
          onSQLChange={setSqlContents}
          minCount={minSQLCount}
        />

        {/* CSV 上传 - 可选 */}
        <div className="relative">
          <CSVUploader
            onCSVChange={setCsvFiles}
            minCount={0}
            optional={csvOptional}
          />
        </div>

        {/* 验证结果提示 */}
        {sqlContents.length > 0 && (
          <Alert className={`border-minimal ${validation.isValid ? "border-success/30" : "border-warning/30"}`}>
            <AlertDescription className="text-xs">
              {validation.isValid ? (
                <span className="text-success flex items-center space-x-2">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>
                    数据验证通过！{sqlContents.length} 段 SQL{csvFiles.length > 0 && `，${csvFiles.length} 个 CSV 文件`}
                  </span>
                </span>
              ) : (
                <span className="text-warning flex items-center space-x-2">
                  <AlertCircle className="h-4 w-4" />
                  <span>
                    {validation.errors?.length
                      ? validation.errors[0].message
                      : `请上传至少 ${minSQLCount} 段 SQL 代码`}
                  </span>
                </span>
              )}
            </AlertDescription>
          </Alert>
        )}

        {/* 提交按钮 */}
        <div className="flex justify-center">
          <Button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className={`px-12 py-3 text-sm ${
              canSubmit
                ? "bg-primary text-primary-foreground hover:scale-105 hover:shadow-lg"
                : "bg-muted/30 text-muted-foreground cursor-not-allowed"
            } transition-all duration-200`}
          >
            {isValidating ? "验证中..." : "验证并继续"}
          </Button>
        </div>
      </div>
    </>
  )
}
