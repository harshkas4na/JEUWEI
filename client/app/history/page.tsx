"use client"

import { useState } from "react"
import { ArrowLeft, ArrowRight, Brain, Calendar, ChevronDown, Dumbbell, Globe, PiggyBank, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

export default function HistoryPage() {
  const [expandedEntries, setExpandedEntries] = useState<string[]>([])

  const toggleEntry = (id: string) => {
    if (expandedEntries.includes(id)) {
      setExpandedEntries(expandedEntries.filter((entryId) => entryId !== id))
    } else {
      setExpandedEntries([...expandedEntries, id])
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="jeuwei-heading">History</h1>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>March 2025</span>
            <ChevronDown className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Timeline Interface */}
      <div className="relative space-y-8 pl-6 before:absolute before:left-0 before:top-0 before:h-full before:w-px before:bg-gradient-to-b before:from-blue-600 before:via-blue-500/50 before:to-transparent">
        {/* Today's Date Header */}
        <div className="sticky top-20 z-10 -ml-6 mb-6 bg-gradient-to-r from-slate-900 to-slate-900/95 pb-2 pt-2 backdrop-blur-sm">
          <div className="flex items-center">
            <div className="mr-4 h-4 w-4 rounded-full bg-blue-500"></div>
            <h2 className="jeuwei-subheading">Today</h2>
          </div>
        </div>

        {/* Journal Entry Cards */}
        <div className="grid gap-6">
          <Collapsible
            open={expandedEntries.includes("entry1")}
            onOpenChange={() => toggleEntry("entry1")}
            className="rounded-lg border border-blue-500/20 bg-blue-950/10 transition-all duration-300 hover:border-blue-500/30"
          >
            <div className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-md bg-blue-900/30 text-center">
                    <div className="flex flex-col">
                      <span className="text-xs font-medium text-slate-300">MAR</span>
                      <span className="text-sm font-bold text-blue-400">08</span>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium text-slate-200">Morning Workout and Study Session</h3>
                    <div className="mt-1 flex flex-wrap gap-2">
                      <Badge variant="secondary" className="bg-green-900/20 text-green-400">
                        <Dumbbell className="mr-1 h-3 w-3" />
                        Habits
                      </Badge>
                      <Badge variant="secondary" className="bg-blue-900/20 text-blue-400">
                        <Brain className="mr-1 h-3 w-3" />
                        Knowledge
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-blue-950/30 text-blue-400">
                    +35 EXP
                  </Badge>
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <ChevronDown
                        className={`h-4 w-4 transition-transform duration-300 ${
                          expandedEntries.includes("entry1") ? "rotate-180" : ""
                        }`}
                      />
                    </Button>
                  </CollapsibleTrigger>
                </div>
              </div>
            </div>

            <CollapsibleContent>
              <div className="border-t border-blue-500/20 p-4">
                <div className="space-y-4">
                  <p className="text-sm text-slate-300">
                    Started the day with a 30-minute workout focusing on strength training. Completed 3 sets of squats,
                    push-ups, and planks. Afterward, spent 2 hours studying Python programming and completed a
                    challenging coding exercise.
                  </p>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="rounded-lg bg-blue-950/20 p-3">
                      <h4 className="text-sm font-medium text-slate-300">Activities</h4>
                      <ul className="mt-2 space-y-2 text-xs text-slate-400">
                        <li className="flex items-center justify-between">
                          <span>Morning Workout</span>
                          <Badge variant="outline" className="bg-green-900/10 text-green-400">
                            +10 EXP
                          </Badge>
                        </li>
                        <li className="flex items-center justify-between">
                          <span>Python Study</span>
                          <Badge variant="outline" className="bg-blue-900/10 text-blue-400">
                            +15 EXP
                          </Badge>
                        </li>
                        <li className="flex items-center justify-between">
                          <span>Coding Exercise</span>
                          <Badge variant="outline" className="bg-blue-900/10 text-blue-400">
                            +10 EXP
                          </Badge>
                        </li>
                      </ul>
                    </div>

                    <div className="rounded-lg bg-blue-950/20 p-3">
                      <h4 className="text-sm font-medium text-slate-300">Stats Improved</h4>
                      <ul className="mt-2 space-y-2 text-xs text-slate-400">
                        <li className="flex items-center justify-between">
                          <span>Strength</span>
                          <span className="text-green-400">+0.5</span>
                        </li>
                        <li className="flex items-center justify-between">
                          <span>Intelligence</span>
                          <span className="text-green-400">+1.0</span>
                        </li>
                        <li className="flex items-center justify-between">
                          <span>Vitality</span>
                          <span className="text-green-400">+0.3</span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button className="jeuwei-btn-secondary text-xs">View Full Entry</Button>
                  </div>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>

          <Collapsible
            open={expandedEntries.includes("entry2")}
            onOpenChange={() => toggleEntry("entry2")}
            className="rounded-lg border border-blue-500/20 bg-blue-950/10 transition-all duration-300 hover:border-blue-500/30"
          >
            <div className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-md bg-blue-900/30 text-center">
                    <div className="flex flex-col">
                      <span className="text-xs font-medium text-slate-300">MAR</span>
                      <span className="text-sm font-bold text-blue-400">08</span>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium text-slate-200">Budget Review and Networking Event</h3>
                    <div className="mt-1 flex flex-wrap gap-2">
                      <Badge variant="secondary" className="bg-indigo-900/20 text-indigo-400">
                        <PiggyBank className="mr-1 h-3 w-3" />
                        Financial
                      </Badge>
                      <Badge variant="secondary" className="bg-rose-900/20 text-rose-400">
                        <Users className="mr-1 h-3 w-3" />
                        Network
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-blue-950/30 text-blue-400">
                    +35 EXP
                  </Badge>
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <ChevronDown
                        className={`h-4 w-4 transition-transform duration-300 ${
                          expandedEntries.includes("entry2") ? "rotate-180" : ""
                        }`}
                      />
                    </Button>
                  </CollapsibleTrigger>
                </div>
              </div>
            </div>

            <CollapsibleContent>
              <div className="border-t border-blue-500/20 p-4">
                <div className="space-y-4">
                  <p className="text-sm text-slate-300">
                    Conducted monthly budget review in the morning, identifying areas to optimize spending. In the
                    evening, attended an industry networking event and connected with 5 new professionals in my field.
                    Exchanged contact information and discussed potential collaboration opportunities.
                  </p>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="rounded-lg bg-blue-950/20 p-3">
                      <h4 className="text-sm font-medium text-slate-300">Activities</h4>
                      <ul className="mt-2 space-y-2 text-xs text-slate-400">
                        <li className="flex items-center justify-between">
                          <span>Budget Review</span>
                          <Badge variant="outline" className="bg-indigo-900/10 text-indigo-400">
                            +15 EXP
                          </Badge>
                        </li>
                        <li className="flex items-center justify-between">
                          <span>Networking Event</span>
                          <Badge variant="outline" className="bg-rose-900/10 text-rose-400">
                            +20 EXP
                          </Badge>
                        </li>
                      </ul>
                    </div>

                    <div className="rounded-lg bg-blue-950/20 p-3">
                      <h4 className="text-sm font-medium text-slate-300">Stats Improved</h4>
                      <ul className="mt-2 space-y-2 text-xs text-slate-400">
                        <li className="flex items-center justify-between">
                          <span>Wealth</span>
                          <span className="text-green-400">+0.8</span>
                        </li>
                        <li className="flex items-center justify-between">
                          <span>Charisma</span>
                          <span className="text-green-400">+1.2</span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button className="jeuwei-btn-secondary text-xs">View Full Entry</Button>
                  </div>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>

        {/* Yesterday's Date Header */}
        <div className="sticky top-20 z-10 -ml-6 mb-6 bg-gradient-to-r from-slate-900 to-slate-900/95 pb-2 pt-2 backdrop-blur-sm">
          <div className="flex items-center">
            <div className="mr-4 h-4 w-4 rounded-full bg-blue-500/70"></div>
            <h2 className="jeuwei-subheading">Yesterday</h2>
          </div>
        </div>

        {/* Yesterday's Journal Entry */}
        <div className="grid gap-6">
          <Collapsible
            open={expandedEntries.includes("entry3")}
            onOpenChange={() => toggleEntry("entry3")}
            className="rounded-lg border border-blue-500/20 bg-blue-950/10 transition-all duration-300 hover:border-blue-500/30"
          >
            <div className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-md bg-blue-900/30 text-center">
                    <div className="flex flex-col">
                      <span className="text-xs font-medium text-slate-300">MAR</span>
                      <span className="text-sm font-bold text-blue-400">07</span>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium text-slate-200">Museum Visit and Reading</h3>
                    <div className="mt-1 flex flex-wrap gap-2">
                      <Badge variant="secondary" className="bg-amber-900/20 text-amber-400">
                        <Globe className="mr-1 h-3 w-3" />
                        Experiences
                      </Badge>
                      <Badge variant="secondary" className="bg-blue-900/20 text-blue-400">
                        <Brain className="mr-1 h-3 w-3" />
                        Knowledge
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-blue-950/30 text-blue-400">
                    +30 EXP
                  </Badge>
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <ChevronDown
                        className={`h-4 w-4 transition-transform duration-300 ${
                          expandedEntries.includes("entry3") ? "rotate-180" : ""
                        }`}
                      />
                    </Button>
                  </CollapsibleTrigger>
                </div>
              </div>
            </div>

            <CollapsibleContent>
              <div className="border-t border-blue-500/20 p-4">
                <div className="space-y-4">
                  <p className="text-sm text-slate-300">
                    Visited the science museum exhibition on quantum physics. Spent 3 hours exploring the interactive
                    displays and learning about fundamental particles. In the evening, read 50 pages of "The Elegant
                    Universe" to deepen my understanding of the concepts.
                  </p>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="rounded-lg bg-blue-950/20 p-3">
                      <h4 className="text-sm font-medium text-slate-300">Activities</h4>
                      <ul className="mt-2 space-y-2 text-xs text-slate-400">
                        <li className="flex items-center justify-between">
                          <span>Museum Visit</span>
                          <Badge variant="outline" className="bg-amber-900/10 text-amber-400">
                            +15 EXP
                          </Badge>
                        </li>
                        <li className="flex items-center justify-between">
                          <span>Reading</span>
                          <Badge variant="outline" className="bg-blue-900/10 text-blue-400">
                            +15 EXP
                          </Badge>
                        </li>
                      </ul>
                    </div>

                    <div className="rounded-lg bg-blue-950/20 p-3">
                      <h4 className="text-sm font-medium text-slate-300">Stats Improved</h4>
                      <ul className="mt-2 space-y-2 text-xs text-slate-400">
                        <li className="flex items-center justify-between">
                          <span>Intelligence</span>
                          <span className="text-green-400">+1.5</span>
                        </li>
                        <li className="flex items-center justify-between">
                          <span>Experience</span>
                          <span className="text-green-400">+0.7</span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button className="jeuwei-btn-secondary text-xs">View Full Entry</Button>
                  </div>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>

        {/* Older Entries Header */}
        <div className="sticky top-20 z-10 -ml-6 mb-6 bg-gradient-to-r from-slate-900 to-slate-900/95 pb-2 pt-2 backdrop-blur-sm">
          <div className="flex items-center">
            <div className="mr-4 h-4 w-4 rounded-full bg-blue-500/50"></div>
            <h2 className="jeuwei-subheading">Earlier This Week</h2>
          </div>
        </div>

        {/* Load More Button */}
        <div className="flex justify-center py-4">
          <Button className="jeuwei-btn-secondary">Load More Entries</Button>
        </div>
      </div>
    </div>
  )
}

