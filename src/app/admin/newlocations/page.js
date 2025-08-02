"use client";
import { useState } from "react";
import { db } from "@/app/firebase/config";
import { addDoc, collection } from "firebase/firestore";
import { toast } from "react-toastify";

export default function AddLocation() {
  const [location, setLocation] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!location) return toast.error("Location is required");
    await addDoc(collection(db, "locations"), { name: location });
    toast.success("Location added");
    setLocation("");
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">Add New Location</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          className="border p-2 w-full"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Enter location name"
          required
        />
        <button className="bg-blue-600 text-white px-4 py-2 rounded">
          Add Location
        </button>
      </form>
    </div>
  );
}
