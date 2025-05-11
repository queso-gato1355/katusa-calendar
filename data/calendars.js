import { supabaseClient } from "@/lib/supabaseClient"

// 캘린더 데이터를 Supabase에서 가져오는 함수
export async function fetchCalendarsFromSupabase() {
  try {
    const { data, error } = await supabaseClient.from("calendars").select("*").order("id")

    if (error) throw error

    return data || []
  } catch (error) {
    console.error("Error fetching calendars from Supabase:", error)
    return []
  }
}

// 기본 캘린더 데이터 (Supabase 연결 실패 시 폴백용)
export const calendarsData = [
  {
    id: "basic",
    title: "카투사 기본",
    description: "모든 카투사에게 필요한 기본 일정 (훈련, 중요 행사 등)",
    link: "/api/calendar/basic.ics", // 프록시 API 경로로 변경
    type: "basic",
  },
  {
    id: "kta",
    title: "KTA 입소/수료일정",
    description: "KTA 입소 및 수료 관련 일정",
    link: "/api/calendar/kta.ics", // 프록시 API 경로로 변경
    type: "kta",
  },
  {
    id: "korean-holiday",
    title: "한국 휴일",
    description: "한국의 모든 공휴일 정보",
    link: "/api/calendar/korean-holiday.ics", // 프록시 API 경로로 변경
    type: "korean-holiday",
  },
  {
    id: "korean-army",
    title: "한국 육군 휴일",
    description: "한국 육군 관련 휴일 및 기념일",
    link: "/api/calendar/korean-army.ics", // 프록시 API 경로로 변경
    type: "korean-army",
  },
  {
    id: "us-holiday",
    title: "미군 휴일",
    description: "미군 기념일 및 휴일 정보",
    link: "/api/calendar/us-holiday.ics", // 프록시 API 경로로 변경
    type: "us-holiday",
  },
]

// 언어에 따른 캘린더 데이터 가져오기
export const getCalendarsByLanguage = async (language) => {
  try {
    // Supabase에서 캘린더 데이터 가져오기
    const supabaseCalendars = await fetchCalendarsFromSupabase()

    // Supabase에서 데이터를 가져오는데 성공한 경우
    if (supabaseCalendars && supabaseCalendars.length > 0) {
      return supabaseCalendars
    }

    // 실패한 경우 기본 데이터 반환
    return calendarsData
  } catch (error) {
    console.error("Error in getCalendarsByLanguage:", error)
    return calendarsData
  }
}
