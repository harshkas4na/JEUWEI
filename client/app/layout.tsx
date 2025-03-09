import type React from "react"
import type { Metadata } from "next"
import { Inter, Rajdhani } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import Header from "@/components/header"
import MobileNavigation from "@/components/mobile-navigation"
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs'

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

const rajdhani = Rajdhani({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-rajdhani",
})

export const metadata: Metadata = {
  title: "Jeuwei | Life as a Game",
  description: "Transform your personal development into a game with Jeuwei",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider>
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${rajdhani.variable} font-sans antialiased`}>
      
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
          <div className="min-h-screen bg-gradient-to-b from-gray-900 to-slate-900 text-slate-300">
            <Header />
            <main className="container mx-auto px-4 pb-24 pt-20 md:px-6 lg:px-8">{children}</main>
            <MobileNavigation />
          </div>
        </ThemeProvider>
      </body>
    </html>
    </ClerkProvider>

  )
}

