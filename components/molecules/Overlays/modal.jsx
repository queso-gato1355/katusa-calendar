"use client"

import { X } from "lucide-react"
import { useEffect } from "react"

export function Modal({ isOpen, onClose, title, children, theme = "light", maxWidth = "md" }) {
  // 모달이 열릴 때 body 스크롤 방지
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }

    // 컴포넌트 언마운트 시 정리
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  if (!isOpen) return null

  const maxWidthClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
    "3xl": "max-w-3xl",
    "4xl": "max-w-4xl",
    "5xl": "max-w-5xl",
    full: "max-w-full",
  }

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto"
      onClick={handleBackdropClick}
    >
      <div
        className={`w-full ${maxWidthClasses[maxWidth]} rounded-lg ${
          theme === "dark" ? "bg-gray-900 border border-gray-700" : "bg-white border border-gray-200"
        } shadow-xl max-h-[90vh] overflow-y-auto my-8`}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className={`flex items-center justify-between p-4 border-b ${
            theme === "dark" ? "border-gray-700" : "border-gray-200"
          } sticky top-0 bg-inherit z-10`}
        >
          <h2 className="text-lg font-medium">{title}</h2>
          <button
            onClick={onClose}
            className={`p-1 rounded-full transition-colors ${
              theme === "dark" ? "hover:bg-gray-800" : "hover:bg-gray-100"
            }`}
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </div>
  )
}
