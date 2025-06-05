"use client";
import React, { useEffect } from "react";

export default function InvaderLayout({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        document.body.style.overflow = "hidden";
        document.documentElement.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "";
            document.documentElement.style.overflow = "";
        };
    }, []);
    return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center">
            {children}
        </div>
    );
} 