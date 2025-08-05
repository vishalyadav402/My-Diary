import Link from "next/link";
import { FaPhoneAlt } from "react-icons/fa";
import { FaWhatsapp } from "react-icons/fa";
import { MdLocationOn } from "react-icons/md";
import React, { useState } from "react";

export default function ProfessionalsList({ loading, filteredProfessionals, selectedCategory, selectedLocation }) {
  const [visibleCount, setVisibleCount] = useState(10);

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 10);
  };

  const visibleProfessionals = filteredProfessionals.slice(0, visibleCount);

  return (
    <div className="max-w-7xl mx-auto px-4 mt-4">
      <h2 className="text-xl leading-5.5 md:text-2xl font-semibold mb-4 text-emerald-600">
        Looking For {selectedCategory ? `${selectedCategory}` : "Skilled Professionals"} in {selectedLocation} ?
      </h2>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-2 md:gap-4">
          {Array.from({ length: 4 }).map((_, idx) => (
            <div
              key={idx}
              className="bg-white rounded-lg shadow-md p-4 flex gap-3 animate-pulse min-h-[120px]"
            >
              <div className="flex flex-col relative w-32">
                <div className="bg-emerald-100 rounded h-20 w-full mb-4"></div>
                <div className="h-3 w-20 bg-emerald-200 rounded mb-2"></div>
                <div className="h-2 w-16 bg-emerald-200 rounded"></div>
              </div>
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="h-4 w-32 bg-emerald-100 rounded mb-2"></div>
                  <div className="h-3 w-24 bg-emerald-100 rounded mb-2"></div>
                  <div className="flex gap-1">
                    <div className="h-3 w-10 bg-emerald-100 rounded"></div>
                    <div className="h-3 w-10 bg-emerald-100 rounded"></div>
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <div className="h-8 w-16 bg-emerald-100 rounded"></div>
                  <div className="h-8 w-16 bg-emerald-100 rounded"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredProfessionals.length === 0 ? (
        <p className="text-gray-600">Not Available</p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-2 md:gap-4">
            {visibleProfessionals.map((pro) => (
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
          {visibleCount < filteredProfessionals.length && (
            <div className="flex justify-center mt-6">
              <button
                onClick={handleLoadMore}
                className="px-6 py-2 bg-emerald-700 text-white rounded-full font-semibold shadow hover:bg-emerald-800 transition"
              >
                Load More
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}