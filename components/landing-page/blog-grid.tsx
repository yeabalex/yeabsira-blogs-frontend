'use client'
import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { BentoGrid, BentoGridItem } from "../ui/bento-grid";
import {
  IconClipboardCopy,
  IconFileBroken,
} from "@tabler/icons-react";

export function BlogsGrid() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentTopic = searchParams.get("topic") || "all";
  const [visibleItems, setVisibleItems] = useState(7);

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
    : items.filter(item => item.topics.includes(currentTopic));

  const handleShowMore = () => {
    setVisibleItems(prev => prev + 7);
  };

  const handleSave = (id: number) => {
    console.log('Saved article:', id);
  };

  const handleLike = (id: number) => {
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
          showMore={filteredItems.length > visibleItems}
          onShowMore={handleShowMore}
        >
          {filteredItems.slice(0, visibleItems).map((item, i) => (
            <BentoGridItem
              key={i}
              title={item.title}
              description={item.description}
              header={item.header}
              icon={item.icon}
              likes={item.likes}
              views={item.views}
              comments={item.comments}
              saved={item.saved}
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

// TopicButton component remains the same
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

const Skeleton = () => (
  <div className="flex flex-1 w-full h-full min-h-[10rem] rounded-xl bg-gradient-to-br from-neutral-200 dark:from-neutral-900 dark:to-neutral-800 to-neutral-100"></div>
);

const topics = [
  "Technology",
  "Design",
  "Innovation",
  "Communication",
  "Education",
  "Creativity",
  "Adventure"
];

export const items = [
  {
    id: 1,
    title: "The Dawn of Innovation",
    description: "Explore the birth of groundbreaking ideas and inventions.",
    header:<Skeleton/>,
    content: `
     <div className="header-content">
        <h1 className="text-4xl font-bold">The Dawn of Innovation</h1>
        <p className="text-neutral-500">By yeabalex | 23 comments | 245 likes</p>
      </div>
      <p>In the early days of human history, innovation was driven by necessity. From the creation of simple tools to the development of language, every invention reshaped the way people lived. The Industrial Revolution marked a turning point, giving birth to machinery that could perform tasks more efficiently than ever before.</p>
      
      <h2 style="color: #1a73e8;">The First Wave of Innovation</h2>
      <p>One of the most significant eras of innovation was during the 18th and 19th centuries. The invention of the steam engine, the telegraph, and electricity transformed industries and paved the way for modern technology.</p>
      
      <img src="https://example.com/innovation.jpg" alt="Innovation Image" style="max-width: 100%; height: auto; border-radius: 8px;" />
      
      <h2 style="color: #1a73e8;">Modern Innovation</h2>
      <p>Today, innovation continues to shape the world, from artificial intelligence to space exploration. With rapid advancements in technology, the possibilities seem endless.</p>

      <blockquote>"Innovation distinguishes between a leader and a follower." — Steve Jobs</blockquote>
      
      <p>As we look toward the future, the next wave of innovation may come from fields like quantum computing, renewable energy, and biotechnology.</p>
    `,
    icon: <IconClipboardCopy className="h-4 w-4 text-neutral-500" />,
    topics: ["Innovation", "Technology"],
    likes: 100,
    views: 500,
    comments: 5,
    saved: false,
    username: "yeabalex",
    userid: "677ba27eb602dad3a9b06002"
  },
  {
    id: 2,
    title: "The Digital Revolution",
    description: "Dive into the transformative power of technology.",
    header: <Skeleton/>,
    content: `
      <div className="header-content">
        <h1 className="text-4xl font-bold">The Digital Revolution</h1>
        <p className="text-neutral-500">By yeabalex | 15 comments | 189 likes</p>
      </div>
      <p>The digital revolution has transformed every aspect of our lives. From how we communicate to how we work, technology has reshaped the world in unprecedented ways.</p>
      
      <h2 style="color: #1a73e8;">The Rise of the Internet</h2>
      <p>The internet, once a luxury, is now a necessity. It has connected billions of people, enabling instant communication and global collaboration.</p>
      
      <h2 style="color: #1a73e8;">Artificial Intelligence</h2>
      <p>Artificial intelligence (AI) is the new frontier of the digital revolution. From virtual assistants to autonomous vehicles, AI is making science fiction a reality.</p>
      
      <img src="https://example.com/digital-revolution.jpg" alt="Digital Revolution Image" style="max-width: 100%; height: auto; border-radius: 8px;" />
      
      <p>The future of the digital revolution will likely involve breakthroughs in areas like augmented reality, blockchain, and the Internet of Things (IoT).</p>
      
      <blockquote>"The only way to discover the limits of the possible is to go beyond them into the impossible." — Arthur C. Clarke</blockquote>
    `,
    icon: <IconFileBroken className="h-4 w-4 text-neutral-500" />,
    topics: ["Technology", "Innovation"],
    likes: 100,
    views: 500,
    comments: 5,
    saved: false,
    username: "yeabalex",
    userid: "677ba27eb602dad3a9b06002"
  }
];
