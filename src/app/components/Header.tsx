import React from "react";
import Link from "next/link";

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-md">
      <nav className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-gray-800">
            My Portfolio
          </Link>
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
            <Link href="/contact" className="text-gray-600 hover:text-gray-900">
              Contact
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
