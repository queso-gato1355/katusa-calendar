"use client"

import { createClient } from "@supabase/supabase-js"

// 환경 변수 확인
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Supabase URL 또는 Anon Key가 설정되지 않았습니다.")
}

// 클라이언트 측 Supabase 클라이언트 생성 (공개 키 사용)
export const supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
})