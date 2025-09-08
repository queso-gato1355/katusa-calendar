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