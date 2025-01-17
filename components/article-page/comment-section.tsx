import React from 'react';
import { Send } from 'lucide-react';
import { CommentComponent, type Comment } from './comment';

interface CommentsSectionProps {
  comments: Comment[];
  onAddComment: (content: string) => void;
  onReply: (commentId: number, content: string) => void;
}

export const CommentsSection: React.FC<CommentsSectionProps> = ({ 
  comments, 
  onAddComment, 
  onReply 
}) => {
  const [newComment, setNewComment] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      onAddComment(newComment);
      setNewComment('');
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