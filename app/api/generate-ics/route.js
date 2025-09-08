import { NextResponse } from "next/server"
import { generateCalendarICS } from "@/lib/ics-generator"
import { supabaseServer } from "@/lib/api/supabase/server"
import { uploadToStorage } from "@/lib/api/supabase/storage"

// Supabase 클라이언트 생성 (서버 측)
const supabase = supabaseServer

export async function GET(request) {
  try {
    // 인증 토큰 확인 (실제 환경에서는 더 강력한 인증 필요)
    const authHeader = request.headers.get("authorization")
    if (!authHeader || authHeader !== `Bearer ${process.env.NEXT_PUBLIC_CRON_SECRET}`) {
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

        // storage_path가 없는 경우 기본값 설정
        const storagePath = calendar.storage_path || `${calendar.id}.ics`

        // 실제 저장 경로 (calendars/ 접두사 제거)
        const actualStoragePath = storagePath.replace("calendars/", "")

        // Supabase Storage에 ICS 파일 저장
        const { data: storageData, error: storageError } = await uploadToStorage(
          "calendars",
          actualStoragePath,
          icsContent,
          {
            contentType: "text/calendar",
            upsert: true,
          },
        )

        if (storageData) {
          console.log("File uploaded successfully:", storageData)
        }

        if (storageError) throw storageError

        // 프록시 경로 설정
        const proxyPath = `/api/calendar/${fileName}`

        // 캘린더 테이블 업데이트
        const { error: updateError } = await supabase
          .from("calendars")
          .update({
            proxy_path: proxyPath,
            storage_path: storagePath,
            updated_at: new Date().toISOString(),
          })
          .eq("id", calendar.id)

        if (updateError) throw updateError

        console.log(`Calendar ${calendar.id} updated successfully`)

        results.push({
          calendar: calendar.id,
          status: "success",
          proxy_path: proxyPath,
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
