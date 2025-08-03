"use client";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import {
  addDoc,
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "@/app/firebase/config";
import CMSLayout from "@/app/component/CMSLayout";

export default function AddCategory() {
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editingValue, setEditingValue] = useState("");

  const fetchCategories = async () => {
    const snapshot = await getDocs(collection(db, "categories"));
    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setCategories(data);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!category) return toast.error("Category is required");
    await addDoc(collection(db, "categories"), { name: category });
    toast.success("Category added");
    setCategory("");
    fetchCategories();
  };

  const handleEdit = (id, name) => {
    setEditingId(id);
    setEditingValue(name);
  };

  const handleUpdate = async (id) => {
    if (!editingValue.trim()) return toast.error("Category name cannot be empty");
    await updateDoc(doc(db, "categories", id), { name: editingValue });
    toast.success("Category updated");
    setEditingId(null);
    setEditingValue("");
    fetchCategories();
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this category?")) {
      await deleteDoc(doc(db, "categories", id));
      toast.success("Category deleted");
      fetchCategories();
    }
  };

  return (
    <CMSLayout>
      <div className="max-w-md p-4">
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

        <hr className="my-6" />

        <h3 className="text-lg font-semibold mb-2">All Categories</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full border text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-3 border">#</th>
                <th className="py-2 px-3 border text-left">Category Name</th>
                <th className="py-2 px-3 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat, idx) => (
                <tr key={cat.id} className="border-b">
                  <td className="py-2 px-3 border text-center">{idx + 1}</td>
                  <td className="py-2 px-3 border">
                    {editingId === cat.id ? (
                      <input
                        value={editingValue}
                        onChange={(e) => setEditingValue(e.target.value)}
                        className="border p-1 w-full"
                      />
                    ) : (
                      <span>{cat.name}</span>
                    )}
                  </td>
                  <td className="py-2 px-3 border text-center space-x-2">
                    {editingId === cat.id ? (
                      <button
                        onClick={() => handleUpdate(cat.id)}
                        className="bg-blue-500 text-white px-2 py-1 rounded"
                      >
                        Save
                      </button>
                    ) : (
                      <button
                        onClick={() => handleEdit(cat.id, cat.name)}
                        className="text-blue-600 text-sm px-2"
                      >
                        Edit
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(cat.id)}
                      className="text-red-600 text-sm px-2"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {categories.length === 0 && (
                <tr>
                  <td colSpan={3} className="text-center py-4 text-gray-400">
                    No categories found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </CMSLayout>
  );
}