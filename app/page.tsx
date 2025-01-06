'use client'
import LandingPage from "@/components/landing-page";
import { Suspense } from "react";


export default function Home() {
  return (
    <>
    <Suspense fallback={<div>Loading...</div>}>
      <LandingPage/>
    </Suspense>
    </>
  );
}
