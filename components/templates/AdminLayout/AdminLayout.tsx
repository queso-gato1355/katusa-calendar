"use client"

import { ReactNode } from "react"
import { AdminSidebar } from "@/components/organisms/Admin/AdminSidebar"
import { UserMenu } from "@/components/organisms/Admin/UserMenu"
import { Toaster } from "@/components/atoms/Feedback/toaster"

interface AdminLayoutProps {
  children: ReactNode
  title?: string
  showSidebar?: boolean
}

export function AdminLayout({ 
  children, 
  title,
  showSidebar = true 
}: AdminLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <div className="flex h-screen">
        {/* 사이드바 */}
        {showSidebar && (
          <div className="w-64 border-r bg-card">
            <AdminSidebar />
          </div>
        )}

        {/* 메인 콘텐츠 영역 */}
        <div className="flex-1 flex flex-col">
          {/* 상단 헤더 */}
          <header className="h-16 border-b bg-card px-6 flex items-center justify-between">
            {title && (
              <h1 className="text-2xl font-semibold text-foreground">
                {title}
              </h1>
            )}
            <div className="ml-auto">
              <UserMenu />
            </div>
          </header>

          {/* 페이지 콘텐츠 */}
          <main className="flex-1 overflow-auto p-6">
            {children}
          </main>
        </div>
      </div>
      
      {/* 토스트 알림 */}
      <Toaster />
    </div>
  )
}