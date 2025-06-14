import json
import os
import time

class MoodLog:
    def __init__(self, mood, notes):
        self.mood = mood
        self.notes = notes

    def to_dict(self):
        return {"mood": self.mood, "notes": self.notes}

    @classmethod
    def from_dict(cls, data):
        return cls(data["mood"], data["notes"])

class MoodLogStorage:
    def __init__(self, filename):
        self.filename = filename
        self.load()

    def load(self):
        if os.path.exists(self.filename) and os.path.getsize(self.filename) > 0:
            with open(self.filename, "r") as file:
                try:
                    self.mood_logs = [MoodLog.from_dict(data) for data in json.load(file)]
                except json.JSONDecodeError:
                    self.mood_logs = []
        else:
            self.mood_logs = []

    def save(self):
        with open(self.filename, "w") as file:
            json.dump([mood_log.to_dict() for mood_log in self.mood_logs], file, indent=4)

    def add_mood_log(self, mood_log):
        self.mood_logs.append(mood_log)
        self.save()

    def get_mood_logs(self):
        return self.mood_logs

def create_mood_log(mood, notes):
    return MoodLog(mood, notes)

def validate_mood_log(mood_log):
    errors = []
    if not mood_log.mood:
        errors.append("Mood is required")
    elif len(mood_log.mood) < 1 or len(mood_log.mood) > 50:
        errors.append("Mood should be between 1 and 50 characters")
    if not mood_log.notes:
        errors.append("Notes are required")
    elif len(mood_log.notes) < 1 or len(mood_log.notes) > 200:
        errors.append("Notes should be between 1 and 200 characters")
    return errors

def view_mood_logs(storage):
    mood_logs = storage.get_mood_logs()
    if not mood_logs:
        print("No mood logs available")
    else:
        print("Mood Logs:")
        for i, mood_log in enumerate(mood_logs, start=1):
            print(f"Mood Log {i}:")
            print(f"Mood: {mood_log.mood}")
            print(f"Notes: {mood_log.notes}")
            print()
        print("JSON Data:")
        with open(storage.filename, "r") as file:
            print(file.read())

def main():
    storage = MoodLogStorage("mood_logs.json")
    notification_interval = None
    last_notification_time = None
    while True:
        print("1. Create Mood Log")
        print("2. View Mood Logs")
        print("3. Set Notification Interval")
        print("4. Quit")
        if notification_interval is not None and last_notification_time is not None:
            time_elapsed = time.time() - last_notification_time
            if time_elapsed >= notification_interval * 60:
                print("Reminder: Log your mood!")
                last_notification_time = time.time()
            else:
                time_remaining = notification_interval * 60 - time_elapsed
                minutes_remaining = int(time_remaining / 60)
                seconds_remaining = int(time_remaining % 60)
                print(f"Next notification in {minutes_remaining} minutes and {seconds_remaining} seconds")
        choice = input("Choose an option: ")
        if choice == "1":
            mood = input("Enter your mood: ")
            notes = input("Enter your notes: ")
            mood_log = create_mood_log(mood, notes)
            errors = validate_mood_log(mood_log)
            if errors:
                print("Validation errors:")
                for error in errors:
                    print(error)
            else:
                storage.add_mood_log(mood_log)
                print("Mood log created successfully")
        elif choice == "2":
            view_mood_logs(storage)
        elif choice == "3":
            interval = int(input("Enter notification interval in minutes: "))
            notification_interval = interval
            last_notification_time = time.time()
            print("Notification interval set successfully")
        elif choice == "4":
            break
        else:
            print("Invalid option. Please choose again.")

if __name__ == "__main__":
    main()
