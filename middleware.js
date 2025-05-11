import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

// Supabase 클라이언트 생성
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

export async function middleware(request) {
  // 관리자 페이지 경로 확인
  if (request.nextUrl.pathname.startsWith("/admin")) {
    // 로그인 페이지는 제외
    if (request.nextUrl.pathname === "/admin/login") {
      return NextResponse.next()
    }

    // 세션 쿠키 확인
    const sessionToken = request.cookies.get("admin_session")?.value

    if (!sessionToken) {
      // 세션이 없으면 로그인 페이지로 리디렉션
      return NextResponse.redirect(new URL("/admin/login", request.url))
    }

    try {
      // 세션 유효성 검증
      const { data, error } = await supabase.rpc("validate_admin_session", {
        session_token: sessionToken,
      })

      if (error || !data || data.length === 0 || !data[0].is_valid) {
        // 세션이 유효하지 않으면 로그인 페이지로 리디렉션
        return NextResponse.redirect(new URL("/admin/login", request.url))
      }
    } catch (error) {
      console.error("Session validation error:", error)
      // 오류 발생 시 로그인 페이지로 리디렉션
      return NextResponse.redirect(new URL("/admin/login", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*"],
}
