import tkinter as tk
from tkinter import messagebox
from datetime import datetime

class MoodJournal:
    def __init__(self):
        self.root = tk.Tk()
        self.root.title("Mood Journal")
        self.mood_log = []

        # Create mood meter
        self.mood_meter_label = tk.Label(self.root, text="Mood Meter:")
        self.mood_meter_label.pack()
        self.mood_meter = tk.Scale(self.root, from_=1, to=5, orient=tk.HORIZONTAL, command=self.update_mood_meter)
        self.mood_meter.pack()
        self.mood_meter_label_value = tk.Label(self.root, text="")
        self.mood_meter_label_value.pack()

        # Create notes entry
        self.notes_label = tk.Label(self.root, text="Add Notes:")
        self.notes_label.pack()
        self.notes_entry = tk.Text(self.root, height=5, width=30)
        self.notes_entry.pack()

        # Create submit button
        self.submit_button = tk.Button(self.root, text="Submit", command=self.submit_mood)
        self.submit_button.pack()

        # Create log display
        self.log_label = tk.Label(self.root, text="Mood Log:")
        self.log_label.pack()
        self.log_text = tk.Text(self.root, height=10, width=40)
        self.log_text.pack()

    def update_mood_meter(self, value):
        value = int(value)
        if value == 1:
            self.mood_meter_label_value.config(text="Very Bad", fg="red")
        elif value == 2:
            self.mood_meter_label_value.config(text="Bad", fg="orange")
        elif value == 3:
            self.mood_meter_label_value.config(text="Neutral", fg="yellow")
        elif value == 4:
            self.mood_meter_label_value.config(text="Good", fg="lightgreen")
        elif value == 5:
            self.mood_meter_label_value.config(text="Very Good", fg="green")

    def submit_mood(self):
        mood_value = self.mood_meter.get()
        notes = self.notes_entry.get("1.0", "end-1c")
        self.mood_log.append({
            "Date": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "Mood": mood_value,
            "Notes": notes
        })
        self.notes_entry.delete("1.0", "end")
        self.display_log()

    def display_log(self):
        self.log_text.delete("1.0", "end")
        for log in self.mood_log:
            mood_text = ""
            if log['Mood'] == 1:
                mood_text = "Very Bad"
            elif log['Mood'] == 2:
                mood_text = "Bad"
            elif log['Mood'] == 3:
                mood_text = "Neutral"
            elif log['Mood'] == 4:
                mood_text = "Good"
            elif log['Mood'] == 5:
                mood_text = "Very Good"
            self.log_text.insert("end", f"Date: {log['Date']}\nMood: {mood_text}\nNotes: {log['Notes']}\n\n")

    def run(self):
        self.root.mainloop()

if __name__ == "__main__":
    app = MoodJournal()
    app.run()
