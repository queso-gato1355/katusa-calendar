"use client"

import { useState } from "react"
import { User, LogOut, ChevronRight } from "lucide-react"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"

export default function UserMenu({ currentUser, theme }) {
  const router = useRouter()
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)

  const handleUserManagement = () => {
    router.push("/admin/users")
    setIsUserMenuOpen(false)
  }

  const handleLogout = async () => {
    try {
      // 세션 쿠키에서 토큰 가져오기
      const cookies = document.cookie.split(";").reduce((acc, cookie) => {
        const [key, value] = cookie.trim().split("=")
        acc[key] = value
        return acc
      }, {})

      const sessionToken = cookies["admin_session"]

      if (!sessionToken) {
        // 세션이 이미 없으면 로그인 페이지로 리디렉션
        router.push("/admin/login")
        return
      }

      // 로그아웃 API 호출
      const response = await fetch("/api/admin/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: sessionToken }),
      })

      const data = await response.json()

      if (data.success) {
        // 클라이언트 측에서 쿠키 삭제
        document.cookie = "admin_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax;"

        toast.success("로그아웃되었습니다.")
        router.push("/admin/login")
      } else {
        throw new Error(data.message || "로그아웃 실패")
      }
    } catch (error) {
      console.error("Error logging out:", error)
      toast.error("로그아웃 중 오류가 발생했습니다.")
      // 오류가 발생해도 로그인 페이지로 리디렉션
      router.push("/admin/login")
    }
  }

  return (
    <div className="relative">
      <div
        className={`mt-4 p-2 rounded-md flex items-center justify-between ${
          theme === "dark" ? "bg-gray-800 hover:bg-gray-700" : "bg-gray-100 hover:bg-gray-200"
        } cursor-pointer transition-colors`}
        onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
      >
        <div className="flex items-center gap-2">
          <User className="h-4 w-4" />
          <span className="text-sm font-medium">{currentUser?.nickname || currentUser?.username || "관리자"}</span>
        </div>
        <ChevronRight className={`h-4 w-4 transition-transform ${isUserMenuOpen ? "rotate-90" : ""}`} />
      </div>

      {/* 사용자 메뉴 */}
      {isUserMenuOpen && (
        <div
          className={`mt-1 rounded-md overflow-hidden ${
            theme === "dark" ? "bg-gray-800 border border-gray-700" : "bg-white border border-gray-200"
          } shadow-lg`}
        >
          {/* 사용자 관리 버튼 - 모든 관리자에게 표시 */}
          <button
            onClick={handleUserManagement}
            className={`w-full flex items-center gap-2 px-4 py-2 text-sm text-left ${
              theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-100"
            }`}
          >
            <User className="h-4 w-4" />
            <span>관리자 계정 관리</span>
          </button>

          {/* 로그아웃 버튼 */}
          <button
            onClick={handleLogout}
            className={`w-full flex items-center gap-2 px-4 py-2 text-sm text-left ${
              theme === "dark" ? "hover:bg-gray-700 text-red-400" : "hover:bg-gray-100 text-red-600"
            }`}
          >
            <LogOut className="h-4 w-4" />
            <span>로그아웃</span>
          </button>
        </div>
      )}
    </div>
  )
}
