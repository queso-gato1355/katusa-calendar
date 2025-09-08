"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Calendar, Menu, Moon, Sun, Globe, ChevronDown, CalendarPlus } from "lucide-react"
import { languages, getDefaultLanguage } from "@/data/languages"
import { getTranslation } from "@/data/translations"
import { Button } from "@/components/atoms/Button/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export default function Header({ theme, onThemeChange, language, setLanguage }) {
  const [mounted, setMounted] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const router = useRouter();

  // Wait for component to mount to access theme
  useEffect(() => {
    setMounted(true)
  }, [])

  const handleLanguageChange = (langCode) => {
    setLanguage(langCode)
  }

  // 현재 선택된 언어 정보
  const currentLanguage = languages.find((lang) => lang.code === language) || getDefaultLanguage()

  // 헤더 번역 가져오기
  const headerText = getTranslation("header", language)

  if (!mounted) {
    return null
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/50 backdrop-blur supports-[backdrop-filter]:bg-background/40">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Left section - Logo and Menu Button */}
          <div className="flex items-center gap-4">
            <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" aria-label={headerText.menuButton}>
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <SheetHeader>
                  <SheetTitle>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-6 w-6 text-primary" />
                      <span className="text-xl font-bold">KATUSA Calendar</span>
                    </div>
                  </SheetTitle>
                </SheetHeader>

                {/* Language Selector in Side Menu */}
                <div className="my-6">
                  <div className="text-sm font-medium text-muted-foreground mb-2">{headerText.languageSelector}</div>
                  <div className="grid grid-cols-2 gap-2">
                    {languages.map((lang) => (
                      <Button
                        key={lang.code}
                        variant={lang.code === language ? "default" : "outline"}
                        className="justify-start"
                        onClick={() => {
                          handleLanguageChange(lang.code)
                          setMenuOpen(false)
                        }}
                      >
                        <span className="text-lg mr-2">{lang.flag}</span>
                        <span className="text-sm">{lang.name}</span>
                      </Button>
                    ))}
                  </div>
                </div>

                <nav className="flex flex-col gap-4 mt-6">
                  <Link
                    href="/#features"
                    className="text-lg font-medium hover:text-primary"
                    onClick={() => setMenuOpen(false)}
                  >
                    기능
                  </Link>
                  <Link
                    href="/#how-it-works"
                    className="text-lg font-medium hover:text-primary"
                    onClick={() => setMenuOpen(false)}
                  >
                    사용방법
                  </Link>
                  <Link
                    href="/#calendars"
                    className="text-lg font-medium hover:text-primary"
                    onClick={() => setMenuOpen(false)}
                  >
                    캘린더
                  </Link>
                  <Link
                    href="/calendar"
                    className="text-lg font-medium hover:text-primary"
                    onClick={() => setMenuOpen(false)}
                  >
                    웹에서 보기
                  </Link>
                  <Link
                    href="/#faq"
                    className="text-lg font-medium hover:text-primary"
                    onClick={() => setMenuOpen(false)}
                  >
                    FAQ
                  </Link>
                </nav>
                <div className="mt-auto pt-8">
                  <Button
                    className="w-full"
                    onClick={() => {
                      document.getElementById("calendars").scrollIntoView({ behavior: "smooth" })
                      setMenuOpen(false)
                    }}
                  >
                    {headerText.subscribeButton}
                  </Button>
                </div>
              </SheetContent>
            </Sheet>

            <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push("/")}>
              <Calendar className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold hidden md:block">KATUSA Calendar</span>
              <span className="text-xl font-bold md:hidden">KATUSA</span>
            </div>
          </div>

          {/* Right section - Buttons */}
          <div className="flex items-center gap-2">
            {/* Language Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="flex items-center gap-1 h-10">
                  <Globe className="h-5 w-5 mr-1" />
                  <span className="hidden sm:inline-flex items-center gap-1">
                    <span className="mr-1">{currentLanguage.flag}</span>
                    {currentLanguage.name}
                  </span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {languages.map((lang) => (
                  <DropdownMenuItem
                    key={lang.code}
                    onClick={() => handleLanguageChange(lang.code)}
                    className={lang.code === language ? "bg-muted" : ""}
                  >
                    <span className="text-lg mr-2">{lang.flag}</span>
                    <span>{lang.name}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Theme Toggle */}
            <Button variant="ghost" size="icon" onClick={onThemeChange} aria-label={headerText.themeToggle}>
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>

            <Button variant="ghost" className="border rounded-full" onClick={() => document.getElementById("calendars").scrollIntoView({ behavior: "smooth" })}>
              <span className="hidden md:block">{headerText.subscribeButton}</span>
              <span className="md:hidden">
                <CalendarPlus className="h-5 w-5" />
              </span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
