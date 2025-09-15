"use client"

import { CalendarView } from "@/components/organisms/Calendar"
import { useTranslation } from "@/components/providers/language-provider"

export default function CalendarPage() {
  const text = useTranslation("calendarPage")

  return (
    <div className="min-h-screen container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">{text.title}</h1>
      <p className="mb-6">{text.subtitle}</p>
      <CalendarView />
    </div>
  )
}
