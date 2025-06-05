"use client";

import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

interface GameObject {
    x: number;
    y: number;
    width: number;
    height: number;
}

interface Invader extends GameObject {
    speed: number;
    direction: number;
}

interface Bullet extends GameObject {
    speed: number;
}

interface Explosion {
    x: number;
    y: number;
    frame: number;
    maxFrames: number;
}

interface EnemyBullet extends GameObject {
    speed: number;
}

interface Barrier {
    x: number;
    y: number;
    width: number;
    height: number;
    hp: number;
}

const ENEMY_ROWS_PC = 6;
const ENEMY_COLS_PC = 12;
const ENEMY_ROWS_MOBILE = 4;
const ENEMY_COLS_MOBILE = 8;
const ENEMY_SIZE_PC = 24;
const ENEMY_SIZE_MOBILE = 18;
const ENEMY_SPEED_PC = 0.5;
const ENEMY_SPEED_MOBILE_RATIO = 0.001;
const ENEMY_COLORS = ['#7fff00', '#7fff00', '#00bfff', '#00bfff', '#da70d6'];
const PLAYER_COLOR = '#00ff00';
const BARRIER_COLOR = '#ff3333';
const GROUND_COLOR = '#00ff00';
const LOGIC_LIVES = 10;
const DISPLAY_LIVES = 5;

