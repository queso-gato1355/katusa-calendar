"use client"

import { Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/components/ui/use-toast"
import { supabaseClient } from "@/lib/supabaseClient"

export function HolidayTable({ holidays, loading, selectedHolidays, setSelectedHolidays, onEdit, theme, text }) {
  
    const supabase = supabaseClient
  
    const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedHolidays(holidays.map((holiday) => holiday.id))
    } else {
      setSelectedHolidays([])
    }
  }

  const handleSelectItem = (e, holidayId) => {
    e.stopPropagation()
    setSelectedHolidays((prev) => {
      if (prev.includes(holidayId)) {
        return prev.filter((id) => id !== holidayId)
      } else {
        return [...prev, holidayId]
      }
    })
  }

  const handleDelete = async (holiday) => {
    if (!window.confirm(text.deleteConfirm || "정말로 이 휴일을 삭제하시겠습니까?")) return

    try {
      if (holiday.events && holiday.events.length > 0) {
        const eventIds = holiday.events.map((event) => event.id)
        const { error } = await supabase.from("events").delete().in("id", eventIds)
        if (error) throw error
      }

      toast.success(text.deleteSuccess || "휴일이 삭제되었습니다.")
      // 부모 컴포넌트에서 데이터 새로고침 처리
    } catch (error) {
      console.error("Error deleting holiday:", error)
      toast.error(text.deleteError || "휴일 삭제 중 오류가 발생했습니다.")
    }
  }

  return (
    <div className="w-full overflow-x-auto rounded-lg border">
      <table className="w-full">
        <thead className={`${theme === "dark" ? "bg-gray-800" : "bg-gray-50"}`}>
          <tr>
            <th className="px-4 py-3 text-left text-sm font-medium w-10">
              <input
                type="checkbox"
                checked={selectedHolidays.length === holidays.length && holidays.length > 0}
                onChange={(e) => handleSelectAll(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
            </th>
            <th className="px-4 py-3 text-left text-sm font-medium hidden md:table-cell">{text.date || "날짜"}</th>
            <th className="px-4 py-3 text-left text-sm font-medium table-cell md:hidden">{"제목 및 날짜"}</th>
            <th className="px-4 py-3 text-left text-sm font-medium hidden md:table-cell">{text.dayOfWeek || "요일"}</th>
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
              <td colSpan={10} className="px-4 py-8 text-center">
                {text.loading || "로딩 중..."}
              </td>
            </tr>
          ) : holidays.length === 0 ? (
            <tr>
              <td colSpan={10} className="px-4 py-8 text-center">
                {text.noHolidays || "등록된 휴일이 없습니다."}
              </td>
            </tr>
          ) : (
            holidays.map((holiday) => {
              const date = new Date(holiday.date)
              return (
                <tr key={holiday.id} className="hover:bg-gray-600/20 cursor-pointer" onClick={() => onEdit(holiday)}>
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
                        holiday.rok_observed ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" : ""
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
                          onEdit(holiday)
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDelete(holiday)
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
  )
}
