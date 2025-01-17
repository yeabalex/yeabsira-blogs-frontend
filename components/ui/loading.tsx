import React from 'react';
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export default function Loading ()  {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        when: "beforeChildren",
        staggerChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  const spinTransition = {
    repeat: Infinity,
    duration: 1,
    ease: "linear"
  };



  return (
    <motion.div 
      className="min-h-screen w-full flex flex-col items-center justify-center bg-white dark:bg-black transition-colors duration-300"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div className="flex flex-col items-center space-y-6 p-8">
        {/* Animated logo/spinner */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={spinTransition}
          className="relative"
        >
          <Loader2 className="w-16 h-16 text-[#1DB954]" />
        </motion.div>
        
        
        
        {/* Loading message */}
        <motion.p 
          variants={itemVariants}
          className="text-gray-600 dark:text-gray-400 text-center max-w-sm"
        >
          <motion.span
            animate={{
              opacity: [1, 0.5, 1],
              transition: {
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }
            }}
          >
            Daily dose of .....
          </motion.span>
        </motion.p>
      </motion.div>
    </motion.div>
  );
};
