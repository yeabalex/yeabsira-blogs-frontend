import React from "react";
import { FlipWords } from "../ui/flip-words";

export function Hero() {
  const words = ["Discover", "Connect", "Get Discovered"];

  return (
    <div className="max-w-7xl px-4 mt-16 mx-auto">
      <div className="max-w-3xl text-4xl md:text-6xl mb-4 font-heading font-semibold text-neutral-600 dark:text-neutral-400 ">
      Empowering Knowledge, and Free Speech.
      </div>
      <div className="text-3xl md:text-5xl font-heading font-semibold -ml-2">
      <FlipWords words={words} />
      </div>
    </div>
  );
}
