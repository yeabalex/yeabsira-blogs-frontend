'use client'
import { useEffect, useState } from "react";
import { getCookie } from "@/lib/getCookie";

function AuthStatus({ token, user }: { token: string | null, user: {username:string|null} }) {
  return token ? user?.username : "Login";
}

function UserData() {
  const [user, setUser] = useState<{username:string|null}>({username:null});
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function cookies() {
      const tokenFromCookie = await getCookie("token");
      const userFromCookie = await getCookie("user");
      if (tokenFromCookie && userFromCookie) {
        setToken(tokenFromCookie);
        setUser(JSON.parse(userFromCookie));
      }
      setLoading(false);
    }
    cookies();
  }, []);

  if (loading) return <p>Loading...</p>;
  console.log(user)
  return <AuthStatus token={token} user={user} />;
}

export default function Home() {
  return (
    <>
      <UserData />
      <p>Blogs</p>
    </>
  );
}
