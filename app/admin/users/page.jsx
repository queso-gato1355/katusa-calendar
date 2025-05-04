"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import Sidebar from "@/components/admin/sidebar"
import AdminUserModal from "@/components/admin/admin-user-modal"
import toast from "react-hot-toast"
import { UserPlus, Edit, User, Shield, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react"

export default function AdminUsersPage() {
  const router = useRouter()
  const [theme, setTheme] = useState("light")
  const [loading, setLoading] = useState(true)
  const [adminUsers, setAdminUsers] = useState([])
  const [currentUser, setCurrentUser] = useState(null)
  const [selectedUser, setSelectedUser] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [pagination, setPagination] = useState({
    page: 1,
    perPage: 10,
    total: 0,
  })

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

      // 슈퍼 관리자 권한 확인
      if (data[0].role !== "super_admin") {
        toast.error("슈퍼 관리자만 접근할 수 있습니다.")
        router.push("/admin")
        return
      }

      // 인증 성공
      setCurrentUser({
        id: data[0].admin_id,
        username: data[0].username,
        nickname: data[0].nickname,
        role: data[0].role,
      })
      setIsAuthenticated(true)
    } catch (error) {
      console.error("Authentication error:", error)
      router.push("/admin/login")
    }
  }

  // 관리자 목록 가져오기
  useEffect(() => {
    if (isAuthenticated && currentUser) {
      fetchAdminUsers()
    }
  }, [isAuthenticated, currentUser, pagination.page, pagination.perPage])

  const fetchAdminUsers = async () => {
    setLoading(true)
    try {
      const { from, to } = getPaginationRange()

      // 관리자 목록 가져오기 (생성자 및 수정자 정보 포함)
      const query = supabase
        .from("admin_users")
        .select(
          `
          id, 
          username, 
          nickname,
          role, 
          created_at, 
          updated_at,
          is_active,
          created_by,
          updated_by,
          creator:created_by(username, nickname),
          updater:updated_by(username, nickname)
        `,
          { count: "exact" },
        )
        .eq("is_active", true)
        .order("created_at", { ascending: false })
        .range(from, to)

      const { data, error, count } = await query

      if (error) throw error

      setAdminUsers(data || [])
      setPagination((prev) => ({ ...prev, total: count || 0 }))
    } catch (error) {
      console.error("Error fetching admin users:", error)
      toast.error("관리자 목록을 불러오는 중 오류가 발생했습니다.")
    } finally {
      setLoading(false)
    }
  }

  const getPaginationRange = () => {
    const from = (pagination.page - 1) * pagination.perPage
    const to = from + pagination.perPage - 1
    return { from, to }
  }

  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, page: newPage }))
  }

  const handlePerPageChange = (newPerPage) => {
    setPagination({ page: 1, perPage: newPerPage, total: pagination.total })
  }

  const handleAddUser = () => {
    setSelectedUser(null)
    setIsModalOpen(true)
  }

  const handleEditUser = (user) => {
    setSelectedUser(user)
    setIsModalOpen(true)
  }

  const handleSaveUser = () => {
    fetchAdminUsers()
  }

  // 날짜 포맷팅
  const formatDate = (dateString) => {
    if (!dateString) return "-"
    const date = new Date(dateString)
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // 역할 표시
  const getRoleDisplay = (role) => {
    switch (role) {
      case "super_admin":
        return (
          <span className="flex items-center gap-1 text-yellow-500">
            <Shield className="h-4 w-4" />
            슈퍼 관리자
          </span>
        )
      case "admin":
        return (
          <span className="flex items-center gap-1 text-blue-500">
            <User className="h-4 w-4" />
            일반 관리자
          </span>
        )
      default:
        return role
    }
  }

  // 생성자/수정자 표시
  const getCreatorDisplay = (user) => {
    if (!user.creator) return "-"
    return user.creator.nickname || user.creator.username
  }

  const getUpdaterDisplay = (user) => {
    if (!user.updater) return "-"
    return user.updater.nickname || user.updater.username
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
      <Sidebar activeCalendar="users" theme={theme} />

      <div className="md:ml-64 p-4 md:p-8">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">관리자 계정 관리</h1>
            <p className="text-sm text-gray-500 mt-1">관리자 계정을 생성하고 관리합니다.</p>
          </div>

          {/* 새 관리자 추가 버튼 */}
          <button
            onClick={handleAddUser}
            className={`px-4 py-4 md:py-2 flex rounded-full md:rounded-md items-center gap-2 ${
              theme === "dark" ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            <UserPlus className="h-8 w-8" />
            <span className="hidden md:block">새 관리자 추가</span>
          </button>
        </div>

        {/* Table Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
          <div className="text-sm">
            총 <span className="font-medium">{pagination.total}</span>개의 관리자 계정
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="perPage" className="text-sm">
              페이지당 항목:
            </label>
            <select
              id="perPage"
              value={pagination.perPage}
              onChange={(e) => handlePerPageChange(Number(e.target.value))}
              className={`rounded-md border px-2 py-1 text-sm ${
                theme === "dark" ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-300 text-gray-900"
              }`}
            >
              {[5, 10, 20, 50].map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 관리자 목록 테이블 */}
        <div className="w-full overflow-hidden rounded-lg border border-inherit">
          <table className="w-full">
            <thead className={`${theme === "dark" ? "bg-gray-800" : "bg-gray-50"}`}>
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium">사용자명</th>
                <th className="px-4 py-3 text-left text-sm font-medium">닉네임</th>
                <th className="px-4 py-3 text-left text-sm font-medium hidden md:table-cell">역할</th>
                <th className="px-4 py-3 text-left text-sm font-medium hidden md:table-cell">생성일</th>
                <th className="px-4 py-3 text-left text-sm font-medium hidden md:table-cell">생성자</th>
                <th className="px-4 py-3 text-left text-sm font-medium hidden md:table-cell">최근 수정자</th>
                <th className="px-4 py-3 text-right text-sm font-medium">작업</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-inherit">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center">
                    로딩 중...
                  </td>
                </tr>
              ) : adminUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center">
                    관리자 계정이 없습니다.
                  </td>
                </tr>
              ) : (
                adminUsers.map((user) => (
                  <tr
                    key={user.id}
                    className={`${theme === "dark" ? "hover:bg-gray-800" : "hover:bg-gray-50"} ${
                      currentUser?.id === user.id ? "bg-blue-50 dark:bg-blue-900/20" : ""
                    }`}
                  >
                    <td className="px-4 py-3 text-sm">
                      <div className="flex items-center">
                        <span className="font-medium">{user.username}</span>
                        {currentUser?.id === user.id && (
                          <span className="ml-2 text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 px-2 py-0.5 rounded-full">
                            현재 사용자
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm">{user.nickname || "-"}</td>
                    <td className="px-4 py-3 text-sm hidden md:table-cell">{getRoleDisplay(user.role)}</td>
                    <td className="px-4 py-3 text-sm hidden md:table-cell">{formatDate(user.created_at)}</td>
                    <td className="px-4 py-3 text-sm hidden md:table-cell">{getCreatorDisplay(user)}</td>
                    <td className="px-4 py-3 text-sm hidden md:table-cell">{getUpdaterDisplay(user)}</td>
                    <td className="px-4 py-3 text-sm text-right">
                      <button
                        onClick={() => handleEditUser(user)}
                        className={`p-1 rounded-md ${theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-200"}`}
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-4">
          <div className="text-sm">
            {pagination.total > 0
              ? `${(pagination.page - 1) * pagination.perPage + 1}-${Math.min(pagination.page * pagination.perPage, pagination.total)} / ${pagination.total}`
              : "0 결과"}
          </div>
          <div className="flex gap-1">
            <button
              onClick={() => handlePageChange(1)}
              disabled={pagination.page === 1}
              className={`p-1 rounded-md ${
                theme === "dark"
                  ? "hover:bg-gray-800 disabled:text-gray-700"
                  : "hover:bg-gray-100 disabled:text-gray-300"
              } disabled:cursor-not-allowed`}
            >
              <ChevronsLeft className="h-5 w-5" />
            </button>
            <button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
              className={`p-1 rounded-md ${
                theme === "dark"
                  ? "hover:bg-gray-800 disabled:text-gray-700"
                  : "hover:bg-gray-100 disabled:text-gray-300"
              } disabled:cursor-not-allowed`}
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            <div className="flex items-center px-2">
              <span className="text-sm">
                {pagination.page} / {Math.ceil(pagination.total / pagination.perPage) || 1}
              </span>
            </div>

            <button
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page >= Math.ceil(pagination.total / pagination.perPage)}
              className={`p-1 rounded-md ${
                theme === "dark"
                  ? "hover:bg-gray-800 disabled:text-gray-700"
                  : "hover:bg-gray-100 disabled:text-gray-300"
              } disabled:cursor-not-allowed`}
            >
              <ChevronRight className="h-5 w-5" />
            </button>
            <button
              onClick={() => handlePageChange(Math.ceil(pagination.total / pagination.perPage))}
              disabled={pagination.page >= Math.ceil(pagination.total / pagination.perPage)}
              className={`p-1 rounded-md ${
                theme === "dark"
                  ? "hover:bg-gray-800 disabled:text-gray-700"
                  : "hover:bg-gray-100 disabled:text-gray-300"
              } disabled:cursor-not-allowed`}
            >
              <ChevronsRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* 관리자 추가/수정 모달 */}
      <AdminUserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        user={selectedUser}
        currentUser={currentUser}
        onSave={handleSaveUser}
        theme={theme}
      />
    </div>
  )
}
