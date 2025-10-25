import React, { useEffect, useState } from "react";
import { Link as RouterLink, useLocation } from "react-router-dom";
import { Link as ScrollLink } from "react-scroll";

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
    ? "text-white hover:text-yellow-400 transition-colors"
    : "text-black hover:text-yellow-500 transition-colors";

  const buttonClass =
    "ml-2 px-4 py-2 rounded-md bg-yellow-500 hover:bg-yellow-600 text-white font-semibold transition-colors";

  return (
    // Hide navbar completely on small screens
    <header
      className={`hidden md:block w-full z-50 transition-all duration-300
        ${
          isHero
            ? "bg-transparent md:fixed md:top-0"
            : "bg-white md:fixed md:top-0 shadow"
        } 
      `}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-end">
        <nav className="flex items-center gap-6">
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
      </div>
    </header>
  );
};

export default Navbar;
