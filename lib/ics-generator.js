/**
 * 이벤트 데이터를 ICS 형식으로 변환하는 유틸리티
 */

import { DateTime } from "luxon"

// 날짜를 ICS 형식으로 변환 (YYYYMMDDTHHMMSS)
// UTC에서 서울 시간대로 변환
const formatDateToICS = (date) => {
  const formatedDate = DateTime.fromJSDate(new Date(date), { zone: "UTC" })
    .setZone("Asia/Seoul")
    .toFormat("yyyyMMdd'T'HHmmss")

  return `${formatedDate}`
}

// 날짜만 ICS 형식으로 변환 (YYYYMMDD)
const formatDateToICSDateOnly = (date) => {
  const formatedDate = DateTime.fromJSDate(new Date(date), { zone: "UTC" }).setZone("Asia/Seoul").toFormat("yyyyMMdd")

  return `${formatedDate}`
}

// 이벤트 배열을 ICS 문자열로 변환
export const generateICS = (events, calendarName, timezone = "Asia/Seoul") => {
  let icsContent = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//KATUSA Calendar//KR",
    `X-WR-CALNAME:${calendarName}`,
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
  ]

  events.forEach((event) => {
    const now = formatDateToICS(new Date())
    const uid = `${event.id}@katusacalendar.com`
    let dtstart, dtend

    // 시간대 명시
    if (event.all_day) {
      // 종일이벤트의 경우 입력된 날짜 그대로 사용
      const startDate = formatDateToICSDateOnly(event.start_at)
      const endDate = formatDateToICSDateOnly(event.end_at)

      dtstart = `DTSTART;TZID=${timezone};VALUE=DATE:${startDate}`
      dtend = `DTEND;TZID=${timezone};VALUE=DATE:${endDate}`
    } else {
      const startDate = formatDateToICS(event.start_at)
      const endDate = formatDateToICS(event.end_at)

      dtstart = `DTSTART;TZID=${timezone}:${startDate}`
      dtend = `DTEND;TZID=${timezone}:${endDate}`
    }

    icsContent = icsContent.concat([
      "BEGIN:VEVENT",
      `UID:${uid}`,
      `DTSTAMP:${now}Z`,
      dtstart,
      dtend,
      `SUMMARY:${event.title}`,
    ])

    if (event.description) {
      icsContent.push(`DESCRIPTION:${event.description.replace(/\n/g, "\\n")}`)
    }

    if (event.location) {
      icsContent.push(`LOCATION:${event.location}`)
    }

    icsContent.push("END:VEVENT")
  })

  icsContent.push("END:VCALENDAR")
  console.log(icsContent.join("\r\n"))
  return icsContent.join("\r\n")
}

// 특정 카테고리의 이벤트를 ICS 파일로 생성
export const generateCalendarICS = async (supabase, category, calendarName) => {
  try {
    // 활성화된(삭제되지 않은) 이벤트만 가져오기
    const { data: events, error } = await supabase
      .from("events")
      .select("*")
      .eq("category", category)
      .eq("is_disabled", false)
      .order("start_at", { ascending: true })

    if (error) throw error

    // ICS 문자열 생성
    const icsContent = generateICS(events, calendarName)

    return icsContent
  } catch (error) {
    console.error(`Error generating ICS for ${category}:`, error)
    throw error
  }
}
