import React, { useState, useEffect } from 'react';
import { Search, User, Menu } from 'lucide-react';
import Link from 'next/link';

const NavbarComponent = ({ isLoggedIn, userName, userImage }:{isLoggedIn:boolean, userName:string, userImage:string}) => {
  const spotifyGreen = '#1DB954';
  const [isDark, setIsDark] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      setIsDark(darkModeMediaQuery.matches);

      const handler = (e: { matches: boolean | ((prevState: boolean) => boolean); }) => setIsDark(e.matches);
      darkModeMediaQuery.addEventListener('change', handler);
      return () => darkModeMediaQuery.removeEventListener('change', handler);
    }
  }, []);


  return (
    <nav className={`max-w-7xl mx-auto font-sans transition-colors duration-200 shadow-md`}>
      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo/Brand */}
          <div className="flex items-center gap-2">
            <span className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Yeabsira <span style={{ color: spotifyGreen }}>Blogs</span>
            </span>
          </div>

          {/* Search Bar - Desktop */}
          <div className="flex-1 max-w-xl mx-8 hidden md:block">
            <div className="relative">
              <input
                type="text"
                placeholder="Search blogs..."
                className={`w-full px-4 py-2 rounded-full border focus:outline-none focus:border-2 ${
                  isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300'
                }`}
                style={{ borderColor: spotifyGreen }}
              />
              <Search 
                className="absolute right-3 top-2.5 text-gray-400"
                size={20}
              />
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4">

            {isLoggedIn ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  {userImage ? (
                    <img
                      src={userImage}
                      alt="Profile"
                      className="w-8 h-8 rounded-full"
                    />
                  ) : (
                    <User className={`w-8 h-8 p-1 rounded-full ${
                      isDark ? 'bg-gray-800' : 'bg-gray-200'
                    }`} />
                  )}
                  <span className="font-medium">{userName}</span>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link href="/login" className={`px-4 py-2 rounded-full font-medium ${
                  isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
                }`}>
                  Log in
                </Link>
                <Link href="/register" className="px-4 py-2 rounded-full font-medium text-white hover:opacity-90"
                  style={{ backgroundColor: spotifyGreen }}>
                  Sign up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <Menu size={24} />
          </button>
        </div>

        {/* Search Bar - Mobile */}
        <div className="mt-3 md:hidden">
          <div className="relative">
            <input
              type="text"
              placeholder="Search blogs..."
              className={`w-full px-4 py-2 rounded-full border focus:outline-none focus:border-2 ${
                isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300'
              }`}
              style={{ borderColor: spotifyGreen }}
            />
            <Search 
              className="absolute right-3 top-2.5 text-gray-400"
              size={20}
            />
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className={`md:hidden border-t ${
          isDark ? 'border-gray-800' : 'border-gray-100'
        }`}>
          <div className="px-4 py-3 space-y-3">
            
            {isLoggedIn ? (
              <div className="flex items-center gap-2 px-4 py-2">
                {userImage ? (
                  <img src={userImage} alt="Profile" className="w-8 h-8 rounded-full" />
                ) : (
                  <User className={`w-8 h-8 p-1 rounded-full ${
                    isDark ? 'bg-gray-800' : 'bg-gray-200'
                  }`} />
                )}
                <span className="font-medium">{userName}</span>
              </div>
            ) : (
              <div className="space-y-2">
                <Link href="/login" className={`block w-full px-4 py-2 rounded-lg ${
                  isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
                }`}>
                  Log in
                </Link>
                <Link href="/register" className="block w-full px-4 py-2 rounded-lg text-white text-center hover:opacity-90"
                  style={{ backgroundColor: spotifyGreen }}>
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavbarComponent;