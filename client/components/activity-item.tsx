import type { ReactNode } from "react"
import { Badge } from "@/components/ui/badge"

interface ActivityItemProps {
  icon: ReactNode
  title: string
  description: string
  category: string
  exp: number
  time: string
  color: string
}

export default function ActivityItem({ icon, title, description, category, exp, time, color }: ActivityItemProps) {
  return (
    <div className="group flex items-start gap-4 rounded-lg border border-transparent p-3 transition-all duration-300 hover:border-blue-500/20 hover:bg-blue-950/10">
      <div className={`mt-1 flex h-8 w-8 items-center justify-center rounded-md ${color} bg-opacity-20`}>{icon}</div>

      <div className="flex-1">
        <div className="flex items-center justify-between">
          <h4 className="font-medium text-slate-200">{title}</h4>
          <Badge variant="outline" className="bg-blue-950/30 text-blue-400">
            +{exp} EXP
          </Badge>
        </div>
        <p className="mt-1 text-xs text-slate-400">{description}</p>
        <div className="mt-2 flex items-center justify-between">
          <Badge variant="secondary" className="bg-blue-950/20 text-xs">
            {category}
          </Badge>
          <span className="text-xs text-slate-500">{time}</span>
        </div>
      </div>
    </div>
  )
}

