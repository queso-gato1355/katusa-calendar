"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"

export default function EventForm({ event, isOpen, onClose, onSave, theme }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    start_date: "",
    start_time: "",
    end_date: "",
    end_time: "",
    location: "",
    all_day: false,
  })

  useEffect(() => {
    if (event) {
      // 날짜와 시간을 분리하여 설정
      const formatDateForInput = (dateString) => {
        if (!dateString) return { date: "", time: "" }
        const date = new Date(dateString)

        // YYYY-MM-DD 형식으로 변환
        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, "0")
        const day = String(date.getDate()).padStart(2, "0")
        const dateStr = `${year}-${month}-${day}`

        // HH:MM 형식으로 변환
        const hours = String(date.getHours()).padStart(2, "0")
        const minutes = String(date.getMinutes()).padStart(2, "0")
        const timeStr = `${hours}:${minutes}`

        return { date: dateStr, time: timeStr }
      }

      const startDateTime = formatDateForInput(event.start_at)
      const endDateTime = formatDateForInput(event.end_at)

      setFormData({
        title: event.title || "",
        description: event.description || "",
        start_date: startDateTime.date,
        start_time: startDateTime.time,
        end_date: endDateTime.date,
        end_time: endDateTime.time,
        location: event.location || "",
        all_day: event.all_day || false,
      })
    } else {
      // 새 이벤트의 기본값 설정
      const today = new Date()
      const year = today.getFullYear()
      const month = String(today.getMonth() + 1).padStart(2, "0")
      const day = String(today.getDate()).padStart(2, "0")
      const dateStr = `${year}-${month}-${day}`

      const hours = String(today.getHours()).padStart(2, "0")
      const minutes = String(today.getMinutes()).padStart(2, "0")
      const timeStr = `${hours}:${minutes}`

      setFormData({
        title: "",
        description: "",
        start_date: dateStr,
        start_time: timeStr,
        end_date: dateStr,
        end_time: timeStr,
        location: "",
        all_day: false,
      })
    }
  }, [event])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    // 날짜와 시간을 결합하여 ISO 문자열로 변환
    const combineDateTime = (date, time) => {
      if (!date) return null

      // 종일 일정인 경우 시간을 00:00으로 설정
      const timeToUse = formData.all_day ? "00:00" : time || "00:00"

      // 날짜와 시간을 결합하여 Date 객체 생성
      const dateTimeStr = `${date}T${timeToUse}`
      const dateObj = new Date(dateTimeStr)

      // ISO 문자열로 변환하여 타임존 정보 포함
      return dateObj.toISOString()
    }

    const start_at = combineDateTime(formData.start_date, formData.start_time)
    const end_at = combineDateTime(formData.end_date, formData.end_time)

    onSave({
      ...formData,
      id: event?.id,
      start_at,
      end_at,
    })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4 overflow-y-auto">
      <div
        className={`w-full max-w-md rounded-lg ${theme === "dark" ? "bg-gray-900" : "bg-white"} shadow-xl max-h-[90vh] overflow-y-auto`}
      >
        <div className="flex items-center justify-between p-4 border-b border-inherit sticky top-0 bg-inherit z-10">
          <h2 className="text-lg font-medium">{event ? "일정 수정" : "새 일정 추가"}</h2>
          <button
            onClick={onClose}
            className={`p-1 rounded-full ${theme === "dark" ? "hover:bg-gray-800" : "hover:bg-gray-100"}`}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4">
          <div className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium mb-1">
                제목 *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className={`w-full rounded-md border px-3 py-2 ${
                  theme === "dark" ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-300 text-gray-900"
                }`}
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium mb-1">
                설명
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className={`w-full rounded-md border px-3 py-2 ${
                  theme === "dark" ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-300 text-gray-900"
                }`}
              />
            </div>

            <div className="flex items-center gap-2">
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  id="all_day"
                  name="all_day"
                  checked={formData.all_day}
                  onChange={handleChange}
                  className="sr-only peer"
                />
                <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 dark:peer-checked:bg-blue-600"></div>
                <span className="ms-3 text-sm font-medium">종일 일정</span>
              </label>
            </div>

            {/* 시작 날짜와 시간을 별도로 입력 */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="start_date" className="block text-sm font-medium mb-1">
                  시작 날짜 *
                </label>
                <input
                  type="date"
                  id="start_date"
                  name="start_date"
                  value={formData.start_date}
                  onChange={handleChange}
                  required
                  className={`w-full rounded-md border px-3 py-2 ${
                    theme === "dark"
                      ? "bg-gray-800 border-gray-700 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  }`}
                />
              </div>
              <div>
                <label htmlFor="start_time" className="block text-sm font-medium mb-1">
                  시작 시간 {formData.all_day ? "" : "*"}
                </label>
                <input
                  type="time"
                  id="start_time"
                  name="start_time"
                  value={formData.start_time}
                  onChange={handleChange}
                  required={!formData.all_day}
                  disabled={formData.all_day}
                  className={`w-full rounded-md border px-3 py-2 ${
                    theme === "dark"
                      ? `bg-gray-800 border-gray-700 text-white ${formData.all_day ? "opacity-50" : ""}`
                      : `bg-white border-gray-300 text-gray-900 ${formData.all_day ? "opacity-50" : ""}`
                  }`}
                />
              </div>
            </div>

            {/* 종료 날짜와 시간을 별도로 입력 */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="end_date" className="block text-sm font-medium mb-1">
                  종료 날짜 *
                </label>
                <input
                  type="date"
                  id="end_date"
                  name="end_date"
                  value={formData.end_date}
                  onChange={handleChange}
                  required
                  className={`w-full rounded-md border px-3 py-2 ${
                    theme === "dark"
                      ? "bg-gray-800 border-gray-700 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  }`}
                />
              </div>
              <div>
                <label htmlFor="end_time" className="block text-sm font-medium mb-1">
                  종료 시간 {formData.all_day ? "" : "*"}
                </label>
                <input
                  type="time"
                  id="end_time"
                  name="end_time"
                  value={formData.end_time}
                  onChange={handleChange}
                  required={!formData.all_day}
                  disabled={formData.all_day}
                  className={`w-full rounded-md border px-3 py-2 ${
                    theme === "dark"
                      ? `bg-gray-800 border-gray-700 text-white ${formData.all_day ? "opacity-50" : ""}`
                      : `bg-white border-gray-300 text-gray-900 ${formData.all_day ? "opacity-50" : ""}`
                  }`}
                />
              </div>
            </div>

            <div>
              <label htmlFor="location" className="block text-sm font-medium mb-1">
                위치
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className={`w-full rounded-md border px-3 py-2 ${
                  theme === "dark" ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-300 text-gray-900"
                }`}
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className={`px-4 py-2 rounded-md ${
                theme === "dark" ? "bg-gray-800 hover:bg-gray-700" : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              취소
            </button>
            <button type="submit" className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700">
              저장
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
