"use client"

import { ReactNode, useState, useEffect } from "react"
import { useTheme } from "@/components/providers/theme-provider"
import Header from "@/components/organisms/Layout/Header/header"
import Footer from "@/components/organisms/Layout/Footer/footer"
import { Toaster } from "react-hot-toast"
import { getDefaultLanguage } from "@/lib/constants/languages"

interface PublicLayoutProps {
  children: ReactNode
  showHeader?: boolean
  showFooter?: boolean
  className?: string
  initialLanguage?: string
}

export function PublicLayout({
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
    
    // 저장된 언어 설정 로드
    const savedLanguage = localStorage.getItem("language")
    if (savedLanguage) {
      setLanguage(savedLanguage)
    }
  }, [])

  const handleThemeChange = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  const handleLanguageChange = (langCode: string) => {
    setLanguage(langCode)
    localStorage.setItem("language", langCode)
  }

  if (!mounted) {
    return null
  }

  return (
    <div className={`min-h-screen bg-background flex flex-col ${theme === "dark" ? "dark bg-gray-900 text-white" : "bg-white text-gray-900"}`}>
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
      <Toaster position="top-center" reverseOrder={false}/>
    </div>
  )
}