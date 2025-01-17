import React from 'react';
import { Sparkles } from 'lucide-react';

interface AISummaryProps {
  isLoading?: boolean;
  summary?: string;
}

export const AISummary: React.FC<AISummaryProps> = ({ 
  isLoading = true, 
  summary 
}) => {
  return (
    <div className="bg-gradient-to-r from-[#1DB954]/10 to-[#169941]/10 p-6 rounded-xl mb-8">
      <div className="flex items-center space-x-2 mb-4">
        <Sparkles className="text-[#1DB954]" />
        <h3 className="font-semibold text-lg">AI Summary</h3>
      </div>
      <p className="text-gray-300">
        {isLoading ? "Loading AI summary..." : summary}
      </p>
    </div>
  );
};