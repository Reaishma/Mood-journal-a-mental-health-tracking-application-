import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { MoodSelector } from "@/components/mood-selector";
import { ProgressRing } from "@/components/progress-ring";
import { HabitTracker } from "@/components/habit-tracker";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Bell } from "lucide-react";
import type { MoodData, HabitData, HabitEntryData, JournalEntryData, AnalyticsData } from "@/lib/types";

export default function Home() {
  const [selectedMood, setSelectedMood] = useState<number>();
  const [journalNote, setJournalNote] = useState("");
  const today = new Date().toISOString().split('T')[0];
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Queries
  const { data: todayMood } = useQuery<MoodData>({
    queryKey: ['/api/moods', today],
    enabled: true,
  });

  const { data: habits = [] } = useQuery<HabitData[]>({
    queryKey: ['/api/habits'],
  });

  const { data: habitEntries = [] } = useQuery<HabitEntryData[]>({
    queryKey: ['/api/habit-entries', today],
  });

  const { data: analytics } = useQuery<AnalyticsData>({
    queryKey: ['/api/analytics'],
  });

  const { data: recentEntries = [] } = useQuery<JournalEntryData[]>({
    queryKey: ['/api/journal-entries'],
    select: (data) => data.slice(0, 3),
  });

  // Mutations
  const saveMoodMutation = useMutation({
    mutationFn: async () => {
      if (!selectedMood) throw new Error("No mood selected");
      
      const moodData = {
        value: selectedMood,
        note: journalNote || undefined,
        date: today,
      };

      const response = await apiRequest('POST', '/api/moods', moodData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/moods', today] });
      queryClient.invalidateQueries({ queryKey: ['/api/analytics'] });
      
      if (journalNote.trim()) {
        createJournalEntry();
      }
      
      toast({
        title: "Mood saved!",
        description: "Your daily check-in has been recorded.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to save mood. Please try again.",
        variant: "destructive",
      });
    },
  });

  const createJournalEntry = async () => {
    if (!journalNote.trim() || !selectedMood) return;
    
    try {
      await apiRequest('POST', '/api/journal-entries', {
        content: journalNote,
        moodValue: selectedMood,
        date: today,
      });
      
      queryClient.invalidateQueries({ queryKey: ['/api/journal-entries'] });
      setJournalNote("");
    } catch (error) {
      console.error("Failed to save journal entry:", error);
    }
  };

  // Initialize mood if already logged today
  useState(() => {
    if (todayMood && !selectedMood) {
      setSelectedMood(todayMood.value);
      setJournalNote(todayMood.note || "");
    }
  });

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getMoodEmoji = (value?: number) => {
    if (!value) return '😐';
    const emojis = { 1: '😢', 2: '😟', 3: '😐', 4: '😊', 5: '🤗' };
    return emojis[value as keyof typeof emojis] || '😐';
  };

  const getWeeklyChartBars = () => {
    if (!analytics?.weeklyMoods) return [];
    
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - weekStart.getDay() + 1);
    
    return days.map((day, index) => {
      const date = new Date(weekStart);
      date.setDate(date.getDate() + index);
      const dateStr = date.toISOString().split('T')[0];
      
      const mood = analytics.weeklyMoods.find(m => m.date === dateStr);
      const height = mood ? (mood.value / 5) * 100 : 20;
      
      let color = 'bg-gray-300';
      if (mood) {
        switch (mood.value) {
          case 1: color = 'bg-red-400'; break;
          case 2: color = 'bg-orange-400'; break;
          case 3: color = 'bg-yellow-400'; break;
          case 4: color = 'bg-green-400'; break;
          case 5: color = 'bg-green-500'; break;
        }
      }
      
      return { day, height, color, isToday: dateStr === today };
    });
  };

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen shadow-xl relative">
      {/* Header */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="safe-area-top gradient-primary text-white px-6 py-4"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold">MindWell</h1>
            <p className="text-indigo-100 text-sm">
              {formatDate(new Date())}
            </p>
          </div>
          <div className="relative">
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-white hover:bg-white/20"
              onClick={() => toast({
                title: "Notifications",
                description: "You're all caught up! No new notifications.",
              })}
            >
              <Bell className="h-5 w-5" />
            </Button>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
          </div>
        </div>
      </motion.header>

      <div className="pb-24">
        {/* Daily Mood Check-in */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="px-6 py-4"
        >
          <Card className="card-hover">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-800">How are you feeling?</h2>
                {analytics && (
                  <div className="flex items-center text-success text-sm font-medium">
                    <i className="fas fa-fire mr-1"></i>
                    <span>{analytics.streak} day streak</span>
                  </div>
                )}
              </div>
              
              <div className="mb-6">
                <MoodSelector 
                  selectedMood={selectedMood} 
                  onMoodSelect={setSelectedMood}
                />
              </div>
              
              <div className="bg-gray-50 rounded-xl p-4 mb-4">
                <Textarea
                  placeholder="What's on your mind today? (Optional)"
                  value={journalNote}
                  onChange={(e) => setJournalNote(e.target.value)}
                  className="border-none bg-transparent resize-none focus-visible:ring-0 focus-visible:ring-offset-0"
                  rows={3}
                />
              </div>
              
              <Button 
                onClick={() => saveMoodMutation.mutate()}
                disabled={!selectedMood || saveMoodMutation.isPending}
                className="w-full gradient-primary text-white floating-button"
              >
                {saveMoodMutation.isPending ? (
                  <>
                    <i className="fas fa-spinner fa-spin mr-2"></i>
                    Saving...
                  </>
                ) : (
                  <>
                    <i className="fas fa-check mr-2"></i>
                    Save Check-in
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Progress Overview */}
        {analytics && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="px-6 py-2"
          >
            <Card className="card-hover">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">This Week's Progress</h3>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="text-center">
                    <ProgressRing percentage={analytics.checkInPercentage} color="#10B981">
                      <span className="text-lg font-semibold text-gray-800">
                        {analytics.checkInPercentage}%
                      </span>
                    </ProgressRing>
                    <p className="text-sm text-gray-600 mt-2">Check-ins</p>
                    <p className="text-xs text-success font-medium">{analytics.checkInCount}</p>
                  </div>
                  
                  <div className="text-center">
                    <ProgressRing percentage={parseFloat(analytics.averageMood) * 20} color="#6366F1">
                      <span className="text-lg font-semibold text-gray-800">
                        {analytics.averageMood}
                      </span>
                    </ProgressRing>
                    <p className="text-sm text-gray-600 mt-2">Avg Mood</p>
                    <p className="text-xs text-primary font-medium">Above baseline</p>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex justify-between items-end h-24 mb-2">
                    {getWeeklyChartBars().map((bar, index) => (
                      <div key={index} className="flex flex-col items-center">
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: `${bar.height}%` }}
                          transition={{ delay: 0.1 * index, duration: 0.5 }}
                          className={`${bar.color} rounded-full mb-2 w-2 transition-all duration-500`}
                        />
                        <span className={`text-xs ${
                          bar.isToday ? 'text-primary font-medium' : 'text-gray-500'
                        }`}>
                          {bar.day}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Wellness Habits */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="px-6 py-2"
        >
          <Card className="card-hover">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Today's Habits</h3>
                <Button 
                  variant="ghost" 
                  className="text-primary text-sm font-medium p-0 h-auto"
                  onClick={() => toast({
                    title: "Habit Management",
                    description: "Habit management feature coming soon!",
                  })}
                >
                  Manage
                </Button>
              </div>
              
              <HabitTracker 
                habits={habits}
                habitEntries={habitEntries}
                date={today}
              />
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Journal Entries */}
        {recentEntries.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="px-6 py-2"
          >
            <Card className="card-hover">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">Recent Thoughts</h3>
                  <Button variant="ghost" className="text-primary text-sm font-medium p-0 h-auto">
                    View All
                  </Button>
                </div>
                
                <div className="space-y-4">
                  {recentEntries.map((entry) => (
                    <div key={entry.id} className="p-4 bg-gray-50 rounded-xl">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <span className="text-lg mr-2">
                            {getMoodEmoji(entry.moodValue)}
                          </span>
                          <span className="text-sm text-gray-500">
                            {new Date(entry.createdAt).toLocaleDateString('en-US', {
                              weekday: 'short',
                              month: 'short',
                              day: 'numeric',
                              hour: 'numeric',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                        <Button variant="ghost" size="icon" className="h-6 w-6 text-gray-400 hover:text-gray-600">
                          <i className="fas fa-share-alt text-sm"></i>
                        </Button>
                      </div>
                      <p className="text-gray-700 text-sm">{entry.content}</p>
                    </div>
                  ))}
                </div>
                
                <Button variant="outline" className="w-full mt-4">
                  <i className="fas fa-plus mr-2"></i>
                  Write New Entry
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>

      {/* Floating Action Button */}
      <motion.button
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-20 right-6 w-14 h-14 gradient-primary text-white rounded-full shadow-lg floating-button z-10"
      >
        <i className="fas fa-plus text-lg"></i>
      </motion.button>
    </div>
  );
}

