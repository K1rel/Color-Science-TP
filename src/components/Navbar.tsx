import React from 'react';

const Navbar: React.FC = () => {
  return (
    <nav className="bg-gray-800 text-white p-4 flex justify-between items-center">
      <div className="text-xl font-bold">Color Space Converter</div>
      <ul className="flex space-x-4">
        <li><a href="#home" className="hover:text-gray-400">Home</a></li>
        <li><a href="#features" className="hover:text-gray-400">Features</a></li>
        <li><a href="#about" className="hover:text-gray-400">About</a></li>
      </ul>
    </nav>
  );
};

export default Navbar;
