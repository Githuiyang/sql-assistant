# SQL Assistant - 清冷科技感设计系统

## 设计理念

这是一个**极简工业科技仪表盘风格**的设计系统，强调精准、数据驱动和技术专业性。灵感来源于精密仪器界面、数据监控面板和工程软件。

---

## 配色方案

### 主色调 - 深黑科技
```css
背景色:
  --background: #0a0a0a  (最深的黑)
  --card: #0f0f0f        (卡片背景)
  --popover: #141414     (弹出层)

文字色:
  --foreground: #e8e8e8  (米白 - 主要文字)
  --muted-foreground: #8a8a8a  (次要文字)
```

### 强调色 - 低饱和度蓝灰
```css
--primary: #5a6b7a        (主强调色 - 蓝灰)
--primary/60: rgba(90, 107, 122, 0.6)
--primary/30: rgba(90, 107, 122, 0.3)
--primary/20: rgba(90, 107, 122, 0.2)
```

### 状态色 - 冷色调
```css
--destructive: 冷灰红 (错误)
--success: 冷青绿   (成功)
--warning: 冷黄     (警告)
--info: 冷蓝       (信息)
```

### 中性色
```css
--muted: 深灰 (静音背景)
--border: 浅灰边框 (极细线)
```

---

## 字体系统

### 主要字体
```css
font-family: 'IBM Plex Sans', system-ui, sans-serif;
```
- **用途**: 所有文本、标题、按钮
- **字重**: 300 (Light), 400 (Regular), 500 (Medium), 600 (SemiBold), 700 (Bold)
- **特点**: 现代、清晰、专业

### 等宽字体
```css
font-family: 'IBM Plex Mono', monospace;
```
- **用途**: 代码、数据、标签、技术说明
- **应用场景**: `.font-mono` class
- **示例**: `UPLOAD SQL`, `AI-POWERED`, `DEVELOPMENT IN PROGRESS`

### 字体层级
```css
/* 大标题 */
.text-4xl { font-size: 2.25rem; font-weight: 300; }

/* 中标题 */
.text-3xl { font-size: 1.875rem; font-weight: 300; }

/* 小标题 */
.text-lg { font-size: 1.125rem; font-weight: 600; }

/* 正文 */
.text-sm { font-size: 0.875rem; font-weight: 400; }

/* 标签/说明 */
.text-xs { font-size: 0.75rem; font-weight: 400; }
```

---

## 视觉元素

### 1. 背景网格
微妙的网格纹理，营造数据仪表盘感：

```css
/* 默认网格 */
background-image:
  linear-gradient(rgba(90, 107, 122, 0.03) 1px, transparent 1px),
  linear-gradient(90deg, rgba(90, 107, 122, 0.03) 1px, transparent 1px);
background-size: 40px 40px;

/* 密集网格 - 可选 */
.bg-grid-dense { background-size: 20px 20px; }
```

### 2. 极简边框
细线边框，不使用阴影：

```css
.border-minimal {
  border: 1px solid rgba(90, 107, 122, 0.2);
}
```

**使用场景**:
- 卡片边框
- 输入框边框
- 分隔线

### 3. 圆角控制
极小的圆角（2-4px）：

```css
--radius: 0.125rem; /* 2px */

rounded: 2px;
rounded-md: 1px;
rounded-lg: 2px;
```

**不使用**: 大圆角（8px+）

### 4. 悬停交互
微妙的缩放效果：

```css
hover:scale-105      /* 放大 5% */
transition-all duration-200  /* 平滑过渡 */
```

**应用元素**:
- 按钮
- 导航链接
- 卡片
- Logo图标

### 5. 自定义滚动条
深色主题滚动条：

```css
.scrollbar-thin::-webkit-scrollbar {
  width: 4px;
  height: 4px;
}

.scrollbar-thin::-webkit-scrollbar-thumb {
  background-color: rgba(90, 107, 122, 0.3);
  border-radius: 2px;
}

.scrollbar-thin::-webkit-scrollbar-thumb:hover {
  background-color: rgba(90, 107, 122, 0.5);
}
```

---

## 布局原则

### 1. 精准对齐
- 使用网格系统（40px基准）
- 保持元素间的视觉平衡
- 标题和装饰条（1px宽）对齐

### 2. 负空间
- 大量留白营造专业感
- 容器内边距: `p-6` (1.5rem)
- 元素间距: `space-x-3` (0.75rem)

