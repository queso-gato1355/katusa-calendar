import { Calendar, Github } from "lucide-react"
import { useTheme } from "@/components/providers/theme-provider"
import { useLanguage, useTranslation } from "@/components/providers/language-provider"
import { TextPlaceholder, useTextWithPlaceholder } from "@/components/atoms/Display/TextPlaceholder"

export default function Footer() {
  const { theme } = useTheme()
  const { isChangingLanguage } = useLanguage()
  const text = useTranslation("footer")
  
  // 텍스트 플레이스홀더 훅 사용
  const copyrightText = useTextWithPlaceholder(text.copyright, isChangingLanguage)
  const githubText = useTextWithPlaceholder(text.github, isChangingLanguage)

  return (
    <footer className="w-full border-t border-border py-6 md:py-0">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between md:h-24">
          <div className="flex flex-col items-center md:items-start">
            <div className="flex items-center gap-2 mb-4 md:mb-2">
              <Calendar className={`h-6 w-6 ${theme === "dark" ? "text-blue-400" : "text-blue-600"}`} />
              <span className="text-lg font-bold">KATUSA Calendar</span>
            </div>
            <div className={`text-center md:text-left text-sm leading-loose ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
              <p>&copy; {new Date().getFullYear()} KATUSA Calendar. </p>
              <TextPlaceholder isChanging={isChangingLanguage}>
                {copyrightText}
              </TextPlaceholder>
            </div>
          </div>
          {/* {<div className="flex gap-4 mt-4 md:mt-0">
            <a
              href="https://github.com/queso-gato1355/katusa-calendar"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                theme === "dark"
                  ? "border-gray-700 hover:bg-gray-800 text-white"
                  : "border-gray-200 hover:bg-gray-100 text-gray-900"
              }`}
            >
              <Github className="h-5 w-5" />
              <span className="text-sm font-medium">
                <TextPlaceholder isChanging={isChangingLanguage}>
                  {githubText}
                </TextPlaceholder>
              </span>
            </a>
          </div> */}
        </div>
      </div>
    </footer>
  )
}
