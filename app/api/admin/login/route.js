import { NextResponse } from "next/server"
import { loginAdmin } from "@/lib/admin-auth"

export async function POST(request) {
  try {
    const { username, password } = await request.json()

    if (!username || !password) {
      return NextResponse.json({ success: false, message: "아이디와 비밀번호를 입력해주세요." }, { status: 400 })
    }

    const result = await loginAdmin(username, password)

    if (result.success) {
      // 쿠키 설정
      const response = NextResponse.json({
        success: true,
        token: result.token, // 토큰을 응답에 포함
        user: {
          id: result.user.id,
          username: result.user.username,
          nickname: result.user.nickname,
          role: result.user.role,
        },
      })

      // 쿠키 설정 (httpOnly: false로 설정하여 클라이언트에서 접근 가능하게 함)
      response.cookies.set({
        name: "admin_session",
        value: result.token,
        httpOnly: false, // 클라이언트에서 접근 가능하도록
        path: "/",
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24, // 24 hours
        sameSite: "lax",
      })

      return response
    } else {
      return NextResponse.json({ success: false, message: result.message }, { status: 401 })
    }
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ success: false, message: "로그인 중 오류가 발생했습니다." }, { status: 500 })
  }
}
