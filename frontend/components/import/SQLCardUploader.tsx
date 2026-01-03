"use client"

import { useState } from "react"
import { Plus, Trash2, Code, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface SQLSegment {
  code: string
  description: string
}

interface SQLCardUploaderProps {
  onSQLChange: (sqlContents: Array<{ code: string; description: string }>) => void
  minCount?: number
}

export function SQLCardUploader({ onSQLChange, minCount = 5 }: SQLCardUploaderProps) {
  const [sqlSegments, setSqlSegments] = useState<SQLSegment[]>([{ code: "", description: "" }])

  const updateSegment = (index: number, field: keyof SQLSegment, value: string) => {
    const newSegments = [...sqlSegments]
    newSegments[index][field] = value
    setSqlSegments(newSegments)
    onSQLChange(newSegments.filter(s => s.code.trim()))
  }

  const addSegment = () => {
    setSqlSegments([...sqlSegments, { code: "", description: "" }])
  }

  const removeSegment = (index: number) => {
    if (sqlSegments.length > 1) {
      const newSegments = sqlSegments.filter((_, i) => i !== index)
      setSqlSegments(newSegments)
      onSQLChange(newSegments.filter(s => s.code.trim()))
    }
  }

  const validCount = sqlSegments.filter(s => s.code.trim()).length

  return (
    <div className="space-y-6">
      {/* 核心提示 */}
      <Alert className="border-primary/30 bg-primary/5">
        <AlertDescription className="text-xs">
          <div className="flex items-start space-x-2">
            <div className="w-1.5 h-1.5 bg-primary rounded-full mt-1 flex-shrink-0"></div>
            <div className="flex-1 space-y-1">
              <p className="text-primary font-medium">💡 SQL 选择建议</p>
              <p className="text-muted-foreground leading-relaxed">
                请上传与您的需求相关的SQL代码。系统将基于您提供的<span className="text-foreground font-semibold">表结构</span>和<span className="text-foreground font-semibold">字段关系</span>生成字段字典，这样后续生成SQL时才能准确使用您数据库中的表和字段。
              </p>
              <p className="text-muted-foreground leading-relaxed">
                例如：如果您需要查询"用户订单数据"，请包含 users 表和 orders 表相关的 SQL 定义。
              </p>
            </div>
          </div>
        </AlertDescription>
      </Alert>

      {/* 计数器 */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground leading-relaxed">
          上传至少 {minCount} 段SQL代码
        </p>
        <div className="text-right">
          <p className="text-xs text-muted-foreground">已上传</p>
          <p className={`text-sm font-mono font-semibold ${validCount >= minCount ? "text-success" : "text-warning"}`}>
            {validCount} / {minCount}
          </p>
        </div>
      </div>

      {/* SQL卡片列表 */}
      <div className="space-y-4">
        {sqlSegments.map((segment, index) => (
          <Card key={index} className="border-minimal bg-card group">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <Code className="h-4 w-4 text-primary" />
                  <span className="text-xs font-mono text-muted-foreground">
                    SQL 片段 {index + 1}
                  </span>
                </div>
                {sqlSegments.length > 1 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeSegment(index)}
                    className="h-7 px-2 text-muted-foreground hover:text-error opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                )}
              </div>

              {/* 描述输入框 */}
              <div className="mb-3">
                <div className="flex items-center space-x-2 mb-2">
                  <FileText className="h-3 w-3 text-primary" />
                  <label className="text-[10px] text-muted-foreground">
                    SQL用途描述（必填）
                  </label>
                </div>
                <Input
                  value={segment.description}
                  onChange={(e) => updateSegment(index, "description", e.target.value)}
                  placeholder="例如：用户表结构，包含用户ID、姓名、邮箱等字段"
                  className="text-xs bg-background border-minimal"
                />
              </div>

              <Textarea
                value={segment.code}
                onChange={(e) => updateSegment(index, "code", e.target.value)}
                placeholder={`-- 在这里输入第 ${index + 1} 段SQL代码
CREATE TABLE example (
  id INT PRIMARY KEY,
  name VARCHAR(100)
);`}
                className="font-mono text-xs min-h-[120px] bg-background border-minimal resize-none focus:outline-none focus:ring-1 focus:ring-ring"
                spellCheck={false}
              />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 添加按钮 */}
      <Button
        onClick={addSegment}
        variant="outline"
        className="w-full border-dashed border-2 hover:border-primary/50 hover:bg-primary/5 transition-all"
      >
        <Plus className="h-4 w-4 mr-2" />
        添加SQL片段
      </Button>

      {/* 提示 */}
      <div className="p-3 border-minimal rounded bg-muted/20">
        <p className="text-[10px] text-muted-foreground leading-relaxed">
          💡 提示：每个卡片代表一段独立的SQL代码，建议包含CREATE TABLE、SELECT等完整语句。<span className="text-primary font-medium">请务必填写SQL用途描述，这将帮助大模型更准确地生成字段字典。</span>
        </p>
      </div>
    </div>
  )
}
