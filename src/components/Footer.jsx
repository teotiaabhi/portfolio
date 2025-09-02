// src/components/Footer.jsx
import React from "react";

const Footer = () => {
  return (
    <footer className="bg-[#0f172a] text-white py-6 px-4 flex flex-col sm:flex-row justify-between items-center text-sm border-t border-gray-700">
      <p className="mb-2 sm:mb-0">&copy; {new Date().getFullYear()} Abhishek. All rights reserved.</p>
      <div className="flex space-x-4">
        <a href="https://github.com/teotiaabhi" target="_blank" rel="noopener noreferrer" className="hover:text-[#38bdf8] transition-colors">GitHub</a>
        <a href="https://linkedin.com/in/abhishek-teotia-a49678321" target="_blank" rel="noopener noreferrer" className="hover:text-[#38bdf8] transition-colors">LinkedIn</a>
        <a href="mailto:teotiaabhishek7@gmail.com" className="hover:text-[#38bdf8] transition-colors">Email</a>
      </div>
    </footer>
  );
};

export default Footer;
