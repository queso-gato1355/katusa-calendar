"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Calendar, Menu, X, Moon, Sun, Globe, ChevronDown } from "lucide-react"
import { languages, getDefaultLanguage } from "@/data/languages"
import { getTranslation } from "@/data/translations"

export default function Header({ theme, toggleTheme, language, setLanguage }) {
  const [mounted, setMounted] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false)

  // Wait for component to mount to access theme
  useEffect(() => {
    setMounted(true)
  }, [])

  const handleLanguageChange = (langCode) => {
    setLanguage(langCode)
    setLanguageMenuOpen(false)
  }

  // 현재 선택된 언어 정보
  const currentLanguage = languages.find((lang) => lang.code === language) || getDefaultLanguage()

  // 헤더 버튼 번역 가져오기
  const headerText = getTranslation("header", language)

  return (
    <>
      <header
        className={`sticky top-0 z-50 w-full border-b ${
          theme === "dark" ? "bg-gray-900/95 border-gray-700" : "bg-white/95 border-gray-200"
        } backdrop-blur supports-[backdrop-filter]:bg-opacity-60`}
      >
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Left section - Logo */}
            <div className="flex items-center gap-2">
              <Calendar className={`h-6 w-6 ${theme === "dark" ? "text-blue-400" : "text-blue-600"}`} />
              <span className="text-xl font-bold">KATUSA Calendar</span>
            </div>

            {/* Middle section - Navigation (centered) */}
            <nav className="hidden absolute left-1/2 transform -translate-x-1/2 md:flex gap-6">
              <Link
                href="#features"
                className={`text-sm font-medium hover:${theme === "dark" ? "text-blue-400" : "text-blue-600"}`}
              >
                기능
              </Link>
              <Link
                href="#how-it-works"
                className={`text-sm font-medium hover:${theme === "dark" ? "text-blue-400" : "text-blue-600"}`}
              >
                사용방법
              </Link>
              <Link
                href="#calendars"
                className={`text-sm font-medium hover:${theme === "dark" ? "text-blue-400" : "text-blue-600"}`}
              >
                캘린더
              </Link>
              <Link
                href="#faq"
                className={`text-sm font-medium hover:${theme === "dark" ? "text-blue-400" : "text-blue-600"}`}
              >
                FAQ
              </Link>
            </nav>

            {/* Right section - Buttons */}
            <div className="flex items-center gap-4">
              {/* Language Selector */}
              {mounted && (
                <div className="relative">
                  <button
                    className={`flex items-center gap-1 p-2 rounded-md ${
                      theme === "dark" ? "hover:bg-gray-800" : "hover:bg-gray-100"
                    }`}
                    onClick={() => setLanguageMenuOpen(!languageMenuOpen)}
                    aria-label="Select language"
                  >
                    <Globe className="h-5 w-5" />
                    <span className="hidden sm:inline-flex items-center gap-1">
                      <span className="mr-1">{currentLanguage.flag}</span>
                      {currentLanguage.name}
                    </span>
                    <ChevronDown className="h-4 w-4" />
                  </button>

                  {/* Language Dropdown Menu */}
                  {languageMenuOpen && (
                    <div
                      className={`absolute right-0 mt-2 w-48 rounded-md shadow-lg ${
                        theme === "dark" ? "bg-gray-800 border border-gray-700" : "bg-white border border-gray-200"
                      }`}
                    >
                      <div className="py-1" role="menu" aria-orientation="vertical">
                        {languages.map((lang) => (
                          <button
                            key={lang.code}
                            className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2 ${
                              lang.code === language
                                ? theme === "dark"
                                  ? "bg-gray-700 text-white"
                                  : "bg-gray-100 text-gray-900"
                                : theme === "dark"
                                  ? "text-gray-200 hover:bg-gray-700"
                                  : "text-gray-700 hover:bg-gray-100"
                            }`}
                            onClick={() => handleLanguageChange(lang.code)}
                            role="menuitem"
                          >
                            <span className="text-lg">{lang.flag}</span>
                            <span>{lang.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Theme Toggle */}
              {mounted && (
                <button
                  className={`p-2 rounded-md ${theme === "dark" ? "hover:bg-gray-800" : "hover:bg-gray-100"}`}
                  onClick={toggleTheme}
                  aria-label="Toggle theme"
                >
                  {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                </button>
              )}

              {/* Mobile Menu Button */}
              <button
                className="md:hidden p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                onClick={() => setMobileMenuOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </button>

              <button
                className={`hidden md:inline-flex h-9 px-3 rounded-md items-center justify-center text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ${
                  theme === "dark"
                    ? "bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-500"
                    : "bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-500"
                }`}
              >
                <Link href="#calendars">{headerText.subscribeButton}</Link>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => setMobileMenuOpen(false)}></div>
          <div
            className={`fixed right-0 top-0 h-full w-3/4 max-w-sm p-6 ${
              theme === "dark" ? "bg-gray-900" : "bg-white"
            } shadow-lg overflow-y-auto`}
          >
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-2">
                <Calendar className={`h-6 w-6 ${theme === "dark" ? "text-blue-400" : "text-blue-600"}`} />
                <span className="text-xl font-bold">KATUSA Calendar</span>
              </div>
              <button
                className={`p-2 rounded-md ${theme === "dark" ? "hover:bg-gray-800" : "hover:bg-gray-100"}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Language Selector in Mobile Menu */}
            <div className="mb-6">
              <div className="text-sm font-medium text-gray-500 mb-2">언어 선택</div>
              <div className="grid grid-cols-2 gap-2">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    className={`flex items-center gap-2 p-2 rounded-md ${
                      lang.code === language
                        ? theme === "dark"
                          ? "bg-gray-700 text-white"
                          : "bg-gray-100 text-gray-900"
                        : theme === "dark"
                          ? "text-gray-200 hover:bg-gray-700"
                          : "text-gray-700 hover:bg-gray-100"
                    }`}
                    onClick={() => {
                      handleLanguageChange(lang.code)
                    }}
                  >
                    <span className="text-lg">{lang.flag}</span>
                    <span className="text-sm">{lang.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <nav className="flex flex-col gap-6">
              <Link
                href="#features"
                className={`text-lg font-medium hover:${theme === "dark" ? "text-blue-400" : "text-blue-600"}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                기능
              </Link>
              <Link
                href="#how-it-works"
                className={`text-lg font-medium hover:${theme === "dark" ? "text-blue-400" : "text-blue-600"}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                사용방법
              </Link>
              <Link
                href="#calendars"
                className={`text-lg font-medium hover:${theme === "dark" ? "text-blue-400" : "text-blue-600"}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                캘린더
              </Link>
              <Link
                href="#faq"
                className={`text-lg font-medium hover:${theme === "dark" ? "text-blue-400" : "text-blue-600"}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                FAQ
              </Link>
            </nav>
            <div className="mt-auto pt-8">
              <button
                className={`w-full h-10 px-4 py-2 rounded-md flex items-center justify-center text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
                  theme === "dark"
                    ? "bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-500"
                    : "bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-500"
                }`}
                onClick={() => {
                  document.getElementById("calendars").scrollIntoView({ behavior: "smooth" })
                  setMobileMenuOpen(false)
                }}
              >
                {headerText.subscribeButton}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
