import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function POST(request) {
  try {
    const { token } = await request.json()

    if (token) {
      // 세션 삭제
      const { error } = await supabase.from("admin_sessions").delete().eq("token", token)

      if (error) {
        throw error
      }
    }

    // 쿠키 삭제
    const response = NextResponse.json({ success: true })
    response.cookies.set({
      name: "admin_session",
      value: "",
      expires: new Date(0),
      path: "/",
    })

    return response
  } catch (error) {
    console.error("Logout error:", error)
    return NextResponse.json({ success: false, message: "로그아웃 중 오류가 발생했습니다." }, { status: 500 })
  }
}
