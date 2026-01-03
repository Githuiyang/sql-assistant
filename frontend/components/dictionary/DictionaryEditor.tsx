"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Database, ArrowRight, Download, Save, CheckCircle2, Code, Plus, Trash2, Edit2, X } from "lucide-react"
import { getDB } from "@/lib/db"

interface FieldInfo {
  fieldName: string
  dataType: string
  description: string
  nullable?: boolean
  primaryKey?: boolean
  sourceSqlId?: number
  isCustom?: boolean
}

interface TableInfo {
  tableName: string
  fields: FieldInfo[]
}

interface RelationInfo {
  fromTable: string
  fromField: string
  toTable: string
  toField: string
  relationType: string
  joinField?: string
}

interface FieldDictionary {
  tables: TableInfo[]
  relations: RelationInfo[]
  isComplete: boolean
}

interface DictionaryEditorProps {
  sessionId: string
  dictionary: FieldDictionary
  onDictionaryChange?: (dictionary: FieldDictionary) => void
}

export function DictionaryEditor({ sessionId, dictionary, onDictionaryChange }: DictionaryEditorProps) {
  const router = useRouter()
  const [fieldDescriptions, setFieldDescriptions] = useState<Record<string, string>>({})
  const [saved, setSaved] = useState(false)
  const [activeTab, setActiveTab] = useState(dictionary.tables[0]?.tableName || "")
  const [editingDictionary, setEditingDictionary] = useState<FieldDictionary>(dictionary)
  const [editingTableName, setEditingTableName] = useState<string | null>(null)
  const [newTableName, setNewTableName] = useState("")
  const [showAddTable, setShowAddTable] = useState(false)
  const [showAddField, setShowAddField] = useState<Record<string, boolean>>({})
  const [newField, setNewField] = useState<Record<string, { fieldName: string; dataType: string; description: string }>>({})

  useEffect(() => {
    // Initialize field descriptions and editing dictionary
    const descriptions: Record<string, string> = {}
    dictionary.tables.forEach((table) => {
      table.fields.forEach((field) => {
        descriptions[`${table.tableName}.${field.fieldName}`] = field.description
      })
    })
    setFieldDescriptions(descriptions)
    setEditingDictionary(dictionary)
  }, [dictionary])

  // 更新字段描述
  const handleDescriptionChange = (tableName: string, fieldName: string, value: string) => {
    setFieldDescriptions((prev) => ({
      ...prev,
      [`${tableName}.${fieldName}`]: value,
    }))

    // 更新编辑中的字典
    setEditingDictionary((prev) => ({
      ...prev,
      tables: prev.tables.map((table) =>
        table.tableName === tableName
          ? {
              ...table,
              fields: table.fields.map((field) =>
                field.fieldName === fieldName
                  ? { ...field, description: value, isCustom: true }
                  : field
              ),
            }
          : table
      ),
    }))
  }

  // 删除字段
  const handleDeleteField = (tableName: string, fieldName: string) => {
    if (!confirm(`确定要删除表 ${tableName} 中的字段 ${fieldName} 吗？`)) {
      return
    }

    setEditingDictionary((prev) => ({
      ...prev,
      tables: prev.tables.map((table) =>
        table.tableName === tableName
          ? {
              ...table,
              fields: table.fields.filter((f) => f.fieldName !== fieldName),
            }
          : table
      ),
    }))
  }

  // 添加字段
  const handleAddField = (tableName: string) => {
    const fieldData = newField[tableName]
    if (!fieldData || !fieldData.fieldName || !fieldData.dataType) {
      alert("请填写字段名和数据类型")
      return
    }

    setEditingDictionary((prev) => ({
      ...prev,
      tables: prev.tables.map((table) =>
        table.tableName === tableName
          ? {
              ...table,
              fields: [
                ...table.fields,
                {
                  fieldName: fieldData.fieldName,
                  dataType: fieldData.dataType,
                  description: fieldData.description || "",
                  nullable: true,
                  primaryKey: false,
                  isCustom: true,
                  sourceSqlId: 0,
                },
              ],
            }
          : table
      ),
    }))

    // 清空输入
    setNewField((prev) => ({ ...prev, [tableName]: { fieldName: "", dataType: "", description: "" } }))
    setShowAddField((prev) => ({ ...prev, [tableName]: false }))
  }

  // 删除表
  const handleDeleteTable = (tableName: string) => {
    if (!confirm(`确定要删除表 ${tableName} 吗？这将删除该表的所有字段和相关关联。`)) {
      return
    }

    setEditingDictionary((prev) => ({
      ...prev,
      tables: prev.tables.filter((t) => t.tableName !== tableName),
      relations: prev.relations.filter(
        (r) => r.fromTable !== tableName && r.toTable !== tableName
      ),
    }))

    // 如果删除的是当前激活的tab，切换到第一个表
    if (activeTab === tableName) {
      const remainingTables = editingDictionary.tables.filter((t) => t.tableName !== tableName)
      setActiveTab(remainingTables[0]?.tableName || "")
    }
  }

  // 保存表名修改
  const handleSaveTableName = (oldName: string, newName: string) => {
    if (!newName || newName.trim() === "") {
      alert("表名不能为空")
      return
    }

    if (editingDictionary.tables.some((t) => t.tableName === newName && t.tableName !== oldName)) {
      alert("表名已存在")
      return
    }

    setEditingDictionary((prev) => ({
      ...prev,
      tables: prev.tables.map((table) =>
        table.tableName === oldName
          ? { ...table, tableName: newName.trim() }
          : table
      ),
      relations: prev.relations.map((rel) =>
        rel.fromTable === oldName
          ? { ...rel, fromTable: newName.trim() }
          : rel.toTable === oldName
          ? { ...rel, toTable: newName.trim() }
          : rel
      ),
    }))

    // 更新fieldDescriptions的key
    const newDescriptions: Record<string, string> = {}
    Object.entries(fieldDescriptions).forEach(([key, value]) => {
      if (key.startsWith(`${oldName}.`)) {
        const newKey = key.replace(`${oldName}.`, `${newName}.`)
        newDescriptions[newKey] = value
      } else {
        newDescriptions[key] = value
      }
    })
    setFieldDescriptions(newDescriptions)

    setEditingTableName(null)
    if (activeTab === oldName) {
      setActiveTab(newName.trim())
    }
  }

  // 添加新表
  const handleAddTable = () => {
    if (!newTableName || newTableName.trim() === "") {
      alert("请输入表名")
      return
    }

    if (editingDictionary.tables.some((t) => t.tableName === newTableName.trim())) {
      alert("表名已存在")
      return
    }

    setEditingDictionary((prev) => ({
      ...prev,
      tables: [
        ...prev.tables,
        {
          tableName: newTableName.trim(),
          fields: [],
        },
      ],
    }))

    setNewTableName("")
    setShowAddTable(false)
    setActiveTab(newTableName.trim())
  }

  // 保存到数据库
  const handleSave = async () => {
    const db = getDB()
    await db.init()

    // 合并编辑后的字典和字段描述
    const finalDictionary = {
      ...editingDictionary,
      tables: editingDictionary.tables.map((table) => ({
        ...table,
        fields: table.fields.map((field) => ({
          ...field,
          description: fieldDescriptions[`${table.tableName}.${field.fieldName}`] || field.description,
          sourceSqlId: field.sourceSqlId ?? 0,
          isCustom: field.isCustom ?? false,
        })),
      })),
    }

    await db.saveFieldDictionary({
      sessionId,
      tables: finalDictionary.tables,
      relations: finalDictionary.relations.map((rel) => ({
        ...rel,
        relationType: (rel.relationType as '1:1' | '1:N' | 'N:M'),
      })),
      isComplete: finalDictionary.isComplete,
    })

    // 更新项目信息
    const project = await db.getProject(sessionId)
    if (project) {
      await db.saveProject({
        ...project,
        fieldDictionary: finalDictionary,
      })
    }

    // 通知父组件
    if (onDictionaryChange) {
      onDictionaryChange(finalDictionary)
    }

    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  // 导出CSV
  const handleExport = () => {
    let csv = "Table Name,Field Name,Data Type,Description,Primary Key,Nullable,Custom\n"

    editingDictionary.tables.forEach((table) => {
      table.fields.forEach((field) => {
        csv += `"${table.tableName}","${field.fieldName}","${field.dataType}","${fieldDescriptions[`${table.tableName}.${field.fieldName}`] || field.description}","${field.primaryKey ? 'Yes' : 'No'}","${field.nullable ? 'Yes' : 'No'}","${field.isCustom ? 'Yes' : 'No'}"\n`
      })
    })

    // Add relations
    csv += "\n\nRELATIONSHIPS\n"
    csv += "From Table,From Field,To Table,To Field,Type\n"
    editingDictionary.relations.forEach((rel) => {
      csv += `"${rel.fromTable}","${rel.fromField}","${rel.toTable}","${rel.toField}","${rel.relationType}"\n`
    })

    // Download
    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `field-dictionary-${sessionId}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      {/* 操作栏 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 text-xs text-muted-foreground">
          <Database className="h-4 w-4 text-primary" />
          <span className="font-mono">SESSION: {sessionId}</span>
          <span className="text-muted-foreground">•</span>
          <span className="font-mono">{editingDictionary.tables.length} 表 • {editingDictionary.tables.reduce((sum, t) => sum + t.fields.length, 0)} 字段</span>
        </div>

        <div className="flex items-center space-x-3">
          {saved && (
            <Alert className="border-success/30 bg-success/5 py-2">
              <AlertDescription className="text-success text-xs flex items-center space-x-2">
                <CheckCircle2 className="h-3 w-3" />
                <span>已保存</span>
              </AlertDescription>
            </Alert>
          )}

          <Button
            onClick={() => setShowAddTable(true)}
            variant="outline"
            className="px-4 py-2 text-xs border-dashed border-2 hover:border-primary/50 hover:bg-primary/5 transition-all"
          >
            <Plus className="h-3 w-3 mr-2" />
            添加表
          </Button>

          <Button
            onClick={handleSave}
            className="px-6 py-2 text-xs bg-primary text-primary-foreground hover:scale-105 transition-all"
          >
            <Save className="h-3 w-3 mr-2" />
            保存修改
          </Button>

          <Button
            onClick={handleExport}
            variant="outline"
            className="px-6 py-2 text-xs border-minimal hover:scale-105 transition-all"
          >
            <Download className="h-3 w-3 mr-2" />
            导出 CSV
          </Button>

          <Button
            onClick={() => router.push("/generate")}
            className="px-6 py-2 text-xs bg-success text-success-foreground hover:scale-105 transition-all"
          >
            <Code className="h-3 w-3 mr-2" />
            前往生成SQL
          </Button>
        </div>
      </div>

      {/* 添加新表对话框 */}
      {showAddTable && (
        <Card className="border-minimal bg-card">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Input
                value={newTableName}
                onChange={(e) => setNewTableName(e.target.value)}
                placeholder="输入新表名..."
                className="flex-1 text-xs border-minimal"
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleAddTable()
                }}
              />
              <Button onClick={handleAddTable} className="text-xs bg-primary text-primary-foreground">
                确定
              </Button>
              <Button
                onClick={() => {
                  setShowAddTable(false)
                  setNewTableName("")
                }}
                variant="ghost"
                className="text-xs"
              >
                取消
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 字典内容 */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full justify-start bg-muted/20 border-minimal p-1">
          {editingDictionary.tables.map((table) => (
            <div
              key={table.tableName}
              className="flex items-center group"
            >
              <TabsTrigger
                value={table.tableName}
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-xs pr-6"
              >
                {editingTableName === table.tableName ? (
                  <div className="flex items-center space-x-2">
                    <Input
                      value={table.tableName}
                      onChange={(e) => {
                        setEditingDictionary((prev) => ({
                          ...prev,
                          tables: prev.tables.map((t) =>
                            t.tableName === table.tableName
                              ? { ...t, tableName: e.target.value }
                              : t
                          ),
                        }))
                      }}
                      className="h-6 w-32 text-xs border-primary"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          const target = e.target as HTMLInputElement
                          handleSaveTableName(table.tableName, target.value)
                        } else if (e.key === "Escape") {
                          setEditingTableName(null)
                        }
                      }}
                      autoFocus
                    />
                    <Button
                      size="sm"
                      className="h-5 px-2 text-xs bg-primary text-primary-foreground"
                      onClick={() => handleSaveTableName(table.tableName, table.tableName)}
                    >
                      保存
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-5 px-2 text-xs"
                      onClick={() => setEditingTableName(null)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <span>{table.tableName}</span>
                    <span className="text-[10px] text-muted-foreground">
                      ({table.fields.length})
                    </span>
                  </div>
                )}
              </TabsTrigger>
              <Button
                size="sm"
                variant="ghost"
                className="h-6 px-2 text-muted-foreground hover:text-error opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => setEditingTableName(table.tableName)}
              >
                <Edit2 className="h-3 w-3" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="h-6 px-2 text-muted-foreground hover:text-error opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => handleDeleteTable(table.tableName)}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          ))}
          {editingDictionary.relations.length > 0 && (
            <TabsTrigger
              value="relations"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-xs"
            >
              关系图 ({editingDictionary.relations.length})
            </TabsTrigger>
          )}
        </TabsList>

        {editingDictionary.tables.map((table) => (
          <TabsContent key={table.tableName} value={table.tableName}>
            <Card className="border-minimal bg-card">
              <CardContent className="p-6">
                <div className="mb-4">
                  <h3 className="text-sm font-semibold text-foreground mb-1">
                    {table.tableName}
                  </h3>
                  <p className="text-xs text-muted-foreground font-mono">
                    {table.fields.length} 个字段
                  </p>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow className="border-minimal hover:bg-transparent">
                      <TableHead className="text-xs font-mono text-muted-foreground">
                        FIELD NAME
                      </TableHead>
                      <TableHead className="text-xs font-mono text-muted-foreground">
                        DATA TYPE
                      </TableHead>
                      <TableHead className="text-xs font-mono text-muted-foreground">
                        DESCRIPTION
                      </TableHead>
                      <TableHead className="text-xs font-mono text-muted-foreground">
                        ATTRIBUTES
                      </TableHead>
                      <TableHead className="text-xs font-mono text-muted-foreground w-20">
                        ACTIONS
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {table.fields.map((field) => (
                      <TableRow key={field.fieldName} className="border-minimal">
                        <TableCell className="text-xs font-mono text-foreground">
                          {field.isCustom && (
                            <span className="text-[10px] px-1 py-0.5 bg-warning/20 text-warning rounded mr-2">
                              自定义
                            </span>
                          )}
                          {field.fieldName}
                        </TableCell>
                        <TableCell className="text-xs font-mono text-primary">
                          {field.dataType}
                        </TableCell>
                        <TableCell>
                          <Input
                            value={fieldDescriptions[`${table.tableName}.${field.fieldName}`] || field.description}
                            onChange={(e) => handleDescriptionChange(table.tableName, field.fieldName, e.target.value)}
                            className="text-xs h-8 border-minimal bg-transparent"
                            placeholder="添加描述..."
                          />
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            {field.primaryKey && (
                              <span className="text-[10px] px-2 py-0.5 bg-primary/20 text-primary rounded-sm font-mono">
                                PK
                              </span>
                            )}
                            {field.nullable && (
                              <span className="text-[10px] px-2 py-0.5 bg-muted/50 text-muted-foreground rounded-sm font-mono">
                                NULL
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 px-2 text-muted-foreground hover:text-error"
                            onClick={() => handleDeleteField(table.tableName, field.fieldName)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}

                    {/* 添加新字段输入 */}
                    {showAddField[table.tableName] && (
                      <TableRow className="border-minimal bg-muted/10">
                        <TableCell>
                          <Input
                            value={newField[table.tableName]?.fieldName || ""}
                            onChange={(e) => setNewField((prev) => ({
                              ...prev,
                              [table.tableName]: {
                                ...prev[table.tableName],
                                fieldName: e.target.value,
                              },
                            }))}
                            placeholder="字段名"
                            className="text-xs h-8 border-minimal"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            value={newField[table.tableName]?.dataType || ""}
                            onChange={(e) => setNewField((prev) => ({
                              ...prev,
                              [table.tableName]: {
                                ...prev[table.tableName],
                                dataType: e.target.value,
                              },
                            }))}
                            placeholder="数据类型"
                            className="text-xs h-8 border-minimal"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            value={newField[table.tableName]?.description || ""}
                            onChange={(e) => setNewField((prev) => ({
                              ...prev,
                              [table.tableName]: {
                                ...prev[table.tableName],
                                description: e.target.value,
                              },
                            }))}
                            placeholder="描述"
                            className="text-xs h-8 border-minimal"
                          />
                        </TableCell>
                        <TableCell colSpan={2}>
                          <div className="flex items-center space-x-2">
                            <Button
                              size="sm"
                              onClick={() => handleAddField(table.tableName)}
                              className="text-xs bg-primary text-primary-foreground"
                            >
                              确定
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                setShowAddField((prev) => ({ ...prev, [table.tableName]: false }))
                                setNewField((prev) => ({ ...prev, [table.tableName]: { fieldName: "", dataType: "", description: "" } }))
                              }}
                              className="text-xs"
                            >
                              取消
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>

                {/* 添加字段按钮 */}
                {!showAddField[table.tableName] && (
                  <div className="mt-4 flex justify-center">
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full border-dashed border-2 hover:border-primary/50 hover:bg-primary/5 transition-all"
                      onClick={() => {
                        setShowAddField((prev) => ({ ...prev, [table.tableName]: true }))
                        setNewField((prev) => ({ ...prev, [table.tableName]: { fieldName: "", dataType: "", description: "" } }))
                      }}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      添加字段
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        ))}

        {editingDictionary.relations.length > 0 && (
          <TabsContent value="relations">
            <Card className="border-minimal bg-card">
              <CardContent className="p-6">
                <div className="mb-4">
                  <h3 className="text-sm font-semibold text-foreground mb-1">
                    表关系
                  </h3>
                  <p className="text-xs text-muted-foreground font-mono">
                    {editingDictionary.relations.length} 个关联
                  </p>
                </div>

                <div className="space-y-4">
                  {editingDictionary.relations.map((rel, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-3 p-4 bg-muted/20 border-minimal"
                    >
                      <div className="flex-1">
                        <div className="text-xs font-mono text-foreground">
                          {rel.fromTable}.{rel.fromField}
                        </div>
                      </div>

                      <ArrowRight className="h-4 w-4 text-primary" />

                      <div className="flex-1 text-right">
                        <div className="text-xs font-mono text-foreground">
                          {rel.toTable}.{rel.toField}
                        </div>
                      </div>

                      <div className="ml-4">
                        <span className="text-[10px] px-2 py-1 bg-primary/20 text-primary rounded-sm font-mono">
                          {rel.relationType}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {editingDictionary.relations.length === 0 && (
                  <div className="text-center py-8 text-xs text-muted-foreground">
                    暂无表关联关系
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>

      {/* 完整性提示 */}
      {!editingDictionary.isComplete && (
        <Alert className="border-warning/30 bg-warning/5">
          <AlertDescription className="text-warning text-xs">
            字典可能不完整，请检查并补充字段描述
          </AlertDescription>
        </Alert>
      )}

      {/* 统计信息 */}
      <Alert className="border-info/30 bg-info/5">
        <AlertDescription className="text-xs text-muted-foreground space-y-1">
          <div className="flex items-start space-x-2">
            <div className="w-1.5 h-1.5 bg-info rounded-full mt-1.5 flex-shrink-0"></div>
            <p>
              自定义字段：{editingDictionary.tables.reduce((sum, t) => sum + t.fields.filter(f => f.isCustom).length, 0)} 个
            </p>
          </div>
          <div className="flex items-start space-x-2">
            <div className="w-1.5 h-1.5 bg-info rounded-full mt-1.5 flex-shrink-0"></div>
            <p>
              修改提示：自定义字段将在重新生成字典时被保留
            </p>
          </div>
        </AlertDescription>
      </Alert>
    </div>
  )
}
