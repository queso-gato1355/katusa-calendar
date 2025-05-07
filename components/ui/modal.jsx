"use client"

import { X } from "lucide-react"

export function Modal({ isOpen, onClose, title, children, theme = "light", maxWidth = "md" }) {
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4 overflow-y-auto">
      <div
        className={`w-full ${maxWidthClasses[maxWidth]} rounded-lg ${
          theme === "dark" ? "bg-gray-900" : "bg-white"
        } shadow-xl max-h-[90vh] overflow-y-auto`}
      >
        <div className="flex items-center justify-between p-4 border-b border-inherit sticky top-0 bg-inherit z-10">
          <h2 className="text-lg font-medium">{title}</h2>
          <button
            onClick={onClose}
            className={`p-1 rounded-full ${theme === "dark" ? "hover:bg-gray-800" : "hover:bg-gray-100"}`}
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
