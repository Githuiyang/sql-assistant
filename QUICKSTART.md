# SQL Assistant - 快速开始指南

## 环境要求

- Node.js >= 18.0
- npm >= 9.0
- Docker（可选，用于容器化部署）

## 安装步骤

### 方式1: 本地开发

1. **克隆项目**
```bash
cd "/Volumes/No.2/lihuiyang/Dev/sql assistant/frontend"
```

2. **安装依赖**
```bash
npm install
```

3. **启动开发服务器**
```bash
npm run dev
```

4. **访问应用**
打开浏览器访问 http://localhost:3000

### 方式2: Docker部署

1. **构建并启动**
```bash
cd "/Volumes/No.2/lihuiyang/Dev/sql assistant"
docker-compose up -d
```

2. **访问应用**
打开浏览器访问 http://localhost:3000

3. **查看日志**
```bash
docker-compose logs -f
```

4. **停止服务**
```bash
docker-compose down
```

## 项目结构说明

```
frontend/
├── app/                        # Next.js App Router
│   ├── layout.tsx             # 根布局
│   ├── page.tsx               # 首页（导入页面）
│   ├── dictionary/            # 字段字典页面
│   ├── generate/              # SQL生成页面
│   └── history/               # 历史记录页面
├── components/                 # React组件
│   ├── ui/                    # shadcn/ui基础组件
│   ├── layout/                # 布局组件（Header, ThemeProvider等）
│   ├── import/                # 导入模块组件（待开发）
│   ├── dictionary/            # 字段字典组件（待开发）
│   ├── generate/              # SQL生成组件（待开发）
│   └── common/                # 通用组件（待开发）
├── lib/                        # 工具库
│   ├── utils.ts               # 通用工具函数
│   ├── api/                   # 大模型API封装（待开发）
│   ├── prompts/               # Prompt模板（待开发）
│   ├── validators/            # 校验逻辑（待开发）
│   └── storage/               # 本地存储（待开发）
├── hooks/                      # 自定义Hooks（待开发）
├── types/                      # TypeScript类型定义
├── styles/                     # 样式文件
│   └── globals.css            # 全局样式
└── public/                     # 静态资源
    └── data/                  # 示例数据
        ├── sample-sql.sql     # 5段SQL示例
        └── sample-*.csv       # 5个CSV示例文件
```

## 快速测试

### 1. 测试UI界面
启动项目后，访问以下页面测试路由是否正常：
- http://localhost:3000 - 首页
- http://localhost:3000/dictionary - 字典页面
- http://localhost:3000/generate - 生成页面
- http://localhost:3000/history - 历史记录页面

### 2. 测试主题切换
点击右上角的月亮/太阳图标，测试亮色/暗色主题切换。

### 3. 测试导航
点击顶部导航栏的各个链接，测试页面跳转是否正常。

## 下一步开发计划

### Phase 2: 导入模块（第2周）
- [ ] SQL上传组件（支持代码高亮）
- [ ] CSV上传组件（拖拽支持）
- [ ] 导入校验逻辑
- [ ] 前置提醒弹窗
- [ ] 操作引导（首次使用提示）

### 核心文件清单
开发时需要关注的关键文件：

1. **frontend/components/import/** - 导入模块组件
2. **frontend/lib/validators/** - 校验逻辑
3. **frontend/types/index.ts** - 类型定义
4. **frontend/app/page.tsx** - 首页（需要完善）

## 开发提示

### 代码风格
- 使用TypeScript编写所有组件
- 遵循ESLint规则
- 使用TailwindCSS实用类进行样式设计

### 组件开发
- 优先使用shadcn/ui基础组件
- 复用components/ui/中的组件
- 保持组件单一职责

### 数据存储
- 配置数据：localStorage（API Key等）
- 业务数据：IndexedDB（字典、历史记录等）
- 自动清理：7天后删除所有业务数据

## 常见问题

### Q: 如何添加新的UI组件？
A: 参考 shadcn/ui 官网，使用 `npx shadcn-ui@latest add [component]` 添加组件

### Q: 如何调试？
A: 使用Chrome DevTools，查看Console和Network面板

### Q: 如何测试暗色模式？
A: 点击右上角的月亮图标切换到暗色模式

### Q: 示例数据在哪里？
A: 在 `frontend/public/data/` 目录下

## 技术支持

- 查看文档：[README.md](./README.md)
- 查看需求文档：[readme.md](./readme.md)
- 提交问题：GitHub Issues

---

祝你开发顺利！🚀
