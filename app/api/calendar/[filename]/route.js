import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabaseAdmin"

export async function GET(request, context) {
  try {
    const { params } = await context
    const { filename } = await params

    // 파일명에서 캘린더 ID 추출 (예: basic.ics -> basic)
    const calendarId = filename.replace(".ics", "")

    // 캘린더 정보 조회
    const { data: calendar, error: calendarError } = await supabaseAdmin
      .from("calendars")
      .select("*")
      .eq("id", calendarId)
      .single()

    if (calendarError || !calendar) {
      console.error("Calendar not found:", calendarError)
      return NextResponse.json({ error: "Calendar not found" }, { status: 404 })
    }

    // 캘린더가 비활성화된 경우
    if (calendar.is_active === false) {
      return NextResponse.json({ error: "Calendar is currently disabled" }, { status: 403 })
    }

    // storage_path가 없는 경우 기본값 설정
    const storagePath = calendar.storage_path || `calendars/${calendarId}.ics`

    // Supabase Storage에서 ICS 파일 다운로드
    const { data: fileData, error: fileError } = await supabaseAdmin.storage
      .from("calendars") // 버킷 이름
      .download(storagePath.replace("calendars/", "")) // 'calendars/' 접두사 제거

    if (fileError) {
      console.error("Error downloading file:", fileError)
      return NextResponse.json({ error: "Error downloading calendar file" }, { status: 500 })
    }

    // 파일 내용을 텍스트로 변환
    const icsContent = await fileData.text()

    // 적절한 헤더와 함께 응답 반환
    return new NextResponse(icsContent, {
      headers: {
        "Content-Type": "text/calendar; charset=utf-8",
        "Content-Disposition": "inline",
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    })
  } catch (error) {
    console.error("Error serving calendar file:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
