"use client"

import { useState, useCallback } from "react"
import { Code, X, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface SQLUploaderProps {
  onSQLChange: (sqlContents: string[]) => void
  initialValue?: string[]
  minCount?: number
}

export function SQLUploader({ onSQLChange, initialValue = [], minCount = 5 }: SQLUploaderProps) {
  const [sqlContents, setSqlContents] = useState<string[]>(initialValue)
  const [currentInput, setCurrentInput] = useState(initialValue.join("\n\n===\n\n") || "")

  const handleInputChange = (value: string) => {
    setCurrentInput(value)

    // 分割 SQL 内容（使用 === 或空行作为分隔符）
    const segments = value
      .split(/\n\s*===\s*\n|\n\s*\n\n/)
      .map(s => s.trim())
      .filter(s => s.length > 0)

    setSqlContents(segments)
    onSQLChange(segments)
  }

  const handleClear = () => {
    setCurrentInput("")
    setSqlContents([])
    onSQLChange([])
  }

  const handlePaste = useCallback((e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    e.preventDefault()
    const pastedText = e.clipboardData.getData("text")
    setCurrentInput(prev => prev + pastedText)

    // 触发输入处理
    const newValue = currentInput + pastedText
    handleInputChange(newValue)
  }, [currentInput])

  const isValid = sqlContents.length >= minCount

  return (
    <Card className="border-minimal bg-card">
      <CardContent className="p-6">
        {/* 头部 */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Code className="h-5 w-5 text-primary" />
            <div>
              <h3 className="text-sm font-semibold text-foreground">SQL 代码上传</h3>
              <p className="text-xs text-muted-foreground font-mono mt-0.5">
                UPLOAD SQL CODE
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="text-right">
              <p className="text-xs text-muted-foreground">已上传</p>
              <p className={`text-sm font-mono font-semibold ${isValid ? "text-success" : "text-warning"}`}>
                {sqlContents.length} / {minCount}
              </p>
            </div>
          </div>
        </div>

        {/* 说明文字 */}
        <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
          粘贴至少 {minCount} 段有效的 SQL 代码，使用 <code className="px-1.5 py-0.5 bg-muted/50 rounded text-primary font-mono text-[10px]">===</code> 或空行分隔
        </p>

        {/* 输入区域 */}
        <div className="relative">
          <textarea
            value={currentInput}
            onChange={(e) => handleInputChange(e.target.value)}
            onPaste={handlePaste}
            placeholder={`-- 示例 SQL 1\nCREATE TABLE users (\n  id INT PRIMARY KEY,\n  name VARCHAR(100)\n);\n\n===\n\n-- 示例 SQL 2\nCREATE TABLE orders (\n  id INT PRIMARY KEY,\n  user_id INT\n);`}
            className="w-full h-64 p-4 font-mono text-xs bg-background border-minimal rounded resize-none focus:outline-none focus:ring-1 focus:ring-ring scrollbar-thin placeholder:text-muted-foreground/50"
            spellCheck={false}
          />

          {/* 清除按钮 */}
          {currentInput && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClear}
              className="absolute top-2 right-2 h-6 w-6 hover:bg-muted/50"
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>

        {/* 状态提示 */}
        {sqlContents.length > 0 && (
          <Alert className={`mt-4 ${isValid ? "border-success/30" : "border-warning/30"}`}>
            <AlertDescription className="text-xs">
              {isValid ? (
                <span className="text-success flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 bg-success rounded-full"></span>
                  <span>已上传 {sqlContents.length} 段 SQL 代码，符合最低要求</span>
                </span>
              ) : (
                <span className="text-warning flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 bg-warning rounded-full animate-pulse"></span>
                  <span>还需要至少 {minCount - sqlContents.length} 段 SQL 代码</span>
                </span>
              )}
            </AlertDescription>
          </Alert>
        )}

        {/* 帮助提示 */}
        {!currentInput && (
          <div className="mt-4 p-4 border-minimal rounded-dashed border bg-muted/20 text-center">
            <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-xs text-muted-foreground mb-1">
              粘贴 SQL 代码到上方文本框
            </p>
            <p className="text-[10px] text-muted-foreground font-mono">
              支持直接粘贴，自动识别分段
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
