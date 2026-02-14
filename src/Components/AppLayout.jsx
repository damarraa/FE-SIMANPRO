import React, { useState } from "react";
import Sidebar from "./Sidebar/Sidebar";

export default function AppLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Top navbar */}
        <header className="bg-white shadow px-4 py-3 flex items-center justify-between">
          <h1 className="text-lg font-semibold text-gray-700">My App</h1>
          {/* Button untuk buka sidebar di layar kecil */}
          <button
            className="md:hidden p-2 rounded-lg border text-gray-600 hover:bg-gray-100"
            onClick={() => setSidebarOpen(true)}
          >
            ☰
          </button>
        </header>

        {/* Main body */}
        <main className="flex-1 overflow-y-auto p-4">{children}</main>
      </div>
    </div>
  );
}
