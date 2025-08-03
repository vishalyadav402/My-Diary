"use client"
import { useState } from "react";
import { Menu as MenuIcon, X as CloseIcon } from "@mui/icons-material";

// export const metadata = {
//   title: "Admin Dashboard | VegaCart",
//   description: "Manage all admin tasks with ease.",
//   keyword: "admin dashboard, admin panel, admin tools, manage categories, manage orders",
// };

export default function CMSLayout({ children }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="bg-emerald-950 text-emerald-50 p-4 flex justify-between items-center fixed top-0 left-0 w-full z-10">
        <button
          className="md:hidden text-light-dark"
          onClick={() => setIsMenuOpen(true)}
        >
          <MenuIcon fontSize="large" />
        </button>
        <h1 className="text-xl font-bold">Welcome Admin 🧐</h1>
        <button className="bg-pink-dark px-4 py-2 rounded-lg shadow-sm hover:shadow-lg">
          Logout
        </button>
      </header>

      {/* Sidebar (Desktop) */}
      <aside className="hidden md:block bg-emerald-950 text-emerald-50 w-64 fixed top-16 left-0 h-[calc(100%-4rem)]">
        <ul className="h-full overflow-y-auto">
          <li className="py-2 pt-4 px-4 hover:bg-emerald-900">
            <a href="" className="block text-emerald-50">Dashboard</a>
          </li>
          <li className="py-2 pt-4 px-4 hover:bg-emerald-900">
            <a href="/admin/bookings" className="block text-emerald-50">Bookings</a>
          </li>
          <li className="py-2 px-4 hover:bg-emerald-900">
            <a href="/admin/all-professionals" className="block text-emerald-50">All Professionals</a>
          </li>
          <li className="py-2 px-4 hover:bg-emerald-900">
            <a href="/admin/new-professional" className="block text-emerald-50">New Professional</a>
          </li>
          <li className="py-2 px-4 hover:bg-emerald-900">
            <a href="/admin/newcategory" className="block text-emerald-50">New Category</a>
          </li>
          <li className="py-2 px-4 hover:bg-emerald-900">
            <a href="/admin/newlocations" className="block text-emerald-50">New Location</a>
          </li>
          <li className="py-2 px-4 fixed bottom-5">
            <a href="" className="block text-emerald-50">Logout</a>
          </li>
        </ul>
      </aside>

      {/* Sidebar (Mobile - Modal) */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-20" onClick={() => setIsMenuOpen(false)}>
          <div className="bg-purple-dark w-64 h-full fixed top-0 left-0 p-4 flex flex-col z-30" onClick={(e) => e.stopPropagation()}>
            <button className="text-light-dark self-end mb-4" onClick={() => setIsMenuOpen(false)}>
              <CloseIcon fontSize="large" />
            </button>
            <ul className="h-full overflow-y-auto">
              <li className="py-2 px-4 hover:bg-pink-dark">
                <a href="dashboard" className="block text-light-dark">Dashboard</a>
              </li>
              <li className="py-2 px-4 hover:bg-pink-dark">
                <a href="managecategory" className="block text-light-dark">Manage Category</a>
              </li>
              <li className="py-2 px-4 hover:bg-pink-dark">
                <a href="product" className="block text-light-dark">Products</a>
              </li>
              <li className="py-2 px-4 hover:bg-pink-dark">
                <a href="order" className="block text-light-dark">Orders</a>
              </li>
              <li className="py-2 px-4 hover:bg-pink-dark">
                <a href="whatsapp" className="block text-light-dark">Whatsapp</a>
              </li>
              <li className="py-2 px-4 hover:bg-pink-dark mt-auto">
                <a href="" className="block text-light-dark">Logout</a>
              </li>
            </ul>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 bg-light-dark mt-20 md:p-4 ml-0 md:ml-64 h-[calc(100vh-4rem)] overflow-y-auto">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-purple-dark text-beige-light p-4 text-center">
        Admin Footer © {new Date().getFullYear()}
      </footer>
    </div>
  );
}
