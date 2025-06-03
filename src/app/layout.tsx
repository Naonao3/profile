"use client";

import React, { useState, useEffect } from "react";
import { Inter } from "next/font/google";
import LoadingScreen from "@/components/LoadingScreen";
import Layout from "@/components/Layout";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 初回ロード時のみローディング画面を表示
    const hasSeenLoading = sessionStorage.getItem("hasSeenLoading");
    if (hasSeenLoading) {
      setIsLoading(false);
    }
  }, []);

  const handleLoadingComplete = () => {
    setIsLoading(false);
    sessionStorage.setItem("hasSeenLoading", "true");
  };

  return (
    <html lang="ja">
      <body className={inter.className}>
        {isLoading ? (
          <LoadingScreen onLoadingComplete={handleLoadingComplete} />
        ) : (
          <Layout>{children}</Layout>
        )}
      </body>
    </html>
  );
}
