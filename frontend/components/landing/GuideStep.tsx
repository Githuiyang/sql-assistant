"use client"

import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle2 } from "lucide-react"

interface Step {
  step: number
  title: string
  description: string
  tips?: string[]
  image?: string
}

interface GuideStepProps {
  steps: Step[]
}

export function GuideStep({ steps }: GuideStepProps) {
  return (
    <div className="space-y-8">
      {steps.map((item) => (
        <div key={item.step} className="relative">
          <Card className="bg-card border-minimal overflow-hidden">
            <CardContent className="p-0">
              <div className="flex">
                {/* 步骤编号 */}
                <div className="flex-shrink-0 w-24 bg-primary/10 flex flex-col items-center justify-center border-r border-minimal">
                  <div className="text-3xl font-bold text-primary">{item.step}</div>
                  <div className="text-xs text-muted-foreground mt-1">STEP</div>
                </div>

                {/* 内容 */}
                <div className="flex-1 p-6">
                  <h3 className="text-xl font-semibold text-foreground mb-3">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                    {item.description}
                  </p>

                  {item.tips && item.tips.length > 0 && (
                    <div className="bg-muted/20 rounded-lg p-4 space-y-2">
                      <div className="text-xs font-medium text-foreground flex items-center">
                        <CheckCircle2 className="h-4 w-4 mr-2 text-primary" />
                        小贴士
                      </div>
                      {item.tips.map((tip, index) => (
                        <div key={index} className="text-xs text-muted-foreground flex items-start">
                          <span className="text-primary mr-2">•</span>
                          <span>{tip}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 连接线 */}
          {item.step < steps.length && (
            <div className="flex justify-center py-4">
              <div className="w-px h-8 bg-primary/20" />
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
