"use client";
import { useEffect, useState } from "react";

export default function NoInternet() {
  const [online, setOnline] = useState(true);

  useEffect(() => {
    const updateStatus = () => setOnline(navigator.onLine);
    window.addEventListener("online", updateStatus);
    window.addEventListener("offline", updateStatus);
    updateStatus();
    return () => {
      window.removeEventListener("online", updateStatus);
      window.removeEventListener("offline", updateStatus);
    };
  }, []);

  if (online) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-white rounded-lg shadow-lg p-8 flex flex-col items-center">
        <svg width="48" height="48" fill="none" viewBox="0 0 24 24">
          <path fill="#f87171" d="M12 4a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16zm-1-7h2v2h-2v-2zm0-8h2v6h-2V7z"/>
        </svg>
        <h2 className="text-xl font-bold text-red-600 mt-4">No Internet Connection</h2>
        <p className="text-gray-600 mt-2 text-center">
          Please check your network and try again.
        </p>
      </div>
    </div>
  );
}