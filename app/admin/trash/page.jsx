"use client"

import { useState, useEffect } from "react"
import { supabaseClient } from "@/lib/supabaseClient"
import Sidebar from "@/components/admin/sidebar"
import EventTable from "@/components/admin/event-table"
import toast from "react-hot-toast"
import { Undo, Trash2 } from "lucide-react"
import { 
  fetchDeletedEvents,
  restoreEvent,
  permanentDeleteEvent
 } from "@/lib/supabase-helpers"

export default function TrashPage() {
  const [theme, setTheme] = useState("light")
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({
    page: 1,
    perPage: 10,
    total: 0,
  })

  const supabase = supabaseClient

  // 테마 설정
  useEffect(() => {
    if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setTheme("dark")
      document.documentElement.classList.add("dark")
    }
  }, [])

  // 삭제된 일정 데이터 가져오기
  useEffect(() => {
    getDeletedEvents()
  }, [pagination.page, pagination.perPage])

  const getDeletedEvents = async () => {
    setLoading(true)
    try {
      const { from, to } = getPaginationRange()

      // 삭제된 이벤트(is_disabled=true) 가져오기
      const {
        data: events,
        error,
        count, // 전체 삭제된 이벤트 수
      } = await fetchDeletedEvents({ from, to })

      if (error) throw error

      setEvents(events || [])
      setPagination((prev) => ({ ...prev, total: count || 0 }))
    } catch (error) {
      console.error("Error fetching deleted events:", error)
      toast.error("삭제된 일정을 불러오는 중 오류가 발생했습니다.")
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

  const handleRestore = async (event) => {
    try {
      // 일정 복원: is_disabled를 false로 설정
      const { error } = await restoreEvent(event.id)
      if (error) throw error

      toast.success("일정이 복원되었습니다.")
      getDeletedEvents()
    } catch (error) {
      console.error("Error restoring event:", error)
      toast.error("일정 복원 중 오류가 발생했습니다.")
    }
  }

  const handlePermanentDelete = async (event) => {
    if (!window.confirm("정말로 이 일정을 영구적으로 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.")) return

    try {
      // 일정 영구 삭제
      const { error } = await permanentDeleteEvent(event.id)

      if (error) throw error

      toast.success("일정이 영구적으로 삭제되었습니다.")
      getDeletedEvents()
    } catch (error) {
      console.error("Error permanently deleting event:", error)
      toast.error("일정 영구 삭제 중 오류가 발생했습니다.")
    }
  }

  // 휴지통용 커스텀 액션 버튼
  const renderCustomActions = (event) => (
    <div className="flex justify-end gap-2">
      <button
        onClick={(e) => {
          e.stopPropagation()
          handleRestore(event)
        }}
        className={`p-1 rounded-md ${theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-200"}`}
        title="복원"
      >
        <Undo className="h-4 w-4 text-green-500" />
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation()
          handlePermanentDelete(event)
        }}
        className={`p-1 rounded-md ${theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-200"}`}
        title="영구 삭제"
      >
        <Trash2 className="h-4 w-4 text-red-500" />
      </button>
    </div>
  )

  return (
    <div className={`min-h-screen ${theme === "dark" ? "dark bg-gray-900 text-white" : "bg-gray-50 text-gray-900"}`}>
      <Sidebar activeCalendar="trash" theme={theme} />

      <div className="md:ml-64 p-4 md:p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">휴지통</h1>
          <p className="text-sm text-gray-500 mt-1">
            삭제된 일정을 관리합니다. 복원하거나 영구적으로 삭제할 수 있습니다.
          </p>
        </div>

        <EventTable
          events={events}
          loading={loading}
          theme={theme}
          onEdit={() => {}} // 휴지통에서는 편집 기능 비활성화
          ableToEdit={false} // 편집 기능 비활성화
          ableToRestore={true} // 복원 기능 활성화
          onRestore={handleRestore}
          onDelete={handlePermanentDelete} // 휴지통에서는 삭제 기능이 영구 삭제로 대체됨
          pagination={pagination}
          onPageChange={handlePageChange}
          onPerPageChange={handlePerPageChange}
          renderCustomActions={renderCustomActions} // 커스텀 액션 버튼 렌더링
        />
      </div>
    </div>
  )
}
