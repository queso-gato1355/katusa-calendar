"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"

export default function EventForm({ event, isOpen, onClose, onSave, theme = "light" }) {
  const [formData, setFormData] = useState({
    id: "",
    title: "",
    description: "",
    location: "",
    start_at: "",
    end_at: "",
    all_day: true,
    is_holiday: false,
    is_usfk: false,
  })

  // 폼 초기화
  useEffect(() => {
    if (isOpen) {
      if (event) {
        // 기존 이벤트 수정 모드
        const startDate = new Date(event.start_at)
        const endDate = new Date(event.end_at)

        setFormData({
          id: event.id || "",
          title: event.title || "",
          description: event.description || "",
          location: event.location || "",
          start_at: formatDateForInput(startDate),
          end_at: formatDateForInput(endDate),
          all_day: event.all_day || false,
          is_holiday: event.is_holiday || false,
          is_usfk: event.is_usfk || false,
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
          start_at: formatDateForInput(now),
          end_at: formatDateForInput(tomorrow),
          all_day: true,
          is_holiday: false,
          is_usfk: false,
        })
      }
    }
  }, [event, isOpen])

  // 날짜를 input[type="datetime-local"]에 맞는 형식으로 변환
  const formatDateForInput = (date) => {
    return date.toISOString().slice(0, 16)
  }

  // 폼 데이터 변경 핸들러
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    })
  }

  // 저장 핸들러
  const handleSave = () => {
    // 필수 필드 검증
    if (!formData.title.trim()) {
      alert("제목을 입력해주세요.")
      return
    }

    if (!formData.start_at || !formData.end_at) {
      alert("시작일과 종료일을 입력해주세요.")
      return
    }

    // 종료일이 시작일보다 이전인 경우
    if (new Date(formData.end_at) < new Date(formData.start_at)) {
      alert("종료일은 시작일보다 이후여야 합니다.")
      return
    }

    // 이벤트 데이터 저장
    onSave(formData)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className={`sm:max-w-[500px] ${theme === "dark" ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200"}`}
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

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="start_at">시작일 *</Label>
              <Input
                type={formData.all_day ? "date" : "datetime-local"}
                id="start_at"
                name="start_at"
                value={formData.start_at}
                onChange={handleChange}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="end_at">종료일 *</Label>
              <Input
                type={formData.all_day ? "date" : "datetime-local"}
                id="end_at"
                name="end_at"
                value={formData.end_at}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="all_day"
              name="all_day"
              checked={formData.all_day}
              onCheckedChange={(checked) => setFormData({ ...formData, all_day: checked })}
            />
            <Label htmlFor="all_day">종일 일정</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="is_holiday"
              name="is_holiday"
              checked={formData.is_holiday}
              onCheckedChange={(checked) => setFormData({ ...formData, is_holiday: checked })}
            />
            <Label htmlFor="is_holiday">휴일로 표시</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="is_usfk"
              name="is_usfk"
              checked={formData.is_usfk}
              onCheckedChange={(checked) => setFormData({ ...formData, is_usfk: checked })}
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
