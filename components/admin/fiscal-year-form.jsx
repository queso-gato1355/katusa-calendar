"use client"

import { useState, useEffect } from "react"
import { Plus, Check } from "lucide-react"
import toast from "react-hot-toast"
import { supabaseClient } from "@/lib/supabaseClient"
import { getTranslation } from "@/data/translations"
import { getDayOfWeek, generateYearOptions } from "@/lib/date-utils"
import { usePagination } from "@/hooks/use-pagination"
import { useFilter } from "@/hooks/use-filter"
import { regenerateICSFiles } from "@/services/ics-service"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PaginationControls } from "@/components/ui/pagination-controls"
import { HolidayModal } from "./holiday-modal"
import { HolidayTable } from "./holiday-table"

export default function FiscalYearForm({ theme, language = "ko" }) {
  const [holidays, setHolidays] = useState([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentHoliday, setCurrentHoliday] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [selectedHolidays, setSelectedHolidays] = useState([])

  const supabase = supabaseClient

  // 커스텀 훅 사용
  const {
    pagination,
    handlePageChange,
    handlePerPageChange,
    setTotal,
    resetToFirstPage,
    getTotalPages,
    getDisplayRange,
  } = usePagination(10)

  const {
    filter,
    handleFilterChange,
    resetFilters: resetFilterState,
  } = useFilter({
    search: "",
    year: "",
  })

  // 번역 텍스트 가져오기
  const text = getTranslation("admin", language)?.fiscalYear || {}

  // 휴일 데이터 가져오기
  useEffect(() => {
    fetchHolidays()
  }, [pagination.page, pagination.perPage, filter])

  const fetchHolidays = async () => {
    setLoading(true)
    try {
      const categories = ["us-holiday", "korean-army", "basic"]
      let query = supabase.from("events").select("*", { count: "exact" }).in("category", categories)

      // 필터 적용
      if (filter.search) {
        query = query.ilike("title", `%${filter.search}%`)
      }

      if (filter.year) {
        const startDate = new Date(Number.parseInt(filter.year), 0, 1).toISOString()
        const endDate = new Date(Number.parseInt(filter.year), 11, 31).toISOString()
        query = query.gte("start_at", startDate).lte("start_at", endDate)
      }

      query = query.order("start_at", { ascending: true })

      const from = (pagination.page - 1) * pagination.perPage
      const to = from + pagination.perPage - 1

      const { data: allEvents, error, count } = await query.range(from, to)

      if (error) throw error

      setTotal(count || 0)

      // 날짜별로 그룹화
      const holidaysByDate = {}

      allEvents.forEach((event) => {
        const dateKey = event.start_at.split("T")[0]
        const title = event.title.replace(" (USFK Only)", "")

        if (!holidaysByDate[dateKey]) {
          holidaysByDate[dateKey] = {
            date: event.start_at,
            end_date: event.end_at,
            title: title,
            us_observed: false,
            rok_observed: false,
            katusa_observed: false,
            usfk_only: false,
            events: [],
          }
        }

        // 카테고리에 따라 관찰 여부 설정
        if (event.category === "us-holiday") {
          holidaysByDate[dateKey].us_observed = true
        } else if (event.category === "korean-army") {
          holidaysByDate[dateKey].rok_observed = true
        } else if (event.category === "basic") {
          if (event.is_usfk) {
            holidaysByDate[dateKey].usfk_only = true
          } else {
            holidaysByDate[dateKey].katusa_observed = true
          }
        }

        holidaysByDate[dateKey].events.push(event)
      })

      const formattedHolidays = Object.values(holidaysByDate).map((holiday) => {
        const date = new Date(holiday.date)
        return {
          ...holiday,
          day_of_week: getDayOfWeek(date.getFullYear(), date.getMonth() + 1, date.getDate()),
          id: holiday.events[0].id,
        }
      })

      setHolidays(formattedHolidays || [])
    } catch (error) {
      console.error("Error fetching holidays:", error)
      toast.error(text.fetchError || "휴일 정보를 불러오는 중 오류가 발생했습니다.")
    } finally {
      setLoading(false)
    }
  }

  const resetFilters = () => {
    resetFilterState()
    resetToFirstPage()
  }

  const openModal = (holiday = null) => {
    setCurrentHoliday(holiday)
    setIsEditing(!!holiday)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setCurrentHoliday(null)
  }

  const handleSaveSuccess = () => {
    fetchHolidays()
    closeModal()
  }

  const handleDeleteSuccess = () => {
    fetchHolidays()
    closeModal()
  }

  const handleDeleteSelected = async () => {
    if (selectedHolidays.length === 0) return
    if (!window.confirm(`선택한 ${selectedHolidays.length}개의 휴일을 삭제하시겠습니까?`)) return

    try {
      setLoading(true)
      const eventIds = []
      selectedHolidays.forEach((holidayId) => {
        const holiday = holidays.find((h) => h.id === holidayId)
        if (holiday && holiday.events) {
          holiday.events.forEach((event) => {
            eventIds.push(event.id)
          })
        }
      })

      if (eventIds.length > 0) {
        const { error } = await supabase.from("events").delete().in("id", eventIds)
        if (error) throw error
      }

      toast.success(`${selectedHolidays.length}개의 휴일이 삭제되었습니다.`)
      setSelectedHolidays([])
      fetchHolidays()
    } catch (error) {
      console.error("Error deleting selected holidays:", error)
      toast.error("휴일 삭제 중 오류가 발생했습니다.")
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteAll = async () => {
    if (!window.confirm("모든 휴일을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.")) return

    try {
      setLoading(true)
      const categories = ["us-holiday", "korean-army", "basic"]
      let query = supabase.from("events").delete().in("category", categories)

      if (filter.year) {
        const startDate = new Date(Number.parseInt(filter.year), 0, 1).toISOString()
        const endDate = new Date(Number.parseInt(filter.year), 11, 31).toISOString()
        query = query.gte("start_at", startDate).lte("start_at", endDate)
      }

      const { error } = await query
      if (error) throw error

      toast.success("모든 휴일이 삭제되었습니다.")
      setSelectedHolidays([])
      fetchHolidays()
    } catch (error) {
      console.error("Error deleting all holidays:", error)
      toast.error("휴일 삭제 중 오류가 발생했습니다.")
    } finally {
      setLoading(false)
    }
  }

  const yearOptions = generateYearOptions(5)

  return (
    <div className="w-full">
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-xl font-semibold break-keep">{text.title_fiscal || "Fiscal Year 휴일 관리"}</h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => openModal()} className="hidden md:flex">
            <Plus className="h-4 w-4 mr-2" />
            {text.addHoliday || "새 휴일 추가"}
          </Button>
          <Button variant="outline" onClick={() => openModal()} className="flex md:hidden">
            <Plus className="h-4 w-4 mr-2" />
            {text.addHoliday_short || "추가"}
          </Button>
          <Button
            variant="default"
            onClick={regenerateICSFiles}
            disabled={loading || holidays.length === 0}
            className={`${
              theme === "dark" ? "bg-blue-600 text-white" : "bg-blue-100 text-blue-600"
            } hidden md:flex`}
          >
            <Check className="h-4 w-4 mr-2" />
            {text.regenerateICS || "ICS 파일 재생성"}
          </Button>
          <Button
            variant="default"
            onClick={regenerateICSFiles}
            disabled={loading || holidays.length === 0}
            className={`${
              theme === "dark" ? "bg-blue-600 text-white" : "bg-blue-100 text-blue-600"
            } flex md:hidden`}
          >
            <Check className="h-4 w-4 mr-2" />
            {text.regenerateICS_short || "재생성"}
          </Button>
        </div>
      </div>

      {/* 필터 섹션 */}
      <div className={`mb-4 p-4 rounded-lg ${theme === "dark" ? "bg-gray-800" : "bg-gray-50"}`}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="search">검색어</Label>
            <Input
              id="search"
              name="search"
              value={filter.search}
              onChange={handleFilterChange}
              placeholder="휴일 이름으로 검색"
            />
          </div>
          <div>
            <Label htmlFor="year">연도</Label>
            <select
              id="year"
              name="year"
              value={filter.year}
              onChange={handleFilterChange}
              className="w-full h-10 px-3 py-2 bg-background border border-input rounded-md"
            >
              <option value="">모든 연도</option>
              {yearOptions.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-end gap-2">
            <Button variant="secondary" onClick={resetFilters}>
              필터 초기화
            </Button>
            {selectedHolidays.length > 0 && (
              <Button variant="destructive" onClick={handleDeleteSelected}>
                선택 삭제 ({selectedHolidays.length})
              </Button>
            )}
            {holidays.length > 0 && (
              <Button variant="destructive" onClick={handleDeleteAll}>
                전체 삭제
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* 테이블 */}
      <HolidayTable
        holidays={holidays}
        loading={loading}
        selectedHolidays={selectedHolidays}
        setSelectedHolidays={setSelectedHolidays}
        onEdit={openModal}
        theme={theme}
        text={text}
      />

      {/* 페이지네이션 */}
      <PaginationControls
        pagination={pagination}
        onPageChange={handlePageChange}
        onPerPageChange={handlePerPageChange}
        theme={theme}
        getDisplayRange={getDisplayRange}
        getTotalPages={getTotalPages}
      />

      {/* 모달 */}
      <HolidayModal
        isOpen={isModalOpen}
        onClose={closeModal}
        holiday={currentHoliday}
        isEditing={isEditing}
        onSaveSuccess={handleSaveSuccess}
        onDeleteSuccess={handleDeleteSuccess}
        theme={theme}
        language={language}
        text={text}
      />
    </div>
  )
}
