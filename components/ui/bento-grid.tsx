import { cn } from "@/lib/utils";
import { MessageCircle, Eye, Bookmark, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import Like from "./like";

export const BentoGrid = ({
  className,
  children,
  showMore = false,
  onShowMore,
}: {
  className?: string;
  children?: React.ReactNode;
  showMore?: boolean;
  onShowMore?: () => void;
}) => {
  return (
    <div className="space-y-4">
      <div
        className={cn(
          "grid md:auto-rows-[18rem] grid-cols-1 md:grid-cols-3 gap-4",
          className
        )}
      >
        {children}
      </div>
      {showMore && (
        <button
          onClick={onShowMore}
          className="w-full mt-6 py-3 flex items-center justify-center gap-2 rounded-xl bg-neutral-100 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors duration-200"
        >
          See More
          <ChevronRight className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export const BentoGridItem = ({
  className,
  title,
  description,
  header,
  icon,
  likes = 0,
  views = 0,
  comments = 0,
  liked,
  username,
  saved = false,
  postID,
  link,
  onSave,
}: {
  className?: string;
  title?: string | React.ReactNode;
  description?: string | React.ReactNode;
  header?: React.ReactNode;
  icon?: React.ReactNode;
  likes?: number;
  views?: number;
  comments?: number;
  liked:boolean,
  username:string,
  saved?: boolean;
  postID: string,
  link:string
  onSave?: () => void;
  onLike?: () => void;
}) => {
  const [isSaved, setIsSaved] = useState(saved);




  const handleSave = () => {
    setIsSaved(!isSaved);
    onSave?.();
  };

  return (
    
    <div
      className={cn(
        "row-span-1 rounded-xl group/bento hover:shadow-xl transition duration-200 shadow-input dark:shadow-none px-4 dark:bg-black dark:border-white/[0.2] bg-white border border-transparent justify-between flex flex-col space-y-4 h-80 pb-4",
        className
      )}
    >
      <div className="relative">
        <button
          onClick={handleSave}
          className={cn(
            "p-2 rounded-full absolute top-5 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors",
            isSaved ? "text-blue-500" : "text-neutral-400"
          )}
        >
          <Bookmark className="w-5 h-5" />
        </button>
      </div>
      
      <Link href={link} className="w-full h-full">{header}</Link>
      
      <div className="group-hover/bento:translate-x-2 transition duration-200 space-y-4">
        <div>
          {icon}
          <div className="font-sans font-bold text-neutral-600 dark:text-neutral-200 mb-2 mt-2">
            {title}
          </div>
          <div className="font-sans font-normal text-neutral-600 text-xs dark:text-neutral-300 mb-2">
            {description}
          </div>
          <p className="text-sm cursor-pointer text-[#1DB954] hover:underline">{username}</p>
        </div>


        <div className="flex items-center gap-4 text-sm text-neutral-500 dark:text-neutral-400">
 
            <Like isLiked={liked} likes={likes} postID={postID}/>
            
          
          
          <div className="flex items-center gap-1">
            <Eye className="w-4 h-4" />
            <span>{views}</span>
          </div>
          
          <div className="flex items-center gap-1">
            <MessageCircle className="w-4 h-4" />
            <span>{comments}</span>
          </div>
        </div>
      </div>
      </div>
    
  );
};