// 이 파일은 Supabase 관련 함수들을 모아둔 헬퍼 파일입니다.
import { supabaseClient } from "./supabaseClient"

/**
 * 캘린더 설정 테이블의 값을 가져오는 함수
 * @returns {Promise<Object>} - 캘린더 상태 객체
 */
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
 * 이벤트 데이터를 가져오는 함수
 * @param {Object} options - 필터링 옵션
 * @returns {Promise<Array>} - 이벤트 배열
 */
export const fetchEvents = async (options = {}) => {
  try {
    const {
      category,
      startDate,
      endDate,
      page = 1,
      perPage = 10,
      isDisabled = false,
      orderBy = "start_at",
      ascending = true,
    } = options

    let query = supabaseClient.from("events").select("*", { count: "exact" }).eq("is_disabled", isDisabled)

    // 카테고리 필터링
    if (category) {
      if (Array.isArray(category)) {
        query = query.in("category", category)
      } else {
        query = query.eq("category", category)
      }
    }

    // 날짜 범위 필터링
    if (startDate) {
      query = query.gte("start_at", startDate)
    }
    if (endDate) {
      query = query.lte("start_at", endDate)
    }

    // 정렬
    query = query.order(orderBy, { ascending })

    // 페이지네이션
    if (page && perPage) {
      const from = (page - 1) * perPage
      const to = from + perPage - 1
      query = query.range(from, to)
    }

    const { data, error, count } = await query

    if (error) throw error

    return { data, count }
  } catch (error) {
    console.error("Error fetching events:", error)
    throw error
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

/**
 * 이벤트를 저장하는 함수
 * @param {Object} eventData - 이벤트 데이터
 * @param {string} category - 이벤트 카테고리
 * @returns {Promise<Object>} - 저장 결과
 */
export const saveEvent = async (eventData, category) => {
  try {
    const { id, ...eventToSave } = eventData

    // 현재 시간 추가
    eventToSave.updated_at = new Date().toISOString()

    let result

    if (id) {
      // 기존 이벤트 수정
      result = await supabaseClient.from("events").update(eventToSave).eq("id", id)
    } else {
      // 새 이벤트 추가
      result = await supabaseClient.from("events").insert({
        ...eventToSave,
        category: category,
        is_disabled: false,
        created_at: new Date().toISOString(),
      })
    }

    if (result.error) throw result.error

    return { success: true, data: result.data }
  } catch (error) {
    console.error("Error saving event:", error)
    return { success: false, error }
  }
}

/**
 * 이벤트를 소프트 삭제하는 함수
 * @param {number} eventId - 이벤트 ID
 * @returns {Promise<Object>} - 삭제 결과
 */
export const softDeleteEvent = async (eventId) => {
  try {
    const { error } = await supabaseClient
      .from("events")
      .update({
        is_disabled: true,
        updated_at: new Date().toISOString(),
      })
      .eq("id", eventId)

    if (error) throw error

    return { success: true }
  } catch (error) {
    console.error("Error deleting event:", error)
    return { success: false, error }
  }
}

/**
 * 이벤트를 복원하는 함수
 * @param {number} eventId - 이벤트 ID
 * @returns {Promise<Object>} - 복원 결과
 */
export const restoreEvent = async (eventId) => {
  try {
    const { error } = await supabaseClient
      .from("events")
      .update({
        is_disabled: false,
        updated_at: new Date().toISOString(),
      })
      .eq("id", eventId)

    if (error) throw error

    return { success: true }
  } catch (error) {
    console.error("Error restoring event:", error)
    return { success: false, error }
  }
}

/**
 * 이벤트를 영구 삭제하는 함수
 * @param {number} eventId - 이벤트 ID
 * @returns {Promise<Object>} - 삭제 결과
 */
export const permanentDeleteEvent = async (eventId) => {
  try {
    const { error } = await supabaseClient.from("events").delete().eq("id", eventId)

    if (error) throw error

    return { success: true }
  } catch (error) {
    console.error("Error permanently deleting event:", error)
    return { success: false, error }
  }
}

/**
 * 관리자 세션 검증 함수
 * @param {string} sessionToken - 세션 토큰
 * @returns {Promise<Object>} - 검증 결과
 */
export const validateAdminSession = async (sessionToken) => {
  try {
    if (!sessionToken) return { isValid: false }

    const { data, error } = await supabaseClient.rpc("validate_admin_session", {
      session_token: sessionToken,
    })

    if (error || !data || data.length === 0 || !data[0].is_valid) {
      return { isValid: false }
    }

    return {
      isValid: true,
      user: {
        id: data[0].admin_id,
        username: data[0].username,
        nickname: data[0].nickname,
        role: data[0].role,
      },
    }
  } catch (error) {
    console.error("Session validation error:", error)
    return { isValid: false, error }
  }
}

/**
 * ICS 파일 재생성 함수
 * @param {string} cronSecret - CRON 시크릿 키
 * @returns {Promise<Object>} - 재생성 결과
 */
export const regenerateICSFiles = async (cronSecret) => {
  try {
    const response = await fetch("/api/generate-ics", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${cronSecret}`,
      },
    })

    if (!response.ok) {
      throw new Error("ICS 파일 재생성에 실패했습니다.")
    }

    const result = await response.json()
    return { success: true, data: result }
  } catch (error) {
    console.error("Error regenerating ICS files:", error)
    return { success: false, error }
  }
}
