import { useState, useEffect } from "react";
import { db } from "@/app/firebase/config";
import { addDoc, collection, getDocs } from "firebase/firestore";
import { toast } from "react-toastify";
import { FaUser, FaPhone, FaMapMarkerAlt, FaTools, FaTags, FaTimes } from "react-icons/fa";

export default function AddProfessionalModal({ open, onClose, onAdded }) {
  const [form, setForm] = useState({ name: "", mobile: "", location: "", category: "" });
  const [locations, setLocations] = useState([]);
  const [categories, setCategories] = useState([]);
  const [services, setServices] = useState([]);
  const [serviceInput, setServiceInput] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    const fetchData = async () => {
      const locSnap = await getDocs(collection(db, "locations"));
      setLocations(locSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      const catSnap = await getDocs(collection(db, "categories"));
      setCategories(catSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    };
    fetchData();
    setForm({ name: "", mobile: "", location: "", category: "" });
    setServices([]);
    setServiceInput("");
  }, [open]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleServiceInput = (e) => setServiceInput(e.target.value);

  const handleServiceKeyDown = (e) => {
    if ((e.key === "Enter" || e.key === ",") && serviceInput.trim()) {
      e.preventDefault();
      const newTag = serviceInput.trim().replace(/,$/, "");
      if (newTag && !services.includes(newTag)) {
        setServices([...services, newTag]);
      }
      setServiceInput("");
    }
  };

  const removeService = (tag) => setServices(services.filter((t) => t !== tag));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, mobile, location, category } = form;
    if (!name || !mobile || !location || !category || services.length === 0) {
      return toast.error("Please fill all fields and add at least one service type");
    }
    setLoading(true);
    await addDoc(collection(db, "professionals"), {
      ...form,
      services,
      createdAt: new Date(),
      status: "active"
    });
    setLoading(false);
    toast.success("Professional added!");
    onClose();
    if (onAdded) onAdded();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(0,0,0,0.5)]">
      <div className="bg-white rounded-lg shadow-lg p-6 m-2 w-full max-w-md relative">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
          onClick={onClose}
        >
          <FaTimes size={20} />
        </button>
        <h2 className="text-xl font-bold mb-4 text-center text-gray-800">Add Skilled Professional</h2>
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
          <div>
            <label className="block mb-1 font-medium text-gray-700 flex items-center gap-2">
              <FaTags className="text-gray-500" /> Services Type
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {services.map((tag) => (
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
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-emerald-50 font-semibold py-2 rounded transition duration-300"
          >
            {loading ? "Saving..." : "Save Professional"}
          </button>
        </form>
      </div>
    </div>
  );
}