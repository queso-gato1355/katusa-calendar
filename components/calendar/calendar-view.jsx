"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, X } from "lucide-react"
import { supabaseClient } from "@/lib/supabaseClient"
import toast from "react-hot-toast"
import { getTranslation } from "@/data/translations"
import { formatDate, formatTime, getLocale, isToday, isSameDay } from "@/lib/date-utils"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose, DialogDescription } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"

export default function CalendarView({ theme, language = "ko" }) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [showEventDetails, setShowEventDetails] = useState(false)

  const supabase = supabaseClient
  const text = getTranslation("calendarPage", language)

  useEffect(() => {
    fetchEvents()
  }, [currentDate])

  const fetchEvents = async () => {
    setLoading(true)
    try {
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

  const goToPreviousMonth = () => {
    const newDate = new Date(currentDate)
    newDate.setMonth(newDate.getMonth() - 1)
    setCurrentDate(newDate)
  }

  const goToNextMonth = () => {
    const newDate = new Date(currentDate)
    newDate.setMonth(newDate.getMonth() + 1)
    setCurrentDate(newDate)
  }

  const goToToday = () => {
    setCurrentDate(new Date())
  }

  const getMonthName = (date) => {
    return date.toLocaleString(getLocale(language), { month: "long" })
  }

  const getDaysInMonth = (date) => {
    const year = date.getFullYear()
    const month = date.getMonth()

    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)

    const startDate = new Date(firstDay)
    startDate.setDate(startDate.getDate() - startDate.getDay())

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

  const getEventColor = (category) => {
    switch (category) {
      case "basic":
        return "bg-blue-500 border-blue-600 text-white"
      case "kta":
        return "bg-purple-500 border-purple-600 text-white"
      case "korean-holiday":
        return "bg-red-500 border-red-600 text-white"
      case "korean-army":
        return "bg-green-500 border-green-600 text-white"
      case "us-holiday":
        return "bg-yellow-500 border-yellow-600 text-white"
      default:
        return "bg-gray-500 border-gray-600 text-white"
    }
  }

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

  const isCurrentMonth = (date) => {
    return date.getMonth() === currentDate.getMonth()
  }

  const handleEventClick = (event, e) => {
    e.stopPropagation()
    setSelectedEvent(event)
    setShowEventDetails(true)
  }

  // 연속된 이벤트를 처리하기 위한 함수
  const processEventsForCalendar = (days) => {
    const processedEvents = []
    const eventMap = new Map()

    // 각 이벤트에 대해 시작일과 종료일 계산
    events.forEach((event) => {
      const startDate = new Date(event.start_at)
      const endDate = new Date(event.end_at)

      // 시간 정보 제거
      startDate.setHours(0, 0, 0, 0)
      endDate.setHours(0, 0, 0, 0)

      const eventKey = `${event.id}-${event.title}`

      if (!eventMap.has(eventKey)) {
        eventMap.set(eventKey, {
          ...event,
          startDate,
          endDate,
          spans: [],
        })
      }
    })

    // 각 주별로 이벤트 배치 계산
    const weeks = []
    for (let i = 0; i < days.length; i += 7) {
      weeks.push(days.slice(i, i + 7))
    }

    weeks.forEach((week, weekIndex) => {
      const weekEvents = []

      eventMap.forEach((eventData, eventKey) => {
        const { startDate, endDate } = eventData

        // 이 주에서 이벤트가 시작되거나 진행 중인지 확인
        const weekStart = week[0]
        const weekEnd = week[6]

        if (endDate >= weekStart && startDate <= weekEnd) {
          // 이벤트가 이 주에 표시되어야 함
          const displayStart = startDate > weekStart ? startDate : weekStart
          const displayEnd = endDate < weekEnd ? endDate : weekEnd

          const startCol = week.findIndex((day) => isSameDay(day, displayStart))
          const endCol = week.findIndex((day) => isSameDay(day, displayEnd))

          if (startCol !== -1 && endCol !== -1) {
            weekEvents.push({
              ...eventData,
              weekIndex,
              startCol: startCol,
              endCol: endCol,
              span: endCol - startCol + 1,
              isStart: isSameDay(startDate, displayStart),
              isEnd: isSameDay(endDate, displayEnd),
            })
          }
        }
      })

      processedEvents.push(...weekEvents)
    })

    return processedEvents
  }

  const days = getDaysInMonth(currentDate)
  const weekdayNames = text.weekdays || ["일", "월", "화", "수", "목", "금", "토"]
  const processedEvents = processEventsForCalendar(days)

  // 주별로 이벤트 그룹화
  const eventsByWeek = {}
  processedEvents.forEach((event) => {
    if (!eventsByWeek[event.weekIndex]) {
      eventsByWeek[event.weekIndex] = []
    }
    eventsByWeek[event.weekIndex].push(event)
  })

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
      <div className="rounded-lg">
        {/* 요일 헤더 */}
        <div className={`grid grid-cols-7 border-b rounded-tl-2xl rounded-tr-2xl ${theme === "dark" ? "bg-gray-800 border-gray-800" : "bg-gray-50 border-gray-50"}`}>
          {weekdayNames.map((day, index) => (
            <div
              key={day}
              className={`py-2 text-center text-sm font-medium ${
                index === 0 ? "text-red-500" : index === 6 ? "text-blue-500" : ""
              }`}
            >
              {day}
            </div>
          ))}
        </div>

        {/* 날짜 그리드 */}
        <div className="relative overflow-hidden">
          {/* 날짜 셀들 */}
          <div className="grid grid-cols-7">
            {days.map((date, index) => {
              const isCurrentMonthDay = isCurrentMonth(date)

              return (
                <div
                  key={index}
                  className={`min-h-[120px] p-1 border-b relative ${!isCurrentMonthDay ? "bg-muted/50" : ""} ${theme === "dark" ? "border-gray-800" : "border-gray-50"}`}
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
                </div>
              )
            })}
          </div>

          {/* 연속된 이벤트 오버레이 */}
          {Object.entries(eventsByWeek).map(([weekIndex, weekEvents]) => (
            <div key={weekIndex} className="absolute inset-0">
              {weekEvents.map((event, eventIndex) => {
                const topOffset = Number.parseInt(weekIndex) * 120 + 30 + eventIndex * 20
                const leftOffset = (event.startCol / 7) * 100
                const width = (event.span / 7) * 100

                return (
                  <div
                    key={`${event.id}-${weekIndex}-${eventIndex}`}
                    className={`absolute pointer-events-auto cursor-pointer ${getEventColor(event.category)} 
                      rounded px-2 py-1 text-xs truncate border-l-2 hover:opacity-80 transition-opacity`}
                    style={{
                      top: `${topOffset}px`,
                      left: `${leftOffset}%`,
                      width: `${width}%`,
                      height: "20px",
                      zIndex: 10,
                    }}
                    onClick={(e) => handleEventClick(event, e)}
                    title={`${event.title} (${getCategoryName(event.category)})`}
                  >
                    {event.isStart && <span className="font-medium">{event.title}</span>}
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </div>

      {/* 이벤트 상세 정보 모달 */}
      <Dialog open={showEventDetails} onOpenChange={setShowEventDetails}>
        <DialogContent className={`rounded-xl ${theme === "dark" ? "bg-gray-800" : "bg-gray-50"}`}>
          <DialogHeader>
            <DialogTitle>{selectedEvent?.title}</DialogTitle>
            <DialogDescription className="sr-only" />
          </DialogHeader>

          {/* <DialogClose asChild>
            <div className="absolute top-4 right-4 cursor-pointer"> 
              <X className="h-5 w-5" />
            </div>
          </DialogClose> */}

          {selectedEvent && (
            <div className="space-y-3 py-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{text.category}</p>
                <p>{getCategoryName(selectedEvent.category)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">{text.date}</p>
                <p>
                  {formatDate(selectedEvent.start_at, language)}
                  {!selectedEvent.all_day && ` ${formatTime(selectedEvent.start_at, language)}`}
                  {" - "}
                  {formatDate(selectedEvent.end_at, language)}
                  {!selectedEvent.all_day && ` ${formatTime(selectedEvent.end_at, language)}`}
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
