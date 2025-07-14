import { 
  moods, habits, habitEntries, journalEntries,
  type Mood, type InsertMood,
  type Habit, type InsertHabit,
  type HabitEntry, type InsertHabitEntry,
  type JournalEntry, type InsertJournalEntry
} from "@shared/schema";

export interface IStorage {
  // Mood operations
  createMood(mood: InsertMood): Promise<Mood>;
  getMoodByDate(date: string): Promise<Mood | undefined>;
  getMoodsByDateRange(startDate: string, endDate: string): Promise<Mood[]>;
  
  // Habit operations
  createHabit(habit: InsertHabit): Promise<Habit>;
  getHabits(): Promise<Habit[]>;
  updateHabit(id: number, habit: Partial<InsertHabit>): Promise<Habit | undefined>;
  
  // Habit entry operations
  createHabitEntry(entry: InsertHabitEntry): Promise<HabitEntry>;
  getHabitEntriesByDate(date: string): Promise<HabitEntry[]>;
  updateHabitEntry(habitId: number, date: string, completed: boolean): Promise<HabitEntry | undefined>;
  
  // Journal operations
  createJournalEntry(entry: InsertJournalEntry): Promise<JournalEntry>;
  getJournalEntries(limit?: number): Promise<JournalEntry[]>;
  getJournalEntriesByDateRange(startDate: string, endDate: string): Promise<JournalEntry[]>;
}

export class MemStorage implements IStorage {
  private moods: Map<number, Mood>;
  private habits: Map<number, Habit>;
  private habitEntries: Map<string, HabitEntry>; // key: `${habitId}-${date}`
  private journalEntries: Map<number, JournalEntry>;
  private currentMoodId: number;
  private currentHabitId: number;
  private currentHabitEntryId: number;
  private currentJournalId: number;

  constructor() {
    this.moods = new Map();
    this.habits = new Map();
    this.habitEntries = new Map();
    this.journalEntries = new Map();
    this.currentMoodId = 1;
    this.currentHabitId = 1;
    this.currentHabitEntryId = 1;
    this.currentJournalId = 1;
    
    // Initialize with default habits
    this.initializeDefaultHabits();
  }

  private initializeDefaultHabits() {
    const defaultHabits = [
      { name: "Exercise", icon: "dumbbell", target: "30 minutes", color: "success", isActive: true },
      { name: "Meditation", icon: "brain", target: "10 minutes", color: "info", isActive: true },
      { name: "Sunlight", icon: "sun", target: "15 minutes", color: "warning", isActive: true },
      { name: "Sleep", icon: "bed", target: "8 hours", color: "secondary", isActive: true },
    ];

    defaultHabits.forEach(habit => {
      const id = this.currentHabitId++;
      const newHabit: Habit = { ...habit, id };
      this.habits.set(id, newHabit);
    });
  }

  async createMood(insertMood: InsertMood): Promise<Mood> {
    const id = this.currentMoodId++;
    const mood: Mood = { 
      ...insertMood,
      note: insertMood.note || null,
      id, 
      createdAt: new Date()
    };
    this.moods.set(id, mood);
    return mood;
  }

  async getMoodByDate(date: string): Promise<Mood | undefined> {
    return Array.from(this.moods.values()).find(mood => mood.date === date);
  }

  async getMoodsByDateRange(startDate: string, endDate: string): Promise<Mood[]> {
    return Array.from(this.moods.values())
      .filter(mood => mood.date >= startDate && mood.date <= endDate)
      .sort((a, b) => a.date.localeCompare(b.date));
  }

  async createHabit(insertHabit: InsertHabit): Promise<Habit> {
    const id = this.currentHabitId++;
    const habit: Habit = { 
      ...insertHabit,
      isActive: insertHabit.isActive ?? true,
      id 
    };
    this.habits.set(id, habit);
    return habit;
  }

  async getHabits(): Promise<Habit[]> {
    return Array.from(this.habits.values()).filter(habit => habit.isActive);
  }

  async updateHabit(id: number, updateData: Partial<InsertHabit>): Promise<Habit | undefined> {
    const habit = this.habits.get(id);
    if (!habit) return undefined;
    
    const updatedHabit = { ...habit, ...updateData };
    this.habits.set(id, updatedHabit);
    return updatedHabit;
  }

  async createHabitEntry(insertEntry: InsertHabitEntry): Promise<HabitEntry> {
    const id = this.currentHabitEntryId++;
    const entry: HabitEntry = { 
      ...insertEntry,
      completed: insertEntry.completed ?? false,
      id 
    };
    const key = `${entry.habitId}-${entry.date}`;
    this.habitEntries.set(key, entry);
    return entry;
  }

  async getHabitEntriesByDate(date: string): Promise<HabitEntry[]> {
    return Array.from(this.habitEntries.values())
      .filter(entry => entry.date === date);
  }

  async updateHabitEntry(habitId: number, date: string, completed: boolean): Promise<HabitEntry | undefined> {
    const key = `${habitId}-${date}`;
    let entry = this.habitEntries.get(key);
    
    if (!entry) {
      // Create new entry if it doesn't exist
      entry = await this.createHabitEntry({ habitId, date, completed });
    } else {
      // Update existing entry
      entry.completed = completed;
      this.habitEntries.set(key, entry);
    }
    
    return entry;
  }

  async createJournalEntry(insertEntry: InsertJournalEntry): Promise<JournalEntry> {
    const id = this.currentJournalId++;
    const entry: JournalEntry = { 
      ...insertEntry,
      moodValue: insertEntry.moodValue || null,
      id, 
      createdAt: new Date()
    };
    this.journalEntries.set(id, entry);
    return entry;
  }

  async getJournalEntries(limit?: number): Promise<JournalEntry[]> {
    const entries = Array.from(this.journalEntries.values())
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    
    return limit ? entries.slice(0, limit) : entries;
  }

  async getJournalEntriesByDateRange(startDate: string, endDate: string): Promise<JournalEntry[]> {
    return Array.from(this.journalEntries.values())
      .filter(entry => entry.date >= startDate && entry.date <= endDate)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }
}

export const storage = new MemStorage();

