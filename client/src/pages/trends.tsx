import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { ProgressRing } from "@/components/progress-ring";
import type { AnalyticsData, MoodData } from "@/lib/types";

export default function Trends() {
  const { data: analytics, isLoading } = useQuery<AnalyticsData>({
    queryKey: ['/api/analytics'],
  });

  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const today = new Date().toISOString().split('T')[0];

  const { data: monthlyMoods = [] } = useQuery<MoodData[]>({
    queryKey: ['/api/moods', { startDate: thirtyDaysAgo, endDate: today }],
    queryFn: async () => {
      const response = await fetch(`/api/moods?startDate=${thirtyDaysAgo}&endDate=${today}`);
      return response.json();
    },
  });

  if (isLoading) {
    return (
      <div className="max-w-md mx-auto bg-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <i className="fas fa-spinner fa-spin text-primary text-2xl mb-4"></i>
          <p className="text-gray-600">Loading trends...</p>
        </div>
      </div>
    );
  }

  const getMoodTrend = () => {
    if (monthlyMoods.length < 2) return "neutral";
    
    const recent = monthlyMoods.slice(-7);
    const previous = monthlyMoods.slice(-14, -7);
    
    const recentAvg = recent.reduce((sum, mood) => sum + mood.value, 0) / recent.length;
    const previousAvg = previous.reduce((sum, mood) => sum + mood.value, 0) / previous.length;
    
    if (recentAvg > previousAvg + 0.2) return "improving";
    if (recentAvg < previousAvg - 0.2) return "declining";
    return "stable";
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "improving": return "fas fa-arrow-up text-success";
      case "declining": return "fas fa-arrow-down text-red-500";
      default: return "fas fa-minus text-gray-500";
    }
  };

  const getTrendText = (trend: string) => {
    switch (trend) {
      case "improving": return "Your mood is improving!";
      case "declining": return "Consider talking to someone";
      default: return "Your mood is stable";
    }
  };

  const moodTrend = getMoodTrend();

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen shadow-xl">
      {/* Header */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="safe-area-top gradient-primary text-white px-6 py-4"
      >
        <h1 className="text-xl font-semibold">Trends & Analytics</h1>
        <p className="text-indigo-100 text-sm">Track your mental health journey</p>
      </motion.header>

      <div className="pb-24 p-6 space-y-6">
        {/* Overall Progress */}
        {analytics && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Overall Progress</h3>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="text-center">
                    <ProgressRing percentage={analytics.checkInPercentage} color="#10B981">
                      <span className="text-lg font-semibold">{analytics.checkInPercentage}%</span>
                    </ProgressRing>
                    <p className="text-sm text-gray-600 mt-2">Weekly Check-ins</p>
                  </div>
                  
                  <div className="text-center">
                    <ProgressRing percentage={parseFloat(analytics.averageMood) * 20} color="#6366F1">
                      <span className="text-lg font-semibold">{analytics.averageMood}</span>
                    </ProgressRing>
                    <p className="text-sm text-gray-600 mt-2">Average Mood</p>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Current Streak</p>
                      <p className="text-2xl font-bold text-primary">{analytics.streak} days</p>
                    </div>
                    <div className="text-right">
                      <i className={getTrendIcon(moodTrend)}></i>
                      <p className="text-sm text-gray-600 mt-1">{getTrendText(moodTrend)}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Monthly Mood Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Monthly Mood Trend</h3>
              
              {monthlyMoods.length > 0 ? (
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex justify-between items-end h-32 mb-4">
                    {monthlyMoods.slice(-30).map((mood, index) => {
                      const height = (mood.value / 5) * 100;
                      let color = 'bg-gray-300';
                      
                      switch (mood.value) {
                        case 1: color = 'bg-red-400'; break;
                        case 2: color = 'bg-orange-400'; break;
                        case 3: color = 'bg-yellow-400'; break;
                        case 4: color = 'bg-green-400'; break;
                        case 5: color = 'bg-green-500'; break;
                      }
                      
                      return (
                        <motion.div
                          key={mood.id}
                          initial={{ height: 0 }}
                          animate={{ height: `${height}%` }}
                          transition={{ delay: 0.02 * index }}
                          className={`${color} w-1 rounded-full`}
                          title={`${new Date(mood.date).toLocaleDateString()}: ${mood.value}/5`}
                        />
                      );
                    })}
                  </div>
                  
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>30 days ago</span>
                    <span>Today</span>
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-500 py-8">
                  <i className="fas fa-chart-line text-3xl mb-2"></i>
                  <p>Start tracking your mood to see trends</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Mood Distribution */}
        {monthlyMoods.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Mood Distribution</h3>
                
                <div className="space-y-3">
                  {[
                    { value: 5, emoji: '🤗', label: 'Great', color: 'bg-green-500' },
                    { value: 4, emoji: '😊', label: 'Good', color: 'bg-green-400' },
                    { value: 3, emoji: '😐', label: 'Okay', color: 'bg-yellow-400' },
                    { value: 2, emoji: '😟', label: 'Bad', color: 'bg-orange-400' },
                    { value: 1, emoji: '😢', label: 'Terrible', color: 'bg-red-400' },
                  ].map((mood) => {
                    const count = monthlyMoods.filter(m => m.value === mood.value).length;
                    const percentage = monthlyMoods.length > 0 ? (count / monthlyMoods.length) * 100 : 0;
                    
                    return (
                      <div key={mood.value} className="flex items-center">
                        <span className="text-lg mr-3">{mood.emoji}</span>
                        <div className="flex-1">
                          <div className="flex justify-between text-sm mb-1">
                            <span>{mood.label}</span>
                            <span>{count} times ({percentage.toFixed(0)}%)</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${percentage}%` }}
                              transition={{ delay: 0.1 * mood.value }}
                              className={`${mood.color} h-2 rounded-full`}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Insights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Insights</h3>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <i className="fas fa-lightbulb text-yellow-500 text-lg mr-3 mt-1"></i>
                  <div>
                    <p className="font-medium">Consistency Tip</p>
                    <p className="text-sm text-gray-600">
                      Daily check-ins help identify patterns. Keep it up!
                    </p>
                  </div>
                </div>
                
                {analytics && analytics.streak > 7 && (
                  <div className="flex items-start">
                    <i className="fas fa-trophy text-yellow-500 text-lg mr-3 mt-1"></i>
                    <div>
                      <p className="font-medium">Achievement Unlocked!</p>
                      <p className="text-sm text-gray-600">
                        You've maintained a {analytics.streak}-day streak. Great job!
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

