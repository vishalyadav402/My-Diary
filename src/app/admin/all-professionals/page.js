"use client";
import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  query,
  orderBy,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/app/firebase/config";
import { FaEdit, FaTrash, FaSave, FaTimes, FaEye, FaEyeSlash } from "react-icons/fa";

export default function AllProfessionals() {
  const [professionals, setProfessionals] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  useEffect(() => {
    fetchProfessionals();
  }, []);

  const fetchProfessionals = async () => {
    const q = query(collection(db, "professionals"), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setProfessionals(data);
  };

  const handleEdit = (pro) => {
    setEditingId(pro.id);
    setEditForm({
      name: pro.name,
      mobile: pro.mobile,
      location: pro.location,
      category: pro.category,
    });
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditForm({});
  };

  const handleChange = (e) => {
    setEditForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async (id) => {
    await updateDoc(doc(db, "professionals", id), {
      ...editForm,
    });
    setEditingId(null);
    fetchProfessionals();
  };

  const handleDelete = async (id) => {
    if (confirm("Delete this professional?")) {
      await deleteDoc(doc(db, "professionals", id));
      fetchProfessionals();
    }
  };

  const toggleStatus = async (pro) => {
    const newStatus = pro.status === "blocked" ? "active" : "blocked";
    await updateDoc(doc(db, "professionals", pro.id), {
      status: newStatus,
    });
    fetchProfessionals();
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-center">All Skilled Professionals</h2>
      {professionals.length === 0 ? (
        <p className="text-center text-gray-500">No professionals found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {professionals.map((pro) => (
            <div key={pro.id} className="border p-4 rounded-lg shadow-md bg-white">
              {editingId === pro.id ? (
                <>
                  <input
                    name="name"
                    value={editForm.name}
                    onChange={handleChange}
                    className="border p-1 mb-2 w-full"
                    placeholder="Name"
                  />
                  <input
                    name="mobile"
                    value={editForm.mobile}
                    onChange={handleChange}
                    className="border p-1 mb-2 w-full"
                    placeholder="Mobile"
                  />
                  <input
                    name="location"
                    value={editForm.location}
                    onChange={handleChange}
                    className="border p-1 mb-2 w-full"
                    placeholder="Location"
                  />
                  <input
                    name="category"
                    value={editForm.category}
                    onChange={handleChange}
                    className="border p-1 mb-2 w-full"
                    placeholder="Category"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => handleSave(pro.id)}
                      className="flex items-center gap-1 bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                    >
                      <FaSave /> Save
                    </button>
                    <button
                      onClick={handleCancel}
                      className="flex items-center gap-1 bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-600"
                    >
                      <FaTimes /> Cancel
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <p><strong>Name:</strong> {pro.name}</p>
                  <p><strong>Mobile:</strong> {pro.mobile}</p>
                  <p><strong>Location:</strong> {pro.location}</p>
                  <p><strong>Category:</strong> {pro.category}</p>
                  <p>
                    <strong>Status:</strong>{" "}
                    <span className={`font-semibold ${pro.status === "blocked" ? "text-red-600" : "text-green-600"}`}>
                      {pro.status || "active"}
                    </span>
                  </p>
                  <div className="flex justify-end gap-2 mt-3">
                    <button
                      onClick={() => handleEdit(pro)}
                      className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      <FaEdit /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(pro.id)}
                      className="flex items-center gap-1 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      <FaTrash /> Delete
                    </button>
                    <button
                      onClick={() => toggleStatus(pro)}
                      className={`flex items-center gap-1 px-3 py-1 ${
                        pro.status === "blocked" ? "bg-yellow-500" : "bg-gray-700"
                      } text-white rounded hover:opacity-90`}
                    >
                      {pro.status === "blocked" ? <FaEye /> : <FaEyeSlash />}{" "}
                      {pro.status === "blocked" ? "Unblock" : "Block"}
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
