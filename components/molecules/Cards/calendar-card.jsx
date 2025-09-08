"use client"

import { Copy, Check, Download } from "lucide-react"

export default function CalendarCard({
  theme,
  calendar,
  copied,
  copyToClipboard,
  downloadICSFile,
  isActive,
  text,
}) {
  // 현재 언어에 맞는 캘린더 제목과 설명 가져오기
  const calendarTranslation = text.calendarItems && text.calendarItems[calendar.id]
  const title = calendarTranslation ? calendarTranslation.title : calendar.title
  const description = calendarTranslation ? calendarTranslation.description : calendar.description

  return (
    <div
      className={`rounded-lg border ${
        theme === "dark" ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200"
      } shadow-sm flex flex-col md:h-[220px] lg:h-[240px]`}
    >
      <div className="flex flex-col space-y-1.5 p-6 flex-grow">
        <h3 className="text-2xl font-semibold leading-none tracking-tight">{title}</h3>
        <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>{description}</p>
      </div>
      <div className="p-6 pt-0 mt-auto space-y-2">
        <button
          className={`w-full h-10 px-4 py-2 rounded-md flex items-center justify-center text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
            isActive
              ? theme === "dark"
                ? "bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-500"
                : "bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-500"
              : theme === "dark"
                ? "bg-gray-700 text-gray-300 cursor-not-allowed"
                : "bg-gray-200 text-gray-500 cursor-not-allowed"
          }`}
          onClick={() => copyToClipboard(calendar.link, calendar.id)}
          disabled={!isActive}
        >
          {isActive ? (
            copied[calendar.id] ? (
              <Check className="mr-2 h-4 w-4" />
            ) : (
              <Copy className="mr-2 h-4 w-4" />
            )
          ) : null}
          {isActive ? text.copyButton : text.maintenanceButton}
        </button>

        {/* 다운로드 버튼 - 활성화된 캘린더만 표시 */}
        {isActive && (
          <button
            className={`w-full h-10 px-4 py-2 rounded-md flex items-center justify-center text-sm font-medium transition-colors border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
              theme === "dark"
                ? "bg-gray-800 text-white hover:bg-gray-700 border-gray-700 focus-visible:ring-gray-500"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-300 focus-visible:ring-gray-400"
            }`}
            onClick={() => downloadICSFile(calendar.link, calendar.id, title)}
          >
            <Download className="mr-2 h-4 w-4" />
            {text.downloadButton || "ICS 파일 다운로드"}
          </button>
        )}
      </div>
    </div>
  )
}
