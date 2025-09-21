import React, { useEffect, useState } from "react";
import { Link as RouterLink, useLocation } from "react-router-dom";
import { Link as ScrollLink } from "react-scroll"; // <-- new

const Navbar = () => {
  const [isHero, setIsHero] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      const heroHeight = document.getElementById("hero")?.offsetHeight || 0;
      setIsHero(window.scrollY < heroHeight - 80);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [location]);

  const linkClass = isHero
    ? "text-white hover:text-yellow-500 transition-colors"
    : "text-black hover:text-yellow-500 transition-colors";

  const buttonClass = isHero
    ? "ml-2 px-4 py-2 rounded-md bg-yellow-500 hover:bg-yellow-600 text-white font-semibold transition-colors"
    : "ml-2 px-4 py-2 rounded-md bg-yellow-500 hover:bg-yellow-600 text-black font-semibold transition-colors";

  return (
    <header className="fixed top-0 w-full z-50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-end">
        {/* Desktop Menu */}
        <nav className={`hidden md:flex items-center gap-6`}>
          <ScrollLink
            to="hero"
            smooth={true}
            duration={500}
            className={linkClass}>
            Home
          </ScrollLink>
          <ScrollLink
            to="features"
            smooth={true}
            duration={500}
            className={linkClass}>
            Features
          </ScrollLink>
          <ScrollLink
            to="contact"
            smooth={true}
            duration={500}
            className={linkClass}>
            Contact
          </ScrollLink>
          <RouterLink to="/login">
            <button className={buttonClass}>Login</button>
          </RouterLink>
        </nav>

        {/* Mobile Menu */}
        <div className="md:hidden">
          <RouterLink to="/login">
            <button className={buttonClass}>Login</button>
          </RouterLink>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
