"use client"

import { useState, useEffect } from "react"
import { MessageSquare } from "lucide-react"
import { calendarsData } from "@/lib/constants/calendars"
import { useLanguage, useTranslation } from "@/components/providers/language-provider"
import { useTheme } from "@/components/providers/theme-provider"
import { TextPlaceholder, useTextWithPlaceholder } from "@/components/atoms/Display/TextPlaceholder"
import CalendarCard from "@/components/molecules/Cards/calendar-card"
import { useCalendarService } from "@/lib/services/calendar"

export default function CalendarsSection() {
  const { theme } = useTheme()
  const { isChangingLanguage } = useLanguage()
  const [copied, setCopied] = useState({})
  const [calendarStatus, setCalendarStatus] = useState({})
  const [loading, setLoading] = useState(true)
  const { fetchCalendarStatus, copyToClipboard, downloadICSFile } = useCalendarService(
    calendarStatus,
    setCalendarStatus,
    copied,
    setCopied,
  )

  // 현재 언어에 맞는 텍스트 가져오기
  const text = useTranslation("calendars")
  
  // 텍스트 플레이스홀더 훅 사용
  const titleText = useTextWithPlaceholder(text.title, isChangingLanguage)
  const descriptionText = useTextWithPlaceholder(text.description, isChangingLanguage)
  const inquiryTitleText = useTextWithPlaceholder(text.inquiryTitle, isChangingLanguage)
  const inquiryDescriptionText = useTextWithPlaceholder(text.inquiryDescription, isChangingLanguage)
  const inquiryButtonText = useTextWithPlaceholder(text.inquiryButton, isChangingLanguage)

  // 캘린더 상태 가져오기
  useEffect(() => {
    fetchCalendarStatus()
      .then(() => setLoading(false))
      .catch(() => setLoading(false))
  }, [])

  // 캘린더 활성화 상태 확인
  const isCalendarActive = (id) => {
    return !calendarStatus[id] || calendarStatus[id].is_active !== false
  }

  return (
    <section
      id="calendars"
      className={`w-full py-12 md:py-24 lg:py-32 ${theme === "dark" ? "bg-gray-800/40" : "bg-gray-100/40"}`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
              <TextPlaceholder isChanging={isChangingLanguage}>
                {titleText}
              </TextPlaceholder>
            </h2>
            <TextPlaceholder isChanging={isChangingLanguage}>
              <p
                className={`max-w-[900px] ${
                  theme === "dark" ? "text-gray-300" : "text-gray-600"
                } md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed`}
              >
                  {descriptionText}
              </p>
            </TextPlaceholder>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {Array.isArray(calendarsData) &&
            calendarsData.map((calendar) => (
              <CalendarCard
                key={calendar.id}
                theme={theme}
                isChangingLanguage={isChangingLanguage}
                calendar={calendar}
                copied={copied}
                copyToClipboard={(link, id) => copyToClipboard(link, id)}
                downloadICSFile={(link, id, title) => downloadICSFile(link, id, title)}
                isActive={isCalendarActive(calendar.id)}
                text={text}
              />
            ))}

          {/* 문의하기 카드 */}
          <div
            className={`rounded-lg border ${
              theme === "dark" ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200"
            } shadow-sm flex flex-col md:h-[220px] lg:h-[240px]`}
          >
            <div className="flex flex-col space-y-1.5 p-6 flex-grow">
              <h3 className="text-2xl font-semibold leading-none tracking-tight">
                <TextPlaceholder isChanging={isChangingLanguage}>
                  {inquiryTitleText}
                </TextPlaceholder>
              </h3>
              <TextPlaceholder isChanging={isChangingLanguage}>
                <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
                  {inquiryDescriptionText}
                </p>
              </TextPlaceholder>
            </div>
            <div className="p-6 pt-0 mt-auto">
              <a
                href="/contact"
                className={`w-full h-10 px-4 py-2 rounded-md flex items-center justify-center text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
                  theme === "dark"
                    ? "bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-500"
                    : "bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-500"
                }`}
              >
                <MessageSquare className="mr-2 h-4 w-4" />
                <TextPlaceholder isChanging={isChangingLanguage}>
                  {inquiryButtonText}
                </TextPlaceholder>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
