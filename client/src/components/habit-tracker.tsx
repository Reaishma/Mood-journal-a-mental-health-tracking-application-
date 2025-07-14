
import { motion } from "framer-motion";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { HabitData, HabitEntryData } from "@/lib/types";

interface HabitTrackerProps {
  habits: HabitData[];
  habitEntries: HabitEntryData[];
  date: string;
}

export function HabitTracker({ habits, habitEntries, date }: HabitTrackerProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const toggleHabitMutation = useMutation({
    mutationFn: async ({ habitId, completed }: { habitId: number; completed: boolean }) => {
      const response = await apiRequest('PUT', `/api/habit-entries/${habitId}/${date}`, { completed });
      if (!response.ok) {
        throw new Error('Failed to update habit');
      }
      return response.json();
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['/api/habit-entries', date] });
      queryClient.invalidateQueries({ queryKey: ['/api/analytics'] });
      
      toast({
        title: variables.completed ? "Habit completed!" : "Habit unchecked",
        description: variables.completed ? "Great job keeping up with your routine!" : "No worries, try again tomorrow!",
      });
    },
    onError: (error) => {
      console.error('Habit toggle error:', error);
      toast({
        title: "Error",
        description: "Failed to update habit. Please try again.",
        variant: "destructive",
      });
    },
  });

  const getHabitEntry = (habitId: number) => {
    return habitEntries.find(entry => entry.habitId === habitId);
  };

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'success':
        return { bg: 'bg-success/10', text: 'text-success', border: 'border-success', fill: 'bg-success' };
      case 'info':
        return { bg: 'bg-info/10', text: 'text-info', border: 'border-info', fill: 'bg-info' };
      case 'warning':
        return { bg: 'bg-warning/10', text: 'text-warning', border: 'border-warning', fill: 'bg-warning' };
      case 'secondary':
        return { bg: 'bg-secondary/10', text: 'text-secondary', border: 'border-secondary', fill: 'bg-secondary' };
      default:
        return { bg: 'bg-primary/10', text: 'text-primary', border: 'border-primary', fill: 'bg-primary' };
    }
  };

  const getIconClass = (icon: string) => {
    switch (icon) {
      case 'dumbbell':
        return 'fas fa-dumbbell';
      case 'brain':
        return 'fas fa-brain';
      case 'sun':
        return 'fas fa-sun';
      case 'bed':
        return 'fas fa-bed';
      default:
        return 'fas fa-check';
    }
  };

  return (
    <div className="space-y-3">
      {habits.map((habit) => {
        const entry = getHabitEntry(habit.id);
        const isCompleted = entry?.completed || false;
        const colors = getColorClasses(habit.color);

        return (
          <motion.div
            key={habit.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0"
          >
            <div className="flex items-center">
              <div className={`w-10 h-10 ${colors.bg} rounded-full flex items-center justify-center mr-3`}>
                <i className={`${getIconClass(habit.icon)} ${colors.text} text-sm`}></i>
              </div>
              <div>
                <p className="font-medium text-gray-800">{habit.name}</p>
                <p className="text-sm text-gray-500">{habit.target}</p>
              </div>
            </div>
            <motion.button
              type="button"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (!toggleHabitMutation.isPending) {
                  toggleHabitMutation.mutate({ 
                    habitId: habit.id, 
                    completed: !isCompleted 
                  });
                }
              }}
              disabled={toggleHabitMutation.isPending}
              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 ${
                isCompleted
                  ? `${colors.border} ${colors.fill}`
                  : `border-gray-300 hover:${colors.border}`
              } ${toggleHabitMutation.isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {toggleHabitMutation.isPending ? (
                <motion.i 
                  className="fas fa-spinner fa-spin text-white text-xs"
                />
              ) : isCompleted ? (
                <motion.i 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="fas fa-check text-white text-xs"
                />
              ) : null}
            </motion.button>
          </motion.div>
        );
      })}
    </div>
  );
}
