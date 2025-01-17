import React, { useState } from 'react';
import { Reply, Send, X, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Reply {
  id: number;
  username: string;
  content: string;
  timestamp: string;
}

interface Comment {
  id: number;
  username: string;
  content: string;
  timestamp: string;
  replies: Reply[];
}

interface CommentProps {
  comment: Comment;
  onReply: (commentId: number, content: string) => void;
}

export const CommentComponent: React.FC<CommentProps> = ({ comment, onReply }) => {
  const [isReplying, setIsReplying] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [showReplies, setShowReplies] = useState(false);
  const [replyCount, setReplyCount] = useState(5); // Number of replies to display

  const handleSubmitReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (replyContent.trim()) {
      onReply(comment.id, replyContent);
      setReplyContent('');
      setIsReplying(false);
    }
  };

  const toggleReplies = () => setShowReplies(!showReplies);

  const loadMoreReplies = () => setReplyCount((prev) => prev + 5);

  return (
    <div className="space-y-4">
      {/* Comment */}
      <div className="bg-gray-900 p-4 rounded-lg">
        <div className="flex items-center space-x-2 mb-2">
          <div className="h-8 w-8 rounded-full bg-gradient-to-r from-[#1DB954] to-[#169941] flex items-center justify-center text-black text-sm font-medium">
            {comment.username[0]}
          </div>
          <div>
            <p className="font-medium">{comment.username}</p>
            <p className="text-sm text-gray-400">{comment.timestamp}</p>
          </div>
        </div>
        <p className="text-gray-300">{comment.content}</p>
        <button
          onClick={() => setIsReplying(!isReplying)}
          className="mt-2 flex items-center space-x-1 text-sm text-gray-400 hover:text-[#1DB954] transition-colors"
        >
          <Reply size={14} />
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
      {comment.replies.length > 0 && (
        <div className="ml-8">
          <button
            onClick={toggleReplies}
            className="mt-2 flex items-center space-x-1 text-sm text-gray-400 hover:text-[#1DB954] transition-colors"
          >
            <ChevronDown size={14} />
            <span>
              {showReplies ? 'Hide' : 'View'} {comment.replies.length} replies
            </span>
          </button>

          <AnimatePresence>
            {showReplies && (
              <motion.div
                className="mt-2 space-y-4"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.4, ease: 'easeInOut' }}
              >
                {comment.replies.slice(0, replyCount).map((reply) => (
                  <div key={reply.id} className="bg-gray-900/50 p-4 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="h-6 w-6 rounded-full bg-gradient-to-r from-[#1DB954] to-[#169941] flex items-center justify-center text-black text-xs font-medium">
                        {reply.username[0]}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{reply.username}</p>
                        <p className="text-xs text-gray-400">{reply.timestamp}</p>
                      </div>
                    </div>
                    <p className="text-gray-300 text-sm">{reply.content}</p>
                  </div>
                ))}

                {replyCount < comment.replies.length && (
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
