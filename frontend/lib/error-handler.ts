/**
 * 友好的错误提示系统
 * 将技术错误转换为用户友好的提示信息
 */

export interface FriendlyError {
  title: string
  message: string
  suggestions?: string[]
  canRetry: boolean
}

/**
 * 错误类型映射表
 */
const ERROR_MAP: Record<string, FriendlyError> = {
  // API Key 相关错误
  "API_KEY_INVALID": {
    title: "API密钥无效",
    message: "您提供的API密钥无效或已过期，请检查配置",
    suggestions: [
      "前往设置页面重新配置API密钥",
      "确认密钥格式正确，没有多余的空格",
      "检查密钥是否已过期或被撤销"
    ],
    canRetry: false
  },
  "API_KEY_MISSING": {
    title: "未配置API密钥",
    message: "使用前需要先配置大模型API密钥",
    suggestions: [
      "点击右上角设置按钮",
      "选择您的大模型提供商",
      "输入API Key并保存"
    ],
    canRetry: false
  },

  // 网络相关错误
  "NETWORK_ERROR": {
    title: "网络连接失败",
    message: "无法连接到服务器，请检查您的网络连接",
    suggestions: [
      "检查网络连接是否正常",
      "尝试刷新页面",
      "检查是否需要配置代理"
    ],
    canRetry: true
  },
  "TIMEOUT": {
    title: "请求超时",
    message: "请求耗时过长，可能是网络较慢或服务器响应慢",
    suggestions: [
      "检查网络连接",
      "稍后重试",
      "如果是大模型调用，可能是模型响应较慢，请耐心等待"
    ],
    canRetry: true
  },

  // 速率限制
  "RATE_LIMIT_EXCEEDED": {
    title: "请求过于频繁",
    message: "您的请求过于频繁，已被限流",
    suggestions: [
      "稍等片刻后重试",
      "升级您的API套餐以获得更高限额",
      "减少请求频率"
    ],
    canRetry: true
  },

  // 文件上传错误
  "FILE_TOO_LARGE": {
    title: "文件过大",
    message: "上传的文件超过了大小限制（最大10MB）",
    suggestions: [
      "压缩文件后重试",
      "分割成多个小文件",
      "检查是否上传了错误的文件"
    ],
    canRetry: false
  },
  "INVALID_FILE_TYPE": {
    title: "文件类型不支持",
    message: "只支持 .csv 格式的文件",
    suggestions: [
      "确认文件是CSV格式",
      "使用Excel或文本编辑器另存为CSV格式",
      "检查文件扩展名是否为 .csv"
    ],
    canRetry: false
  },
  "FILE_COUNT_MISMATCH": {
    title: "文件数量不匹配",
    message: "CSV文件数量必须与SQL语句数量一致",
    suggestions: [
      "确认上传了对应数量的CSV文件",
      "每个SQL CREATE TABLE语句应对应一个CSV文件"
    ],
    canRetry: false
  },

  // SQL 相关错误
  "SQL_SYNTAX_ERROR": {
    title: "SQL语法错误",
    message: "提供的SQL语句存在语法错误",
    suggestions: [
      "检查SQL语句是否完整",
      "确认使用了正确的CREATE TABLE语法",
      "检查是否有拼写错误或缺少标点符号"
    ],
    canRetry: false
  },
  "SQL_EMPTY": {
    title: "SQL内容为空",
    message: "请提供至少一段SQL CREATE TABLE语句",
    suggestions: [
      "粘贴完整的CREATE TABLE语句",
      "或使用示例数据快速体验"
    ],
    canRetry: false
  },
  "SQL_COUNT_INSUFFICIENT": {
    title: "SQL数量不足",
    message: "至少需要5段SQL语句",
    suggestions: [
      "继续添加更多的CREATE TABLE语句",
      "或使用示例数据快速体验"
    ],
    canRetry: false
  },

  // 字段字典相关错误
  "DICTIONARY_NOT_FOUND": {
    title: "未找到字段字典",
    message: "请先生成字段字典",
    suggestions: [
      "前往字段字典页面",
      "点击「生成字典」按钮"
    ],
    canRetry: false
  },
  "DICTIONARY_GENERATION_FAILED": {
    title: "字典生成失败",
    message: "无法从提供的SQL中提取字段信息",
    suggestions: [
      "检查SQL语句格式是否正确",
      "确认SQL包含完整的表结构定义",
      "尝试使用示例数据测试"
    ],
    canRetry: true
  },

  // SQL 生成相关错误
  "SQL_GENERATION_FAILED": {
    title: "SQL生成失败",
    message: "AI无法根据您的需求生成SQL",
    suggestions: [
      "尝试更详细地描述您的查询需求",
      "确认字段字典已正确生成",
      "检查查询需求是否使用了字典中存在的表和字段"
    ],
    canRetry: true
  },
  "LLM_RESPONSE_INVALID": {
    title: "AI响应格式错误",
    message: "AI返回的内容格式不正确",
    suggestions: [
      "重试生成",
      "如果问题持续，可能是模型问题，请稍后再试",
      "尝试切换其他大模型"
    ],
    canRetry: true
  },

  // 数据库相关错误
  "DB_NOT_INITIALIZED": {
    title: "数据库未初始化",
    message: "本地数据库未正确初始化",
    suggestions: [
      "刷新页面重试",
      "清除浏览器缓存后重试",
      "如果问题持续，请提交Issue"
    ],
    canRetry: true
  },
  "DB_SAVE_FAILED": {
    title: "数据保存失败",
    message: "无法保存数据到本地数据库",
    suggestions: [
      "检查浏览器是否支持IndexedDB",
      "确认有足够的存储空间",
      "尝试清除旧数据后重试"
    ],
    canRetry: true
  },

  // 通用错误
  "UNKNOWN_ERROR": {
    title: "未知错误",
    message: "发生了意外错误",
    suggestions: [
      "刷新页面重试",
      "如果问题持续，请提交Issue并提供错误信息"
    ],
    canRetry: true
  }
}

