import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import type { AnalyticsData } from "@/lib/types";

export default function Profile() {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [dataSharing, setDataSharing] = useState(false);
  const { toast } = useToast();

  const { data: analytics } = useQuery<AnalyticsData>({
    queryKey: ['/api/analytics'],
  });



  return (
    <div className="max-w-md mx-auto bg-white min-h-screen shadow-xl">
      {/* Header */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="safe-area-top gradient-primary text-white px-6 py-4"
      >
        <h1 className="text-xl font-semibold">Profile</h1>
        <p className="text-indigo-100 text-sm">Manage your account and preferences</p>
      </motion.header>

      <div className="pb-24 p-6 space-y-6">
        {/* User Profile */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4 mb-4">
                <Avatar className="w-16 h-16">
                  <AvatarFallback className="bg-primary text-white text-xl">
                    MW
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-semibold">MindWell User</h3>
                  <p className="text-gray-600">Mental health journey started</p>
                  <p className="text-sm text-gray-500">
                    {new Date().toLocaleDateString('en-US', { 
                      month: 'long', 
                      year: 'numeric' 
                    })}
                  </p>
                </div>
              </div>
              
              <Button variant="outline" className="w-full">
                <i className="fas fa-edit mr-2"></i>
                Edit Profile
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Statistics */}
        {analytics && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Your Journey</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-gray-50 rounded-xl">
                    <div className="text-2xl font-bold text-primary mb-1">
                      {analytics.streak}
                    </div>
                    <div className="text-sm text-gray-600">Day Streak</div>
                  </div>
                  
                  <div className="text-center p-4 bg-gray-50 rounded-xl">
                    <div className="text-2xl font-bold text-success mb-1">
                      {analytics.averageMood}
                    </div>
                    <div className="text-sm text-gray-600">Avg Mood</div>
                  </div>
                  
                  <div className="text-center p-4 bg-gray-50 rounded-xl">
                    <div className="text-2xl font-bold text-info mb-1">
                      {analytics.checkInPercentage}%
                    </div>
                    <div className="text-sm text-gray-600">Check-in Rate</div>
                  </div>
                  
                  <div className="text-center p-4 bg-gray-50 rounded-xl">
                    <div className="text-2xl font-bold text-warning mb-1">
                      {Math.round((analytics.completedHabits / analytics.totalHabits) * 100)}%
                    </div>
                    <div className="text-sm text-gray-600">Habits Done</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Settings</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Notifications</p>
                    <p className="text-sm text-gray-600">Daily check-in reminders</p>
                  </div>
                  <Switch
                    checked={notifications}
                    onCheckedChange={(checked) => {
                      setNotifications(checked);
                      toast({
                        title: checked ? "Notifications enabled" : "Notifications disabled",
                        description: checked ? "You'll receive daily reminders" : "Reminders turned off",
                      });
                    }}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Dark Mode</p>
                    <p className="text-sm text-gray-600">Toggle dark theme</p>
                  </div>
                  <Switch
                    checked={darkMode}
                    onCheckedChange={(checked) => {
                      setDarkMode(checked);
                      toast({
                        title: checked ? "Dark mode enabled" : "Dark mode disabled",
                        description: "Theme settings updated",
                      });
                    }}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Anonymous Analytics</p>
                    <p className="text-sm text-gray-600">Help improve the app</p>
                  </div>
                  <Switch
                    checked={dataSharing}
                    onCheckedChange={(checked) => {
                      setDataSharing(checked);
                      toast({
                        title: checked ? "Analytics enabled" : "Analytics disabled",
                        description: checked ? "Helping improve the app" : "Data sharing turned off",
                      });
                    }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>


</div>
    </div>
  );
}
