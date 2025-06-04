import React, { useState } from "react";
import Link from "next/link";

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-white shadow-md">
      <nav className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-gray-800">
            My Portfolio
          </Link>

          {/* デスクトップ用ナビゲーション */}
          <div className="hidden md:flex space-x-8">
            <Link href="/profile" className="text-gray-600 hover:text-gray-900">
              Profile
            </Link>
            <Link href="/skills" className="text-gray-600 hover:text-gray-900">
              Skills
            </Link>
            <Link href="/history" className="text-gray-600 hover:text-gray-900">
              Career
            </Link>
            <Link href="/game" className="text-gray-600 hover:text-gray-900">
              Game
            </Link>
            <Link href="/contact" className="text-gray-600 hover:text-gray-900">
              Contact
            </Link>
          </div>

          {/* ハンバーガーメニューボタン */}
          <button
            className="md:hidden text-gray-600 hover:text-gray-900 focus:outline-none"
            onClick={toggleMenu}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isMenuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* モバイル用ナビゲーション */}
        <div
          className={`md:hidden ${isMenuOpen ? "block" : "hidden"
            } mt-4 space-y-4`}
        >
          <Link
            href="/profile"
            className="block text-gray-600 hover:text-gray-900 py-2"
            onClick={() => setIsMenuOpen(false)}
          >
            Profile
          </Link>
          <Link
            href="/skills"
            className="block text-gray-600 hover:text-gray-900 py-2"
            onClick={() => setIsMenuOpen(false)}
          >
            Skills
          </Link>
          <Link
            href="/history"
            className="block text-gray-600 hover:text-gray-900 py-2"
            onClick={() => setIsMenuOpen(false)}
          >
            Career
          </Link>
          <Link
            href="/game"
            className="block text-gray-600 hover:text-gray-900 py-2"
            onClick={() => setIsMenuOpen(false)}
          >
            Game
          </Link>
          <Link
            href="/contact"
            className="block text-gray-600 hover:text-gray-900 py-2"
            onClick={() => setIsMenuOpen(false)}
          >
            Contact
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Header;
