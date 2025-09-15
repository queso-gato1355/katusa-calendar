"use client"

import React from "react"
import { useLanguage } from "@/components/providers/language-provider"
import { Button } from "@/components/atoms/Button/button"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/overlays/DropdownMenu/dropdown-menu"
import { Globe, Check, Loader2 } from "lucide-react"

interface LanguageOption {
  code: string
  name: string
  flag: string
  loadingText: string
}

const languageOptions: LanguageOption[] = [
  { code: "ko", name: "한국어", flag: "🇰🇷" , loadingText: "변경 중..." },
  { code: "en", name: "English", flag: "🇺🇸", loadingText: "Changing..." },
  { code: "es", name: "Español", flag: "🇪🇸", loadingText: "Cambiando..." },
]

interface LanguageSelectorProps {
  variant?: "default" | "outline" | "ghost"
  size?: "default" | "sm" | "lg" | "icon"
  align?: "start" | "center" | "end"
  showFlag?: boolean
  showText?: boolean
}

export function LanguageSelector({
  variant = "outline",
  size = "default",
  align = "center",
  showFlag = true,
  showText = true
}: LanguageSelectorProps) {
  const { language, setLanguage, isChangingLanguage, supportedLanguages } = useLanguage()
  
  const currentLanguage = languageOptions.find(lang => lang.code === language)
  const availableLanguages = languageOptions.filter(lang => 
    supportedLanguages.includes(lang.code)
  )

  const handleLanguageChange = (newLanguage: string) => {
    if (newLanguage !== language) {
      setLanguage(newLanguage, false) // autoReload = false - 부드러운 전환 사용
    }
  }

  if (isChangingLanguage) {
    return (
      <Button variant={variant} size={size} disabled>
        <Loader2 className="h-4 w-4 animate-spin" />
        {showText && size !== "icon" && (
          <span className="ml-2">{currentLanguage?.loadingText}</span>
        )}
      </Button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} size={size}>
          {showFlag && currentLanguage && (
            <span className="text-lg">{currentLanguage.flag}</span>
          )}
          {!showFlag && <Globe className="h-4 w-4" />}
          {showText && size !== "icon" && (
            <span className={showFlag ? "ml-2" : "ml-2"}>
              {currentLanguage?.name || "언어"}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={align} className="w-48">
        {availableLanguages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            className="flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center">
              <span className="text-lg mr-3">{lang.flag}</span>
              <span>{lang.name}</span>
            </div>
            {lang.code === language && (
              <Check className="h-4 w-4 text-primary" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
