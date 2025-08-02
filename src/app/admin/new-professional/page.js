"use client";
import { useEffect, useState } from "react";
import { db } from "@/app/firebase/config";
import { addDoc, collection, getDocs } from "firebase/firestore";
import { toast } from "react-toastify";
import { FaArrowLeft, FaUser, FaPhone, FaMapMarkerAlt, FaTools } from "react-icons/fa";
import Link from "next/link";

export default function SkilledProfessionalsForm() {
  const [form, setForm] = useState({ name: "", mobile: "", location: "", category: "" });
  const [locations, setLocations] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const locSnap = await getDocs(collection(db, "locations"));
      setLocations(locSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));

      const catSnap = await getDocs(collection(db, "categories"));
      setCategories(catSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    };
    fetchData();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, mobile, location, category } = form;
    if (!name || !mobile || !location || !category) {
      return toast.error("Please fill all fields");
    }

    await addDoc(collection(db, "professionals"), {
      ...form,
      createdAt: new Date(),
    });
    toast.success("Professional added!");
    setForm({ name: "", mobile: "", location: "", category: "" });
  };

  return (

<div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4">
  <Link
    href="/"
    className="mb-4 flex items-center gap-2 text-purple-700 hover:text-purple-900 font-medium transition"
  >
    <FaArrowLeft /> Back To Home
  </Link>
      <div className="bg-white shadow-lg rounded-xl p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Add Skilled Professional
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center gap-2 border rounded px-3 py-2">
            <FaUser className="text-gray-500" />
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={form.name}
              onChange={handleChange}
              className="outline-none w-full"
              required
            />
          </div>

          <div className="flex items-center gap-2 border rounded px-3 py-2">
            <FaPhone className="text-gray-500" />
            <input
              type="tel"
              name="mobile"
              placeholder="Mobile"
              value={form.mobile}
              onChange={handleChange}
              className="outline-none w-full"
              required
            />
          </div>

          <div className="flex items-center gap-2 border rounded px-3 py-2 bg-white">
            <FaMapMarkerAlt className="text-gray-500" />
            <select
              name="location"
              value={form.location}
              onChange={handleChange}
              className="outline-none w-full bg-transparent"
              required
            >
              <option value="">Select Location</option>
              {locations.map((loc) => (
                <option key={loc.id} value={loc.name}>
                  {loc.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 border rounded px-3 py-2 bg-white">
            <FaTools className="text-gray-500" />
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="outline-none w-full bg-transparent"
              required
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 rounded transition duration-300"
          >
            Save Professional
          </button>
        </form>
      </div>
    </div>
  );
}
