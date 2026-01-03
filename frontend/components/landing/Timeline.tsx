"use client"

interface TimelineItem {
  year: string
  title: string
  description: string
}

interface TimelineProps {
  items: TimelineItem[]
}

export function Timeline({ items }: TimelineProps) {
  return (
    <div className="relative">
      {/* 中线 */}
      <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-px bg-primary/20" />

      {/* 时间线项目 */}
      <div className="space-y-12">
        {items.map((item, index) => (
          <div
            key={index}
            className={`relative flex items-center ${
              index % 2 === 0 ? "flex-row" : "flex-row-reverse"
            }`}
          >
            {/* 内容 */}
            <div className={`w-5/12 ${index % 2 === 0 ? "text-right pr-8" : "text-left pl-8"}`}>
              <div className="bg-card border border-minimal p-6 rounded-lg hover:border-primary/30 transition-all">
                <div className="text-xs font-mono text-primary mb-2">{item.year}</div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
              </div>
            </div>

            {/* 中间圆点 */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full bg-primary border-4 border-background" />

            {/* 空白 */}
            <div className="w-5/12" />
          </div>
        ))}
      </div>
    </div>
  )
}
