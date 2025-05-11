"use client"

import { createClient } from "@supabase/supabase-js"

// 환경 변수 확인
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Supabase URL 또는 Anon Key가 설정되지 않았습니다.")
}

// 클라이언트 측 Supabase 클라이언트 생성 (공개 키 사용)
const supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
})

// 캘린더 설정 테이블의 값을 가져오는 함수
export const getCalendarStatus = async () => {
  try {
    // 먼저 테이블이 존재하는지 확인
    const { error: checkError } = await supabaseClient.from("calendar_settings").select("count").limit(1)

    if (checkError && checkError.message.includes("does not exist")) {
      console.log("calendar_settings table doesn't exist yet, creating default status")
      // 테이블이 없는 경우 빈 객체 반환
      return {}
    }

    const { data, error } = await supabaseClient.from("calendar_settings").select("calendar_id, is_active, copy_count")

    if (error) throw error

    // 캘린더 상태 객체 생성
    const statusObj = {}
    if (Array.isArray(data)) {
      data.forEach((item) => {
        statusObj[item.calendar_id] = {
          is_active: item.is_active,
          copy_count: item.copy_count || 0,
        }
      })
    }

    return statusObj
  } catch (error) {
    console.error("Error fetching calendar status:", error)
    return {}
  }
}

// 캘린더 복사 카운트 증가 함수
export const incrementCalendarCopyCount = async (calendarId) => {
  try {
    // 먼저 해당 캘린더 ID의 설정이 있는지 확인
    const { data: existingSettings, error: checkError } = await supabaseClient
      .from("calendar_settings")
      .select("*")
      .eq("calendar_id", calendarId)
      .single()

    if (checkError && checkError.code !== "PGRST116") {
      // PGRST116는 결과가 없을 때 발생하는 에러 코드
      throw checkError
    }

    if (existingSettings) {
      // 기존 설정이 있으면 카운트 증가
      const { error: updateError } = await supabaseClient
        .from("calendar_settings")
        .update({ copy_count: (existingSettings.copy_count || 0) + 1 })
        .eq("calendar_id", calendarId)

      if (updateError) throw updateError
    } else {
      // 기존 설정이 없으면 새로 생성
      const { error: insertError } = await supabaseClient
        .from("calendar_settings")
        .insert({ calendar_id: calendarId, copy_count: 1, is_active: true })

      if (insertError) throw insertError
    }

    return true
  } catch (error) {
    console.error("Error incrementing copy count:", error)
    return false
  }
}

export { supabaseClient }
