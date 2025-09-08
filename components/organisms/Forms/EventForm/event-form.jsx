"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/overlays/Dialog/dialog"
import { Button } from "@/components/atoms/Button/button"
import { Input } from "@/components/atoms/Input/input"
import { Label } from "@/components/atoms/Form/label"
import { Textarea } from "@/components/atoms/Input/textarea"
import { Checkbox } from "@/components/atoms/Form/checkbox"
import { formatLocalDateOnly, formatLocalTimeOnly, toISOString, convertAllDayToUTC, convertAllDayEndToUTC } from "@/lib/date-utils"

export default function EventForm({ event, isOpen, onClose, onSave, theme = "light" }) {
  const [formData, setFormData] = useState({
    id: "",
    title: "",
    description: "",
    location: "",
    start_date: "",
    start_time: "",
    end_date: "",
    end_time: "",
    all_day: true,
    is_usfk: false,
  })

  // 폼 초기화
  useEffect(() => {
    if (isOpen) {
      if (event) {
        // 기존 이벤트 수정 모드
        console.log("Loading event data:", event)

        setFormData({
          id: event.id || "",
          title: event.title || "",
          description: event.description || "",
          location: event.location || "",
          start_date: formatLocalDateOnly(event.start_at),
          start_time: formatLocalTimeOnly(event.start_at),
          end_date: formatLocalDateOnly(event.end_at),
          end_time: formatLocalTimeOnly(event.end_at),
          all_day: event.all_day !== undefined ? event.all_day : true,
          is_usfk: event.is_usfk !== undefined ? event.is_usfk : false,
        })
      } else {
        // 새 이벤트 생성 모드
        const now = new Date()
        const tomorrow = new Date(now)
        tomorrow.setDate(now.getDate() + 1)

        setFormData({
          id: "",
          title: "",
          description: "",
          location: "",
          start_date: formatLocalDateOnly(now),
          start_time: "09:00",
          end_date: formatLocalDateOnly(tomorrow),
          end_time: "18:00",
          all_day: true,
          is_usfk: false,
        })
      }
    }
  }, [event, isOpen])

  // 폼 데이터 변경 핸들러
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    })
  }

  // 체크박스 변경 핸들러
  const handleCheckboxChange = (name, checked) => {
    setFormData({
      ...formData,
      [name]: checked,
    })
  }

  // 저장 핸들러
  const handleSave = () => {
    // 필수 필드 검증
    if (!formData.title.trim()) {
      alert("제목을 입력해주세요.")
      return
    }

    if (!formData.start_date || !formData.end_date) {
      alert("시작일과 종료일을 입력해주세요.")
      return
    }

    // 날짜와 시간 결합 (데이터베이스에는 UTC+0으로 저장)
    const startDateTime = formData.all_day
      ? convertAllDayToUTC(`${formData.start_date}T00:00:00`)
      : toISOString(formData.start_date, formData.start_time)

    const endDateTime = formData.all_day
      ? convertAllDayEndToUTC(`${formData.end_date}T00:00:00`)
      : toISOString(formData.end_date, formData.end_time)


    // 종료일이 시작일보다 이전인 경우
    if (new Date(endDateTime) < new Date(startDateTime)) {
      alert("종료일시는 시작일시보다 이후여야 합니다.")
      return
    }

    // 이벤트 데이터 저장 (date, time은 제외한 새로운 폼)
    const eventData = {
      id: formData.id || "",
      title: formData.title.trim(),
      description: formData.description.trim(),
      location: formData.location.trim(),
      start_at: startDateTime,
      end_at: endDateTime,
      all_day: formData.all_day,
      is_usfk: formData.is_usfk,
    }

    console.log("Saving event data:", eventData)
    onSave(eventData)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className={`sm:max-w-[500px] max-h-[90vh] overflow-y-auto ${
          theme === "dark" ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200"
        }`}
      >
        <DialogHeader>
          <DialogTitle>{event ? "일정 수정" : "새 일정 추가"}</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">제목 *</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="일정 제목을 입력하세요"
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description">설명</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="일정에 대한 설명을 입력하세요"
              rows={3}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="location">장소</Label>
            <Input
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="일정 장소를 입력하세요"
            />
          </div>

          <div className="flex items-center space-x-2 mb-2">
            <Checkbox
              id="all_day"
              name="all_day"
              checked={formData.all_day}
              onCheckedChange={(checked) => handleCheckboxChange("all_day", checked)}
            />
            <Label htmlFor="all_day">종일 일정</Label>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="start_date">시작일 *</Label>
              <Input
                type="date"
                id="start_date"
                name="start_date"
                value={formData.start_date}
                onChange={handleChange}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="end_date">종료일 *</Label>
              <Input
                type="date"
                id="end_date"
                name="end_date"
                value={formData.end_date}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {!formData.all_day && (
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="start_time">시작 시간</Label>
                <Input
                  type="time"
                  id="start_time"
                  name="start_time"
                  value={formData.start_time}
                  onChange={handleChange}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="end_time">종료 시간</Label>
                <Input type="time" id="end_time" name="end_time" value={formData.end_time} onChange={handleChange} />
              </div>
            </div>
          )}

          {/* <div className="flex items-center space-x-2">
            <Checkbox
              id="is_holiday"
              name="is_holiday"
              checked={formData.is_holiday}
              onCheckedChange={(checked) => handleCheckboxChange("is_holiday", checked)}
            />
            <Label htmlFor="is_holiday">휴일로 표시</Label>
          </div> */}

          <div className="flex items-center space-x-2">
            <Checkbox
              id="is_usfk"
              name="is_usfk"
              checked={formData.is_usfk}
              onCheckedChange={(checked) => handleCheckboxChange("is_usfk", checked)}
            />
            <Label htmlFor="is_usfk">USFK 전용 일정</Label>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            취소
          </Button>
          <Button onClick={handleSave}>저장</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
