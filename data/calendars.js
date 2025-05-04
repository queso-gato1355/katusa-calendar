// 캘린더 데이터 수정 - 다국어 지원 추가
// 각 links는 supabase에 저장된 링크로 대체해야 함(calendars table의 link 컬럼)
export const calendarsData = [
  {
    id: "basic",
    title: "카투사 기본",
    description: "모든 카투사에게 필요한 기본 일정 (훈련, 중요 행사 등)",
    link: "https://example.com/katusa-basic.ics",
    type: "basic",
  },
  {
    id: "kta",
    title: "KTA 입소/수료일정",
    description: "KTA 입소 및 수료 관련 일정",
    link: "https://example.com/katusa-kta.ics",
    type: "kta",
  },
  {
    id: "korean-holiday",
    title: "한국 휴일",
    description: "한국의 모든 공휴일 정보",
    link: "https://example.com/korean-holidays.ics",
    type: "korean-holiday",
  },
  {
    id: "korean-army",
    title: "한국 육군 휴일",
    description: "한국 육군 관련 휴일 및 기념일",
    link: "https://example.com/korean-army-holidays.ics",
    type: "korean-army",
  },
  {
    id: "us-holiday",
    title: "미군 휴일",
    description: "미군 기념일 및 휴일 정보",
    link: "https://example.com/us-military-holidays.ics",
    type: "us-holiday",
  },
]

// 언어에 따른 캘린더 데이터 가져오기
export const getCalendarsByLanguage = (language) => {
  // Since we're now using the original array structure, just return it
  return calendarsData
}
