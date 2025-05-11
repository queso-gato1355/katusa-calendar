import { getCalendarStatus, incrementCalendarCopyCount } from "@/lib/supabase-helpers"
import toast from "react-hot-toast"

export function useCalendarService(calendarStatus, setCalendarStatus, copied, setCopied) {
  // 캘린더 상태 가져오기
  const fetchCalendarStatus = async () => {
    try {
      const statusObj = await getCalendarStatus()
      setCalendarStatus(statusObj)
      return statusObj
    } catch (error) {
      console.error("Error fetching calendar status:", error)
      return {}
    }
  }

  // 클립보드에 복사
  const copyToClipboard = async (link, id) => {
    // 비활성화된 캘린더인 경우 복사하지 않음
    if (calendarStatus[id] && calendarStatus[id].is_active === false) {
      toast.error("현재 이 캘린더는 점검 중입니다.", {
        duration: 2000,
        position: "top-center",
      })
      return
    }

    const origin = window.location.origin
    const calendarLink = `${origin}${link}`

    try {
      await navigator.clipboard.writeText(calendarLink)
      setCopied({ ...copied, [id]: true })
      toast.success("ICS 링크가 클립보드에 복사되었습니다.", {
        duration: 2000,
        position: "top-center",
      })

      // 복사 카운트 증가
      const success = await incrementCalendarCopyCount(id)

      if (success) {
        // 로컬 상태 업데이트
        setCalendarStatus((prev) => ({
          ...prev,
          [id]: {
            ...prev[id],
            copy_count: (prev[id]?.copy_count || 0) + 1,
          },
        }))
      }
    } catch (error) {
      console.error("Error copying to clipboard:", error)
      toast.error("링크 복사 중 오류가 발생했습니다.")
    }

    setTimeout(() => setCopied({ ...copied, [id]: false }), 2000)
  }

  // ICS 파일 다운로드
  const downloadICSFile = async (link, id, title) => {
    // 비활성화된 캘린더인 경우 다운로드하지 않음
    if (calendarStatus[id] && calendarStatus[id].is_active === false) {
      toast.error("현재 이 캘린더는 점검 중입니다.", {
        duration: 2000,
        position: "top-center",
      })
      return
    }

    try {
      const origin = window.location.origin
      const calendarLink = `${origin}${link}`

      // 파일 다운로드
      const response = await fetch(calendarLink)

      if (!response.ok) {
        throw new Error("캘린더 파일을 다운로드할 수 없습니다.")
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.style.display = "none"
      a.href = url
      a.download = `${title || id}.ics`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      toast.success("ICS 파일이 다운로드되었습니다.", {
        duration: 2000,
        position: "top-center",
      })

      // 복사 카운트 증가 (다운로드도 카운트에 포함)
      const success = await incrementCalendarCopyCount(id)

      if (success) {
        // 로컬 상태 업데이트
        setCalendarStatus((prev) => ({
          ...prev,
          [id]: {
            ...prev[id],
            copy_count: (prev[id]?.copy_count || 0) + 1,
          },
        }))
      }
    } catch (error) {
      console.error("Error downloading ICS file:", error)
      toast.error("파일 다운로드 중 오류가 발생했습니다.")
    }
  }

  return {
    fetchCalendarStatus,
    copyToClipboard,
    downloadICSFile,
  }
}
