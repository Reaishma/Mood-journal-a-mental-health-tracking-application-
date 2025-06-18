

Mood Journal App 🌟

Overview
A user-friendly and feature-rich application that allows users to track their moods and emotions over time, providing insights and reminders to help them manage their mental health 📝

Features
1. *Mood Logging*: Log your moods and emotions with notes 📊
2. *Calendar Integration*: View your mood logs on a calendar 📆
3. *Chart Visualization*: Visualize your mood data using charts 📈
4. *Validation*: Validate user input to ensure accurate data 📝
5. *Storage using JSON*: Store user data persistently using JSON 📁
6. *Reminders and Notifications*: Receive reminders and notifications to help manage mental health 📅
7. *User-friendly GUI*: Simple and intuitive interface for easy user interaction 📱

Technologies Used
- Python 
- Tkinter library for GUI development 📚
- tkcalendar library for calendar integration 📆
- matplotlib library for data visualization 📈
- JSON for data storage 📁

*Code Snippets*

Mood Logging

def log_mood():
    mood = mood_entry.get()
    notes = notes_entry.get("1.0", tk.END)
    # Store mood and notes in JSON file
    with open("mood_log.json", "a") as f:
        json.dump({"mood": mood, "notes": notes}, f)
        f.write("\n")

*Chart Visualization*

import matplotlib.pyplot as plt

def visualize_mood_data():
    # Load mood data from JSON file
    with open("mood_log.json", "r") as f:
        mood_data = [json.loads(line) for line in f.readlines()]
    
    # Extract mood values
    moods = [data["mood"] for data in mood_data]
    
    # Plot mood data
    plt.plot(moods)
    plt.xlabel("Date")
    plt.ylabel("Mood")
    plt.title("Mood Log")
    plt.show()

*Outcomes*
- A functional Mood Journal app that allows users to track their moods and emotions 📊
- A simple and user-friendly interface for easy user interaction 📱
- A log of all submitted moods and notes that can be viewed by the user 📝
- Visual representation of mood data using charts 📈
- Reminders and notifications to help users manage their mental health 📅

*Benefits*
- *Improved Mental Health*: Track and manage your emotions to improve your mental well-being 🌈
- *Increased Self-Awareness*: Gain insights into your mood patterns and triggers 🔍
- *Personalized Insights*: Receive tailored recommendations for managing your mental health 📊
- *Easy Tracking*: Log your moods and emotions quickly and easily 📝
- *Data Visualization*: Visualize your mood data to identify trends and patterns 📈

*Screenshots*
For output screenshots, please refer to the attached document:
https://docs.google.com/document/d/18Zs2IA864w8qtKk2tej9_r1putPqEiC93Q3CyZbya1w/edit?usp=drivesdk

Author
- *Reaishma N*

License
MIT License 📄

