"use client";
import { useState, useEffect } from "react";
import { db } from "@/app/firebase/config";
import {
  addDoc,
  collection,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";
import { toast } from "react-toastify";
import CMSLayout from "@/app/component/CMSLayout";

export default function AddLocation() {
  const [location, setLocation] = useState("");
  const [locations, setLocations] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editingValue, setEditingValue] = useState("");

  const fetchLocations = async () => {
    const snapshot = await getDocs(collection(db, "locations"));
    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setLocations(data);
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!location.trim()) return toast.error("Location is required");
    await addDoc(collection(db, "locations"), { name: location });
    toast.success("Location added");
    setLocation("");
    fetchLocations();
  };

  const handleEdit = (id, name) => {
    setEditingId(id);
    setEditingValue(name);
  };

  const handleUpdate = async (id) => {
    if (!editingValue.trim()) return toast.error("Location name cannot be empty");
    await updateDoc(doc(db, "locations", id), { name: editingValue });
    toast.success("Location updated");
    setEditingId(null);
    setEditingValue("");
    fetchLocations();
  };

  return (
    <CMSLayout>
      <div className="max-w-md p-4">
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

        <hr className="my-6" />

        <h3 className="text-lg font-semibold mb-2">All Locations</h3>
        <ul className="space-y-2">
          {locations.map((loc) => (
            <li
              key={loc.id}
              className="flex items-center justify-between border p-2 rounded"
            >
              {editingId === loc.id ? (
                <>
                  <input
                    value={editingValue}
                    onChange={(e) => setEditingValue(e.target.value)}
                    className="border p-1 flex-1 mr-2"
                  />
                  <button
                    onClick={() => handleUpdate(loc.id)}
                    className="bg-blue-500 text-white px-2 py-1 rounded"
                  >
                    Save
                  </button>
                </>
              ) : (
                <>
                  <span>{loc.name}</span>
                  <button
                    onClick={() => handleEdit(loc.id, loc.name)}
                    className="text-blue-600 text-sm"
                  >
                    Edit
                  </button>
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
    </CMSLayout>
  );
}
