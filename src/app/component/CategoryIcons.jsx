import React from "react";

export default function CategoryIcons({
  categories,
  loading,
  selectedCategory,
  setSelectedCategory,
}) {
  return (
    <div className="p-0">
      <div className="max-w-7xl mx-auto my-8 grid grid-cols-4 sm:grid-cols-3 md:grid-cols-6 gap-4">
        {loading && categories.length === 0 ? (
          Array.from({ length: 6 }).map((_, idx) => (
            <div
              key={idx}
              className="animate-pulse flex flex-col items-center justify-center bg-emerald-100 h-10 md:h-15 rounded-lg shadow"
            >
              <div className="w-16 h-3 bg-emerald-200 rounded mb-1"></div>
              <div className="w-10 h-2 bg-emerald-200 rounded"></div>
            </div>
          ))
        ) : (
          categories.map((item, idx) => (
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
                {item.name?.split(" ").slice(0, 3).join(" ") +
                  (item.name?.split(" ").length > 3 ? ".." : "")}
              </p>
            </button>
          ))
        )}
      </div>
    </div>
  );
}