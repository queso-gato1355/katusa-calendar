import "./globals.css"
import { Toaster } from "react-hot-toast"

export const metadata = {
  title: "KATUSA Calendar",
  description: "카투사 복무 중 필요한 모든 일정을 한 눈에 확인하세요.",
    generator: 'v0.dev'
}

export default function RootLayout({ children }) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
            if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
              document.documentElement.classList.add('dark')
            } else {
              document.documentElement.classList.remove('dark')
            }
          `,
          }}
        />
      </head>
      <body>
        {children}
        <Toaster position="top-center" reverseOrder={false} />
      </body>
    </html>
  )
}
