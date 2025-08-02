"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/app/firebase/config";
import Image from "next/image";
import { FaPhoneAlt } from "react-icons/fa";
import { FaWhatsapp } from "react-icons/fa";

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
      <div className="bg-cover bg-center min-h-[65vh] bg-[url('/images/painter.jpg')]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between gap-10 py-4">
            {/* Location Dropdown */}
            <div className="flex flex-col mt-6">
              <label
                htmlFor="location"
                className="text-white font-medium text-sm"
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
                className="px-4 py-2 rounded bg-white text-gray-800 shadow"
              >
                {locations.map((loc) => (
                  <option key={loc.id} value={loc.name}>
                    {loc.name}
                  </option>
                ))}
              </select>
            </div>

            <h1 className="text-4xl hidden md:block font-bold text-gray-100">
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
          <div className="flex justify-start items-center my-10 md:mb-20">
            <Link
              href="/admin/new-professional"
              className="text-gray-100 text-2xl md:text-4xl underline"
            >
              Are you a Skilled Professional? Register Now!
            </Link>
          </div>

          {/* Category Icons */}
          <div className="p-0">
            <div className="max-w-7xl mx-auto my-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
              {categories.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() =>
                    setSelectedCategory(
                      selectedCategory === item.name ? "" : item.name
                    )
                  }
                  className={`flex flex-col items-center bg-white p-4 rounded-lg shadow transition hover:bg-blue-100 ${
                    selectedCategory === item.name ? "bg-blue-200" : ""
                  }`}
                >
                  <p className="text-center font-bold md:text-2xl">{item.name}</p>
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
          className="bg-white rounded-lg shadow-md p-4 text-gray-800 flex items-center gap-3"
        >
          <div className="bg-gray-100 rounded-full h-20 w-20"></div>
          <div>
            <h3 className="text-xl font-bold">{pro.name}</h3>
            
            {/* Category placeholder box */}
            <div className="bg-gray-200 text-gray-700 text-sm px-3 py-2 rounded-md inline-block w-fit">
              {pro.category || "Category not specified"}
            </div>

            <p className="text-md font-medium text-gray-600">{pro.location}</p>

            {/* Call and WhatsApp buttons */}
            <div className="flex gap-3 mt-2">
              <a
                href={`tel:+91${pro.mobile}`}
                className="no-underline flex items-center bg-white border border-blue-600 text-blue-600 text-sm font-semibold px-3 py-1 rounded shadow-sm hover:bg-blue-50"
              >
                <FaPhoneAlt className="mr-2" />
                Call Now
              </a>

              <a
                href={`https://wa.me/91${pro.mobile}`}
                target="_blank"
                rel="noopener noreferrer"
                className="no-underline flex items-center bg-white border border-green-600 text-green-600 text-sm font-semibold px-3 py-1 rounded shadow-sm hover:bg-green-50"
              >
                <FaWhatsapp className="mr-2 text-lg" />
                WhatsApp Me
              </a>
            </div>
          </div>
        </div>
      ))}
  </div>
)}

      </div>
</div>
      {/* Footer */}
      <div className="flex justify-center items-center my-20">
        <Image src={'/mydiaryapp-qr.png'} height={500} width={500} alt="QR Code to open My Diary app!"/>
      </div>
      <footer className="text-center py-4 bg-white text-gray-400 text-sm">
        &copy; 2025 PBH Services. All Rights Reserved.
      </footer>
    </>
  );
}
