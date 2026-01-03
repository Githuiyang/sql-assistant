/**
 * 查询建议生成 Prompt
 * 基于字段字典生成可能的查询场景建议
 */

export const QUERY_SUGGESTIONS_PROMPT = `你是一个数据分析专家，擅长从数据库表结构中挖掘业务价值。现在需要根据提供的字段字典，生成10个实用的查询场景建议。

## 字段字典

{{FIELD_DICTIONARY}}

## 你的任务

请基于表名、字段名、字段含义、表关联关系，分析并生成10个**实用的、有业务价值的**查询场景建议。

### 分析思路

1. **识别业务实体**：从表名推断业务对象（如users=用户、orders=订单、products=商品）
2. **识别业务流程**：从表关联推断业务流程（如用户→订单→支付）
3. **识别数据维度**：从字段名识别分析维度（如时间、金额、数量、状态）
4. **生成洞察查询**：结合以上信息，生成能帮助业务决策的查询场景

### 建议类型

建议应该涵盖以下类型（尽可能多样化）：

1. **基础查询**：简单的数据检索（如"查询所有VIP用户"）
2. **统计分析**：聚合计算（如"统计每月订单金额"）
3. **趋势分析**：时间序列分析（如"分析用户增长趋势"）
4. **排名榜单**：Top N查询（如"销量Top10商品"）
5. **对比分析**：组间对比（如"对比不同渠道的转化率"）
6. **异常检测**：发现异常数据（如"查找超时未支付的订单"）
7. **关联分析**：多表关联查询（如"查询用户最近购买的商品"）
8. **漏斗分析**：流程转化（如"分析用户注册到首单的转化"）
9. **用户画像**：用户特征分析（如"分析高价值用户的特征"）
10. **数据完整性**：数据质量检查（如"查找缺失信息的记录"）

### 输出格式

请严格按照以下 JSON 格式输出（单行JSON）：

\`\`\`json
{
  "suggestions": [
    {
      "id": 1,
      "title": "简短的业务描述（15字内）",
      "description": "详细说明这个查询能解决什么业务问题",
      "query": "自然语言查询需求描述",
      "category": "统计分析|趋势分析|基础查询|排名榜单|对比分析|异常检测|关联分析|漏斗分析|用户画像|数据完整性",
      "tables": ["表名1", "表名2"],
      "businessValue": "这个查询对业务的价值说明（为什么重要）"
    }
  ],
  "summary": "整体分析总结，说明这些表能支持哪些主要业务场景"
}
\`\`\`

## 示例

### 输入字典
- users表：id, name, email, register_date, status
- orders表：id, user_id, amount, created_at, status
- products表：id, name, price, category
- order_items表：order_id, product_id, quantity

### 输出示例
\`\`\`json
{
  "suggestions": [
    {
      "id": 1,
      "title": "查询高价值用户",
      "description": "找出累计订单金额前100的用户，用于精准营销和VIP服务",
      "query": "查询累计消费金额最高的100个用户",
      "category": "用户画像",
      "tables": ["users", "orders"],
      "businessValue": "识别核心客户群体，提供差异化服务，提升客户满意度和复购率"
    },
    {
      "id": 2,
      "title": "分析月度销售趋势",
      "description": "统计每个月的订单总数和总金额，识别销售季节性波动",
      "query": "统计每个月的订单数量和总销售额，按月份排序",
      "category": "趋势分析",
      "tables": ["orders"],
      "businessValue": "发现销售淡旺季，优化库存管理和营销资源分配"
    },
    {
      "id": 3,
      "title": "查找超时未支付订单",
      "description": "找出创建超过24小时但仍未支付的订单，进行催付提醒",
      "query": "查询创建超过24小时且状态为未支付的订单",
      "category": "异常检测",
      "tables": ["orders"],
      "businessValue": "及时跟进待支付订单，提升订单完成率和回款效率"
    }
  ],
  "summary": "该数据库支持完整的电商业务分析，包括用户价值分析、销售趋势追踪、订单异常监控等核心场景，可支持运营决策和数据分析需求。"
}
\`\`\`

## 注意事项

1. **确保建议实际可执行**：所有查询必须能基于现有字典生成SQL
2. **业务导向**：优先推荐对业务决策有高价值的查询
3. **具体明确**：每个建议要有清晰的业务场景描述
4. **多样化**：10个建议要涵盖不同的查询类型和分析维度
5. **自然语言**：query字段必须是用户会说的自然语言，不要太技术化
6. **单行JSON**：所有JSON内容必须在一行内，不要换行

请生成10个高质量的查询建议。
`;

/**
 * 构建查询建议生成的完整 Prompt
 */
export function buildQuerySuggestionsPrompt(
  fieldDictionary: {
    tables: Array<{
      tableName: string
      fields: Array<{
        fieldName: string
        dataType: string
        description: string
      }>
    }>
    relations: Array<{
      fromTable: string
      fromField: string
      toTable: string
      toField: string
      relationType: string
    }>
  }
): string {
  // 格式化字段字典
  const dictText = `
### 数据表概览:
${fieldDictionary.tables
  .map((table) => `
**${table.tableName}**
- 字段: ${table.fields.map(f => f.fieldName).join(", ")}
- 主要字段含义: ${table.fields.slice(0, 5).map(f => `${f.fieldName}(${f.description})`).join("; ")}${table.fields.length > 5 ? "..." : ""}
`)
  .join("\n")}

### 表关联关系:
${fieldDictionary.relations.length > 0
  ? fieldDictionary.relations
    .map((rel) => `- ${rel.fromTable}.${rel.fromField} → ${rel.toTable}.${rel.toField} (${rel.relationType})`)
    .join("\n")
  : "无明确关联关系"}
`;

  return QUERY_SUGGESTIONS_PROMPT.replace("{{FIELD_DICTIONARY}}", dictText);
}
