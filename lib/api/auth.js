import bcrypt from "bcryptjs"
import { supabaseServer } from "./supabase/server"

const SESSION_COOKIE_NAME = "admin_session"

/**
 * 비밀번호 해싱
 * @param {string} password - 원본 비밀번호
 * @returns {Promise<string>} - 해싱된 비밀번호
 */
export async function hashPassword(password) {
  try {
    return await bcrypt.hash(password, 12)
  } catch (error) {
    console.error("Error hashing password:", error)
    throw new Error("비밀번호 해싱에 실패했습니다.")
  }
}

/**
 * 비밀번호 검증
 * @param {string} password - 원본 비밀번호
 * @param {string} hashedPassword - 해싱된 비밀번호
 * @returns {Promise<boolean>} - 검증 결과
 */
export async function verifyPassword(password, hashedPassword) {
  try {
    return await bcrypt.compare(password, hashedPassword)
  } catch (error) {
    console.error("Error verifying password:", error)
    return false
  }
}

/**
 * 관리자 로그인
 * @param {string} username - 사용자명
 * @param {string} password - 비밀번호
 * @returns {Promise<Object>} - 로그인 결과
 */
export async function loginAdmin(username, password) {
  if (!username || !password) {
    return { success: false, message: "사용자명과 비밀번호를 입력해주세요." }
  }

  try {
    // 사용자 정보 가져오기
    const { data: user, error: userError } = await supabaseServer
      .from("admin_users")
      .select("id, username, password, nickname, role, is_active")
      .eq("username", username)
      .eq("is_active", true)
      .single()

    if (userError || !user) {
      return { success: false, message: "사용자를 찾을 수 없거나 비활성화된 계정입니다." }
    }

    // 비밀번호 검증
    const isPasswordValid = await verifyPassword(password, user.password)
    if (!isPasswordValid) {
      return { success: false, message: "비밀번호가 일치하지 않습니다." }
    }

    // 세션 생성
    const { data: sessionData, error: sessionError } = await supabaseServer.rpc("create_admin_session", {
      admin_id: user.id,
    })

    if (sessionError || !sessionData) {
      console.error("Session creation error:", sessionError)
      return { success: false, message: "세션 생성에 실패했습니다." }
    }

    // 마지막 로그인 시간 업데이트
    await supabaseServer
      .from("admin_users")
      .update({ last_login_at: new Date().toISOString() })
      .eq("id", user.id)

    // 세션 토큰 반환
    return {
      success: true,
      token: sessionData,
      user: {
        id: user.id,
        username: user.username,
        nickname: user.nickname,
        role: user.role,
      },
    }
  } catch (error) {
    console.error("Login error:", error)
    return { success: false, message: "로그인 중 오류가 발생했습니다." }
  }
}

/**
 * 세션 검증
 * @param {string} token - 세션 토큰
 * @returns {Promise<Object|null>} - 사용자 정보 또는 null
 */
export async function validateSession(token) {
  if (!token) return null

  try {
    const { data, error } = await supabaseServer.rpc("validate_admin_session", { 
      session_token: token 
    })

    if (error) {
      console.error("Session validation error:", error)
      return null
    }

    if (!data || !data.length || !data[0].is_valid) {
      return null
    }

    const sessionData = data[0]
    return {
      id: sessionData.admin_id,
      username: sessionData.username,
      nickname: sessionData.nickname,
      role: sessionData.role,
      isValid: sessionData.is_valid,
      expiresAt: sessionData.expires_at,
    }
  } catch (error) {
    console.error("Session validation error:", error)
    return null
  }
}

/**
 * 세션 쿠키 가져오기 (클라이언트 전용)
 * @returns {string|null} - 세션 토큰 또는 null
 */
export function getSessionCookie() {
  if (typeof window === "undefined") {
    return null
  }

  try {
    const value = `; ${document.cookie}`
    const parts = value.split(`; ${SESSION_COOKIE_NAME}=`)
    if (parts.length === 2) {
      return parts.pop().split(";").shift()
    }
    return null
  } catch (error) {
    console.error("Error getting session cookie:", error)
    return null
  }
}

/**
 * 세션 쿠키 설정 (클라이언트 전용)
 * @param {string} token - 세션 토큰
 * @param {number} maxAge - 쿠키 유효기간 (초)
 */
export function setSessionCookie(token, maxAge = 86400) {
  if (typeof window === "undefined") return

  try {
    const expires = new Date()
    expires.setTime(expires.getTime() + (maxAge * 1000))
    
    document.cookie = `${SESSION_COOKIE_NAME}=${token}; path=/; expires=${expires.toUTCString()}; SameSite=Lax; Secure=${window.location.protocol === 'https:'}`
  } catch (error) {
    console.error("Error setting session cookie:", error)
  }
}

/**
 * 관리자 로그아웃
 * @param {string} token - 세션 토큰
 * @returns {Promise<Object>} - 로그아웃 결과
 */
