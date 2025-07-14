export interface MoodData {
  id: number;
  value: number;
  note?: string;
  date: string;
  createdAt: Date;
}

export interface HabitData {
  id: number;
  name: string;
  icon: string;
  target: string;
  color: string;
  isActive: boolean;
}

export interface HabitEntryData {
  id: number;
  habitId: number;
  date: string;
  completed: boolean;
}

export interface JournalEntryData {
  id: number;
  content: string;
  moodValue?: number;
  date: string;
  createdAt: Date;
}

export interface AnalyticsData {
  checkInPercentage: number;
  checkInCount: string;
  averageMood: string;
  streak: number;
  completedHabits: number;
  totalHabits: number;
  weeklyMoods: Array<{
    date: string;
    value: number;
  }>;
}

export const MOOD_EMOJIS = {
  1: '😢',
  2: '😟',
  3: '😐',
  4: '😊',
  5: '🤗'
};

export const MOOD_LABELS = {
  1: 'Terrible',
  2: 'Bad',
  3: 'Okay',
  4: 'Good',
  5: 'Great'
};

export const HABIT_ICONS = {
  dumbbell: 'fas fa-dumbbell',
  brain: 'fas fa-brain',
  sun: 'fas fa-sun',
  bed: 'fas fa-bed'
};

