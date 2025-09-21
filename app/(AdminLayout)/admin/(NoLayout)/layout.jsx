import "@/app/globals.css"
import { AppProvider } from "@/components/providers/app-provider"

export default function NoLayout({ children }) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body>
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
