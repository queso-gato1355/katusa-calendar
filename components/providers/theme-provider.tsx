'use client'

import * as React from 'react'
import {
  ThemeProvider as NextThemesProvider,
  type ThemeProviderProps,
  useTheme
} from 'next-themes'

// 시스템 테마 감지 함수
function getSystemTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') {
    return 'dark' // 서버 사이드에서는 기본값
  }
  
  // 시스템 다크 모드 선호도 확인
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark'
  } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
    return 'light'
  }
  
  // 둘 다 아니면 기본값
  return 'dark'
}

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const [defaultTheme, setDefaultTheme] = React.useState<'light' | 'dark'>('dark')

  React.useEffect(() => {
    // 클라이언트에서만 시스템 테마 감지
    const systemTheme = getSystemTheme()
    setDefaultTheme(systemTheme)
  }, [])
  
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme={defaultTheme}
      themes={['light', 'dark']}
      disableTransitionOnChange
      {...props}
    >
      {children}
    </NextThemesProvider>
  )
}

// 커스텀 훅 export
export { useTheme }
