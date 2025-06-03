"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";

const videoList = [
  "/videos/background3.mp4",
  "/videos/background.mp4",
  "/videos/background2.mp4",
  "/videos/background6.mp4",
  "/videos/background5.mp4",
];

export default function Home() {
  const [current, setCurrent] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleEnded = () => {
    setCurrent((prev) => (prev + 1) % videoList.length);
  };

  return (
    <div className="relative min-h-screen">
      {/* Background Video */}
      <video
        ref={videoRef}
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
        src={videoList[current]}
        autoPlay
        loop={false}
        muted
        playsInline
        onEnded={handleEnded}
      />
      {/* Overlay for readability */}
      <div className="absolute top-0 left-0 w-full h-full bg-opacity-40 z-10" />
      {/* Main Content */}
      <div className="relative z-20">
        <div className="container mx-auto px-6 py-16">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-white mb-8">
              Welcome to My Portfolio
            </h1>
            <p className="text-xl text-white mb-12">
              As a frontend engineer, I am passionate about developing creative web applications.
            </p>
            <div className="flex justify-center space-x-6">
              <Link
                href="/profile"
                className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                View Profile
              </Link>
              <Link
                href="/contact"
                className="bg-gray-600 text-white px-8 py-3 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Contact
              </Link>
            </div>
          </div>

          <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 text-white">
            <div className="bg-opacity-90 p-6 rounded-lg shadow-md border-2 border-blue-400">
              <h2 className="text-2xl font-semibold mb-4">Skills</h2>
              <p className="text-white text-xl">
                I specialize in development using the latest technologies such as React, Next.js, and TypeScript.
              </p>
              <Link
                href="/skills"
                className="text-blue-600 hover:text-blue-800 mt-4 inline-block text-lg font-bold"
              >
                See Details →
              </Link>
            </div>

            <div className="bg-opacity-90 p-6 rounded-lg shadow-md border-2 border-green-400">
              <h2 className="text-2xl font-semibold mb-4">Career</h2>
              <p className="text-white text-xl">
                Introducing my experience and achievements in various projects.
              </p>
              <Link
                href="/history"
                className="text-blue-600 hover:text-blue-800 mt-4 inline-block text-lg font-bold"
              >
                See Details →
              </Link>
            </div>

            <div className="bg-opacity-90 p-6 rounded-lg shadow-md border-2 border-purple-400">
              <h2 className="text-2xl font-semibold mb-4">Contact</h2>
              <p className="text-white text-xl">
                Feel free to contact me for project consultations or inquiries.
              </p>
              <Link
                href="/contact"
                className="text-blue-600 hover:text-blue-800 mt-4 inline-block text-lg font-bold"
              >
                Contact →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
