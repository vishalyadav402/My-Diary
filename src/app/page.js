"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/app/firebase/config";
import { FaPhoneAlt } from "react-icons/fa";
import { FaWhatsapp } from "react-icons/fa";
import { MdLocationOn } from 'react-icons/md';
import QRSection from "./component/QRSection";
import AddProfessionalModal from "./component/AddProfessionalModal";
import NoInternet from "./component/NoInternet";

export default function Home() {
  const [categories, setCategories] = useState([]);
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [professionals, setProfessionals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState(""); // <-- search state

  // For animated placeholder
  const placeholders = [
    "Search plumber, electrician, beauty, cake order etc.",
    "Try 'haircut', 'AC repair', 'Prithviganj', ...",
    "Search by name, service, or location..."
  ];
  const [placeholderIdx, setPlaceholderIdx] = useState(0);

   useEffect(() => {
    // Change placeholder every 2.5 seconds
    const interval = setInterval(() => {
      setPlaceholderIdx((i) => (i + 1) % placeholders.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const snapshot = await getDocs(collection(db, "categories"));
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCategories(data);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };
    fetchCategories();
  }, []);

  // Fetch locations
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const snapshot = await getDocs(collection(db, "locations"));
        const locationList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setLocations(locationList);
        // Set default location only if not already set
        if (!selectedLocation && locationList.length > 0) {
          setSelectedLocation("Prithviganj Bazaar");
        }
      } catch (error) {
        console.error("Error fetching locations:", error);
      }
    };
    fetchLocations();
    // eslint-disable-next-line
  }, []);

  // Fetch professionals based on selected location & category
  useEffect(() => {
    const fetchProfessionals = async () => {
      if (!selectedLocation) return;
      setLoading(true);
      try {
        let q = query(
          collection(db, "professionals"),
          where("location", "==", selectedLocation)
        );

        if (selectedCategory) {
          q = query(
            collection(db, "professionals"),
            where("location", "==", selectedLocation),
            where("category", "==", selectedCategory)
          );
        }

        const snapshot = await getDocs(q);
        const profList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProfessionals(profList);
      } catch (err) {
        console.error("Error fetching professionals:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfessionals();
  }, [selectedLocation, selectedCategory]);

  // Filter professionals by search
  const filteredProfessionals = professionals
    .filter((pro) => pro.status === "active")
    .filter((pro) => {
      if (!search.trim()) return true;
      const s = search.trim().toLowerCase();
      return (
        (pro.name && pro.name.toLowerCase().includes(s)) ||
        (pro.category && pro.category.toLowerCase().includes(s)) ||
        (pro.location && pro.location.toLowerCase().includes(s)) ||
        (Array.isArray(pro.services) &&
          pro.services.some((tag) => tag.toLowerCase().includes(s)))
      );
    });

  return (
    <>
    <NoInternet />
      <div className="min-h-[90vh]">
        {/* Hero Section */}
        <div className="bg-cover bg-center min-h-[65vh] bg-[url('/images/painter.jpg')] pb-0">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between gap-10 py-4">
              {/* Location Dropdown */}
              <div className="flex flex-col mt-6">
                <label
                  htmlFor="location"
                  className="text-emerald-500 text-shadow-emerald-50 font-semibold text-sm"
                >
                  Please Select Location:
                </label>
                <select
                  id="location"
                  value={selectedLocation}
                  onChange={(e) => {
                    setSelectedLocation(e.target.value);
                    setSelectedCategory(""); // reset category
                  }}
                  className="px-4 py-2 cursor-pointer rounded bg-emerald-950 text-emerald-200 shadow border-0 outline-0"
                >
                  {locations.map((loc) => (
                    <option key={loc.id} value={loc.name}>
                      {loc.name}
                    </option>
                  ))}
                </select>
              </div>

              <h1 className="text-4xl hidden md:block font-bold text-emerald-950 text-shadow-emerald-50">
                Find Professionals Near You
              </h1>
            </div>

            {/* CTA */}
            <div className="flex justify-start items-center my-5 gap-2 md:my-10">
              <Link
                href="/admin/new-professional"
                className="text-blue-50 leading-6.5 text-2xl md:text-4xl underline-offset-1"
              >
                Are you a Skilled Professional? 
              </Link>
              <button
                className="bg-emerald-700 font-semibold animate-bounce cursor-pointer text-white px-4 py-2 w-48 rounded-full shadow-lg z-50"
                onClick={() => setShowModal(true)}
              >
                Register Now
              </button>

              <AddProfessionalModal
                open={showModal}
                onClose={() => setShowModal(false)}
                onAdded={() => {/* Optionally refresh professionals list here */}}
              />
            </div>

            {/* Category Icons */}
            <div className="p-0">
              <div className="max-w-7xl mx-auto my-8 grid grid-cols-4 sm:grid-cols-3 md:grid-cols-6 gap-4">
                {categories.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() =>
                      setSelectedCategory(
                        selectedCategory === item.name ? "" : item.name
                      )
                    }
                    className={`flex flex-col items-center justify-center bg-emerald-950 text-emerald-100 p-1 h-10 md:h-15 rounded-lg shadow transition hover:bg-emerald-900 ${
                      selectedCategory === item.name ? "bg-blue-300" : ""
                    }`}
                  >
                    <p className="text-center font-medium text-[0.7rem] md:text-[0.9em] text-ellipsis leading-3">
                      {item.name?.split(" ").slice(0, 3).join(" ") + (item.name?.split(" ").length > 3 ? ".." : "")}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="max-w-7xl mx-auto px-4 mt-6">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={placeholders[placeholderIdx]}
            className="w-full border rounded px-4 py-2 mb-6 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
            autoFocus
          />
        </div>

        {/* Professionals List */}
        <div className="max-w-7xl mx-auto px-4 mt-4">
          <h2 className="text-xl leading-5.5 md:text-2xl font-semibold mb-4 text-emerald-600">
            Looking For {selectedCategory ? `${selectedCategory}` : "Skilled Professionals"} in {selectedLocation} ?
          </h2>

          {loading ? (
            <p>Loading...</p>
          ) : filteredProfessionals.length === 0 ? (
            <p className="text-gray-600">Not Available</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-2 md:gap-4">
              {filteredProfessionals.map((pro) => (
                <div
                  key={pro.id}
                  className="bg-white rounded-lg shadow-md p-2 md:p-4 text-gray-800 flex gap-3"
                >
                  <div className="flex flex-col relative">
                    <div className="bg-[url('/settings.png')] bg-contain bg-center mb-10 leading-4 text-gray-600 font-semibold rounded h-25 w-30 p-3 flex flex-col justify-center items-center">
                      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
                        <div className="relative z-10 text-white p-10">{pro.category || "Category not specified"}</div>
                    </div>
                    <p className="text-xs absolute bottom-0 leading-3.5 font-semibold text-blue-600 flex items-center justify-start gap-1 my-1">
                      <MdLocationOn size={20} />
                      {pro.location}
                    </p>
                  </div>
                  <div className="relative">
                    <div className="mb-10">
                    <h3 className="text-lg text-gray-600 font-semibold leading-5">{pro.name}</h3>
                    {/* Service Types */}
                    {pro.services && pro.services.length > 0 && (
                      <div className="flex flex-wrap gap-1 my-2">
                        {pro.services.map((service, idx) => (
                          <span
                            key={idx}
                            className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded text-xs font-medium"
                          >
                            {service}
                          </span>
                        ))}
                      </div>
                    )}
                    </div>
                    {/* Call and WhatsApp buttons */}
                    <div className="flex gap-3 mt-2 absolute bottom-0">
                      <Link
                        href={`tel:+91${pro.mobile}`}
                        className="no-underline px-2 md:px-2 flex items-center gap-1 bg-blue-600 text-white text-sm font-semibold rounded shadow-sm hover:bg-blue-700"
                      >
                        <FaPhoneAlt className="text-lg" />
                        Call
                      </Link>

                      <Link
                        href={`https://wa.me/91${pro.mobile}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="no-underline px-2 py-1 md:px-2 flex items-center gap-1 bg-white border border-green-600 text-green-600 text-sm font-semibold rounded shadow-sm hover:bg-green-50"
                      >
                        <FaWhatsapp className="text-2xl" />
                        WhatsApp
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      {/* Footer */}
      <QRSection />
      <footer className="text-center py-4 bg-white text-gray-400 text-sm">
        &copy; 2025 MyDiary App. All Rights Reserved.
      </footer>
    </>
  );
}