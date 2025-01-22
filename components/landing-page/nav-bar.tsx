import { useEffect, useState } from "react";
import { motion} from "framer-motion";
import NavbarComponent from "../ui/nav";
import { getCookie } from "@/lib/getCookie";
import { Loader2 } from "lucide-react";

export default function Navbar() {
  const [user, setUser] = useState<{username: string | null}>({username: null});
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const [tokenFromCookie, userFromCookie] = await Promise.all([
          getCookie("token"),
          getCookie("user")
        ]);

        if (tokenFromCookie && userFromCookie) {
          setToken(tokenFromCookie);
          setUser(JSON.parse(userFromCookie));
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, []);

  if (loading) {
    return (
      <div className="w-full h-16 bg-neutral-50 dark:bg-neutral-900 flex items-center justify-center">
        <Loader2 className="w-5 h-5 animate-spin text-neutral-500" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <NavbarComponent
        isLoggedIn={!!token}
        userName={user.username || ''}
        userImage={`https://api.dicebear.com/7.x/initials/svg?seed=${user.username}`}
      />
    </motion.div>
  );
}