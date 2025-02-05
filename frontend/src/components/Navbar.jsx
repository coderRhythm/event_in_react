// src/components/Navbar.js
import React, { useState } from 'react';
import './Navbar.css'; // Import the CSS file for styling

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State to manage the mobile menu

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo or Brand Name */}
        <div className="navbar-brand">
          <a href="/">Event Management</a>
        </div>

        {/* Hamburger Menu Icon (for mobile) */}
        <div className="navbar-toggle" onClick={toggleMenu}>
          <span className={`hamburger ${isMenuOpen ? 'open' : ''}`}></span>
        </div>

        {/* Navbar Links */}
        <ul className={`navbar-links ${isMenuOpen ? 'active' : ''}`}>
          <li><a href="#home" onClick={toggleMenu}>Home</a></li>
          <li><a href="#about" onClick={toggleMenu}>About Us</a></li>
          <li><a href="#events" onClick={toggleMenu}>Event Listing</a></li>
          <li><a href="#contact" onClick={toggleMenu}>Contact Us</a></li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;