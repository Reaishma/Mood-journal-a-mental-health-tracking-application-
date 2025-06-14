import tkinter as tk
from tkcalendar import Calendar
from datetime import datetime
import matplotlib.pyplot as plt

class MoodJournal:
    def __init__(self):
        self.root = tk.Tk()
        self.root.title("Mood Journal")
        self.mood_log = []
        self.calendar = Calendar(self.root, selectmode='day', year=datetime.now().year, month=datetime.now().month, day=datetime.now().day)
        self.calendar.pack()
        self.submit_button = tk.Button(self.root, text="Submit Mood", command=self.submit_mood)
        self.submit_button.pack()
        self.notes_label = tk.Label(self.root, text="Add Notes:")
        self.notes_label.pack()
        self.notes_entry = tk.Text(self.root, height=5, width=30)
        self.notes_entry.pack()
        self.mood_meter_label = tk.Label(self.root, text="Mood Meter:")
        self.mood_meter_label.pack()
        self.mood_meter = tk.Scale(self.root, from_=1, to=5, orient=tk.HORIZONTAL)
        self.mood_meter.pack()
        self.analyze_button = tk.Button(self.root, text="Analyze Mood", command=self.analyze_mood)
        self.analyze_button.pack()

    def submit_mood(self):
        date = self.calendar.selection_get()
        notes = self.notes_entry.get("1.0", "end-1c")
        mood_value = self.mood_meter.get()
        self.mood_log.append({
            "Date": date,
            "Mood": mood_value,
            "Notes": notes
        })
        self.notes_entry.delete("1.0", "end")
        self.display_log()

    def display_log(self):
        log_window = tk.Toplevel(self.root)
        log_text = tk.Text(log_window, height=10, width=40)
        log_text.pack()
        for log in self.mood_log:
            log_text.insert("end", f"Date: {log['Date']}\nMood: {log['Mood']}\nNotes: {log['Notes']}\n\n")

    def analyze_mood(self):
        if not self.mood_log:
            return

        # Calculate average mood score
        average_mood = sum(log["Mood"] for log in self.mood_log) / len(self.mood_log)
        print(f"Average mood score: {average_mood}")

        # Display mood distribution
        mood_counts = {}
        for log in self.mood_log:
            mood = log["Mood"]
            if mood in mood_counts:
                mood_counts[mood] += 1
            else:
                mood_counts[mood] = 1
        plt.bar(mood_counts.keys(), mood_counts.values())
        plt.xlabel("Mood Score")
        plt.ylabel("Frequency")
        plt.title("Mood Distribution")
        plt.show()

        # Display mood trend
        dates = [log["Date"] for log in self.mood_log]
        moods = [log["Mood"] for log in self.mood_log]
        plt.plot(dates, moods)
        plt.xlabel("Date")
        plt.ylabel("Mood Score")
        plt.title("Mood Trend")
        plt.show()

    def run(self):
        self.root.mainloop()

if __name__ == "__main__":
    app = MoodJournal()
    app.run()
