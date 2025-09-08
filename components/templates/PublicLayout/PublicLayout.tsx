"use client"

import { ReactNode, useState, useEffect } from "react"
import { useTheme } from "next-themes"
import { Header, Footer } from "@/components/organisms/Layout"
import { Toaster } from "@/components/atoms/Feedback/toaster"
import { ThemeProvider } from "@/components/providers/theme-provider"
import { getDefaultLanguage } from "@/data/languages"

interface PublicLayoutProps {
  children: ReactNode
  showHeader?: boolean
  showFooter?: boolean
  className?: string
  initialLanguage?: string
}

function PublicLayoutContent({
  children, 
  showHeader = true,
  showFooter = true,
  className = "",
  initialLanguage
}: PublicLayoutProps) {
  const { theme, setTheme } = useTheme()
  const [language, setLanguage] = useState(initialLanguage || getDefaultLanguage().code)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleThemeChange = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  const handleLanguageChange = (langCode: string) => {
    setLanguage(langCode)
  }

  if (!mounted) {
    return null
  }

  return (
    <div className={`min-h-screen bg-background flex flex-col ${className}`}>
      {/* 헤더 */}
      {showHeader && (
        <Header 
          theme={theme}
          onThemeChange={handleThemeChange}
          language={language}
          setLanguage={handleLanguageChange}
        />
      )}

      {/* 메인 콘텐츠 */}
      <main className="flex-1">
        {children}
      </main>

      {/* 푸터 */}
      {showFooter && (
        <Footer 
          theme={theme}
          language={language}
        />
      )}
      
      {/* 토스트 알림 */}
      <Toaster />
    </div>
  )
}

export function PublicLayout(props: PublicLayoutProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <PublicLayoutContent {...props} />
    </ThemeProvider>
  )
}