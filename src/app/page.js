"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/app/firebase/config";
import Image from "next/image";
import { FaPhoneAlt } from "react-icons/fa";
import { FaWhatsapp } from "react-icons/fa";
import { MdLocationOn } from 'react-icons/md'; // For Material Design
import QRSection from "./component/QRsection";

export default function Home() {
  const [categories, setCategories] = useState([]);
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [professionals, setProfessionals] = useState([]);
  const [loading, setLoading] = useState(false);

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
        if (locationList.length > 0) {
          setSelectedLocation(locationList[0].name);
        }
      } catch (error) {
        console.error("Error fetching locations:", error);
      }
    };
    fetchLocations();
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

  return (
    <>
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
                className="px-4 py-2 rounded bg-emerald-950 text-emerald-200 shadow border-0 outline-0"
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

            {/* Language Dropdown */}
            {/* <div className="flex flex-col items-start">
              <label
                htmlFor="language"
                className="text-white font-medium text-sm"
              >
                Language
              </label>
              <select
                id="language"
                className="py-2 px-2 rounded bg-white text-gray-800 shadow"
              >
                <option value="hi">Hindi</option>
                <option value="en">English</option>
              </select>
            </div> */}
          </div>

          {/* CTA */}
          <div className="flex justify-start items-center my-5 md:my-10">
            <Link
              href="/admin/new-professional"
              className="text-blue-50 text-2xl md:text-4xl underline-offset-1"
            >
              Are you a Skilled Professional? Register Now!
            </Link>
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
                  <p className="text-center font-bold text-[0.8rem] md:text-md text-ellipsis leading-4">
                    {item.name?.split(" ").slice(0, 2).join(" ") + (item.name?.split(" ").length > 2 ? "..." : "")}
                  </p>

                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Professionals List */}
      <div className="max-w-7xl mx-auto px-4 mt-10">
        <h2 className="text-xl md:text-2xl font-semibold mb-4 text-gray-800">
          Looking For {selectedCategory ? `${selectedCategory}`:"Skilled Professionals"} in {selectedLocation} ?
        </h2>

        {loading ? (
  <p>Loading...</p>
) : professionals.length === 0 ? (
  <p className="text-gray-600">Not Available</p>
) : (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
    {professionals
      .filter((pro) => pro.status === "active") // ✅ Only show active
      .map((pro) => (
        <div
          key={pro.id}
          className="bg-white rounded-lg shadow-md p-4 text-gray-800 flex gap-3"
        >
          <div className="bg-gray-100 text-gray-600 font-semibold rounded h-30 w-30 p-3 flex flex-col justify-center items-center">
            {pro.category || "Category not specified"}
          </div>
          <div>
            <h3 className="text-xl text-gray-600 font-bold">{pro.name}</h3>
            
            <div className="flex">
            <p className="text-md font-medium text-gray-600 flex items-center gap-1 my-1"><MdLocationOn size={20} />{pro.location}</p>
            </div>
            {/* Call and WhatsApp buttons */}
            <div className="flex gap-3 mt-2">
              <Link
                href={`tel:+91${pro.mobile}`}
                className="no-underline p-2 md:p-2 flex items-center gap-1 bg-blue-600 text-white text-sm font-semibold rounded shadow-sm hover:bg-blue-700"
              >
                <FaPhoneAlt className="text-lg"/>
                Call
              </Link>

              <Link
                href={`https://wa.me/91${pro.mobile}`}
                target="_blank"
                rel="noopener noreferrer"
                className="no-underline p-2 md:p-2 flex items-center gap-1 bg-white border border-green-600 text-green-600 text-sm font-semibold rounded shadow-sm hover:bg-green-50"
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
      <QRSection/>
      <footer className="text-center py-4 bg-white text-gray-400 text-sm">
        &copy; 2025 PBH Services. All Rights Reserved.
      </footer>
    </>
  );
}
