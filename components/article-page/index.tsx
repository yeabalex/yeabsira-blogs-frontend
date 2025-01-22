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
import { useDispatch } from "react-redux";
import { setBlog } from "@/redux/features/blogsSlice";
import { formatTimeDifference } from "@/lib/formatTimeDifference";
import { addSummary } from "@/redux/features/aiSummarySlice";

export default function Article({ id }: { id: string }) {
  const [showComments, setShowComments] = useState(false);
  const [showAISummary, setShowAISummary] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [summary, setSummary] = useState<string>();

  const [article, setArticle] = useState<Article | null>();
  const router = useRouter();
  const [page, setPage] = useState<React.JSX.Element>();
  const [bundle, setBundle] = useState<number>(0);
  const dispatch = useDispatch();

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
          const articleArr: Article[] = [res.data as Article];
          dispatch(setBlog(articleArr));
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

  async function showCommentsHandler() {
    const token = getCookie("token");

    if (token && !showComments && !comments.length) {
      setBundle(0);
      const apiClient = new ApiClient(blogsBaseURL);
      apiClient.setAuthToken(token);
      const res: { data: { content: Comment[] } } = await apiClient.get(
        `/api/v1/get/comments/${article?.id}?page=${bundle}&size=5`,
        { requiresAuth: true }
      );
      setComments(res.data.content);
      router.push("#comment");
    }
    setShowComments(!showComments);
  }

  async function showAISummaryHandler() {
    const token = getCookie("token");
    if (!token || !article?.content) return;
    setShowAISummary((prev) => !prev);
    if (!showAISummary && !summary) {
      try {
        if(!showAISummary) router.push("#ai");
        const apiClient = new ApiClient(blogsBaseURL);
        apiClient.setAuthToken(token);

        const res: { data: { response: string } } = await apiClient.post(
          "/api/v1/ai",
          { body: { prompt: article.content } },
          { requiresAuth: true }
        );

        if(res.data) setSummary(res.data.response);
        dispatch(addSummary({summary: res.data.response}));
      } catch (error) {
        console.error("AI Summary error:", error);
      }
    }
  }

  const handleAddComment = (content: string) => {
    const newComment = {
      id: comments.length + 1,
      username: "You",
      content: content,
      createdAt: "Just now",
      replies: 0,
    };
    setComments([newComment, ...comments]);
  };

  if (article) {
    return (
      <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white">
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
                  {article.views} views ·{" "}
                  {formatTimeDifference(article.createdAt)}
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
              <span>{article.comments}</span>
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
                <AISummary summary={summary} />
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
