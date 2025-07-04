"use client"

import { Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/components/ui/use-toast"
import { supabaseClient } from "@/lib/supabaseClient"

export function PassTable({ passes, loading, selectedPasses, setSelectedPasses, onEdit, theme}) {

    const supabase = supabaseClient
  
    const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedPasses(passes.map((pass) => pass.id))
    } else {
      setSelectedPasses([])
    }
  }

  const handleSelectItem = (e, passId) => {
    e.stopPropagation()
    setSelectedPasses((prev) => {
      if (prev.includes(passId)) {
        return prev.filter((id) => id !== passId)
      } else {
        return [...prev, passId]
      }
    })
  }

  const handleDelete = async (pass) => {
    if (!window.confirm("정말로 이 휴일을 삭제하시겠습니까?")) return

    try {
      if (pass.events && pass.events.length > 0) {
        const eventIds = pass.events.map((event) => event.id)
        const { error } = await supabase.from("events").delete().in("id", eventIds)
        if (error) throw error
      }

      toast.success("휴일이 삭제되었습니다.")
      // 부모 컴포넌트에서 데이터 새로고침 처리
    } catch (error) {
      console.error("Error deleting pass:", error)
      toast.error("휴일 삭제 중 오류가 발생했습니다.")
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
                checked={selectedPasses.length === passes.length && passes.length > 0}
                onChange={(e) => handleSelectAll(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
            </th>
            <th className="px-4 py-3 text-left text-sm font-medium hidden md:table-cell">날짜</th>
            <th className="px-4 py-3 text-left text-sm font-medium table-cell md:hidden">제목 및 날짜</th>
            <th className="px-4 py-3 text-left text-sm font-medium hidden md:table-cell">요일</th>
            <th className="px-4 py-3 text-left text-sm font-medium hidden md:table-cell">제목</th>
            <th className="px-4 py-3 text-center text-sm font-medium hidden md:table-cell">US</th>
            <th className="px-4 py-3 text-center text-sm font-medium hidden md:table-cell">ROK</th>
            <th className="px-4 py-3 text-center text-sm font-medium hidden md:table-cell">
              KATUSA
            </th>
            <th className="px-4 py-3 text-center text-sm font-medium hidden md:table-cell">
              USFK Only
            </th>
            <th className="px-4 py-3 text-right text-sm font-medium">작업</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {loading ? (
            <tr>
              <td colSpan={10} className="px-4 py-8 text-center">
                로딩 중...
              </td>
            </tr>
          ) : passes.length === 0 ? (
            <tr>
              <td colSpan={10} className="px-4 py-8 text-center">
                등록된 패스가 없습니다.
              </td>
            </tr>
          ) : (
            passes.map((pass) => {
              const date = new Date(pass.date)
              return (
                <tr key={pass.id} className="hover:bg-gray-600/20 cursor-pointer" onClick={() => onEdit(pass)}>
                  <td className="px-4 py-3 text-sm">
                    <input
                      type="checkbox"
                      checked={selectedPasses.includes(pass.id)}
                      onChange={(e) => handleSelectItem(e, pass.id)}
                      onClick={(e) => e.stopPropagation()}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <div className="flex flex-col md:hidden">
                      <span className="font-medium">{pass.title}</span>
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
                  <td className="px-4 py-3 text-sm hidden md:table-cell">{pass.day_of_week}</td>
                  <td className="px-4 py-3 text-sm hidden md:table-cell">{pass.title}</td>
                  <td className="px-4 py-3 text-sm text-center hidden md:table-cell">
                    <Badge
                      variant={pass.us_observed ? "success" : "destructive"}
                      className={
                        pass.us_observed ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" : ""
                      }
                    >
                      {pass.us_observed ? "Yes" : "No"}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-sm text-center hidden md:table-cell">
                    <Badge
                      variant={pass.rok_observed ? "success" : "destructive"}
                      className={
                        pass.rok_observed ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" : ""
                      }
                    >
                      {pass.rok_observed ? "Yes" : "No"}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-sm text-center hidden md:table-cell">
                    <Badge
                      variant={pass.katusa_observed ? "success" : "destructive"}
                      className={
                        pass.katusa_observed
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          : ""
                      }
                    >
                      {pass.katusa_observed ? "Yes" : "No"}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-sm text-center hidden md:table-cell">
                    <Badge
                      variant={pass.usfk_only ? "default" : "outline"}
                      className={
                        pass.usfk_only ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" : ""
                      }
                    >
                      {pass.usfk_only ? "Yes" : "No"}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-sm text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation()
                          onEdit(pass)
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDelete(pass)
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
