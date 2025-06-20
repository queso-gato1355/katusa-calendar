"use client"

import { useState } from "react"
import { Edit, Trash2, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react"

export default function EventTable({
  events,
  loading,
  theme,
  onEdit,
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
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="space-y-4">
      {/* Table Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
        <div className="text-sm">
          총 <span className="font-medium">{pagination.total}</span>개의 일정
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor="perPage" className="text-sm">
            페이지당 항목:
          </label>
          <select
            id="perPage"
            value={pagination.perPage}
            onChange={(e) => onPerPageChange(Number(e.target.value))}
            className={`rounded-md border px-2 py-1 text-sm ${
              theme === "dark" ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-300 text-gray-900"
            }`}
          >
            {[5, 10, 20, 50].map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
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
                  <td className="px-4 py-3 text-sm hidden md:table-cell">{formatDate(event.start_at)}</td>
                  <td className="px-4 py-3 text-sm hidden md:table-cell">{formatDate(event.end_at)}</td>
                  <td className="px-4 py-3 text-sm hidden md:table-cell">{event.location || "-"}</td>
                  <td className="px-4 py-3 text-sm text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => onEdit(event)}
                        className={`p-1 rounded-md ${theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-200"}`}
                        title="수정"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
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

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <div className="text-sm">
          {pagination.total > 0
            ? `${(pagination.page - 1) * pagination.perPage + 1}-${Math.min(pagination.page * pagination.perPage, pagination.total)} / ${pagination.total}`
            : "0 결과"}
        </div>
        <div className="flex gap-1">
          <button
            onClick={() => onPageChange(1)}
            disabled={pagination.page === 1}
            className={`p-1 rounded-md ${
              theme === "dark" ? "hover:bg-gray-800 disabled:text-gray-700" : "hover:bg-gray-100 disabled:text-gray-300"
            } disabled:cursor-not-allowed`}
          >
            <ChevronsLeft className="h-5 w-5" />
          </button>
          <button
            onClick={() => onPageChange(pagination.page - 1)}
            disabled={pagination.page === 1}
            className={`p-1 rounded-md ${
              theme === "dark" ? "hover:bg-gray-800 disabled:text-gray-700" : "hover:bg-gray-100 disabled:text-gray-300"
            } disabled:cursor-not-allowed`}
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <div className="flex items-center px-2">
            <span className="text-sm">
              {pagination.page} / {Math.ceil(pagination.total / pagination.perPage) || 1}
            </span>
          </div>

          <button
            onClick={() => onPageChange(pagination.page + 1)}
            disabled={pagination.page >= Math.ceil(pagination.total / pagination.perPage)}
            className={`p-1 rounded-md ${
              theme === "dark" ? "hover:bg-gray-800 disabled:text-gray-700" : "hover:bg-gray-100 disabled:text-gray-300"
            } disabled:cursor-not-allowed`}
          >
            <ChevronRight className="h-5 w-5" />
          </button>
          <button
            onClick={() => onPageChange(Math.ceil(pagination.total / pagination.perPage))}
            disabled={pagination.page >= Math.ceil(pagination.total / pagination.perPage)}
            className={`p-1 rounded-md ${
              theme === "dark" ? "hover:bg-gray-800 disabled:text-gray-700" : "hover:bg-gray-100 disabled:text-gray-300"
            } disabled:cursor-not-allowed`}
          >
            <ChevronsRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  )
}
