import { ValidationResult } from "@/types"

/**
 * 验证 SQL 内容的基本格式
 */
export function validateSQLBasic(sql: string): ValidationResult {
  const errors: ValidationResult["errors"] = []

  // 检查是否为空
  if (!sql || sql.trim().length === 0) {
    errors.push({
      message: "SQL 内容不能为空",
      severity: "error"
    })
    return { valid: false, errors }
  }

  // 检查最小长度
  if (sql.trim().length < 20) {
    errors.push({
      message: "SQL 内容太短，请输入完整的 SQL 语句",
      severity: "error"
    })
  }

  // 检查是否包含基本的 SQL 关键字
  const sqlKeywords = [
    "SELECT", "CREATE", "INSERT", "UPDATE", "DELETE",
    "TABLE", "FROM", "WHERE", "JOIN", "ALTER", "DROP"
  ]

  const upperSQL = sql.toUpperCase()
  const hasKeyword = sqlKeywords.some(keyword => upperSQL.includes(keyword))

  if (!hasKeyword) {
    errors.push({
      message: "SQL 语句未检测到有效的 SQL 关键字",
      severity: "warning"
    })
  }

  // 检查括号匹配
  const openParens = (sql.match(/\(/g) || []).length
  const closeParens = (sql.match(/\)/g) || []).length

  if (openParens !== closeParens) {
    errors.push({
      message: "SQL 语句括号不匹配",
      severity: "error"
    })
  }

  return {
    valid: errors.filter(e => e.severity === "error").length === 0,
    errors
  }
}

/**
 * 验证 SQL 内容列表
 */
export function validateSQLList(sqlList: string[]): ValidationResult {
  const errors: ValidationResult["errors"] = []

  if (sqlList.length === 0) {
    errors.push({
      message: "请至少上传一段 SQL 代码",
      severity: "error"
    })
    return { valid: false, errors }
  }

  // 验证每一段 SQL
  sqlList.forEach((sql, index) => {
    const validation = validateSQLBasic(sql)
    if (!validation.valid) {
      errors.push({
        message: `第 ${index + 1} 段 SQL: ${validation.errors?.[0]?.message || "格式错误"}`,
        severity: "error"
      })
    }
  })

  return {
    valid: errors.filter(e => e.severity === "error").length === 0,
    errors
  }
}

/**
 * 从文本中提取 SQL 段落
 */
export function extractSQLSegments(text: string): string[] {
  // 使用 === 或连续空行作为分隔符
  const segments = text
    .split(/\n\s*={3,}\s*\n|\n\s*\n\n/)
    .map(s => s.trim())
    .filter(s => s.length > 0)

  return segments
}

/**
 * 检测 SQL 的类型
 */
export function detectSQLType(sql: string): string {
  const upperSQL = sql.toUpperCase().trim()

  if (upperSQL.startsWith("CREATE")) return "CREATE"
  if (upperSQL.startsWith("ALTER")) return "ALTER"
  if (upperSQL.startsWith("DROP")) return "DROP"
  if (upperSQL.startsWith("SELECT")) return "SELECT"
  if (upperSQL.startsWith("INSERT")) return "INSERT"
  if (upperSQL.startsWith("UPDATE")) return "UPDATE"
  if (upperSQL.startsWith("DELETE")) return "DELETE"

  return "OTHER"
}
