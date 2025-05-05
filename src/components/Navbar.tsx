import React from 'react';

const Navbar: React.FC = () => {
  return (
    <>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

          .navbar {
            background: #1a1b1e;
            padding: 1rem;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.2);
            position: sticky;
            top: 0;
            z-index: 1000;
            font-family: 'Inter', sans-serif;
          }

          .nav-container {
            max-width: 100%;
            margin: 0 auto;
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0 1rem;
          }

          .nav-left {
            display: flex;
            align-items: center;
            gap: 2rem;
          }

          .nav-logo {
            font-size: 1.5rem;
            font-weight: 700;
            letter-spacing: -0.025em;
            color: #e2e8f0;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            gap: 0.5rem;
          }

          .nav-logo:hover {
            color: #3b82f6;
            transform: translateY(-1px);
          }

          .nav-logo-icon {
            font-size: 1.75rem;
          }

          .nav-links {
            display: flex;
            gap: 2rem;
            align-items: center;
            list-style: none;
          }

          .nav-link {
            color: #cbd5e0;
            text-decoration: none;
            padding: 0.5rem 0.75rem;
            border-radius: 0.5rem;
            transition: all 0.3s ease;
            font-weight: 500;
            position: relative;
          }

          .nav-link::before {
            content: "•";
            position: absolute;
            left: -1rem;
            color: #3b82f6;
            opacity: 0;
            transition: opacity 0.3s ease;
          }

          .nav-link:hover {
            color: #e2e8f0;
            background: #2d2e32;
            transform: translateY(-1px);
          }

          .nav-link:hover::before {
            opacity: 1;
          }

          .nav-link.active {
            color: #3b82f6;
            background: #2d2e32;
          }

          .nav-link.active::before {
            opacity: 1;
          }

          @media (max-width: 768px) {
            .nav-links {
              display: none;
            }
            
            .nav-container {
              padding: 0 0.5rem;
            }
          }
        `}
      </style>
      <nav className="navbar">
        <div className="nav-container">
          <div className="nav-left">
            <div className="nav-logo">
              <span className="nav-logo-icon">🎨</span>
              Color Space Converter
            </div>
            <ul className="nav-links">
              <li>
                <a href="#home" className="nav-link active">
                  Home
                </a>
              </li>
              <li>
                <a href="#features" className="nav-link">
                  Features
                </a>
              </li>
              <li>
                <a href="#about" className="nav-link">
                  About
                </a>
              </li>
              <li>
                <a href="#docs" className="nav-link">
                  Documentation
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
