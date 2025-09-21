"use client"

// 기본
import { useState, useEffect } from "react"
import toast from "react-hot-toast"

// 아이콘
import { Plus, Check } from "lucide-react"
import { Button } from "@/components/atoms/Button/button"
import { Input } from "@/components/atoms/Input/input"
import { Label } from "@/components/atoms/Form/label"

// 함수 & 훅
import { getDayOfWeek, generateYearOptions } from "@/lib/utils/date"
import { regenerateICSFiles } from "@/lib/services/ics"
import { usePagination } from "@/lib/hooks/use-pagination"
import { useFilter } from "@/lib/hooks/use-filter"
import { 
  fetchEventsByCategoryWithFlexibleQuery, 
  softDeleteEventsByCategory,
  softDeleteEvents
} from "@/lib/api/supabase/helpers"

// 컴포넌트
import { PaginationControls } from "@/components/molecules/Controls"
import { PassModal } from "../PassModal/pass-modal"
import { PassTable } from "../../Admin/PassTable/pass-table"

export default function FiscalYearForm({ theme, language = "ko" }) {
  const [passes, setPasses] = useState([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentPass, setCurrentPass] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [selectedPasses, setSelectedPasses] = useState([])

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

  // 휴일 데이터 가져오기
  useEffect(() => {
    fetchPasses()
  }, [pagination.page, pagination.perPage, filter])

  const fetchPasses = async () => {
    setLoading(true)
    try {
      const categories = ["us-holiday", "korean-army", "basic"]

      // 필터 적용
      let queryList = []
      if (filter.search) {
        queryList.push(q => q.ilike("title", `%${filter.search}%`))
      }
      if (filter.year) {
        const startDate = new Date(Number.parseInt(filter.year), 0, 1).toISOString()
        const endDate = new Date(Number.parseInt(filter.year), 11, 31).toISOString()
        queryList.push(q => q.gte("start_at", startDate).lte("start_at", endDate))
      }
      queryList.push(q => q.order("start_at", { ascending: true }))

      let query = await fetchEventsByCategoryWithFlexibleQuery(categories, queryList)
      const { data: allEvents, error } = query

      if (error) throw error

      // 날짜+제목별로 그룹화
      const holidaysByKey = {}

      allEvents.forEach((event) => {
      const dateKey = event.start_at.split("T")[0]
      const title = event.title.replace(" (USFK Only)", "")
      const groupKey = `${dateKey}|${title}`

      if (!holidaysByKey[groupKey]) {
        holidaysByKey[groupKey] = {
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
        holidaysByKey[groupKey].us_observed = true
      } else if (event.category === "korean-army") {
        holidaysByKey[groupKey].rok_observed = true
      } else if (event.category === "basic") {
        if (event.is_usfk) {
        holidaysByKey[groupKey].usfk_only = true
        } else {
        holidaysByKey[groupKey].katusa_observed = true
        }
      }

      holidaysByKey[groupKey].events.push(event)
      })

      const formattedPasses = Object.values(holidaysByKey).map((pass) => {
      const date = new Date(pass.date)
      return {
        ...pass,
        day_of_week: getDayOfWeek(date.getFullYear(), date.getMonth() + 1, date.getDate()),
        id: pass.events[0].id,
      }
      })

      // 전체 그룹화된 패스에서 페이지네이션 적용
      const total = formattedPasses.length
      setTotal(total)

      const from = (pagination.page - 1) * pagination.perPage
      const to = from + pagination.perPage
      const pagedPasses = formattedPasses.slice(from, to)

      setPasses(pagedPasses || [])
    } catch (error) {
      console.error("Error fetching passes:", error)
      toast.error("휴일 정보를 불러오는 중 오류가 발생했습니다.")
    } finally {
      setLoading(false)
    }
  }

  const resetFilters = () => {
    resetFilterState()
    resetToFirstPage()
  }

  const openModal = (pass = null) => {
    setCurrentPass(pass)
    setIsEditing(!!pass)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setCurrentPass(null)
  }

  const handleSaveSuccess = () => {
    fetchPasses()
    closeModal()
  }

  const handleDeleteSuccess = () => {
    fetchPasses()
    closeModal()
  }

  const handleDeleteSelected = async () => {
    if (selectedPasses.length === 0) return
    if (!window.confirm(`선택한 ${selectedPasses.length}개의 휴일을 삭제하시겠습니까?`)) return

    try {
      setLoading(true)
      const eventIds = []
      selectedPasses.forEach((holidayId) => {
        const pass = passes.find((h) => h.id === holidayId)
        if (pass && pass.events) {
          pass.events.forEach((event) => {
            eventIds.push(event.id)
          })
        }
      })

      if (eventIds.length > 0) {
        const { error } = await softDeleteEvents(eventIds)
        if (error) throw error
      }

      toast.success(`${selectedPasses.length}개의 휴일이 삭제되었습니다.`)
      setSelectedPasses([])
      fetchPasses()
    } catch (error) {
      console.error("Error deleting selected passes:", error)
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
      const { error } = await softDeleteEventsByCategory(categories)
      if (error) throw error

      toast.success("모든 휴일이 삭제되었습니다.")
      setSelectedPasses([])
      fetchPasses()
    } catch (error) {
      console.error("Error deleting all passes:", error)
      toast.error("휴일 삭제 중 오류가 발생했습니다.")
    } finally {
      setLoading(false)
    }
  }

  const yearOptions = generateYearOptions(5)

  return (
    <div className="w-full">
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-xl font-semibold break-keep">Fiscal Year 패스 관리</h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => openModal()} className="hidden md:flex">
            <Plus className="h-4 w-4 mr-2" />
            새 휴일 추가
          </Button>
          <Button variant="outline" onClick={() => openModal()} className="flex md:hidden">
            <Plus className="h-4 w-4 mr-2" />
            추가
          </Button>
          <Button
            variant="default"
            onClick={regenerateICSFiles}
            disabled={loading || passes.length === 0}
            className={`${
              theme === "dark" ? "bg-blue-600 text-white" : "bg-blue-100 text-blue-600"
            } hidden md:flex`}
          >
            <Check className="h-4 w-4 mr-2" />
            ICS 파일 재생성
          </Button>
          <Button
            variant="default"
            onClick={regenerateICSFiles}
            disabled={loading || passes.length === 0}
            className={`${
              theme === "dark" ? "bg-blue-600 text-white" : "bg-blue-100 text-blue-600"
            } flex md:hidden`}
          >
            <Check className="h-4 w-4 mr-2" />
            재생성
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
              className={`${theme === "dark" ? "bg-gray-900" : "bg-gray-200"}`}
            />
          </div>
          <div>
            <Label htmlFor="year">연도</Label>
            <select
              id="year"
              name="year"
              value={filter.year}
              onChange={handleFilterChange}
              className={`w-full h-10 px-3 py-2 ${theme === "dark" ? "bg-gray-900" : "bg-gray-200"} border border-input rounded-md`}
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
            {selectedPasses.length > 0 && (
              <Button variant="destructive" onClick={handleDeleteSelected}>
                선택 삭제 ({selectedPasses.length})
              </Button>
            )}
            {passes.length > 0 && (
              <Button variant="destructive" onClick={handleDeleteAll}>
                전체 삭제
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* 테이블 */}
      <PassTable
        passes={passes}
        loading={loading}
        selectedPasses={selectedPasses}
        setSelectedPasses={setSelectedPasses}
        onEdit={openModal}
        theme={theme}
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
      <PassModal
        isOpen={isModalOpen}
        onClose={closeModal}
        pass={currentPass}
        isEditing={isEditing}
        onSaveSuccess={handleSaveSuccess}
        onDeleteSuccess={handleDeleteSuccess}
        theme={theme}
      />
    </div>
  )
}
