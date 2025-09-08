import { ReactNode } from "react"
import { Header } from "@/components/organisms/Layout/Header"
import { Footer } from "@/components/organisms/Layout/Footer"
import { Toaster } from "@/components/atoms/Feedback/toaster"
import { ThemeProvider } from "@/components/providers/theme-provider"

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
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <div className={`min-h-screen bg-background flex flex-col ${className}`}>
        {/* 헤더 */}
        {showHeader && <Header />}

        {/* 메인 콘텐츠 */}
        <main className="flex-1">
          {children}
        </main>

        {/* 푸터 */}
        {showFooter && <Footer />}
        
        {/* 토스트 알림 */}
        <Toaster />
      </div>
    </ThemeProvider>
  )
}