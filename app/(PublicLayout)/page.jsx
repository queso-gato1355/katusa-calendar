"use client"

import { useState, useEffect, Suspense } from "react"
import { useTheme } from "@/components/providers/theme-provider"
import {
  HeroSection,
  FeaturesSection,
  HowItWorksSection,
  CalendarsSection,
  FaqSection
} from "@/components/organisms/Sections"
import { supabaseClient } from "@/lib/api/supabase/client"

export default function Home() {
  const { theme, setTheme } = useTheme()
  const [language, setLanguage] = useState("ko")
  const [calendarStatus, setCalendarStatus] = useState({})
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)

  // 컴포넌트 마운트 확인
  useEffect(() => {
    setMounted(true)
  }, [])

  // 언어 및 캘린더 상태 설정
  useEffect(() => {
    // 언어 설정 (기본값: 한국어)
    const savedLanguage = localStorage.getItem("language") || "ko"
    setLanguage(savedLanguage)

    // 캘린더 상태 가져오기
    const fetchCalendarStatus = async () => {
      try {
        const { data, error } = await supabaseClient
          .from("calendar_settings")
          .select("calendar_id, is_active, copy_count")

        if (error) throw error

        // 캘린더 상태 객체 생성
        const statusObj = {}
        if (Array.isArray(data)) {
          data.forEach((item) => {
            statusObj[item.calendar_id] = {
              is_active: item.is_active,
              copy_count: item.copy_count || 0,
            }
          })
        }

        setCalendarStatus(statusObj)
      } catch (error) {
        console.error("Error fetching calendar status:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchCalendarStatus()
  }, [])

  // 마운트되지 않았으면 아무것도 렌더링하지 않음 (hydration 불일치 방지)
  if (!mounted) {
    return null
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <HeroSection theme={theme} language={language} />
      <FeaturesSection theme={theme} language={language} />
      <HowItWorksSection theme={theme} language={language} id="how-it-works" />
      <CalendarsSection
        theme={theme}
        language={language}
        id="calendars"
        calendarStatus={calendarStatus}
        loading={loading}
      />
      <FaqSection theme={theme} language={language} />
    </div>
  )
}
