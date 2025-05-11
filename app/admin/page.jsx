"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { fetchEvents, saveEvent, softDeleteEvent } from "@/lib/supabase-helpers"
import { calendarsData } from "@/data/calendars"
import { getThemeStyles } from "@/data/admin-ui"
import Sidebar from "@/components/admin/sidebar"
import EventTable from "@/components/admin/event-table"
import EventForm from "@/components/admin/event-form"
import AddButton from "@/components/admin/add-button"
import toast from "react-hot-toast"
import { supabaseClient } from "@/lib/supabaseClient"

export default function AdminPage() {
  const searchParams = useSearchParams()
  const [theme, setTheme] = useState("light")
  const [activeCalendar, setActiveCalendar] = useState("basic")
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [currentEvent, setCurrentEvent] = useState(null)
  const [selectedEvents, setSelectedEvents] = useState([])
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
    fetchCalendarEvents()
    // 페이지나 캘린더가 변경되면 선택된 이벤트 초기화
    setSelectedEvents([])
  }, [activeCalendar, pagination.page, pagination.perPage])

  const fetchCalendarEvents = async () => {
    setLoading(true)
    try {
      const { from, to } = getPaginationRange()

      // 선택된 캘린더 타입에 맞는 이벤트 가져오기
      const { data, count } = await fetchEvents({
        category: currentCalendarInfo.type,
        isDisabled: false,
        page: pagination.page,
        perPage: pagination.perPage,
        orderBy: "start_at",
        ascending: false,
      })

      setEvents(data || [])
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
      const { success, error } = await softDeleteEvent(event.id)

      if (!success) throw error

      toast.success("일정이 휴지통으로 이동되었습니다.")
      fetchCalendarEvents()
    } catch (error) {
      console.error("Error deleting event:", error)
      toast.error("일정 삭제 중 오류가 발생했습니다.")
    }
  }

  const handleSaveEvent = async (eventData) => {
    try {
      const { success, error } = await saveEvent(eventData, currentCalendarInfo.type)

      if (!success) throw error

      toast.success(eventData.id ? "일정이 수정되었습니다." : "새 일정이 추가되었습니다.")
      setIsFormOpen(false)
      fetchCalendarEvents()
    } catch (error) {
      console.error("Error saving event:", error)
      toast.error("일정 저장 중 오류가 발생했습니다.")
    }
  }

  // 전체 선택/해제 핸들러
  const handleSelectAll = (checked) => {
    if (checked) {
      // 현재 페이지의 모든 이벤트 ID 선택
      setSelectedEvents(events.map((event) => event.id))
    } else {
      // 모든 선택 해제
      setSelectedEvents([])
    }
  }

  // 개별 항목 선택/해제 핸들러
  const handleSelectItem = (eventId) => {
    setSelectedEvents((prev) => {
      if (prev.includes(eventId)) {
        // 이미 선택된 경우 선택 해제
        return prev.filter((id) => id !== eventId)
      } else {
        // 선택되지 않은 경우 선택 추가
        return [...prev, eventId]
      }
    })
  }

  // 선택된 항목 삭제 핸들러
  const handleDeleteSelected = async () => {
    if (selectedEvents.length === 0) return
    if (!window.confirm(`선택한 ${selectedEvents.length}개의 일정을 삭제하시겠습니까? (휴지통으로 이동됩니다)`)) return

    try {
      setLoading(true)
      // 선택된 모든 이벤트를 소프트 딜리트
      const { error } = await supabaseClient
        .from("events")
        .update({
          is_disabled: true,
          updated_at: new Date().toISOString(),
        })
        .in("id", selectedEvents)

      if (error) throw error

      toast.success(`${selectedEvents.length}개의 일정이 휴지통으로 이동되었습니다.`)
      setSelectedEvents([])
      fetchCalendarEvents()
    } catch (error) {
      console.error("Error deleting selected events:", error)
      toast.error("일정 삭제 중 오류가 발생했습니다.")
    } finally {
      setLoading(false)
    }
  }

  // 테마 스타일 가져오기
  const styles = getThemeStyles(theme)

  return (
    <div className={`min-h-screen ${styles.container}`}>
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
          selectedItems={selectedEvents}
          onSelectAll={handleSelectAll}
          onSelectItem={handleSelectItem}
          onDeleteSelected={handleDeleteSelected}
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
