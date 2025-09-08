/**
 * 관리자 계정 목록을 가져오는 함수
 * @param {number} from - 페이지네이션 시작 숫자
 * @param {number} to - 페이지네이션 종료 숫자
 * @param {boolean} isPagenationed - 페이지네이션 여부
 * @returns {Promise<Object>} - 쿼리
 */
export const fetchAdminAccounts = async (from = 0, to = 9, isPagenationed = true) => {
  try {
    let query = supabaseClient
        .from("admin_users")
        .select(
          `
          id, 
          username, 
          nickname,
          role, 
          created_at, 
          updated_at,
          is_active,
          created_by,
          updated_by,
          creator:created_by(username, nickname),
          updater:updated_by(username, nickname)
        `,
          { count: "exact" },
        )
        .eq("is_active", true)
        .order("created_at", { ascending: false })

    if (isPagenationed) {
      query = query.range(from, to)
    }

    const { data, error, count } = await query

    if (error) throw error

    return { success: true, data, count }
  } catch (error) {
    console.error("Error fetching admin accounts:", error)
    return { success: false, error }
  }
}

/**
 * 현재 사용자 정보 가져오기
 * @param {string} sessionToken - 세션 토큰
 * @returns {Promise<Object>} - 사용자 정보
 */
export const getCurrentUser = async (sessionToken) => {
  try {
    const { data, error } = await supabaseServer.rpc("get_current_admin_user", {
      session_token: sessionToken,
    })

    if (error) throw error
    return { data: data?.[0], error: null }
  } catch (error) {
    console.error("Error getting current user:", error)
    return { data: null, error }
  }
}

/**
 * 문의를 전송하는 이메일 주소를 가져오는 함수
 * @returns {Promise<string>} - 이메일 주소
 */
export const getContactEmail = async () => {
  try {
    const { data, error } = await supabaseClient
      .from("settings")
      .select("contact_email")
      .eq("key", "contact_email")
      .single()

    if (error) throw error

    return data.contact_email || ""
  } catch (error) {
    console.error("Error fetching contact email:", error)
    return ""
  }
}

/**
 * 문의를 전송하는 이메일 주소를 변경하는 함수
 * @param {string} email - 이메일 주소
 * @returns {Promise<Object>} - 성공여부
 */
export const updateContactEmail = async (email) => {
  try {
    const { error } = await supabaseClient
      .from("settings")
      .upsert({ key: "contact_email", value: email })

    if (error) throw error

    return { success: true }
  } catch (error) {
    console.error("Error updating contact email:", error)
    return { success: false, error }
  }
}
