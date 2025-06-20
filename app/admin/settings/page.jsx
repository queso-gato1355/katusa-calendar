"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabaseClient } from "@/lib/supabaseClient"
import Sidebar from "@/components/admin/sidebar"
import CalendarSettings from "./calendar-settings"
import toast from "react-hot-toast"
import { Save } from "lucide-react"

export default function SettingsPage() {
  const router = useRouter()
  const [theme, setTheme] = useState("light")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [contactEmail, setContactEmail] = useState("")
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const supabase = supabaseClient

  // 테마 설정
  useEffect(() => {
    if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setTheme("dark")
      document.documentElement.classList.add("dark")
    }
  }, [])

  // 인증 상태 확인
  useEffect(() => {
    checkAuthentication()
  }, [])

  const checkAuthentication = async () => {
    try {
      // 세션 쿠키에서 토큰 가져오기
      const cookies = document.cookie.split(";").reduce((acc, cookie) => {
        const [key, value] = cookie.trim().split("=")
        acc[key] = value
        return acc
      }, {})

      const sessionToken = cookies["admin_session"]

      if (!sessionToken) {
        // 세션이 없으면 로그인 페이지로 리디렉션
        router.push("/admin/login")
        return
      }

      // 세션 검증
      const { data, error } = await supabase.rpc("validate_admin_session", {
        session_token: sessionToken,
      })

      if (error || !data || data.length === 0 || !data[0].is_valid) {
        // 세션이 유효하지 않으면 로그인 페이지로 리디렉션
        router.push("/admin/login")
        return
      }

      // 인증 성공
      setIsAuthenticated(true)
      fetchSettings()
    } catch (error) {
      console.error("Authentication error:", error)
      router.push("/admin/login")
    }
  }

  // 설정 데이터 가져오기
  const fetchSettings = async () => {
    setLoading(true)
    try {
      // 연락처 이메일 가져오기
      const { data: emailData, error: emailError } = await supabase
        .from("site_settings")
        .select("value")
        .eq("key", "contact_email")
        .single()

      if (emailError && emailError.code !== "PGRST116") throw emailError

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
      const { error: emailError } = await supabase
        .from("site_settings")
        .upsert({ key: "contact_email", value: contactEmail })

      if (emailError) throw emailError

      toast.success("설정이 저장되었습니다.")
    } catch (error) {
      console.error("Error saving settings:", error)
      toast.error("설정 저장 중 오류가 발생했습니다.")
    } finally {
      setSaving(false)
    }
  }

  // 인증되지 않은 경우 로딩 표시
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen ${theme === "dark" ? "dark bg-gray-900 text-white" : "bg-gray-50 text-gray-900"}`}>
      <Sidebar activeCalendar="settings" theme={theme} />

      <div className="md:ml-64 p-4 md:p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">설정</h1>
          <p className="text-sm text-gray-500 mt-1">캘린더 활성화 상태 및 문의 이메일을 관리합니다.</p>
        </div>

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
