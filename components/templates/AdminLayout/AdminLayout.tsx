"use client"

import { ReactNode, useState } from "react"
import { useSearchParams } from "next/navigation"
import { AdminSidebar } from "@/components/organisms/Admin/AdminSidebar"
import { useTheme } from "@/components/providers/theme-provider"
import { Toaster } from "react-hot-toast"
import { calendarsData } from "@/lib/constants/calendars"

interface AdminLayoutProps {
  children: ReactNode
  title?: string
  description?: string
  pathname?: string
  showSidebar?: boolean
}

export function AdminLayout({ 
  children, 
  title,
  description,
  pathname,
  showSidebar = true 
}: AdminLayoutProps) {
  const { theme } = useTheme()
  const [activeCalendar, setActiveCalendar] = useState<string | null>(null)
  const searchParams = useSearchParams()
  const calendarParam = searchParams.get("calendar")
  const activeName: Record<
    '/admin/users' | '/admin/calendar-input' | '/admin/inquiries' | '/admin/settings' | '/admin/trash',
    string
  > = {
    '/admin/users': "users",
    '/admin/calendar-input': "calendar-input",
    '/admin/inquiries': "inquiries",
    '/admin/settings': "settings",
    '/admin/trash': "trash",
  }

  // calendarParam이 calendarsData에 존재하면 activeCalendar로 설정
  if (calendarParam && calendarParam !== activeCalendar) {
    setActiveCalendar(calendarParam)
  } else {
    const key = pathname as keyof typeof activeName
    setActiveCalendar(activeName[key] ?? null)
  }
  return (
    <div className="min-h-screen bg-background">
      <div className="flex h-screen">
        {/* 사이드바 */}
        {showSidebar && (
          <div className="w-64 border-r bg-card">
            <AdminSidebar 
              activeCalendar={activeCalendar}
              theme={theme}
            />
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
            {description && (
              <p className="text-sm text-muted-foreground">
                {description}
              </p>
            )}
          </header>

          {/* 페이지 콘텐츠 */}
          <main className="flex-1 overflow-auto p-6">
            {children}
          </main>
        </div>
      </div>
      
      {/* 토스트 알림 */}
      <Toaster position="top-center" reverseOrder={false}/>
    </div>
  )
}