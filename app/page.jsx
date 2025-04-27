"use client"

import { useState, useEffect } from "react"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"
import HeroSection from "@/components/sections/hero-section"
import FeaturesSection from "@/components/sections/features-section"
import HowItWorksSection from "@/components/sections/how-it-works-section"
import CalendarsSection from "@/components/sections/calendars-section"
import FAQSection from "@/components/sections/faq-section"
import { getDefaultLanguage } from "@/data/languages"

export default function Home() {
  const [theme, setTheme] = useState("light")
  const [language, setLanguage] = useState(getDefaultLanguage().code)

  // Wait for component to mount to access theme and language preferences
  useEffect(() => {
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
      const supportedLangs = ["ko", "en", "ja", "zh"]
      if (supportedLangs.includes(browserLang)) {
        setLanguage(browserLang)
      }
    }
  }, [])

  // Save language preference when it changes
  useEffect(() => {
    localStorage.setItem("language", language)
  }, [language])

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark"
    setTheme(newTheme)
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }

  return (
    <div
      className={`flex min-h-screen flex-col ${theme === "dark" ? "dark bg-gray-900 text-white" : "bg-white text-gray-900"}`}
    >
      <Header theme={theme} toggleTheme={toggleTheme} language={language} setLanguage={setLanguage} />
      <main className="flex-1">
        <HeroSection theme={theme} language={language} />
        <FeaturesSection theme={theme} language={language} />
        <HowItWorksSection theme={theme} language={language} />
        <CalendarsSection theme={theme} language={language} />
        <FAQSection theme={theme} language={language} />
      </main>
      <Footer theme={theme} language={language} />
    </div>
  )
}
