"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import { getDefaultLanguage } from "@/lib/constants/languages"

interface LanguageContextType {
  language: string
  setLanguage: (language: string, autoReload?: boolean) => void
  isClient: boolean
  supportedLanguages: string[]
  isChangingLanguage: boolean
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState(getDefaultLanguage().code)
  const [isClient, setIsClient] = useState(false)
  const [isChangingLanguage, setIsChangingLanguage] = useState(false)
  
  const supportedLanguages = ["ko", "en", "es"]

  useEffect(() => {
    setIsClient(true)

    // 저장된 언어 설정 확인
    const savedLanguage = localStorage.getItem("language")
    if (savedLanguage && supportedLanguages.includes(savedLanguage)) {
      setLanguageState(savedLanguage)
    } else {
      // 브라우저 언어 감지
      const browserLang = navigator.language.split("-")[0]
      if (supportedLanguages.includes(browserLang)) {
        setLanguageState(browserLang)
        localStorage.setItem("language", browserLang)
      }
    }
  }, [])

  const setLanguage = (newLanguage: string, autoReload: boolean = false) => {
    if (supportedLanguages.includes(newLanguage) && newLanguage !== language) {
      setIsChangingLanguage(true)
      
      if (isClient) {
        localStorage.setItem("language", newLanguage)
        
        if (autoReload) {
          // 페이지 리로드 방식
          setTimeout(() => {
            window.location.reload()
          }, 300)
        } else {
          // 부드러운 전환 방식
          setTimeout(() => {
            setLanguageState(newLanguage)
            setTimeout(() => {
              setIsChangingLanguage(false)
            }, 100) // 텍스트 변경 후 로딩 상태 해제
          }, 200) // 약간의 딜레이로 자연스러운 효과
        }
      }
    }
  }

  return (
    <LanguageContext.Provider 
      value={{ 
        language, 
        setLanguage, 
        isClient,
        supportedLanguages,
        isChangingLanguage
      }}
    >
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}

// 편의를 위한 추가 훅들
export function useTranslation(section: string) {
  const { language } = useLanguage()
  const { getTranslation } = require("@/lib/constants/translations")
  return getTranslation(section, language)
}
