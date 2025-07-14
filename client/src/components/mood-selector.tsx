import { motion } from "framer-motion";
import { MOOD_EMOJIS, MOOD_LABELS } from "@/lib/types";

interface MoodSelectorProps {
  selectedMood?: number;
  onMoodSelect: (mood: number) => void;
}

export function MoodSelector({ selectedMood, onMoodSelect }: MoodSelectorProps) {
  return (
    <div className="flex justify-between items-center">
      {[1, 2, 3, 4, 5].map((mood) => (
        <motion.button
          key={mood}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onMoodSelect(mood)}
          className={`flex flex-col items-center p-3 rounded-xl transition-all duration-300 ${
            selectedMood === mood
              ? 'bg-primary/10 border-2 border-primary'
              : 'hover:bg-gray-50'
          }`}
        >
          <motion.div 
            className="text-3xl mb-2"
            animate={selectedMood === mood ? { scale: [1, 1.2, 1] } : {}}
            transition={{ duration: 0.6 }}
          >
            {MOOD_EMOJIS[mood as keyof typeof MOOD_EMOJIS]}
          </motion.div>
          <span className={`text-xs ${
            selectedMood === mood 
              ? 'text-primary font-medium' 
              : 'text-gray-600'
          }`}>
            {MOOD_LABELS[mood as keyof typeof MOOD_LABELS]}
          </span>
        </motion.button>
      ))}
    </div>
  );
}

