'use client'
import { Hero } from "./hero";
import { BlogsGrid } from "./blog-grid";
import Navbar from "./nav-bar";
import { ApiClient } from "@/lib/api-client";
import { baseURL } from "@/constants/url";
import { useEffect, useState } from "react";
import { getCookie } from "@/lib/getCookie";

export default function LandingPage(){
    const [status, setStatus] = useState<boolean>()
    useEffect(()=>{
        async function getStatus(){
            const token = getCookie("token")
            const apiClient = new ApiClient(baseURL)
            const res = await apiClient.get(`/api/v1/auth/validate?token=${token}`)
            setStatus(res.status === 200 || res.status === 201)
        }
        getStatus()
    },[])

    return (
        <>
        <Navbar/>
        {status?<BlogsGrid desc={true}/>:<Hero/>}
        <BlogsGrid desc={false}/>
        </>
    )
}