"use client"

import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// calendar-settings 테이블의 is_active 값을 업데이트하는 함수
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