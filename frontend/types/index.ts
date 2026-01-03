// 通用类型
export interface ValidationResult {
  valid: boolean;
  errors?: ValidationError[];
  warnings?: ValidationWarning[];
}

export interface ValidationError {
  line?: number;
  column?: number;
  message: string;
  severity: 'error' | 'warning';
}

export interface ValidationWarning {
  message: string;
  suggestion?: string;
}

// 导入相关类型
export interface SQLContent {
  id: string;
  content: string;
  timestamp: number;
}

export interface CSVFile {
  id: string;
  file: File;
  timestamp: number;
}

export interface ImportValidationResult {
  valid: boolean;
  errors?: {
    sql?: string[];
    csv?: string[];
    match?: string;
  };
  data?: {
    sqlCount: number;
    csvCount: number;
    totalSize: number;
  };
}

// 字段字典相关类型
export interface FieldInfo {
  fieldName: string;
  dataType: string;
  description: string;
  valueRange?: string[];
  sourceSqlId: number;
  isCustom: boolean;
}

export interface TableDictionary {
  tableName: string;
  fields: FieldInfo[];
}

export interface TableRelation {
  fromTable: string;
  fromField: string;
  toTable: string;
  toField: string;
  joinField?: string;
  relationType: '1:1' | '1:N' | 'N:M';
}

export interface FieldDictionary {
  sessionId: string;
  tables: TableDictionary[];
  relations: TableRelation[];
  createdAt: string;
  isComplete: boolean;
  warnings?: string[];
}

export interface DictionaryUpdate {
  tableName: string;
  fieldName: string;
  field: Partial<FieldInfo>;
}

// SQL生成相关类型
export interface SQLGenerationRequest {
  sessionId: string;
  naturalLanguage: string;
  llmProvider: LLMProvider;
  apiKey: string;
  modelName?: string;
}

export interface SQLGenerationResponse {
  success: boolean;
  sql: string;
  isValid: boolean;
  validationMessage?: string;
  explanation?: string;
  warnings?: string[];
}

export interface SQLHistoryRecord {
  id: number;
  sessionId: string;
  naturalLanguage: string;
  sql: string;
  isValid: boolean;
  validationMessage?: string;
  llmProvider: string;
  llmModel?: string;
  generatedAt: string;
}

// LLM相关类型
export type LLMProvider = 'openai' | 'gemini' | 'qianwen' | 'kimi' | 'zhipu';

export interface LLMConfig {
  provider: LLMProvider;
  apiKey: string;
  modelName?: string;
  isActive: boolean;
}

export interface LLMOptions {
  apiKey: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

// 历史记录相关类型
export interface ImportRecord {
  id: number;
  sessionId: string;
  sqlCount: number;
  csvCount: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  createdAt: string;
}

export interface HistoryFilters {
  sessionId?: string;
  startDate?: string;
  endDate?: string;
}

// 配置相关类型
export interface AppConfig {
  cleanupDays: number;
  maxFileSize: number;
  minSqlCount: number;
  minCsvCount: number;
  autoCleanupEnabled: boolean;
}

// CSV解析相关类型
export interface CSVValidationResult {
  isValid: boolean;
  errors: Array<{ message: string; row?: number; type?: string }>;
  data: string[][];
  rowCount: number;
  columnCount?: number;
}

// 应用状态类型
export interface AppState {
  sessionId: string | null;
  dictionary: FieldDictionary | null;
  llmConfig: LLMConfig | null;
  theme: 'light' | 'dark';
  isFirstVisit: boolean;
}
