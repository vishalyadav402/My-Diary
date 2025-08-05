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
import CategoryIcons from "./component/CategoryIcons";
import SearchBar from "./component/SearchBar";
import ProfessionalsList from "./component/ProfessionalsList";

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
             <CategoryIcons
          categories={categories}
          loading={loading}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />
          </div>
        </div>

       {/* Search Bar */}
        <SearchBar
          search={search}
          setSearch={setSearch}
          loading={loading}
          filteredProfessionals={filteredProfessionals}
          placeholders={placeholders}
          placeholderIdx={placeholderIdx}
        />

        {/* Professionals List */}
        {!search.trim() && (
        <ProfessionalsList
    loading={loading}
    filteredProfessionals={filteredProfessionals}
    selectedCategory={selectedCategory}
    selectedLocation={selectedLocation}
  />
        )}
      </div>

      {/* Footer */}
      <QRSection />
      <footer className="text-center py-4 bg-white text-gray-400 text-sm">
        &copy; 2025 Digital Diary App. All Rights Reserved.
      </footer>
    </>
  );
}