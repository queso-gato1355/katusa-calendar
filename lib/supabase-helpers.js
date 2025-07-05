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
    if (page && perPage && perPage > 0) {
      const from = (page - 1) * perPage
      let to = from + perPage - 1

      if (to < from) {
        to = from
      }
      // query의 크기가 perPage보다 작다면 편집하지 않기
      const tableSize = query.data ? query.data.length : 0
      if (tableSize >= perPage) {
        query = query.range(from, to)
      }
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
      console.log("Updating event:", result)
      if (result.error) throw result.error
    } else {
      // 새 이벤트 추가
      result = await supabaseClient.from("events").insert({
        ...eventToSave,
        category: category,
        is_disabled: false,
        created_at: new Date().toISOString(),
      })
      console.log("Inserting new event:", result)
      if (result.error) throw result.error
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
 * 여러 이벤트를 소프트 삭제하는 함수
 * @param {Array<number>} eventIds - 이벤트 ID
 * @returns {Promise<Object>} - 삭제 결과
 */
export const softDeleteEvents = async (eventIds) => {
  try {
    const { error } = await supabaseClient
      .from("events")
      .update({
        is_disabled: true,
        updated_at: new Date().toISOString(),
      })
      .in("id", eventIds)

    if (error) throw error

    return { success: true }
  } catch (error) {
    console.error("Error deleting events:", error)
    return { success: false, error }
  }
}

/**
 * 특정 카테고리의 이벤트를 전부 소프트 삭제하는 함수
 * @param {Array<string>} categories - 카테고리 배열
 * @returns {Promise<Object>} - 삭제 결과
 */
export const softDeleteEventsByCategory = async (categories) => {
  try {
    const { error } = await supabaseClient
      .from("events")
      .update({
        is_disabled: true,
        updated_at: new Date().toISOString(),
      })
      .in("category", categories)

    if (error) throw error

    return { success: true }
  } catch (error) {
    console.error("Error deleting events by category:", error)
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
 * 삭제된 이벤트를 가져오는 함수
 * @param {Object} options - 필터링 옵션
 * @returns {Promise<Object>} - 삭제된 이벤트 배열과 총 개수
 */
export const fetchDeletedEvents = async (options = {}) => {
  try {
    const { data, error, count } = await supabaseClient
      .from("events")
      .select("*", { count: "exact" })
      .eq("is_disabled", true)
      .order("updated_at", { ascending: false })
      .range(options.from || 0, options.to || 9)

    if (error) throw error

    return { success: true, data, count }
  } catch (error) {
    console.error("Error fetching deleted events:", error)
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
 * 특정 카테고리의 일정을 가져오는 함수 (배열로 값을 받음)
 * @param {Array<string>} categories - 카테고리 이름 배열
 * @returns {Promise<Object>} - 쿼리
 */
export const fetchEventsByCategory = async (categories) => {
  try {
    const query = await supabaseClient
      .from("events")
      .select("*")
      .in("category", categories)
      .eq("is_disabled", false)
    
    const { error } = query

    if (error) throw error

    return query
  } catch (error) {
    console.error("일정을 가져오는 중 오류가 발생했습니다:", error)
    return { success: false, error }
  }
}

/**
 * 특정 카테고리의 일정을 쿼리로 검색하는 함수 (자유도 높은 파라미터 지원)
 * @param {Array<string>} categories - 카테고리 이름 배열
 * @param {Array<Function>} queryModifiers - 쿼리 수정 함수 배열 (각 함수는 query => query 형태)
 * @returns {Promise<Object>} - 쿼리 결과
 *
 * 예시:
 * fetchEventsByCategoryWithFlexibleQuery(['A'], [
 *   q => q.ilike('title', '%test%'),
 *   q => q.gte('start_at', '2024-01-01'),
 *   q => q.lte('start_at', '2024-12-31'),
 *   q => q.order('start_at', { ascending: false }),
 *   q => q.range(0, 9)
 * ])
 */
export const fetchEventsByCategoryWithFlexibleQuery = async (categories, queryModifiers = []) => {
  try {
    let query = supabaseClient
      .from("events")
      .select("*")
      .in("category", categories)
      .eq("is_disabled", false)

    // queryModifiers 배열의 각 함수를 순차적으로 적용
    for (const modifier of queryModifiers) {
      if (typeof modifier === "function") {
        query = modifier(query)
      }
    }

    const { data, error } = await query

    if (error) throw error

    return { success: true, data }
  } catch (error) {
    console.error("카테고리별 자유 쿼리 검색 중 오류:", error)
    return { success: false, error }
  }
}
