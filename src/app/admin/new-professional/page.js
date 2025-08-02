"use client";
import { useEffect, useState } from "react";
import { db } from "@/app/firebase/config";
import { addDoc, collection, getDocs } from "firebase/firestore";
import { toast } from "react-toastify";

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
    <div className="max-w-md mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">Add Skilled Professional</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          className="border p-2 w-full"
        />
        <input
          type="tel"
          name="mobile"
          placeholder="Mobile"
          value={form.mobile}
          onChange={handleChange}
          className="border p-2 w-full"
        />
        <select
          name="location"
          value={form.location}
          onChange={handleChange}
          className="border p-2 w-full bg-white"
        >
          <option value="">Select Location</option>
          {locations.map((loc) => (
            <option key={loc.id} value={loc.name}>
              {loc.name}
            </option>
          ))}
        </select>
        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          className="border p-2 w-full bg-white"
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.name}>
              {cat.name}
            </option>
          ))}
        </select>
        <button type="submit" className="bg-purple-600 text-white px-4 py-2 rounded">
          Save Professional
        </button>
      </form>
    </div>
  );
}
