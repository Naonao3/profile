import React from "react";
import Image from "next/image";

export default function Profile() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="md:flex">
            <div className="md:flex-shrink-0">
              <div className="relative h-48 w-48 md:h-64 md:w-64">
                <Image
                  src="/profile-image.jpg"
                  alt="プロフィール画像"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
            <div className="p-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                山田 太郎
              </h1>
              <p className="text-gray-600 mb-4">
                フロントエンドエンジニア / UIデザイナー
              </p>
              <div className="mt-4">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  自己紹介
                </h2>
                <p className="text-gray-600">
                  5年以上のフロントエンド開発経験を持ち、React、Next.js、TypeScriptを中心に
                  モダンなWebアプリケーションの開発に携わっています。
                  ユーザー体験を重視したUIデザインと、パフォーマンスを考慮した実装を心がけています。
                </p>
              </div>
              <div className="mt-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  趣味
                </h2>
                <ul className="list-disc list-inside text-gray-600">
                  <li>プログラミング</li>
                  <li>写真撮影</li>
                  <li>旅行</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
