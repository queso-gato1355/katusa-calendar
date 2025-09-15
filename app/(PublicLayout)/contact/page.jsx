"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { supabaseClient } from "@/lib/api/supabase/client"
import { getTranslation } from "@/lib/constants/translations"
import { ArrowLeft, Send } from "lucide-react"
import toast from "react-hot-toast"

export default function ContactPage() {
  const router = useRouter()
  const [language, setLanguage] = useState("ko")
  const [loading, setLoading] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    type: "general",
    message: "",
  })

  const supabase = supabaseClient

  // 컴포넌트 마운트 확인
  useEffect(() => {
    setMounted(true)
  }, [])

  // 언어 설정
  useEffect(() => {
    if (mounted) {
      const savedLanguage = localStorage.getItem("language")
      if (savedLanguage) {
        setLanguage(savedLanguage)
      }
    }
  }, [mounted])

  // 현재 언어에 맞는 텍스트 가져오기
  const text = getTranslation("contact", language)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      // 문의 데이터 저장
      const { error } = await supabase.from("inquiries").insert({
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        type: formData.type,
        message: formData.message,
        created_at: new Date().toISOString(),
        status: "pending",
      })

      if (error) throw error

      toast.success(text.successMessage)

      // 폼 초기화
      setFormData({
        name: "",
        email: "",
        subject: "",
        type: "general",
        message: "",
      })

      // 3초 후 메인 페이지로 이동
      setTimeout(() => {
        router.push("/")
      }, 3000)
    } catch (error) {
      console.error("Error submitting inquiry:", error)
      toast.error(text.errorMessage)
    } finally {
      setLoading(false)
    }
  }

  // 마운트되지 않았으면 렌더링하지 않음 (hydration 불일치 방지)
  if (!mounted) {
    return null
  }

  return (
    <div className="min-h-screen text-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <Link
            href="/"
            className="inline-flex items-center mb-6 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Home
          </Link>

          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold">{text.title}</h1>
            <p className="mt-2 text-muted-foreground">{text.description}</p>
          </div>

          <div className="rounded-lg border bg-card shadow-sm p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-1">
                    {text.nameLabel} *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full rounded-md border bg-background border-border text-foreground px-3 py-2"
                    placeholder={text.namePlaceholder}
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-1">
                    {text.emailLabel} *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full rounded-md border bg-background border-border text-foreground px-3 py-2"
                    placeholder={text.emailPlaceholder}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium mb-1">
                  {text.subjectLabel} *
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full rounded-md border bg-background border-border text-foreground px-3 py-2"
                  placeholder={text.subjectPlaceholder}
                />
              </div>

              <div>
                <label htmlFor="type" className="block text-sm font-medium mb-1">
                  {text.typeLabel} *
                </label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  required
                  className="w-full rounded-md border bg-background border-border text-foreground px-3 py-2"
                >
                  <option value="general">{text.types.general}</option>
                  <option value="calendar">{text.types.calendar}</option>
                  <option value="bug">{text.types.bug}</option>
                  <option value="feature">{text.types.feature}</option>
                  <option value="other">{text.types.other}</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-1">
                  {text.messageLabel} *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full rounded-md border bg-background border-border text-foreground px-3 py-2"
                  placeholder={text.messagePlaceholder}
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className={`px-4 py-2 rounded-md flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors ${
                    loading ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                >
                  <Send className="h-4 w-4" />
                  {loading ? "제출 중..." : text.submitButton}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
