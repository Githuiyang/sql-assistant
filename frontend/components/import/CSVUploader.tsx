"use client"

import { useState, useCallback } from "react"
import { FileSpreadsheet, X, Upload, File } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface CSVFile {
  id: string
  file: File
  size: number
}

interface CSVUploaderProps {
  onCSVChange: (files: File[]) => void
  maxSize?: number // 字节
  minCount?: number
  optional?: boolean
}

export function CSVUploader({ onCSVChange, maxSize = 10 * 1024 * 1024, minCount = 0, optional = false }: CSVUploaderProps) {
  const [csvFiles, setCsvFiles] = useState<CSVFile[]>([])
  const [isDragging, setIsDragging] = useState(false)

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i]
  }

  const validateFile = (file: File): { valid: boolean; error?: string } => {
    // 文件扩展名校验
    if (!file.name.toLowerCase().endsWith(".csv")) {
      return { valid: false, error: "仅支持 CSV 格式文件" }
    }

    // 文件大小校验
    if (file.size > maxSize) {
      return { valid: false, error: `文件大小不能超过 ${formatFileSize(maxSize)}` }
    }

    return { valid: true }
  }

  const handleFiles = useCallback((files: FileList | null) => {
    if (!files) return

    const newFiles: CSVFile[] = []
    const validFiles: File[] = []

    Array.from(files).forEach(file => {
      const validation = validateFile(file)

      if (validation.valid) {
        const csvFile: CSVFile = {
          id: `${Date.now()}-${Math.random()}`,
          file,
          size: file.size
        }
        newFiles.push(csvFile)
        validFiles.push(file)
      }
    })

    if (newFiles.length > 0) {
      setCsvFiles(prev => [...prev, ...newFiles])
      onCSVChange([...csvFiles, ...newFiles].map(f => f.file))
    }
  }, [csvFiles, onCSVChange])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    handleFiles(e.dataTransfer.files)
  }, [handleFiles])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files)
  }, [handleFiles])

  const handleRemove = (id: string) => {
    const newFiles = csvFiles.filter(f => f.id !== id)
    setCsvFiles(newFiles)
    onCSVChange(newFiles.map(f => f.file))
  }

  const isValid = csvFiles.length >= minCount

  return (
    <Card className="border-minimal bg-card">
      <CardContent className="p-6">
        {/* 头部 */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <FileSpreadsheet className="h-5 w-5 text-primary" />
            <div>
              <h3 className="text-sm font-semibold text-foreground">CSV 文件上传</h3>
              <p className="text-xs text-muted-foreground font-mono mt-0.5">
                UPLOAD CSV FILES
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="text-right">
              <p className="text-xs text-muted-foreground">已上传</p>
              <p className={`text-sm font-mono font-semibold ${isValid ? "text-success" : "text-warning"}`}>
                {csvFiles.length} / {minCount}
              </p>
            </div>
          </div>
        </div>

        {/* 说明文字 */}
        <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
          {optional
            ? `上传 CSV 文件（可选），单个文件 ≤ ${formatFileSize(maxSize)}，支持批量上传和拖拽上传`
            : `上传至少 ${minCount} 个 CSV 文件（单个文件 ≤ ${formatFileSize(maxSize)}），支持批量上传和拖拽上传`
          }
        </p>

        {/* 拖拽上传区域 */}
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`relative border-2 border-dashed rounded p-8 text-center transition-all duration-200 ${
            isDragging
              ? "border-primary bg-primary/5"
              : "border-minimal bg-muted/20 hover:border-primary/50 hover:bg-muted/30"
          }`}
        >
          <input
            type="file"
            multiple
            accept=".csv"
            onChange={handleFileInput}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />

          <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm text-foreground mb-1">
            拖拽 CSV 文件到此处，或点击上传
          </p>
          <p className="text-xs text-muted-foreground">
            支持 .csv 格式，单个文件最大 {formatFileSize(maxSize)}
          </p>
        </div>

        {/* 已上传文件列表 */}
        {csvFiles.length > 0 && (
          <div className="mt-4 space-y-2 max-h-48 overflow-y-auto scrollbar-thin">
            {csvFiles.map((csvFile) => (
              <div
                key={csvFile.id}
                className="flex items-center justify-between p-3 bg-background border-minimal rounded group hover:border-primary/30 transition-all"
              >
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  <File className="h-4 w-4 text-primary flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-foreground truncate">
                      {csvFile.file.name}
                    </p>
                    <p className="text-[10px] text-muted-foreground font-mono">
                      {formatFileSize(csvFile.size)}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemove(csvFile.id)}
                  className="h-6 w-6 flex-shrink-0 hover:bg-destructive/10 hover:text-destructive opacity-0 group-hover:opacity-100 transition-all"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        )}

        {/* 状态提示 */}
        {csvFiles.length > 0 && !optional && (
          <Alert className={`mt-4 ${isValid ? "border-success/30" : "border-warning/30"}`}>
            <AlertDescription className="text-xs">
              {isValid ? (
                <span className="text-success flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 bg-success rounded-full"></span>
                  <span>已上传 {csvFiles.length} 个 CSV 文件，符合最低要求</span>
                </span>
              ) : (
                <span className="text-warning flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 bg-warning rounded-full animate-pulse"></span>
                  <span>还需要至少 {minCount - csvFiles.length} 个 CSV 文件</span>
                </span>
              )}
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  )
}
