"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Header } from "@/components/layout/Header"
import { ImportValidator } from "@/components/import/ImportValidator"
import { LLMConfig } from "@/components/config/LLMConfig"
import { OnboardingGuide } from "@/components/onboarding/OnboardingGuide"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle2, ChevronDown, ChevronUp, Sparkles, Database, Settings, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getSampleSQLCodes, getSampleCSVFiles } from "@/lib/data/sample-data"
import { getDB } from "@/lib/db"

function HomeContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [showSuccess, setShowSuccess] = useState(false)
  const [llmConfigured, setLLMConfigured] = useState(false)
  const [showConfig, setShowConfig] = useState(false)
  const [loadingSample, setLoadingSample] = useState(false)

  // 生成唯一ID
  const generateSessionId = () => {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  // 使用示例数据
  const handleUseSampleData = async () => {
    setLoadingSample(true)
    try {
      const sampleSQLs = getSampleSQLCodes()
      const sampleCSVs = getSampleCSVFiles()
      const sessionId = generateSessionId()

      // 保存SQL内容
      const sqlContents = sampleSQLs.map((code, index) => ({
        code,
        description: `示例表 ${index + 1}`
      }))

      // 保存CSV文件信息
      const csvFiles = sampleCSVs.map(file => ({
        name: file.name,
        size: file.size
      }))

      // 保存当前会话到localStorage
      localStorage.setItem("currentSession", JSON.stringify({
        id: sessionId,
        sqlContents,
        csvFiles,
        createdAt: new Date().toISOString()
      }))

      // 显示成功提示并跳转
      setShowSuccess(true)
      setTimeout(() => {
        router.push("/dictionary")
      }, 2000)
    } catch (error) {
      console.error("Failed to load sample data:", error)
      alert("加载示例数据失败，请重试")
    } finally {
      setLoadingSample(false)
    }
  }

  // 首次访问或URL有#config时显示配置
  useEffect(() => {
    const hasConfig = searchParams.get("config") === "true"
    const savedConfig = localStorage.getItem("llmConfig")

    if (!savedConfig || hasConfig) {
      setShowConfig(true)
    }

    if (savedConfig) {
      setLLMConfigured(true)
    }
  }, [searchParams])

  const handleValidationComplete = (isValid: boolean, data?: { sqlContents: Array<{ code: string; description: string }>; csvFiles: File[] }) => {
    if (isValid && data) {
      setShowSuccess(true)

      // 3秒后跳转到字典页面
      setTimeout(() => {
        router.push("/dictionary")
      }, 3000)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <OnboardingGuide />

      <main className="container mx-auto px-4 py-12">
        {/* Hero Section - 极简科技风 */}
        <div className="text-center mb-12 animate-slide-up">
          <div className="inline-block mb-4 px-3 py-1 border-minimal rounded text-[10px] font-mono tracking-widest text-muted-foreground uppercase">
            Intelligent SQL Generation
          </div>
          <h1 className="text-4xl md:text-5xl font-light tracking-tight text-foreground mb-6">
            SQL Assistant
          </h1>
          <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed font-light">
            让非技术人员也能轻松生成SQL查询语句的开源工具
          </p>
        </div>

        {/* 成功提示 */}
        {showSuccess && (
          <Alert className="mb-8 border-success/30 bg-success/5 animate-slide-up">
            <AlertDescription className="text-success flex items-center justify-center space-x-3 py-2">
              <CheckCircle2 className="h-5 w-5" />
              <span className="text-sm">
                数据验证通过！正在跳转到字段字典页面...
              </span>
            </AlertDescription>
          </Alert>
        )}

        <div className="max-w-4xl mx-auto space-y-8">
          {/* LLM Configuration - 置顶显示 */}
          <div id="config" className="scroll-mt-20 transition-all duration-500">
            <div className="mb-8 relative">
              <div className="text-center">
                <div className="inline-flex items-center justify-center p-3 bg-primary/5 rounded-full mb-4 ring-1 ring-primary/10">
                  <Settings className="h-6 w-6 text-primary" />
                </div>
                <h2 className="text-2xl font-light tracking-tight text-foreground">
                  大模型配置
                </h2>
                <p className="text-xs text-muted-foreground font-mono mt-2 uppercase tracking-wider opacity-70">
                  LLM Configuration & API Setup
                </p>
              </div>

              {/* Collapse Button - Absolute Positioned for Symmetry */}
              {llmConfigured && (
                <div className="absolute right-0 top-1/2 -translate-y-1/2 hidden md:block">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowConfig(!showConfig)}
                    className="text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all"
                  >
                    {showConfig ? (
                      <>
                        <ChevronUp className="h-4 w-4 mr-1" />
                        收起配置
                      </>
                    ) : (
                      <>
                        <ChevronDown className="h-4 w-4 mr-1" />
                        展开配置
                      </>
                    )}
                  </Button>
                </div>
              )}
              
              {/* Mobile Collapse Button */}
              {llmConfigured && (
                <div className="flex justify-center mt-4 md:hidden">
                   <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowConfig(!showConfig)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    {showConfig ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </Button>
                </div>
              )}

              {!llmConfigured && (
                <Alert className="border-warning/30 bg-warning/5 mt-6 max-w-lg mx-auto animate-pulse">
                  <AlertDescription className="text-warning text-xs flex justify-center items-center">
                    <span className="mr-2">⚠️</span> 首次使用请先配置大模型 API 密钥
                  </AlertDescription>
                </Alert>
              )}
            </div>

            <div className={`transition-all duration-500 ease-in-out overflow-hidden ${
              showConfig || !llmConfigured ? "max-h-[800px] opacity-100" : "max-h-0 opacity-0"
            }`}>
              <div className="max-w-2xl mx-auto">
                <LLMConfig
                  showTitle={false}
                  onConfigChange={(config) => setLLMConfigured(!!config)}
                />
              </div>
            </div>
          </div>

          {/* Import Section - 数据上传 */}
          <div className="pt-12 border-t border-dashed border-border/40">
            <div className="mb-10 text-center">
              <div className="inline-flex items-center justify-center p-3 bg-primary/5 rounded-full mb-4 ring-1 ring-primary/10">
                <Upload className="h-6 w-6 text-primary" />
              </div>
              <h2 className="text-2xl font-light tracking-tight text-foreground">
                数据导入
              </h2>
              <p className="text-xs text-muted-foreground font-mono mt-2 uppercase tracking-wider opacity-70">
                Import SQL & CSV Files
              </p>
            </div>

            {/* 示例数据卡片 */}
            <div className="mb-6 p-6 border border-dashed border-primary/30 rounded-lg bg-primary/5 hover:bg-primary/10 transition-all">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                    <Database className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-foreground mb-1">
                      没有数据？使用示例数据快速体验
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      包含5个业务表（用户、产品、订单等）的完整示例，3步即可体验完整功能
                    </p>
                  </div>
                </div>
                <Button
                  onClick={handleUseSampleData}
                  disabled={loadingSample}
                  className="bg-primary text-primary-foreground hover:scale-105 transition-all"
                >
                  {loadingSample ? (
                    <>
                      <Sparkles className="h-4 w-4 mr-2 animate-pulse" />
                      加载中...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />
                      使用示例数据
                    </>
                  )}
                </Button>
              </div>
            </div>

            <ImportValidator
              onValidationComplete={handleValidationComplete}
              minSQLCount={5}
              csvOptional={true}
            />
          </div>
        </div>

        {/* Features - 数据可视化风格 */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <div className="border-minimal bg-card p-6 group hover:border-primary/30 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="w-2 h-2 bg-primary/60 rounded-full"></div>
              <svg className="w-4 h-4 text-primary/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-sm font-semibold text-foreground mb-2 tracking-wide">
              智能生成
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed font-light">
              基于大模型自动分析表结构和字段关系
            </p>
            <div className="mt-4 pt-4 border-minimal border-t">
              <div className="flex items-center space-x-2">
                <div className="h-px bg-primary/20 flex-1"></div>
                <span className="text-[10px] font-mono text-primary/60">AI-POWERED</span>
                <div className="h-px bg-primary/20 flex-1"></div>
              </div>
            </div>
          </div>

          <div className="border-minimal bg-card p-6 group hover:border-primary/30 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="w-2 h-2 bg-success/60 rounded-full"></div>
              <svg className="w-4 h-4 text-success/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-sm font-semibold text-foreground mb-2 tracking-wide">
              隐私安全
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed font-light">
              本地存储，7天自动清理，数据安全有保障
            </p>
            <div className="mt-4 pt-4 border-minimal border-t">
              <div className="flex items-center space-x-2">
                <div className="h-px bg-success/20 flex-1"></div>
                <span className="text-[10px] font-mono text-success/60">SECURE</span>
                <div className="h-px bg-success/20 flex-1"></div>
              </div>
            </div>
          </div>

          <div className="border-minimal bg-card p-6 group hover:border-primary/30 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="w-2 h-2 bg-warning/60 rounded-full"></div>
              <svg className="w-4 h-4 text-warning/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
            </div>
            <h3 className="text-sm font-semibold text-foreground mb-2 tracking-wide">
              灵活配置
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed font-light">
              支持多个大模型，可自定义字段字典
            </p>
            <div className="mt-4 pt-4 border-minimal border-t">
              <div className="flex items-center space-x-2">
                <div className="h-px bg-warning/20 flex-1"></div>
                <span className="text-[10px] font-mono text-warning/60">FLEXIBLE</span>
                <div className="h-px bg-warning/20 flex-1"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-20 pt-8 border-minimal border-t">
          <div className="text-center">
            <p className="text-xs text-muted-foreground font-mono">
              OPEN SOURCE · DATA INTELLIGENCE · SQL GENERATION
            </p>
          </div>
        </footer>
      </main>
    </div>
  )
}

export default function HomePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-sm text-muted-foreground">加载中...</div>
      </div>
    }>
      <HomeContent />
    </Suspense>
  )
}
