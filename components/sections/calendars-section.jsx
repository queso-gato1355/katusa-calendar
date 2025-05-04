"use client"

import { useState, useEffect } from "react"
import { Copy, Check, MessageSquare } from "lucide-react"
import toast from "react-hot-toast"
import { calendarsData } from "@/data/calendars"
import { getTranslation } from "@/data/translations"
import { supabase } from "@/lib/supabase"

export default function CalendarsSection({ theme, language = "ko" }) {
  const [copied, setCopied] = useState({})
  const [calendarStatus, setCalendarStatus] = useState({})
  const [loading, setLoading] = useState(true)

  // 현재 언어에 맞는 텍스트 가져오기
  const text = getTranslation("calendars", language)

  // 캘린더 상태 가져오기
  useEffect(() => {
    const fetchCalendarStatus = async () => {
      try {
        // First check if the table exists
        const { error: checkError } = await supabase.from("calendar_settings").select("count").limit(1)

        if (checkError && checkError.message.includes("does not exist")) {
          console.log("calendar_settings table doesn't exist yet, creating default status")
          // Table doesn't exist, create default status for all calendars
          const defaultStatus = {}
          calendarsData.forEach((calendar) => {
            defaultStatus[calendar.id] = {
              is_active: true,
              copy_count: 0,
            }
          })
          setCalendarStatus(defaultStatus)
          return
        }

        // If table exists, fetch the data
        const { data, error } = await supabase.from("calendar_settings").select("*")

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
        // Provide default values on error
        const defaultStatus = {}
        if (Array.isArray(calendarsData)) {
          calendarsData.forEach((calendar) => {
            defaultStatus[calendar.id] = {
              is_active: true,
              copy_count: 0,
            }
          })
        }
        setCalendarStatus(defaultStatus)
      } finally {
        setLoading(false)
      }
    }

    fetchCalendarStatus()
  }, [])

  const copyToClipboard = async (link, id) => {
    // 비활성화된 캘린더인 경우 복사하지 않음
    if (calendarStatus[id] && calendarStatus[id].is_active === false) {
      toast.error("현재 이 캘린더는 점검 중입니다.", {
        duration: 2000,
        position: "top-center",
      })
      return
    }

    navigator.clipboard.writeText(link)
    setCopied({ ...copied, [id]: true })
    toast.success("ICS 링크가 클립보드에 복사되었습니다.", {
      duration: 2000,
      position: "top-center",
    })

    // 복사 카운트 증가 시도
    try {
      // First check if the function exists
      const { error: checkError } = await supabase.rpc("increment_copy_count", { calendar_id: id })

      if (checkError && checkError.message.includes("does not exist")) {
        console.log("increment_copy_count function doesn't exist yet")
        // Function doesn't exist, just update local state
        setCalendarStatus((prev) => ({
          ...prev,
          [id]: {
            ...prev[id],
            copy_count: (prev[id]?.copy_count || 0) + 1,
          },
        }))
      } else if (checkError) {
        throw checkError
      }
    } catch (error) {
      console.error("Error incrementing copy count:", error)
    }

    setTimeout(() => setCopied({ ...copied, [id]: false }), 2000)
  }

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
                copyToClipboard={copyToClipboard}
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

function CalendarCard({ theme, calendar, copied, copyToClipboard, isActive, text, language }) {
  // 현재 언어에 맞는 캘린더 제목과 설명 가져오기
  const calendarTranslation = text.calendarItems && text.calendarItems[calendar.id]
  const title = calendarTranslation ? calendarTranslation.title : calendar.title
  const description = calendarTranslation ? calendarTranslation.description : calendar.description

  return (
    <div
      className={`rounded-lg border ${
        theme === "dark" ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200"
      } shadow-sm flex flex-col md:h-[220px] lg:h-[240px]`}
    >
      <div className="flex flex-col space-y-1.5 p-6 flex-grow">
        <h3 className="text-2xl font-semibold leading-none tracking-tight">{title}</h3>
        <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>{description}</p>
      </div>
      <div className="p-6 pt-0 mt-auto">
        <button
          className={`w-full h-10 px-4 py-2 rounded-md flex items-center justify-center text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
            isActive
              ? theme === "dark"
                ? "bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-500"
                : "bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-500"
              : theme === "dark"
                ? "bg-gray-700 text-gray-300 cursor-not-allowed"
                : "bg-gray-200 text-gray-500 cursor-not-allowed"
          }`}
          onClick={() => copyToClipboard(calendar.link, calendar.id)}
          disabled={!isActive}
        >
          {isActive ? (
            copied[calendar.id] ? (
              <Check className="mr-2 h-4 w-4" />
            ) : (
              <Copy className="mr-2 h-4 w-4" />
            )
          ) : null}
          {isActive ? text.copyButton : text.maintenanceButton}
        </button>
      </div>
    </div>
  )
}
