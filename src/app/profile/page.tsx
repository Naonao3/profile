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
                  alt="Profile Image"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
            <div className="p-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Taro Yamada
              </h1>
              <p className="text-gray-600 mb-4">
                Frontend Engineer / UI Designer
              </p>
              <div className="mt-4">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">About Me</h2>
                <p className="text-gray-600">
                  With over 5 years of experience in frontend development, I specialize in building modern web applications mainly using React, Next.js, and TypeScript. I focus on user experience and performance-oriented implementation.
                </p>
              </div>
              <div className="mt-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Hobbies</h2>
                <ul className="list-disc list-inside text-gray-600">
                  <li>Programming</li>
                  <li>Photography</li>
                  <li>Traveling</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
