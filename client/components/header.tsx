// components/header.tsx
"use client"

import { useState } from "react"
import Link from "next/link"
import { Bell, Menu, Settings, User, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useMobile } from "@/hooks/use-mobile"
import { useAuth, useUser, SignOutButton } from "@clerk/nextjs"
import { useStats } from "@/hooks/use-stats"
import { useEffect } from "react"

export default function Header() {
  const isMobile = useMobile()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { isLoaded, isSignedIn } = useAuth()
  const { user } = useUser()
  const { getUserStats } = useStats()
  const [stats, setStats] = useState({ level: 1, totalExp: 0, nextLevelExp: 50, progress: 0 })

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      fetchStats()
    }
  }, [isLoaded, isSignedIn])

  const fetchStats = async () => {
    const userStats = await getUserStats()
    if (userStats) {
      setStats({
        level: userStats.level,
        totalExp: userStats.totalExp,
        nextLevelExp: userStats.nextLevelExp,
        progress: userStats.progress
      })
    }
  }

  return (
    <header className="fixed left-0 right-0 top-0 z-50 border-b border-blue-500/20 bg-slate-900/80 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="text-xl font-bold text-white transition-all duration-300 hover:text-blue-400"
            style={{ textShadow: "0 0 10px rgba(59, 130, 246, 0.5)" }}
          >
            Jeuwei
          </Link>

          {!isMobile && (
            <nav className="hidden space-x-4 md:flex">
              <Link
                href="/dashboard"
                className="text-sm text-slate-300 transition-all duration-300 hover:text-blue-400"
              >
                Dashboard
              </Link>
              <Link href="/stats" className="text-sm text-slate-300 transition-all duration-300 hover:text-blue-400">
                Stats
              </Link>
              <Link href="/journal" className="text-sm text-slate-300 transition-all duration-300 hover:text-blue-400">
                Journal
              </Link>
              <Link href="/history" className="text-sm text-slate-300 transition-all duration-300 hover:text-blue-400">
                History
              </Link>
            </nav>
          )}
        </div>

        <div className="flex items-center gap-4">
          {!isMobile && isSignedIn && (
            <div className="flex items-center gap-2">
              <div className="flex flex-col">
                <div className="flex items-center gap-1">
                  <span className="text-xs text-slate-400">Level</span>
                  <span className="text-sm font-medium text-blue-400">{stats.level}</span>
                </div>
                <Progress className="h-1 w-24 rounded-full bg-blue-950">
                  <div 
                    className="h-full rounded-full bg-gradient-to-r from-blue-700 to-blue-400" 
                    style={{ width: `${stats.progress}%` }}
                  ></div>
                </Progress>
              </div>

              <Badge className="bg-blue-600">
                {stats.totalExp} / {stats.nextLevelExp} EXP
              </Badge>
            </div>
          )}

          {isSignedIn && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5 text-slate-300" />
                  <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-[10px] text-white">
                    3
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="max-h-80 overflow-y-auto">
                  <DropdownMenuItem className="flex flex-col items-start gap-1 p-4">
                    <div className="font-medium">Level Up!</div>
                    <div className="text-xs text-slate-400">You've reached level {stats.level}. New abilities unlocked!</div>
                    <div className="text-xs text-slate-500">2 hours ago</div>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex flex-col items-start gap-1 p-4">
                    <div className="font-medium">Streak Milestone</div>
                    <div className="text-xs text-slate-400">You've maintained a 7-day journal streak!</div>
                    <div className="text-xs text-slate-500">Yesterday</div>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex flex-col items-start gap-1 p-4">
                    <div className="font-medium">New Achievement</div>
                    <div className="text-xs text-slate-400">Knowledge Seeker: Complete 5 learning activities</div>
                    <div className="text-xs text-slate-500">2 days ago</div>
                  </DropdownMenuItem>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {isSignedIn ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Avatar className="h-8 w-8">
                    {user?.imageUrl ? (
                      <AvatarImage src={user.imageUrl} alt="User avatar" />
                    ) : (
                      <AvatarFallback className="bg-blue-950 text-blue-400">
                        {user?.firstName?.[0] || user?.username?.[0] || 'J'}
                      </AvatarFallback>
                    )}
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    {user?.imageUrl ? (
                      <AvatarImage src={user.imageUrl} alt="User avatar" />
                    ) : (
                      <AvatarFallback className="bg-blue-950 text-blue-400">
                        {user?.firstName?.[0] || user?.username?.[0] || 'J'}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="font-medium">{user?.firstName || user?.username || 'User'}</span>
                    <span className="text-xs text-slate-400">Level {stats.level} Explorer</span>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <SignOutButton>
                    <span>Log out</span>
                  </SignOutButton>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button className="jeuwei-btn-primary" asChild>
              <Link href="/sign-in">Sign In</Link>
            </Button>
          )}

          {isMobile && (
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5 text-slate-300" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="border-blue-500/20 bg-slate-900/95 backdrop-blur-md">
                <div className="flex h-full flex-col">
                  <div className="flex items-center justify-between">
                    <div className="text-lg font-bold text-white">Menu</div>
                    <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(false)}>
                    <X className="h-5 w-5 text-slate-300" />
                    </Button>
                    </div>
                    <nav className="mt-8 flex flex-col space-y-4">
                <Link
                  href="/dashboard"
                  className="flex items-center gap-2 text-slate-300 transition-all duration-300 hover:text-blue-400"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  href="/stats"
                  className="flex items-center gap-2 text-slate-300 transition-all duration-300 hover:text-blue-400"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Stats
                </Link>
                <Link
                  href="/journal"
                  className="flex items-center gap-2 text-slate-300 transition-all duration-300 hover:text-blue-400"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Journal
                </Link>
                <Link
                  href="/history"
                  className="flex items-center gap-2 text-slate-300 transition-all duration-300 hover:text-blue-400"
                  onClick={() => setIsMenuOpen(false)}
                >
                  History
                </Link>
              </nav>

              {isSignedIn && (
                <div className="mt-auto space-y-4 pb-8">
                  <div className="flex items-center gap-2">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-slate-400">Level</span>
                        <span className="text-sm font-medium text-blue-400">{stats.level}</span>
                      </div>
                      <Progress className="h-1 w-24 rounded-full bg-blue-950">
                        <div 
                          className="h-full rounded-full bg-gradient-to-r from-blue-700 to-blue-400"
                          style={{ width: `${stats.progress}%` }}
                        ></div>
                      </Progress>
                    </div>

                    <Badge className="bg-blue-600">
                      {stats.totalExp} / {stats.nextLevelExp} EXP
                    </Badge>
                  </div>

                  <Button className="jeuwei-btn-secondary w-full">
                    <SignOutButton>
                      <span>Log out</span>
                    </SignOutButton>
                  </Button>
                </div>
              )}
            </div>
          </SheetContent>
        </Sheet>
      )}
    </div>
  </div>
</header>
  )
}