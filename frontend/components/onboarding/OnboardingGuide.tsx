"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { X, ArrowRight, CheckCircle2, Database, Sparkles, Code } from "lucide-react"

interface Step {
  title: string
  description: string
  icon: React.ReactNode
  action?: string
}

const steps: Step[] = [
  {
    title: "导入数据",
    description: "粘贴SQL语句和上传CSV文件，或者使用我们准备的示例数据快速开始",
    icon: <Database className="h-6 w-6" />,
    action: "前往导入"
  },
  {
    title: "生成字典",
    description: "系统自动分析数据结构，生成包含表、字段、关系的字段字典",
    icon: <Sparkles className="h-6 w-6" />,
    action: "下一步"
  },
  {
    title: "生成SQL",
    description: "用自然语言描述查询需求，AI自动生成SQL语句",
    icon: <Code className="h-6 w-6" />,
    action: "开始使用"
  }
]

interface OnboardingGuideProps {
  onComplete?: () => void
}

export function OnboardingGuide({ onComplete }: OnboardingGuideProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // 检查是否已经完成过引导
    const hasCompleted = localStorage.getItem("onboardingCompleted")
    if (!hasCompleted) {
      setIsVisible(true)
    }
  }, [])

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      handleComplete()
    }
  }

  const handleComplete = () => {
    localStorage.setItem("onboardingCompleted", "true")
    setIsVisible(false)
    onComplete?.()
  }

  const handleSkip = () => {
    handleComplete()
  }

  const handleClose = () => {
    setIsVisible(false)
  }

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
      <Card className="w-full max-w-2xl bg-card border-minimal">
        <CardContent className="p-8">
          {/* 关闭按钮 */}
          <div className="absolute top-4 right-4">
            <button
              onClick={handleClose}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* 进度指示器 */}
          <div className="flex items-center justify-center space-x-2 mb-8">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`h-1 flex-1 max-w-20 rounded-full transition-all duration-300 ${
                  index <= currentStep
                    ? "bg-primary"
                    : "bg-muted/30"
                }`}
              />
            ))}
          </div>

          {/* 当前步骤 */}
          <div className="text-center space-y-6">
            {/* 图标 */}
            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                {steps[currentStep].icon}
              </div>
            </div>

            {/* 标题和描述 */}
            <div>
              <h2 className="text-2xl font-semibold text-foreground mb-3">
                {steps[currentStep].title}
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {steps[currentStep].description}
              </p>
            </div>

            {/* 步骤详情 */}
            <div className="bg-muted/20 rounded-lg p-6 text-left space-y-3">
              {currentStep === 0 && (
                <>
                  <div className="flex items-start space-x-3">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <div className="text-sm">
                      <p className="text-foreground font-medium">支持SQL语句</p>
                      <p className="text-muted-foreground mt-1">
                        粘贴至少5段 CREATE TABLE 语句，系统会自动分析表结构
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <div className="text-sm">
                      <p className="text-foreground font-medium">CSV文件上传</p>
                      <p className="text-muted-foreground mt-1">
                        上传对应的CSV文件，帮助系统理解数据类型和取值范围
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle2 className="h-5 w-5 text-success mt-0.5 flex-shrink-0" />
                    <div className="text-sm">
                      <p className="text-foreground font-medium">示例数据</p>
                      <p className="text-muted-foreground mt-1">
                        没有数据？点击"使用示例数据"按钮即可快速体验完整功能
                      </p>
                    </div>
                  </div>
                </>
              )}

              {currentStep === 1 && (
                <>
                  <div className="flex items-start space-x-3">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <div className="text-sm">
                      <p className="text-foreground font-medium">自动识别表结构</p>
                      <p className="text-muted-foreground mt-1">
                        分析SQL中的表名、字段名、数据类型、主键外键关系
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <div className="text-sm">
                      <p className="text-foreground font-medium">智能推断字段含义</p>
                      <p className="text-muted-foreground mt-1">
                        基于表名和字段名，推断每个字段的业务含义和用途
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <div className="text-sm">
                      <p className="text-foreground font-medium">可视化编辑</p>
                      <p className="text-muted-foreground mt-1">
                        可以在线修改字典、添加自定义字段、导出为CSV
                      </p>
                    </div>
                  </div>
                </>
              )}

              {currentStep === 2 && (
                <>
                  <div className="flex items-start space-x-3">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <div className="text-sm">
                      <p className="text-foreground font-medium">自然语言输入</p>
                      <p className="text-muted-foreground mt-1">
                        用日常语言描述需求，例如"查询所有订单金额大于1000的用户"
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <div className="text-sm">
                      <p className="text-foreground font-medium">AI智能生成</p>
                      <p className="text-muted-foreground mt-1">
                        基于字段字典自动生成符合语法的SQL语句
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <div className="text-sm">
                      <p className="text-foreground font-medium">语法校验</p>
                      <p className="text-muted-foreground mt-1">
                        自动检查SQL语法错误，提供修复建议
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* 操作按钮 */}
            <div className="flex items-center justify-center space-x-3">
              <Button
                onClick={handleSkip}
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-foreground"
              >
                跳过引导
              </Button>
              <Button
                onClick={handleNext}
                className="bg-primary text-primary-foreground hover:scale-105 transition-all"
              >
                {steps[currentStep].action || "下一步"}
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
