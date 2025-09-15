import { supabaseClient } from "@/lib/api/supabase/client"

/**
 * 문의 내역을 가져오는 함수
 * @param {number} from - 페이지네이션 시작 숫자
 * @param {number} to - 페이지네이션 종료 숫자
 * @param {boolean} isPagenationed - 페이지네이션 여부
 * @returns {Promise<Object>} - 쿼리
 */
export const fetchInquiries = async (from = 0, to = 9, isPagenationed = true) => {
  try {
    // 데이터 총 개수 확인
    const { 
      count: totalSize, 
      error: countError 
    } = await supabaseClient.from("inquiries").select('*', { count: 'exact', head: true })

    if (countError) {
      console.error(countError);
      return;
    }

    let query = supabaseClient
      .from("inquiries")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })

    if (isPagenationed && to < totalSize) {
      query = query.range(from, to)
    } else if (to >= totalSize) {
      // 페이지네이션이 필요 없을 때는 전체 데이터를 가져옴
      query = query.range(0, totalSize - 1)
    }

    const { data, error, count } = await query

    if (error) throw error

    return { success: true, data, count }
  } catch (error) {
    console.error("Error fetching inquiries:", error)
    return { success: false, error }
  }
}

/**
 * 특정 조건의 문의를 삭제할 수 있는 함수
 * @param {string} status - 삭제할 문의의 상태 (예: 'resolved', 'pending')
 * @returns {Promise<Object>} - 삭제 결과
 */
export const deleteInquiriesByStatus = async (status) => {
  try {
    const { data, error } = await supabaseClient
      .from("inquiries")
      .delete()
      .eq("status", status)
      .select()

    if (error) throw error
    return { success: true, data }
  } catch (error) {
    console.error("Error deleting inquiries by status:", error)
    return { success: false, error }
  }
}

/**
 * 특정 ID의 문의를 삭제하는 함수
 * @param {number} id - 삭제할 문의의 ID
 * @returns {Promise<Object>} - 삭제 결과
  */
export const deleteInquiryById = async (id) => {
  try {
    const { data, error } = await supabaseClient
      .from("inquiries")
      .delete()
      .eq("id", id)
      .select()
    if (error) throw error
    return { success: true, data }
  } catch (error) {
    console.error("Error deleting inquiry by ID:", error)
    return { success: false, error }
    }
  }

  /**
   * 특정 ID의 문의 상태를 업데이트하는 함수
   * @param {number} id - 업데이트할 문의의 ID
   * @param {Object} updates - 업데이트할 필드와 값의 객체 (예: { status: 'resolved', response: 'Your issue has been resolved.' })
   */
  export const updateInquiryStatusById = async (id, newStatus) => {
    try {
      // newStatus 구조
      // {status: (status), updated_at: (updated_at), admin_response: (response), responded_at: (responded_at)}

      const { data, error } = await supabaseClient
        .from("inquiries")
        .update({ 
          status: newStatus.status, 
          response: newStatus.admin_response || null, 
          updated_at: newStatus.updated_at || null, 
          responded_at: newStatus.responded_at || null 
        })
        .eq("id", id)
        .select()

    if (error) throw error
    return { success: true, data }
  } catch (error) {
    console.error("Error updating inquiry status by ID:", error)
    return { success: false, error }
  }
}