### 3. 层次结构
```html
<div class="flex items-center space-x-3 mb-4">
  <div class="w-1 h-12 bg-primary"></div>  {/* 装饰条 */}
  <div>
    <h1 class="text-3xl font-light">标题</h1>
    <p class="text-xs font-mono text-muted-foreground">副标题</p>
  </div>
</div>
```

---

## 组件样式

### 按钮
```css
/* 主按钮 */
bg-primary text-primary-foreground
hover:scale-105 hover:shadow-lg

/* 次按钮 */
border-minimal bg-muted/30
hover:bg-muted/50 hover:scale-105
```

### 卡片
```css
border-minimal bg-card
hover:border-primary/30  /* 悬停时边框变亮 */
```

### 输入框
```css
border-minimal bg-background
focus:ring-1 focus:ring-ring  /* 细环聚焦 */
```

---

## 动画效果

### 进入动画
```css
animate-slide-up  /* 向上滑入 + 淡入 */
animate-fade-in   /* 淡入 */
```

### 过渡效果
```css
transition-all duration-200   /* 快速过渡 */
transition-all duration-300   /* 标准过渡 */
transition-all duration-400   /* 慢速过渡 */
```

### 装饰条动画
```css
.w-1.h-8.bg-primary
group-hover:h-10  /* 悬停时从8px变到10px */
transition-all duration-300
```

---

## 特殊元素

### 1. 标签徽章
```html
<div class="px-3 py-1 border-minimal rounded text-[10px] font-mono tracking-widest uppercase">
  INTELLIGENT SQL GENERATION
</div>
```

### 2. 分隔线
```html
<div class="flex items-center space-x-2">
  <div class="h-px bg-primary/20 flex-1"></div>
  <span class="text-[10px] font-mono">TEXT</span>
  <div class="h-px bg-primary/20 flex-1"></div>
</div>
```

### 3. 状态指示器
```html
<div class="inline-flex items-center space-x-2">
  <div class="w-2 h-2 bg-primary/60 rounded-full animate-pulse"></div>
  <span class="text-xs font-mono">DEVELOPMENT IN PROGRESS</span>
</div>
```

### 4. 装饰点
```html
<div class="w-2 h-2 bg-primary/60 rounded-full"></div>
```

---

## 使用示例

### 页面标题
```tsx
<div className="mb-12 animate-slide-up">
  <div className="flex items-center space-x-3 mb-4">
    <div className="w-1 h-12 bg-primary"></div>
    <div>
      <h1 className="text-3xl font-light tracking-tight text-foreground">
        页面标题
      </h1>
      <p className="text-xs text-muted-foreground font-mono mt-1">
        PAGE TITLE // SUBTITLE
      </p>
    </div>
  </div>
</div>
```

### 卡片组
```tsx
<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
  <div className="border-minimal bg-card p-6 group hover:border-primary/30 transition-all">
    <div className="flex items-center justify-between mb-4">
      <div className="w-2 h-2 bg-primary/60 rounded-full"></div>
      <Icon className="w-4 h-4 text-primary/60" />
    </div>
    <h3 className="text-sm font-semibold mb-2">标题</h3>
    <p className="text-xs text-muted-foreground">描述</p>
  </div>
</div>
```

### 按钮
```tsx
<button className="px-8 py-3 border-minimal bg-primary text-primary-foreground text-sm font-medium transition-all hover:scale-105">
  按钮
</button>
```

---

## 设计原则总结

1. **极简至上** - 移除所有不必要的装饰
2. **精准对齐** - 使用网格系统保持视觉秩序
3. **微妙交互** - 悬停效果要轻微，不过度
4. **冷色调** - 保持专业的科技感
5. **数据优先** - 设计服务于功能
6. **一致性** - 所有元素遵循相同的规则

---

## 文件清单

已更新的文件：
- ✅ `styles/globals.css` - 全局样式和网格背景
- ✅ `tailwind.config.ts` - Tailwind配置
- ✅ `app/layout.tsx` - 字体导入
- ✅ `components/layout/Header.tsx` - 导航栏
- ✅ `app/page.tsx` - 首页
- ✅ `app/dictionary/page.tsx` - 字典页面
- ✅ `app/generate/page.tsx` - 生成页面
- ✅ `app/history/page.tsx` - 历史页面
- ✅ `components/ui/button.tsx` - 按钮组件
- ✅ `components/ui/card.tsx` - 卡片组件
- ✅ `components/ui/input.tsx` - 输入框组件
- ✅ `components/ui/textarea.tsx` - 文本域组件

---

**设计风格**: 清冷科技感 / 极简工业仪表盘
**更新时间**: 2026-01-02
**设计师**: Claude (Frontend Design Skill)
