"use client"

import { useState, useEffect } from "react"

interface StatCircleProps {
  label: string
  value: number
  maxValue: number
  color: string
}

export default function StatCircle({ label, value, maxValue, color }: StatCircleProps) {
  const [displayValue, setDisplayValue] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDisplayValue(value)
    }, 500)

    return () => clearTimeout(timer)
  }, [value])

  const percentage = (displayValue / maxValue) * 100
  const circumference = 2 * Math.PI * 18
  const offset = circumference - (percentage / 100) * circumference

  return (
    <div className="flex flex-col items-center">
      <div className="relative flex h-16 w-16 items-center justify-center">
        <svg className="absolute h-full w-full -rotate-90" viewBox="0 0 50 50">
          <circle cx="25" cy="25" r="18" fill="none" stroke="rgba(59, 130, 246, 0.2)" strokeWidth="3" />
          <circle
            cx="25"
            cy="25"
            r="18"
            fill="none"
            stroke={`url(#gradient-${label})`}
            strokeWidth="3"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
          <defs>
            <linearGradient id={`gradient-${label}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgb(29, 78, 216)" />
              <stop offset="100%" stopColor="rgb(96, 165, 250)" />
            </linearGradient>
          </defs>
        </svg>
        <div className="z-10 flex flex-col items-center">
          <span className="text-xs font-medium text-slate-300">{label}</span>
          <span className="text-sm font-bold text-blue-400">{displayValue}</span>
        </div>
      </div>
    </div>
  )
}

