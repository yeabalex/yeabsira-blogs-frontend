import React, { useEffect, useState } from "react";
import NotFoundPage from "@/app/not-found";
import { MessageCircle, Sparkles, Share2, Bookmark } from "lucide-react";
import { CommentsSection } from "./comment-section";
import { AISummary } from "./ai-summary";
import type { Comment } from "./comment";
import { motion } from "framer-motion";
import { ApiClient } from "@/lib/api-client";
import type { Article } from "../landing-page/blog-grid";
import { blogsBaseURL } from "@/constants/url";
import Like from "../ui/like";
import { getCookie } from "@/lib/getCookie";
import { useRouter } from "next/navigation";
import LoadingPage from "@/components/ui/loading";

export default function Article({ id }: { id: string }) {
  const [showComments, setShowComments] = useState(false);
  const [showAISummary, setShowAISummary] = useState(false);
  const [comments, setComments] = useState<Comment[]>([
    {
      id: 1,
      username: "Sarah K.",
      content: "Great article! Very insightful.",
      timestamp: "2 hours ago",
      replies: [
        {
          id: 1,
          username: "John D.",
          content:
            "Totally agree! The perspectives shared here are eye-opening.",
          timestamp: "1 hour ago",
        },
      ],
    },
    {
      id: 2,
      username: "Mike R.",
      content: "Thanks for sharing this perspective.",
      timestamp: "5 hours ago",
      replies: [],
    },
  ]);

  const [article, setArticle] = useState<Article | null>();
  const router = useRouter();
  const [page, setPage] = useState<React.JSX.Element>();

  useEffect(() => {
    async function fetchArticle() {
      const apiClient = new ApiClient(blogsBaseURL);
      const authToken = getCookie("token");
      const user = getCookie("user");
      setPage(<LoadingPage />);
      if (authToken && user) {
        const userid = JSON.parse(user).id;
        apiClient.setAuthToken(authToken);
        try {
          const res = await apiClient.get(
            `/api/v1/articles?id=${id}&userid=${userid}`,
            {
              requiresAuth: true,
            }
          );
          setArticle(res.data as Article);
        } catch (err) {
          if ((err as Error).message === "Resource not found.") {
            setPage(<NotFoundPage />);
          }
        }
      } else {
        router.push("/login");
      }
    }
    fetchArticle();
  }, []);

  function showCommentsHandler() {
    setShowComments(!showComments);
    if (!showComments) {
      router.push("#comment");
    }
  }

  function showAISummaryHandler() {
    setShowAISummary(!showAISummary);
    if (!showAISummary) {
      router.push("#ai");
    }
  }

  const handleAddComment = (content: string) => {
    const newComment = {
      id: comments.length + 1,
      username: "You",
      content: content,
      timestamp: "Just now",
      replies: [],
    };
    setComments([newComment, ...comments]);
  };

  const handleReply = (commentId: number, content: string) => {
    setComments(
      comments.map((comment) => {
        if (comment.id === commentId) {
          return {
            ...comment,
            replies: [
              ...comment.replies,
              {
                id: comment.replies.length + 1,
                username: "You",
                content: content,
                timestamp: "Just now",
              },
            ],
          };
        }
        return comment;
      })
    );
  };
  if (article) {
    return (
      <div className="min-h-screen bg-black text-white">
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Hero Section */}
          <div className="space-y-6 mb-8">
            <div className="space-y-2">
              {article.topics.map((topic, index) => (
                <span
                  key={index}
                  className="inline-block bg-[#1DB954]/20 text-[#1DB954] text-sm px-3 py-1 rounded-full mr-2"
                >
                  {topic}
                </span>
              ))}
              <h1 className="text-4xl font-bold mt-4">{article.title}</h1>
            </div>

            <div className="flex items-center space-x-4">
              <div className="h-12 w-12 rounded-full bg-gradient-to-r from-[#1DB954] to-[#169941] flex items-center justify-center text-black font-bold">
                {article.username[0]}
              </div>
              <div>
                <p className="font-medium">{article.username}</p>
                <p className="text-sm text-gray-400">
                  {article.views} views · {new Date().toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 border-t border-b border-gray-800 py-4 mb-8">
            <Like
              likes={article.likes}
              isLiked={article.liked}
              postID={article.id}
            />

            <button
              onClick={showCommentsHandler}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-800"
            >
              <MessageCircle size={20} />
              <span>{comments.length}</span>
            </button>

            <button
              onClick={showAISummaryHandler}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                showAISummary ? "bg-[#1DB954] text-black" : "hover:bg-gray-800"
              }`}
            >
              <Sparkles size={20} />
              <span>AI Summary</span>
            </button>

            <div className="flex-grow" />

            <button className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-800">
              <Share2 size={20} />
            </button>

            <button className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-800">
              <Bookmark size={20} />
            </button>
          </div>

          {/* Content Section */}
          <div
            className="prose prose-invert max-w-none mb-8"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />

          {/* AI Summary */}
          <div id="ai">
            {showAISummary && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <AISummary />
              </motion.div>
            )}
          </div>

          {/* Comments Section */}
          <div id="comment">
            {showComments && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <CommentsSection
                  comments={comments}
                  onAddComment={handleAddComment}
                  onReply={handleReply}
                />
              </motion.div>
            )}
          </div>
        </div>
      </div>
    );
  } else {
    return <>{page}</>;
  }
}
