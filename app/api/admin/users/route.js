import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabaseAdmin"
import { hashPassword } from "@/lib/admin-auth"

export async function POST(request) {
  try {
    // 요청 본문 파싱
    const body = await request.json()
    
    // 세션 토큰 확인
    const sessionToken = request.cookies.get("admin_session")?.value
    
    if (!sessionToken) {
      return NextResponse.json({ error: "인증되지 않은 요청입니다." }, { status: 401 })
    }
    
    // 세션 검증
    const { data: sessionData, error: sessionError } = await supabaseAdmin.rpc("validate_admin_session", {
      session_token: sessionToken,
    })
    
    if (sessionError || !sessionData || sessionData.length === 0 || !sessionData[0].is_valid) {
      return NextResponse.json({ error: "유효하지 않은 세션입니다." }, { status: 401 })
    }
    
    const currentUser = {
      id: sessionData[0].admin_id,
      username: sessionData[0].username,
      role: sessionData[0].role,
    }
    
    // 일반 관리자가 슈퍼 관리자 권한으로 사용자를 생성하려는 경우 방지
    if (currentUser.role !== "super_admin" && body.role === "super_admin") {
      return NextResponse.json({ error: "권한이 없습니다. 일반 관리자는 슈퍼 관리자를 생성할 수 없습니다." }, { status: 403 })
    }
    
    // 새 사용자 생성
    const userData = {
      username: body.username,
      nickname: body.nickname,
      role: currentUser.role === "super_admin" ? body.role : "admin", // 슈퍼 관리자만 역할 지정 가능
      created_by: currentUser.id,
      created_at: new Date().toISOString(),
    }
    
    // 비밀번호 해싱
    if (body.password) {
      userData.password = await hashPassword(body.password)
    } else {
      return NextResponse.json({ error: "비밀번호는 필수입니다." }, { status: 400 })
    }
    
    // 사용자 생성
    const { data, error } = await supabaseAdmin.from("admin_users").insert(userData).select()
    
    if (error) {
      if (error.code === "23505") {
        return NextResponse.json({ error: "이미 사용\
