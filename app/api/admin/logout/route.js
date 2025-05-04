import { NextResponse } from "next/server"
import { logoutAdmin, getSessionCookie } from "@/lib/admin-auth"

export async function POST() {
  try {
    const sessionToken = getSessionCookie()
    const result = await logoutAdmin(sessionToken)

    if (result.success) {
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json({ success: false, message: result.message }, { status: 500 })
    }
  } catch (error) {
    console.error("Logout error:", error)
    return NextResponse.json({ success: false, message: "로그아웃 중 오류가 발생했습니다." }, { status: 500 })
  }
}
