"use client"

import { useState, useEffect } from "react"
import { supabase, updateCalendarActiveStatus } from "@/lib/supabase"
import toast from "react-hot-toast"
import { Save, RefreshCw } from "lucide-react"

export default function CalendarSettings({ theme }) {
  const [calendars, setCalendars] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [regenerating, setRegenerating] = useState(false)

  // 캘린더 데이터 가져오기
  useEffect(() => {
    fetchCalendars()
  }, [])

  const fetchCalendars = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase.from("calendars").select("*").order("id")

      if (error) throw error

      setCalendars(data || [])
    } catch (error) {
      console.error("Error fetching calendars:", error)
      toast.error("캘린더 정보를 불러오는 중 오류가 발생했습니다.")
    } finally {
      setLoading(false)
    }
  }

  const handleToggleActive = (id) => {
    setCalendars((prev) =>
      prev.map((calendar) => (calendar.id === id ? { ...calendar, is_active: !calendar.is_active } : calendar)),
    )
  }

  const handleSaveSettings = async () => {
    setSaving(true)
    try {
      // 캘린더 설정 저장
      for (const calendar of calendars) {
        const { id, is_active } = calendar
        const { error } = await updateCalendarActiveStatus(id, is_active)

        if (error) {
          throw error
        }
      }

      toast.success("캘린더 설정이 저장되었습니다.")
    } catch (error) {
      console.error("Error saving calendar settings:", error)
      toast.error("캘린더 설정 저장 중 오류가 발생했습니다.")
    } finally {
      setSaving(false)
    }
  }

  const handleRegenerateICS = async () => {
    setRegenerating(true)
    try {
      // CRON_SECRET 환경 변수 가져오기
      const { data: settingsData, error: settingsError } = await supabase
        .from("site_settings")
        .select("value")
        .eq("key", "cron_secret")
        .single()

      if (settingsError && settingsError.code !== "PGRST116") throw settingsError

      const cronSecret = settingsData?.value || process.env.NEXT_PUBLIC_CRON_SECRET || "default-secret"

      // ICS 파일 재생성 API 호출
      const response = await fetch("/api/generate-ics", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${cronSecret}`,
        },
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "ICS 파일 재생성 중 오류가 발생했습니다.")
      }

      toast.success("ICS 파일이 재생성되었습니다.")

      // 캘린더 정보 다시 가져오기
      fetchCalendars()
    } catch (error) {
      console.error("Error regenerating ICS files:", error)
      toast.error("ICS 파일 재생성 중 오류가 발생했습니다.")
    } finally {
      setRegenerating(false)
    }
  }

  return (
    <div
      className={`rounded-lg border ${theme === "dark" ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200"} p-6`}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">캘린더 설정</h2>
        <div className="flex gap-2">
          <button
            onClick={handleRegenerateICS}
            disabled={regenerating}
            className={`px-4 py-2 rounded-md flex items-center gap-2 ${
              theme === "dark"
                ? "bg-gray-700 text-white hover:bg-gray-600"
                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            } ${regenerating ? "opacity-70 cursor-not-allowed" : ""}`}
          >
            <RefreshCw className={`h-4 w-4 ${regenerating ? "animate-spin" : ""}`} />
            {regenerating ? "재생성 중..." : "ICS 파일 재생성"}
          </button>
          <button
            onClick={handleSaveSettings}
            disabled={saving}
            className={`px-4 py-2 rounded-md flex items-center gap-2 ${
              theme === "dark" ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-blue-600 text-white hover:bg-blue-700"
            } ${saving ? "opacity-70 cursor-not-allowed" : ""}`}
          >
            <Save className="h-4 w-4" />
            {saving ? "저장 중..." : "설정 저장"}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8">로딩 중...</div>
      ) : (
        <div className="space-y-4">
          {calendars.map((calendar) => (
            <div
              key={calendar.id}
              className="flex flex-col md:flex-row md:items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700"
            >
              <div className="flex-1">
                <h3 className="font-medium">{calendar.title || calendar.id}</h3>
                <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">{calendar.description}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  프록시 경로: {calendar.proxy_path || "-"}
                </div>
              </div>
              <div className="mt-2 md:mt-0">
                <label className="inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={calendar.is_active}
                    onChange={() => handleToggleActive(calendar.id)}
                  />
                  <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  <span className="ms-3 text-sm font-medium">{calendar.is_active ? "활성화" : "비활성화"}</span>
                </label>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
