impcitypacitymport { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { MoodSelector } from "@/components/mood-selector";
import type { JournalEntryData } from "@/lib/types";

export default function Journal() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newEntry, setNewEntry] = useState("");
  const [selectedMood, setSelectedMood] = useState<number>();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: entries = [], isLoading } = useQuery<JournalEntryData[]>({
    queryKey: ['/api/journal-entries'],
  });

  const createEntryMutation = useMutation({
    mutationFn: async () => {
      if (!newEntry.trim()) throw new Error("Entry content is required");
      
      const entryData = {
        content: newEntry,
        moodValue: selectedMood,
        date: new Date().toISOString().split('T')[0],
      };

      const response = await apiRequest('POST', '/api/journal-entries', entryData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/journal-entries'] });
      setNewEntry("");
      setSelectedMood(undefined);
      setIsDialogOpen(false);
      toast({
        title: "Entry saved!",
        description: "Your journal entry has been recorded.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to save entry. Please try again.",
        variant: "destructive",
      });
    },
  });

  const getMoodEmoji = (value?: number) => {
    if (!value) return null;
    const emojis = { 1: '😢', 2: '😟', 3: '😐', 4: '😊', 5: '🤗' };
    return emojis[value as keyof typeof emojis];
  };

  const formatDate = (date: string | Date) => {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (date: string | Date) => {
    const d = new Date(date);
    return d.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <div className="max-w-md mx-auto bg-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <i className="fas fa-spinner fa-spin text-primary text-2xl mb-4"></i>
          <p className="text-gray-600">Loading journal...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen shadow-xl">
      {/* Header */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="safe-area-top gradient-primary text-white px-6 py-4"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold">Journal</h1>
            <p className="text-indigo-100 text-sm">Your thoughts and reflections</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" className="text-white hover:bg-white/20">
                <i className="fas fa-plus mr-2"></i>
                New Entry
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-sm mx-auto">
              <DialogHeader>
                <DialogTitle>New Journal Entry</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>                   <label className="text-sm font-medium mb-2 block">How are you feeling?</label>
                  <MoodSelector 
                    selectedMood={selectedMood} 
                    onMoodSelect={setSelectedMood}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Your thoughts</label>
                  <Textarea
                    placeholder="Write about your day, feelings, or anything on your mind..."
                    value={newEntry}
                    onChange={(e) => setNewEntry(e.target.value)}
                    rows={6}
                  />
                </div>
                <Button 
                  onClick={() => createEntryMutation.mutate()}
                  disabled={!newEntry.trim() || createEntryMutation.isPending}
                  className="w-full gradient-primary"
                >
                  {createEntryMutation.isPending ? (
                    <>
                      <i className="fas fa-spinner fa-spin mr-2"></i>
                      Saving...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-save mr-2"></i>
                      Save Entry
                    </>
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </motion.header>

      <div className="pb-24">
        {entries.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="px-6 py-12 text-center"
          >
            <i className="fas fa-book-open text-6xl text-gray-300 mb-4"></i>
            <h3 classNafont-semiboldont-semibold text-gray-800 mb-2">Start Your Journal</h3>
            <p className="text-gray-600 mb-6">
              Write your first entry to begin tracking your thoughts and feelings.
            </p>
            <Button 
              onClick={() => setIsDialogOpen(true)}
              className="gradient-primary"
            >
              <i className="fas fa-plus mr-2"></i>
              Create First Entry
            </Button>
          </motion.div>
        ) : (
          <div className="px-6 py-4 space-y-4">
            {entries.map((entry, index) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <Card className="card-hover">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center">
                        {entry.moodValue && (
                          <span className="text-2xl mr-3">
                            {getMoodEmoji(entry.moodValue)}
                          </span>
                        )}
                        <div>
                          <p className="font-medium text-gray-800">
                            {formatDate(entry.createdAt)}
                          </p>
                          <p className="text-sm text-gray-500">
                            {formatTime(entry.createdAt)}
                          </p>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" className="text-gray-400 hover:text-gray-600">
                        <i className="fas fa-ellipsis-h"></i>
                      </Button>
                    </div>
                    
                    <p className="text-gray-700 leading-relaxed">
                      {entry.content}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Floating Action Button */}
      <motion.button
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsDialogOpen(true)}
        className="fixed bottom-20 right-6 w-14 h-14 gradient-primary text-white rounded-full shadow-lg floating-button z-10"
      >
        <i className="fas fa-pen text-lg"></i>
      </motion.button>
    </div>
  );
}

