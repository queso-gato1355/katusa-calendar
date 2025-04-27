"use client"
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
  renderCustomActions,
}) {
  const { page, perPage, total } = pagination
  const totalPages = Math.ceil(total / perPage)

  const perPageOptions = [10, 50, 100]

  // 날짜를 사용자 친화적인 형식으로 포맷팅하는 함수
  const formatDateTime = (dateString) => {
    if (!dateString) return "-"

    try {
      // 날짜 객체 생성 (이미 타임존 정보가 포함되어 있음)
      const date = new Date(dateString)

      // 유효한 날짜인지 확인
      if (isNaN(date.getTime())) return "-"

      // 년, 월, 일 포맷팅
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, "0")
      const day = String(date.getDate()).padStart(2, "0")

      // 시간, 분 포맷팅 (24시간제, 네 자리 숫자)
      const hours = String(date.getHours()).padStart(2, "0")
      const minutes = String(date.getMinutes()).padStart(2, "0")
      const timeStr = `${hours}${minutes}`

      // "YYYY년 MM월 DD일 HHMM" 형식으로 반환
      return `${year}년 ${month}월 ${day}일 ${timeStr}`
    } catch (error) {
      console.error("Date formatting error:", error)
      return "-"
    }
  }

  return (
    <div className="w-full overflow-hidden">
      {/* Table Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
        <div className="text-sm">
          총 <span className="font-medium">{total}</span>개의 일정
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor="perPage" className="text-sm">
            페이지당 항목:
          </label>
          <select
            id="perPage"
            value={perPage}
            onChange={(e) => onPerPageChange(Number(e.target.value))}
            className={`rounded-md border px-2 py-1 text-sm ${
              theme === "dark" ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-300 text-gray-900"
            }`}
          >
            {perPageOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="w-full overflow-x-auto rounded-lg border border-inherit">
        <table className="w-full">
          <thead className={`${theme === "dark" ? "bg-gray-800" : "bg-gray-50"}`}>
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium">제목</th>
              <th className="px-4 py-3 text-left text-sm font-medium hidden md:table-cell">시작 일시</th>
              <th className="px-4 py-3 text-left text-sm font-medium hidden md:table-cell">종료 일시</th>
              <th className="px-4 py-3 text-left text-sm font-medium hidden md:table-cell">위치</th>
              <th className="px-4 py-3 text-right text-sm font-medium">작업</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-inherit">
            {loading ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center">
                  로딩 중...
                </td>
              </tr>
            ) : events.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center">
                  일정이 없습니다.
                </td>
              </tr>
            ) : (
              events.map((event) => (
                <tr
                  key={event.id}
                  className={`${theme === "dark" ? "hover:bg-gray-800" : "hover:bg-gray-50"} cursor-pointer`}
                  onClick={() => onEdit(event)}
                >
                  <td className="px-4 py-3 text-sm">
                    <div className="flex flex-col md:hidden">
                      <span className="font-medium">{event.title}</span>
                      <span className="text-xs text-gray-500 mt-1">
                        {formatDateTime(event.start_at).split(" ")[0]} {/* 모바일에서는 날짜만 표시 */}
                      </span>
                    </div>
                    <span className="hidden md:inline">{event.title}</span>
                  </td>
                  <td className="px-4 py-3 text-sm hidden md:table-cell">{formatDateTime(event.start_at)}</td>
                  <td className="px-4 py-3 text-sm hidden md:table-cell">{formatDateTime(event.end_at)}</td>
                  <td className="px-4 py-3 text-sm hidden md:table-cell">{event.location || "-"}</td>
                  <td className="px-4 py-3 text-sm text-right">
                    {renderCustomActions ? (
                      renderCustomActions(event)
                    ) : (
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            onEdit(event)
                          }}
                          className={`p-1 rounded-md ${theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-200"}`}
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            onDelete(event)
                          }}
                          className={`p-1 rounded-md ${theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-200"}`}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </button>
                      </div>
                    )}
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
          {total > 0 ? `${(page - 1) * perPage + 1}-${Math.min(page * perPage, total)} / ${total}` : "0 결과"}
        </div>
        <div className="flex gap-1">
          <button
            onClick={() => onPageChange(1)}
            disabled={page === 1}
            className={`p-1 rounded-md ${
              theme === "dark" ? "hover:bg-gray-800 disabled:text-gray-700" : "hover:bg-gray-100 disabled:text-gray-300"
            } disabled:cursor-not-allowed`}
          >
            <ChevronsLeft className="h-5 w-5" />
          </button>
          <button
            onClick={() => onPageChange(page - 1)}
            disabled={page === 1}
            className={`p-1 rounded-md ${
              theme === "dark" ? "hover:bg-gray-800 disabled:text-gray-700" : "hover:bg-gray-100 disabled:text-gray-300"
            } disabled:cursor-not-allowed`}
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <div className="flex items-center px-2">
            <span className="text-sm">
              {page} / {totalPages || 1}
            </span>
          </div>

          <button
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages}
            className={`p-1 rounded-md ${
              theme === "dark" ? "hover:bg-gray-800 disabled:text-gray-700" : "hover:bg-gray-100 disabled:text-gray-300"
            } disabled:cursor-not-allowed`}
          >
            <ChevronRight className="h-5 w-5" />
          </button>
          <button
            onClick={() => onPageChange(totalPages)}
            disabled={page >= totalPages}
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
