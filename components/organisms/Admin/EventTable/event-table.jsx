"use client"

import { useState, useEffect } from "react"
import { Edit, Trash2, RotateCcw } from "lucide-react"
import { PaginationControls } from "@/components/molecules/Controls"
import { TablePlaceholder } from "@/components/atoms/Display"
import { TextPlaceholder } from "@/components/atoms/Display/TextPlaceholder/text-placeholder"
import { useTheme } from "@/components/providers/theme-provider"

export default function EventTable({
  events,
  loading,
  onEdit,
  ableToEdit = true,
  onRestore,
  ableToRestore = false,
  onDelete,
  pagination,
  onPageChange,
  onPerPageChange,
  selectedItems = [],
  onSelectAll,
  onSelectItem,
  onDeleteSelected,
}) {
  const { theme } = useTheme()
  const [selectMode, setSelectMode] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Hydration 문제 방지
  useEffect(() => {
    setMounted(true)
  }, [])

  // 전체 선택 상태 확인
  const allSelected = events.length > 0 && selectedItems.length === events.length

  // 선택 모드 토글
  const toggleSelectMode = () => {
    setSelectMode(!selectMode)
    if (selectMode) {
      // 선택 모드를 끌 때 선택된 항목 초기화
      onSelectAll(false)
    }
  }

  // 날짜 포맷 함수
  const formatDate = (dateString, all_day) => {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return "유효하지 않은 날짜"
    if (all_day) {
      // 종일 일정인 경우 시간은 표시하지 않음
      return date.toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      })
    }
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const formatEndDate = (dateString, all_day) => {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return "유효하지 않은 날짜"
    if (all_day) {
      // 종료일의 종일일정은 하루를 빼야 한다.
      date.setDate(date.getDate() - 1)
      return date.toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      })
    }
    return formatDate(dateString, all_day)
  }

  // 페이지네이션 헬퍼 함수들
  const getTotalPages = () => Math.ceil(pagination.total / pagination.perPage) || 1

  const getDisplayRange = () => {
    if (pagination.total === 0) return "0 결과"
    const start = (pagination.page - 1) * pagination.perPage + 1
    const end = Math.min(pagination.page * pagination.perPage, pagination.total)
    return `${start}-${end} / ${pagination.total}`
  }

  // Theme 안전장치 (Hydration 문제 방지)
  const safeTheme = mounted ? theme : 'light'

  // 마운트되지 않았을 때 placeholder 표시
  if (!mounted) {
    return (
      <div className="space-y-4">
        {/* Controls Placeholder */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
          <TextPlaceholder placeholder="총 0개의 일정">
            <div className="text-sm">총 <span className="font-medium">0</span>개의 일정</div>
          </TextPlaceholder>
        </div>

        {/* Action Buttons Placeholder */}
        <div className="flex justify-between items-center mb-4">
          <div className="h-10 w-24 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
        </div>

        {/* Table Placeholder */}
        <TablePlaceholder 
          rows={5}
          columns={2}
          headers={["제목", "위치"]}
          showActions={true}
          showCheckbox={false}
        />

        {/* Pagination Placeholder */}
        <div className="flex justify-between items-center">
          <div className="h-10 w-32 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
          <div className="flex gap-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
            ))}
          </div>
          <div className="h-10 w-24 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Table Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
        <TextPlaceholder placeholder={`총 ${pagination.total}개의 일정`}>
          <div className="text-sm">
            총 <span className="font-medium">{pagination.total}</span>개의 일정
          </div>
        </TextPlaceholder>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={toggleSelectMode}
          className={`px-4 py-2 rounded-md text-sm transition-colors ${
            safeTheme === "dark"
              ? selectMode
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-gray-700 text-white hover:bg-gray-600"
              : selectMode
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
          }`}
        >
          <TextPlaceholder placeholder={selectMode ? "선택 완료" : "선택 삭제"}>
            {selectMode ? "선택 완료" : "선택 삭제"}
          </TextPlaceholder>
        </button>

        {selectMode && selectedItems.length > 0 && (
          <button
            onClick={onDeleteSelected}
            className={`px-4 py-2 rounded-md text-sm transition-colors ${
              safeTheme === "dark" ? "bg-red-600 text-white hover:bg-red-700" : "bg-red-600 text-white hover:bg-red-700"
            }`}
          >
            <TextPlaceholder placeholder={`선택 항목 삭제 (${selectedItems.length}개)`}>
              선택 항목 삭제 ({selectedItems.length}개)
            </TextPlaceholder>
          </button>
        )}
      </div>

      {/* 일정 목록 테이블 */}
      {loading ? (
        <TablePlaceholder 
          rows={5}
          columns={4}
          headers={["제목", "시작일", "종료일", "위치"]}
          showActions={true}
          showCheckbox={selectMode}
        />
      ) : (
        <div className="w-full overflow-hidden rounded-lg border border-inherit">
          <table className="w-full">
            <thead className={`${safeTheme === "dark" ? "bg-gray-800" : "bg-gray-50"}`}>
              <tr>
                {selectMode && (
                  <th className="px-4 py-3 w-10">
                    <input
                      type="checkbox"
                      checked={allSelected}
                      onChange={(e) => onSelectAll(e.target.checked)}
                      className="rounded border-gray-300"
                    />
                  </th>
                )}
                <th className="px-4 py-3 text-left text-sm font-medium">
                  <TextPlaceholder placeholder="제목">제목</TextPlaceholder>
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium hidden md:table-cell">
                  <TextPlaceholder placeholder="시작일">시작일</TextPlaceholder>
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium hidden md:table-cell">
                  <TextPlaceholder placeholder="종료일">종료일</TextPlaceholder>
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium hidden md:table-cell">
                  <TextPlaceholder placeholder="위치">위치</TextPlaceholder>
                </th>
                <th className="px-4 py-3 text-right text-sm font-medium">
                  <TextPlaceholder placeholder="작업">작업</TextPlaceholder>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-inherit">
              {events.length === 0 ? (
                <tr>
                  <td colSpan={selectMode ? 6 : 5} className="px-4 py-8 text-center">
                    <TextPlaceholder placeholder="일정이 없습니다.">
                      일정이 없습니다.
                    </TextPlaceholder>
                  </td>
                </tr>
              ) : (
                events.map((event) => (
                  <tr key={event.id} className={`transition-colors ${safeTheme === "dark" ? "hover:bg-gray-800" : "hover:bg-gray-50"}`}>
                    {selectMode && (
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={selectedItems.includes(event.id)}
                          onChange={() => onSelectItem(event.id)}
                          className="rounded border-gray-300"
                        />
                      </td>
                    )}
                    <td className="px-4 py-3 text-sm font-medium">{event.title}</td>
                    <td className="px-4 py-3 text-sm hidden md:table-cell">{formatDate(event.start_at, event.all_day)}</td>
                    <td className="px-4 py-3 text-sm hidden md:table-cell">{formatEndDate(event.end_at, event.all_day)}</td>
                    <td className="px-4 py-3 text-sm hidden md:table-cell">{event.location || "-"}</td>
                    <td className="px-4 py-3 text-sm text-right">
                      <div className="flex justify-end gap-2">
                        {ableToEdit && (
                          <button
                            onClick={() => onEdit(event)}
                            className={`p-1 rounded-md transition-colors ${safeTheme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-200"}`}
                            title="수정"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                        )}
                        {ableToRestore && (
                          <button
                            onClick={() => onRestore(event)}
                            className={`p-1 rounded-md transition-colors ${safeTheme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-200"}`}
                            title="복원"
                          >
                            <RotateCcw className="h-4 w-4" />
                          </button>
                        )}
                        <button
                          onClick={() => onDelete(event)}
                          className={`p-1 rounded-md transition-colors ${safeTheme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-200"}`}
                          title="삭제"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination using PaginationControls component */}
      <PaginationControls
        pagination={pagination}
        onPageChange={onPageChange}
        onPerPageChange={onPerPageChange}
        theme={safeTheme}
        perPageOptions={[5, 10, 20, 50]}
        getDisplayRange={getDisplayRange}
        getTotalPages={getTotalPages}
      />
    </div>
  )
}
