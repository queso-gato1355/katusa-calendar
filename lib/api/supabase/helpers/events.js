/**
 * 이벤트를 저장하는 함수
 * @param {Object} eventData - 이벤트 데이터
 * @param {string} category - 이벤트 카테고리
 * @returns {Promise<Object>} - 저장 결과
 */
export const saveEvent = async (eventData, category) => {
  try {
    const { id, ...eventToSave } = eventData

    // 데이터 검증
    if (!eventToSave.title.trim()) {
      throw new Error("제목은 필수 항목입니다.")
    }
    if (!eventToSave.start_at || !eventToSave.end_at) {
      throw new Error("시작일과 종료일은 필수 항목입니다.")
    }
    if (eventToSave.start_at > eventToSave.end_at) {
      throw new Error("종료일은 시작일보다 이후여야 합니다.")
    }

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
 * event 데이터를 검증하는 함수
 * @param {Object} eventData - 이벤트 데이터
 * @returns {Object} - 유효성 검사 결과와 유형
 */
export const validateEventData = (eventData) => {
  let errors = {
    isValid: true,
    reason: "",
  }
  if (!eventData.title || typeof eventData.title !== "string" || eventData.title.trim() === "") {
    errors.reason = "제목은 필수 항목입니다."
    errors.isValid = false
  }
  if (!eventData.start_at || !eventData.end_at) {
    errors.reason = "시작일과 종료일은 필수 항목입니다."
    errors.isValid = false
  }
  if (new Date(eventData.start_at) > new Date(eventData.end_at)) {
    errors.reason = "종료일은 시작일보다 이후여야 합니다."
    errors.isValid = false
  }
  return errors
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
      // range 함수가 오류가 난다면 query 편집하지 않기
      query = query.range(from, to)
    }

    const { data, error, count } = await query

    if (error) throw error

    return { data, count }
  } catch (error) {
    console.error("Error fetching events:", error)
    return { data: [], count: 0, error }
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
 * 이벤트를 영구 삭제하는 함수
 * @param {number} eventId - 이벤트 ID
 * @returns {Promise<Object>} - 삭제 결과
 */
export const hardDeleteEvent = async (eventId) => {
  try {
    const { error } = await supabaseClient.from("events").delete().eq("id", eventId)

    if (error) throw error

    return { success: true }
  } catch (error) {
    console.error("Error hard deleting event:", error)
    return { success: false, error }
  }
}

