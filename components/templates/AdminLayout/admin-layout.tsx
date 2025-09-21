"use client"

import { ReactNode, useState, useEffect, Suspense, useCallback } from "react"
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

// SearchParams를 사용하는 별도 컴포넌트
function SearchParamsHandler({ 
  pathname, 
  onActiveCalendarChange 
}: { 
  pathname?: string
  onActiveCalendarChange: (calendar: string | null) => void 
}) {
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

  useEffect(() => {
    if (calendarParam && calendarsData.some(cal => cal.type === calendarParam)) {
      // calendarParam이 유효한 캘린더 타입인 경우
      onActiveCalendarChange(calendarParam)
    } else if (pathname) {
      // pathname에 따른 기본 활성 상태 설정
      const key = pathname as keyof typeof activeName
      const defaultActive = activeName[key] ?? null
      onActiveCalendarChange(defaultActive)
    }
  }, [calendarParam, pathname, onActiveCalendarChange])

  return null
}

// TODO: useSearchParams() should be wrapped in a suspense boundary at page 오류 발생
//       이 파일이 아닐지도 모르지만 문제 해결 필요 (문제 발생은 adminUserPage 빌드 중 발생)
export function AdminLayout({ 
  children, 
  title,
  description,
  pathname,
  showSidebar = true 
}: AdminLayoutProps) {
  const { theme } = useTheme()
  const [activeCalendar, setActiveCalendar] = useState<string | null>(null)

  const handleActiveCalendarChange = useCallback((calendar: string | null) => {
    setActiveCalendar(calendar)
  }, [])
  
  return (
    <div className="min-h-screen bg-background/50">
      {/* Suspense로 SearchParams 핸들러 감싸기 */}
      <Suspense fallback={null}>
        <SearchParamsHandler 
          pathname={pathname}
          onActiveCalendarChange={handleActiveCalendarChange}
        />
      </Suspense>
      
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