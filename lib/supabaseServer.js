import { createClient } from '@supabase/supabase-js';

// 환경 변수에서 Supabase URL과 서비스 키를 가져옵니다.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Supabase URL 또는 서비스 키가 설정되지 않았습니다. 환경 변수를 확인하세요.');
}

// 서버 측 Supabase 클라이언트 생성
export const supabaseServer = createClient(supabaseUrl, supabaseServiceKey);