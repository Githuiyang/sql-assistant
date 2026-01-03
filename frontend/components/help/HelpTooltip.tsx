"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { HelpCircle, Keyboard, FileText, Settings, Zap } from "lucide-react"

interface Shortcut {
  key: string
  description: string
}

const SHORTCUTS: Shortcut[] = [
  { key: "Ctrl + Enter", description: "生成SQL" },
  { key: "Ctrl + S", description: "保存内容" },
  { key: "Ctrl + K", description: "打开命令面板" },
  { key: "Ctrl + /", description: "显示快捷键列表" },
]

interface HelpTooltipProps {
  type?: "general" | "import" | "dictionary" | "generate" | "history"
}

export function HelpTooltip({ type = "general" }: HelpTooltipProps) {
  const [open, setOpen] = useState(false)

  const getTitle = () => {
    switch (type) {
      case "import":
        return "导入数据帮助"
      case "dictionary":
        return "字段字典帮助"
      case "generate":
        return "SQL生成帮助"
      case "history":
        return "历史记录帮助"
      default:
        return "使用帮助"
    }
  }

  const getContent = () => {
    switch (type) {
      case "import":
        return [
          {
            icon: <FileText className="h-4 w-4" />,
            title: "粘贴SQL语句",
            description: "支持粘贴多段 CREATE TABLE 语句，系统会自动识别表结构"
          },
          {
            icon: <FileText className="h-4 w-4" />,
            title: "上传CSV文件",
            description: "上传对应的CSV文件，帮助系统理解数据类型和取值范围"
          },
          {
            icon: <Zap className="h-4 w-4" />,
            title: "使用示例数据",
            description: "点击「使用示例数据」按钮，即可快速体验完整功能"
          },
          {
            icon: <Settings className="h-4 w-4" />,
            title: "数据清理",
            description: "导入的数据会在7天后自动清理，保护您的隐私"
          }
        ]
      case "dictionary":
        return [
          {
            icon: <Zap className="h-4 w-4" />,
            title: "自动生成",
            description: "系统会分析SQL和CSV，自动提取表、字段、关系等信息"
          },
          {
            icon: <Settings className="h-4 w-4" />,
            title: "在线编辑",
            description: "可以修改字段描述、添加自定义字段、编辑表关系"
          },
          {
            icon: <FileText className="h-4 w-4" />,
            title: "导出字典",
            description: "支持导出为CSV或Excel格式，方便离线查看"
          }
        ]
      case "generate":
        return [
          {
            icon: <FileText className="h-4 w-4" />,
            title: "自然语言输入",
            description: "用日常语言描述查询需求，例如「查询所有订单金额大于1000的用户」"
          },
          {
            icon: <Zap className="h-4 w-4" />,
            title: "智能生成",
            description: "AI会基于字段字典生成符合语法的SQL语句"
          },
          {
            icon: <Settings className="h-4 w-4" />,
            title: "错误修复",
            description: "如果SQL执行出错，可以粘贴错误信息，系统会自动修复"
          },
          {
            icon: <FileText className="h-4 w-4" />,
            title: "历史记录",
            description: "所有生成的SQL都会保存，方便查看和复用"
          }
        ]
      case "history":
        return [
          {
            icon: <FileText className="h-4 w-4" />,
            title: "查看历史",
            description: "按时间倒序查看所有导入记录和SQL生成记录"
          },
          {
            icon: <Settings className="h-4 w-4" />,
            title: "删除记录",
            description: "可以删除单个会话的所有数据"
          },
          {
            icon: <Zap className="h-4 w-4" />,
            title: "自动清理",
            description: "7天前的数据会自动清理，保持系统轻量"
          }
        ]
      default:
        return [
          {
            icon: <Zap className="h-4 w-4" />,
            title: "快速开始",
            description: "使用示例数据，3步即可体验完整功能"
          },
          {
            icon: <Settings className="h-4 w-4" />,
            title: "配置API",
            description: "点击设置按钮，配置大模型API密钥"
          },
          {
            icon: <FileText className="h-4 w-4" />,
            title: "导入数据",
            description: "粘贴SQL语句，上传CSV文件"
          },
          {
            icon: <FileText className="h-4 w-4" />,
            title: "生成字典",
            description: "系统自动分析数据，生成字段字典"
          },
          {
            icon: <FileText className="h-4 w-4" />,
            title: "生成SQL",
            description: "用自然语言描述需求，AI生成SQL"
          }
        ]
    }
  }

  const contentItems = getContent()

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
        >
          <HelpCircle className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl bg-card border-minimal">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <HelpCircle className="h-5 w-5 text-primary" />
            <span>{getTitle()}</span>
          </DialogTitle>
          <DialogDescription>
            {type === "general" ? "快速了解如何使用 SQL Assistant" : "当前页面的使用说明"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* 功能说明 */}
          <div className="space-y-3">
            {contentItems.map((item, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 rounded-lg bg-muted/20">
                <div className="text-primary mt-0.5">{item.icon}</div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{item.title}</p>
                  <p className="text-xs text-muted-foreground mt-1">{item.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* 快捷键 */}
          {type === "general" && (
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-sm font-medium text-foreground">
                <Keyboard className="h-4 w-4 text-primary" />
                <span>快捷键</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {SHORTCUTS.map((shortcut, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 rounded bg-background border-minimal"
                  >
                    <code className="text-xs font-mono text-muted-foreground">{shortcut.key}</code>
                    <span className="text-xs text-foreground">{shortcut.description}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 提示 */}
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground leading-relaxed">
                💡 <strong className="text-primary">提示：</strong>
                遇到问题？查看完整的
                <a
                  href="https://github.com/githuiyang/sql-assistant"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline mx-1"
                >
                  GitHub文档
                </a>
                或提交 Issue
              </p>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}
