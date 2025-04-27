"use client"

import { useState } from "react"
import Link from "next/link"
import { Calendar, Menu, X, Trash2, Settings, ChevronRight, User } from "lucide-react"
import { calendarsData } from "@/data/calendars"

export default function Sidebar({ activeCalendar, theme }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // 임시 사용자 정보 (실제로는 인증 시스템에서 가져와야 함)
  const user = {
    name: "관리자",
  }

  return (
    <>
      {/* Mobile Menu Button - 오른쪽 상단으로 위치 변경 */}
      <div className="md:hidden fixed top-4 right-4 z-50">
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className={`p-2 rounded-md ${
            theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-gray-900"
          } shadow-md`}
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>

      {/* Desktop Sidebar */}
      <div
        className={`hidden md:flex flex-col w-64 h-screen fixed left-0 top-0 ${
          theme === "dark" ? "bg-gray-900 text-white border-gray-700" : "bg-white text-gray-900 border-gray-200"
        } border-r overflow-y-auto`}
      >
        <div className="p-4 border-b border-inherit">
          <div className="flex items-center gap-2">
            <Calendar className={`h-6 w-6 ${theme === "dark" ? "text-blue-400" : "text-blue-600"}`} />
            <span className="text-xl font-bold">KATUSA Calendar</span>
          </div>
          <div className="mt-2 text-sm text-gray-500">관리자 대시보드</div>

          {/* 사용자 정보 */}
          <div
            className={`mt-4 p-2 rounded-md flex items-center justify-between ${
              theme === "dark" ? "bg-gray-800 hover:bg-gray-700" : "bg-gray-100 hover:bg-gray-200"
            } cursor-pointer transition-colors`}
          >
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span className="text-sm font-medium">{user.name}</span>
            </div>
            <ChevronRight className="h-4 w-4" />
          </div>
        </div>

        <nav className="flex-1 p-4 overflow-y-auto">
          <div className="mb-4 text-sm font-medium text-gray-500 uppercase">캘린더 관리</div>
          <ul className="space-y-2">
            {calendarsData.map((calendar) => (
              <li key={calendar.id}>
                <Link
                  href={`/admin?calendar=${calendar.id}`}
                  className={`flex items-center px-3 py-2 rounded-md transition-colors ${
                    activeCalendar === calendar.id
                      ? theme === "dark"
                        ? "bg-blue-600 text-white"
                        : "bg-blue-100 text-blue-800"
                      : theme === "dark"
                        ? "hover:bg-gray-800"
                        : "hover:bg-gray-100"
                  }`}
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>{calendar.title}</span>
                </Link>
              </li>
            ))}

            {/* 문의 안내 카드 */}
            <li>
              <div
                className={`mt-2 p-3 rounded-md text-sm ${
                  theme === "dark" ? "bg-gray-800 border border-gray-700" : "bg-gray-50 border border-gray-200"
                }`}
              >
                <p className="font-medium mb-1">원하는 달력 종류가 있나요?</p>
                <p className="text-xs text-gray-500">문의하세요.</p>
                <Link
                  href="/contact"
                  className={`mt-2 inline-block px-3 py-1 rounded-md text-xs ${
                    theme === "dark" ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-200 hover:bg-gray-300"
                  }`}
                >
                  문의하기
                </Link>
              </div>
            </li>
          </ul>

          {/* 추가 메뉴 */}
          <div className="mt-6 mb-4 text-sm font-medium text-gray-500 uppercase">관리</div>
          <ul className="space-y-2">
            <li>
              <Link
                href="/admin/trash"
                className={`flex items-center px-3 py-2 rounded-md transition-colors ${
                  activeCalendar === "trash"
                    ? theme === "dark"
                      ? "bg-blue-600 text-white"
                      : "bg-blue-100 text-blue-800"
                    : theme === "dark"
                      ? "hover:bg-gray-800"
                      : "hover:bg-gray-100"
                }`}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                <span>휴지통</span>
              </Link>
            </li>
            <li>
              <Link
                href="/admin/settings"
                className={`flex items-center px-3 py-2 rounded-md transition-colors ${
                  activeCalendar === "settings"
                    ? theme === "dark"
                      ? "bg-blue-600 text-white"
                      : "bg-blue-100 text-blue-800"
                    : theme === "dark"
                      ? "hover:bg-gray-800"
                      : "hover:bg-gray-100"
                }`}
              >
                <Settings className="h-4 w-4 mr-2" />
                <span>설정</span>
              </Link>
            </li>
          </ul>
        </nav>

        <div className="p-4 border-t border-inherit">
          <Link
            href="/"
            className={`flex items-center px-3 py-2 rounded-md transition-colors ${
              theme === "dark" ? "hover:bg-gray-800" : "hover:bg-gray-100"
            }`}
          >
            <span>메인 페이지로 돌아가기</span>
          </Link>
        </div>
      </div>

      {/* Mobile Sidebar - 스크롤 가능하도록 수정 */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-black bg-opacity-50">
          <div
            className={`fixed inset-y-0 left-0 w-64 ${
              theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-gray-900"
            } shadow-lg overflow-y-auto`}
          >
            <div className="p-4 border-b border-inherit sticky top-0 bg-inherit z-10 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Calendar className={`h-6 w-6 ${theme === "dark" ? "text-blue-400" : "text-blue-600"}`} />
                <span className="text-xl font-bold">KATUSA Calendar</span>
              </div>
              <button onClick={() => setIsMobileMenuOpen(false)}>
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* 사용자 정보 */}
            <div className="p-4 border-b border-inherit">
              <div
                className={`p-2 rounded-md flex items-center justify-between ${
                  theme === "dark" ? "bg-gray-800 hover:bg-gray-700" : "bg-gray-100 hover:bg-gray-200"
                } cursor-pointer transition-colors`}
              >
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span className="text-sm font-medium">{user.name}</span>
                </div>
                <ChevronRight className="h-4 w-4" />
              </div>
            </div>

            <nav className="flex-1 p-4 overflow-y-auto">
              <div className="mb-4 text-sm font-medium text-gray-500 uppercase">캘린더 관리</div>
              <ul className="space-y-2">
                {calendarsData.map((calendar) => (
                  <li key={calendar.id}>
                    <Link
                      href={`/admin?calendar=${calendar.id}`}
                      className={`flex items-center px-3 py-2 rounded-md transition-colors ${
                        activeCalendar === calendar.id
                          ? theme === "dark"
                            ? "bg-blue-600 text-white"
                            : "bg-blue-100 text-blue-800"
                          : theme === "dark"
                            ? "hover:bg-gray-800"
                            : "hover:bg-gray-100"
                      }`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>{calendar.title}</span>
                    </Link>
                  </li>
                ))}

                {/* 문의 안내 카드 */}
                <li>
                  <div
                    className={`mt-2 p-3 rounded-md text-sm ${
                      theme === "dark" ? "bg-gray-800 border border-gray-700" : "bg-gray-50 border border-gray-200"
                    }`}
                  >
                    <p className="font-medium mb-1">원하는 달력 종류가 있나요?</p>
                    <p className="text-xs text-gray-500">문의하세요.</p>
                    <Link
                      href="/contact"
                      className={`mt-2 inline-block px-3 py-1 rounded-md text-xs ${
                        theme === "dark" ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-200 hover:bg-gray-300"
                      }`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      문의하기
                    </Link>
                  </div>
                </li>
              </ul>

              {/* 추가 메뉴 */}
              <div className="mt-6 mb-4 text-sm font-medium text-gray-500 uppercase">관리</div>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/admin/trash"
                    className={`flex items-center px-3 py-2 rounded-md transition-colors ${
                      activeCalendar === "trash"
                        ? theme === "dark"
                          ? "bg-blue-600 text-white"
                          : "bg-blue-100 text-blue-800"
                        : theme === "dark"
                          ? "hover:bg-gray-800"
                          : "hover:bg-gray-100"
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    <span>휴지통</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/admin/settings"
                    className={`flex items-center px-3 py-2 rounded-md transition-colors ${
                      activeCalendar === "settings"
                        ? theme === "dark"
                          ? "bg-blue-600 text-white"
                          : "bg-blue-100 text-blue-800"
                        : theme === "dark"
                          ? "hover:bg-gray-800"
                          : "hover:bg-gray-100"
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    <span>설정</span>
                  </Link>
                </li>
              </ul>
            </nav>

            <div className="p-4 border-t border-inherit">
              <Link
                href="/"
                className={`flex items-center px-3 py-2 rounded-md transition-colors ${
                  theme === "dark" ? "hover:bg-gray-800" : "hover:bg-gray-100"
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span>메인 페이지로 돌아가기</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
