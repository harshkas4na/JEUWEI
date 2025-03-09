// app/journal/page.tsx
"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { useJournal } from "@/hooks/use-journal"
import { JournalEntry } from "@/app/types"
import { useAuth } from "@clerk/nextjs"

export default function JournalPage() {
  const { isLoaded, isSignedIn } = useAuth();
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [journalContent, setJournalContent] = useState("")
  const [entries, setEntries] = useState<JournalEntry[]>([])
  const [currentEntry, setCurrentEntry] = useState<JournalEntry | null>(null)
  const { createJournalEntry, getJournalEntries, loading, error } = useJournal()

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      fetchEntries();
    }
  }, [isLoaded, isSignedIn]);

  const fetchEntries = async () => {
    const fetchedEntries = await getJournalEntries();
    if (fetchedEntries.length > 0) {
      setEntries(fetchedEntries);
      
      // Find entry for selected date if it exists
      const dateString = selectedDate.toISOString().split('T')[0];
      const entryForDate = fetchedEntries.find((entry:any) => 
        new Date(entry.date).toISOString().split('T')[0] === dateString
      );
      
      if (entryForDate) {
        setCurrentEntry(entryForDate);
        setJournalContent(entryForDate.content);
      } else {
        setCurrentEntry(null);
        setJournalContent("");
      }
    }
  };

  const handleSave = async () => {
    if (!journalContent.trim()) return;
    
    const newEntry = await createJournalEntry(journalContent);
    
    if (newEntry) {
      // Add to entries and set as current
      setEntries([newEntry, ...entries.filter(e => e.id !== newEntry.id)]);
      setCurrentEntry(newEntry);
      
      // Show success message or notification here
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  };

  const previousDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() - 1);
    setSelectedDate(newDate);
    updateEntryForDate(newDate);
  };

  const nextDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + 1);
    setSelectedDate(newDate);
    updateEntryForDate(newDate);
  };

  const updateEntryForDate = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    const entryForDate = entries.find(entry => 
      new Date(entry.date).toISOString().split('T')[0] === dateString
    );
    
    if (entryForDate) {
      setCurrentEntry(entryForDate);
      setJournalContent(entryForDate.content);
    } else {
      setCurrentEntry(null);
      setJournalContent("");
    }
  };

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  if (!isSignedIn) {
    return <div>Please sign in to access your journal</div>;
  }

  return (
    <div className="grid gap-8 md:grid-cols-3">
      {/* Calendar Component */}
      <Card className="jeuwei-panel md:col-span-1">
        <CardHeader className="pb-2">
          <CardTitle className="jeuwei-subheading">Calendar</CardTitle>
          <CardDescription className="text-slate-400">Select a date to journal</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="hexagon-pattern space-y-4">
            <div className="flex items-center justify-between">
              <Button variant="outline" size="icon" onClick={previousDay}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm font-medium text-slate-300">
                {selectedDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
              </span>
              <Button variant="outline" size="icon" onClick={nextDay}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            {/* Calendar implementation */}
            <div className="rounded-lg bg-blue-950/30 p-4">
              {/* Calendar code remains the same */}
            </div>

            <div className="space-y-2 rounded-lg bg-blue-950/30 p-4">
              <h3 className="text-sm font-medium text-slate-300">Journal Streak</h3>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Current Streak</span>
                <span className="font-medium text-blue-400">
                  {entries.length > 0 ? '7 days' : '0 days'}
                </span>
              </div>
              <Progress className="jeuwei-progress-track h-2" value={entries.length > 0 ? 70 : 0}>
                <div className="jeuwei-progress-fill h-full"></div>
              </Progress>
              <div className="text-xs text-slate-400">
                {entries.length > 0 
                  ? '3 more days to reach your best streak!' 
                  : 'Start journaling to build your streak!'}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Journal Editor */}
      <Card className="jeuwei-panel md:col-span-2">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="jeuwei-subheading">Journal Entry</CardTitle>
              <CardDescription className="text-slate-400">{formatDate(selectedDate)}</CardDescription>
            </div>
            <Button 
              className="jeuwei-btn-primary flex items-center gap-2" 
              onClick={handleSave} 
              disabled={loading || !journalContent.trim()}
            >
              {loading ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-400 border-t-transparent"></div>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  <span>Save Entry</span>
                </>
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="hexagon-pattern space-y-4">
            {error && (
              <div className="rounded-md bg-red-900/20 p-3 text-red-400 text-sm">
                {error}
              </div>
            )}
            
            <Textarea
              className="min-h-[300px] resize-none border-blue-900/30 bg-blue-950/20 text-slate-300 placeholder:text-slate-500 focus:border-blue-500/50 focus:ring-blue-500/20"
              placeholder="Write about your day, achievements, challenges, and goals..."
              value={journalContent}
              onChange={(e) => setJournalContent(e.target.value)}
            />

            <div className="flex items-center justify-between text-xs text-slate-400">
              <div>{journalContent.length} characters</div>
              <div>{journalContent.split(/\s+/).filter(Boolean).length} words</div>
            </div>

            <div className="rounded-lg bg-blue-950/30 p-4">
              <h3 className="mb-2 text-sm font-medium text-slate-300">Entry Stats</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">EXP Gained</span>
                    <span className="font-medium text-blue-400">
                      {currentEntry ? currentEntry.expGained : 0}
                    </span>
                  </div>
                  <Progress 
                    className="jeuwei-progress-track h-1" 
                    value={currentEntry ? 100 : 0}
                  >
                    <div className="jeuwei-progress-fill h-full"></div>
                  </Progress>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Activities</span>
                    <span className="font-medium text-blue-400">
                      {currentEntry ? currentEntry.activities.length : 0}
                    </span>
                  </div>
                  <Progress 
                    className="jeuwei-progress-track h-1" 
                    value={currentEntry && currentEntry.activities.length > 0 ? 100 : 0}
                  >
                    <div className="jeuwei-progress-fill h-full"></div>
                  </Progress>
                </div>
              </div>

              {currentEntry && currentEntry.activities.length > 0 && (
                <div className="mt-4 space-y-2">
                  <h4 className="text-xs font-medium text-slate-300">Detected Activities:</h4>
                  <div className="max-h-40 overflow-y-auto space-y-1 text-xs">
                    {currentEntry.activities.map((activity) => (
                      <div key={activity.id} className="flex justify-between">
                        <span className="text-slate-300">{activity.action.length > 50 
                          ? `${activity.action.substring(0, 50)}...` 
                          : activity.action}
                        </span>
                        <span className="text-blue-400">+{activity.expValue} EXP</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}