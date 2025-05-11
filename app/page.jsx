"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"
import HeroSection from "@/components/sections/hero-section"
import FeaturesSection from "@/components/sections/features-section"
import HowItWorksSection from "@/components/sections/how-it-works-section"
import CalendarsSection from "@/components/sections/calendars-section"
import FaqSection from "@/components/sections/faq-section"
import { supabaseClient } from "@/lib/supabaseClient"

export default function Home() {
  const router = useRouter()
  const [theme, setTheme] = useState("light")
  const [language, setLanguage] = useState("ko")
  const [calendarStatus, setCalendarStatus] = useState({})
  const [loading, setLoading] = useState(true)

  // 테마 설정
  useEffect(() => {
    if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setTheme("dark")
      document.documentElement.classList.add("dark")
    }

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

  // 테마 변경 핸들러
  const handleThemeChange = () => {
    const newTheme = theme === "light" ? "dark" : "light"
    setTheme(newTheme)

    if (newTheme === "dark") {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }

    localStorage.theme = newTheme
  }

  // 언어 변경 핸들러
  const handleLanguageChange = (lang) => {
    setLanguage(lang)
    localStorage.setItem("language", lang)
  }

  return (
    <div className={`min-h-screen ${theme === "dark" ? "dark bg-gray-900 text-white" : "bg-gray-50 text-gray-900"}`}>
      <Header
        theme={theme}
        onThemeChange={handleThemeChange}
        language={language}
        onLanguageChange={handleLanguageChange}
      />

      <main>
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
      </main>

      <Footer theme={theme} language={language} />
    </div>
  )
}
