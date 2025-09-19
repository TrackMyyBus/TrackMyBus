// src/components/Navbar.jsx
import React from "react";

const Navbar = () => {
  return (
    <header className="absolute top-0 w-full z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-end">
        {/* Desktop Menu */}
        <nav className="hidden md:flex items-center gap-6 text-white">
          <a href="#features" className="text-sm hover:text-yellow-400">
            Features
          </a>
          <a href="#contact" className="text-sm hover:text-yellow-400">
            Contact
          </a>
          <button className="ml-2 px-4 py-2 rounded-md bg-yellow-500 hover:bg-slate-100 hover:text-yellow-400 text-black text-sm">
            Login
          </button>
        </nav>

        {/* Mobile Menu */}
        <div className="md:hidden">
          <button className="px-3 py-2 rounded-md bg-yellow-500 text-black hover:bg-slate-100 hover:text-yellow-400 text-sm">
            Login
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
