import { openDB, DBSchema, IDBPDatabase } from "idb"
import { FieldDictionary, ImportRecord } from "@/types"

// Database value types
interface ProjectValue {
  id?: number
  sessionId: string
  sqlContents: Array<{ code: string; description: string }>
  csvFiles: Array<{ name: string; size: number }>
  llmConfig: {
    provider: string
    model: string
  }
  fieldDictionary?: FieldDictionary
  createdAt: string
  updatedAt: string
}

interface ImportRecordValue {
  id?: number
  sessionId: string
  sqlCount: number
  csvCount: number
  status: 'pending' | 'processing' | 'completed' | 'failed'
  createdAt: string
}

interface FieldDictionaryValue {
  id?: number
  sessionId: string
  tableName: string
  tableData: FieldDictionary["tables"][0]
  relationData: FieldDictionary["relations"]
  isComplete: boolean
  createdAt: string
}

interface SQLHistoryValue {
  id?: number
  sessionId: string
  naturalLanguage: string
  generatedSQL: string
  isValid: boolean
  llmProvider: string
  llmModel?: string
  validationMessage?: string
  generatedAt: string
}

interface AppConfigValue {
  key: string
  value: any
  updatedAt?: string
}

/**
 * 数据库 Schema
 */
interface SqlAssistantDB extends DBSchema {
  projects: {
    key: "id"
    value: ProjectValue
    indexes: {
      session_id: string
      created_at: string
    }
  }
  import_records: {
    key: "id"
    value: ImportRecordValue
    indexes: {
      session_id: string
      created_at: string
    }
  }
  field_dictionaries: {
    key: "id"
    value: FieldDictionaryValue
    indexes: {
      session_id: string
      table_name: string
      created_at: string
    }
  }
  sql_history: {
    key: "id"
    value: SQLHistoryValue
    indexes: {
      session_id: string
      generated_at: string
    }
  }
  app_config: {
    key: "key"
    value: AppConfigValue
  }
}

/**
 * 数据库名称和版本
 */
const DB_NAME = "sql-assistant-db"
const DB_VERSION = 2  // 升级版本号

/**
 * 数据库 Schema
 */
const schema: SqlAssistantDB = {
  projects: {
    key: "id",
    value: {} as ProjectValue,
    indexes: {
      session_id: "session_id",
      created_at: "created_at",
    },
  },
  import_records: {
    key: "id",
    value: {} as ImportRecordValue,
    indexes: {
      session_id: "session_id",
      created_at: "created_at",
    },
  },
  field_dictionaries: {
    key: "id",
    value: {} as FieldDictionaryValue,
    indexes: {
      session_id: "session_id",
      table_name: "table_name",
      created_at: "created_at",
    },
  },
  sql_history: {
    key: "id",
    value: {} as SQLHistoryValue,
    indexes: {
      session_id: "session_id",
      generated_at: "generated_at",
    },
  },
  app_config: {
    key: "key",
    value: {} as AppConfigValue,
  },
}

/**
 * 数据库管理类
 */
export class Database {
  private db: IDBPDatabase<SqlAssistantDB> | null = null

  /**
   * 初始化数据库连接
   */
  async init(): Promise<void> {
    if (this.db) return

    this.db = await openDB(DB_NAME, DB_VERSION, {
      upgrade(db, oldVersion, newVersion) {
        console.log(`数据库升级: v${oldVersion} -> v${newVersion}`)

        // 创建项目表（新版本）
        if (!db.objectStoreNames.contains("projects")) {
          console.log("创建 projects 表")
          const projectStore = db.createObjectStore("projects", {
            keyPath: "id",
            autoIncrement: true,
          })
          projectStore.createIndex("session_id", "session_id", { unique: true })
          projectStore.createIndex("created_at", "created_at")
        }

        // 创建导入记录表
        if (!db.objectStoreNames.contains("import_records")) {
          console.log("创建 import_records 表")
          const store = db.createObjectStore("import_records", {
            keyPath: "id",
            autoIncrement: true,
          })
          store.createIndex("session_id", "session_id", { unique: true })
          store.createIndex("created_at", "created_at")
        }

        // 创建字段字典表
        if (!db.objectStoreNames.contains("field_dictionaries")) {
          console.log("创建 field_dictionaries 表")
          const store = db.createObjectStore("field_dictionaries", {
            keyPath: "id",
            autoIncrement: true,
          })
          store.createIndex("session_id", "session_id")
          store.createIndex("table_name", "table_name")
          store.createIndex("created_at", "created_at")
        }

        // 创建 SQL 历史表
        if (!db.objectStoreNames.contains("sql_history")) {
          console.log("创建 sql_history 表")
          const store = db.createObjectStore("sql_history", {
            keyPath: "id",
            autoIncrement: true,
          })
          store.createIndex("session_id", "session_id")
          store.createIndex("generated_at", "generated_at")
        }

        // 创建配置表
        if (!db.objectStoreNames.contains("app_config")) {
          console.log("创建 app_config 表")
          db.createObjectStore("app_config", { keyPath: "key" })
        }

        console.log("数据库表创建完成")
      },
    })

    console.log("数据库初始化完成")
  }

