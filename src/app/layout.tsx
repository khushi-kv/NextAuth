import { Inter } from "next/font/google"
import { SessionProvider } from "next-auth/react"
import "./globals.css"
import AuthStatus from "./AuthStatus"
import Providers from "./components/Providers"

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <AuthStatus />
          <main>{children}</main>
        </Providers>
      </body>
    </html>
  )
}
