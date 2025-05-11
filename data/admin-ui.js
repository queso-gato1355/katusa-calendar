// 관리자 UI 관련 데이터를 모아둔 파일입니다.
import { Calendar, Trash2, Settings, Users, FileText } from "lucide-react"

// 사이드바 메뉴 항목
export const sidebarMenuItems = [
  {
    section: "캘린더 입력",
    items: [
      {
        id: "calendar-input",
        title: "캘린더 입력",
        icon: FileText,
        href: "/admin/calendar-input",
      },
    ],
  },
  {
    section: "캘린더 관리",
    items: [
      {
        id: "basic",
        title: "카투사 기본",
        icon: Calendar,
        href: "/admin?calendar=basic",
      },
      {
        id: "kta",
        title: "KTA 입소/수료일정",
        icon: Calendar,
        href: "/admin?calendar=kta",
      },
      {
        id: "korean-holiday",
        title: "한국 휴일",
        icon: Calendar,
        href: "/admin?calendar=korean-holiday",
      },
      {
        id: "korean-army",
        title: "한국 육군 휴일",
        icon: Calendar,
        href: "/admin?calendar=korean-army",
      },
      {
        id: "us-holiday",
        title: "미군 휴일",
        icon: Calendar,
        href: "/admin?calendar=us-holiday",
      },
    ],
  },
  {
    section: "관리",
    items: [
      {
        id: "trash",
        title: "휴지통",
        icon: Trash2,
        href: "/admin/trash",
      },
      {
        id: "settings",
        title: "설정",
        icon: Settings,
        href: "/admin/settings",
      },
      {
        id: "users",
        title: "관리자 계정",
        icon: Users,
        href: "/admin/users",
        requireSuperAdmin: true,
      },
    ],
  },
]

// 페이지당 항목 수 옵션
export const perPageOptions = [5, 10, 20, 50]

// 이벤트 카테고리별 색상
export const eventCategoryColors = {
  basic: "bg-blue-500 border-blue-600",
  kta: "bg-purple-500 border-purple-600",
  "korean-holiday": "bg-red-500 border-red-600",
  "korean-army": "bg-green-500 border-green-600",
  "us-holiday": "bg-yellow-500 border-yellow-600",
  default: "bg-gray-500 border-gray-600",
}

// 문의 유형 옵션
export const inquiryTypes = [
  { value: "general", label: "일반 문의" },
  { value: "calendar", label: "캘린더 추가 요청" },
  { value: "bug", label: "오류 신고" },
  { value: "feature", label: "기능 제안" },
  { value: "other", label: "기타" },
]

// 관리자 역할 옵션
export const adminRoles = [
  { value: "admin", label: "일반 관리자" },
  { value: "super_admin", label: "슈퍼 관리자" },
]

// 테마 스타일 (공통)
export const getThemeStyles = (theme) => ({
  container: theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900",
  card: theme === "dark" ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200",
  input: theme === "dark" ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-300 text-gray-900",
  button: {
    primary: theme === "dark" ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-blue-600 text-white hover:bg-blue-700",
    secondary:
      theme === "dark" ? "bg-gray-700 text-white hover:bg-gray-600" : "bg-gray-200 text-gray-800 hover:bg-gray-300",
    danger: theme === "dark" ? "bg-red-600 text-white hover:bg-red-700" : "bg-red-600 text-white hover:bg-red-700",
  },
  hover: theme === "dark" ? "hover:bg-gray-800" : "hover:bg-gray-100",
  table: {
    header: theme === "dark" ? "bg-gray-800" : "bg-gray-50",
    row: theme === "dark" ? "hover:bg-gray-800" : "hover:bg-gray-50",
  },
})
