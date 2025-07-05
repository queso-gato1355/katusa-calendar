"use client"

import { useState, useEffect } from "react"
import { Trash2, Check } from "lucide-react"
import toast from "react-hot-toast"
import { supabaseClient } from "@/lib/supabaseClient"
import { getDayOfWeek } from "@/lib/date-utils"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Toggle } from "@/components/ui/toggle"

export function PassModal({
  isOpen,
  onClose,
  pass,
  isEditing,
  onSaveSuccess,
  onDeleteSuccess,
  theme,
}) {
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

  useEffect(() => {
    if (pass && isEditing) {
      const startDate = new Date(pass.date)
      const endDate = new Date(pass.end_date)

      setFormData({
        year: startDate.getFullYear(),
        month: startDate.getMonth() + 1,
        day: startDate.getDate(),
        endYear: endDate.getFullYear(),
        endMonth: endDate.getMonth() + 1,
        endDay: endDate.getDate(),
        title: pass.title,
        us_observed: pass.us_observed,
        rok_observed: pass.rok_observed,
        katusa_observed: pass.katusa_observed,
        usfk_only: pass.usfk_only,
      })
    } else {
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
    }
  }, [pass, isEditing, isOpen])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    })
  }

  const handleToggle = (field) => {
    setFormData({
      ...formData,
      [field]: !formData[field],
    })
  }

  const savePass = async () => {
    if (!formData.title.trim()) {
      toast.error("제목을 입력해주세요.")
      return
    }

    try {
      const startDate = new Date(formData.year, formData.month - 1, formData.day, 0, 0, 0)
      const endDate = new Date(formData.endYear, formData.endMonth - 1, formData.endDay, 23, 59, 59)

      if (endDate < startDate) {
        toast.error("종료 날짜는 시작 날짜보다 이후여야 합니다.")
        return
      }

      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        toast.error("유효하지 않은 날짜입니다.")
        return
      }

      const events = []

      // 기존 이벤트 삭제 (수정 모드인 경우)
      if (isEditing && pass) {
        if (pass.events && pass.events.length > 0) {
          const eventIds = pass.events.map((event) => event.id)
          const { error: deleteError } = await supabase.from("events").delete().in("id", eventIds)
          if (deleteError) throw deleteError
        }
      }

      // 새 이벤트 생성
      if (formData.us_observed) {
        events.push({
          title: formData.title,
          start_at: startDate.toISOString(),
          end_at: endDate.toISOString(),
          category: "us-holiday",
          all_day: true,
          is_usfk: false,
          created_at: new Date().toISOString(),
        })
      }

      if (formData.rok_observed) {
        events.push({
          title: formData.title,
          start_at: startDate.toISOString(),
          end_at: endDate.toISOString(),
          category: "korean-army",
          all_day: true,
          is_usfk: false,
          created_at: new Date().toISOString(),
        })
      }

      if (formData.katusa_observed) {
        events.push({
          title: formData.title,
          start_at: startDate.toISOString(),
          end_at: endDate.toISOString(),
          category: "basic",
          all_day: true,
          is_usfk: false,
          created_at: new Date().toISOString(),
        })
      }

      if (formData.usfk_only) {
        events.push({
          title: `${formData.title} (USFK Only)`,
          start_at: startDate.toISOString(),
          end_at: endDate.toISOString(),
          category: "basic",
          all_day: true,
          is_usfk: true,
          created_at: new Date().toISOString(),
        })
      }

      if (events.length > 0) {
        const { error: insertError } = await supabase.from("events").insert(events)
        if (insertError) throw insertError
      }

      toast.success(
        isEditing ? "휴일이 수정되었습니다." : "새 휴일이 추가되었습니다."
      )
      onSaveSuccess()
    } catch (error) {
      console.error("Error saving pass:", error)
      toast.error("휴일 저장 중 오류가 발생했습니다.")
    }
  }

  const deleteHoliday = async () => {
    if (!pass) return
    if (!window.confirm("정말로 이 휴일을 삭제하시겠습니까?")) return

    try {
      if (pass.events && pass.events.length > 0) {
        const eventIds = pass.events.map((event) => event.id)
        const { error: deleteError } = await supabase.from("events").delete().in("id", eventIds)
        if (deleteError) throw deleteError
      }

      toast.success("휴일이 삭제되었습니다.")
      onDeleteSuccess()
    } catch (error) {
      console.error("Error deleting pass:", error)
      toast.error("휴일 삭제 중 오류가 발생했습니다.")
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={theme === "dark" ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200"}>
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "패스 수정" : "새 패스 추가"}
          </DialogTitle>
        </DialogHeader>

        <DialogDescription>
          {isEditing ? "패스 정보를 수정하세요." : "새 패스 정보를 입력하세요."}
        </DialogDescription>

        <div className="space-y-4 py-4">
          {/* 시작 날짜 입력 */}
          <div>
            <Label>시작 날짜</Label>
            <div className="grid grid-cols-3 gap-2 mt-1">
              <div>
                <Label htmlFor="year" className="sr-only">
                  연도 *
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
                  월 *
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
                  일 *
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
                  연도 *
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
                  월 *
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
                  일 *
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
            <Label>요일</Label>
            <div className="h-10 px-3 py-2 rounded-md border bg-muted">
              {getDayOfWeek(formData.year, formData.month, formData.day)}
            </div>
          </div>

          {/* 제목 입력 */}
          <div>
            <Label htmlFor="title">제목 *</Label>
            <Input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="휴일 이름을 입력하세요"
            />
          </div>

          {/* Observed by 토글 버튼 */}
          <div className="space-y-3">
            <Label>Observed by</Label>

            <div className="flex items-center justify-between">
              <span className="text-sm">US</span>
              <Toggle
                pressed={formData.us_observed}
                onPressedChange={() => handleToggle("us_observed")}
                variant="outline"
                className={
                  formData.us_observed ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" : ""
                }
              >
                {formData.us_observed ? "Yes" : "No"}
              </Toggle>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm">ROK</span>
              <Toggle
                pressed={formData.rok_observed}
                onPressedChange={() => handleToggle("rok_observed")}
                variant="outline"
                className={
                  formData.rok_observed ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" : ""
                }
              >
                {formData.rok_observed ? "Yes" : "No"}
              </Toggle>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm">KATUSA</span>
              <Toggle
                pressed={formData.katusa_observed}
                onPressedChange={() => handleToggle("katusa_observed")}
                variant="outline"
                className={
                  formData.katusa_observed ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" : ""
                }
              >
                {formData.katusa_observed ? "Yes" : "No"}
              </Toggle>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm">USFK Only</span>
              <Toggle
                pressed={formData.usfk_only}
                onPressedChange={() => handleToggle("usfk_only")}
                variant="outline"
                className={
                  formData.usfk_only ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" : ""
                }
              >
                {formData.usfk_only ? "Yes" : "No"}
              </Toggle>
            </div>
          </div>
        </div>

        <DialogFooter className="flex justify-between">
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              취소
            </Button>
            {isEditing && (
              <Button variant="destructive" onClick={deleteHoliday}>
                <Trash2 className="h-4 w-4 mr-2" />
                삭제
              </Button>
            )}
            <Button onClick={savePass}>
              <Check className="h-4 w-4 mr-2" />
              {isEditing ? "수정" : "추가"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
