import React from 'react';
import { Ghost, HomeIcon, Coffee } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="p-8 rounded-lg max-w-md w-full mx-4">
        <div className="text-center">
          {/* Bouncing ghost animation */}
          <div className="relative w-20 h-20 mx-auto mb-6 animate-bounce">
            <Ghost className="w-full h-full text-white" />
          </div>

          <h1 className="text-6xl font-bold text-white mb-4">4 oh! 4</h1>
          
          <div className="space-y-4 text-white">
            <p className="text-xl font-medium">Oops! Page Not Found</p>
            <p className="text-gray-400">
              Who told you to come here bruv?
            </p>
          </div>

          <div className="mt-8 flex flex-col space-y-4">
            <button className="flex items-center justify-center space-x-2 bg-[#1DB954] text-black px-6 py-3 rounded-full font-medium hover:bg-opacity-90 transition-all">
              <HomeIcon className="w-5 h-5" />
              <span>Take Me Home</span>
            </button>
          </div>

          <div className="mt-8 flex items-center justify-center space-x-2 text-gray-400">
            <Coffee className="w-5 h-5 animate-pulse" />
            <p>Error 404: Page is on break</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;