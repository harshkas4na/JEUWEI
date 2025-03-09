// app/stats/page.tsx
"use client"

import { useState, useEffect } from "react"
import { Activity, ArrowUp, Brain, ChevronRight, Dumbbell, Globe, PiggyBank, Users } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useStats } from "@/hooks/use-stats"
import { UserStats } from "@/app/types"
import { useAuth } from "@clerk/nextjs"

export default function StatsPage() {
  const { isLoaded, isSignedIn } = useAuth();
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const { getUserStats, loading } = useStats();
  const [stats, setStats] = useState<UserStats | null>(null);

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      fetchStats();
    }
  }, [isLoaded, isSignedIn]);

  const fetchStats = async () => {
    const userStats = await getUserStats();
    if (userStats) {
      setStats(userStats);
    }
  };

  const toggleCategory = (category: string) => {
    if (activeCategory === category) {
      setActiveCategory(null)
    } else {
      setActiveCategory(category)
    }
  }

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  if (!isSignedIn) {
    return <div>Please sign in to view your stats</div>;
  }

  // Calculate weekly/yearly EXP (in a real app, this would come from the API)
  const weeklyExp = stats?.recentActivities
    .filter(activity => {
      const activityDate = new Date(activity.date);
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - activityDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays <= 7;
    })
    .reduce((sum, activity) => sum + activity.expValue, 0) || 0;

  return (
    <div className="space-y-8">
      <h1 className="jeuwei-heading">Statistics</h1>

      {/* Overview Statistics Card */}
      <Card className="jeuwei-panel">
        <CardHeader className="pb-2">
          <CardTitle className="jeuwei-subheading">Overview</CardTitle>
          <CardDescription className="text-slate-400">Your progress across all categories</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center p-8">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-500 border-t-transparent"></div>
            </div>
          ) : !stats ? (
            <div className="text-center p-8 text-slate-400">
              No stats available. Start journaling to track your progress!
            </div>
          ) : (
            <>
              <div className="grid gap-6 md:grid-cols-3">
                <div className="flex flex-col rounded-lg bg-blue-950/30 p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-400">Total EXP</span>
                    <span className="jeuwei-stat animate-count">{stats.totalExp}</span>
                  </div>
                  {weeklyExp > 0 && (
                    <div className="mt-2 flex items-center text-xs text-green-400">
                      <ArrowUp className="mr-1 h-3 w-3" />
                      <span>{weeklyExp} EXP gained this week</span>
                    </div>
                  )}
                </div>

                <div className="flex flex-col rounded-lg bg-blue-950/30 p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-400">Current Level</span>
                    <span className="jeuwei-stat animate-count">{stats.level}</span>
                  </div>
                  <div className="mt-2 flex items-center text-xs text-blue-400">
                    <span>Next level in {stats.nextLevelExp - stats.totalExp} EXP</span>
                  </div>
                </div>

                <div className="flex flex-col rounded-lg bg-blue-950/30 p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-400">Activities</span>
                    <span className="jeuwei-stat animate-count">{stats.recentActivities.length}</span>
                  </div>
                  <div className="mt-2 flex items-center text-xs text-green-400">
                    <span>Across {Object.keys(stats.stats).length} categories</span>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <Tabs defaultValue="week">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-slate-300">Progress Timeline</h3>
                    <TabsList className="bg-blue-950/30">
                      <TabsTrigger value="week">Week</TabsTrigger>
                      <TabsTrigger value="month">Month</TabsTrigger>
                      <TabsTrigger value="year">Year</TabsTrigger>
                    </TabsList>
                  </div>

                  <TabsContent value="week" className="mt-4">
                    <div className="h-[200px] w-full rounded-lg bg-blue-950/20 p-4">
                      {/* This would be a chart component in a real app */}
                      <div className="flex h-full items-end justify-between gap-2">
                        {[30, 45, 60, 40, 75, 55, 65].map((value, index) => (
                          <div key={index} className="group relative w-full">
                            <div
                              className="w-full rounded-t bg-gradient-to-t from-blue-600 to-blue-400 transition-all duration-300 group-hover:from-blue-500 group-hover:to-blue-300"
                              style={{ height: `${value}%` }}
                            ></div>
                            <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs text-blue-400 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                              {value}
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="mt-2 flex justify-between text-xs text-slate-400">
                        <span>Mon</span>
                        <span>Tue</span>
                        <span>Wed</span>
                        <span>Thu</span>
                        <span>Fri</span>
                        <span>Sat</span>
                        <span>Sun</span>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="month" className="mt-4">
                    <div className="flex h-[200px] items-center justify-center rounded-lg bg-blue-950/20 p-4 text-slate-400">
                      Monthly data visualization would appear here
                    </div>
                  </TabsContent>
                  <TabsContent value="year" className="mt-4">
                <div className="flex h-[200px] items-center justify-center rounded-lg bg-blue-950/20 p-4 text-slate-400">
                  Yearly data visualization would appear here
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </>
      )}
    </CardContent>
  </Card>

  {/* Category Breakdown Grid */}
  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
    {/* Financial Category */}
    {stats && (
      <>
        <Card
          className={`jeuwei-panel cursor-pointer transition-all duration-300 ${activeCategory === "financial" ? "scale-[1.02]" : ""}`}
          onClick={() => toggleCategory("financial")}
        >
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center text-indigo-400">
                <PiggyBank className="mr-2 h-5 w-5" />
                Financial
              </CardTitle>
              <ChevronRight
                className={`h-5 w-5 text-slate-400 transition-transform duration-300 ${activeCategory === "financial" ? "rotate-90" : ""}`}
              />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">Progress</span>
                  <span className="text-sm font-medium text-indigo-400">
                    {Math.min(Math.round((stats.stats.financial / 100) * 100), 100)}%
                  </span>
                </div>
                <Progress className="jeuwei-progress-track" value={Math.min(Math.round((stats.stats.financial / 100) * 100), 100)}>
                  <div className="h-full rounded-full bg-gradient-to-r from-indigo-700 to-indigo-400"></div>
                </Progress>
              </div>

              {activeCategory === "financial" && (
                <div className="mt-4 space-y-4 rounded-lg bg-blue-950/20 p-4">
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-slate-300">Recent Activities</h4>
                    <div className="space-y-2 text-xs">
                      {stats.recentActivities
                        .filter(activity => activity.category === 'financial')
                        .slice(0, 3)
                        .map(activity => (
                          <div key={activity.id} className="flex items-center justify-between">
                            <span>{
                              activity.action.length > 25 
                                ? `${activity.action.substring(0, 25)}...` 
                                : activity.action
                            }</span>
                            <span className="text-indigo-400">+{activity.expValue} EXP</span>
                          </div>
                        ))}
                      {stats.recentActivities.filter(activity => activity.category === 'financial').length === 0 && (
                        <div className="text-slate-500">No recent financial activities</div>
                      )}
                    </div>
                  </div>

                  <div>
                    <Button className="jeuwei-btn-secondary w-full text-xs">View Details</Button>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Habits Category */}
        <Card
          className={`jeuwei-panel cursor-pointer transition-all duration-300 ${activeCategory === "habits" ? "scale-[1.02]" : ""}`}
          onClick={() => toggleCategory("habits")}
        >
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center text-green-400">
                <Dumbbell className="mr-2 h-5 w-5" />
                Habits
              </CardTitle>
              <ChevronRight
                className={`h-5 w-5 text-slate-400 transition-transform duration-300 ${activeCategory === "habits" ? "rotate-90" : ""}`}
              />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">Progress</span>
                  <span className="text-sm font-medium text-green-400">
                    {Math.min(Math.round((stats.stats.habits / 100) * 100), 100)}%
                  </span>
                </div>
                <Progress className="jeuwei-progress-track" value={Math.min(Math.round((stats.stats.habits / 100) * 100), 100)}>
                  <div className="h-full rounded-full bg-gradient-to-r from-green-700 to-green-400"></div>
                </Progress>
              </div>

              {activeCategory === "habits" && (
                <div className="mt-4 space-y-4 rounded-lg bg-blue-950/20 p-4">
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-slate-300">Recent Activities</h4>
                    <div className="space-y-2 text-xs">
                      {stats.recentActivities
                        .filter(activity => activity.category === 'habits')
                        .slice(0, 3)
                        .map(activity => (
                          <div key={activity.id} className="flex items-center justify-between">
                            <span>{
                              activity.action.length > 25 
                                ? `${activity.action.substring(0, 25)}...` 
                                : activity.action
                            }</span>
                            <span className="text-green-400">+{activity.expValue} EXP</span>
                          </div>
                        ))}
                      {stats.recentActivities.filter(activity => activity.category === 'habits').length === 0 && (
                        <div className="text-slate-500">No recent habit activities</div>
                      )}
                    </div>
                  </div>

                  <div>
                    <Button className="jeuwei-btn-secondary w-full text-xs">View Details</Button>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Knowledge Category */}
        <Card
          className={`jeuwei-panel cursor-pointer transition-all duration-300 ${activeCategory === "knowledge" ? "scale-[1.02]" : ""}`}
          onClick={() => toggleCategory("knowledge")}
        >
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center text-blue-400">
                <Brain className="mr-2 h-5 w-5" />
                Knowledge
              </CardTitle>
              <ChevronRight
                className={`h-5 w-5 text-slate-400 transition-transform duration-300 ${activeCategory === "knowledge" ? "rotate-90" : ""}`}
              />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">Progress</span>
                  <span className="text-sm font-medium text-blue-400">
                    {Math.min(Math.round((stats.stats.knowledge / 100) * 100), 100)}%
                  </span>
                </div>
                <Progress className="jeuwei-progress-track" value={Math.min(Math.round((stats.stats.knowledge / 100) * 100), 100)}>
                  <div className="h-full rounded-full bg-gradient-to-r from-blue-700 to-blue-400"></div>
                </Progress>
              </div>

              {activeCategory === "knowledge" && (
                <div className="mt-4 space-y-4 rounded-lg bg-blue-950/20 p-4">
                  {/* Content similar to other categories */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-slate-300">Recent Activities</h4>
                    <div className="space-y-2 text-xs">
                      {stats.recentActivities
                        .filter(activity => activity.category === 'knowledge')
                        .slice(0, 3)
                        .map(activity => (
                          <div key={activity.id} className="flex items-center justify-between">
                            <span>{
                              activity.action.length > 25 
                                ? `${activity.action.substring(0, 25)}...` 
                                : activity.action
                            }</span>
                            <span className="text-blue-400">+{activity.expValue} EXP</span>
                          </div>
                        ))}
                      {stats.recentActivities.filter(activity => activity.category === 'knowledge').length === 0 && (
                        <div className="text-slate-500">No recent knowledge activities</div>
                      )}
                    </div>
                  </div>

                  <div>
                    <Button className="jeuwei-btn-secondary w-full text-xs">View Details</Button>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Skills Category */}
        <Card
          className={`jeuwei-panel cursor-pointer transition-all duration-300 ${activeCategory === "skills" ? "scale-[1.02]" : ""}`}
          onClick={() => toggleCategory("skills")}
        >
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center text-purple-400">
                <Activity className="mr-2 h-5 w-5" />
                Skills
              </CardTitle>
              <ChevronRight
                className={`h-5 w-5 text-slate-400 transition-transform duration-300 ${activeCategory === "skills" ? "rotate-90" : ""}`}
              />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">Progress</span>
                  <span className="text-sm font-medium text-purple-400">
                    {Math.min(Math.round((stats.stats.skills / 100) * 100), 100)}%
                  </span>
                </div>
                <Progress className="jeuwei-progress-track" value={Math.min(Math.round((stats.stats.skills / 100) * 100), 100)}>
                  <div className="h-full rounded-full bg-gradient-to-r from-purple-700 to-purple-400"></div>
                </Progress>
              </div>

              {activeCategory === "skills" && (
                <div className="mt-4 space-y-4 rounded-lg bg-blue-950/20 p-4">
                  {/* Similar content structure as other categories */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-slate-300">Recent Activities</h4>
                    <div className="space-y-2 text-xs">
                      {stats.recentActivities
                        .filter(activity => activity.category === 'skills')
                        .slice(0, 3)
                        .map(activity => (
                          <div key={activity.id} className="flex items-center justify-between">
                            <span>{
                              activity.action.length > 25 
                                ? `${activity.action.substring(0, 25)}...` 
                                : activity.action
                            }</span>
                            <span className="text-purple-400">+{activity.expValue} EXP</span>
                          </div>
                        ))}
                      {stats.recentActivities.filter(activity => activity.category === 'skills').length === 0 && (
                        <div className="text-slate-500">No recent skill activities</div>
                      )}
                    </div>
                  </div>

                  <div>
                    <Button className="jeuwei-btn-secondary w-full text-xs">View Details</Button>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Experiences Category */}
        <Card
          className={`jeuwei-panel cursor-pointer transition-all duration-300 ${activeCategory === "experiences" ? "scale-[1.02]" : ""}`}
          onClick={() => toggleCategory("experiences")}
        >
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center text-amber-400">
                <Globe className="mr-2 h-5 w-5" />
                Experiences
              </CardTitle>
              <ChevronRight
                className={`h-5 w-5 text-slate-400 transition-transform duration-300 ${activeCategory === "experiences" ? "rotate-90" : ""}`}
              />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">Progress</span>
                  <span className="text-sm font-medium text-amber-400">
                    {Math.min(Math.round((stats.stats.experiences / 100) * 100), 100)}%
                  </span>
                </div>
                <Progress className="jeuwei-progress-track" value={Math.min(Math.round((stats.stats.experiences / 100) * 100), 100)}>
                  <div className="h-full rounded-full bg-gradient-to-r from-amber-700 to-amber-400"></div>
                </Progress>
              </div>

              {activeCategory === "experiences" && (
                <div className="mt-4 space-y-4 rounded-lg bg-blue-950/20 p-4">
                  {/* Similar content structure */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-slate-300">Recent Activities</h4>
                    <div className="space-y-2 text-xs">
                      {stats.recentActivities
                        .filter(activity => activity.category === 'experiences')
                        .slice(0, 3)
                        .map(activity => (
                          <div key={activity.id} className="flex items-center justify-between">
                            <span>{
                              activity.action.length > 25 
                                ? `${activity.action.substring(0, 25)}...` 
                                : activity.action
                            }</span>
                            <span className="text-amber-400">+{activity.expValue} EXP</span>
                          </div>
                        ))}
                      {stats.recentActivities.filter(activity => activity.category === 'experiences').length === 0 && (
                        <div className="text-slate-500">No recent experience activities</div>
                      )}
                    </div>
                  </div>

                  <div>
                    <Button className="jeuwei-btn-secondary w-full text-xs">View Details</Button>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Network Category */}
        <Card
          className={`jeuwei-panel cursor-pointer transition-all duration-300 ${activeCategory === "network" ? "scale-[1.02]" : ""}`}
          onClick={() => toggleCategory("network")}
        >
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center text-rose-400">
                <Users className="mr-2 h-5 w-5" />
                Network
              </CardTitle>
              <ChevronRight
                className={`h-5 w-5 text-slate-400 transition-transform duration-300 ${activeCategory === "network" ? "rotate-90" : ""}`}
              />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">Progress</span>
                  <span className="text-sm font-medium text-rose-400">
                    {Math.min(Math.round((stats.stats.network / 100) * 100), 100)}%
                  </span>
                </div>
                <Progress className="jeuwei-progress-track" value={Math.min(Math.round((stats.stats.network / 100) * 100), 100)}>
                  <div className="h-full rounded-full bg-gradient-to-r from-rose-700 to-rose-400"></div>
                </Progress>
              </div>

              {activeCategory === "network" && (
                <div className="mt-4 space-y-4 rounded-lg bg-blue-950/20 p-4">
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-slate-300">Recent Activities</h4>
                    <div className="space-y-2 text-xs">
                      {stats.recentActivities
                        .filter(activity => activity.category === 'network')
                        .slice(0, 3)
                        .map(activity => (
                          <div key={activity.id} className="flex items-center justify-between">
                            <span>{
                              activity.action.length > 25 
                                ? `${activity.action.substring(0, 25)}...` 
                                : activity.action
                            }</span>
                            <span className="text-rose-400">+{activity.expValue} EXP</span>
                          </div>
                        ))}
                      {stats.recentActivities.filter(activity => activity.category === 'network').length === 0 && (
                        <div className="text-slate-500">No recent network activities</div>
                      )}
                    </div>
                  </div>

                  <div>
                    <Button className="jeuwei-btn-secondary w-full text-xs">View Details</Button>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </>
    )}
  </div>
</div>
  )
}