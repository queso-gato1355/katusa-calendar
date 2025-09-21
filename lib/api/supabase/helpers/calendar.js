import { supabaseClient } from "@/lib/api/supabase/client"
import { supabaseServer } from "@/lib/api/supabase/server"

/**
 * 캘린더 설정 테이블의 값을 가져오는 함수
 * @returns {Promise<Object>} - 캘린더 상태 객체
 */
export const getCalendarStatus = async () => {
  try {
    const { data, error } = await supabaseClient
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
    console.error("Error fetching calendar status:", error)
    return {}
  }
}

/**
 * 캘린더 활성화 상태 업데이트 함수
 * @param {string} calendarId - 캘린더 ID
 * @param {boolean} isActive - 활성화 상태
 * @returns {Promise<Object>} - 업데이트 결과
 */
export const updateCalendarActiveStatus = async (calendarId, isActive) => {
  try {
    const { data, error } = await supabaseClient.from("calendars").update({ is_active: isActive }).eq("id", calendarId)

    if (error) throw error

    return { success: true, data }
  } catch (error) {
    console.error("Error updating calendar active status:", error)
    return { success: false, error }
  }
}

/**
 * 캘린더 복사 카운트 증가 함수
 * @param {string} calendarId - 캘린더 ID
 * @returns {Promise<boolean>} - 성공 여부
 */
export const incrementCalendarCopyCount = async (calendarId) => {
  try {
    // 먼저 해당 캘린더 ID의 설정이 있는지 확인
    const { data: existingSettings, error: checkError } = await supabaseClient
      .from("calendar_settings")
      .select("*")
      .eq("calendar_id", calendarId)
      .single()

    if (checkError && checkError.code !== "PGRST116") {
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

/**
 * 캘린더 활성화 상태 업데이트 함수
 * @param {string} calendarId - 캘린더 ID
 * @param {boolean} isActive - 활성화 상태
 * @returns {Promise<Object>} - 업데이트 결과
 */
export const updateCalendarStatus = async (calendarId, isActive) => {
  try {
    const { data, error } = await supabaseServer
      .from("calendar_settings")
      .update({ is_active: isActive })
      .eq("calendar_id", calendarId)
      .select()

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error("Error updating calendar status:", error)
    return { data: null, error }
  }
}

/**
 * 캘린더 설정 데이터를 가져오는 함수
 * @returns {Promise<Object>} - 캘린더 설정 객체
 */
export const fetchCalendarSettings = async () => {
  try {
    const { data, error } = await supabaseClient.from("calendars").select("*").order("id")

    if (error) throw error

    return data || []
  } catch (error) {
    console.error("Error fetching calendar settings:", error)
    return []
  }
}