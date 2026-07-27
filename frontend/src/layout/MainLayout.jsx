import React, { useState } from "react";
import SideMenu from "../components/SideMenu";
import { Outlet } from "react-router-dom";
import { FaBars, FaXmark } from "react-icons/fa6";

const MainLayout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Mobile Top Navigation Bar */}
      <header className="flex md:hidden justify-between items-center bg-zinc-700 p-4 text-zinc-100 sticky top-0 z-40 shadow-md">
        <div className="text-xl font-bold tracking-wide text-amber-50">Uddy</div>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-lg hover:bg-zinc-600 focus:outline-none cursor-pointer"
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <FaXmark className="text-2xl" /> : <FaBars className="text-2xl" />}
        </button>
      </header>

      {/* Desktop Sidebar */}
      <aside className="hidden md:block shrink-0">
        <SideMenu />
      </aside>

      {/* Mobile Drawer Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          {/* Drawer Content */}
          <div className="relative flex flex-col w-72 max-w-full bg-zinc-700 shadow-xl z-50 animate-in slide-in-from-left duration-200">
            <div className="flex justify-between items-center p-4 border-b border-zinc-600 text-amber-50">
              <span className="text-lg font-bold">Menu</span>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1.5 rounded-lg hover:bg-zinc-600 text-zinc-300 hover:text-white cursor-pointer"
              >
                <FaXmark className="text-xl" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <SideMenu onClose={() => setIsMobileMenuOpen(false)} isMobile={true} />
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      {/* flex-1 makes it so it fills the whole screen */}
      <main className="flex-1 min-w-0 overflow-x-hidden">
        {/* An outlet acts as a placeholder for nested, children routes */}
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
