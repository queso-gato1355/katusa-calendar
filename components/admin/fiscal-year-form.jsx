"use client"

import { useState, useEffect } from "react"
import { Edit, Trash2, Plus, Check, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react"
import toast from "react-hot-toast"
import { supabaseClient } from "@/lib/supabaseClient"
import { getTranslation } from "@/data/translations"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Toggle } from "@/components/ui/toggle"

export default function FiscalYearForm({ theme, language = "ko" }) {
  const [holidays, setHolidays] = useState([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentHoliday, setCurrentHoliday] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [selectedHolidays, setSelectedHolidays] = useState([])
  const [formData, setFormData] = useState({
    year: new Date().getFullYear(),
    month: 1,
    day: 1,
    endYear: new Date().getFullYear(),
    endMonth: 1,
    endDay: 1,
    title: "",
    us_observed: false,
    rok_observed: false,
    katusa_observed: false,
    usfk_only: false,
  })

  const supabase = supabaseClient

  // 페이지네이션 상태 추가
  const [pagination, setPagination] = useState({
    page: 1,
    perPage: 10,
    total: 0,
  })

  // 필터링 상태 추가
  const [filter, setFilter] = useState({
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
      // 카테고리별 이벤트 가져오기
      const categories = ["us-holiday", "korean-army", "basic"]

      // 기본 쿼리 설정
      let query = supabase.from("events").select("*", { count: "exact" }).in("category", categories)

      // 검색어 필터 적용
      if (filter.search) {
        query = query.ilike("title", `%${filter.search}%`)
      }

      // 연도 필터 적용
      if (filter.year) {
        const startDate = new Date(Number.parseInt(filter.year), 0, 1).toISOString()
        const endDate = new Date(Number.parseInt(filter.year), 11, 31).toISOString()
        query = query.gte("start_at", startDate).lte("start_at", endDate)
      }

      // 정렬 및 페이지네이션 적용
      query = query.order("start_at", { ascending: true })

      // 페이지네이션 범위 계산
      const from = (pagination.page - 1) * pagination.perPage
      const to = from + pagination.perPage - 1

      // 쿼리 실행
      const { data: allEvents, error, count } = await query.range(from, to)

      if (error) throw error

      // 총 개수 업데이트
      setPagination((prev) => ({ ...prev, total: count || 0 }))

      // 날짜별로 그룹화
      const holidaysByDate = {}

      allEvents.forEach((event) => {
        const dateKey = event.start_at.split("T")[0] // YYYY-MM-DD 형식으로 추출
        const title = event.title.replace(" (USFK Only)", "") // USFK Only 표시 제거

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

        // 이벤트 추가
        holidaysByDate[dateKey].events.push(event)
      })

      // 날짜별 그룹화된 데이터를 배열로 변환
      const formattedHolidays = Object.values(holidaysByDate).map((holiday) => {
        const date = new Date(holiday.date)
        const endDate = new Date(holiday.end_date)
        return {
          ...holiday,
          day_of_week: getDayOfWeek(date.getFullYear(), date.getMonth() + 1, date.getDate()),
          id: holiday.events[0].id, // 첫 번째 이벤트의 ID를 사용
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

  // 요일 계산 함수
  const getDayOfWeek = (year, month, day) => {
    const date = new Date(year, month - 1, day)
    const days = ["일", "월", "화", "수", "목", "금", "토"]
    return days[date.getDay()]
  }

  // 폼 데이터 변경 핸들러
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    })
  }

  // 토글 버튼 핸들러
  const handleToggle = (field) => {
    setFormData({
      ...formData,
      [field]: !formData[field],
    })
  }

  // 필터 변경 핸들러
  const handleFilterChange = (e) => {
    const { name, value } = e.target
    setFilter((prev) => ({
      ...prev,
      [name]: value,
    }))
    setPagination((prev) => ({ ...prev, page: 1 })) // 필터 변경 시 첫 페이지로 이동
  }

  // 필터 초기화 핸들러
  const resetFilters = () => {
    setFilter({
      search: "",
      year: "",
    })
    setPagination((prev) => ({ ...prev, page: 1 }))
  }

  // 페이지 변경 핸들러
  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, page: newPage }))
  }

  // 페이지당 항목 수 변경 핸들러
  const handlePerPageChange = (newPerPage) => {
    setPagination({ page: 1, perPage: newPerPage, total: pagination.total })
  }

  // 모달 열기 함수
  const openModal = (holiday = null) => {
    if (holiday) {
      // 수정 모드
      const startDate = new Date(holiday.date)
      const endDate = new Date(holiday.end_date)

      setFormData({
        year: startDate.getFullYear(),
        month: startDate.getMonth() + 1,
        day: startDate.getDate(),
        endYear: endDate.getFullYear(),
        endMonth: endDate.getMonth() + 1,
        endDay: endDate.getDate(),
        title: holiday.title,
        us_observed: holiday.us_observed,
        rok_observed: holiday.rok_observed,
        katusa_observed: holiday.katusa_observed,
        usfk_only: holiday.usfk_only,
      })
      setCurrentHoliday(holiday)
      setIsEditing(true)
    } else {
      // 추가 모드
      const now = new Date()
      setFormData({
        year: now.getFullYear(),
        month: now.getMonth() + 1,
        day: now.getDate(),
        endYear: now.getFullYear(),
        endMonth: now.getMonth() + 1,
        endDay: now.getDate(),
        title: "",
        us_observed: false,
        rok_observed: false,
        katusa_observed: false,
        usfk_only: false,
      })
      setCurrentHoliday(null)
      setIsEditing(false)
    }
    setIsModalOpen(true)
  }

  // 모달 닫기 함수
  const closeModal = () => {
    setIsModalOpen(false)
    setCurrentHoliday(null)
  }

  // 휴일 저장 함수
  const saveHoliday = async () => {
    // 필수 필드 검증
    if (!formData.title.trim()) {
      toast.error(text.titleRequired || "제목을 입력해주세요.")
      return
    }

    try {
      // 시작 날짜 설정
      const startDate = new Date(formData.year, formData.month - 1, formData.day, 0, 0, 0)

      // 종료 날짜 설정
      const endDate = new Date(formData.endYear, formData.endMonth - 1, formData.endDay, 23, 59, 59)

      // 종료 날짜가 시작 날짜보다 이전인 경우
      if (endDate < startDate) {
        toast.error("종료 날짜는 시작 날짜보다 이후여야 합니다.")
        return
      }

      // 유효한 날짜인지 확인
      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        toast.error(text.invalidDate || "유효하지 않은 날짜입니다.")
        return
      }

      // 이벤트 생성 또는 업데이트를 위한 배열
      const events = []

      // 기존 이벤트 삭제 (수정 모드인 경우)
      if (isEditing && currentHoliday) {
        // 관련된 모든 이벤트 삭제
        if (currentHoliday.events && currentHoliday.events.length > 0) {
          const eventIds = currentHoliday.events.map((event) => event.id)
          const { error: deleteError } = await supabase.from("events").delete().in("id", eventIds)

          if (deleteError) throw deleteError
        }
      }

      // 새 이벤트 생성
      // 미군 휴일
      if (formData.us_observed) {
        events.push({
          title: formData.title,
          start_at: startDate.toISOString(),
          end_at: endDate.toISOString(),
          category: "us-holiday",
          all_day: true,
          is_holiday: true,
          is_usfk: false,
          created_at: new Date().toISOString(),
        })
      }

      // 한국군 휴일
      if (formData.rok_observed) {
        events.push({
          title: formData.title,
          start_at: startDate.toISOString(),
          end_at: endDate.toISOString(),
          category: "korean-army",
          all_day: true,
          is_holiday: true,
          is_usfk: false,
          created_at: new Date().toISOString(),
        })
      }

      // 카투사 휴일
      if (formData.katusa_observed) {
        events.push({
          title: formData.title,
          start_at: startDate.toISOString(),
          end_at: endDate.toISOString(),
          category: "basic",
          all_day: true,
          is_holiday: true,
          is_usfk: false,
          created_at: new Date().toISOString(),
        })
      }

      // USFK Only
      if (formData.usfk_only) {
        events.push({
          title: `${formData.title} (USFK Only)`,
          start_at: startDate.toISOString(),
          end_at: endDate.toISOString(),
          category: "basic",
          all_day: true,
          is_holiday: true,
          is_usfk: true,
          created_at: new Date().toISOString(),
        })
      }

      // 이벤트 저장
      if (events.length > 0) {
        const { error: insertError } = await supabase.from("events").insert(events)

        if (insertError) throw insertError
      }

      toast.success(
        isEditing ? text.saveSuccess || "휴일이 수정되었습니다." : text.addSuccess || "새 휴일이 추가되었습니다.",
      )
      fetchHolidays()
      closeModal()
    } catch (error) {
      console.error("Error saving holiday:", error)
      toast.error(text.saveError || "휴일 저장 중 오류가 발생했습니다.")
    }
  }

  // 휴일 삭제 함수
  const deleteHoliday = async () => {
    if (!currentHoliday) return

    if (!window.confirm(text.deleteConfirm || "정말로 이 휴일을 삭제하시겠습니까?")) return

    try {
      // 관련된 모든 이벤트 삭제
      if (currentHoliday.events && currentHoliday.events.length > 0) {
        const eventIds = currentHoliday.events.map((event) => event.id)
        const { error: deleteError } = await supabase.from("events").delete().in("id", eventIds)

        if (deleteError) throw deleteError
      }

      toast.success(text.deleteSuccess || "휴일이 삭제되었습니다.")
      fetchHolidays()
      closeModal()
    } catch (error) {
      console.error("Error deleting holiday:", error)
      toast.error(text.deleteError || "휴일 삭제 중 오류가 발생했습니다.")
    }
  }

  // 선택된 항목 삭제 핸들러
  const handleDeleteSelected = async () => {
    if (selectedHolidays.length === 0) return
    if (!window.confirm(`선택한 ${selectedHolidays.length}개의 휴일을 삭제하시겠습니까?`)) return

    try {
      setLoading(true)
      // 선택된 모든 이벤트 ID 수집
      const eventIds = []
      selectedHolidays.forEach((holidayId) => {
        const holiday = holidays.find((h) => h.id === holidayId)
        if (holiday && holiday.events) {
          holiday.events.forEach((event) => {
            eventIds.push(event.id)
          })
        }
      })

      // 이벤트 삭제
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

  // 전체 삭제 핸들러
  const handleDeleteAll = async () => {
    if (!window.confirm("모든 휴일을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.")) return

    try {
      setLoading(true)
      // 현재 필터에 해당하는 모든 이벤트 삭제
      const categories = ["us-holiday", "korean-army", "basic"]

      // 기본 쿼리 설정
      let query = supabase.from("events").delete().in("category", categories)

      // 연도 필터 적용
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

  // 전체 선택/해제 핸들러
  const handleSelectAll = (checked) => {
    if (checked) {
      // 현재 페이지의 모든 휴일 ID 선택
      setSelectedHolidays(holidays.map((holiday) => holiday.id))
    } else {
      // 모든 선택 해제
      setSelectedHolidays([])
    }
  }

  // 개별 항목 선택/해제 핸들러
  const handleSelectItem = (e, holidayId) => {
    e.stopPropagation()
    setSelectedHolidays((prev) => {
      if (prev.includes(holidayId)) {
        // 이미 선택된 경우 선택 해제
        return prev.filter((id) => id !== holidayId)
      } else {
        // 선택되지 않은 경우 선택 추가
        return [...prev, holidayId]
      }
    })
  }

  // 연도 옵션 생성
  const currentYear = new Date().getFullYear()
  const yearOptions = Array.from({ length: 10 }, (_, i) => currentYear - 5 + i)

  return (
    <div className="w-full">
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-xl font-semibold">{text.title || "Fiscal Year 휴일 관리"}</h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => openModal()}>
            <Plus className="h-4 w-4 mr-2" />
            {text.addHoliday || "새 휴일 추가"}
          </Button>
          <Button
            variant="default"
            onClick={saveToCalendars}
            disabled={loading || holidays.length === 0}
            className={`${theme === "dark" ? "bg-blue-600 text-white" : "bg-blue-100 text-blue-600"}`}
          >
            <Check className="h-4 w-4 mr-2" />
            {text.regenerateICS || "ICS 파일 재생성"}
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
            {/* 삭제 버튼 추가 */}
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
      <div className="w-full overflow-x-auto rounded-lg border">
        <table className="w-full">
          <thead className={`${theme === "dark" ? "bg-gray-800" : "bg-gray-50"}`}>
            <tr>
              {/* 체크박스 열 추가 */}
              <th className="px-4 py-3 text-left text-sm font-medium w-10">
                <input
                  type="checkbox"
                  checked={selectedHolidays.length === holidays.length && holidays.length > 0}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium hidden md:table-cell">{text.date || "날짜"}</th>
              <th className="px-4 py-3 text-left text-sm font-medium table-cell md:aria-hidden:">{"제목 및 날짜"}</th>
              <th className="px-4 py-3 text-left text-sm font-medium hidden md:table-cell">
                {text.dayOfWeek || "요일"}
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium hidden md:table-cell">{text.title || "제목"}</th>
              <th className="px-4 py-3 text-center text-sm font-medium hidden md:table-cell">{text.us || "US"}</th>
              <th className="px-4 py-3 text-center text-sm font-medium hidden md:table-cell">{text.rok || "ROK"}</th>
              <th className="px-4 py-3 text-center text-sm font-medium hidden md:table-cell">
                {text.katusa || "KATUSA"}
              </th>
              <th className="px-4 py-3 text-center text-sm font-medium hidden md:table-cell">
                {text.usfkOnly || "USFK Only"}
              </th>
              <th className="px-4 py-3 text-right text-sm font-medium">{text.actions || "작업"}</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {loading ? (
              <tr>
                <td colSpan={9} className="px-4 py-8 text-center">
                  {text.loading || "로딩 중..."}
                </td>
              </tr>
            ) : holidays.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-4 py-8 text-center">
                  {text.noHolidays || "등록된 휴일이 없습니다."}
                </td>
              </tr>
            ) : (
              holidays.map((holiday) => {
                const date = new Date(holiday.date)
                return (
                  <tr key={holiday.id} className="hover:bg-gray-600/20 cursor-pointer" onClick={() => openModal(holiday)}>
                    {/* 체크박스 셀 추가 */}
                    <td className="px-4 py-3 text-sm">
                      <input
                        type="checkbox"
                        checked={selectedHolidays.includes(holiday.id)}
                        onChange={(e) => handleSelectItem(e, holiday.id)}
                        onClick={(e) => e.stopPropagation()}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex flex-col md:hidden">
                        <span className="font-medium">{holiday.title}</span>
                        <span className="text-xs text-muted-foreground mt-1">
                          {date.getFullYear()}-{String(date.getMonth() + 1).padStart(2, "0")}-
                          {String(date.getDate()).padStart(2, "0")}
                        </span>
                      </div>
                      <span className="hidden md:inline">
                        {date.getFullYear()}-{String(date.getMonth() + 1).padStart(2, "0")}-
                        {String(date.getDate()).padStart(2, "0")}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm hidden md:table-cell">{holiday.day_of_week}</td>
                    <td className="px-4 py-3 text-sm hidden md:table-cell">{holiday.title}</td>
                    <td className="px-4 py-3 text-sm text-center hidden md:table-cell">
                      <Badge
                        variant={holiday.us_observed ? "success" : "destructive"}
                        className={
                          holiday.us_observed ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" : ""
                        }
                      >
                        {holiday.us_observed ? text.yes || "Yes" : text.no || "No"}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-sm text-center hidden md:table-cell">
                      <Badge
                        variant={holiday.rok_observed ? "success" : "destructive"}
                        className={
                          holiday.rok_observed
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                            : ""
                        }
                      >
                        {holiday.rok_observed ? text.yes || "Yes" : text.no || "No"}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-sm text-center hidden md:table-cell">
                      <Badge
                        variant={holiday.katusa_observed ? "success" : "destructive"}
                        className={
                          holiday.katusa_observed
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                            : ""
                        }
                      >
                        {holiday.katusa_observed ? text.yes || "Yes" : text.no || "No"}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-sm text-center hidden md:table-cell">
                      <Badge
                        variant={holiday.usfk_only ? "default" : "outline"}
                        className={
                          holiday.usfk_only ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" : ""
                        }
                      >
                        {holiday.usfk_only ? text.yes || "Yes" : text.no || "No"}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-sm text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation()
                            openModal(holiday)
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation()
                            setCurrentHoliday(holiday)
                            deleteHoliday()
                          }}
                          className="text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      {/* 페이지네이션 */}
      <div className="flex justify-between items-center mt-4">
        <div className="text-sm text-muted-foreground">
          {pagination.total > 0
            ? `${(pagination.page - 1) * pagination.perPage + 1}-${Math.min(pagination.page * pagination.perPage, pagination.total)} / ${pagination.total}`
            : "0 결과"}
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center mr-4">
            <Label htmlFor="perPage" className="mr-2">
              페이지당 항목:
            </Label>
            <select
              id="perPage"
              value={pagination.perPage}
              onChange={(e) => handlePerPageChange(Number(e.target.value))}
              className="h-8 w-16 rounded-md border border-input bg-background px-2"
            >
              {[5, 10, 20, 50].map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-1">
            <Button
              variant="outline"
              size="icon"
              onClick={() => handlePageChange(1)}
              disabled={pagination.page === 1}
              className={theme === "dark" ? "text-gray-300 hover:text-white" : "text-gray-700 hover:text-black"}
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <span className="flex items-center px-2 text-sm">
              {pagination.page} / {Math.max(1, Math.ceil(pagination.total / pagination.perPage))}
            </span>

            <Button
              variant="outline"
              size="icon"
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page >= Math.ceil(pagination.total / pagination.perPage)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => handlePageChange(Math.ceil(pagination.total / pagination.perPage))}
              disabled={pagination.page >= Math.ceil(pagination.total / pagination.perPage)}
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* 모달 */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className={theme === "dark" ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200"}>
          <DialogHeader>
            <DialogTitle>
              {isEditing ? text.editHoliday || "휴일 수정" : text.addNewHoliday || "새 휴일 추가"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* 시작 날짜 입력 */}
            <div>
              <Label>시작 날짜</Label>
              <div className="grid grid-cols-3 gap-2 mt-1">
                <div>
                  <Label htmlFor="year" className="sr-only">
                    {text.year || "연도"} *
                  </Label>
                  <Input
                    type="number"
                    id="year"
                    name="year"
                    value={formData.year}
                    onChange={handleChange}
                    min="2000"
                    max="2100"
                    placeholder="연도"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="month" className="sr-only">
                    {text.month || "월"} *
                  </Label>
                  <Input
                    type="number"
                    id="month"
                    name="month"
                    value={formData.month}
                    onChange={handleChange}
                    min="1"
                    max="12"
                    placeholder="월"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="day" className="sr-only">
                    {text.day || "일"} *
                  </Label>
                  <Input
                    type="number"
                    id="day"
                    name="day"
                    value={formData.day}
                    onChange={handleChange}
                    min="1"
                    max="31"
                    placeholder="일"
                    required
                  />
                </div>
              </div>
            </div>

            {/* 종료 날짜 입력 */}
            <div>
              <Label>종료 날짜</Label>
              <div className="grid grid-cols-3 gap-2 mt-1">
                <div>
                  <Label htmlFor="endYear" className="sr-only">
                    {text.year || "연도"} *
                  </Label>
                  <Input
                    type="number"
                    id="endYear"
                    name="endYear"
                    value={formData.endYear}
                    onChange={handleChange}
                    min="2000"
                    max="2100"
                    placeholder="연도"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="endMonth" className="sr-only">
                    {text.month || "월"} *
                  </Label>
                  <Input
                    type="number"
                    id="endMonth"
                    name="endMonth"
                    value={formData.endMonth}
                    onChange={handleChange}
                    min="1"
                    max="12"
                    placeholder="월"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="endDay" className="sr-only">
                    {text.day || "일"} *
                  </Label>
                  <Input
                    type="number"
                    id="endDay"
                    name="endDay"
                    value={formData.endDay}
                    onChange={handleChange}
                    min="1"
                    max="31"
                    placeholder="일"
                    required
                  />
                </div>
              </div>
            </div>

            {/* 요일 표시 */}
            <div>
              <Label>{text.dayOfWeek || "요일"}</Label>
              <div className="h-10 px-3 py-2 rounded-md border bg-muted">
                {getDayOfWeek(formData.year, formData.month, formData.day)}
              </div>
            </div>

            {/* 제목 입력 */}
            <div>
              <Label htmlFor="title">{text.holidayTitle || "제목"} *</Label>
              <Input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder={text.holidayTitlePlaceholder || "휴일 이름을 입력하세요"}
              />
            </div>

            {/* Observed by 토글 버튼 */}
            <div className="space-y-3">
              <Label>{text.observedBy || "Observed by"}</Label>

              <div className="flex items-center justify-between">
                <span className="text-sm">{text.us || "US"}</span>
                <Toggle
                  pressed={formData.us_observed}
                  onPressedChange={() => handleToggle("us_observed")}
                  variant="outline"
                  className={
                    formData.us_observed ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" : ""
                  }
                >
                  {formData.us_observed ? text.yes || "Yes" : text.no || "No"}
                </Toggle>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm">{text.rok || "ROK"}</span>
                <Toggle
                  pressed={formData.rok_observed}
                  onPressedChange={() => handleToggle("rok_observed")}
                  variant="outline"
                  className={
                    formData.rok_observed ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" : ""
                  }
                >
                  {formData.rok_observed ? text.yes || "Yes" : text.no || "No"}
                </Toggle>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm">{text.katusa || "KATUSA"}</span>
                <Toggle
                  pressed={formData.katusa_observed}
                  onPressedChange={() => handleToggle("katusa_observed")}
                  variant="outline"
                  className={
                    formData.katusa_observed ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" : ""
                  }
                >
                  {formData.katusa_observed ? text.yes || "Yes" : text.no || "No"}
                </Toggle>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm">{text.usfkOnly || "USFK Only"}</span>
                <Toggle
                  pressed={formData.usfk_only}
                  onPressedChange={() => handleToggle("usfk_only")}
                  variant="outline"
                  className={
                    formData.usfk_only ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" : ""
                  }
                >
                  {formData.usfk_only ? text.yes || "Yes" : text.no || "No"}
                </Toggle>
              </div>
            </div>
          </div>

          <DialogFooter className="flex justify-between">
            {isEditing ? (
              <Button variant="destructive" onClick={deleteHoliday}>
                <Trash2 className="h-4 w-4 mr-2" />
                {text.delete || "삭제"}
              </Button>
            ) : (
              <div></div>
            )}

            <div className="flex gap-2">
              <Button variant="outline" onClick={closeModal}>
                {text.cancel || "취소"}
              </Button>
              <Button onClick={saveHoliday}>
                <Check className="h-4 w-4 mr-2" />
                {isEditing ? text.edit || "수정" : text.add || "추가"}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// 일정 저장 함수 (ICS 파일 재생성)
const saveToCalendars = async () => {
  try {
    // ICS 파일 재생성 API 호출
    try {
      const { data: settingsData } = await supabase
        .from("site_settings")
        .select("value")
        .eq("key", "cron_secret")
        .single()

      const cronSecret = settingsData?.value || process.env.NEXT_PUBLIC_CRON_SECRET || "default-secret"

      const response = await fetch("/api/generate-ics", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${cronSecret}`,
        },
      })

      if (!response.ok) {
        throw new Error("ICS 파일 재생성에 실패했습니다.")
      }

      toast.success("ICS 파일이 재생성되었습니다.")
    } catch (icsError) {
      console.error("Error regenerating ICS files:", icsError)
      toast.error("ICS 파일 재생성 중 오류가 발생했습니다.")
    }
  } catch (error) {
    console.error("Error saving to calendars:", error)
    toast.error("캘린더 저장 중 오류가 발생했습니다.")
  }
}
