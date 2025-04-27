"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { calendarsData } from "@/data/calendars"
import Sidebar from "@/components/admin/sidebar"
import EventTable from "@/components/admin/event-table"
import EventForm from "@/components/admin/event-form"
import AddButton from "@/components/admin/add-button"
import toast from "react-hot-toast"

export default function AdminPage() {
  const searchParams = useSearchParams()
  const [theme, setTheme] = useState("light")
  const [activeCalendar, setActiveCalendar] = useState("basic")
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [currentEvent, setCurrentEvent] = useState(null)
  const [pagination, setPagination] = useState({
    page: 1,
    perPage: 10,
    total: 0,
  })

  // 현재 선택된 캘린더 정보
  const currentCalendarInfo = calendarsData.find((cal) => cal.id === activeCalendar) || calendarsData[0]

  // URL 파라미터에서 캘린더 ID 가져오기
  useEffect(() => {
    const calendarParam = searchParams.get("calendar")
    if (calendarParam && calendarsData.some((cal) => cal.id === calendarParam)) {
      setActiveCalendar(calendarParam)
    }

    // 테마 설정
    if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setTheme("dark")
      document.documentElement.classList.add("dark")
    }
  }, [searchParams])

  // 일정 데이터 가져오기
  useEffect(() => {
    fetchEvents()
  }, [activeCalendar, pagination.page, pagination.perPage])

  const fetchEvents = async () => {
    setLoading(true)
    try {
      const { from, to } = getPaginationRange()

      // 선택된 캘린더 타입에 맞는 이벤트 가져오기
      const {
        data: events,
        error,
        count,
      } = await supabase
        .from("events")
        .select("*", { count: "exact" })
        .eq("category", currentCalendarInfo.type)
        .eq("is_disabled", false)
        .order("start_at", { ascending: false })
        .range(from, to)

      if (error) throw error

      setEvents(events || [])
      setPagination((prev) => ({ ...prev, total: count || 0 }))
    } catch (error) {
      console.error("Error fetching events:", error)
      toast.error("일정을 불러오는 중 오류가 발생했습니다.")
    } finally {
      setLoading(false)
    }
  }

  const getPaginationRange = () => {
    const from = (pagination.page - 1) * pagination.perPage
    const to = from + pagination.perPage - 1
    return { from, to }
  }

  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, page: newPage }))
  }

  const handlePerPageChange = (newPerPage) => {
    setPagination({ page: 1, perPage: newPerPage, total: pagination.total })
  }

  const handleEditEvent = (event) => {
    setCurrentEvent(event)
    setIsFormOpen(true)
  }

  const handleAddEvent = () => {
    setCurrentEvent(null)
    setIsFormOpen(true)
  }

  const handleDeleteEvent = async (event) => {
    if (!window.confirm("정말로 이 일정을 삭제하시겠습니까? (휴지통으로 이동됩니다)")) return

    try {
      // 소프트 딜리트: is_disabled를 true로 설정
      const { error } = await supabase
        .from("events")
        .update({ is_disabled: true, updated_at: new Date().toISOString() })
        .eq("id", event.id)

      if (error) throw error

      toast.success("일정이 휴지통으로 이동되었습니다.")
      fetchEvents()
    } catch (error) {
      console.error("Error deleting event:", error)
      toast.error("일정 삭제 중 오류가 발생했습니다.")
    }
  }

  const handleSaveEvent = async (eventData) => {
    try {
      // 이벤트 데이터에서 필요한 필드만 추출
      const { id, title, description, start_at, end_at, location, all_day } = eventData

      // 저장할 데이터 객체 생성
      const eventToSave = {
        title,
        description,
        start_at,
        end_at,
        location,
        all_day,
        updated_at: new Date().toISOString(),
      }

      let result

      if (id) {
        // 기존 일정 수정
        result = await supabase.from("events").update(eventToSave).eq("id", id)

        toast.success("일정이 수정되었습니다.")
      } else {
        // 새 일정 추가
        result = await supabase.from("events").insert({
          ...eventToSave,
          category: currentCalendarInfo.type,
          is_disabled: false,
          created_at: new Date().toISOString(),
        })

        toast.success("새 일정이 추가되었습니다.")
      }

      if (result.error) throw result.error

      setIsFormOpen(false)
      fetchEvents()
    } catch (error) {
      console.error("Error saving event:", error)
      toast.error("일정 저장 중 오류가 발생했습니다.")
    }
  }

  return (
    <div className={`min-h-screen ${theme === "dark" ? "dark bg-gray-900 text-white" : "bg-gray-50 text-gray-900"}`}>
      <Sidebar activeCalendar={activeCalendar} theme={theme} />

      <div className="md:ml-64 p-4 md:p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">{currentCalendarInfo.title} 관리</h1>
          <p className="text-sm text-gray-500 mt-1">{currentCalendarInfo.description}</p>
        </div>

        <EventTable
          events={events}
          loading={loading}
          theme={theme}
          onEdit={handleEditEvent}
          onDelete={handleDeleteEvent}
          pagination={pagination}
          onPageChange={handlePageChange}
          onPerPageChange={handlePerPageChange}
        />
      </div>

      <EventForm
        event={currentEvent}
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={handleSaveEvent}
        theme={theme}
      />

      <AddButton onClick={handleAddEvent} theme={theme} />
    </div>
  )
}
