"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { FeatureCard, FEATURES } from "@/components/landing/FeatureCard"
import { Timeline } from "@/components/landing/Timeline"
import { GuideStep } from "@/components/landing/GuideStep"
import { ShareCard } from "@/components/landing/ShareCard"
import {
  ArrowRight,
  Download,
  Github,
  Sparkles,
  Users,
  TrendingUp,
  BookOpen,
  MessageCircle,
  Heart,
  CheckCircle2
} from "lucide-react"

export default function AboutPage() {
  // 产品背景时间线
  const backgroundTimeline = [
    {
      year: "问题发现",
      title: "业务人员的困境",
      description: "在数据驱动的时代，业务人员、产品经理、数据分析师经常需要从数据库中提取数据。但大多数人不会写SQL，每次都要依赖技术团队，效率低下。"
    },
    {
      year: "市场调研",
      title: "现有解决方案的不足",
      description: "市面上有一些SQL生成工具，但大多需要云端部署、价格昂贵、或者生成质量不高。我们需要一个免费、开源、本地部署的解决方案。"
    },
    {
      year: "技术选型",
      title: "AI + WebAssembly",
      description: "利用大模型的自然语言理解能力，结合WebAssembly技术的SQL.js实现本地语法校验，打造一个完全运行在浏览器的工具。"
    },
    {
      year: "SQL Assistant",
      title: "开源免费，人人可用",
      description: "经过精心设计，SQL Assistant 诞生了。它不仅是一个工具，更是让非技术人员也能轻松查询数据的赋能平台。"
    }
  ]

  // 快速开始指南
  const quickStartSteps = [
    {
      step: 1,
      title: "准备数据",
      description: "收集你的数据库表结构（CREATE TABLE语句）和对应的CSV示例文件。不想准备？点击「使用示例数据」快速体验！",
      tips: [
        "SQL文件：至少5段 CREATE TABLE 语句",
        "CSV文件：对应的表格数据示例",
        "文件大小：单个CSV不超过10MB"
      ]
    },
    {
      step: 2,
      title: "配置AI模型",
      description: "点击右上角设置，选择你喜爱的大模型提供商，输入API Key。我们支持OpenAI、Claude、千问、Kimi等6家主流厂商。",
      tips: [
        "API Key仅保存在本地浏览器",
        "不会上传到任何服务器",
        "支持切换不同模型对比效果"
      ]
    },
    {
      step: 3,
      title: "生成字段字典",
      description: "系统自动分析SQL结构和CSV数据，生成包含表名、字段、数据类型、关联关系的完整字段字典。你可以在线编辑、添加自定义字段。",
      tips: [
        "自动识别表结构和关系",
        "支持手动编辑和补充",
        "可导出为CSV或Excel"
      ]
    },
    {
      step: 4,
      title: "智能生成SQL",
      description: "用自然语言描述你的查询需求，例如「查询所有订单金额大于1000的用户」，AI会基于字段字典生成准确的SQL语句。",
      tips: [
        "支持自然语言输入",
        "自动语法校验",
        "提供错误修复建议"
      ]
    },
    {
      step: 5,
      title: "探索更多可能",
      description: "查看系统推荐的10+个查询场景，发现数据的价值。所有生成的SQL都会保存到历史记录，方便复用。",
      tips: [
        "智能推荐查询场景",
        "历史记录管理",
        "一键复制和下载"
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-minimal">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="container mx-auto px-4 py-20 relative">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-primary/10 rounded-full border border-primary/20 mb-6">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-xs font-medium text-primary">AI-Powered SQL Generation</span>
            </div>

            <h1 className="text-5xl md:text-6xl font-light tracking-tight text-foreground mb-6">
              SQL Assistant
            </h1>

            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              让非技术人员也能轻松生成SQL查询语句的开源工具
              <br />
              自然语言输入 → AI智能生成 → 即刻使用
            </p>

            <div className="flex items-center justify-center space-x-4 mb-12">
              <Link href="/">
                <Button size="lg" className="bg-primary text-primary-foreground hover:scale-105 transition-all">
                  <Download className="h-5 w-5 mr-2" />
                  立即使用
                </Button>
              </Link>
              <a
                href="https://github.com/your-username/sql-assistant"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button size="lg" variant="outline" className="hover:scale-105 transition-all">
                  <Github className="h-5 w-5 mr-2" />
                  GitHub
                </Button>
              </a>
            </div>

            {/* 统计数据 */}
            <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
              <div>
                <div className="text-3xl font-bold text-foreground">6+</div>
                <div className="text-sm text-muted-foreground mt-1">大模型支持</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-foreground">100%</div>
                <div className="text-sm text-muted-foreground mt-1">本地运行</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-foreground">MIT</div>
                <div className="text-sm text-muted-foreground mt-1">开源免费</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 分享图片 */}
      <section className="py-20 border-b border-minimal">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center space-x-2 mb-4">
              <div className="w-8 h-px bg-primary" />
              <span className="text-xs font-mono text-primary">SHARE</span>
              <div className="w-8 h-px bg-primary" />
            </div>
            <h2 className="text-3xl font-light text-foreground mb-4">
              分享给团队
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              保存项目介绍图片，方便分享给同事或发布到社交媒体
            </p>
          </div>

          <ShareCard />
        </div>
      </section>

      {/* 为什么需要 SQL Assistant */}
      <section className="py-20 border-b border-minimal">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 mb-4">
              <div className="w-8 h-px bg-primary" />
              <span className="text-xs font-mono text-primary">WHY SQL ASSISTANT</span>
              <div className="w-8 h-px bg-primary" />
            </div>
            <h2 className="text-3xl font-light text-foreground mb-4">
              为什么需要 SQL Assistant？
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              在数据驱动的时代，每个人都应该能够自由地查询数据，而不需要掌握复杂的SQL语法
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <Timeline items={backgroundTimeline} />
          </div>
        </div>
      </section>

      {/* 核心功能 */}
      <section className="py-20 border-b border-minimal">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 mb-4">
              <div className="w-8 h-px bg-primary" />
              <span className="text-xs font-mono text-primary">CORE FEATURES</span>
              <div className="w-8 h-px bg-primary" />
            </div>
            <h2 className="text-3xl font-light text-foreground mb-4">
              核心功能特性
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              精心设计的功能，让数据查询变得前所未有的简单
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {FEATURES.map((feature, index) => (
              <FeatureCard
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                color={feature.color}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 快速开始 */}
      <section className="py-20 border-b border-minimal">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 mb-4">
              <div className="w-8 h-px bg-primary" />
              <span className="text-xs font-mono text-primary">QUICK START</span>
              <div className="w-8 h-px bg-primary" />
            </div>
            <h2 className="text-3xl font-light text-foreground mb-4">
              快速开始指南
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              5步上手，轻松生成你的第一条SQL查询
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <GuideStep steps={quickStartSteps} />
          </div>

          <div className="text-center mt-12">
            <Link href="/">
              <Button size="lg" className="bg-primary text-primary-foreground hover:scale-105 transition-all">
                开始使用
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 技术架构 */}
      <section className="py-20 border-b border-minimal">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 mb-4">
              <div className="w-8 h-px bg-primary" />
              <span className="text-xs font-mono text-primary">TECH STACK</span>
              <div className="w-8 h-px bg-primary" />
            </div>
            <h2 className="text-3xl font-light text-foreground mb-4">
              技术架构
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              基于现代Web技术栈，构建高性能、易用的应用
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            <Card className="bg-card border-minimal text-center">
              <CardContent className="p-6">
                <div className="text-2xl font-bold text-primary mb-2">Next.js 14</div>
                <div className="text-xs text-muted-foreground">React框架</div>
              </CardContent>
            </Card>

            <Card className="bg-card border-minimal text-center">
              <CardContent className="p-6">
                <div className="text-2xl font-bold text-success mb-2">shadcn/ui</div>
                <div className="text-xs text-muted-foreground">UI组件库</div>
              </CardContent>
            </Card>

            <Card className="bg-card border-minimal text-center">
              <CardContent className="p-6">
                <div className="text-2xl font-bold text-warning mb-2">sql.js</div>
                <div className="text-xs text-muted-foreground">SQL WebAssembly</div>
              </CardContent>
            </Card>

            <Card className="bg-card border-minimal text-center">
              <CardContent className="p-6">
                <div className="text-2xl font-bold text-info mb-2">IndexedDB</div>
                <div className="text-xs text-muted-foreground">本地数据库</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* 推荐模型 */}
      <section className="py-20 border-b border-minimal">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center space-x-2 mb-4">
                <div className="w-8 h-px bg-primary" />
                <span className="text-xs font-mono text-primary">RECOMMENDED</span>
                <div className="w-8 h-px bg-primary" />
              </div>
              <h2 className="text-3xl font-light text-foreground mb-4">
                推荐使用智谱AI
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                国产大模型，中文理解能力强，新用户免费试用
              </p>
            </div>

            <Card className="bg-gradient-to-br from-primary/10 via-primary/5 to-background border-primary/30 overflow-hidden">
              <CardContent className="p-8 relative">
                {/* 背景装饰 */}
                <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl" />

                <div className="relative">
                  {/* 特性列表 */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="text-center">
                      <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center mx-auto mb-3">
                        <Sparkles className="h-6 w-6 text-primary" />
                      </div>
                      <h4 className="text-sm font-semibold text-foreground mb-2">GLM-4 模型</h4>
                      <p className="text-xs text-muted-foreground">性能优异，中文理解能力强</p>
                    </div>

                    <div className="text-center">
                      <div className="w-12 h-12 rounded-lg bg-success/20 flex items-center justify-center mx-auto mb-3">
                        <CheckCircle2 className="h-6 w-6 text-success" />
                      </div>
                      <h4 className="text-sm font-semibold text-foreground mb-2">免费试用</h4>
                      <p className="text-xs text-muted-foreground">新用户注册可获得免费额度</p>
                    </div>

                    <div className="text-center">
                      <div className="w-12 h-12 rounded-lg bg-warning/20 flex items-center justify-center mx-auto mb-3">
                        <TrendingUp className="h-6 w-6 text-warning" />
                      </div>
                      <h4 className="text-sm font-semibold text-foreground mb-2">性价比高</h4>
                      <p className="text-xs text-muted-foreground">价格实惠，适合长期使用</p>
                    </div>
                  </div>

                  {/* CTA */}
                  <div className="text-center">
                    <a
                      href="https://www.bigmodel.cn/glm-coding?ic=DNBMCCWOLT"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button size="lg" className="bg-primary text-primary-foreground hover:scale-105 transition-all">
                        <Sparkles className="h-5 w-5 mr-2" />
                        立即获取 API Key
                        <ArrowRight className="h-5 w-5 ml-2" />
                      </Button>
                    </a>
                    <p className="text-xs text-muted-foreground mt-4">
                      通过此链接注册可获得免费额度 • 支持SQL Assistant完美运行
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>


      {/* 开源社区 */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-light text-foreground mb-6">
              加入开源社区
            </h2>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              SQL Assistant 是一个开源项目，我们欢迎任何形式的贡献。
              <br />
              无论是提交代码、报告bug、提出建议，还是分享给更多人使用，都是对我们的支持！
            </p>

            <div className="flex items-center justify-center space-x-4 mb-12">
              <a
                href="https://github.com/githuiyang/sql-assistant"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline" size="lg" className="hover:scale-105 transition-all">
                  <Github className="h-5 w-5 mr-2" />
                  Star on GitHub
                </Button>
              </a>
              <a
                href="https://github.com/githuiyang/sql-assistant/issues"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline" size="lg" className="hover:scale-105 transition-all">
                  <MessageCircle className="h-5 w-5 mr-2" />
                  反馈问题
                </Button>
              </a>
            </div>

            <Card className="bg-primary/5 border-primary/20 max-w-2xl mx-auto">
              <CardContent className="p-8">
                <div className="flex items-center justify-center space-x-2 mb-4">
                  <Heart className="h-5 w-5 text-primary" />
                  <span className="text-sm font-medium text-foreground">Made with Love</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  SQL Assistant 由社区驱动，持续迭代优化。
                  <br />
                  如果你觉得这个项目有用，请给我们一个 Star ⭐
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 border-t border-minimal bg-primary/5">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-light text-foreground mb-6">
            准备好了吗？
          </h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            立即开始使用 SQL Assistant，让数据查询变得前所未有的简单
          </p>
          <Link href="/">
            <Button size="lg" className="bg-primary text-primary-foreground hover:scale-105 transition-all">
              <Sparkles className="h-5 w-5 mr-2" />
              开始使用
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
