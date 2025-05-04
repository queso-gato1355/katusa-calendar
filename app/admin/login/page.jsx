"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Calendar, Lock } from "lucide-react"
import toast from "react-hot-toast"

export default function AdminLoginPage() {
  const router = useRouter()
  const [theme, setTheme] = useState("light")
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  })

  // 테마 설정
  useEffect(() => {
    if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setTheme("dark")
      document.documentElement.classList.add("dark")
    }

    // 이미 로그인되어 있는지 확인
    checkExistingSession()
  }, [])

  const checkExistingSession = () => {
    const cookies = document.cookie.split(";").reduce((acc, cookie) => {
      const [key, value] = cookie.trim().split("=")
      acc[key] = value
      return acc
    }, {})

    if (cookies["admin_session"]) {
      // 이미 세션이 있으면 관리자 페이지로 리디렉션
      router.push("/admin")
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
        credentials: "include", // 쿠키를 포함하도록 설정
      })

      const data = await response.json()

      if (data.success) {
        toast.success("로그인 성공!")

        // 응답에서 받은 토큰으로 직접 쿠키 설정 (백업 방법)
        if (data.token) {
          document.cookie = `admin_session=${data.token}; path=/; max-age=${60 * 60 * 24}; SameSite=Lax;`
        }

        // 쿠키가 제대로 설정되었는지 확인
        setTimeout(() => {
          const cookies = document.cookie.split(";").reduce((acc, cookie) => {
            const [key, value] = cookie.trim().split("=")
            acc[key] = value
            return acc
          }, {})

          if (!cookies["admin_session"] && data.token) {
            console.log("세션 쿠키가 설정되지 않았습니다. 수동으로 설정합니다.")
            document.cookie = `admin_session=${data.token}; path=/; max-age=${60 * 60 * 24}; SameSite=Lax;`
          }

          router.push("/admin")
        }, 500)
      } else {
        toast.error(data.message || "로그인에 실패했습니다.")
      }
    } catch (error) {
      console.error("Login error:", error)
      toast.error("로그인 중 오류가 발생했습니다.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className={`min-h-screen flex items-center justify-center ${
        theme === "dark" ? "dark bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      <div className="w-full max-w-md p-8 space-y-8 rounded-lg shadow-lg bg-white dark:bg-gray-800">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Calendar className={`h-8 w-8 ${theme === "dark" ? "text-blue-400" : "text-blue-600"}`} />
            <h1 className="text-2xl font-bold">KATUSA Calendar</h1>
          </div>
          <h2 className="text-xl font-semibold">관리자 로그인</h2>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">관리자 계정으로 로그인하세요.</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium mb-1">
                사용자명
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                value={formData.username}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md ${
                  theme === "dark" ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-900"
                }`}
                placeholder="관리자 아이디"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-1">
                비밀번호
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md ${
                  theme === "dark" ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-900"
                }`}
                placeholder="비밀번호"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full flex justify-center items-center gap-2 px-4 py-2 rounded-md ${
                theme === "dark"
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              } ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
            >
              <Lock className="h-4 w-4" />
              {loading ? "로그인 중..." : "로그인"}
            </button>
          </div>
        </form>

        <div className="mt-6 text-center">
          <a
            href="/"
            className={`text-sm ${theme === "dark" ? "text-blue-400 hover:text-blue-300" : "text-blue-600 hover:text-blue-500"}`}
          >
            메인 페이지로 돌아가기
          </a>
        </div>
      </div>
    </div>
  )
}
