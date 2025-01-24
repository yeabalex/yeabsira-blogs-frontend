import React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { FlipWords } from "../ui/flip-words";
import { useRouter } from "next/navigation";

export function Hero() {
  const router = useRouter();
  const words = [
    "House",
    "Drum n Bass",
    "Jazz",
    "Experimental"
  ];

  function getStarted() {
    router.push("/register");
  }
  return (
    <div className="relative max-w-7xl px-6 pt-20 pb-16 mx-auto overflow-hidden">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10"
      >
        <h1 className="max-w-4xl text-5xl md:text-7xl mb-6 font-heading font-bold bg-gradient-to-r from-neutral-800 to-neutral-600 dark:from-neutral-200 dark:to-neutral-400 bg-clip-text text-transparent">
          I Write About Electronic Music.
        </h1>

        <div className="space-y-8">
          <div className="text-3xl md:text-5xl font-heading font-semibold text-neutral-700 dark:text-neutral-300">
            <FlipWords words={words} />
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button onClick={getStarted} className="px-6 py-3 bg-[#1DB954] text-black hover:bg-blue-700 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors">
              Get Started
              <ArrowRight className="w-4 h-4" />
            </button>
            <button className="px-6 py-3 border border-neutral-300 dark:border-neutral-700 hover:border-neutral-400 dark:hover:border-neutral-600 rounded-lg font-medium transition-colors">
              Learn More
            </button>
          </div>
        </div>
      </motion.div>

      <div className="absolute top-0 right-0 w-1/2 h-full opacity-20 dark:opacity-10">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/30 to-purple-500/30 rounded-full blur-3xl" />
      </div>
    </div>
  );
}