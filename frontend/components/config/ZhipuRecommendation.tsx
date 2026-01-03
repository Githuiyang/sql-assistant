"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Sparkles, ArrowRight, CheckCircle2 } from "lucide-react"
import Link from "next/link"

export function ZhipuRecommendation() {
  return (
    <Card className="bg-gradient-to-br from-primary/10 via-primary/5 to-background border-primary/30 overflow-hidden">
      <CardContent className="p-6 relative">
        {/* 背景装饰 */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary/5 rounded-full blur-2xl" />

        <div className="relative">
          {/* 标题 */}
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-primary" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-foreground">推荐：智谱AI GLM</h4>
              <p className="text-[10px] text-muted-foreground font-mono">RECOMMENDED MODEL</p>
            </div>
          </div>

          {/* 特点列表 */}
          <div className="space-y-2 mb-4">
            <div className="flex items-start space-x-2">
              <CheckCircle2 className="h-3.5 w-3.5 text-success mt-0.5 flex-shrink-0" />
              <span className="text-xs text-foreground">国产大模型，中文理解能力强</span>
            </div>
            <div className="flex items-start space-x-2">
              <CheckCircle2 className="h-3.5 w-3.5 text-success mt-0.5 flex-shrink-0" />
              <span className="text-xs text-foreground">GLM-4 模型性能优异</span>
            </div>
            <div className="flex items-start space-x-2">
              <CheckCircle2 className="h-3.5 w-3.5 text-success mt-0.5 flex-shrink-0" />
              <span className="text-xs text-foreground">新用户免费试用，性价比高</span>
            </div>
          </div>

          {/* CTA */}
          <a
            href="https://www.bigmodel.cn/glm-coding?ic=DNBMCCWOLT"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button
              size="sm"
              className="w-full bg-primary text-primary-foreground hover:scale-105 transition-all"
            >
              <span>获取 API Key</span>
              <ArrowRight className="h-3.5 w-3.5 ml-2" />
            </Button>
          </a>

          {/* 底部提示 */}
          <p className="text-[10px] text-muted-foreground mt-3 text-center leading-relaxed">
            通过此链接注册可获得免费额度
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
