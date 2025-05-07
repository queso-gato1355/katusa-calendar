"use client"

import { useState, useEffect } from "react"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"
import CalendarView from "@/components/calendar/calendar-view"
import { getDefaultLanguage } from "@/data/languages"
import { getTranslation } from "@/data/translations"

export default function CalendarPage() {
  const [theme, setTheme] = useState("light")
  const [language, setLanguage] = useState(getDefaultLanguage().code)
  const [isClient, setIsClient] = useState(false)

  // Wait for component to mount to access theme and language preferences
  useEffect(() => {
    setIsClient(true)

    // Check if user prefers dark mode
    if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setTheme("dark")
      document.documentElement.classList.add("dark")
    }

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

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark"
    setTheme(newTheme)
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }

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
    <div
      className={`flex min-h-screen flex-col ${theme === "dark" ? "dark bg-gray-900 text-white" : "bg-white text-gray-900"}`}
    >
      <Header theme={theme} toggleTheme={toggleTheme} language={language} setLanguage={setLanguage} />
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">{text.title}</h1>
        <p className="mb-6">{text.description}</p>
        <CalendarView theme={theme} language={language} />
      </main>
      <Footer theme={theme} language={language} />
    </div>
  )
}
