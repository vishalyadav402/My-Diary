"use client";
import Image from "next/image";
import { useRef } from "react";
import { toast } from "react-toastify";
import { FaWhatsapp, FaCopy, FaShareAlt, FaDownload } from "react-icons/fa";

export default function QRSection() {
  const qrRef = useRef(null);
  const appLink = "https://drive.google.com/uc?id=1reNFvi2IqVtbbJUlNLAZSiJo8xFZuE9n"; // replace with your actual app link

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
    link.href = "/MyDiaryAppQR.png"; // Make sure this path is correct
    link.download = "MyDiaryAppQR.png";
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
        src={"/scantodownload.png"}
        height={300}
        width={300}
        alt="QR Code to open Digital Diary app!"
      />

      <div className="mt-4 flex gap-2 justify-center">
        {/* WhatsApp Share */}
        <button
          onClick={handleWhatsAppShare}
          className="flex items-center gap-1 bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded shadow text-sm"
        >
          <FaWhatsapp size={16} />
          WhatsApp
        </button>

        {/* Copy Link */}
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded shadow text-sm"
        >
          <FaCopy size={15} />
          Copy
        </button>

        {/* Download QR */}
        <button
          onClick={handleDownload}
          className="flex items-center gap-1 bg-gray-700 hover:bg-gray-800 text-white px-3 py-1 rounded shadow text-sm"
        >
          <FaDownload size={15} />
          QR Download
        </button>
      </div>
    </div>
  );
}