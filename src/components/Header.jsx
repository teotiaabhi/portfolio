import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <header className="bg-white shadow-md fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
  <Link to="/" className="text-xl font-bold text-neutral-900">
          My Portfolio
        </Link>

        {/* Animated Hamburger Button */}
        <button
          className="md:hidden transition-transform duration-300 ease-in-out"
          onClick={toggleMenu}
        >
          <span
            className={`transition-transform duration-300 ease-in-out ${
              isOpen ? "scale-0 rotate-90 opacity-0" : "scale-100 opacity-100"
            }`}
          >
            <Menu className="w-6 h-6" />
          </span>
          <span
            className={`absolute transition-transform duration-300 ease-in-out ${
              isOpen ? "scale-100 opacity-100" : "scale-0 opacity-0"
            }`}
          >
            <X className="w-6 h-6 mt-[-20px] mr-[29px]" />
          </span>
        </button>

        {/* Desktop Nav */}
        <nav className="hidden md:flex gap-6 items-center">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? "text-blue-600 font-semibold" : "text-gray-800"
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/about"
            className={({ isActive }) =>
              isActive ? "text-neutral-900 font-semibold" : "text-gray-800"
            }
          >
            About
          </NavLink>
          <NavLink
            to="/projects"
            className={({ isActive }) =>
              isActive ? "text-blue-600 font-semibold" : "text-gray-800"
            }
          >
            Projects
          </NavLink>
          <NavLink
            to="/credentials"
            className={({ isActive }) =>
              isActive ? "text-blue-600 font-semibold" : "text-gray-800"
            }
          >
            Credentials
          </NavLink>
          <NavLink
            to="/contact"
            className={({ isActive }) =>
              isActive ? "text-blue-600 font-semibold" : "text-gray-800"
            }
          >
            Contact
          </NavLink>
        </nav>
      </div>

      {/* Animated Mobile Menu */}
      <div
        className={`md:hidden transition-all duration-500 ease-in-out transform origin-top ${
          isOpen ? "max-h-[500px] opacity-100 scale-100" : "max-h-0 opacity-0 scale-y-0"
        } overflow-hidden`}
      >
        <div className="bg-white shadow-md px-4 py-4 space-y-3">
          <NavLink
            to="/"
            onClick={() => setIsOpen(false)}
            className={({ isActive }) =>
              isActive
                ? "block text-blue-600 font-semibold"
                : "block text-gray-800"
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/about"
            onClick={() => setIsOpen(false)}
            className={({ isActive }) =>
              isActive
                ? "block text-blue-600 font-semibold"
                : "block text-gray-800"
            }
          >
            About
          </NavLink>
          <NavLink
            to="/projects"
            onClick={() => setIsOpen(false)}
            className={({ isActive }) =>
              isActive
                ? "block text-blue-600 font-semibold"
                : "block text-gray-800"
            }
          >
            Projects
          </NavLink>
           <NavLink
            to="/credentials"
            onClick={() => setIsOpen(false)}
            className={({ isActive }) =>
              isActive
                ? "block text-blue-600 font-semibold"
                : "block text-gray-800"
            }
          >
            Credentials
          </NavLink>
          <NavLink
            to="/contact"
            onClick={() => setIsOpen(false)}
            className={({ isActive }) =>
              isActive
                ? "block text-blue-600 font-semibold"
                : "block text-gray-800"
            }
          >
            Contact
          </NavLink>
        </div>
      </div>
    </header>
  );
};

export default Header;