  /**
   * 保存导入记录
   */
  async saveImportRecord(record: Omit<ImportRecord, "id">): Promise<number> {
    await this.init()
    return (await this.db!.add("import_records", record)) as unknown as number
  }

  /**
   * 获取导入记录
   */
  async getImportRecord(sessionId: string): Promise<ImportRecord | undefined> {
    await this.init()
    const result = await this.db!.getFromIndex("import_records", "session_id", sessionId)
    return result ? { ...result, id: result.id || 0 } : undefined
  }

  /**
   * 保存字段字典
   */
  async saveFieldDictionary(dictionary: {
    sessionId: string
    tables: FieldDictionary["tables"]
    relations: FieldDictionary["relations"]
    isComplete: boolean
  }): Promise<number> {
    await this.init()

    const dictionaries = await this.getFieldDictionaries(dictionary.sessionId)

    // 如果已存在，先删除旧的
    for (const dict of dictionaries) {
      await this.db!.delete("field_dictionaries", dict.id as any)
    }

    // 保存新的字典
    let savedCount = 0
    for (const table of dictionary.tables) {
      await this.db!.add("field_dictionaries", {
        sessionId: dictionary.sessionId,
        tableName: table.tableName,
        tableData: table,
        relationData: dictionary.relations,
        isComplete: dictionary.isComplete,
        createdAt: new Date().toISOString(),
      })
      savedCount++
    }

    return savedCount
  }

  /**
   * 获取字段字典
   */
  async getFieldDictionaries(sessionId: string): Promise<
    Array<{
      id: number
      sessionId: string
      tableName: string
      tableData: FieldDictionary["tables"][0]
      relationData: FieldDictionary["relations"]
      createdAt: string
      isComplete: boolean
    }>
  > {
    await this.init()
    const results = await this.db!.getAll("field_dictionaries")
    return results.map(r => ({
      id: r.id || 0,
      sessionId: r.sessionId,
      tableName: r.tableName,
      tableData: r.tableData,
      relationData: r.relationData,
      createdAt: r.createdAt,
      isComplete: r.isComplete,
    }))
  }

  /**
   * 获取完整的字段字典（聚合版本）
   */
  async getCompleteFieldDictionary(
    sessionId: string
  ): Promise<FieldDictionary | null> {
    const dictionaries = await this.getFieldDictionaries(sessionId)

    if (dictionaries.length === 0) {
      return null
    }

    const tables = dictionaries.map((d) => d.tableData)
    const relations = dictionaries[0]?.relationData || []
    const isComplete = dictionaries.every((d) => d.isComplete)

    return {
      sessionId,
      tables,
      relations,
      createdAt: dictionaries[0].createdAt,
      isComplete,
    }
  }

  /**
   * 保存 SQL 生成历史
   */
  async saveSQLHistory(record: {
    sessionId: string
    naturalLanguage: string
    generatedSQL: string
    isValid: boolean
    llmProvider: string
    llmModel?: string
    validationMessage?: string
  }): Promise<number> {
    await this.init()
    return (await this.db!.add("sql_history", {
      ...record,
      generatedAt: new Date().toISOString(),
    })) as unknown as number
  }

  /**
   * 获取 SQL 历史
   */
  async getSQLHistory(sessionId: string): Promise<
    Array<{
      id: number
      sessionId: string
      naturalLanguage: string
      generatedSQL: string
      isValid: boolean
      llmProvider: string
      llmModel?: string
      generatedAt: string
    }>
  > {
    await this.init()
    const results = await this.db!.getAll("sql_history")
    return results.map(r => ({
      id: r.id || 0,
      sessionId: r.sessionId,
      naturalLanguage: r.naturalLanguage,
      generatedSQL: r.generatedSQL,
      isValid: r.isValid,
      llmProvider: r.llmProvider,
      llmModel: r.llmModel,
      generatedAt: r.generatedAt,
    }))
  }

  /**
   * 更新 SQL 校验状态
   */
  async updateSQLValidationStatus(
    id: number,
    isValid: boolean,
    validationMessage?: string
  ): Promise<void> {
    await this.init()
    const record = await this.db!.get("sql_history", id as any)
    if (record) {
      await this.db!.put("sql_history", {
        ...record,
        isValid,
        validationMessage,
      })
    }
  }

  /**
   * 保存配置
   */
  async saveConfig(key: string, value: any): Promise<void> {
    await this.init()
    await this.db!.put("app_config", { key, value })
  }

  /**
   * 获取配置
   */
  async getConfig(key: string): Promise<any> {
    await this.init()
    const record = await this.db!.get("app_config", key as any)
    return record?.value
  }

  /**
   * 清理过期数据（7天前）
   */
  async cleanupOldData(): Promise<void> {
    await this.init()
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - 7)

    const cutoffString = cutoffDate.toISOString()

