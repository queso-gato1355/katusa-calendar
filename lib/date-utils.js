/**
 * 날짜 관련 유틸리티 함수들
 */

import { toZonedTime, format } from "date-fns-tz"
import { ko, enUS, es } from "date-fns/locale"

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
 * 시간대를 한국 시간대로 변환
 * @param {Date} date - 변환할 UTC 날짜
 * @return {Date} 한국 시간대로 변환된 Date 객체
 */
export const convertUTCToKST = (date) => {
  if (!date) return null
  const utcDate = new Date(date)
  if (isNaN(utcDate.getTime())) return null
  return toZonedTime(utcDate, "Asia/Seoul")
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

/**
 * 입력받은 데이터를 ISO 문자열로 변환
 * @param {string} date - 날짜 문자열 (YYYY-MM-DD)
 * @param {string} time - 시간 문자열 (HH:MM)
 */
export const toISOString = (date, time) => {
  if (!date) return null
  if (!time) time = "00:00"
  return new Date(`${date}T${time}:00`).toISOString()
}

/**
 * 날짜를 YYYY-MM-DD 형식으로 변환
 * @param {string|Date} date - 날짜 문자열 또는 Date 객체
 * @returns {string} YYYY-MM-DD 형식의 날짜 문자열
 */
export const formatDateOnly = (date) => {
  if (!date) return ""
  const d = new Date(date)
  if (isNaN(d.getTime())) return ""
  return d.toISOString().split("T")[0]
}

/**
 * 날짜를 YYYY-MM-DD 형식으로 변환 (한국 시간대로)
 * @param {string|Date} date - 날짜 문자열 또는 Date 객체
 * @returns {string} YYYY-MM-DD 형식의 날짜 문자열 (한국 시간대)
 */
export const formatLocalDateOnly = (date) => {
  if (!date) return ""
  const d = new Date(date)
  if (isNaN(d.getTime())) return ""
  const kst = toZonedTime(d, "Asia/Seoul")
  return format(kst, "yyyy-MM-dd", { locale: ko })
}

/**
 * 시간을 HH:MM 형식으로 변환
 * @param {string|Date} date - 날짜 문자열 또는 Date 객체
 * @returns {string} HH:MM 형식의 시간 문자열
 */
export const formatTimeOnly = (date) => {
  if (!date) return "09:00"
  const d = new Date(date)
  if (isNaN(d.getTime())) return "09:00"
  return d.toTimeString().slice(0, 5)
}

/**
 * 시간을 HH:MM 형식으로 변환 (한국 시간대로)
 * @param {string|Date} date - 날짜 문자열 또는 Date 객체
 * @returns {string} HH:MM 형식의 시간 문자열 (한국 시간대)
 * @example
 * const time = formatLocalTimeOnly("2023-03-15T12:00:00Z")
 * console.log(time) // "21:00"
 * @example
 * const time = formatLocalTimeOnly(new Date())
 * console.log(time) // "21:00" (현재 시간 기준)
 * @example
 * const time = formatLocalTimeOnly("2023-03-15T12:00:00Z", true)
 * console.log(time) // "00:00" (종일 일정인 경우)
 * @example
 * const time = formatLocalTimeOnly("2023-03-15T12:00:00Z", false)
 * console.log(time) // "21:00" (종일 일정이 아닌 경우)
 */
export const formatLocalTimeOnly = (date, all_day = false) => {
  if (!date) return "09:00"
  const d = new Date(date)
  if (isNaN(d.getTime())) return "09:00"

  // 종일 일정인 경우 시간은 00:00으로 설정
  if (all_day) {
    return "00:00"
  }

  const kst = toZonedTime(d, "Asia/Seoul")
  return format(kst, "HH:mm", { locale: ko })
}

/**
 * DB에서 가져온 UTC 날짜를 로컬 시간으로 변환
 * @param {string} utcDate - UTC 날짜 문자열 (ISO 형식)
 * @param {boolean} all_day - 종일 일정 여부 (기본값: false)
 * @return {string} 로컬 시간으로 변환된 날짜 문자열 (YYYY-MM-DDTHH:MM)
 * @example
 * const localDate = convertUTCToLocal("2023-03-15T12:00:00Z")
 * console.log(localDate) // "2023-03-15T21:00"
 */
export const convertUTCToLocal = (utcDate, all_day = false) => {
  const date = new Date(utcDate)
  if (isNaN(date.getTime())) return "유효하지 않은 날짜"
  // 한국 시간대로 변환
  const kst = toZonedTime(date, "Asia/Seoul")
  // 종일 일정인 경우 시간은 00:00으로 설정
  if (all_day) {
    kst.setHours(0, 0, 0, 0)
  }
  
  return format(kst, "yyyy-MM-ddTHH:mm", { locale: ko })
}
export const convertLocalToUTC = (localDate, all_day = false) => {
  const date = new Date(localDate)
  if (isNaN(date.getTime())) return "유효하지 않은 날짜"

  // 종일 일정인 경우 시간은 00:00으로 설정
  if (all_day) {
    date.setHours(0, 0, 0, 0)
  }

  return date.toISOString()
}

/**
 * 종일일정의 시작 시간(한국 시간대)을 UTC로 변환한다.
 * @param {string} localDate - 한국 시간대의 날짜 문자열 (YYYY-MM-DD HH:MM)
 * @returns {string} UTC로 변환된 날짜 문자열 (ISO 형식)
 */
export const convertAllDayToUTC = (localDate) => {
  const date = new Date(localDate)
  if (isNaN(date.getTime())) return "유효하지 않은 날짜"

  // 종일 일정은 시작 시간을 00:00으로 설정
  date.setHours(0, 0, 0, 0)

  return date.toISOString()
}

/**
 * 종일일정의 종료 시간(한국 시간대)을 UTC로 변환한다.
 * 1일을 더한다.
 * @param {string} localDate - 한국 시간대의 날짜 문자열 (YYYY-MM-DD HH:MM)
 * @returns {string} UTC로 변환된 날짜 문자열 (ISO 형식)
 */
export const convertAllDayEndToUTC = (localDate) => {
  const date = new Date(localDate)
  if (isNaN(date.getTime())) return "유효하지 않은 날짜"

  // 종일 일정은 하루를 더하여 저장
  date.setDate(date.getDate() + 1)
  date.setHours(0, 0, 0, 0)

  return date.toISOString()
}