export async function logoutAdmin(token) {
  try {
    if (token) {
      // 세션 무효화
      const { error } = await supabaseServer.rpc("invalidate_admin_session", {
        session_token: token
      })
      
      if (error) {
        console.error("Session invalidation error:", error)
      }
    }

    // 클라이언트 측에서만 쿠키 삭제
    if (typeof window !== "undefined") {
      document.cookie = `${SESSION_COOKIE_NAME}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax;`
    }

    return { success: true, message: "성공적으로 로그아웃되었습니다." }
  } catch (error) {
    console.error("Logout error:", error)
    return { success: false, message: "로그아웃 중 오류가 발생했습니다." }
  }
}

/**
 * 관리자 계정 생성 (Super Admin 전용)
 * @param {Object} userData - 사용자 데이터
 * @param {string} userData.username - 사용자명
 * @param {string} userData.password - 비밀번호
 * @param {string} userData.nickname - 닉네임
 * @param {string} userData.email - 이메일
 * @param {string} userData.role - 역할 (admin, super_admin)
 * @returns {Promise<Object>} - 생성 결과
 */
export async function createAdminUser(userData) {
  const { username, password, nickname, email, role = "admin" } = userData

  if (!username || !password || !nickname || !email) {
    return { success: false, message: "모든 필수 정보를 입력해주세요." }
  }

  try {
    // 중복 사용자명 확인
    const { data: existingUser, error: checkError } = await supabaseServer
      .from("admin_users")
      .select("username")
      .eq("username", username)
      .single()

    if (existingUser) {
      return { success: false, message: "이미 존재하는 사용자명입니다." }
    }

    // 비밀번호 해싱
    const hashedPassword = await hashPassword(password)

    // 사용자 생성
    const { data: newUser, error: createError } = await supabaseServer
      .from("admin_users")
      .insert({
        username,
        password: hashedPassword,
        nickname,
        email,
        role,
        is_active: true,
        created_at: new Date().toISOString()
      })
      .select("id, username, nickname, email, role, is_active, created_at")
      .single()

    if (createError) {
      console.error("User creation error:", createError)
      return { success: false, message: "사용자 생성에 실패했습니다." }
    }

    return {
      success: true,
      message: "관리자 계정이 성공적으로 생성되었습니다.",
      user: newUser
    }
  } catch (error) {
    console.error("Create admin user error:", error)
    return { success: false, message: "계정 생성 중 오류가 발생했습니다." }
  }
}

/**
 * 관리자 계정 업데이트
 * @param {string} userId - 사용자 ID
 * @param {Object} updateData - 업데이트할 데이터
 * @returns {Promise<Object>} - 업데이트 결과
 */
export async function updateAdminUser(userId, updateData) {
  if (!userId) {
    return { success: false, message: "사용자 ID가 필요합니다." }
  }

  try {
    const updateFields = { ...updateData }

    // 비밀번호가 포함된 경우 해싱
    if (updateFields.password) {
      updateFields.password = await hashPassword(updateFields.password)
    }

    // 업데이트 시간 추가
    updateFields.updated_at = new Date().toISOString()

    const { data: updatedUser, error: updateError } = await supabaseServer
      .from("admin_users")
      .update(updateFields)
      .eq("id", userId)
      .select("id, username, nickname, email, role, is_active, updated_at")
      .single()

    if (updateError) {
      console.error("User update error:", updateError)
      return { success: false, message: "사용자 정보 업데이트에 실패했습니다." }
    }

    return {
      success: true,
      message: "사용자 정보가 성공적으로 업데이트되었습니다.",
      user: updatedUser
    }
  } catch (error) {
    console.error("Update admin user error:", error)
    return { success: false, message: "사용자 정보 업데이트 중 오류가 발생했습니다." }
  }
}

/**
 * 관리자 계정 비활성화/활성화
 * @param {string} userId - 사용자 ID
 * @param {boolean} isActive - 활성화 상태
 * @returns {Promise<Object>} - 결과
 */
export async function toggleAdminUserStatus(userId, isActive) {
  if (!userId || typeof isActive !== "boolean") {
    return { success: false, message: "유효하지 않은 매개변수입니다." }
  }

  try {
    const { data: updatedUser, error: updateError } = await supabaseServer
      .from("admin_users")
      .update({ 
        is_active: isActive,
        updated_at: new Date().toISOString()
      })
      .eq("id", userId)
      .select("id, username, nickname, is_active")
      .single()

    if (updateError) {
      console.error("User status toggle error:", updateError)
      return { success: false, message: "사용자 상태 변경에 실패했습니다." }
    }

    // 비활성화된 경우 해당 사용자의 모든 세션 무효화
    if (!isActive) {
      await supabaseServer
        .from("admin_sessions")
        .update({ is_active: false })
        .eq("admin_id", userId)
    }

    return {
      success: true,
      message: `사용자가 ${isActive ? '활성화' : '비활성화'}되었습니다.`,
      user: updatedUser
    }
  } catch (error) {
    console.error("Toggle admin user status error:", error)
    return { success: false, message: "사용자 상태 변경 중 오류가 발생했습니다." }
  }
}

// 상수 export
export { SESSION_COOKIE_NAME }
