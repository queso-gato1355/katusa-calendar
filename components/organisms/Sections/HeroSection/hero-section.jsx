"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { ArrowRight, Calendar } from "lucide-react"
import { useLanguage, useTranslation } from "@/components/providers/language-provider"
import { useTheme } from "@/components/providers/theme-provider"
import { TextPlaceholder, useTextWithPlaceholder } from "@/components/atoms/Display/TextPlaceholder"
import { useRouter } from "next/navigation"

export default function HeroSection() {
  const router = useRouter()
  const { theme } = useTheme()
  const { isChangingLanguage } = useLanguage()
  const [currentImage, setCurrentImage] = useState(0)
  const images = ["/KATUSA.jpg", "/KATUSA2.jpg", "/KATUSA3.jpg"]

  // 현재 언어에 맞는 텍스트 가져오기
  const text = useTranslation("hero")
  
  // 텍스트 플레이스홀더 훅 사용
  const titleText = useTextWithPlaceholder(text.title, isChangingLanguage)
  const descriptionText = useTextWithPlaceholder(text.description, isChangingLanguage)
  const subscribeButtonText = useTextWithPlaceholder(text.subscribeButton, isChangingLanguage)
  const howToUseButtonText = useTextWithPlaceholder(text.howToUseButton, isChangingLanguage)
  const seeItOnWebText = useTextWithPlaceholder(text.seeItOnWeb, isChangingLanguage)

  // Image rotation effect
  useEffect(() => {
    const interval = setInterval(() => {
      // Get random index that's different from current
      let nextIndex
      do {
        nextIndex = Math.floor(Math.random() * images.length)
      } while (nextIndex === currentImage && images.length > 1)

      setCurrentImage(nextIndex)
    }, 5000) // Change image every 5 seconds

    return () => clearInterval(interval) // Cleanup on unmount
  }, [currentImage, images.length])

  return (
    <section className="w-full py-12 md:py-24 lg:py-32 xl:py-40">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-2">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none whitespace-pre-line">
                <TextPlaceholder isChanging={isChangingLanguage}>
                  {titleText}
                </TextPlaceholder>
              </h1>
              <TextPlaceholder isChanging={isChangingLanguage}>
                <p className={`max-w-[600px] ${theme === "dark" ? "text-gray-300" : "text-gray-600"} md:text-xl`}>
                  {descriptionText}
                </p>
              </TextPlaceholder>
            </div>
            <div className="flex flex-col gap-2 sm:grid sm:grid-cols-2">
              {/* 파란색 버튼 */}
              <button
                className={`h-11 px-8 rounded-md inline-flex items-center justify-center text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
                  theme === "dark"
                    ? "bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-500"
                    : "bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-500"
                }`}
                onClick={() => document.getElementById("calendars").scrollIntoView({ behavior: "smooth" })}
              >
                <TextPlaceholder isChanging={isChangingLanguage}>
                  {subscribeButtonText}
                </TextPlaceholder>
                <ArrowRight className="ml-2 h-4 w-4" />
              </button>

              {/* 회색 테두리 버튼 */}
              <button
                className={`h-11 px-8 rounded-md inline-flex items-center justify-center text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
                  theme === "dark"
                    ? "bg-transparent text-white border border-gray-700 hover:bg-gray-800"
                    : "bg-transparent text-gray-900 border border-gray-200 hover:bg-gray-100"
                }`}
                onClick={() => document.getElementById("how-it-works").scrollIntoView({ behavior: "smooth" })}
              >
                <TextPlaceholder isChanging={isChangingLanguage}>
                  {howToUseButtonText}
                </TextPlaceholder>
              </button>

              {/* 초록색 버튼 */}
              <button
                className={`h-11 px-8 rounded-md inline-flex items-center justify-center text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
                  theme === "dark"
                    ? "bg-green-600 text-white hover:bg-green-700 focus-visible:ring-green-500"
                    : "bg-green-600 text-white hover:bg-green-700 focus-visible:ring-green-500"
                } sm:col-span-2`}
                onClick={() => router.push("/calendar")}
              >
                <Calendar className="mr-2 h-4 w-4" />
                <TextPlaceholder isChanging={isChangingLanguage}>
                  {seeItOnWebText}
                </TextPlaceholder>
              </button>
            </div>
          </div>
          <div className="flex items-center justify-center mt-8 lg:mt-0">
            <div className="relative w-full max-w-[400px] aspect-square group">
              <div
                className={`relative w-full h-full rounded-2xl overflow-hidden transition-all duration-300 transform group-hover:scale-105 group-hover:rotate-3 ${
                  theme === "dark"
                    ? "shadow-lg shadow-blue-900/20 group-hover:shadow-xl group-hover:shadow-blue-900/30"
                    : "shadow-lg shadow-blue-500/20 group-hover:shadow-xl group-hover:shadow-blue-500/30"
                }`}
              >
                {images.map((src, index) => (
                  <Image
                    key={src}
                    src={src || "/placeholder.svg"}
                    alt={`KATUSA Calendar 이미지 ${index + 1}`}
                    fill
                    className={`object-cover transition-opacity duration-1000 ${
                      currentImage === index ? "opacity-100" : "opacity-0 absolute"
                    }`}
                    priority={index === 0}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
