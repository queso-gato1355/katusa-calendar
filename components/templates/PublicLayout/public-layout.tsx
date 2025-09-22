"use client"

import { ReactNode, useState, useEffect } from "react"
import { useTheme } from "@/components/providers/theme-provider"
import { useLanguage } from "@/components/providers/language-provider"
import Header from "@/components/organisms/Layout/Header/header"
import Footer from "@/components/organisms/Layout/Footer/footer"
import { Toaster } from "react-hot-toast"
import BasicLoading from "@/components/molecules/BasicLoading"

interface PublicLayoutProps {
  children: ReactNode
  showHeader?: boolean
  showFooter?: boolean
  className?: string
}

export function PublicLayout({
  children, 
  showHeader = true,
  showFooter = true,
  className = ""
}: PublicLayoutProps) {
  const { theme } = useTheme()
  const { isClient } = useLanguage()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // SSR 호환성 체크
  if (!mounted || !isClient) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <BasicLoading />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* 헤더 */}
      {showHeader && <Header />}

      {/* 메인 콘텐츠 */}
      <main className={`flex-1 ${className}`}>
        {children}
      </main>

      {/* 푸터 */}
      {showFooter && <Footer />}
      
      {/* 토스트 알림 */}
      <Toaster position="top-center" reverseOrder={false}/>
    </div>
  )
}