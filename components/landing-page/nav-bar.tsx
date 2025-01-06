import NavbarComponent from "../ui/nav";
import { useEffect, useState } from "react";
import { getCookie } from "@/lib/getCookie";

export default function Navbar() {
    const [user, setUser] = useState<{username: string | null}>({username: null});
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchUserData() {
            const tokenFromCookie = await getCookie("token");
            const userFromCookie = await getCookie("user");
            
            if (tokenFromCookie && userFromCookie) {
                setToken(tokenFromCookie);
                setUser(JSON.parse(userFromCookie));
            }
            setLoading(false);
        }
        fetchUserData();
    }, []);

    if (loading) {
        return <div className="w-full h-16 bg-gray-100 animate-pulse" />; 
    }

    return (
        <NavbarComponent 
            isLoggedIn={!!token}
            userName={user.username || ''}
            userImage={``} 
        />
    );
}