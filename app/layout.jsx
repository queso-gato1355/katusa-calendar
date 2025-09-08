import "./globals.css"
import { ThemeProvider } from "@/components/providers/theme-provider"
import { PublicLayout } from "@/components/templates/PublicLayout"

export const metadata = {
  title: "KATUSA Calendar",
  description: "카투사 복무 중 필요한 모든 일정을 한 눈에 확인하세요.",
  generator: "v0.dev",
}

export default function RootLayout({ children }) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body>
        <ThemeProvider>
          <PublicLayout>
            {children}
          </PublicLayout>
        </ThemeProvider>
      </body>
    </html>
  )
}
