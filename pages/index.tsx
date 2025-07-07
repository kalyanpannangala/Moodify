"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

type PredictionResult = {
  mood: string;
  score: number;
};

const moodEmojis: Record<string, string> = {
  happy: "😄",
  sad: "😢",
  angry: "😠",
  anxious: "😰",
  excited: "🤩",
  relaxed: "😌",
  neutral: "😐",
  surprised: "😲",
  tired: "😴",
  loved: "🥰",
  playful: "😜",
  confident: "😎",
};

const moodColors: Record<string, string> = {
  happy: "from-yellow-300 to-yellow-500",
  sad: "from-blue-300 to-blue-500",
  angry: "from-red-400 to-red-600",
  anxious: "from-purple-400 to-purple-600",
  excited: "from-orange-300 to-orange-500",
  relaxed: "from-green-300 to-green-500",
  neutral: "from-gray-300 to-gray-500",
  surprised: "from-pink-300 to-pink-500",
  tired: "from-indigo-300 to-indigo-500",
  loved: "from-rose-300 to-rose-500",
  playful: "from-cyan-300 to-cyan-500",
  confident: "from-teal-300 to-teal-500",
};

export default function Home() {
  const [text, setText] = useState("");
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [moodColor, setMoodColor] = useState("from-blue-100 to-purple-100");
  const [activeMood, setActiveMood] = useState("");

  useEffect(() => {
    if (result?.mood) {
      setActiveMood(result.mood);
      setMoodColor(moodColors[result.mood] || "from-blue-100 to-purple-100");
    }
  }, [result]);

  const analyze = async () => {
    setLoading(true);
    setError("");
    setResult(null);

    try {
      // Simulating API call with mock data
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock responses based on text content
      const mockResponses: PredictionResult[] = [
        { mood: "happy", score: 0.92 },
        { mood: "sad", score: 0.87 },
        { mood: "excited", score: 0.95 },
        { mood: "relaxed", score: 0.89 },
        { mood: "anxious", score: 0.91 },
      ];
      
      const randomResponse = mockResponses[Math.floor(Math.random() * mockResponses.length)];
      setResult(randomResponse);
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (text.trim() && !loading) {
        analyze();
      }
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className={`min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br ${moodColor} transition-all duration-1000 ease-in-out`}
    >
      <div className="max-w-2xl w-full">
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-center mb-10"
        >
          <motion.h1 
            className="text-5xl md:text-6xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-500"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
          >
            🎧 Moodify Premium
          </motion.h1>
          <p className="text-xl text-gray-700 max-w-md mx-auto">
            Advanced mood analysis with emotional intelligence
          </p>
        </motion.div>

        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl p-6 md:p-8 border border-white/50 mb-8"
        >
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="relative mb-6"
          >
            <textarea
              className="w-full p-5 text-lg border-2 border-blue-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-gray-800 bg-white/90 backdrop-blur-sm resize-none"
              rows={4}
              placeholder="How are you feeling today? Share your thoughts..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={loading}
            />
            <motion.div 
              className="absolute right-4 bottom-4 text-gray-400"
              animate={{ opacity: text ? 0 : 1 }}
            >
              Shift + Enter ↵
            </motion.div>
          </motion.div>

          <div className="flex justify-center">
            <motion.button
              className="relative px-8 py-4 rounded-full bg-gradient-to-r from-purple-600 to-blue-500 text-white font-bold text-lg shadow-lg overflow-hidden"
              onClick={analyze}
              disabled={loading || !text.trim()}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <span className="relative z-10 flex items-center justify-center">
                {loading ? (
                  <>
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-5 h-5 border-t-2 border-r-2 border-white rounded-full mr-2"
                    />
                    Analyzing Emotions...
                  </>
                ) : (
                  "Analyze My Mood"
                )}
              </span>
              <motion.span
                className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 opacity-0"
                animate={{ 
                  opacity: loading ? [0.3, 0.6, 0.3] : 0,
                  x: loading ? ['0%', '100%', '100%', '0%'] : '0%'
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity, 
                  ease: "easeInOut",
                }}
              />
            </motion.button>
          </div>
        </motion.div>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6 text-center"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ type: "spring", damping: 12 }}
              className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl p-6 md:p-8 border border-white/50 overflow-hidden"
            >
              <div className="text-center">
                <motion.div
                  className="text-8xl mb-4"
                  animate={{ 
                    scale: [1, 1.2, 1],
                    rotate: [0, 10, -10, 0]
                  }}
                  transition={{ 
                    duration: 1.5,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                >
                  {moodEmojis[result.mood] || "😄"}
                </motion.div>
                
                <h2 className="text-3xl font-bold mb-2">
                  Your Mood:{" "}
                  <span className="capitalize text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-500">
                    {result.mood}
                  </span>
                </h2>
                
                <div className="w-full bg-gray-200 rounded-full h-4 mb-6 mt-4 overflow-hidden">
                  <motion.div 
                    className="bg-gradient-to-r from-purple-500 to-blue-400 h-4 rounded-full"
                    initial={{ width: "0%" }}
                    animate={{ width: `${result.score * 100}%` }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                  />
                </div>
                
                <p className="text-xl mb-4">
                  Confidence:{" "}
                  <span className="font-bold">{(result.score * 100).toFixed(1)}%</span>
                </p>
                
                <motion.button
                  className="mt-4 text-blue-500 hover:text-blue-700 font-medium"
                  onClick={() => setResult(null)}
                  whileHover={{ scale: 1.05 }}
                >
                  Try another analysis
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {!result && !loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-12 text-center text-gray-600"
          >
            <p className="mb-4">Recent mood predictions:</p>
            <div className="flex flex-wrap justify-center gap-3 max-w-lg mx-auto">
              {["happy", "excited", "relaxed", "playful", "confident"].map((mood) => (
                <motion.div
                  key={mood}
                  className={`px-4 py-2 rounded-full cursor-pointer transition-all ${
                    activeMood === mood 
                      ? "bg-white shadow-lg" 
                      : "bg-white/60 hover:bg-white/80"
                  }`}
                  whileHover={{ y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setText(`I'm feeling ${mood} today`);
                    setActiveMood(mood);
                    setMoodColor(moodColors[mood] || "from-blue-100 to-purple-100");
                  }}
                >
                  <span className="mr-2">{moodEmojis[mood]}</span>
                  <span className="capitalize">{mood}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}