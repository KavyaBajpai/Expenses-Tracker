"use client"

import { Suspense } from "react";
import Header from "./_components/Header";
import Hero from "./_components/Hero";

export default function Home() {
  return (
    <div>
      <Suspense fallback={<div>Loading header...</div>}>
        <Header />
      </Suspense>
      <Suspense fallback={<div>Loading content...</div>}>
        <Hero />
      </Suspense>
    </div>
  );
}