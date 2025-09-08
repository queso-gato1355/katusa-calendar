"use client"

import { useState, useEffect } from "react"
import { X, Save, Trash2 } from "lucide-react"
import { supabaseClient } from "@/lib/api/supabase/client"
import { hashPassword } from "@/lib/admin-auth"
import toast from "react-hot-toast"

export default function AdminUserModal({ isOpen, onClose, user, currentUser, onSave, theme }) {
  const [formData, setFormData] = useState({
    username: "",
    nickname: "",
    password: "",
    confirmPassword: "",
    role: "admin",
  })
  const [isDeleting, setIsDeleting] = useState(false)
  const [loading, setLoading] = useState(false)

  // 수정 모드인지 확인
  const isEditMode = !!user

  // 슈퍼 관리자인지 확인
  const isSuperAdmin = currentUser?.role === "super_admin"

  // 자기 자신을 수정하는지 확인
  const isSelfEdit = user?.id === currentUser?.id

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || "",
        nickname: user.nickname || "",
        password: "",
        confirmPassword: "",
        role: user.role || "admin",
      })
    } else {
      setFormData({
        username: "",
        nickname: "",
        password: "",
        confirmPassword: "",
        role: "admin",
      })
    }
  }, [user])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      // 비밀번호 확인
      if (formData.password && formData.password !== formData.confirmPassword) {
        toast.error("비밀번호가 일치하지 않습니다.")
        setLoading(false)
        return
      }

      // 사용자 데이터 준비
      const userData = {
        username: formData.username,
        nickname: formData.nickname,
        role: isSuperAdmin ? formData.role : "admin", // 슈퍼 관리자만 역할 변경 가능
      }

      // 비밀번호가 입력된 경우에만 해싱하여 추가
      if (formData.password) {
        userData.password = await hashPassword(formData.password)
      }

      // 새 사용자 생성 또는 기존 사용자 업데이트
      if (isEditMode) {
        // 자신의 역할을 변경하려는 경우 방지
        if (isSelfEdit && userData.role !== user.role) {
          toast.error("자신의 역할은 변경할 수 없습니다.")
          setLoading(false)
          return
        }

        // 업데이트 시간 및 업데이트한 사용자 정보 추가
        userData.updated_at = new Date().toISOString()
        userData.updated_by = currentUser.id

        // 기존 사용자 업데이트
        const { error } = await supabaseClient.from("admin_users").update(userData).eq("id", user.id)

        if (error) throw error

        toast.success("관리자 정보가 업데이트되었습니다.")
      } else {
        // 새 사용자 생성
        if (!formData.password) {
          toast.error("새 관리자 생성 시 비밀번호는 필수입니다.")
          setLoading(false)
          return
        }

        // 생성자 정보 추가
        userData.created_by = currentUser.id
        userData.created_at = new Date().toISOString()

        const { error } = await supabaseClient.from("admin_users").insert(userData)

        if (error) {
          if (error.code === "23505") {
            // 중복 사용자명 오류
            toast.error("이미 사용 중인 사용자명입니다.")
          } else {
            throw error
          }
        } else {
          toast.success("새 관리자가 생성되었습니다.")
        }
      }

      // 성공 시 모달 닫기 및 데이터 갱신
      onSave()
      onClose()
    } catch (error) {
      console.error("Error saving admin user:", error)
      toast.error("관리자 정보 저장 중 오류가 발생했습니다.")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!isEditMode || isSelfEdit) return

    setIsDeleting(true)
    try {
      // 관리자 계정 비활성화
      const { error } = await supabaseClient.from("admin_users").update({ is_active: false }).eq("id", user.id)

      if (error) throw error

      toast.success("관리자 계정이 비활성화되었습니다.")
      onSave()
      onClose()
    } catch (error) {
      console.error("Error deleting admin user:", error)
      toast.error("관리자 계정 삭제 중 오류가 발생했습니다.")
    } finally {
      setIsDeleting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4 overflow-y-auto">
      <div
        className={`w-full max-w-md rounded-lg ${theme === "dark" ? "bg-gray-900" : "bg-white"} shadow-xl max-h-[90vh] overflow-y-auto`}
      >
        <div className="flex items-center justify-between p-4 border-b border-inherit sticky top-0 bg-inherit z-10">
          <h2 className="text-lg font-medium">{isEditMode ? "관리자 정보 수정" : "새 관리자 추가"}</h2>
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
              <label htmlFor="username" className="block text-sm font-medium mb-1">
                사용자명 *
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                className={`w-full rounded-md border px-3 py-2 ${
                  theme === "dark" ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-300 text-gray-900"
                }`}
              />
            </div>

            <div>
              <label htmlFor="nickname" className="block text-sm font-medium mb-1">
                닉네임 *
              </label>
              <input
                type="text"
                id="nickname"
                name="nickname"
                value={formData.nickname}
                onChange={handleChange}
                required
                className={`w-full rounded-md border px-3 py-2 ${
                  theme === "dark" ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-300 text-gray-900"
                }`}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-1">
                비밀번호 {isEditMode ? "" : "*"}
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required={!isEditMode}
                className={`w-full rounded-md border px-3 py-2 ${
                  theme === "dark" ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-300 text-gray-900"
                }`}
                placeholder={isEditMode ? "변경하지 않으려면 비워두세요" : ""}
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1">
                비밀번호 확인 {isEditMode ? "" : "*"}
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required={!isEditMode}
                className={`w-full rounded-md border px-3 py-2 ${
                  theme === "dark" ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-300 text-gray-900"
                }`}
              />
            </div>

            {/* 역할 선택 (슈퍼 관리자만 변경 가능) */}
            {isSuperAdmin && (
              <div>
                <label htmlFor="role" className="block text-sm font-medium mb-1">
                  역할 *
                </label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  disabled={isSelfEdit} // 자기 자신의 역할은 변경 불가
                  className={`w-full rounded-md border px-3 py-2 ${
                    theme === "dark"
                      ? "bg-gray-800 border-gray-700 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  } ${isSelfEdit ? "opacity-60" : ""}`}
                >
                  <option value="admin">일반 관리자</option>
                  <option value="super_admin">슈퍼 관리자</option>
                </select>
                {isSelfEdit && <p className="text-xs text-gray-500 mt-1">자신의 역할은 변경할 수 없습니다.</p>}
              </div>
            )}
            {!isSuperAdmin && (
              <div>
                <label htmlFor="role" className="block text-sm font-medium mb-1">
                  역할
                </label>
                <input
                  type="text"
                  id="role-display"
                  value="일반 관리자"
                  disabled
                  className={`w-full rounded-md border px-3 py-2 opacity-60 ${
                    theme === "dark"
                      ? "bg-gray-800 border-gray-700 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  }`}
                />
                <input type="hidden" name="role" value="admin" />
                <p className="text-xs text-gray-500 mt-1">일반 관리자만 생성할 수 있습니다.</p>
              </div>
            )}
          </div>

          <div className="mt-6 flex justify-between">
            {isEditMode && isSuperAdmin && !isSelfEdit ? (
              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting || loading}
                className={`px-4 py-2 rounded-md flex items-center gap-2 ${
                  theme === "dark" ? "bg-red-600 text-white hover:bg-red-700" : "bg-red-600 text-white hover:bg-red-700"
                } ${isDeleting || loading ? "opacity-70 cursor-not-allowed" : ""}`}
              >
                <Trash2 className="h-4 w-4" />
                {isDeleting ? "삭제 중..." : "삭제"}
              </button>
            ) : (
              <div></div>
            )}

            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className={`px-4 py-2 rounded-md ${
                  theme === "dark" ? "bg-gray-800 hover:bg-gray-700" : "bg-gray-100 hover:bg-gray-200"
                }`}
              >
                취소
              </button>
              <button
                type="submit"
                disabled={loading}
                className={`px-4 py-2 rounded-md flex items-center gap-2 ${
                  theme === "dark"
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                } ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
              >
                <Save className="h-4 w-4" />
                {loading ? "저장 중..." : "저장"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
