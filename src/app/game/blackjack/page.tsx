"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

interface Card {
    suit: string;
    value: string;
    numericValue: number;
}

const suits = ["♠", "♥", "♦", "♣"];
const values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];

const cardSize = "w-20 h-32 md:w-28 md:h-44";

const confettiColors = ["#FFD700", "#FF69B4", "#00BFFF", "#32CD32", "#FF4500"];

function Confetti() {
    // シンプルな紙吹雪アニメーション
    return (
        <div className="pointer-events-none fixed inset-0 z-50 flex justify-center items-start">
            {[...Array(30)].map((_, i) => (
                <motion.div
                    key={i}
                    initial={{ y: -50, x: Math.random() * window.innerWidth }}
                    animate={{ y: window.innerHeight + 100, rotate: 360 }}
                    transition={{ duration: 2 + Math.random() * 1.5, delay: Math.random() * 0.5 }}
                    className="absolute"
                    style={{
                        left: `${Math.random() * 100}%`,
                        width: 16,
                        height: 16,
                        backgroundColor: confettiColors[i % confettiColors.length],
                        borderRadius: 4,
                        opacity: 0.8,
                    }}
                />
            ))}
        </div>
    );
}

const BlackjackPage = () => {
    const [deck, setDeck] = useState<Card[]>([]);
    const [playerHand, setPlayerHand] = useState<Card[]>([]);
    const [dealerHand, setDealerHand] = useState<Card[]>([]);
    const [gameStatus, setGameStatus] = useState<string>("");
    const [playerScore, setPlayerScore] = useState<number>(0);
    const [dealerScore, setDealerScore] = useState<number>(0);
    const [isAnimating, setIsAnimating] = useState(false);
    const [dealingCard, setDealingCard] = useState<null | { card: Card; to: 'player' | 'dealer' }>(null);
    const [showResult, setShowResult] = useState(false);
    const [resultType, setResultType] = useState<'win' | 'lose' | 'draw' | null>(null);
    const [resultText, setResultText] = useState('');

    // デッキの初期化（デッキを返すように変更）
    const initializeDeck = () => {
        const newDeck: Card[] = [];
        suits.forEach(suit => {
            values.forEach(value => {
                let numericValue = 0;
                if (value === "A") {
                    numericValue = 11;
                } else if (["J", "Q", "K"].includes(value)) {
                    numericValue = 10;
                } else {
                    numericValue = parseInt(value);
                }
                newDeck.push({ suit, value, numericValue });
            });
        });
        // デッキをシャッフル
        for (let i = newDeck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newDeck[i], newDeck[j]] = [newDeck[j], newDeck[i]];
        }
        return newDeck;
    };

    // 新しいゲーム
    const startGame = () => {
        const newDeck = initializeDeck();
        const playerCards = [newDeck.pop()!, newDeck.pop()!];
        const dealerCards = [newDeck.pop()!, newDeck.pop()!];
        setPlayerHand(playerCards);
        setDealerHand(dealerCards);
        setDeck(newDeck);
        setGameStatus("Your Turn");
        calculateScore(playerCards, dealerCards);
        setShowResult(false);
        setResultType(null);
        setResultText("");
    };

    // スコア計算
    const calculateScore = (player: Card[], dealer: Card[]) => {
        const playerSum = player.reduce((sum, card) => sum + card.numericValue, 0);
        const dealerSum = dealer.reduce((sum, card) => sum + card.numericValue, 0);
        setPlayerScore(playerSum);
        setDealerScore(dealerSum);
    };

    // ヒット（アニメーション付き）
    const hit = async () => {
        if (deck.length === 0 || isAnimating) return;
        setIsAnimating(true);
        const newDeck = [...deck];
        const newCard = newDeck.pop()!;
        setDealingCard({ card: newCard, to: 'player' });
        await new Promise((resolve) => setTimeout(resolve, 500));
        setDealingCard(null);
        const newPlayerHand = [...playerHand, newCard];
        setPlayerHand(newPlayerHand);
        setDeck(newDeck);
        const newScore = playerScore + newCard.numericValue;
        setPlayerScore(newScore);
        if (newScore > 21) {
            setGameStatus("Bust! Dealer Wins");
            setIsAnimating(false);
            handleGameEnd('lose');
            return;
        }
        setIsAnimating(false);
    };

    // スタンド（ディーラーターンもアニメーション付き）
    const stand = async () => {
        if (isAnimating) return;
        setIsAnimating(true);
        let newDealerHand = [...dealerHand];
        let newDeck = [...deck];
        let tempDealerScore = dealerScore;
        while (tempDealerScore < 17 && newDeck.length > 0) {
            const newCard = newDeck.pop()!;
            setDealingCard({ card: newCard, to: 'dealer' });
            await new Promise((resolve) => setTimeout(resolve, 500));
            setDealingCard(null);
            newDealerHand.push(newCard);
            tempDealerScore += newCard.numericValue;
        }
        setDealerHand(newDealerHand);
        setDeck(newDeck);
        setDealerScore(tempDealerScore);
        setTimeout(() => {
            if (tempDealerScore > 21) {
                setGameStatus("Dealer Bust! You Win");
                handleGameEnd('win');
            } else if (tempDealerScore > playerScore) {
                setGameStatus("Dealer Wins");
                handleGameEnd('lose');
            } else if (tempDealerScore < playerScore) {
                setGameStatus("You Win");
                handleGameEnd('win');
            } else {
                setGameStatus("Draw");
                handleGameEnd('draw');
            }
            setIsAnimating(false);
        }, 300);
    };

    // 勝敗判定部分を修正
    const handleGameEnd = (type: 'win' | 'lose' | 'draw') => {
        setShowResult(true);
        setResultType(type);
        if (type === 'win') setResultText('You Win! Congratulations! 🎉');
        else if (type === 'lose') setResultText('You Lose... 😢');
        else setResultText('Draw');
    };

    return (
        <div className="h-[85vh] bg-green-800 flex flex-col justify-between items-center">
            <div className="w-full flex flex-col flex-1 justify-between items-center max-w-sm mx-auto py-1">
                {/* Dealer's Hand */}
                <div className="flex flex-col items-center mt-1">
                    <h2 className="text-xl md:text-3xl text-white mb-0.5 md:mb-1 font-bold">Dealer's Hand</h2>
                    <div className="flex space-x-3 md:space-x-5 mb-0.5 md:mb-1">
                        {dealerHand.map((card, index) => (
                            <div
                                key={index}
                                className={`${cardSize} bg-white rounded-lg flex items-center justify-center text-2xl md:text-4xl ${card.suit === "♥" || card.suit === "♦" ? "text-red-600" : "text-black"}`}
                            >
                                {card.value}{card.suit}
                            </div>
                        ))}
                    </div>
                    <p className="text-white text-base md:text-lg">Score: {dealerScore}</p>
                </div>

                {/* Deck */}
                <div className="flex justify-center items-center relative my-0.5 md:my-1">
                    <div className="flex flex-col items-center z-10">
                        <div className={`${cardSize} bg-red-600 border-2 border-white rounded-lg flex items-center justify-center text-3xl md:text-5xl text-white shadow-lg relative`}>
                            <span className="absolute inset-0 flex items-center justify-center select-none" style={{ fontFamily: 'serif' }}>♠</span>
                            <span className="absolute bottom-1 right-2 text-base md:text-lg text-white">{deck.length}</span>
                        </div>
                        <span className="text-white mt-1 md:mt-2 text-base md:text-lg">Deck</span>
                    </div>
                    <AnimatePresence>
                        {dealingCard && (
                            <motion.div
                                key="dealing"
                                initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                                animate={{
                                    x: dealingCard.to === 'player' ? -120 : 120,
                                    y: dealingCard.to === 'player' ? 80 : -80,
                                    opacity: 1,
                                    scale: 1.05,
                                }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                transition={{ duration: 0.5 }}
                                className={`${cardSize} bg-white rounded-lg flex items-center justify-center text-2xl md:text-4xl shadow-lg absolute left-1/2 top-0 -translate-x-1/2 z-20 ${dealingCard.card.suit === "♥" || dealingCard.card.suit === "♦" ? "text-red-600" : "text-black"}`}
                                style={{ pointerEvents: 'none' }}
                            >
                                {dealingCard.card.value}{dealingCard.card.suit}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Player's Hand */}
                <div className="flex flex-col items-center mb-0.5 md:mb-1">
                    <h2 className="text-xl md:text-3xl text-white mb-0.5 md:mb-1 font-bold">Player's Hand</h2>
                    <div className="flex space-x-3 md:space-x-5 mb-0.5 md:mb-1">
                        {playerHand.map((card, index) => (
                            <div
                                key={index}
                                className={`${cardSize} bg-white rounded-lg flex items-center justify-center text-2xl md:text-4xl ${card.suit === "♥" || card.suit === "♦" ? "text-red-600" : "text-black"}`}
                            >
                                {card.value}{card.suit}
                            </div>
                        ))}
                    </div>
                    <p className="text-white text-base md:text-lg">Score: {playerScore}</p>
                </div>

                {/* Control Buttons */}
                <div className="text-center mb-1 md:mb-2">
                    <p className="text-xs md:text-base text-white mb-1 md:mb-2">{gameStatus}</p>
                    <div className="space-x-3 md:space-x-4">
                        <button
                            onClick={startGame}
                            className="bg-blue-600 text-white px-4 md:px-6 py-2 md:py-3 rounded-lg hover:bg-blue-700 text-sm md:text-base"
                        >
                            New Game
                        </button>
                        <button
                            onClick={hit}
                            disabled={gameStatus !== "Your Turn" || isAnimating}
                            className="bg-green-600 text-white px-4 md:px-6 py-2 md:py-3 rounded-lg hover:bg-green-700 disabled:opacity-50 text-sm md:text-base"
                        >
                            Hit
                        </button>
                        <button
                            onClick={stand}
                            disabled={gameStatus !== "Your Turn" || isAnimating}
                            className="bg-red-600 text-white px-4 md:px-6 py-2 md:py-3 rounded-lg hover:bg-red-700 disabled:opacity-50 text-sm md:text-base"
                        >
                            Stand
                        </button>
                    </div>
                </div>
            </div>

            {/* Result Overlay */}
            <AnimatePresence>
                {showResult && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className={`fixed inset-0 z-40 flex flex-col items-center justify-center ${resultType === 'win' ? 'bg-black/30' : resultType === 'lose' ? 'bg-black/60' : 'bg-black/40'}`}
                    >
                        {resultType === 'win' && <Confetti />}
                        <div className="flex flex-col items-center">
                            <div className="text-5xl md:text-7xl mb-4">
                                {resultType === 'win' && '🎉😆'}
                                {resultType === 'lose' && '😢'}
                                {resultType === 'draw' && '🤝'}
                            </div>
                            <div className={`text-3xl md:text-5xl font-bold mb-6 ${resultType === 'win' ? 'text-yellow-300' : resultType === 'lose' ? 'text-gray-200' : 'text-white'}`}>{resultText}</div>
                            <div className="flex flex-col space-y-3 w-full max-w-xs">
                                <button onClick={startGame} className="w-full bg-blue-600 text-white py-3 rounded-lg text-lg font-bold hover:bg-blue-700">Next Game</button>
                                <Link href="/game" className="w-full block bg-green-600 text-white py-3 rounded-lg text-lg font-bold text-center hover:bg-green-700">Back to Game List</Link>
                                <Link href="/" className="w-full block bg-gray-600 text-white py-3 rounded-lg text-lg font-bold text-center hover:bg-gray-700">Back to Home</Link>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default BlackjackPage; 