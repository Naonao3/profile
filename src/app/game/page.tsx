"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

interface Card {
    suit: string;
    value: string;
    numericValue: number;
}

const suits = ["♠", "♥", "♦", "♣"];
const values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];

const games = [
    {
        id: "blackjack",
        title: "Blackjack",
        description: "Classic card game. Aim for 21 and beat the dealer.",
        image: "/images/blackjack.png",
    },
    // 今後追加するゲームのテンプレート
    // {
    //   id: "poker",
    //   title: "ポーカー",
    //   description: "戦略性の高い人気カードゲーム。",
    //   image: "/images/poker.jpg",
    // },
];

const GameListPage = () => {
    return (
        <div className="min-h-screen bg-gray-300 py-8">
            <div className="container mx-auto px-4">
                <h1 className="text-4xl font-bold text-black text-center mb-8">
                    Game List
                </h1>

                <div className="bg-white grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {games.map((game) => (
                        <Link
                            key={game.id}
                            href={`/game/${game.id}`}
                            className="rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                        >
                            <div className="aspect-w-16 aspect-h-9 bg-gray-200">
                                {/* 画像が用意できたら表示 */}
                                {/* <img
                  src={game.image}
                  alt={game.title}
                  className="w-full h-full object-cover"
                /> */}
                            </div>
                            <div className="p-6">
                                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                                    {game.title}
                                </h2>
                                <p className="text-gray-600">{game.description}</p>
                                <div className="mt-4">
                                    <span className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg">
                                        Play
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default GameListPage; 