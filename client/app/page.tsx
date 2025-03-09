import Link from "next/link"
import { ArrowRight, Award, BarChart3, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="flex min-h-[calc(100vh-80px)] flex-col items-center justify-center py-12">
      {/* Hero Section */}
      <div className="relative w-full max-w-5xl">
        <div className="particle-bg"></div>
        <div className="relative z-10 flex flex-col items-center text-center">
          <h1
            className="mb-6 text-4xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl"
            style={{ textShadow: "0 0 15px rgba(59, 130, 246, 0.8)" }}
          >
            Life as a Game
          </h1>
          <p className="mb-8 max-w-2xl text-lg text-slate-300 md:text-xl">
            Transform your personal development journey into an immersive game experience. Level up your life with
            Jeuwei's system interface inspired by Solo Leveling.
          </p>
          <Button className="jeuwei-btn-primary group text-lg" size="lg" asChild>
            <Link href="/dashboard">
              Get Started
              <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
      </div>

      {/* Feature Cards */}
      <div className="mt-24 grid w-full max-w-5xl gap-8 md:grid-cols-3">
        <div className="jeuwei-panel animate-float">
          <div className="magical-circle"></div>
          <div className="relative z-10 flex flex-col items-center text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-900/30">
              <BarChart3
                className="h-8 w-8 text-blue-400"
                style={{ filter: "drop-shadow(0 0 8px rgba(59, 130, 246, 0.5))" }}
              />
            </div>
            <h3 className="jeuwei-subheading mb-2">Track Your Stats</h3>
            <p className="text-slate-400">
              Monitor your progress across six key life attributes with detailed statistics and visualizations.
            </p>
          </div>
        </div>

        <div className="jeuwei-panel animate-float" style={{ animationDelay: "0.2s" }}>
          <div className="magical-circle"></div>
          <div className="relative z-10 flex flex-col items-center text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-900/30">
              <Award
                className="h-8 w-8 text-blue-400"
                style={{ filter: "drop-shadow(0 0 8px rgba(59, 130, 246, 0.5))" }}
              />
            </div>
            <h3 className="jeuwei-subheading mb-2">Earn Experience</h3>
            <p className="text-slate-400">
              Complete daily activities and challenges to gain EXP, level up, and unlock new abilities.
            </p>
          </div>
        </div>

        <div className="jeuwei-panel animate-float" style={{ animationDelay: "0.4s" }}>
          <div className="magical-circle"></div>
          <div className="relative z-10 flex flex-col items-center text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-900/30">
              <BookOpen
                className="h-8 w-8 text-blue-400"
                style={{ filter: "drop-shadow(0 0 8px rgba(59, 130, 246, 0.5))" }}
              />
            </div>
            <h3 className="jeuwei-subheading mb-2">Journal Your Journey</h3>
            <p className="text-slate-400">
              Record your thoughts and achievements in a digital journal that tracks your growth over time.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="mt-24 w-full max-w-3xl">
        <div className="jeuwei-panel">
          <div className="magical-circle"></div>
          <div className="relative z-10 flex flex-col items-center text-center">
            <h2 className="jeuwei-heading mb-4">Ready to Begin Your Quest?</h2>
            <p className="mb-8 text-slate-400">
              Join thousands of others who have transformed their lives through the power of gamification.
            </p>
            <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
              <Button className="jeuwei-btn-primary" size="lg" asChild>
                <Link href="/dashboard">Start Your Journey</Link>
              </Button>
              <Button className="jeuwei-btn-secondary" size="lg" asChild>
                <Link href="/about">Learn More</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

