"use client"

import { useState, useEffect } from "react"
import { Trash2, Check } from "lucide-react"
import toast from "react-hot-toast"
import { supabaseClient } from "@/lib/supabaseClient"
import { getDayOfWeek } from "@/lib/date-utils"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Toggle } from "@/components/ui/toggle"

export function HolidayModal({
  isOpen,
  onClose,
  holiday,
  isEditing,
  onSaveSuccess,
  onDeleteSuccess,
  theme,
  language,
  text,
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
    if (holiday && isEditing) {
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
  }, [holiday, isEditing, isOpen])

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

  const saveHoliday = async () => {
    if (!formData.title.trim()) {
      toast.error(text.titleRequired || "제목을 입력해주세요.")
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
        toast.error(text.invalidDate || "유효하지 않은 날짜입니다.")
        return
      }

      const events = []

      // 기존 이벤트 삭제 (수정 모드인 경우)
      if (isEditing && holiday) {
        if (holiday.events && holiday.events.length > 0) {
          const eventIds = holiday.events.map((event) => event.id)
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
          is_holiday: true,
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
          is_holiday: true,
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
          is_holiday: true,
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
          is_holiday: true,
          is_usfk: true,
          created_at: new Date().toISOString(),
        })
      }

      if (events.length > 0) {
        const { error: insertError } = await supabase.from("events").insert(events)
        if (insertError) throw insertError
      }

      toast.success(
        isEditing ? text.saveSuccess || "휴일이 수정되었습니다." : text.addSuccess || "새 휴일이 추가되었습니다.",
      )
      onSaveSuccess()
    } catch (error) {
      console.error("Error saving holiday:", error)
      toast.error(text.saveError || "휴일 저장 중 오류가 발생했습니다.")
    }
  }

  const deleteHoliday = async () => {
    if (!holiday) return
    if (!window.confirm(text.deleteConfirm || "정말로 이 휴일을 삭제하시겠습니까?")) return

    try {
      if (holiday.events && holiday.events.length > 0) {
        const eventIds = holiday.events.map((event) => event.id)
        const { error: deleteError } = await supabase.from("events").delete().in("id", eventIds)
        if (deleteError) throw deleteError
      }

      toast.success(text.deleteSuccess || "휴일이 삭제되었습니다.")
      onDeleteSuccess()
    } catch (error) {
      console.error("Error deleting holiday:", error)
      toast.error(text.deleteError || "휴일 삭제 중 오류가 발생했습니다.")
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
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
            <Button variant="outline" onClick={onClose}>
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
  )
}
