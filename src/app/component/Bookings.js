"use client";
import { useState } from "react";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { db } from "../firebase/config";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const servicesWithPrices = {
  "Haircut": 100,
  "Beard Shaving": 80,
  "Shaving with Massage": 150,
  "Bald": 120,
  "Hair Trim": 70,
  "Beard Trim": 60,
  "Facial with Massage": 250,
  "Hair Straightening": 400
};

export default function Bookings() {
  const [form, setForm] = useState({
    name: "",
    mobile: "",
    date: "",
    service: "",
    timeSlot: "",
  });

  const [showQR, setShowQR] = useState(false);
  const [showModal, setShowModal] = useState(true); // show modal on load

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  function getFormattedDate(offset = 0) {
    const date = new Date();
    date.setDate(date.getDate() + offset);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "bookings"), {
        ...form,
        price: servicesWithPrices[form.service],
        createdAt: Timestamp.now(),
      });
      toast.success("Booking added!");
      setShowQR(true);
      setForm({ name: "", mobile: "", date: "", service: "", timeSlot: "" });
    } catch (error) {
      toast.error("Error: " + error.message);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center">

      {/* Modal Overlay */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-[#6fae1d] opacity-70 rounded-lg p-6 max-w-md w-full relative shadow-lg">
            {/* Close button */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-3 text-gray-600 hover:text-gray-900 text-xl font-bold"
              aria-label="Close modal"
            >
              &times;
            </button>
            <h1 className="text-2xl font-bold mb-4 text-amber-800 text-center">Welcome To My Salon😊</h1>

            <form onSubmit={handleSubmit} className="space-y-4 text-gray-700">
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Your Name"
                className="border p-2 w-full"
                required
              />
              <input
                type="tel"
                name="mobile"
                value={form.mobile}
                onChange={handleChange}
                placeholder="Mobile Number"
                className="border p-2 w-full"
                required
              />
              <select
                name="date"
                value={form.date}
                onChange={handleChange}
                className="border p-2 w-full bg-transparent"
                required
              >
                <option value="">Select Booking Date</option>
                <option value={getFormattedDate(0)}>Today ({getFormattedDate(0)})</option>
                <option value={getFormattedDate(1)}>Tomorrow ({getFormattedDate(1)})</option>
                <option value={getFormattedDate(2)}>Day After Tomorrow ({getFormattedDate(2)})</option>
              </select>

              <select
                name="service"
                value={form.service}
                onChange={handleChange}
                className="border p-2 w-full bg-transparent"
                required
              >
                <option value="">Select Service</option>
                {Object.keys(servicesWithPrices).map((service) => (
                  <option key={service} value={service}>
                    {service} — ₹{servicesWithPrices[service]}
                  </option>
                ))}
              </select>

              <select
                name="timeSlot"
                value={form.timeSlot}
                onChange={handleChange}
                className="border p-2 w-full bg-transparent"
                required
              >
                <option value="">Select Time Slot</option>
                <option value="Morning">Morning</option>
                <option value="Afternoon">Afternoon</option>
                <option value="Evening">Evening</option>
              </select>

              <button
                type="submit"
                className="bg-amber-600 text-white px-4 py-2 rounded hover:bg-amber-700 w-full"
              >
                Book Your Slot 😊
              </button>
            </form>

            {/* UPI QR Code Display */}
            {showQR && (
              <div className="mt-6 text-center">
                <h2 className="text-lg font-semibold mb-2">Scan to Pay</h2>
                <img
                  src="/upi-qr.png"
                  alt="UPI QR Code"
                  className="mx-auto w-48 border rounded"
                />
                <p className="text-sm text-gray-500 mt-2">
                  Please scan the above QR using any UPI app.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
