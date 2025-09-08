"use client"

import { AdminLayout } from "@/components/templates"
import { usePathname } from "next/navigation"

const getTitleFromPath = (pathname) => {
  const titles = {
    '/admin': '관리자 대시보드',
    '/admin/users': '사용자 관리',
    '/admin/calendar-input': '캘린더 입력',
    '/admin/inquiries': '문의 관리',
    '/admin/settings': '설정',
    '/admin/trash': '휴지통'
  }
  const description = {
    '/admin': '관리자 대시보드',
    '/admin/users': '사용자 계정을 관리합니다.',
    '/admin/calendar-input': '캘린더 이벤트를 입력하고 관리할 수 있습니다.',
    '/admin/inquiries': '사용자 문의를 관리합니다.',
    '/admin/settings': '캘린더 설정을 관리합니다.',
    '/admin/trash': '삭제된 일정을 복원하거나 영구 삭제합니다.'
  }
  return {title: titles[pathname] || '관리자', description: description[pathname] || '관리자 대시보드'}
}

export default function AdminRootLayout({ children }) {
  const pathname = usePathname()
  const { title, description } = getTitleFromPath(pathname)

  // TODO: TOO MANY RERENDERS - 원인 파악 필요
  return <AdminLayout title={title} description={description} pathname={pathname}>{children}</AdminLayout>
}