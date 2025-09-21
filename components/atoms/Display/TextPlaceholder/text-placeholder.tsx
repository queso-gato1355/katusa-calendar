"use client"

import React from "react"
import { useLanguage } from "@/components/providers/language-provider"

interface TextPlaceholderProps {
  children: React.ReactNode
  placeholder?: string
  className?: string
  duration?: number
  partial?: boolean
}

/**
 * 언어 변경 중 부드러운 placeholder 효과를 제공하는 컴포넌트
 */
export function TextPlaceholder({ 
  children, 
  placeholder,
  className = "",
  duration = 2000,
  partial = false
}: TextPlaceholderProps) {
  const { isChangingLanguage } = useLanguage()

  // partial은 전체 텍스트가 있을 때 부분만 placeholder로 대체하고 싶을 때
  // 줄내림 없이 그 부분만 placeholder가 배치되도록 할 때 true로 flag한다.
  if (isChangingLanguage && !partial) {
    return (
      <div 
        className={`animate-pulse transition-all duration-${duration} ${className}`}
        style={{ animationDuration: `${duration}ms` }}
      >
        {placeholder ? (
          <span className="bg-gray-300 dark:bg-gray-600 text-transparent rounded">
            {placeholder}
          </span>
        ) : (
          <div className="bg-gray-300 dark:bg-gray-600 rounded h-4 w-full"></div>
        )}
      </div>
    )
  }

  if (isChangingLanguage && partial) {
    return (
      <span 
        className={`inline-block animate-pulse transition-all duration-${duration} ${className}`}
        style={{ animationDuration: `${duration}ms` }}
      >
        {placeholder ? (
            <span className="bg-gray-300 dark:bg-gray-600 text-transparent rounded">
                {placeholder}
            </span>
        ) : (
            <span className="bg-gray-300 dark:bg-gray-600 rounded h-4 inline-block align-middle" style={{width: '1em'}}></span>
        )}
      </span>
    )
  }

  return (
    <div className={`transition-all duration-${duration} ${className}`}>
      {children}
    </div>
  )
}

/**
 * 텍스트용 간편한 placeholder 훅
 */
export function useTextWithPlaceholder(text: string, placeholder?: string) {
  const { isChangingLanguage } = useLanguage()
  
  if (isChangingLanguage && placeholder) {
    return placeholder
  }
  
  return text
}

/**
 * 버튼이나 링크용 placeholder 컴포넌트
 */
export function ButtonPlaceholder({ 
  children, 
  className = "",
  disabled = false
}: { 
  children: React.ReactNode
  className?: string
  disabled?: boolean
}) {
  const { isChangingLanguage } = useLanguage()

  return (
    <div className={`transition-all duration-200 ${className}`}>
      <div className={`${isChangingLanguage ? 'opacity-60 pointer-events-none' : ''}`}>
        {children}
      </div>
      {isChangingLanguage && (
        <div className="absolute inset-0 bg-muted/20 animate-pulse rounded" />
      )}
    </div>
  )
}
