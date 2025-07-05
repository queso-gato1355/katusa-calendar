"use client"

import { useState } from "react"
import { Edit, Trash2, RotateCcw } from "lucide-react"
import { PaginationControls } from "@/components/ui/pagination-controls"

export default function EventTable({
  events,
  loading,
  theme,
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
  const [selectMode, setSelectMode] = useState(false)

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

  // 페이지네이션 헬퍼 함수들
  const getTotalPages = () => Math.ceil(pagination.total / pagination.perPage) || 1

  const getDisplayRange = () => {
    if (pagination.total === 0) return "0 결과"
    const start = (pagination.page - 1) * pagination.perPage + 1
    const end = Math.min(pagination.page * pagination.perPage, pagination.total)
    return `${start}-${end} / ${pagination.total}`
  }

  return (
    <div className="space-y-4">
      {/* Table Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
        <div className="text-sm">
          총 <span className="font-medium">{pagination.total}</span>개의 일정
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={toggleSelectMode}
          className={`px-4 py-2 rounded-md text-sm ${
            theme === "dark"
              ? selectMode
                ? "bg-blue-600 text-white"
                : "bg-gray-700 text-white"
              : selectMode
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-800"
          }`}
        >
          {selectMode ? "선택 완료" : "선택 삭제"}
        </button>

        {selectMode && selectedItems.length > 0 && (
          <button
            onClick={onDeleteSelected}
            className={`px-4 py-2 rounded-md text-sm ${
              theme === "dark" ? "bg-red-600 text-white" : "bg-red-600 text-white"
            }`}
          >
            선택 항목 삭제 ({selectedItems.length}개)
          </button>
        )}
      </div>

      {/* 일정 목록 테이블 */}
      <div className="w-full overflow-hidden rounded-lg border border-inherit">
        <table className="w-full">
          <thead className={`${theme === "dark" ? "bg-gray-800" : "bg-gray-50"}`}>
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
              <th className="px-4 py-3 text-left text-sm font-medium">제목</th>
              <th className="px-4 py-3 text-left text-sm font-medium hidden md:table-cell">시작일</th>
              <th className="px-4 py-3 text-left text-sm font-medium hidden md:table-cell">종료일</th>
              <th className="px-4 py-3 text-left text-sm font-medium hidden md:table-cell">위치</th>
              <th className="px-4 py-3 text-right text-sm font-medium">작업</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-inherit">
            {loading ? (
              <tr>
                <td colSpan={selectMode ? 6 : 5} className="px-4 py-8 text-center">
                  로딩 중...
                </td>
              </tr>
            ) : events.length === 0 ? (
              <tr>
                <td colSpan={selectMode ? 6 : 5} className="px-4 py-8 text-center">
                  일정이 없습니다.
                </td>
              </tr>
            ) : (
              events.map((event) => (
                <tr key={event.id} className={`${theme === "dark" ? "hover:bg-gray-800" : "hover:bg-gray-50"}`}>
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
                  <td className="px-4 py-3 text-sm hidden md:table-cell">{formatDate(event.end_at, event.all_day)}</td>
                  <td className="px-4 py-3 text-sm hidden md:table-cell">{event.location || "-"}</td>
                  <td className="px-4 py-3 text-sm text-right">
                    <div className="flex justify-end gap-2">
                      { ableToEdit && 
                        <button
                          onClick={() => onEdit(event)}
                          className={`p-1 rounded-md ${theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-200"}`}
                          title="수정"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                      }
                      { ableToRestore && 
                        <button
                          onClick={() => onRestore(event)}
                          className={`p-1 rounded-md ${theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-200"}`}
                          title="복원"
                        >
                          <RotateCcw className="h-4 w-4" />
                        </button>
                      }
                      <button
                        onClick={() => onDelete(event)}
                        className={`p-1 rounded-md ${theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-200"}`}
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

      {/* Pagination using PaginationControls component */}
      <PaginationControls
        pagination={pagination}
        onPageChange={onPageChange}
        onPerPageChange={onPerPageChange}
        theme={theme}
        perPageOptions={[5, 10, 20, 50]}
        getDisplayRange={getDisplayRange}
        getTotalPages={getTotalPages}
      />
    </div>
  )
}
