"use client"

import { useState, useEffect } from "react"
import CalendarView from "@/components/calendar/calendar-view"
import { useTheme } from "@/components/providers/theme-provider"
import { getDefaultLanguage } from "@/lib/constants/languages"
import { getTranslation } from "@/lib/constants/translations"

export default function CalendarPage() {
  const { theme } = useTheme()
  const [language, setLanguage] = useState(getDefaultLanguage().code)
  const [isClient, setIsClient] = useState(false)

  // Wait for component to mount to access theme and language preferences
  useEffect(() => {
    setIsClient(true)

    // Check for saved language preference
    const savedLanguage = localStorage.getItem("language")
    if (savedLanguage) {
      setLanguage(savedLanguage)
    } else {
      // Try to detect browser language
      const browserLang = navigator.language.split("-")[0]
      const supportedLangs = ["ko", "en", "es"]
      if (supportedLangs.includes(browserLang)) {
        setLanguage(browserLang)
      }
    }
  }, [])

  // Save language preference when it changes
  useEffect(() => {
    if (isClient) {
      localStorage.setItem("language", language)
    }
  }, [language, isClient])

  // 현재 언어에 맞는 텍스트 가져오기
  const text = getTranslation("calendarPage", language)

  // Don't render content until client-side hydration is complete
  if (!isClient) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    )
  }

  return (
    <>
      <h1 className="text-3xl font-bold mb-6">{text.title}</h1>
      <p className="mb-6">{text.subtitle}</p>
      <CalendarView theme={theme} language={language} />
    </>
  )
}
