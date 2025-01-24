import React, { useState } from 'react';
import { Search, Menu, X } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

const NavbarComponent = ({ isLoggedIn, userName, userImage }: { isLoggedIn: boolean, userName: string, userImage: string }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-background font-sans">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2"
          >
            <Link href="/" className="text-2xl font-bold text-neutral-900 dark:text-white">
              free<span className="text-[#1DB954]">.ly</span>
            </Link>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-1 max-w-xl mx-8 hidden md:block"
          >
            <div className="relative group">
              <input
                type="text"
                placeholder="Search blogs..."
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                className={`w-full px-4 py-2 rounded-full border-2 transition-all duration-200 bg-background
                  ${isSearchFocused ? 'border-[#1DB954] ring-2 ring-[#1DB954]/20' : 'border-neutral-200 dark:border-neutral-700'}
 dark:text-white focus:outline-none`}
              />
              <Search className="absolute right-3 top-2.5 text-neutral-400" size={20} />
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="hidden md:flex items-center gap-4"
          >
            {isLoggedIn ? (
              <>
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-3 p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800"
                >
                  <img
                    src={userImage || `https://api.dicebear.com/7.x/initials/svg?seed=${userName}`}
                    alt={userName}
                    className="w-8 h-8 rounded-full"
                  />
                  <span className="font-medium dark:text-white">{userName}</span>
                </motion.div>
                <Link href="/create" className="px-4 py-2 rounded-full font-medium text-white bg-[#1DB954] hover:bg-[#1DB954]/90">
                  Create
                </Link>
              </>
            ) : (
              <>
                <Link href="/login" className="px-4 py-2 rounded-full font-medium hover:bg-neutral-100 dark:hover:bg-neutral-800 dark:text-white">
                  Log in
                </Link>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link href="/register" className="px-4 py-2 rounded-full font-medium text-white bg-[#1DB954] hover:bg-[#1DB954]/90">
                    Sign up
                  </Link>
                </motion.div>
              </>
            )}
          </motion.div>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden mt-3 space-y-4"
            >
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search blogs..."
                  className="w-full px-4 py-2 rounded-full border-2 border-neutral-200 dark:border-neutral-700 
                    dark:bg-neutral-800 dark:text-white focus:outline-none focus:border-[#1DB954]"
                />
                <Search className="absolute right-3 top-2.5 text-neutral-400" size={20} />
              </div>

              {isLoggedIn ? (
                <>
                  <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800">
                    <img
                      src={userImage || `https://api.dicebear.com/7.x/initials/svg?seed=${userName}`}
                      alt={userName}
                      className="w-8 h-8 rounded-full"
                    />
                    <span className="font-medium dark:text-white">{userName}</span>
                  </div>
                  <Link href="/create" className="block w-full px-4 py-2 rounded-lg text-white text-center bg-[#1DB954] hover:bg-[#1DB954]/90">
                    Create
                  </Link>
                </>
              ) : (
                <div className="space-y-2">
                  <Link href="/login" className="block w-full px-4 py-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 dark:text-white">
                    Log in
                  </Link>
                  <Link href="/register" className="block w-full px-4 py-2 rounded-lg text-white text-center bg-[#1DB954] hover:bg-[#1DB954]/90">
                    Sign up
                  </Link>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default NavbarComponent;
