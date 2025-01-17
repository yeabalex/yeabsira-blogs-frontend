'use client'

import React, { useState, Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { BentoGrid, BentoGridItem } from "../ui/bento-grid";
import { ApiClient } from "@/lib/api-client";
import { blogsBaseURL } from "@/constants/url";
import { useDispatch } from "react-redux";
import { setBlog } from "@/redux/features/blogsSlice";
import { getCookie } from "@/lib/getCookie";

export interface Article {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  content: string; 
  topics: string[];
  likes: number;
  views: number;
  comments: number;
  username: string;
  userid: string;
  liked: boolean
  createdAt: string; 
  updatedAt: string; 
}


export function BlogsGrid() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentTopic = searchParams.get("topic") || "all";
  const [visibleItems, setVisibleItems] = useState(7);
  const [items,setItems] = useState<Article[]|null>(null);
  const [topics,  setTopics] = useState<string[]>([])
  const apiClient = new ApiClient(blogsBaseURL)
  const dispatch = useDispatch()

  useEffect(() => {
    async function fetchTrendingBlogs() {
      try {
        const user = getCookie("user")
        const userid = user?JSON.parse(user).id:""
        const res:{data:Article[]} = await apiClient.get(`/api/v1/trending?userid=${userid}`);
        setItems(res.data);
        dispatch(setBlog(items))
      } catch (error) {
        console.error("Error fetching trending blogs:", error);
      }
    }
  
    fetchTrendingBlogs();
  }, []);
  
  useEffect(() => {
    if (items) {
      const set = new Set<string>();
      items.forEach((item) => item.topics.forEach((topic) => set.add(topic)));
      setTopics(Array.from(set));
    }
  }, [items]);

  const handleTopicChange = (topic: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (topic === "all") {
      params.delete("topic");
    } else {
      params.set("topic", topic);
    }
    router.push(`?${params.toString()}`);
    setVisibleItems(7);
  };

  const filteredItems = currentTopic === "all" 
    ? items 
    : items?.filter(item => item.topics.includes(currentTopic));
  

  const handleShowMore = () => {
    setVisibleItems(prev => prev + 7);
  };

  const handleSave = (id: string) => {
    console.log('Saved article:', id);
  };

  const handleLike = (id: string) => {
    console.log('Liked article:', id);
  };

  return (
    <Suspense>
    <div className="px-4 max-w-7xl mx-auto">
      <h1 className="mt-16 text-3xl font-heading font-bold">Trending Topics</h1>
      
      {/* Topics Section */}
      <div className="mt-8">
        <div className="flex flex-wrap gap-3">
          <TopicButton 
            topic="all"
            current={currentTopic}
            onClick={() => handleTopicChange("all")}
          >
            All
          </TopicButton>
          {topics.map((topic) => (
            <TopicButton
              key={topic}
              topic={topic}
              current={currentTopic}
              onClick={() => handleTopicChange(topic)}
            >
              {topic}
            </TopicButton>
          ))}
        </div>
      </div>

      {/* Articles Grid */}
      <div className="mt-8">
        <BentoGrid 
          className="max-w-full"
          showMore={filteredItems?filteredItems.length > visibleItems:false}
          onShowMore={handleShowMore}
        >
          {filteredItems?.slice(0, visibleItems).map((item, i) => (
            <BentoGridItem
              key={i}
              postID={item.id}
              title={item.title}
              description={item.description}
              header={item.thumbnail}
              likes={item.likes}
              views={item.views}
              comments={item.comments}
              liked={item.liked}
              username={item.username}
              link={`/${item.username}/article/${item.id}`}
              className={i === 3 || i === 6 ? "md:col-span-2" : ""}
              onSave={() => handleSave(item.id)}
              onLike={() => handleLike(item.id)}
            />
          ))}
        </BentoGrid>
      </div>
    </div>
    </Suspense>
  );
}

const TopicButton = ({ 
  children, 
  topic, 
  current, 
  onClick 
}: { 
  children: React.ReactNode; 
  topic: string; 
  current: string; 
  onClick: () => void; 
}) => {
  const isSelected = current === topic;
  
  return (
    <button
      onClick={onClick}
      className={`
        px-4 py-2 rounded-full text-sm font-medium
        transition-all duration-200
        ${isSelected ? 
          'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900' : 
          'bg-neutral-100 text-neutral-600 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700'
        }
      `}
    >
      {children}
    </button>
  );
};

/*const Skeleton = () => (
  <div className="flex flex-1 w-full h-full min-h-[10rem] rounded-xl bg-gradient-to-br from-neutral-200 dark:from-neutral-900 dark:to-neutral-800 to-neutral-100"></div>
);*/





