// app/dashboard/page.tsx
"use client"

import { useState, useEffect } from "react"
import { Activity, Brain, Dumbbell, Globe, PiggyBank, Plus, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import StatCircle from "@/components/stat-circle"
import ActivityItem from "@/components/activity-item"
import { useStats } from "@/hooks/use-stats"
import { useProfile } from "@/hooks/use-profile"
import { useAuth } from "@clerk/nextjs"

interface Activity {
  id: string;
  action: string;
  category: string;
  expValue: number;
  date: string; // or Date if you prefer
}

export default function Dashboard() {
  const { isLoaded, isSignedIn } = useAuth();
  const { getUserStats, loading: statsLoading } = useStats();
  const { getUserProfile, loading: profileLoading } = useProfile();
  
  const [stats, setStats] = useState<{
    level: number;
    totalExp: number;
    nextLevelExp: number;
    progress: number;
    stats: {
      financial: number;
      habits: number;
      knowledge: number;
      skills: number;
      experiences: number;
      network: number;
    };
    recentActivities: Activity[];
  }>({
    level: 1,
    totalExp: 0,
    nextLevelExp: 50,
    progress: 0,
    stats: {
      financial: 0,
      habits: 0,
      knowledge: 0,
      skills: 0,
      experiences: 0,
      network: 0
    },
    recentActivities: []
  });
  
  const [profile, setProfile] = useState<{
    id: string;
    username: string;
    firstName: string | null;
    lastName: string | null;
    imageUrl: string | null;
  }>({
    id: '',
    username: '',
    firstName: null,
    lastName: null,
    imageUrl: null
  });

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      fetchData();
    }
  }, [isLoaded, isSignedIn]);

  const fetchData = async () => {
    // Fetch user stats
    const userStats = await getUserStats();
    if (userStats) {
      setStats(userStats);
    }
    
    // Fetch user profile
    const userProfile = await getUserProfile();
    if (userProfile) {
      setProfile(userProfile);
    }
  };

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  if (!isSignedIn) {
    return <div>Please sign in to view your dashboard</div>;
  }

  const loading = statsLoading || profileLoading;
  
  // Calculate stat values for display
  const strengthValue = Math.round((stats.stats.habits) / 2) || 10;
  const intelligenceValue = Math.round((stats.stats.knowledge + stats.stats.skills) / 2) || 15;
  const charismaValue = Math.round((stats.stats.network + stats.stats.experiences) / 2) || 8;
  const vitality = stats.stats.habits || 12;
  const wealth = stats.stats.financial || 5;
  const experience = stats.stats.experiences || 7;

  return (
    <div className="grid gap-8 md:grid-cols-3">
      {/* Character Visualization Card */}
      <Card className="jeuwei-panel col-span-full md:col-span-1">
        <CardHeader className="pb-2">
          <CardTitle className="jeuwei-subheading">Character Status</CardTitle>
          <CardDescription className="text-slate-400">Your current attributes and level</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="hexagon-pattern flex flex-col items-center">
            <div className="relative mb-6 mt-4">
              <div className="magical-circle"></div>
              <Avatar className="h-24 w-24 animate-pulse-glow border-2 border-blue-500/50">
                {profile.imageUrl ? (
                  <AvatarImage src={profile.imageUrl} alt="Character avatar" />
                ) : (
                  <AvatarFallback className="bg-blue-950 text-blue-400">
                    {profile.firstName?.[0] || profile.username?.[0] || 'J'}
                  </AvatarFallback>
                )}
              </Avatar>
              <Badge className="absolute -right-2 -top-2 bg-gradient-to-r from-blue-700 to-blue-500 px-2 py-1 text-xs font-bold">
                LVL {stats.level}
              </Badge>
            </div>

            <div className="mb-6 grid grid-cols-3 gap-4">
              <StatCircle label="STR" value={strengthValue} maxValue={100} color="from-blue-700 to-blue-400" />
              <StatCircle label="INT" value={intelligenceValue} maxValue={100} color="from-indigo-700 to-indigo-400" />
              <StatCircle label="CHA" value={charismaValue} maxValue={100} color="from-purple-700 to-purple-400" />
            </div>

            <div className="grid w-full grid-cols-2 gap-4">
              <div className="flex flex-col space-y-1">
                <span className="text-xs text-slate-400">Vitality</span>
                <Progress className="jeuwei-progress-track h-2" value={vitality * 5} />
              </div>
              <div className="flex flex-col space-y-1">
                <span className="text-xs text-slate-400">Wealth</span>
                <Progress className="jeuwei-progress-track h-2" value={wealth * 5} />
              </div>
              <div className="flex flex-col space-y-1">
                <span className="text-xs text-slate-400">Experience</span>
                <Progress className="jeuwei-progress-track h-2" value={experience * 5} />
              </div>
              <div className="flex flex-col space-y-1">
                <span className="text-xs text-slate-400">Overall</span>
                <Progress
                  className="jeuwei-progress-track h-2"
                  value={
                    ((strengthValue +
                      intelligenceValue +
                      charismaValue +
                      vitality +
                      wealth +
                      experience) /
                      6) *
                    5
                  }
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Level Progress Card */}
      <Card className="jeuwei-panel col-span-full md:col-span-2">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="jeuwei-subheading">Level Progress</CardTitle>
              <CardDescription className="text-slate-400">Your journey to the next level</CardDescription>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-900/30 text-xl font-bold text-blue-400">
              {stats.level}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="hexagon-pattern space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400">Current EXP</span>
                <span className="jeuwei-stat animate-count">{stats.totalExp}</span>
              </div>
              <Progress className="jeuwei-progress-track" value={stats.progress}>
                <div className="jeuwei-progress-fill" style={{ width: `${stats.progress}%` }}></div>
              </Progress>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400">Next Level</span>
                <span className="text-sm text-slate-400">
                  {stats.totalExp} / {stats.nextLevelExp} EXP
                </span>
              </div>
            </div>

            <div className="rounded-lg bg-blue-950/30 p-4">
              <div className="text-sm text-slate-300">
                <span className="font-medium">Level Formula:</span> (Level² × 50) EXP required
              </div>
              <div className="mt-2 text-sm text-slate-400">
                You need <span className="font-medium text-blue-400">{stats.nextLevelExp - stats.totalExp} more EXP</span> to reach level{" "}
                {stats.level + 1}
              </div>
            </div>

            <Button className="jeuwei-btn-primary w-full" asChild>
              <a href="/journal">
                <Plus className="mr-2 h-4 w-4" /> Add New Journal Entry
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activities Panel */}
      <Card className="jeuwei-panel col-span-full">
        <CardHeader className="pb-2">
          <CardTitle className="jeuwei-subheading">Recent Activities</CardTitle>
          <CardDescription className="text-slate-400">Your latest achievements and progress</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center p-8">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-500 border-t-transparent"></div>
            </div>
          ) : stats.recentActivities.length === 0 ? (
            <div className="text-center p-8 text-slate-400">
              No activities yet. Start journaling to track your progress!
            </div>
          ) : (
            <div className="space-y-4">
              {stats.recentActivities.map((activity) => {
                // Determine icon based on category
                let icon;
                let color;
                
                switch(activity.category) {
                  case 'knowledge':
                    icon = <Brain className="h-5 w-5 text-indigo-400" />;
                    color = "bg-indigo-500";
                    break;
                  case 'habits':
                    icon = <Dumbbell className="h-5 w-5 text-green-400" />;
                    color = "bg-green-500";
                    break;
                  case 'financial':
                    icon = <PiggyBank className="h-5 w-5 text-blue-400" />;
                    color = "bg-blue-500";
                    break;
                  case 'network':
                    icon = <Users className="h-5 w-5 text-rose-400" />;
                    color = "bg-rose-500";
                    break;
                  case 'experiences':
                    icon = <Globe className="h-5 w-5 text-amber-400" />;
                    color = "bg-amber-500";
                    break;
                  case 'skills':
                    icon = <Activity className="h-5 w-5 text-purple-400" />;
                    color = "bg-purple-500";
                    break;
                  default:
                    icon = <Activity className="h-5 w-5 text-blue-400" />;
                    color = "bg-blue-500";
                }
                
                // Calculate relative time
                const activityDate = new Date(activity.date);
                const today = new Date();
                const diffDays = Math.floor((today.getTime() - activityDate.getTime()) / (1000 * 60 * 60 * 24));
                
                let timeLabel;
                if (diffDays === 0) {
                  timeLabel = "Today";
                } else if (diffDays === 1) {
                  timeLabel = "Yesterday";
                } else if (diffDays < 7) {
                  timeLabel = `${diffDays} days ago`;
                } else {
                  timeLabel = activityDate.toLocaleDateString();
                }

                return (
                  <ActivityItem
                    key={activity.id}
                    icon={icon}
                    title={activity.action.length > 30 ? `${activity.action.substring(0, 30)}...` : activity.action}
                    description={activity.action}
                    category={activity.category.charAt(0).toUpperCase() + activity.category.slice(1)}
                    exp={activity.expValue}
                    time={timeLabel}
                    color={color}
                  />
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}