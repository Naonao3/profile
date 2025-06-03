import React from "react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="container mx-auto px-6 py-16">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-8">
            ようこそ、私のポートフォリオへ
          </h1>
          <p className="text-xl text-gray-600 mb-12">
            フロントエンドエンジニアとして、クリエイティブなWebアプリケーションの開発に情熱を注いでいます。
          </p>
          <div className="flex justify-center space-x-6">
            <Link
              href="/profile"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              プロフィールを見る
            </Link>
            <Link
              href="/contact"
              className="bg-gray-600 text-white px-8 py-3 rounded-lg hover:bg-gray-700 transition-colors"
            >
              お問い合わせ
            </Link>
          </div>
        </div>

        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">スキル</h2>
            <p className="text-gray-600">
              React、Next.js、TypeScriptなどの最新技術を活用した開発が得意です。
            </p>
            <Link
              href="/skills"
              className="text-blue-600 hover:text-blue-800 mt-4 inline-block"
            >
              詳細を見る →
            </Link>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">経歴</h2>
            <p className="text-gray-600">
              様々なプロジェクトでの経験と実績をご紹介します。
            </p>
            <Link
              href="/history"
              className="text-blue-600 hover:text-blue-800 mt-4 inline-block"
            >
              詳細を見る →
            </Link>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">お問い合わせ</h2>
            <p className="text-gray-600">
              プロジェクトのご相談やお問い合わせはこちらからお気軽にどうぞ。
            </p>
            <Link
              href="/contact"
              className="text-blue-600 hover:text-blue-800 mt-4 inline-block"
            >
              お問い合わせ →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
