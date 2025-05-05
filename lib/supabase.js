"use client"

import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// calendar-settings 테이블의 값을 가져오는 함수
export const getCalendarActiveStatus = async () => {
  try {
    const { data, error } = await supabase
      .from("calendar_settings")
      .select("calendar_id, is_active, copy_count")

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
    console.error("Error fetching calendar active status:", error)
    throw error
  }
}

// calendar-settings 테이블의 is_active 값을 업데이트하는 함수
// 오류가 나면 오류를 반환하고, 성공하면 업데이트된 데이터를 반환
export const updateCalendarActiveStatus = async (calendarId, isActive) => {
  try {
    const { data, error } = await supabase
      .from("calendars")
      .update({ is_active: isActive })
      .eq("id", calendarId)

    if (error) throw error

    return data
  } catch (error) {
    console.error("Error updating calendar active status:", error)
    throw error
  }
}