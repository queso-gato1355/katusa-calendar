"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Calendar, Menu, X, Trash2, Settings, ChevronRight, User, Users, LogOut } from "lucide-react"
import { calendarsData } from "@/data/calendars"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"

export default function Sidebar({ activeCalendar, theme }) {
  const router = useRouter()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // 현재 사용자 정보 가져오기
  useEffect(() => {
    fetchCurrentUser()
  }, [])

  const fetchCurrentUser = async () => {
    try {
      setIsLoading(true)

      // 세션 쿠키에서 토큰 가져오기
      const cookies = document.cookie.split(";").reduce((acc, cookie) => {
        const [key, value] = cookie.trim().split("=")
        acc[key] = value
        return acc
      }, {})

      const sessionToken = cookies["admin_session"]

      // 세션 토큰이 없으면 로그인 페이지로 리디렉션
      if (!sessionToken) {
        console.log("No session token found, redirecting to login")
        router.push("/admin/login")
        return
      }

      // 세션 검증
      const { data, error } = await supabase.rpc("validate_admin_session", {
        session_token: sessionToken,
      })

      if (error) {
        throw error
      }

      if (!data || data.length === 0 || !data[0].is_valid) {
        console.log("Invalid session, redirecting to login")
        router.push("/admin/login")
        return
      }

      setCurrentUser({
        id: data[0].admin_id,
        username: data[0].username,
        nickname: data[0].nickname,
        role: data[0].role,
      })
    } catch (error) {
      console.error("Error fetching current user:", error)
      // 오류 발생 시 로그인 페이지로 리디렉션
      router.push("/admin/login")
    } finally {
      setIsLoading(false)
    }
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

  // 로딩 중이면 로딩 표시
  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  // 역할에 따른 접근 권한 확인
  const isSuperAdmin = currentUser?.role === "super_admin"

  // 사용자 관리 페이지로 이동
  const handleUserManagement = () => {
    router.push("/admin/users")
    setIsUserMenuOpen(false)
  }

  return (
    <>
      {/* Mobile Menu Button - 오른쪽 상단으로 위치 변경 */}
      <div className="md:hidden fixed top-4 right-4 z-50">
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className={`p-2 rounded-md ${
            theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-gray-900"
          } shadow-md`}
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>

      {/* Desktop Sidebar */}
      <div
        className={`hidden md:flex flex-col w-64 h-screen fixed left-0 top-0 ${
          theme === "dark" ? "bg-gray-900 text-white border-gray-700" : "bg-white text-gray-900 border-gray-200"
        } border-r overflow-y-auto`}
      >
        <div className="p-4 border-b border-inherit">
          <div className="flex items-center gap-2">
            <Calendar className={`h-6 w-6 ${theme === "dark" ? "text-blue-400" : "text-blue-600"}`} />
            <span className="text-xl font-bold">KATUSA Calendar</span>
          </div>
          <div className="mt-2 text-sm text-gray-500">관리자 대시보드</div>

          {/* 사용자 정보 */}
          <div className="relative">
            <div
              className={`mt-4 p-2 rounded-md flex items-center justify-between ${
                theme === "dark" ? "bg-gray-800 hover:bg-gray-700" : "bg-gray-100 hover:bg-gray-200"
              } cursor-pointer transition-colors`}
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            >
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span className="text-sm font-medium">
                  {currentUser?.nickname || currentUser?.username || "관리자"}
                </span>
              </div>
              <ChevronRight className={`h-4 w-4 transition-transform ${isUserMenuOpen ? "rotate-90" : ""}`} />
            </div>

            {/* 사용자 메뉴 - 수정된 부분 */}
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
                  <Users className="h-4 w-4" />
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
        </div>

        <nav className="flex-1 p-4 overflow-y-auto">
          <div className="mb-4 text-sm font-medium text-gray-500 uppercase">캘린더 관리</div>
          <ul className="space-y-2">
            {Array.isArray(calendarsData) &&
              calendarsData.map((calendar) => (
                <li key={calendar.id}>
                  <Link
                    href={`/admin?calendar=${calendar.id}`}
                    className={`flex items-center px-3 py-2 rounded-md transition-colors ${
                      activeCalendar === calendar.id
                        ? theme === "dark"
                          ? "bg-blue-600 text-white"
                          : "bg-blue-100 text-blue-800"
                        : theme === "dark"
                          ? "hover:bg-gray-800"
                          : "hover:bg-gray-100"
                    }`}
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>{calendar.title}</span>
                  </Link>
                </li>
              ))}

            {/* 문의 안내 카드 */}
            <li>
              <div
                className={`mt-2 p-3 rounded-md text-sm ${
                  theme === "dark" ? "bg-gray-800 border border-gray-700" : "bg-gray-50 border border-gray-200"
                }`}
              >
                <p className="font-medium mb-1">원하는 달력 종류가 있나요?</p>
                <p className="text-xs text-gray-500">문의하세요.</p>
                <Link
                  href="/contact"
                  className={`mt-2 inline-block px-3 py-1 rounded-md text-xs ${
                    theme === "dark" ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-200 hover:bg-gray-300"
                  }`}
                >
                  문의하기
                </Link>
              </div>
            </li>
          </ul>

          {/* 추가 메뉴 */}
          <div className="mt-6 mb-4 text-sm font-medium text-gray-500 uppercase">관리</div>
          <ul className="space-y-2">
            <li>
              <Link
                href="/admin/trash"
                className={`flex items-center px-3 py-2 rounded-md transition-colors ${
                  activeCalendar === "trash"
                    ? theme === "dark"
                      ? "bg-blue-600 text-white"
                      : "bg-blue-100 text-blue-800"
                    : theme === "dark"
                      ? "hover:bg-gray-800"
                      : "hover:bg-gray-100"
                }`}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                <span>휴지통</span>
              </Link>
            </li>
            <li>
              <Link
                href="/admin/settings"
                className={`flex items-center px-3 py-2 rounded-md transition-colors ${
                  activeCalendar === "settings"
                    ? theme === "dark"
                      ? "bg-blue-600 text-white"
                      : "bg-blue-100 text-blue-800"
                    : theme === "dark"
                      ? "hover:bg-gray-800"
                      : "hover:bg-gray-100"
                }`}
              >
                <Settings className="h-4 w-4 mr-2" />
                <span>설정</span>
              </Link>
            </li>
            {isSuperAdmin && (
              <li>
                <Link
                  href="/admin/users"
                  className={`flex items-center px-3 py-2 rounded-md transition-colors ${
                    activeCalendar === "users"
                      ? theme === "dark"
                        ? "bg-blue-600 text-white"
                        : "bg-blue-100 text-blue-800"
                      : theme === "dark"
                        ? "hover:bg-gray-800"
                        : "hover:bg-gray-100"
                  }`}
                >
                  <Users className="h-4 w-4 mr-2" />
                  <span>관리자 계정</span>
                </Link>
              </li>
            )}
          </ul>
        </nav>

        <div className="p-4 border-t border-inherit">
          <Link
            href="/"
            className={`flex items-center px-3 py-2 rounded-md transition-colors ${
              theme === "dark" ? "hover:bg-gray-800" : "hover:bg-gray-100"
            }`}
          >
            <span>메인 페이지로 돌아가기</span>
          </Link>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-black bg-opacity-50">
          <div
            className={`fixed inset-y-0 left-0 w-64 ${
              theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-gray-900"
            } shadow-lg overflow-y-auto`}
          >
            <div className="p-4 border-b border-inherit sticky top-0 bg-inherit z-10 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Calendar className={`h-6 w-6 ${theme === "dark" ? "text-blue-400" : "text-blue-600"}`} />
                <span className="text-xl font-bold">KATUSA Calendar</span>
              </div>
              <button onClick={() => setIsMobileMenuOpen(false)}>
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* 사용자 정보 */}
            <div className="p-4 border-b border-inherit">
              <div
                className={`p-2 rounded-md flex items-center justify-between ${
                  theme === "dark" ? "bg-gray-800 hover:bg-gray-700" : "bg-gray-100 hover:bg-gray-200"
                } cursor-pointer transition-colors`}
                onClick={() => router.push("/admin/users")}
              >
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span className="text-sm font-medium">
                    {currentUser?.nickname || currentUser?.username || "관리자"}
                  </span>
                </div>
                <ChevronRight className="h-4 w-4" />
              </div>
            </div>

            <nav className="flex-1 p-4 overflow-y-auto">
              <div className="mb-4 text-sm font-medium text-gray-500 uppercase">캘린더 관리</div>
              <ul className="space-y-2">
                {Array.isArray(calendarsData) &&
                  calendarsData.map((calendar) => (
                    <li key={calendar.id}>
                      <Link
                        href={`/admin?calendar=${calendar.id}`}
                        className={`flex items-center px-3 py-2 rounded-md transition-colors ${
                          activeCalendar === calendar.id
                            ? theme === "dark"
                              ? "bg-blue-600 text-white"
                              : "bg-blue-100 text-blue-800"
                            : theme === "dark"
                              ? "hover:bg-gray-800"
                              : "hover:bg-gray-100"
                        }`}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <Calendar className="h-4 w-4 mr-2" />
                        <span>{calendar.title}</span>
                      </Link>
                    </li>
                  ))}
              </ul>

              {/* 추가 메뉴 */}
              <div className="mt-6 mb-4 text-sm font-medium text-gray-500 uppercase">관리</div>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/admin/trash"
                    className={`flex items-center px-3 py-2 rounded-md transition-colors ${
                      activeCalendar === "trash"
                        ? theme === "dark"
                          ? "bg-blue-600 text-white"
                          : "bg-blue-100 text-blue-800"
                        : theme === "dark"
                          ? "hover:bg-gray-800"
                          : "hover:bg-gray-100"
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    <span>휴지통</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/admin/settings"
                    className={`flex items-center px-3 py-2 rounded-md transition-colors ${
                      activeCalendar === "settings"
                        ? theme === "dark"
                          ? "bg-blue-600 text-white"
                          : "bg-blue-100 text-blue-800"
                        : theme === "dark"
                          ? "hover:bg-gray-800"
                          : "hover:bg-gray-100"
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    <span>설정</span>
                  </Link>
                </li>
                {isSuperAdmin && (
                  <li>
                    <Link
                      href="/admin/users"
                      className={`flex items-center px-3 py-2 rounded-md transition-colors ${
                        activeCalendar === "users"
                          ? theme === "dark"
                            ? "bg-blue-600 text-white"
                            : "bg-blue-100 text-blue-800"
                          : theme === "dark"
                            ? "hover:bg-gray-800"
                            : "hover:bg-gray-100"
                      }`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Users className="h-4 w-4 mr-2" />
                      <span>관리자 계정</span>
                    </Link>
                  </li>
                )}
                <li>
                  <button
                    onClick={handleLogout}
                    className={`w-full flex items-center px-3 py-2 rounded-md transition-colors ${
                      theme === "dark" ? "hover:bg-gray-800 text-red-400" : "hover:bg-gray-100 text-red-600"
                    }`}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    <span>로그아웃</span>
                  </button>
                </li>
              </ul>
            </nav>

            <div className="p-4 border-t border-inherit">
              <Link
                href="/"
                className={`flex items-center px-3 py-2 rounded-md transition-colors ${
                  theme === "dark" ? "hover:bg-gray-800" : "hover:bg-gray-100"
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span>메인 페이지로 돌아가기</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
