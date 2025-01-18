import React from "react";
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
  onReply: (commentId: number, content: string) => void;
}

export const CommentsSection: React.FC<CommentsSectionProps> = ({
  comments,
  onAddComment,
  onReply,
}) => {
  const [newComment, setNewComment] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const selector = useSelector((state: RootState) => state.blogReducer);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // Reset error state on every attempt

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
      const articleArr = selector.blog;

      if (!articleArr || articleArr.length === 0) {
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
          articleID: articleArr[0].id,
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
            onReply={onReply}
          />
        ))}
      </div>
    </div>
  );
};
