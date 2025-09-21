"use client"

import { Plus } from "lucide-react"

export default function AddButton({ onClick, theme, aria_label="일정 추가" }) {
  return (
    <button
      onClick={onClick}
      className={`fixed md:bottom-8 md:right-8 bottom-4 right-1/2 transform md:translate-x-0 translate-x-1/2 p-4 rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
        theme === "dark" ? "focus:ring-offset-gray-900" : "focus:ring-offset-white"
      }`}
      aria-label={aria_label}
    >
      <Plus className="h-6 w-6" />
    </button>
  )
}
