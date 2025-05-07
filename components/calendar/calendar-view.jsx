"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { supabase } from "@/lib/supabase"
import toast from "react-hot-toast"
import { getTranslation } from "@/data/translations"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"

export default function CalendarView({ theme, language = "ko" }) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [showEventDetails, setShowEventDetails] = useState(false)

  // 현재 언어에 맞는 텍스트 가져오기
  const text = getTranslation("calendarPage", language)

  // 이벤트 데이터 가져오기
  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    setLoading(true)
    try {
      // 현재 날짜 기준 전후 6개월 데이터 가져오기
      const startDate = new Date(currentDate)
      startDate.setMonth(startDate.getMonth() - 6)

      const endDate = new Date(currentDate)
      endDate.setMonth(endDate.getMonth() + 6)

      const { data, error } = await supabase
        .from("events")
        .select("*")
        .gte("start_at", startDate.toISOString())
        .lte("start_at", endDate.toISOString())
        .eq("is_disabled", false)
        .order("start_at", { ascending: true })

      if (error) throw error

      setEvents(data || [])
    } catch (error) {
      console.error("Error fetching events:", error)
      toast.error(text.errorFetchingEvents)
    } finally {
      setLoading(false)
    }
  }

  // 이전 달로 이동
  const goToPreviousMonth = () => {
    const newDate = new Date(currentDate)
    newDate.setMonth(newDate.getMonth() - 1)
    setCurrentDate(newDate)
  }

  // 다음 달로 이동
  const goToNextMonth = () => {
    const newDate = new Date(currentDate)
    newDate.setMonth(newDate.getMonth() + 1)
    setCurrentDate(newDate)
  }

  // 오늘로 이동
  const goToToday = () => {
    setCurrentDate(new Date())
  }

  // 월 이름 가져오기
  const getMonthName = (date) => {
    return date.toLocaleString(getLocale(language), { month: "long" })
  }

  // 해당 월의 모든 날짜 가져오기
  const getDaysInMonth = (date) => {
    const year = date.getFullYear()
    const month = date.getMonth()

    // 해당 월의 첫 날
    const firstDay = new Date(year, month, 1)
    // 해당 월의 마지막 날
    const lastDay = new Date(year, month + 1, 0)

    // 첫 주의 시작일 (이전 달의 날짜 포함)
    const startDate = new Date(firstDay)
    startDate.setDate(startDate.getDate() - startDate.getDay())

    // 마지막 주의 종료일 (다음 달의 날짜 포함)
    const endDate = new Date(lastDay)
    if (endDate.getDay() < 6) {
      endDate.setDate(endDate.getDate() + (6 - endDate.getDay()))
    }

    const days = []
    const currentDay = new Date(startDate)

    while (currentDay <= endDate) {
      days.push(new Date(currentDay))
      currentDay.setDate(currentDay.getDate() + 1)
    }

    return days
  }

  // 특정 날짜의 이벤트 가져오기
  const getEventsForDate = (date) => {
    return events.filter((event) => {
      const eventStartDate = new Date(event.start_at)
      const eventEndDate = new Date(event.end_at)
      const currentDate = new Date(date)

      // 시간 정보 제거하고 날짜만 비교
      currentDate.setHours(0, 0, 0, 0)
      const startDateOnly = new Date(eventStartDate)
      startDateOnly.setHours(0, 0, 0, 0)
      const endDateOnly = new Date(eventEndDate)
      endDateOnly.setHours(0, 0, 0, 0)

      // 현재 날짜가 이벤트 시작일과 종료일 사이에 있는지 확인
      return currentDate >= startDateOnly && currentDate <= endDateOnly
    })
  }

  // 이벤트가 시작되는 날인지 확인
  const isEventStartDate = (event, date) => {
    const eventDate = new Date(event.start_at)
    return (
      eventDate.getFullYear() === date.getFullYear() &&
      eventDate.getMonth() === date.getMonth() &&
      eventDate.getDate() === date.getDate()
    )
  }

  // 이벤트 카테고리에 따른 색상 가져오기
  const getEventColor = (category) => {
    switch (category) {
      case "basic":
        return "bg-blue-500 border-blue-600"
      case "kta":
        return "bg-purple-500 border-purple-600"
      case "korean-holiday":
        return "bg-red-500 border-red-600"
      case "korean-army":
        return "bg-green-500 border-green-600"
      case "us-holiday":
        return "bg-yellow-500 border-yellow-600"
      default:
        return "bg-gray-500 border-gray-600"
    }
  }

  // 카테고리 이름 가져오기
  const getCategoryName = (category) => {
    const categories = text.categories || {
      basic: "카투사 기본",
      kta: "KTA 일정",
      koreanHoliday: "한국 휴일",
      koreanArmy: "한국군 휴일",
      usHoliday: "미군 휴일",
    }
    return categories[category] || category
  }

  // 날짜가 오늘인지 확인
  const isToday = (date) => {
    const today = new Date()
    return (
      date.getFullYear() === today.getFullYear() &&
      date.getMonth() === today.getMonth() &&
      date.getDate() === today.getDate()
    )
  }

  // 날짜가 현재 월에 속하는지 확인
  const isCurrentMonth = (date) => {
    return date.getMonth() === currentDate.getMonth()
  }

  // 이벤트 클릭 핸들러
  const handleEventClick = (event, e) => {
    e.stopPropagation()
    setSelectedEvent(event)
    setShowEventDetails(true)
  }

  // 날짜 포맷팅
  const formatDate = (dateString, options = {}) => {
    const date = new Date(dateString)
    return date.toLocaleDateString(getLocale(language), {
      year: "numeric",
      month: "long",
      day: "numeric",
      ...options,
    })
  }

  // 시간 포맷팅
  const formatTime = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString(getLocale(language), {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // 언어에 따른 로케일 가져오기
  const getLocale = (lang) => {
    switch (lang) {
      case "ko":
        return "ko-KR"
      case "en":
        return "en-US"
      case "es":
        return "es-ES"
      default:
        return "ko-KR"
    }
  }

  const days = getDaysInMonth(currentDate)
  const weekdayNames = text.weekdays || ["일", "월", "화", "수", "목", "금", "토"]

  return (
    <div className="w-full">
      {/* 캘린더 헤더 */}
      <div className="mb-4 flex flex-col sm:flex-row justify-between items-center">
        <div className="flex items-center mb-4 sm:mb-0">
          <Button variant="outline" size="icon" onClick={goToPreviousMonth} aria-label={text.previousMonth}>
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <h2 className="text-xl font-semibold mx-4">
            {currentDate.getFullYear()}
            {text.year} {getMonthName(currentDate)}
          </h2>
          <Button variant="outline" size="icon" onClick={goToNextMonth} aria-label={text.nextMonth}>
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={goToToday}>
            {text.today}
          </Button>
        </div>
      </div>

      {/* 캘린더 범례 */}
      <div className="mb-4 flex flex-wrap gap-2">
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-blue-500 mr-1"></div>
          <span className="text-xs">{text.categories?.basic || "카투사 기본"}</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-purple-500 mr-1"></div>
          <span className="text-xs">{text.categories?.kta || "KTA 일정"}</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-red-500 mr-1"></div>
          <span className="text-xs">{text.categories?.koreanHoliday || "한국 휴일"}</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-green-500 mr-1"></div>
          <span className="text-xs">{text.categories?.koreanArmy || "한국군 휴일"}</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-yellow-500 mr-1"></div>
          <span className="text-xs">{text.categories?.usHoliday || "미군 휴일"}</span>
        </div>
      </div>

      {/* 캘린더 그리드 */}
      <div className="rounded-lg border overflow-hidden">
        {/* 요일 헤더 */}
        <div className="grid grid-cols-7 border-b">
          {weekdayNames.map((day, index) => (
            <div
              key={day}
              className={`py-2 text-center text-sm font-medium ${
                index === 0 ? "text-red-500" : index === 6 ? "text-blue-500" : ""
              } bg-muted`}
            >
              {day}
            </div>
          ))}
        </div>

        {/* 날짜 그리드 */}
        <div className="grid grid-cols-7">
          {days.map((date, index) => {
            const dateEvents = getEventsForDate(date)
            const isCurrentMonthDay = isCurrentMonth(date)

            return (
              <div
                key={index}
                className={`min-h-[100px] p-1 border-b border-r ${!isCurrentMonthDay ? "bg-muted/50" : ""}`}
              >
                {/* 날짜 표시 */}
                <div
                  className={`text-right text-sm p-1 ${
                    isToday(date)
                      ? "bg-blue-500 text-white rounded-full w-7 h-7 flex items-center justify-center ml-auto"
                      : date.getDay() === 0
                        ? "text-red-500"
                        : date.getDay() === 6
                          ? "text-blue-500"
                          : ""
                  } ${!isCurrentMonthDay ? "opacity-50" : ""}`}
                >
                  {date.getDate()}
                </div>

                {/* 이벤트 목록 */}
                <div className="mt-1 space-y-1 overflow-y-auto max-h-[80px]">
                  {dateEvents.map((event) => (
                    <div
                      key={event.id}
                      className={`text-xs p-1 rounded truncate border-l-2 ${getEventColor(event.category)} ${
                        theme === "dark" ? "text-white" : "text-white"
                      } ${isEventStartDate(event, date) ? "cursor-pointer hover:opacity-80" : "opacity-70"}`}
                      onClick={(e) => handleEventClick(event, e)}
                      title={`${event.title} (${getCategoryName(event.category)})`}
                    >
                      {event.title}
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* 이벤트 상세 정보 모달 */}
      <Dialog open={showEventDetails} onOpenChange={setShowEventDetails}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedEvent?.title}</DialogTitle>
          </DialogHeader>

          {selectedEvent && (
            <div className="space-y-3 py-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{text.category}</p>
                <p>{getCategoryName(selectedEvent.category)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">{text.date}</p>
                <p>
                  {formatDate(selectedEvent.start_at)}
                  {!selectedEvent.all_day && ` ${formatTime(selectedEvent.start_at)}`}
                  {" - "}
                  {formatDate(selectedEvent.end_at)}
                  {!selectedEvent.all_day && ` ${formatTime(selectedEvent.end_at)}`}
                </p>
              </div>
              {selectedEvent.all_day && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{text.allDay}</p>
                  <Badge variant="outline">{text.yes}</Badge>
                </div>
              )}
              {selectedEvent.location && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{text.location}</p>
                  <p>{selectedEvent.location}</p>
                </div>
              )}
              {selectedEvent.description && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{text.description}</p>
                  <p>{selectedEvent.description}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* 로딩 오버레이 */}
      {loading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      )}
    </div>
  )
}
