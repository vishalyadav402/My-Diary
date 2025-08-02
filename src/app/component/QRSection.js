"use client";
import Image from "next/image";
import { useRef } from "react";
import { toast } from "react-toastify";

export default function QRSection() {
  const qrRef = useRef(null);
  const appLink = "https://my-diary-xi-one.vercel.app/"; // replace with your actual app link

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(appLink);
      toast("Link copied to clipboard!");
    } catch (err) {
      toast("Failed to copy!");
    }
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = "/mydiaryapp-qr.png"; // Make sure this path is correct
    link.download = "mydiaryapp-qr.png";
    link.click();
  };

  const handleWhatsAppShare = () => {
    const message = `Check out this app: ${appLink}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, "_blank");
  };

  return (
    <div className="flex flex-col items-center my-20">
      <Image
        ref={qrRef}
        src={"/mydiaryapp-qr.png"}
        height={500}
        width={500}
        alt="QR Code to open My Diary app!"
      />

      <div className="mt-6 flex flex-wrap gap-4 justify-center">
        {/* WhatsApp Share */}
        <button
          onClick={handleWhatsAppShare}
          className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded shadow"
        >
          Share on WhatsApp
        </button>

        {/* Copy Link */}
        <button
          onClick={handleCopy}
          className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded shadow"
        >
          Copy App Link
        </button>

        {/* Download QR */}
        <button
          onClick={handleDownload}
          className="bg-gray-700 hover:bg-gray-800 text-white px-2 py-1 rounded shadow"
        >
          Download QR Code
        </button>
      </div>
    </div>
  );
}