/**
 * 根据错误代码获取友好的错误信息
 */
export function getFriendlyError(errorCode: string): FriendlyError {
  return ERROR_MAP[errorCode] || ERROR_MAP["UNKNOWN_ERROR"]
}

/**
 * 从错误消息中推断错误代码
 */
export function inferErrorCode(errorMsg: string): string {
  const lowerError = errorMsg.toLowerCase()

  // API Key 相关
  if (lowerError.includes("api key") || lowerError.includes("unauthorized")) {
    if (lowerError.includes("invalid") || lowerError.includes("incorrect")) {
      return "API_KEY_INVALID"
    }
    return "API_KEY_MISSING"
  }

  // 网络/超时
  if (lowerError.includes("network") || lowerError.includes("fetch")) {
    return "NETWORK_ERROR"
  }
  if (lowerError.includes("timeout") || lowerError.includes("timed out")) {
    return "TIMEOUT"
  }

  // 速率限制
  if (lowerError.includes("rate limit") || lowerError.includes("too many requests")) {
    return "RATE_LIMIT_EXCEEDED"
  }

  // 文件相关
  if (lowerError.includes("file too large") || lowerError.includes("size")) {
    return "FILE_TOO_LARGE"
  }
  if (lowerError.includes("file type") || lowerError.includes("csv")) {
    return "INVALID_FILE_TYPE"
  }

  // SQL 相关
  if (lowerError.includes("sql syntax") || lowerError.includes("syntax error")) {
    return "SQL_SYNTAX_ERROR"
  }
  if (lowerError.includes("empty") || lowerError.includes("required")) {
    return "SQL_EMPTY"
  }

  // 字典相关
  if (lowerError.includes("dictionary") || lowerError.includes("field dictionary")) {
    return "DICTIONARY_NOT_FOUND"
  }

  // 默认返回未知错误
  return "UNKNOWN_ERROR"
}

/**
 * 将Error对象转换为友好的错误提示
 */
export function handleErrorMessage(error: Error | string): FriendlyError {
  let errorMsg = ""

  if (typeof error === "string") {
    errorMsg = error
  } else if (error instanceof Error) {
    errorMsg = error.message
  }

  const errorCode = inferErrorCode(errorMsg)
  const friendlyError = getFriendlyError(errorCode)

  // 如果原始错误消息包含额外信息，可以附加到message中
  if (errorMsg && !errorMsg.includes(friendlyError.message)) {
    friendlyError.message = `${friendlyError.message}\n\n详细信息：${errorMsg}`
  }

  return friendlyError
}

/**
 * 获取错误显示组件所需的属性
 */
export function getErrorDisplayProps(error: Error | string) {
  const friendlyError = handleErrorMessage(error)

  return {
    title: friendlyError.title,
    message: friendlyError.message,
    suggestions: friendlyError.suggestions || [],
    canRetry: friendlyError.canRetry,
    severity: friendlyError.canRetry ? "warning" : "error"
  }
}
