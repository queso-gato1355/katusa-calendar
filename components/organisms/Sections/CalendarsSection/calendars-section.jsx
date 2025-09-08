"use client"

import { useState, useEffect } from "react"
import { MessageSquare } from "lucide-react"
import { calendarsData } from "@/data/calendars"
import { getTranslation } from "@/data/translations"
import CalendarCard from "@/components/ui/calendar-card"
import { useCalendarService } from "@/services/calendar-service"

export default function CalendarsSection({ theme, language = "ko" }) {
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
  const text = getTranslation("calendars", language)

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
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">{text.title}</h2>
            <p
              className={`max-w-[900px] ${
                theme === "dark" ? "text-gray-300" : "text-gray-600"
              } md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed`}
            >
              {text.description}
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {Array.isArray(calendarsData) &&
            calendarsData.map((calendar) => (
              <CalendarCard
                key={calendar.id}
                theme={theme}
                calendar={calendar}
                copied={copied}
                copyToClipboard={(link, id) => copyToClipboard(link, id)}
                downloadICSFile={(link, id, title) => downloadICSFile(link, id, title)}
                isActive={isCalendarActive(calendar.id)}
                text={text}
                language={language}
              />
            ))}

          {/* 문의하기 카드 */}
          <div
            className={`rounded-lg border ${
              theme === "dark" ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200"
            } shadow-sm flex flex-col md:h-[220px] lg:h-[240px]`}
          >
            <div className="flex flex-col space-y-1.5 p-6 flex-grow">
              <h3 className="text-2xl font-semibold leading-none tracking-tight">{text.inquiryTitle}</h3>
              <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
                {text.inquiryDescription}
              </p>
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
                {text.inquiryButton}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
