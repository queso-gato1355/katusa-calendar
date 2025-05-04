import bcrypt from "bcryptjs"
import { supabase } from "./supabase"

const SESSION_COOKIE_NAME = "admin_session"

// 비밀번호 해싱
export async function hashPassword(password) {
  return bcrypt.hash(password, 10)
}

// 비밀번호 검증
export async function verifyPassword(password, hashedPassword) {
  return bcrypt.compare(password, hashedPassword)
}

// 관리자 로그인
export async function loginAdmin(username, password) {
  try {
    // 사용자 정보 가져오기
    const { data: user, error: userError } = await supabase
      .from("admin_users")
      .select("*")
      .eq("username", username)
      .eq("is_active", true)
      .single()

    if (userError || !user) {
      return { success: false, message: "사용자를 찾을 수 없습니다." }
    }

    // 비밀번호 검증
    const isPasswordValid = await verifyPassword(password, user.password)
    if (!isPasswordValid) {
      return { success: false, message: "비밀번호가 일치하지 않습니다." }
    }

    // 세션 생성 - 기존 매개변수 이름 사용
    const { data: sessionData, error: sessionError } = await supabase.rpc("create_admin_session", {
      admin_id: user.id,
    })

    if (sessionError || !sessionData) {
      console.error("Session creation error:", sessionError)
      return { success: false, message: "세션 생성에 실패했습니다." }
    }

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

// 세션 검증
export async function validateSession(token) {
  if (!token) return null

  try {
    const { data, error } = await supabase.rpc("validate_admin_session", { session_token: token })

    if (error) {
      console.error("Session validation error:", error)
      return null
    }

    if (!data || !data.length || !data[0].is_valid) {
      return null
    }

    return {
      id: data[0].admin_id,
      username: data[0].username,
      nickname: data[0].nickname,
      role: data[0].role,
    }
  } catch (error) {
    console.error("Session validation error:", error)
    return null
  }
}

// 세션 쿠키 가져오기 (클라이언트 전용)
export function getSessionCookie() {
  if (typeof window === "undefined") {
    return null
  }

  const value = `; ${document.cookie}`
  const parts = value.split(`; ${SESSION_COOKIE_NAME}=`)
  if (parts.length === 2) return parts.pop().split(";").shift()
  return null
}

// 관리자 로그아웃
export async function logoutAdmin(token) {
  try {
    if (token) {
      // 세션 삭제
      await supabase.from("admin_sessions").delete().eq("token", token)
    }

    // 클라이언트 측에서만 쿠키 삭제
    if (typeof window !== "undefined") {
      document.cookie = `${SESSION_COOKIE_NAME}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax;`
    }

    return { success: true }
  } catch (error) {
    console.error("Logout error:", error)
    return { success: false, message: "로그아웃 중 오류가 발생했습니다." }
  }
}
