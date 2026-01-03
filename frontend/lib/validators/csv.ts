import { ValidationResult, CSVValidationResult } from "@/types"

/**
 * 验证 CSV 文件的基本信息
 */
export function validateCSVFile(file: File): ValidationResult {
  const errors: ValidationResult["errors"] = []

  // 文件扩展名校验
  if (!file.name.toLowerCase().endsWith(".csv")) {
    errors.push({
      message: `文件 "${file.name}" 不是 CSV 格式`,
      severity: "error"
    })
    return { valid: false, errors }
  }

  // 文件大小校验
  const maxSize = 10 * 1024 * 1024 // 10MB
  if (file.size > maxSize) {
    errors.push({
      message: `文件 "${file.name}" 大小超过限制 (最大 10MB)`,
      severity: "error"
    })
  }

  // 文件名不能为空
  if (!file.name || file.name.trim() === "") {
    errors.push({
      message: "文件名不能为空",
      severity: "error"
    })
  }

  return {
    valid: errors.filter(e => e.severity === "error").length === 0,
    errors
  }
}

/**
 * 验证 CSV 文件列表
 */
export function validateCSVFileList(files: File[]): ValidationResult {
  const errors: ValidationResult["errors"] = []

  if (files.length === 0) {
    errors.push({
      message: "请至少上传一个 CSV 文件",
      severity: "error"
    })
    return { valid: false, errors }
  }

  // 验证每个文件
  files.forEach((file, index) => {
    const validation = validateCSVFile(file)
    if (!validation.valid) {
      validation.errors?.forEach(error => {
        errors.push(error)
      })
    }
  })

  // 检查文件名重复
  const fileNames = files.map(f => f.name.toLowerCase())
  const duplicates = fileNames.filter((name, index) => fileNames.indexOf(name) !== index)

  if (duplicates.length > 0) {
    errors.push({
      message: `存在重复的文件名: ${[...new Set(duplicates)].join(", ")}`,
      severity: "warning"
    })
  }

  return {
    valid: errors.filter(e => e.severity === "error").length === 0,
    errors
  }
}

/**
 * 解析 CSV 文件内容
 */
export async function parseCSVContent(file: File): Promise<CSVValidationResult> {
  return new Promise((resolve) => {
    const reader = new FileReader()

    reader.onload = (e) => {
      try {
        const text = e.target?.result as string
        const lines = text.split(/\r\n|\n/)

        // 检测分隔符
        const firstLine = lines[0] || ""
        const commaIndex = firstLine.indexOf(",")
        const hasTab = firstLine.includes("\t")
        const hasSemicolon = firstLine.indexOf(";")

        let delimiter = ","
        if (hasTab && commaIndex === -1) {
          delimiter = "\t"
        } else if (hasSemicolon > 0 && (commaIndex === -1 || hasSemicolon < commaIndex)) {
          delimiter = ";"
        }

        // 解析数据
        const data: string[][] = []
        const parseErrors: Array<{ message: string; row?: number; type?: string }> = []

        lines.forEach((line, index) => {
          if (line.trim() === "") return

          try {
            const values = line.split(delimiter).map(v => v.trim().replace(/^"|"$/g, ""))
            data.push(values)
          } catch (err) {
            parseErrors.push({
              message: "解析失败",
              row: index + 1,
              type: "parse_error"
            })
          }
        })

        // 基本信息
        const columnCount = data.length > 0 ? data[0].length : 0
        const rowCount = data.length

        resolve({
          isValid: parseErrors.length === 0,
          errors: parseErrors,
          data,
          rowCount,
          columnCount
        })
      } catch (error) {
        resolve({
          isValid: false,
          errors: [{ message: error instanceof Error ? error.message : "文件读取失败" }],
          data: [],
          rowCount: 0
        })
      }
    }

    reader.onerror = () => {
      resolve({
        isValid: false,
        errors: [{ message: "文件读取失败" }],
        data: [],
        rowCount: 0
      })
    }

    reader.readAsText(file)
  })
}

/**
 * 格式化文件大小
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes"
  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i]
}

/**
 * 验证 SQL 和 CSV 数量是否匹配
 */
export function validateSQLCSVMatch(sqlCount: number, csvCount: number): ValidationResult {
  const errors: ValidationResult["errors"] = []

  if (sqlCount !== csvCount) {
    errors.push({
      message: `SQL 段数 (${sqlCount}) 与 CSV 文件数 (${csvCount}) 不匹配`,
      severity: "warning"
    })
  }

  return {
    valid: true,
    errors
  }
}
