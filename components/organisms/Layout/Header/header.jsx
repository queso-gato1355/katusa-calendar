"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Calendar, Menu, Moon, Sun, CalendarPlus } from "lucide-react"
import { useTheme } from "@/components/providers/theme-provider"
import { useIsMobile } from "@/lib/hooks/use-mobile"
import { useLanguage, useTranslation } from "@/components/providers/language-provider"
import { LanguageSelector } from "@/components/molecules/Controls/LanguageSelector"
import { Button } from "@/components/atoms/Button/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/overlays/Sheet/sheet"
import { TextPlaceholder, useTextWithPlaceholder } from "@/components/atoms/Display/TextPlaceholder"

export default function Header() {
  const { theme, setTheme } = useTheme()
  const { language, isClient, isChangingLanguage } = useLanguage()
  const isMobile = useIsMobile()
  const text = useTranslation("header")
  const [mounted, setMounted] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const router = useRouter();

  // 텍스트 플레이스홀더 훅 사용
  const howItWorksText = useTextWithPlaceholder(text.howItWorks, isChangingLanguage)
  const calendarsText = useTextWithPlaceholder(text.calendars, isChangingLanguage)
  const viewOnWebText = useTextWithPlaceholder(text.viewOnWeb, isChangingLanguage)
  const faqText = useTextWithPlaceholder(text.faq, isChangingLanguage)
  const subscribeButtonText = useTextWithPlaceholder(text.subscribeButton, isChangingLanguage)

  // Wait for component to mount to access theme
  useEffect(() => {
    setMounted(true)
  }, [])

  // SSR 호환성 체크
  if (!mounted || !isClient) {
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
                <Button variant="ghost" size="icon" aria-label={text.menuButton}>
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
                  <div className="text-sm font-medium text-muted-foreground mb-2">{text.languageSelector}</div>
                  <LanguageSelector 
                    variant="outline" 
                    size="default" 
                    align="start"
                    showFlag={true} 
                    showText={true}
                  />
                </div>

                <nav className="flex flex-col gap-4 mt-6">
                  <Link
                    href="/#features"
                    className="text-lg font-medium hover:text-primary"
                    onClick={() => setMenuOpen(false)}
                  >
                    {text.mainFeature}
                  </Link>
                  <Link
                    href="/#how-it-works"
                    className="text-lg font-medium hover:text-primary"
                    onClick={() => setMenuOpen(false)}
                  >
                    <TextPlaceholder isChanging={isChangingLanguage}>
                      {howItWorksText}
                    </TextPlaceholder>
                  </Link>
                  <Link
                    href="/#calendars"
                    className="text-lg font-medium hover:text-primary"
                    onClick={() => setMenuOpen(false)}
                  >
                    <TextPlaceholder isChanging={isChangingLanguage}>
                      {calendarsText}
                    </TextPlaceholder>
                  </Link>
                  <Link
                    href="/calendar"
                    className="text-lg font-medium hover:text-primary"
                    onClick={() => setMenuOpen(false)}
                  >
                    <TextPlaceholder isChanging={isChangingLanguage}>
                      {viewOnWebText}
                    </TextPlaceholder>
                  </Link>
                  <Link
                    href="/#faq"
                    className="text-lg font-medium hover:text-primary"
                    onClick={() => setMenuOpen(false)}
                  >
                    <TextPlaceholder isChanging={isChangingLanguage}>
                      {faqText}
                    </TextPlaceholder>
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
                    <TextPlaceholder isChanging={isChangingLanguage}>
                      {subscribeButtonText}
                    </TextPlaceholder>
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
            <LanguageSelector 
              variant="ghost" 
              size="sm" 
              showFlag={true} 
              showText={!isMobile}
            />

            {/* Theme Toggle */}
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")} 
              aria-label={text.themeToggle}
            >
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>

            <Button variant="ghost" className="border rounded-full" onClick={() => document.getElementById("calendars")?.scrollIntoView({ behavior: "smooth" })}>
              <span className="hidden md:block">{text.subscribeButton}</span>
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
