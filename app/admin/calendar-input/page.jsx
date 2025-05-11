"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { validateAdminSession } from "@/lib/supabase-helpers"
import Sidebar from "@/components/admin/sidebar"
import FiscalYearForm from "@/components/admin/fiscal-year-form"
import { getThemeStyles } from "@/data/admin-ui"

export default function CalendarInputPage() {
  const router = useRouter()
  const [theme, setTheme] = useState("light")
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  // 테마 설정
  useEffect(() => {
    if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setTheme("dark")
      document.documentElement.classList.add("dark")
    }
  }, [])

  // 인증 상태 확인
  useEffect(() => {
    checkAuthentication()
  }, [])

  const checkAuthentication = async () => {
    try {
      // 세션 쿠키에서 토큰 가져오기
      const cookies = document.cookie.split(";").reduce((acc, cookie) => {
        const [key, value] = cookie.trim().split("=")
        acc[key] = value
        return acc
      }, {})

      const sessionToken = cookies["admin_session"]

      if (!sessionToken) {
        // 세션이 없으면 로그인 페이지로 리디렉션
        router.push("/admin/login")
        return
      }

      // 세션 검증
      const { isValid } = await validateAdminSession(sessionToken)

      if (!isValid) {
        // 세션이 유효하지 않으면 로그인 페이지로 리디렉션
        router.push("/admin/login")
        return
      }

      // 인증 성공
      setIsAuthenticated(true)
      setLoading(false)
    } catch (error) {
      console.error("Authentication error:", error)
      router.push("/admin/login")
    }
  }

  // 인증되지 않은 경우 로딩 표시
  if (loading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  // 테마 스타일 가져오기
  const styles = getThemeStyles(theme)

  return (
    <div className={`min-h-screen ${styles.container}`}>
      <Sidebar activeCalendar="calendar-input" theme={theme} />

      <div className="md:ml-64 p-4 md:p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">캘린더 입력</h1>
          <p className="text-sm text-gray-500 mt-1">Fiscal Year 문서를 기반으로 휴일 일정을 입력합니다.</p>
        </div>

        <FiscalYearForm theme={theme} />
      </div>
    </div>
  )
}
