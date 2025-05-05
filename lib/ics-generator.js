/**
 * 이벤트 데이터를 ICS 형식으로 변환하는 유틸리티
 */

// 날짜를 ICS 형식으로 변환 (YYYYMMDDTHHMMSSZ)
const formatDateToICS = (date) => {
  const d = new Date(date)
  const year = d.getUTCFullYear()
  const month = String(d.getUTCMonth() + 1).padStart(2, "0")
  const day = String(d.getUTCDate()).padStart(2, "0")
  const hours = String(d.getUTCHours()).padStart(2, "0")
  const minutes = String(d.getUTCMinutes()).padStart(2, "0")
  const seconds = String(d.getUTCSeconds()).padStart(2, "0")

  return `${year}${month}${day}T${hours}${minutes}${seconds}Z`
}

// 날짜만 ICS 형식으로 변환 (YYYYMMDD)
const formatDateToICSDateOnly = (date) => {
  const d = new Date(date);
  const year = d.getUTCFullYear();
  const month = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");

  return `${year}${month}${day}`;
};

// 이벤트 배열을 ICS 문자열로 변환
export const generateICS = (events, calendarName) => {
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
    let dtstart, dtend;

    if (event.all_day) {
      const startDate = formatDateToICSDateOnly(event.start_at);
      const endDate = formatDateToICSDateOnly(event.end_at);
    
      dtstart = `DTSTART;VALUE=DATE:${startDate}`;
      dtend = `DTEND;VALUE=DATE:${endDate}`;
    } else {
      const startDate = formatDateToICS(event.start_at);
      const endDate = formatDateToICS(event.end_at);
    
      dtstart = `DTSTART:${startDate}`;
      dtend = `DTEND:${endDate}`;
    }

    icsContent = icsContent.concat([
      "BEGIN:VEVENT",
      `UID:${uid}`,
      `DTSTAMP:${now}`,
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
