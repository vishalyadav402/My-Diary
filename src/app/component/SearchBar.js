import React from "react";
import Link from "next/link";
import { FaPhoneAlt } from "react-icons/fa";
import { FaWhatsapp } from "react-icons/fa";

export default function SearchBar({
  search,
  setSearch,
  loading,
  filteredProfessionals,
  placeholders,
  placeholderIdx,
}) {
  return (
    <div
      className="max-w-7xl mx-auto px-4 mt-6 rounded-md sticky top-0 z-30 bg-white/90 backdrop-blur shadow-sm transition-all"
      id="searchbar-sticky"
    >
      <div className="relative">
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder={placeholders[placeholderIdx]}
          className="w-full border rounded px-4 py-2 my-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 pr-10"
          autoFocus
          onFocus={e => {
            const sticky = document.getElementById("searchbar-sticky");
            if (sticky) {
              sticky.scrollIntoView({ behavior: "smooth", block: "start" });
            }
          }}
          onTouchStart={e => {
            const sticky = document.getElementById("searchbar-sticky");
            if (sticky) {
              sticky.scrollIntoView({ behavior: "smooth", block: "start" });
            }
            e.target.focus();
          }}
        />
        {search && (
          <button
            type="button"
            aria-label="Clear search"
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-emerald-600 text-xl"
            onClick={() => setSearch("")}
            tabIndex={0}
          >
            &#10005;
          </button>
        )}
      </div>
      {/* Show results just below the search bar when searching */}
      {search.trim() && (
        <div className="bg-white rounded-b shadow-lg border-t-0 border border-emerald-100 max-h-[60vh] overflow-y-auto absolute left-0 right-0 w-full z-40">
          {loading ? (
            <p className="p-4 text-center text-gray-500">Loading...</p>
          ) : filteredProfessionals.length === 0 ? (
            <p className="p-4 text-center text-gray-400">No results found.</p>
          ) : (
            <div className="divide-y">
              {filteredProfessionals.map((pro) => (
                <div key={pro.id} className="p-4 flex flex-col md:flex-row md:items-center gap-2 hover:bg-emerald-50 transition">
                  <div className="flex-1">
                    <div className="font-semibold text-emerald-700">{pro.name}</div>
                    <div className="text-xs text-gray-500">{pro.category} &middot; {pro.location}</div>
                    {pro.services && pro.services.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {pro.services.map((service, idx) => (
                          <span
                            key={idx}
                            className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded text-xs font-medium"
                          >
                            {service}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2 mt-2 md:mt-0">
                    <Link
                      href={`tel:+91${pro.mobile}`}
                      className="p-1 px-2 flex items-center gap-1 bg-blue-600 text-white text-xs font-semibold rounded shadow-sm hover:bg-blue-700"
                    >
                      <FaPhoneAlt className="text-base" />
                      Call
                    </Link>
                    <Link
                      href={`https://wa.me/91${pro.mobile}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1 px-2 flex items-center gap-1 bg-white border border-green-600 text-green-600 text-xs font-semibold rounded shadow-sm hover:bg-green-50"
                    >
                      <FaWhatsapp className="text-lg" />
                      WhatsApp
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}