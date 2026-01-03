"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Code, Database, Sparkles, Shield, Zap, TrendingUp } from "lucide-react"

interface FeatureCardProps {
  icon: React.ReactNode
  title: string
  description: string
  color: string
}

export function FeatureCard({ icon, title, description, color }: FeatureCardProps) {
  return (
    <Card className={`border-minimal bg-card hover:scale-105 transition-all duration-300 group`}>
      <CardContent className="p-6">
        <div className={`w-12 h-12 rounded-lg ${color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
          {icon}
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
      </CardContent>
    </Card>
  )
}

export const FEATURES = [
  {
    icon: <Sparkles className="h-6 w-6 text-white" />,
    title: "自然语言生成",
    description: "用日常语言描述查询需求，AI自动生成SQL查询语句，零学习成本",
    color: "bg-primary"
  },
  {
    icon: <Database className="h-6 w-6 text-white" />,
    title: "智能字段字典",
    description: "自动分析SQL和CSV结构，生成包含表关系、字段类型的完整字典",
    color: "bg-success"
  },
  {
    icon: <Zap className="h-6 w-6 text-white" />,
    title: "查询智能建议",
    description: "基于数据字典自动生成10+个实用查询场景，发现数据价值",
    color: "bg-warning"
  },
  {
    icon: <Code className="h-6 w-6 text-white" />,
    title: "SQL语法校验",
    description: "实时验证生成的SQL语法，提供错误修复建议",
    color: "bg-info"
  },
  {
    icon: <Shield className="h-6 w-6 text-white" />,
    title: "隐私安全优先",
    description: "数据本地存储，7天自动清理，API密钥不上传",
    color: "bg-purple-600"
  },
  {
    icon: <TrendingUp className="h-6 w-6 text-white" />,
    title: "多模型支持",
    description: "支持OpenAI、Claude、千问、Kimi等6家主流大模型",
    color: "bg-pink-600"
  }
]
