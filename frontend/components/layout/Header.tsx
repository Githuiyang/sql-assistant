"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Database, FileText, Wand2, History, Settings, X, Info } from "lucide-react"
import { useTheme } from "@/components/layout/ThemeProvider"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { LLMConfig } from "@/components/config/LLMConfig"
import { cn } from "@/lib/utils"

export function Header() {
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const [showSettings, setShowSettings] = useState(false)

  const navigation = [
    { name: "导入数据", href: "/", icon: FileText },
    { name: "字段字典", href: "/dictionary", icon: Database },
    { name: "生成SQL", href: "/generate", icon: Wand2 },
    { name: "历史记录", href: "/history", icon: History },
    { name: "关于", href: "/about", icon: Info },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-minimal bg-card/50 backdrop-blur-md">
      <div className="container mx-auto px-4">
        <div className="flex h-14 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <Database className="h-6 w-6 text-primary transition-transform duration-200 group-hover:scale-110" />
            <div className="flex flex-col">
              <span className="text-sm font-semibold tracking-tight text-foreground">
                SQL Assistant
              </span>
              <span className="text-[10px] text-muted-foreground tracking-wider uppercase">
                Data Intelligence
              </span>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center space-x-2 px-3 py-1.5 rounded transition-all duration-200",
                    "hover:scale-105",
                    isActive
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  )}
                >
                  <item.icon className="h-3.5 w-3.5" />
                  <span className="text-xs font-medium tracking-wide">{item.name}</span>
                </Link>
              )
            })}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center space-x-2">
            {/* GitHub Link */}
            <Link
              href="https://github.com/githuiyang/sql-assistant"
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1.5 rounded transition-all duration-200 hover:scale-105 text-muted-foreground hover:text-foreground hover:bg-muted/50 text-xs font-medium border border-border"
              aria-label="GitHub Repository"
            >
              GitHub
            </Link>

            {/* Settings Button */}
            <button
              onClick={() => setShowSettings(true)}
              className="p-2 rounded transition-all duration-200 hover:scale-110 text-muted-foreground hover:text-foreground hover:bg-muted/50"
              aria-label="Settings"
            >
              <Settings className="h-4 w-4" />
            </button>

            {/* Theme Toggle */}
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 rounded transition-all duration-200 hover:scale-110 text-muted-foreground hover:text-foreground hover:bg-muted/50"
              aria-label="Toggle theme"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {theme === "dark" ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Settings Dialog */}
      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle>大模型配置</DialogTitle>
                <DialogDescription>
                  配置大模型API密钥和模型选择
                </DialogDescription>
              </div>
              <button
                onClick={() => setShowSettings(false)}
                className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
              >
                <X className="h-4 w-4" />
                <span className="sr-only">关闭</span>
              </button>
            </div>
          </DialogHeader>
          <div className="py-4">
            <LLMConfig showTitle={false} />
          </div>
        </DialogContent>
      </Dialog>
    </header>
  )
}
