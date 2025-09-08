"use client"

import { useState, useEffect } from "react"
import { useTheme } from "@/components/providers/theme-provider"
import CalendarSettings from "./calendar-settings"
import toast from "react-hot-toast"
import { Save } from "lucide-react"
import { getContactEmail, updateContactEmail } from "@/lib/api/supabase/helpers"

export default function SettingsPage() {
  const { theme } = useTheme()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [contactEmail, setContactEmail] = useState("")
  const [mounted, setMounted] = useState(false)

  // 컴포넌트 마운트 확인
  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted) {
      fetchSettings()
    }
  }, [mounted])

  // 설정 데이터 가져오기
  const fetchSettings = async () => {
    setLoading(true)
    try {
      // 연락처 이메일 가져오기
      const emailData = await getContactEmail()
      if (emailData) {
        setContactEmail(emailData.value)
      }
    } catch (error) {
      console.error("Error fetching settings:", error)
      toast.error("설정을 불러오는 중 오류가 발생했습니다.")
    } finally {
      setLoading(false)
    }
  }

  const handleSaveSettings = async () => {
    setSaving(true)
    try {
      // 연락처 이메일 저장
      const { success, error } = await updateContactEmail(contactEmail)

      if (error) throw error

      toast.success("설정이 저장되었습니다.")
    } catch (error) {
      console.error("Error saving settings:", error)
      toast.error("설정 저장 중 오류가 발생했습니다.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className={`min-h-screen ${theme === "dark" ? "dark bg-gray-900 text-white" : "bg-gray-50 text-gray-900"}`}>
      <div className="md:ml-64 p-4 md:p-8">

        {loading ? (
          <div className="text-center py-8">로딩 중...</div>
        ) : (
          <div className="space-y-8">
            {/* 캘린더 설정 섹션 */}
            <CalendarSettings theme={theme} />

            {/* 문의 이메일 설정 섹션 */}
            <div
              className={`rounded-lg border ${theme === "dark" ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200"} p-6`}
            >
              <h2 className="text-xl font-semibold mb-4">문의 이메일 설정</h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="contactEmail" className="block text-sm font-medium mb-1">
                    문의 이메일 주소
                  </label>
                  <input
                    type="email"
                    id="contactEmail"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    className={`w-full rounded-md border px-3 py-2 ${
                      theme === "dark"
                        ? "bg-gray-800 border-gray-700 text-white"
                        : "bg-white border-gray-300 text-gray-900"
                    }`}
                    placeholder="example@example.com"
                  />
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    문의 폼에서 제출된 내용이 이 이메일로 전송됩니다.
                  </p>
                </div>
              </div>
            </div>

            {/* 저장 버튼 */}
            <div className="flex justify-center md:justify-end">
              <button
                onClick={handleSaveSettings}
                disabled={saving}
                className={`px-4 py-2 rounded-md flex items-center gap-2 ${
                  theme === "dark"
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                } ${saving ? "opacity-70 cursor-not-allowed" : ""}`}
              >
                <Save className="h-4 w-4" />
                {saving ? "저장 중..." : "이메일 설정 저장"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
