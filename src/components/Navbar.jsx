import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Navbar.css';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
    document.body.style.overflow = 'auto';
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          WritEra
        </Link>
        <div className="menu-icon" onClick={toggleMenu}>
          <i className={menuOpen ? 'fas fa-times' : 'fas fa-bars'}></i>
        </div>
        <ul className={`nav-menu ${menuOpen ? 'active' : ''}`}>
          <li className="nav-item">
            <Link to="/" className="nav-link" onClick={closeMenu}>Home</Link>
          </li>
          <li className="nav-item">
            <Link to="/create" className="nav-link" onClick={closeMenu}>Create Blog</Link>
          </li>
          <li className="nav-item">
            <Link to="/blogs" className="nav-link" onClick={closeMenu}>View Blogs</Link>
          </li>
        </ul>

        {/* Sidebar / Offcanvas */}
        <div className={`sidebar ${menuOpen ? 'active' : ''}`}>
          <div className="sidebar-header">
            <h2>Menu</h2>
            <button className="close-btn" onClick={closeMenu}>
              &times;
            </button>
          </div>
          <ul className="sidebar-menu">
            <li>
              <Link to="/" onClick={closeMenu}>Home</Link>
            </li>
            <li>
              <Link to="/create" onClick={closeMenu}>Create Blog</Link>
            </li>
            <li>
              <Link to="/blogs" onClick={closeMenu}>View Blogs</Link>
            </li>
          </ul>
        </div>

        {/* Overlay */}
        {menuOpen && <div className="overlay" onClick={closeMenu}></div>}
      </div>
    </nav>
  );
};

export default Navbar;