import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { generateCalendarICS } from "@/lib/ics-generator"

// Supabase 클라이언트 생성 (서버 측)
const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const supabase = createClient(supabaseUrl, supabaseServiceKey)

export async function GET(request) {
  try {
    // 인증 토큰 확인 (실제 환경에서는 더 강력한 인증 필요)
    const authHeader = request.headers.get("authorization")
    if (!authHeader || authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // 모든 캘린더 정보 가져오기
    const { data: calendars, error: calendarError } = await supabase.from("calendars").select("*")

    if (calendarError) {
      throw calendarError
    }

    const results = []

    // 각 캘린더 유형별로 ICS 파일 생성
    for (const calendar of calendars) {
      try {
        // ICS 콘텐츠 생성
        const icsContent = await generateCalendarICS(supabase, calendar.type, calendar.title)

        // 파일 이름 생성 (예: basic.ics, kta.ics 등)
        const fileName = `${calendar.id}.ics`

        // Supabase Storage에 ICS 파일 저장
        const { error: uploadError } = await supabase.storage.from("calendars").upload(fileName, icsContent, {
          contentType: "text/calendar",
          upsert: true,
        })

        if (uploadError) throw uploadError

        // 공개 URL 가져오기
        const { data: publicUrlData } = supabase.storage.from("calendars").getPublicUrl(fileName)

        // 캘린더 테이블의 링크 업데이트
        const { error: updateError } = await supabase
          .from("calendars")
          .update({ link: publicUrlData.publicUrl })
          .eq("id", calendar.id)

        if (updateError) throw updateError

        results.push({
          calendar: calendar.id,
          status: "success",
          url: publicUrlData.publicUrl,
        })
      } catch (error) {
        console.error(`Error processing calendar ${calendar.id}:`, error)
        results.push({
          calendar: calendar.id,
          status: "error",
          message: error.message,
        })
      }
    }

    return NextResponse.json({
      success: true,
      message: "ICS files generated and stored successfully",
      results,
    })
  } catch (error) {
    console.error("Error generating ICS files:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
