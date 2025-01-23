'use client'

import React, { useState, Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { BentoGrid, BentoGridItem } from "../ui/bento-grid";
import { ApiClient } from "@/lib/api-client";
import { blogsBaseURL } from "@/constants/url";
import { getCookie } from "@/lib/getCookie";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2 } from "lucide-react";

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


export function BlogsGrid({desc}:{desc?:boolean}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentTopic = searchParams.get("topic") || "all";
  const [visibleItems, setVisibleItems] = useState(7);
  const [items,setItems] = useState<Article[]|null>(null);
  const [topics,  setTopics] = useState<string[]>([])
  const [loading, setLoading] = useState(true);
  const apiClient = new ApiClient(blogsBaseURL)

  useEffect(() => {
    async function fetchTrendingBlogs() {
      try {
        const user = getCookie("user")
        const userid = user?JSON.parse(user).id:""
        const res:{data:Article[]} = await apiClient.get(`/api/v1/trending?userid=${userid}`);
        const sortedArticles = res.data.sort((a, b) => b.likes - a.likes);
        if(desc){
          setItems(sortedArticles)
        }else{
          setItems(res.data)
        }
      } catch (error) {
        console.error("Error fetching trending blogs:", error);
      }finally{
        setLoading(false);
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

  /*const handleTopicChange = (topic: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (topic === "all") {
      params.delete("topic");
    } else {
      params.set("topic", topic);
    }
    router.push(`?${params.toString()}`);
    setVisibleItems(7);
  };
*/
  const filteredItems = currentTopic === "all" 
    ? items 
    : items?.filter(item => item.topics.includes(currentTopic));
  
/*
  const handleShowMore = () => {
    setVisibleItems(prev => prev + 7);
  };
*/
  /*const handleSave = (id: string) => {
    console.log('Saved article:', id);
  };
*/
  /*const handleLike = (id: string) => {
    console.log('Liked article:', id);
  };
  */

  return (
    <Suspense>
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="px-6 max-w-7xl mx-auto"
    >
      <h1 className="mt-16 text-4xl font-heading font-bold bg-gradient-to-r from-neutral-800 to-neutral-600 dark:from-neutral-200 dark:to-neutral-400 bg-clip-text text-transparent">
        {desc?"Trending Topics":"Recently Posted"}
      </h1>
      
      <div className="mt-8">
        <AnimatePresence>
          <div className="flex flex-wrap gap-3">
            <TopicButton 
              topic="all"
              current={currentTopic}
              onClick={() => {
                router.push("/");
                setVisibleItems(7);
              }}
            >
              All
            </TopicButton>
            {topics.map((topic) => (
              <TopicButton
                key={topic}
                topic={topic}
                current={currentTopic}
                onClick={() => {
                  router.push(`?topic=${topic}`);
                  setVisibleItems(7);
                }}
              >
                {topic}
              </TopicButton>
            ))}
          </div>
        </AnimatePresence>
      </div>

      {loading ? (
        <div className="mt-16 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-neutral-500" />
        </div>
      ) : (
        <div className="mt-8">
          <BentoGrid 
            className="max-w-full"
            showMore={filteredItems ? filteredItems.length > visibleItems : false}
            onShowMore={() => setVisibleItems(prev => prev + 7)}
          >
            {filteredItems?.slice(0, visibleItems).map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <BentoGridItem
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
                  onSave={() => console.log('Saved:', item.id)}
                  onLike={() => console.log('Liked:', item.id)}
                />
              </motion.div>
            ))}
          </BentoGrid>
        </div>
      )}
    </motion.div>
  </Suspense>
  );
}


/*const Skeleton = () => (
  <div className="flex flex-1 w-full h-full min-h-[10rem] rounded-xl bg-gradient-to-br from-neutral-200 dark:from-neutral-900 dark:to-neutral-800 to-neutral-100"></div>
);*/

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
}) => (
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    className={`
      px-4 py-2 rounded-full text-sm font-medium
      transition-all duration-200
      ${current === topic ? 
        'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-lg' : 
        'bg-neutral-100 text-neutral-600 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700'
      }
    `}
  >
    {children}
  </motion.button>
);