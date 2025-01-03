import React from "react";
import { FlipWords } from "../ui/flip-words";

export function Hero() {
  const words = ["technology", "production", "culture", "history"];

  return (
    <div className="max-w-3xl px-4 mt-16">
      <div className="text-4xl md:text-5xl font-normal text-neutral-600 dark:text-neutral-400 ">
      Welcome to Yeabsira&apos;s Blogs. I write about modern electronic
      <br/>
        music<FlipWords words={words} />
      </div>
    </div>
  );
}
