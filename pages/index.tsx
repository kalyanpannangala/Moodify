"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

type PredictionResult = {
  mood: string;
  score: number;
};

const moodEmojis: Record<string, string> = {
  positive: "😄",
  negative: "😢",
  "mildly positive": "🙂",
  "mildly negative": "🙁",
  neutral: "😐"
};

const moodColors: Record<string, string> = {
  "mildly positive": "from-yellow-300 to-yellow-500",
  "mildly negative": "from-blue-300 to-blue-500",
  positive: "from-green-300 to-green-500",
  negative: "from-red-300 to-red-500",
  neutral: "from-gray-300 to-gray-500",
};

export default function Home() {
  const [text, setText] = useState("");
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [moodColor, setMoodColor] = useState("from-blue-100 to-purple-100");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (result?.mood) {
      setMoodColor(moodColors[result.mood] || "from-blue-100 to-purple-100");
    }
  }, [result]);

  const analyze = async () => {
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch("https://moodify-backend-1dm4.onrender.com/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      // Handle HTTP errors
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Backend error: ${res.status} - ${errorText || res.statusText}`);
      }

      const data = await res.json();
      
      // Validate backend response structure
      if (!data.mood || data.prediction === undefined) {
        console.error("Backend response:", data);
        throw new Error("Unexpected response format from backend");
      }
      
      // Convert prediction to score (0-4 to 0-1 scale)
      const score = typeof data.prediction === 'number' 
        ? data.prediction / 4 
        : parseFloat(data.prediction) / 4;
      
      if (isNaN(score)) {
        throw new Error("Invalid prediction value");
      }

      setResult({
        mood: data.mood.toLowerCase(),
        score
      });
      
    } catch (err) {
      console.error("Prediction error:", err);
      
      let errorMessage = "Something went wrong while predicting mood. Please try again.";
      
      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (typeof err === "string") {
        errorMessage = err;
      }
      
      setError(errorMessage);
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

  const resetForm = () => {
    setText("");
    setResult(null);
    setError("");
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className={`min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br ${moodColor} transition-all duration-1000 ease-in-out`}
    >
      <div className="max-w-2xl w-full px-4">
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-center mb-8"
        >
          <motion.h1
            className="text-4xl md:text-5xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-500"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
          >
            <span className="inline-block transform rotate-12">🎵</span> Moodify <span className="inline-block transform -rotate-12">🎧</span>
          </motion.h1>
          <p className="text-lg text-gray-700">
            Advanced mood analysis powered by machine learning
          </p>
        </motion.div>

        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl p-6 md:p-8 border border-white/50 mb-8"
        >
          <motion.div
            whileHover={{ scale: 1.01 }}
            className="relative mb-6"
          >
            <textarea
              ref={textareaRef}
              className="w-full p-5 text-lg border-2 border-blue-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-gray-800 bg-white/90 backdrop-blur-sm resize-none"
              rows={4}
              placeholder="How are you feeling today? Share your thoughts..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={loading}
            />
            <motion.div
              className="absolute right-4 bottom-4 text-gray-400 text-sm"
              animate={{ opacity: text ? 0 : 1 }}
            >
              Shift + Enter ↵
            </motion.div>
          </motion.div>

          <div className="flex justify-center">
            <motion.button
              className="relative px-8 py-3 rounded-full bg-gradient-to-r from-purple-600 to-blue-500 text-white font-bold text-lg shadow-lg overflow-hidden"
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
                    Analyzing...
                  </>
                ) : (
                  "Predict My Mood"
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
              <div className="mt-2">
                <motion.button
                  onClick={resetForm}
                  whileHover={{ scale: 1.05 }}
                  className="text-blue-600 hover:underline font-medium"
                >
                  Try again
                </motion.button>
              </div>
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
                  {moodEmojis[result.mood?.toLowerCase()] || "😄"}
                </motion.div>

                <h2 className="text-3xl font-bold mb-2 text-black">
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

                <p className="text-xl mb-4 text-black">
                  Confidence:{" "}
                  <span className="font-bold">{(result.score * 100).toFixed(1)}%</span>
                </p>

                <motion.button
                  className="mt-4 px-6 py-2 rounded-full bg-gradient-to-r from-gray-700 to-gray-900 text-white font-medium"
                  onClick={resetForm}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Analyze Another
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {!result && !loading && !error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-12 text-center text-gray-600"
          >
            <p className="mb-4">How it works:</p>
            <div className="flex flex-wrap justify-center gap-4 max-w-lg mx-auto">
              {[
                { icon: "✍️", text: "Share your thoughts" },
                { icon: "🤖", text: "AI analyzes your mood" },
                { icon: "📊", text: "Get instant results" },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  className="flex flex-col items-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2 + index * 0.2 }}
                >
                  <div className="w-16 h-16 rounded-full bg-white/80 flex items-center justify-center text-2xl mb-2 shadow-md">
                    {item.icon}
                  </div>
                  <p className="text-sm">{item.text}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      <motion.footer
        className="mt-8 text-gray-600 text-sm text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
      >
        Developed by{' '} 
        <a
            href="https://github.com/kalyanpannangala/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-700 hover:text-blue-900 font-semibold transition"
            style={{ textDecoration: 'none' }}
        >
            Kalyan Pannangala
        </a>
           | Moodify © 2025
      </motion.footer>
    </motion.div>
  );
}