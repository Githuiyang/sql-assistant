"use client"

import { useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Download } from "lucide-react"
import html2canvas from "html2canvas"

export function ShareCard() {
  const cardRef = useRef<HTMLDivElement>(null)
  const [isGenerating, setIsGenerating] = useState(false)

  const handleDownload = async () => {
    if (!cardRef.current) return

    setIsGenerating(true)
    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: "#0a0a0a",
        logging: false,
        useCORS: true,
        allowTaint: true,
      } as any) // 使用 any 绕过类型检查，因为 scale 选项在运行时有效

      const link = document.createElement("a")
      link.download = "sql-assistant-intro.png"
      link.href = canvas.toDataURL("image/png")
      link.click()
    } catch (error) {
      console.error("生成图片失败:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="text-center">
        <Button
          onClick={handleDownload}
          disabled={isGenerating}
          className="bg-primary text-primary-foreground hover:scale-105 transition-all"
        >
          <Download className="h-4 w-4 mr-2" />
          {isGenerating ? "生成中..." : "保存图片"}
        </Button>
        <p className="text-xs text-muted-foreground mt-2">
          保存项目介绍图片，方便分享
        </p>
      </div>

      {/* 可导出的卡片 */}
      <div ref={cardRef} className="flex justify-center">
        <div
          className="w-[600px] bg-[#0a0a0a] p-8 relative overflow-hidden"
          style={{
            fontFamily: "IBM Plex Sans, -apple-system, BlinkMacSystemFont, sans-serif",
          }}
        >
          {/* 背景网格 */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage:
                "linear-gradient(#5a6b7a 1px, transparent 1px), linear-gradient(90deg, #5a6b7a 1px, transparent 1px)",
              backgroundSize: "20px 20px",
            }}
          />

          {/* 装饰性渐变 */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary/5 rounded-full blur-2xl" />

          {/* 内容 */}
          <div className="relative">
            {/* 标题 */}
            <div className="mb-6">
              <div className="flex items-center space-x-2 mb-3">
                <div className="w-1 h-6 bg-[#5a6b7a]" />
                <h1 className="text-3xl font-light text-[#e8e8e8] tracking-tight">
                  SQL Assistant
                </h1>
              </div>
              <p className="text-sm text-[#5a6b7a] ml-3">
                让非技术人员也能轻松生成SQL查询语句
              </p>
            </div>

            {/* 目标用户 */}
            <div className="mb-6 pl-3">
              <h3 className="text-xs font-semibold text-[#5a6b7a] mb-2 uppercase tracking-wider">
                适用人群
              </h3>
              <p className="text-sm text-[#e8e8e8]">
                运营人员 • 产品经理 • 数据工程师
              </p>
            </div>

            {/* 核心功能 */}
            <div className="mb-6 pl-3">
              <h3 className="text-xs font-semibold text-[#5a6b7a] mb-3 uppercase tracking-wider">
                核心功能
              </h3>
              <div className="space-y-2">
                <div className="flex items-start">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#5a6b7a] mt-1.5 mr-2 flex-shrink-0" />
                  <p className="text-sm text-[#e8e8e8]">
                    <span className="font-semibold">自然语言生成SQL</span>
                    <span className="text-[#5a6b7a]"> - 日常语言描述需求即可</span>
                  </p>
                </div>
                <div className="flex items-start">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#5a6b7a] mt-1.5 mr-2 flex-shrink-0" />
                  <p className="text-sm text-[#e8e8e8]">
                    <span className="font-semibold">智能字段分析</span>
                    <span className="text-[#5a6b7a]"> - 基于已有表结构自动生成</span>
                  </p>
                </div>
                <div className="flex items-start">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#5a6b7a] mt-1.5 mr-2 flex-shrink-0" />
                  <p className="text-sm text-[#e8e8e8]">
                    <span className="font-semibold">报错快速修复</span>
                    <span className="text-[#5a6b7a]"> - 根据错误反馈自动调整</span>
                  </p>
                </div>
                <div className="flex items-start">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#5a6b7a] mt-1.5 mr-2 flex-shrink-0" />
                  <p className="text-sm text-[#e8e8e8]">
                    <span className="font-semibold">本地部署</span>
                    <span className="text-[#5a6b7a]"> - 数据安全，完全私密</span>
                  </p>
                </div>
              </div>
            </div>

            {/* 技术特性 */}
            <div className="mb-6 pl-3">
              <h3 className="text-xs font-semibold text-[#5a6b7a] mb-2 uppercase tracking-wider">
                技术特性
              </h3>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 text-xs text-[#e8e8e8] bg-[#5a6b7a]/20 border border-[#5a6b7a]/30 rounded">
                  AI 驱动
                </span>
                <span className="px-3 py-1 text-xs text-[#e8e8e8] bg-[#5a6b7a]/20 border border-[#5a6b7a]/30 rounded">
                  6+ 大模型
                </span>
                <span className="px-3 py-1 text-xs text-[#e8e8e8] bg-[#5a6b7a]/20 border border-[#5a6b7a]/30 rounded">
                  开源免费
                </span>
                <span className="px-3 py-1 text-xs text-[#e8e8e8] bg-[#5a6b7a]/20 border border-[#5a6b7a]/30 rounded">
                  WebAssembly
                </span>
              </div>
            </div>

            {/* 链接 */}
            <div className="pt-4 border-t border-[#5a6b7a]/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-[#5a6b7a]">在线体验</p>
                  <p className="text-sm text-[#e8e8e8] font-mono mt-1">
                    sql-assistant-iota.vercel.app
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-[#5a6b7a]">GitHub</p>
                  <p className="text-sm text-[#e8e8e8] font-mono mt-1">
                    github.com/githuiyang/sql-assistant
                  </p>
                </div>
              </div>
            </div>

            {/* 底部装饰 */}
            <div className="mt-6 pt-4 flex items-center justify-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-[#5a6b7a]" />
              <div className="w-2 h-2 rounded-full bg-[#5a6b7a]/60" />
              <div className="w-2 h-2 rounded-full bg-[#5a6b7a]/30" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
