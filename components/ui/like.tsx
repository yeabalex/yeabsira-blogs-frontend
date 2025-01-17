import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { useState } from "react";
import { getCookie } from "@/lib/getCookie";
import { useRouter } from "next/navigation";
import { ApiClient } from "@/lib/api-client";
import { blogsBaseURL } from "@/constants/url";

export default function Like({
  isLiked,
  likes,
  postID
}: {
  isLiked: boolean;
  likes: number;
  postID: string
}) {
  const [liked, setLiked] = useState<boolean>(isLiked);
  const [likeCount, setLikeCount] = useState<number>(likes);
  const router = useRouter();
  const handleLike = () => {
    const user = getCookie("user");
    const token = getCookie("token");
    if (user && token) {
      const userid = JSON.parse(user).id;
      const apiClient = new ApiClient(blogsBaseURL);
      apiClient.setAuthToken(token);
      try{
      if (liked) {
        apiClient.post(`/api/v1/like?id=${postID}&action=unlike&userid=${userid}`,null,{requiresAuth:true});
        setLiked(false);
        setLikeCount((prev) => prev - 1);
      } else {
        apiClient.post(`/api/v1/like?id=${postID}&action=like&userid=${userid}`,null,{requiresAuth:true});
        setLiked(true);
        setLikeCount((prev) => prev + 1);
      }
    }catch(err){
      throw new Error("Something went wrong"+err)
    }
    } else {
      return router.push("/login");
    }
  };

  return (
    <motion.button
      onClick={handleLike}
      className="flex items-center gap-1 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors"
      whileTap={{ scale: 0.8 }}
    >
      <Heart
        className={cn("w-4 h-4", liked ? "fill-red-500 text-red-500" : "")}
      />
      <motion.span
        animate={{ scale: liked ? [1, 1.3, 1] : 1 }}
        transition={{ duration: 0.2 }}
      >
        {likeCount}
      </motion.span>
    </motion.button>
  );
}
