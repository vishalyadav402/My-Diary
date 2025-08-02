"use client";
import { useState } from "react";
import { toast } from "react-toastify";
import { addDoc, collection } from "firebase/firestore";
import { db } from "@/app/firebase/config";

export default function AddCategory() {
  const [category, setCategory] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!category) return toast.error("Category is required");
    await addDoc(collection(db, "categories"), { name: category });
    toast.success("Category added");
    setCategory("");
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">Add New Category</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          className="border p-2 w-full"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="Enter category name"
          required
        />
        <button className="bg-green-600 text-white px-4 py-2 rounded">
          Add Category
        </button>
      </form>
    </div>
  );
}