const SpaceInvader = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [gameOver, setGameOver] = useState(false);
    const [score, setScore] = useState(0);
    const [player, setPlayer] = useState<GameObject>({
        x: 0,
        y: 0,
        width: 50,
        height: 30,
    });
    const [invaders, setInvaders] = useState<Invader[]>([]);
    const [bullets, setBullets] = useState<Bullet[]>([]);
    const [explosions, setExplosions] = useState<Explosion[]>([]);
    const [enemyBullets, setEnemyBullets] = useState<EnemyBullet[]>([]);
    const [barriers, setBarriers] = useState<Barrier[]>([]);
    const [lives, setLives] = useState(LOGIC_LIVES);
    const [hitCount, setHitCount] = useState(0);
    const playerRef = useRef(player);
    const [moveLeft, setMoveLeft] = useState(false);
    const [moveRight, setMoveRight] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [canvasSize, setCanvasSize] = useState({ width: 800, height: 600 });
    const [celebration, setCelebration] = useState(false);
    const [confetti, setConfetti] = useState<{ x: number, y: number, color: string, dx: number, dy: number, size: number }[]>([]);

    // 効果音・BGM用Audio
    const shotAudio = useRef<HTMLAudioElement | null>(null);
    const hitAudio = useRef<HTMLAudioElement | null>(null);
    const bgmAudio = useRef<HTMLAudioElement | null>(null);

    const router = useRouter();

    useEffect(() => {
        playerRef.current = player;
    }, [player]);

    // BGM再生・停止（トップレベルに移動）
    useEffect(() => {
        const audio = bgmAudio.current;
        if (!audio) return;
        audio.volume = 0.2; // 音量を20%に下げる
        if (!gameOver) {
            audio.currentTime = 0;
            audio.loop = true;
            audio.play().catch(() => { });
        } else {
            audio.pause();
            audio.currentTime = 0;
        }
        return () => {
            if (audio) {
                audio.pause();
                audio.currentTime = 0;
            }
        };
    }, [gameOver]);

    // useEffectの外で定義
    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'ArrowLeft') {
            setMoveLeft(true);
        } else if (e.key === 'ArrowRight') {
            setMoveRight(true);
        } else if (e.key === ' ') {
            e.preventDefault();
            const currentPlayer = playerRef.current;
            setBullets(prev => [
                ...prev,
                {
                    x: currentPlayer.x + currentPlayer.width / 2 - 2,
                    y: currentPlayer.y,
                    width: 4,
                    height: 10,
                    speed: 7,
                },
            ]);
            if (shotAudio.current) {
                shotAudio.current.currentTime = 0;
                shotAudio.current.play();
            }
        }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
        if (e.key === 'ArrowLeft') setMoveLeft(false);
        if (e.key === 'ArrowRight') setMoveRight(false);
    };

    // 初期化
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        canvas.width = canvasSize.width;
        canvas.height = canvasSize.height;

        // プレイヤーの初期位置（下部に近い位置、画面高さの92%）
        setPlayer({
            x: canvas.width / 2 - 25,
            y: Math.floor(canvas.height * 0.92),
            width: 50,
            height: 30,
        });

        // --- 敵の初期配置 ---
        const isMobileNow = window.innerWidth < 768;
        const ENEMY_ROWS = isMobileNow ? ENEMY_ROWS_MOBILE : ENEMY_ROWS_PC;
        const ENEMY_COLS = isMobileNow ? ENEMY_COLS_MOBILE : ENEMY_COLS_PC;
        const ENEMY_SIZE = isMobileNow ? ENEMY_SIZE_MOBILE : ENEMY_SIZE_PC;
        const ENEMY_SPEED = isMobileNow
            ? Math.max(canvas.width, canvas.height) * ENEMY_SPEED_MOBILE_RATIO
            : ENEMY_SPEED_PC;
        const initialInvaders: Invader[] = [];
        const enemyTopMargin = Math.floor(canvas.height * 0.02); // 上部余白
        const enemyRowHeight = Math.floor(canvas.height * 0.09); // 行間隔を少し広め
        const leftMargin = ENEMY_SIZE * 2;
        const rightMargin = ENEMY_SIZE * 2;
        for (let i = 0; i < ENEMY_ROWS; i++) {
            for (let j = 0; j < ENEMY_COLS; j++) {
                initialInvaders.push({
                    x: leftMargin + j * (canvas.width - leftMargin - rightMargin - ENEMY_SIZE) / (ENEMY_COLS - 1),
                    y: enemyTopMargin + i * enemyRowHeight,
                    width: ENEMY_SIZE,
                    height: ENEMY_SIZE,
                    speed: ENEMY_SPEED,
                    direction: 1,
                });
            }
        }
        setInvaders(initialInvaders);

        // --- バリアの初期配置 ---
        const barrierList: Barrier[] = [];
        const barrierY = isMobileNow ? Math.floor(canvas.height * 0.65) : Math.floor(canvas.height * 0.75);
        const barrierCount = 4;
        const barrierWidth = isMobileNow ? 40 : 60;
        const barrierSpacing = (canvas.width - barrierWidth * barrierCount) / (barrierCount + 1);
        for (let i = 0; i < barrierCount; i++) {
            barrierList.push({
                x: barrierSpacing + i * (barrierWidth + barrierSpacing),
                y: barrierY,
                width: barrierWidth,
                height: 30,
                hp: 6,
            });
        }
        setBarriers(barrierList);
        setLives(LOGIC_LIVES);
        setScore(0);
        setBullets([]);
        setEnemyBullets([]);
        setExplosions([]);
        setGameOver(false);

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, [canvasSize]);

    // ゲームループ
    useEffect(() => {
        if (gameOver || celebration) return;

        const gameLoop = setInterval(() => {
            // 1. プレイヤー弾とバリアの衝突判定
            const newBarriers = [...barriers];
            const newBullets = bullets
                .map(bullet => ({ ...bullet, y: bullet.y - bullet.speed }))
                .filter(bullet => bullet.y > 0);
            setBarriers(newBarriers.filter(b => b.hp > 0));

            // 2. 残った弾で敵との衝突判定や移動など既存処理
            let newInvaders = [...invaders];
            let newExplosions = [...explosions];
            let addScore = 0;

            // 衝突判定（貫通しない）
            outer: for (let i = newBullets.length - 1; i >= 0; i--) {
                const bullet = newBullets[i];
                for (let j = newInvaders.length - 1; j >= 0; j--) {
                    const invader = newInvaders[j];
                    if (
                        bullet.x < invader.x + invader.width &&
                        bullet.x + bullet.width > invader.x &&
                        bullet.y < invader.y + invader.height &&
                        bullet.y + bullet.height > invader.y
                    ) {
                        if (hitAudio.current) {
                            hitAudio.current.currentTime = 0;
                            hitAudio.current.play();
                        }
                        newExplosions.push({
                            x: invader.x + invader.width / 2,
                            y: invader.y + invader.height / 2,
                            frame: 0,
                            maxFrames: 10,
                        });
                        newBullets.splice(i, 1);
                        newInvaders.splice(j, 1);
                        addScore += 100;
                        break outer; // 1発で1体だけ
                    }
                }
            }

            // インベーダーの移動
            newInvaders = newInvaders.map(invader => ({
                ...invader,
                x: invader.x + invader.speed * invader.direction,
            }));
            const canvasWidth = canvasRef.current?.width ?? 800;
            const shouldChangeDirection = newInvaders.some(
                invader =>
                    invader.x <= 0 ||
                    invader.x + invader.width >= canvasWidth
            );
            if (shouldChangeDirection) {
                newInvaders = newInvaders.map(invader => ({
                    ...invader,
                    direction: -invader.direction,
                    y: invader.y + 20,
                }));
            }

            // 爆発アニメーション
            newExplosions = newExplosions
                .filter(explosion => explosion.frame < explosion.maxFrames)
                .map(explosion => ({
                    ...explosion,
                    frame: explosion.frame + 1,
                }));

            // 敵弾の移動
            setEnemyBullets(prev =>
                prev
                    .map(bullet => ({ ...bullet, y: bullet.y + bullet.speed }))
                    .filter(bullet => bullet.y < (canvasRef.current?.height ?? 600))
            );

            // 敵の弾発射（ランダムな敵が一定確率で発射）
            if (Math.random() < 0.08 && invaders.length > 0) {
                const shooters = invaders.filter(inv =>
                    !invaders.some(other =>
                        other.x === inv.x && other.y > inv.y && other !== inv
                    )
                );
                if (shooters.length > 0) {
                    const shooter = shooters[Math.floor(Math.random() * shooters.length)];
                    setEnemyBullets(prev => [
                        ...prev,
                        {
                            x: shooter.x + shooter.width / 2 - 2,
                            y: shooter.y + shooter.height,
                            width: 4,
                            height: 10,
                            speed: 5,
                        },
                    ]);
                }
            }

            // 敵弾とプレイヤーの衝突
            setEnemyBullets(prev => {
                let hitThisFrame = false;
                const filtered = prev.filter(bullet => {
                    if (
                        !hitThisFrame &&
                        bullet.x < player.x + player.width &&
                        bullet.x + bullet.width > player.x &&
                        bullet.y < player.y + player.height &&
                        bullet.y + bullet.height > player.y
                    ) {
                        hitThisFrame = true;
                        return false;
                    }
                    return true;
                });
                if (hitThisFrame) {
                    setLives(l => l - 2);
                    setHitCount(c => c + 1);
                    setExplosions(prev => [
                        ...prev,
                        {
                            x: player.x + player.width / 2,
                            y: player.y + player.height / 2,
                            frame: 0,
                            maxFrames: 15,
                        },
                    ]);
                }
                return filtered;
            });

            // 敵弾とバリアの衝突
            setEnemyBullets(prev => {
                const newBarriers = [...barriers];
                const filtered = prev.filter(bullet => {
                    for (let i = 0; i < newBarriers.length; i++) {
                        const b = newBarriers[i];
                        if (
                            bullet.x < b.x + b.width &&
                            bullet.x + bullet.width > b.x &&
                            bullet.y < b.y + b.height &&
                            bullet.y + bullet.height > b.y
                        ) {
                            newBarriers[i] = { ...b, hp: b.hp - 1 };
                            return false;
                        }
                    }
                    return true;
                });
                setBarriers(newBarriers.filter(b => b.hp > 0));
                return filtered;
            });

            // State更新
            setBullets(newBullets);
            setInvaders(newInvaders);
            setExplosions(newExplosions);
            if (addScore > 0) setScore(s => s + addScore);

            // 敵全滅で祝福
            if (newInvaders.length === 0) {
                setCelebration(true);
                clearInterval(gameLoop);
            }

            // ゲームオーバー判定
            if (newInvaders.some(invader => invader.y + invader.height >= canvasSize.height - 50)) {
                setGameOver(true);
                clearInterval(gameLoop);
            }

            // プレイヤーの移動
            setPlayer(prev => {
                let newX = prev.x;
                if (moveLeft) newX = Math.max(0, prev.x - 10);
                if (moveRight) newX = Math.min(canvasRef.current!.width - prev.width, prev.x + 10);
                if (newX !== prev.x) {
                    return { ...prev, x: newX };
                }
                return prev;
            });
        }, 16);

        return () => clearInterval(gameLoop);
    }, [gameOver, bullets, invaders, explosions, barriers, player, moveLeft, moveRight, canvasSize, celebration]);

    // livesが0以下になったらゲームオーバー
    useEffect(() => {
        if (lives <= 0) {
            setGameOver(true);
        }
    }, [lives]);

    // 紙吹雪生成・アニメーション
    useEffect(() => {
        if (!celebration) return;
        // 紙吹雪を100個生成
        const colors = ['#ff69b4', '#ffd700', '#00bfff', '#7fff00', '#ff6347', '#ffffff'];
        let confettiArr = Array.from({ length: 100 }, () => ({
            x: Math.random() * canvasSize.width,
            y: Math.random() * -canvasSize.height,
            color: colors[Math.floor(Math.random() * colors.length)],
            dx: (Math.random() - 0.5) * 2,
            dy: 2 + Math.random() * 2,
            size: 6 + Math.random() * 8,
        }));
        setConfetti(confettiArr);
        let animId: number;
        const animate = () => {
            confettiArr = confettiArr.map(c => ({
                ...c,
                x: c.x + c.dx,
                y: c.y + c.dy,
                dx: c.dx * 0.98 + (Math.random() - 0.5) * 0.1,
                dy: c.dy * 0.99 + Math.random() * 0.05,
            })).map(c => c.y > canvasSize.height ? { ...c, y: Math.random() * -20, x: Math.random() * canvasSize.width } : c);
            setConfetti([...confettiArr]);
            animId = requestAnimationFrame(animate);
        };
        animate();
        return () => cancelAnimationFrame(animId);
    }, [celebration, canvasSize]);

    // 描画
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // 地面
        ctx.strokeStyle = GROUND_COLOR;
        ctx.beginPath();
        ctx.moveTo(0, 580);
        ctx.lineTo(canvas.width, 580);
        ctx.stroke();

        // バリア
        barriers.forEach(b => {
            ctx.fillStyle = BARRIER_COLOR;
            ctx.fillRect(b.x, b.y, b.width, b.height);
        });

        // 敵
        invaders.forEach((invader) => {
            ctx.fillStyle = ENEMY_COLORS[Math.floor(invader.y / (invader.height * 2)) % ENEMY_COLORS.length];
            ctx.fillRect(invader.x, invader.y, invader.width, invader.height);
        });

        // プレイヤー
        ctx.fillStyle = PLAYER_COLOR;
        ctx.fillRect(player.x, player.y, player.width, player.height);

        // 弾
        ctx.fillStyle = '#ffff00';
        bullets.forEach(bullet => {
            ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
        });
        // 敵弾
        ctx.fillStyle = '#ffffff';
        enemyBullets.forEach(bullet => {
            ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
        });

        // 爆発
        explosions.forEach(explosion => {
            const progress = explosion.frame / explosion.maxFrames;
            const radius = 20 * (1 - progress);
            const alpha = 1 - progress;
            ctx.beginPath();
            ctx.arc(explosion.x, explosion.y, radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 200, 0, ${alpha})`;
            ctx.fill();
            ctx.beginPath();
            ctx.arc(explosion.x, explosion.y, radius * 0.6, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 100, 0, ${alpha})`;
            ctx.fill();
        });

        // 残機（左下にLIFE表示）
        ctx.fillStyle = '#ffffff';
        ctx.font = '20px Arial';
        ctx.fillText(`LIFE: ${DISPLAY_LIVES - hitCount}`, 20, 595);

        // 紙吹雪
        if (celebration) {
            confetti.forEach(c => {
                ctx.save();
                ctx.fillStyle = c.color;
                ctx.beginPath();
                ctx.arc(c.x, c.y, c.size, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            });
        }

        // 祝福メッセージ
        if (celebration) {
            ctx.save();
            ctx.font = 'bold 40px Arial';
            ctx.fillStyle = '#fff';
            ctx.textAlign = 'center';
            ctx.fillText('Congratulations! All enemies defeated!', canvas.width / 2, canvas.height / 2);
            ctx.restore();
        }
    }, [player, invaders, bullets, score, explosions, enemyBullets, barriers, lives, hitCount, canvasSize, celebration, confetti]);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    useEffect(() => {
        const resize = () => {
            if (window.innerWidth < 800) {
                const width = window.innerWidth;
                const height = Math.floor(width * 600 / 800);
                setCanvasSize({ width, height });
            } else {
                setCanvasSize({ width: 800, height: 600 });
            }
        };
        resize();
        window.addEventListener('resize', resize);
        return () => window.removeEventListener('resize', resize);
    }, []);

    // ゲームリセット時はcelebrationもfalseに
    useEffect(() => {
        if (!gameOver && invaders.length > 0) {
            setCelebration(false);
        }
    }, [gameOver, invaders]);

    // ゲームリセット関数
    const resetGame = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        canvas.width = canvasSize.width;
        canvas.height = canvasSize.height;
        setPlayer({
            x: canvas.width / 2 - 25,
            y: Math.floor(canvas.height * 0.92),
            width: 50,
            height: 30,
        });
        // --- 敵の初期配置 ---
        const isMobileNow = window.innerWidth < 768;
        const ENEMY_ROWS = isMobileNow ? ENEMY_ROWS_MOBILE : ENEMY_ROWS_PC;
        const ENEMY_COLS = isMobileNow ? ENEMY_COLS_MOBILE : ENEMY_COLS_PC;
        const ENEMY_SIZE = isMobileNow ? ENEMY_SIZE_MOBILE : ENEMY_SIZE_PC;
        const ENEMY_SPEED = isMobileNow
            ? Math.max(canvas.width, canvas.height) * ENEMY_SPEED_MOBILE_RATIO
            : ENEMY_SPEED_PC;
        const initialInvaders: Invader[] = [];
        const enemyTopMargin = Math.floor(canvas.height * 0.02);
        const enemyRowHeight = Math.floor(canvas.height * 0.09);
        const leftMargin = ENEMY_SIZE * 2;
        const rightMargin = ENEMY_SIZE * 2;
        for (let i = 0; i < ENEMY_ROWS; i++) {
            for (let j = 0; j < ENEMY_COLS; j++) {
                initialInvaders.push({
                    x: leftMargin + j * (canvas.width - leftMargin - rightMargin - ENEMY_SIZE) / (ENEMY_COLS - 1),
                    y: enemyTopMargin + i * enemyRowHeight,
                    width: ENEMY_SIZE,
                    height: ENEMY_SIZE,
                    speed: ENEMY_SPEED,
                    direction: 1,
                });
            }
        }
        setInvaders(initialInvaders);
        // --- バリアの初期配置 ---
        const barrierList: Barrier[] = [];
        const barrierCount = 4;
        const barrierWidth = isMobileNow ? 40 : 60;
        const barrierSpacing = (canvas.width - barrierWidth * barrierCount) / (barrierCount + 1);
        const barrierY = isMobileNow ? Math.floor(canvas.height * 0.65) : Math.floor(canvas.height * 0.75);
        for (let i = 0; i < barrierCount; i++) {
            barrierList.push({
                x: barrierSpacing + i * (barrierWidth + barrierSpacing),
                y: barrierY,
                width: barrierWidth,
                height: 30,
                hp: 6,
            });
        }
        setBarriers(barrierList);
        setLives(LOGIC_LIVES);
        setScore(0);
        setBullets([]);
        setEnemyBullets([]);
        setExplosions([]);
        setGameOver(false);
        setHitCount(0);
        setCelebration(false);
    };

    return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center">
            <audio ref={shotAudio} src="/sounds/shot.mp3" preload="auto" />
            <audio ref={hitAudio} src="/sounds/hit.mp3" preload="auto" />
            <audio ref={bgmAudio} src="/sounds/background.mp3" preload="auto" autoPlay loop />
            <div className="flex items-center justify-between w-full max-w-[800px] mb-4 px-4">
                <h1 className="text-4xl font-bold text-white">Space Invader</h1>
                {!(gameOver || celebration) && (
                    <span className="text-white text-xl ml-4">Score: {score}</span>
                )}
            </div>
            {(gameOver || celebration) ? (
                <div className="flex flex-col items-center gap-4 mt-8">
                    {gameOver && (
                        <div className="text-white text-2xl mb-4">Game Over! Score: {score}</div>
                    )}
                    {celebration && (
                        <div className="text-white text-2xl mb-4">Congratulations! All enemies defeated!</div>
                    )}
                    <button
                        className="bg-green-600 text-white px-6 py-2 rounded text-lg font-bold hover:bg-green-700"
                        onClick={resetGame}
                    >
                        Play Again
                    </button>
                    <button
                        className="bg-blue-600 text-white px-6 py-2 rounded text-lg font-bold hover:bg-blue-700"
                        onClick={() => router.push('/game')}
                    >
                        Back to Game List
                    </button>
                    <button
                        className="bg-gray-600 text-white px-6 py-2 rounded text-lg font-bold hover:bg-gray-700"
                        onClick={() => router.push('/')}
                    >
                        Back to Home
                    </button>
                </div>
            ) : (
                <>
                    <canvas
                        ref={canvasRef}
                        width={canvasSize.width}
                        height={canvasSize.height}
                        className="border-2 border-white"
                        style={{ background: '#000000', width: canvasSize.width, height: canvasSize.height, maxWidth: '100vw', maxHeight: '80vh' }}
                    />
                    {!gameOver && isMobile && (
                        <div className="md:hidden w-full max-w-[800px] mt-4 flex justify-between items-center px-4">
                            <div className="flex gap-4">
                                <button
                                    className="bg-gray-800 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl"
                                    onTouchStart={() => setMoveLeft(true)}
                                    onTouchEnd={() => setMoveLeft(false)}
                                >
                                    ←
                                </button>
                                <button
                                    className="bg-gray-800 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl"
                                    onTouchStart={() => setMoveRight(true)}
                                    onTouchEnd={() => setMoveRight(false)}
                                >
                                    →
                                </button>
                            </div>
                            <button
                                className="bg-red-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-lg font-bold"
                                onTouchStart={() => {
                                    const currentPlayer = playerRef.current;
                                    setBullets(prev => [
                                        ...prev,
                                        {
                                            x: currentPlayer.x + currentPlayer.width / 2 - 2,
                                            y: currentPlayer.y,
                                            width: 4,
                                            height: 10,
                                            speed: 7,
                                        },
                                    ]);
                                    if (shotAudio.current) {
                                        shotAudio.current.currentTime = 0;
                                        shotAudio.current.play();
                                    }
                                }}
                            >
                                SHOT
                            </button>
                        </div>
                    )}
                </>
            )}
            <div className="text-white mt-4">
                <p>How to play:</p>
                <p className="hidden md:block">← → : Move</p>
                <p className="hidden md:block">Space: Shoot</p>
                <p className="md:hidden">Touch buttons: Move / Shoot</p>
            </div>
        </div>
    );
};

export default SpaceInvader; 