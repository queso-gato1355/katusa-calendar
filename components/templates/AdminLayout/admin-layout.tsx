"use client"

import { ReactNode, useState, useEffect } from "react"
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

  // useEffect를 사용하여 사이드 이펙트 처리
  useEffect(() => {
    if (calendarParam && calendarsData.some(cal => cal.type === calendarParam)) {
      // calendarParam이 유효한 캘린더 타입인 경우
      setActiveCalendar(calendarParam)
    } else if (pathname) {
      // pathname에 따른 기본 활성 상태 설정
      const key = pathname as keyof typeof activeName
      const defaultActive = activeName[key] ?? null
      setActiveCalendar(defaultActive)
    }
  }, [calendarParam, pathname]) // 의존성 배열로 변경 감지
  return (
    <div className="min-h-screen bg-background/50">
      <div className="flex h-screen">
        {/* 사이드바 */}
        {showSidebar && (
          <div className="w-0 md:w-64 border-r bg-background/50">
            <AdminSidebar 
              activeCalendar={activeCalendar}
              theme={theme}
            />
          </div>
        )}

        {/* 메인 콘텐츠 영역 */}
        <div className="flex-1 flex flex-col">
          {/* 상단 헤더 */}
          <header className="h-20 md:h-16 border-b bg-background/50 px-6 flex flex-col justify-center items-start md:flex-row md:items-center md:justify-between">
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