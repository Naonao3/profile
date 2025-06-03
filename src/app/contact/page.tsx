import React from "react";

export default function Contact() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-6">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 text-center mb-12">
            Contact
          </h1>
          <div className="bg-white rounded-lg shadow-lg p-8">
            <form className="space-y-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="subject"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={6}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  required
                ></textarea>
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Send
                </button>
              </div>
            </form>

            <div className="mt-8 pt-8 border-t border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Other Contact Methods
              </h2>
              <div className="space-y-4">
                <p className="text-gray-600">
                  <span className="font-medium">Email:</span>
                  contact@example.com
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Phone:</span>
                  03-1234-5678
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Location:</span>
                  1-1-1 Shibuya, Shibuya-ku, Tokyo
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
