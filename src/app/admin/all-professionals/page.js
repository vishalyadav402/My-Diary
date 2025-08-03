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
import { FaEdit, FaTrash, FaSave, FaTimes, FaEye, FaEyeSlash, FaTags } from "react-icons/fa";
import CMSLayout from "@/app/component/CMSLayout";
import Link from "next/link";

export default function AllProfessionals() {
  const [professionals, setProfessionals] = useState([]);
  const [categories, setCategories] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [serviceInput, setServiceInput] = useState(""); // <-- for tag input

  useEffect(() => {
    fetchProfessionals();
    fetchCategories();
  }, []);

  const fetchProfessionals = async () => {
    const q = query(collection(db, "professionals"), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setProfessionals(data);
  };

  const fetchCategories = async () => {
    const snapshot = await getDocs(collection(db, "categories"));
    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setCategories(data);
  };

  const handleEdit = (pro) => {
    setEditingId(pro.id);
    setEditForm({
      name: pro.name,
      mobile: pro.mobile,
      location: pro.location,
      category: pro.category,
      services: pro.services || [],
    });
    setServiceInput(""); // Reset service input
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditForm({});
    setServiceInput(""); // Reset service input
  };

  const handleChange = (e) => {
    setEditForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Tag input for services
  const handleServiceInput = (e) => setServiceInput(e.target.value);

 const handleServiceKeyDown = (e) => {
    if ((e.key === "Enter" || e.key === ",") && serviceInput.trim()) {
      e.preventDefault();
      const newTag = serviceInput.trim().replace(/,$/, "");
      if (newTag && !editForm.services.includes(newTag)) {
        setEditForm((prev) => ({
          ...prev,
          services: [...(prev.services || []), newTag],
        }));
      }
      setServiceInput("");
    }
  };

  const removeService = (tag) => {
    setEditForm((prev) => ({
      ...prev,
      services: (prev.services || []).filter((t) => t !== tag),
    }));
  };

  const handleSave = async (id) => {
    await updateDoc(doc(db, "professionals", id), {
      ...editForm,
      services: Array.isArray(editForm.services)
        ? editForm.services
        : (editForm.services || "").split(",").map((s) => s.trim()).filter(Boolean),
    });
    setEditingId(null);
    setServiceInput("");
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
    <CMSLayout>
      <div className="p-4 lg:max-w-7xl">
        <div className="flex justify-between mb-5">
          <h2 className="text-2xl font-bold mb-4 self-center">All Skilled Professionals</h2>
          <Link
            className="bg-emerald-700 rounded text-emerald-50 self-center p-2 hover:cursor-pointer"
            href="/admin/new-professional"
          >
            New Professional
          </Link>
        </div>
        {professionals.length === 0 ? (
          <p className="text-center text-gray-500">No professionals found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-2 px-3 border">#</th>
                  <th className="py-2 px-3 border">Name</th>
                  <th className="py-2 px-3 border">Mobile</th>
                  <th className="py-2 px-3 border">Location</th>
                  <th className="py-2 px-3 border">Category</th>
                  <th className="py-2 px-3 border">Services</th>
                  <th className="py-2 px-3 border">Status</th>
                  <th className="py-2 px-3 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {professionals.map((pro, idx) => (
                  <tr key={pro.id} className="border-b">
                    <td className="py-2 px-3 border text-center">{idx + 1}</td>
                    <td className="py-2 px-3 border">
                      {editingId === pro.id ? (
                        <input
                          name="name"
                          value={editForm.name}
                          onChange={handleChange}
                          className="border p-1 w-full"
                          placeholder="Name"
                        />
                      ) : (
                        pro.name
                      )}
                    </td>
                    <td className="py-2 px-3 border">
                      {editingId === pro.id ? (
                        <input
                          name="mobile"
                          value={editForm.mobile}
                          onChange={handleChange}
                          className="border p-1 w-full"
                          placeholder="Mobile"
                        />
                      ) : (
                        pro.mobile
                      )}
                    </td>
                    <td className="py-2 px-3 border">
                      {editingId === pro.id ? (
                        <input
                          name="location"
                          value={editForm.location}
                          onChange={handleChange}
                          className="border p-1 w-full"
                          placeholder="Location"
                        />
                      ) : (
                        pro.location
                      )}
                    </td>
                    <td className="py-2 px-3 border">
                      {editingId === pro.id ? (
                        <select
                          name="category"
                          value={editForm.category}
                          onChange={handleChange}
                          className="border p-1 w-full"
                          required
                        >
                          <option value="">Select Category</option>
                          {categories.map((cat) => (
                            <option key={cat.id} value={cat.name}>
                              {cat.name}
                            </option>
                          ))}
                        </select>
                      ) : (
                        pro.category
                      )}
                    </td>
                    <td className="py-2 px-3 border">
                      {editingId === pro.id ? (
                        <div>
                          <label className="block mb-1 font-medium text-gray-700 flex items-center gap-2">
                            <FaTags className="text-gray-500" /> Services Type
                          </label>
                          <div className="flex flex-wrap gap-2 mb-2">
                            {(editForm.services || []).map((tag) => (
                              <span key={tag} className="bg-purple-100 text-purple-700 px-2 py-1 rounded flex items-center">
                                {tag}
                                <button
                                  type="button"
                                  onClick={() => removeService(tag)}
                                  className="ml-1 text-purple-500 hover:text-purple-800"
                                  aria-label="Remove"
                                >
                                  &times;
                                </button>
                              </span>
                            ))}
                          </div>
                          <input
                            type="text"
                            value={serviceInput}
                            onChange={handleServiceInput}
                            onKeyDown={handleServiceKeyDown}
                            placeholder="Type a service and press Enter"
                            className="outline-none w-full border rounded px-3 py-2"
                          />
                          <small className="text-gray-500">Press Enter or comma to add multiple services</small>
                        </div>
                      ) : (
                        Array.isArray(pro.services)
                          ? pro.services.join(", ")
                          : pro.services || "-"
                      )}
                    </td>
                    <td className="py-2 px-3 border text-center">
                      <span className={`font-semibold ${pro.status === "blocked" ? "text-red-600" : "text-green-600"}`}>
                        {pro.status || "active"}
                      </span>
                    </td>
                    <td className="py-2 px-3 border text-center space-x-2">
                      {editingId === pro.id ? (
                        <>
                          <button
                            onClick={() => handleSave(pro.id)}
                            className="bg-green-600 text-white px-2 py-1 rounded"
                          >
                            <FaSave />
                          </button>
                          <button
                            onClick={handleCancel}
                            className="bg-gray-400 text-white px-2 py-1 rounded"
                          >
                            <FaTimes />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => handleEdit(pro)}
                            className="text-blue-600 text-sm px-2"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleDelete(pro.id)}
                            className="text-red-600 text-sm px-2"
                          >
                            <FaTrash />
                          </button>
                          <button
                            onClick={() => toggleStatus(pro)}
                            className={`text-white text-sm px-2 rounded ${
                              pro.status === "blocked" ? "bg-yellow-500" : "bg-gray-700"
                            }`}
                          >
                            {pro.status === "blocked" ? <FaEye /> : <FaEyeSlash />}
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
                {professionals.length === 0 && (
                  <tr>
                    <td colSpan={8} className="text-center py-4 text-gray-400">
                      No professionals found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </CMSLayout>
  );
}