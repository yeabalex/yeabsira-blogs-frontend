import React from "react";
import { Sparkles } from "lucide-react";

interface AISummaryProp {
  summary?: string | null | undefined;
}

const AISummaryContent = ({ summary }: { summary: string | null | undefined }) => {
  if (!summary) {
    return <p className="text-gray-300">Unknown error occurred</p>;
  }

  return (
    <div className="prose prose-invert max-w-none">
      <div 
        className="text-gray-300"
        dangerouslySetInnerHTML={{ __html: summary.replace(/```html|```/g, "").trim() }} 
      />
    </div>
  );
};

export const AISummary: React.FC<AISummaryProp> = ({
  summary,
}) => {
  return (
    <div className="bg-black dark:bg-gradient-to-r from-[#1DB954]/10 to-[#169941]/10 p-6 rounded-xl mb-8">
      <div className="flex items-center space-x-2 mb-4">
        <Sparkles className="text-[#1DB954]" />
        <h3 className="font-semibold text-lg text-white">AI Summary</h3>
      </div>
      <div>
        {!summary ? (
          <p className="text-gray-300">Loading AI summary...</p>
        ) : (
          <AISummaryContent summary={summary} />
        )}
      </div>
    </div>
  );
};

export type { AISummaryProp };