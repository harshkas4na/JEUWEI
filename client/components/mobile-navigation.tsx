"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { BarChart2, BookOpen, Home, LayoutDashboard } from "lucide-react"
import { useMobile } from "@/hooks/use-mobile"

export default function MobileNavigation() {
  const pathname = usePathname()
  const isMobile = useMobile()

  if (!isMobile) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-blue-500/20 bg-slate-900/80 backdrop-blur-md">
      <div className="flex h-16 items-center justify-around">
        <Link
          href="/dashboard"
          className={`flex flex-col items-center justify-center px-4 py-2 ${
            pathname === "/dashboard" ? "text-blue-400" : "text-slate-400"
          }`}
        >
          <LayoutDashboard className="h-5 w-5" />
          <span className="mt-1 text-xs">Dashboard</span>
        </Link>

        <Link
          href="/stats"
          className={`flex flex-col items-center justify-center px-4 py-2 ${
            pathname === "/stats" ? "text-blue-400" : "text-slate-400"
          }`}
        >
          <BarChart2 className="h-5 w-5" />
          <span className="mt-1 text-xs">Stats</span>
        </Link>

        <Link
          href="/"
          className={`flex flex-col items-center justify-center px-4 py-2 ${
            pathname === "/" ? "text-blue-400" : "text-slate-400"
          }`}
        >
          <Home className="h-5 w-5" />
          <span className="mt-1 text-xs">Home</span>
        </Link>

        <Link
          href="/journal"
          className={`flex flex-col items-center justify-center px-4 py-2 ${
            pathname === "/journal" ? "text-blue-400" : "text-slate-400"
          }`}
        >
          <BookOpen className="h-5 w-5" />
          <span className="mt-1 text-xs">Journal</span>
        </Link>
      </div>
    </div>
  )
}

