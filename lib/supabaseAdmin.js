import { createClient } from "@supabase/supabase-js"

// 환경 변수 확인
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error("Supabase URL 또는 서비스 키가 설정되지 않았습니다. 환경 변수를 확인하세요.")
}

// 관리자 권한의 Supabase 클라이언트 생성 (서비스 롤 키 사용)
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

export { supabaseAdmin }
