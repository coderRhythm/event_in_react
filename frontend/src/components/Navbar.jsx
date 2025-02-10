import React, { useState, useEffect } from 'react';
import './Navbar.css';
import { FaUser } from 'react-icons/fa';
import Cookies from 'js-cookie';
import mitLogo from '../assets/MIT_logo.png'; 
import { Navigate, useNavigate } from 'react-router-dom';

const Navbar = () => {
  
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [profileImage, setProfileImage] = useState(null);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleProfileMenu = () => setIsProfileMenuOpen(!isProfileMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 0);
    window.addEventListener('scroll', handleScroll);
  
    const fetchProfileImage = async () => {
      let profilePhoto = Cookies.get('profilePhoto');
      console.log('retrieved Photo from Cookie:', profilePhoto); 
      while (!profilePhoto) {
        await new Promise((resolve) => setTimeout(resolve, 500)); 
        profilePhoto = Cookies.get('profilePhoto');
      }
      
      setProfileImage(profilePhoto);
    };
  
    fetchProfileImage();
  
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  const handleLogout = ()=>{
    
    Cookies.remove('userId');
    Cookies.remove('userRole');
    Cookies.remove('profilePhoto');
    Cookies.remove('connect.sid')
    navigate('/')
  }

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container">
        {/* Toggle button for mobile */}
        <div className="navbar-toggle" onClick={toggleMenu}>
          <span className={`hamburger ${isMenuOpen ? 'open' : ''}`}></span>
        </div>

        <div className="navbar-brand">
          <img src={mitLogo} alt="this is not rhere" />
        </div>

        {/* Mobile Menu */}
        <ul className={`navbar-links ${isMenuOpen ? 'active' : ''}`}>
          {/* Close Button for Mobile Menu */}
          {isMenuOpen && (
            <li className="close-btn">
              <button onClick={closeMenu}>✖</button>
            </li>
          )}
          <li><a href="#home" onClick={closeMenu}>Home</a></li>
          <li><a href="#about" onClick={closeMenu}>About Us</a></li>
          <li><a href="#events" onClick={closeMenu}>Event Listing</a></li>
          <li><a href="#speakers" onClick={closeMenu}>speakers</a></li>
          <li><a href="#contact" onClick={closeMenu}>Contact Us</a></li>
        </ul>

        <div className="profile-container" onClick={toggleProfileMenu}>
        <div className="profile-logo">
      {profileImage ? (
        <img
          src={profileImage}
          alt="Profile"
          className="profile-img"
          onError={(e) => {
            console.log("Failed to load image:", profileImage);
            e.target.src = mitLogo; 
         }}
        />
      ) : (
       
        <div className="profile-placeholder">
          <FaUser className="profile-img" />
          </div>
      )}

          </div>

          {isProfileMenuOpen && (
            <div className="profile-dropdown">
              <button onClick={handleLogout}>Logout</button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
