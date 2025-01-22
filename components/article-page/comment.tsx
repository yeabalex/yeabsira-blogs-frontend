import React, { useState } from "react";
import { Reply as ReplyIcon, Send, X, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ApiClient } from "@/lib/api-client";
import { blogsBaseURL } from "@/constants/url";
import { getCookie } from "@/lib/getCookie";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { formatTimeDifference } from "@/lib/formatTimeDifference";

interface Reply {
  id: number;
  username: string;
  reply: string;
  createdAt: string;
}

interface Comment {
  id: number;
  username: string;
  content: string;
  createdAt: string;
  replies: number;
}

interface CommentProps {
  comment: Comment;
}

export const CommentComponent: React.FC<CommentProps> = ({ comment }) => {
  const [isReplying, setIsReplying] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [showReplies, setShowReplies] = useState(false);
  const [replies, setReplies] = useState<Reply[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selector = useSelector((state: RootState) => state.blogReducer);
  const article = selector.blog?.[0];

  const handleSubmitReply = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!replyContent.trim()) {
      setError("Reply cannot be empty.");
      return;
    }
    if (!replies.length) {
      try {
        const token = getCookie("token");
        const user = getCookie("user");

        if (!token || !user || !article) {
          setError("You must be logged in to reply.");
          return;
        }

        const userId = JSON.parse(user).id;
        const username = JSON.parse(user).username;

        const apiClient = new ApiClient(blogsBaseURL);
        apiClient.setAuthToken(token);

        const response = await apiClient.post(
          "/api/v1/reply",
          {
            username,
            userID: userId,
            articleID: article.id,
            commentID: comment.id,
            reply: replyContent,
          },
          { requiresAuth: true }
        );

        if (response.status === 200 || response.status === 201) {
          const newReply: Reply = {
            id: Date.now(),
            username,
            reply: replyContent,
            createdAt: "Just now",
          };
          setReplies((prev) => [newReply, ...prev]);
          setReplyContent("");
          setIsReplying(false);

          comment.replies++;
        } else {
          setError("Failed to post reply. Please try again later.");
        }
      } catch (err) {
        console.error("Error posting reply:", err);
        setError("An unexpected error occurred. Please try again later.");
      }
    }
  };

  const fetchReplies = async () => {
    try {
      setIsLoading(true);
      const token = getCookie("token");

      if (!token) {
        setError("Unable to load replies.");
        return;
      }

      const apiClient = new ApiClient(blogsBaseURL);
      apiClient.setAuthToken(token);

      const res: { data: { content: Reply[] } } = await apiClient.get(
        `/api/v1/reply/${comment.id}?page=${currentPage}&size=5`,
        { requiresAuth: true }
      );

      if (res.data.content.length > 0) {
        if (currentPage === 0) {
          setReplies(res.data.content);
        } else {
          setReplies((prev) => [...prev, ...res.data.content]);
        }
      }
    } catch (err) {
      console.error("Error fetching replies:", err);
      setError("Failed to load replies. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleReplies = async () => {
    if (!showReplies && replies.length === 0) {
      await fetchReplies();
    }
    setShowReplies(!showReplies);
  };

  const loadMoreReplies = async () => {
    setCurrentPage((prev) => prev + 1);
    await fetchReplies();
  };

  return (
    <div className="space-y-4 text-white">
      {/* Comment */}
      <div className="bg-black dark:bg-gray-900 p-4 rounded-lg">
        <div className="flex items-center space-x-2 mb-2">
          <div className="h-8 w-8 rounded-full bg-gradient-to-r from-[#1DB954] to-[#169941] flex items-center justify-center text-black text-sm font-medium">
            {comment.username[0]}
          </div>
          <div>
            <p className="font-medium">{comment.username}</p>
            <p className="text-sm text-gray-400">
              {formatTimeDifference(comment.createdAt)}
            </p>
          </div>
        </div>
        <p className="text-gray-300">{comment.content}</p>
        <button
          onClick={() => setIsReplying(!isReplying)}
          className="mt-2 flex items-center space-x-1 text-sm text-gray-400 hover:text-[#1DB954] transition-colors"
        >
          <ReplyIcon size={14} />
          <span>Reply</span>
        </button>
      </div>

      {/* Reply Form with Animation */}
      <AnimatePresence>
        {isReplying && (
          <motion.div
            className="ml-8"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <form onSubmit={handleSubmitReply} className="space-y-3">
              <div className="relative">
                <textarea
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder="Write a reply..."
                  className="w-full p-3 rounded-lg bg-gray-900 border border-gray-800 focus:ring-2 focus:ring-[#1DB954] focus:border-transparent resize-none text-white placeholder-gray-500"
                  rows={2}
                />
                <button
                  type="button"
                  onClick={() => setIsReplying(false)}
                  className="absolute top-2 right-2 text-gray-500 hover:text-white"
                >
                  <X size={16} />
                </button>
              </div>
              {error && <div className="text-red-500 text-sm">{error}</div>}
              <button
                type="submit"
                className="flex items-center space-x-2 px-4 py-1.5 bg-[#1DB954] text-black rounded-lg hover:bg-[#169941] transition-colors text-sm font-medium"
              >
                <Send size={14} />
                <span>Reply</span>
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Replies Section with Slide Animation */}
      {comment.replies > 0 && (
        <div className="ml-8">
          <button
            onClick={toggleReplies}
            className="mt-2 flex items-center space-x-1 text-sm text-gray-400 hover:text-[#1DB954] transition-colors"
          >
            <ChevronDown
              size={14}
              className={`transform transition-transform ${
                showReplies ? "rotate-180" : ""
              }`}
            />
            <span>
              {showReplies ? "Hide" : "View"} {comment.replies} replies
            </span>
          </button>

          <AnimatePresence>
            {showReplies && (
              <motion.div
                className="mt-2 space-y-4"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
              >
                {replies.map((reply) => (
                  <div key={reply.id} className="bg-black dark:bg-gray-900/50 p-4 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="h-6 w-6 rounded-full bg-gradient-to-r from-[#1DB954] to-[#169941] flex items-center justify-center text-black text-xs font-medium">
                        {reply.username[0]}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{reply.username}</p>
                        <p className="text-xs text-gray-400">
                          {formatTimeDifference(reply.createdAt)}
                        </p>
                      </div>
                    </div>
                    <p className="text-gray-300 text-sm">{reply.reply}</p>
                  </div>
                ))}

                {isLoading && (
                  <div className="text-center text-gray-400 text-sm">
                    Loading replies...
                  </div>
                )}

                {!isLoading && replies.length < comment.replies && (
                  <motion.button
                    onClick={loadMoreReplies}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="mt-2 text-sm text-gray-400 hover:text-[#1DB954] transition-colors"
                  >
                    Load more replies
                  </motion.button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export type { Comment, Reply };
