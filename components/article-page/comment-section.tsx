import React, { useState } from "react";
import { Send } from "lucide-react";
import { CommentComponent, type Comment } from "./comment";
import { ApiClient } from "@/lib/api-client";
import { blogsBaseURL } from "@/constants/url";
import { getCookie } from "@/lib/getCookie";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

interface CommentsSectionProps {
  comments: Comment[];
  onAddComment: (content: string) => void;
  
}

export const CommentsSection: React.FC<CommentsSectionProps> = ({
  comments: initialComments,
  onAddComment,
  
}) => {
  const [newComment, setNewComment] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [currentPage, setCurrentPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const selector = useSelector((state: RootState) => state.blogReducer);
  const article = selector.blog?.[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!newComment.trim()) {
      setError("Comment cannot be empty.");
      return;
    }
    try {
      const token = getCookie("token");
      const user = getCookie("user");
      if (!token || !user) {
        setError("You must be logged in to post a comment.");
        return;
      }
      const userid = JSON.parse(user).id;
      const username = JSON.parse(user).username;
      
      if (!article) {
        setError("Failed to retrieve article details. Please try again.");
        return;
      }
      
      const apiClient = new ApiClient(blogsBaseURL);
      apiClient.setAuthToken(token);
      const response = await apiClient.post(
        "/api/v1/add/comment",
        {
          content: newComment,
          replies: 0,
          userID: userid,
          articleID: article.id,
          username: username
        },
        { requiresAuth: true }
      );
      if (response.status === 200 || response.status === 201) {
        onAddComment(newComment);
        setNewComment("");
      } else {
        setError("Failed to post comment. Please try again later.");
      }
    } catch (err) {
      console.error("An error occurred:", err);
      setError("An unexpected error occurred. Please try again later.");
    }
  };

  const loadMoreComments = async () => {
    try {
      setIsLoading(true);
      const token = getCookie("token");
      
      if (!token || !article) {
        setError("Unable to load more comments.");
        return;
      }

      const nextPage = currentPage + 1;
      const apiClient = new ApiClient(blogsBaseURL);
      apiClient.setAuthToken(token);
      
      const res: { data: { content: Comment[] } } = await apiClient.get(
        `/api/v1/get/comments/${article.id}?page=${nextPage}&size=5`,
        { requiresAuth: true }
      );

      if (res.data.content.length > 0) {
        setComments(prevComments => [...prevComments, ...res.data.content]);
        setCurrentPage(nextPage);
      }
    } catch (err) {
      console.error("Error loading more comments:", err);
      setError("Failed to load more comments. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const showLoadMore = article && comments.length < article.comments;

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write a comment..."
          className="w-full p-4 rounded-lg bg-gray-900 border border-gray-800 focus:ring-2 focus:ring-[#1DB954] focus:border-transparent resize-none text-white placeholder-gray-500"
          rows={3}
        />
        {error && (
          <div className="text-red-500 text-sm mt-2">
            {error}
          </div>
        )}
        <button
          type="submit"
          className="flex items-center space-x-2 px-6 py-2 bg-[#1DB954] text-black rounded-lg hover:bg-[#169941] transition-colors font-medium"
        >
          <Send size={16} />
          <span>Post Comment</span>
        </button>
      </form>
      
      <div className="space-y-6">
        {comments.map((comment) => (
          <CommentComponent
            key={comment.id}
            comment={comment}
          />
        ))}
      </div>

      {showLoadMore && (
        <div className="flex justify-center mt-6">
          <button
            onClick={loadMoreComments}
            disabled={isLoading}
            className={`px-6 py-2 rounded-lg transition-colors ${
              isLoading 
                ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                : "bg-gray-800 text-white hover:bg-gray-700"
            }`}
          >
            {isLoading ? "Loading..." : "Load More Comments"}
          </button>
        </div>
      )}
    </div>
  );
};