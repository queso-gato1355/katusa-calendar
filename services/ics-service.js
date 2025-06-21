import { supabaseClient } from "@/lib/supabaseClient"
import toast from "react-hot-toast"

/**
 * ICS 파일 재생성 서비스
 */
export const regenerateICSFiles = async () => {
  try {
    const supabase = supabaseClient

    // CRON 시크릿 가져오기
    const { data: settingsData } = await supabase
      .from("site_settings")
      .select("value")
      .eq("key", "cron_secret")
      .single()

    const cronSecret = settingsData?.value || process.env.NEXT_PUBLIC_CRON_SECRET || "default-secret"

    // ICS 파일 재생성 API 호출
    const response = await fetch("/api/generate-ics", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${cronSecret}`,
      },
    })

    if (!response.ok) {
      throw new Error("ICS 파일 재생성에 실패했습니다.")
    }

    toast.success("ICS 파일이 재생성되었습니다.")
    return true
  } catch (error) {
    console.error("Error regenerating ICS files:", error)
    toast.error("ICS 파일 재생성 중 오류가 발생했습니다.")
    return false
  }
}
