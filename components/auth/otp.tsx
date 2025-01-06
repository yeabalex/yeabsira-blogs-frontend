"use client";

import React, { useEffect, useState} from "react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useSearchParams } from "next/navigation";
import { baseURL } from "@/constants/url";
import { ApiClient } from "@/lib/api-client";
import { Data } from "./register";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import type { RootState } from "@/redux/store";

export function InputOTPComponent() {
  const [otp, setOtp] = useState<string>("");
  const query = useSearchParams();
  const email = query.get("email");
  const handleOtpChange = (value: string) => {
    setOtp(value);
  };
  const [error, setError] = useState<string|null>(null)
  const selector = useSelector((state:RootState)=>state.userReducer)
  const router = useRouter()

  useEffect(()=>{
    function checkSession(){
      if(selector.userData.user?.email){
        return
      }
      router.push("/register")
    }
    checkSession()
  },[])
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const apiClient = new ApiClient(baseURL);
      const res = await apiClient.post(`/api/v1/verify?email=${email}&code=${otp}`);
      console.log(res)
      const data = (await res).data as Data;
      
      document.cookie = `token=${data.token}; path=/; max-age=${
        7 * 24 * 60 * 60
      }`;
      document.cookie = `user=${encodeURIComponent(
        JSON.stringify(data.user)
      )}; path=/; max-age=${7 * 24 * 60 * 60}`;
      router.push("/")
    } catch (err) {
        setError((err as Error).message)
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col items-center min-h-screen justify-center gap-8"
    >
      {error&&<p className="text-red-700">{error}</p>} 
      <p className="text-black dark:text-white">Check your email adress for your OTP</p>
      <InputOTP maxLength={6} onChange={handleOtpChange} className="">
        <InputOTPGroup className="">
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
          <InputOTPSlot index={2} />
        </InputOTPGroup>
        <InputOTPGroup className="">
          <InputOTPSlot index={3} />
          <InputOTPSlot index={4} />
          <InputOTPSlot index={5} />
        </InputOTPGroup>
      </InputOTP>

      <button
        type="submit"
        className="px-6 py-2 bg-[#1DB954] hover:bg-[#18a348] rounded-md"
      >
        Submit
      </button>
    </form>
  );
}
