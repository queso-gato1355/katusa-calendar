"use client"

// TODO: User를 새로 추가하는 것에서 오류가 발생함. 원인 파악 필요

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { AdminUserModal } from "@/components/organisms/Admin/AdminUserModal"
import { usePagination } from "@/lib/hooks/use-pagination"
import toast from "react-hot-toast"
import { UserPlus, Edit, User, Shield, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react"
import { getCurrentUser, fetchAdminAccounts } from "@/lib/api/supabase/helpers"

export default function AdminUsersPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [adminUsers, setAdminUsers] = useState([])
  const [currentUser, setCurrentUser] = useState(null)
  const [selectedUser, setSelectedUser] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  const {
    pagination,
    handlePageChange,
    handlePerPageChange,
    setTotal,
    getTotalPages,
    getDisplayRange,
  } = usePagination(10)

  // 컴포넌트 마운트 확인
  useEffect(() => {
    setMounted(true)
  }, [])

  // 인증 상태 확인
  useEffect(() => {
    if (mounted) {
      checkCurrentUser()
    }
  }, [mounted])

  const checkCurrentUser = async () => {
    try {
      const { data: user, error } = await getCurrentUser()
      if (user && !error) {
        setCurrentUser({
          id: user.id,
          username: user.username,
          nickname: user.nickname,
          role: user.role,
        })
      } else {
        // 인증되지 않은 사용자를 로그인 페이지로 리다이렉트
        console.error("Authentication failed:", error)
        router.push("/admin")
      }
    } catch (error) {
      console.error("Error fetching current user:", error)
      router.push("/admin")
    }
  }

  // 관리자 목록 가져오기
  const fetchAdminUsers = useCallback(async () => {
    if (!currentUser) return
    
    setLoading(true)
    try {
      const from = (pagination.page - 1) * pagination.perPage
      const to = from + pagination.perPage - 1

      const { success, data, count } = await fetchAdminAccounts(from, to)

      if (success) {
        setAdminUsers(data || [])
        setTotal(count || 0)
      } else {
        throw new Error("Failed to fetch admin accounts")
      }
    } catch (error) {
      console.error("Error fetching admin users:", error)
      toast.error("관리자 목록을 불러오는 중 오류가 발생했습니다.")
    } finally {
      setLoading(false)
    }
  }, [currentUser, pagination.page, pagination.perPage])

  useEffect(() => {
    if (currentUser) {
      fetchAdminUsers()
    }
  }, [currentUser, fetchAdminUsers])

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

  // 마운트되지 않았으면 렌더링하지 않음 (hydration 방지)
  if (!mounted || loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>관리자 목록을 불러오는 중...</p>
        </div>
      </div>
    )
  }

  // 인증되지 않은 사용자 처리
  if (!currentUser) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p>인증 정보를 확인하는 중...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">{/* 기존 theme 조건문 제거 */}

      <div className="p-4 md:p-8">
        <div className="mb-6 flex justify-between items-center flex-col">

          {/* 새 관리자 추가 버튼 */}
          <button
            onClick={handleAddUser}
            className="px-4 py-4 md:py-2 flex rounded-full md:rounded-md items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
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
              className="rounded-md border border-input bg-background px-2 py-1 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
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
        <div className="w-full overflow-hidden rounded-lg border border-border">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium">사용자명</th>
                <th className="px-4 py-3 text-left text-sm font-medium hidden md:table-cell">닉네임</th>
                <th className="px-4 py-3 text-left text-sm font-medium hidden md:table-cell">역할</th>
                <th className="px-4 py-3 text-left text-sm font-medium hidden md:table-cell">생성일</th>
                <th className="px-4 py-3 text-left text-sm font-medium hidden md:table-cell">생성자</th>
                <th className="px-4 py-3 text-left text-sm font-medium hidden md:table-cell">최근 수정자</th>
                <th className="px-4 py-3 text-right text-sm font-medium">작업</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center">
                    로딩 중...
                  </td>
                </tr>
              ) : adminUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                    관리자 계정이 없습니다.
                  </td>
                </tr>
              ) : (
                adminUsers.map((user) => (
                  <tr
                    key={user.id}
                    className={`hover:bg-muted/50 transition-colors ${
                      currentUser?.id === user.id ? "bg-accent/50" : ""
                    }`}
                  >
                    <td className="px-4 py-3 text-sm">
                      <div className="flex items-center">
                        <span className="font-medium">{user.username}</span>
                        {currentUser?.id === user.id && (
                          <span className="ml-2 text-xs bg-accent text-accent-foreground px-2 py-0.5 rounded-full">
                            현재 사용자
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm hidden md:table-cell">{user.nickname || "-"}</td>
                    <td className="px-4 py-3 text-sm hidden md:table-cell">{getRoleDisplay(user.role)}</td>
                    <td className="px-4 py-3 text-sm hidden md:table-cell">{formatDate(user.created_at)}</td>
                    <td className="px-4 py-3 text-sm hidden md:table-cell">{getCreatorDisplay(user)}</td>
                    <td className="px-4 py-3 text-sm hidden md:table-cell">{getUpdaterDisplay(user)}</td>
                    <td className="px-4 py-3 text-sm text-right">
                      <button
                        onClick={() => handleEditUser(user)}
                        className="p-1 rounded-md hover:bg-muted transition-colors"
                        aria-label="사용자 편집"
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
          <div className="text-sm text-muted-foreground">
            {getDisplayRange()}
          </div>
          <div className="flex gap-1">
            <button
              onClick={() => handlePageChange(1)}
              disabled={pagination.page === 1}
              className="p-1 rounded-md hover:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed transition-colors"
              aria-label="첫 페이지"
            >
              <ChevronsLeft className="h-5 w-5" />
            </button>
            <button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="p-1 rounded-md hover:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed transition-colors"
              aria-label="이전 페이지"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            <div className="flex items-center px-2">
              <span className="text-sm">
                {pagination.page} / {getTotalPages()}
              </span>
            </div>

            <button
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page >= getTotalPages()}
              className="p-1 rounded-md hover:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed transition-colors"
              aria-label="다음 페이지"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
            <button
              onClick={() => handlePageChange(getTotalPages())}
              disabled={pagination.page >= getTotalPages()}
              className="p-1 rounded-md hover:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed transition-colors"
              aria-label="마지막 페이지"
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
      />
    </div>
  )
}
