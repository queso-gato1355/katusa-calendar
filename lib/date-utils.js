/**
 * 날짜 관련 유틸리티 함수들
 */

/**
 * 요일을 한글로 반환하는 함수
 * @param {number} year - 연도
 * @param {number} month - 월 (1-12)
 * @param {number} day - 일
 * @returns {string} 요일 (일, 월, 화, 수, 목, 금, 토)
 */
export const getDayOfWeek = (year, month, day) => {
  const date = new Date(year, month - 1, day)
  const days = ["일", "월", "화", "수", "목", "금", "토"]
  return days[date.getDay()]
}

/**
 * 날짜 포맷팅 함수
 * @param {string|Date} dateString - 날짜 문자열 또는 Date 객체
 * @param {string} language - 언어 코드
 * @param {object} options - 포맷 옵션
 * @returns {string} 포맷된 날짜 문자열
 */
export const formatDate = (dateString, language = "ko", options = {}) => {
  const date = new Date(dateString)
  return date.toLocaleDateString(getLocale(language), {
    year: "numeric",
    month: "long",
    day: "numeric",
    ...options,
  })
}

/**
 * 시간 포맷팅 함수
 * @param {string|Date} dateString - 날짜 문자열 또는 Date 객체
 * @param {string} language - 언어 코드
 * @returns {string} 포맷된 시간 문자열
 */
export const formatTime = (dateString, language = "ko") => {
  const date = new Date(dateString)
  return date.toLocaleTimeString(getLocale(language), {
    hour: "2-digit",
    minute: "2-digit",
  })
}

/**
 * 언어에 따른 로케일 반환
 * @param {string} lang - 언어 코드
 * @returns {string} 로케일 문자열
 */
export const getLocale = (lang) => {
  switch (lang) {
    case "ko":
      return "ko-KR"
    case "en":
      return "en-US"
    case "es":
      return "es-ES"
    default:
      return "ko-KR"
  }
}

/**
 * 연도 옵션 배열 생성
 * @param {number} range - 현재 연도 기준 앞뒤 범위
 * @returns {number[]} 연도 배열
 */
export const generateYearOptions = (range = 5) => {
  const currentYear = new Date().getFullYear()
  return Array.from({ length: range * 2 + 1 }, (_, i) => currentYear - range + i)
}

/**
 * 날짜가 오늘인지 확인
 * @param {Date} date - 확인할 날짜
 * @returns {boolean} 오늘 여부
 */
export const isToday = (date) => {
  const today = new Date()
  return (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
  )
}

/**
 * 두 날짜가 같은 날인지 확인
 * @param {Date} date1 - 첫 번째 날짜
 * @param {Date} date2 - 두 번째 날짜
 * @returns {boolean} 같은 날 여부
 */
export const isSameDay = (date1, date2) => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  )
}
