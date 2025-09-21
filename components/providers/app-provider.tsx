"use client"

import React from "react"
import { ThemeProvider } from "./theme-provider"
import { LanguageProvider } from "./language-provider"
import { useTheme } from "next-themes"
import { useLanguage } from "./language-provider"

/**
 * 전체 앱의 Context Providers를 통합 관리하는 컴포넌트
 * - ThemeProvider: 다크/라이트 테마 관리
 * - LanguageProvider: 다국어 지원 관리
 */
export function AppProvider({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <LanguageProvider>
        {children}
      </LanguageProvider>
    </ThemeProvider>
  )
}

// 편의를 위한 통합 훅
export function useAppContext() {
  const theme = useTheme()
  const language = useLanguage()

  return {
    ...theme,
    ...language,
  }
}
