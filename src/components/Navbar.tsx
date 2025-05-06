import React from 'react';
import {NavLink} from "react-router-dom";

const Navbar: React.FC = () => {
  return (
    <>
      <nav className="navbar">
        <div className="nav-container">
          <div className="nav-left">
            <div className="nav-logo">
              <span className="nav-logo-icon">🎨</span>
              Color Space Converter
            </div>
            <ul className="nav-links">
              <li>
                <NavLink to="/" className="nav-link">Home</NavLink>
              </li>
              <li>
                <NavLink to="/features" className="nav-link">Features</NavLink>
              </li>
              <li>
                <NavLink to="/about" className="nav-link">About</NavLink>
              </li>
              <li>
                <NavLink to="/documentation" className="nav-link">Documentation</NavLink>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
