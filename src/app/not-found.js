"use client"; // Mark as client component

import React from "react";
import { AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const NotFound = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="text-center max-w-xl">
        {/* Icon */}
        <div className="mb-6">
          <AlertCircle className="w-24 h-24 text-sky-500 mx-auto" />
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          <h1 className="text-6xl font-bold text-gray-900">404</h1>
          <h2 className="text-3xl font-semibold text-gray-800">
            Page Not Found
          </h2>
          <p className="text-gray-600 text-lg">
            Oops! The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        {/* Suggestions */}
        <div className="mt-8 space-y-4">
          <p className="text-gray-600">You might want to:</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => router.back()}
              className="px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Go Back
            </button>
            <Link
              href="/"
              className="px-6 py-3 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors"
            >
              Return Home
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default NotFound;
