import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertMoodSchema, 
  insertHabitSchema, 
  insertHabitEntrySchema, 
  insertJournalEntrySchema 
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Mood routes
  app.post("/api/moods", async (req, res) => {
    try {
      const moodData = insertMoodSchema.parse(req.body);
      const mood = await storage.createMood(moodData);
      res.json(mood);
    } catch (error) {
      res.status(400).json({ message: "Invalid mood data" });
    }
  });

  app.get("/api/moods/:date", async (req, res) => {
    const mood = await storage.getMoodByDate(req.params.date);
    if (mood) {
      res.json(mood);
    } else {
      res.status(404).json({ message: "Mood not found" });
    }
  });

  app.get("/api/moods", async (req, res) => {
    const { startDate, endDate } = req.query;
    if (startDate && endDate) {
      const moods = await storage.getMoodsByDateRange(startDate as string, endDate as string);
      res.json(moods);
    } else {
      res.status(400).json({ message: "Start date and end date are required" });
    }
  });

  // Habit routes
  app.get("/api/habits", async (req, res) => {
    const habits = await storage.getHabits();
    res.json(habits);
  });

  app.post("/api/habits", async (req, res) => {
    try {
      const habitData = insertHabitSchema.parse(req.body);
      const habit = await storage.createHabit(habitData);
      res.json(habit);
    } catch (error) {
      res.status(400).json({ message: "Invalid habit data" });
    }
  });

  // Habit entry routes
  app.get("/api/habit-entries/:date", async (req, res) => {
    const entries = await storage.getHabitEntriesByDate(req.params.date);
    res.json(entries);
  });

  app.put("/api/habit-entries/:habitId/:date", async (req, res) => {
    try {
      const habitId = parseInt(req.params.habitId);
      const date = req.params.date;
      const { completed } = req.body;
      
      const entry = await storage.updateHabitEntry(habitId, date, completed);
      res.json(entry);
    } catch (error) {
      res.status(400).json({ message: "Invalid habit entry data" });
    }
  });

  // Journal routes
  app.post("/api/journal-entries", async (req, res) => {
    try {
      const entryData = insertJournalEntrySchema.parse(req.body);
      const entry = await storage.createJournalEntry(entryData);
      res.json(entry);
    } catch (error) {
      res.status(400).json({ message: "Invalid journal entry data" });
    }
  });

  app.get("/api/journal-entries", async (req, res) => {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
    const entries = await storage.getJournalEntries(limit);
    res.json(entries);
  });

  // Analytics route
  app.get("/api/analytics", async (req, res) => {
    const today = new Date().toISOString().split('T')[0];
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    const weeklyMoods = await storage.getMoodsByDateRange(weekAgo, today);
    const todayHabitEntries = await storage.getHabitEntriesByDate(today);
    const habits = await storage.getHabits();
    
    const completedHabits = todayHabitEntries.filter(entry => entry.completed).length;
    const totalHabits = habits.length;
    const checkInPercentage = weeklyMoods.length > 0 ? Math.round((weeklyMoods.length / 7) * 100) : 0;
    const averageMood = weeklyMoods.length > 0 
      ? (weeklyMoods.reduce((sum, mood) => sum + mood.value, 0) / weeklyMoods.length).toFixed(1)
      : "0";
    
    // Calculate streak
    let streak = 0;
    const sortedMoods = weeklyMoods.sort((a, b) => b.date.localeCompare(a.date));
    let currentDate = new Date();
    
    for (let i = 0; i < 30; i++) {
      const dateStr = currentDate.toISOString().split('T')[0];
      const hasMood = sortedMoods.some(mood => mood.date === dateStr);
      
      if (hasMood) {
        streak++;
      } else if (i > 0) {
        break;
      }
      
      currentDate.setDate(currentDate.getDate() - 1);
    }

    res.json({
      checkInPercentage,
      checkInCount: `${weeklyMoods.length} of 7 days`,
      averageMood,
      streak,
      completedHabits,
      totalHabits,
      weeklyMoods: weeklyMoods.map(mood => ({
        date: mood.date,
        value: mood.value
      }))
    });
  });

  const httpServer = createServer(app);
  return httpServer;
}