    // 清理导入记录
    const importRecords = await this.db!.getAll("import_records")
    for (const record of importRecords) {
      if (record.createdAt < cutoffString) {
        await this.db!.delete("import_records", record.id as any)
      }
    }

    // 清理字段字典（通过 session_id）
    const dictionaries = await this.db!.getAll("field_dictionaries")
    for (const dict of dictionaries) {
      const importRecord = await this.getImportRecord(dict.sessionId)
      if (!importRecord || importRecord.createdAt < cutoffString) {
        await this.db!.delete("field_dictionaries", dict.id as any)
      }
    }

    // 清理 SQL 历史
    const sqlHistory = await this.db!.getAll("sql_history")
    for (const record of sqlHistory) {
      if (record.generatedAt < cutoffString) {
        await this.db!.delete("sql_history", record.id as any)
      }
    }
  }

  /**
   * 删除会话的所有数据
   */
  async deleteSession(sessionId: string): Promise<void> {
    await this.init()

    // 删除项目记录
    const project = await this.getProject(sessionId)
    if (project) {
      await this.db!.delete("projects", project.id as any)
    }

    // 删除导入记录
    const importRecord = await this.getImportRecord(sessionId)
    if (importRecord) {
      await this.db!.delete("import_records", importRecord.id as any)
    }

    // 删除字段字典
    const dictionaries = await this.getFieldDictionaries(sessionId)
    for (const dict of dictionaries) {
      await this.db!.delete("field_dictionaries", dict.id as any)
    }

    // 删除 SQL 历史
    const sqlHistory = await this.getSQLHistory(sessionId)
    for (const record of sqlHistory) {
      await this.db!.delete("sql_history", record.id as any)
    }
  }

  /**
   * 保存项目信息
   */
  async saveProject(project: {
    sessionId: string
    sqlContents: Array<{ code: string; description: string }>
    csvFiles: Array<{ name: string; size: number }>
    llmConfig: {
      provider: string
      model: string
    }
    fieldDictionary?: FieldDictionary
  }): Promise<number> {
    await this.init()

    console.log("💾 开始保存项目:", project.sessionId)

    // 检查是否已存在
    const existing = await this.getProject(project.sessionId)
    if (existing) {
      // 更新现有项目
      const updated = {
        ...existing,
        ...project,
        updatedAt: new Date().toISOString(),
      }
      await this.db!.put("projects", updated)
      console.log("✅ 更新项目成功:", project.sessionId, "ID:", existing.id)
      return existing.id
    }

    // 创建新项目
    const id = (await this.db!.add("projects", {
      ...project,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })) as unknown as number
    console.log("✅ 创建新项目成功:", project.sessionId, "ID:", id)
    return id
  }

  /**
   * 获取项目信息
   */
  async getProject(sessionId: string): Promise<any | undefined> {
    await this.init()
    const projects = await this.db!.getAll("projects")
    return projects.find(p => p.sessionId === sessionId)
  }

  /**
   * 获取所有项目
   */
  async getAllProjects(): Promise<
    Array<{
      id: number
      sessionId: string
      sqlContents: Array<{ code: string; description: string }>
      csvFiles: Array<{ name: string; size: number }>
      llmConfig: {
        provider: string
        model: string
      }
      fieldDictionary?: FieldDictionary
      createdAt: string
      updatedAt: string
    }>
  > {
    await this.init()
    const results = await this.db!.getAll("projects")
    return results.map(p => ({
      id: p.id || 0,
      sessionId: p.sessionId,
      sqlContents: p.sqlContents,
      csvFiles: p.csvFiles,
      llmConfig: p.llmConfig,
      fieldDictionary: p.fieldDictionary,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
    }))
  }

  /**
   * 删除项目
   */
  async deleteProject(sessionId: string): Promise<void> {
    await this.init()
    const project = await this.getProject(sessionId)
    if (project) {
      await this.db!.delete("projects", project.id as any)
    }
    // 同时删除相关数据
    await this.deleteSession(sessionId)
  }

  /**
   * 清理7天前的项目
   */
  async cleanOldProjects(): Promise<number> {
    await this.init()
    const projects = await this.getAllProjects()
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    let deletedCount = 0
    for (const project of projects) {
      const createdDate = new Date(project.createdAt)
      if (createdDate < sevenDaysAgo) {
        await this.deleteProject(project.sessionId)
        deletedCount++
      }
    }

    return deletedCount
  }

  /**
   * 获取上次清理时间
   */
  async getLastCleanupTime(): Promise<Date | null> {
    await this.init()
    const config = await this.db!.get("app_config", "last_cleanup" as any)
    return config ? new Date(config.value) : null
  }

  /**
   * 保存清理时间
   */
  async saveLastCleanupTime(): Promise<void> {
    await this.init()
    await this.db!.put("app_config", {
      key: "last_cleanup",
      value: new Date().toISOString(),
    })
  }
}

/**
 * 全局数据库实例（单例）
 */
let dbInstance: Database | null = null

/**
 * 获取数据库实例
 */
export function getDB(): Database {
  if (!dbInstance) {
    dbInstance = new Database()
  }
  return dbInstance
}
