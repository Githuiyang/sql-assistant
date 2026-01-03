/**
 * 字段字典生成 Prompt
 * 用于基于 SQL 和 CSV 生成标准化字段字典
 */

export const DICTIONARY_GENERATION_PROMPT = `你是一个数据库专家，现在需要分析提供的 SQL 代码和 CSV 文件，生成一个完整的字段字典。

## ⚠️ 核心提取原则（最高优先级）

### 严格遵循原则
1. **表提取原则**：
   - ✅ 只提取 SQL 中明确通过 CREATE TABLE 或 SELECT FROM 定义的表
   - ❌ 绝对禁止臆造或猜测表名
   - ❌ 绝对禁止从业务含义推断可能存在的表

2. **字段提取原则**：
   - ✅ 只提取 SQL 中明确定义的字段（CREATE TABLE 中的字段或 SELECT 中的字段）
   - ❌ 绝对禁止添加SQL中不存在的字段
   - ❌ 绝对禁止根据业务逻辑推断可能需要的字段
   - ✅ 字段名必须与SQL中完全一致，包括大小写

3. **关联关系提取原则**：
   - ✅ 只提取 SQL 中明确的 JOIN 条件或 FOREIGN KEY 约束
   - ✅ 从 WHERE 子句中提取明确的表关联（如 table1.id = table2.user_id）
   - ❌ 绝对禁止根据字段名相似性猜测关联关系
   - ❌ 绝对禁止根据业务常识推断关联关系

## 输入内容

### SQL 代码及用途说明:
{{SQL_CONTENT}}

### CSV 文件信息:
{{CSV_INFO}}

## 任务要求

### 1. 分析表结构（严格执行）
- 识别 SQL 中涉及的所有表名（仅限明确出现在SQL中的）
- 分析表与表之间的关联关系（仅限SQL中明确写出的JOIN或WHERE条件）
- 确定主键和外键（仅限SQL中明确定义的PRIMARY KEY和FOREIGN KEY）
- **重点参考每个SQL片段的用途说明，理解表和字段的实际业务含义**

### 2. 提取字段信息（严格执行）
对每个表，只提取以下在SQL中明确定义的信息：
- 字段名（必须与SQL中完全一致）
- 数据类型（从SQL定义中提取）
- 字段含义（结合SQL用途说明和字段命名推断，如果不明确标注"需要用户补充"）
- 字段取值范围（从 CSV 文件中分析，如果没有CSV则为空数组）
- 来源的 SQL 语句 ID

### 3. 关联关系提取（严格执行）
- JOIN 关系：从 SQL 的 JOIN ON 或 WHERE 子句中提取
- 格式要求：必须明确写出 fromTable, toTable, joinField
- 关系类型：1:1（一对一）、1:N（一对多）、N:M（多对多）
- 如果SQL中没有明确的关联，relations 数组为空

### 4. 输出格式
请严格按照以下 JSON 格式输出，不要添加任何额外文字：

\`\`\`json
{
  "tables": [
    {
      "tableName": "表名",
      "fields": [
        {
          "fieldName": "字段名",
          "dataType": "数据类型",
          "description": "字段含义",
          "nullable": false,
          "primaryKey": false,
          "valueRange": ["可能的值1", "可能的值2"],
          "sourceSqlId": 0,
          "isCustom": false
        }
      ]
    }
  ],
  "relations": [
    {
      "fromTable": "表A",
      "fromField": "id",
      "toTable": "表B",
      "toField": "a_id",
      "joinField": "id",
      "relationType": "1:N"
    }
  ],
  "isComplete": true,
  "warnings": ["警告信息1"]
}
\`\`\`

## 关键约束
1. **绝对不能添加SQL中不存在的表或字段**
2. **字段名必须与SQL中完全一致，包括大小写和下划线**
3. **如果SQL中没有明确的表关联，relations返回空数组**
4. **对于不明确的字段含义，标注"需要用户补充"而不是猜测**
5. **nullable和primaryKey必须从SQL定义中准确提取，不能猜测**
6. **isCustom始终为false（表示不是用户自定义字段）**

## 注意事项
1. **SQL用途说明非常重要**：它会告诉你这个表在业务中用于什么场景
2. 如果某个字段在SQL中定义了但没有找到，说明提取有误，请重新检查
3. valueRange 从 CSV 文件的实际数据中提取，列出前 20 个不重复的值
4. 如果SQL中没有定义PRIMARY KEY，所有字段的primaryKey都为false
5. 如果SQL中没有定义NOT NULL约束，所有字段的nullable都为true
6. 确保JSON格式正确，可以被 JSON.parse() 直接解析
`;

/**
 * 构建字典生成的完整 Prompt
 */
export function buildDictionaryPrompt(
  sqlContents: Array<{ code: string; description: string }>,
  csvFileInfos: Array<{ name: string; rowCount: number; columns: string[] }>
): string {
  // 格式化 SQL 内容，包含描述
  const sqlText = sqlContents
    .map((sql, index) =>
      `### SQL 段 ${index + 1}:

**用途说明**: ${sql.description || "无"}

**代码内容**:
\`\`\`sql
${sql.code}
\`\`\``
    )
    .join("\n\n---\n\n");

  // 格式化 CSV 信息
  const csvText = csvFileInfos
    .map(
      (csv, index) =>
        `### CSV 文件 ${index + 1}: ${csv.name}\n行数: ${csv.rowCount}\n列: ${csv.columns.join(", ")}`
    )
    .join("\n\n");

  // 替换占位符
  return DICTIONARY_GENERATION_PROMPT.replace("{{SQL_CONTENT}}", sqlText).replace(
    "{{CSV_INFO}}",
    csvText
  );
}

/**
 * CSV 信息提取辅助 Prompt
 */
export const CSV_ANALYSIS_PROMPT = `分析以下 CSV 文件的列信息，提取每个列的:
1. 列名
2. 数据类型（string/number/date/boolean）
3. 前 20 个不重复的值（作为 valueRange）

CSV 文件: {{CSV_FILENAME}}
前 100 行数据:
{{CSV_PREVIEW}}

请以 JSON 格式返回:
\`\`\`json
{
  "columns": [
    {
      "name": "列名",
      "type": "string|number|date|boolean",
      "sampleValues": ["值1", "值2"]
    }
  ]
}
\`\`\`
`;

/**
 * 构建单个 CSV 的分析 Prompt
 */
export function buildCSVAnalysisPrompt(fileName: string, preview: string): string {
  return CSV_ANALYSIS_PROMPT.replace("{{CSV_FILENAME}}", fileName).replace(
    "{{CSV_PREVIEW}}",
    preview
  );
}
