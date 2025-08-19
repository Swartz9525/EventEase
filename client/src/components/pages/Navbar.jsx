// File: src/components/pages/Navbar.jsx
import React, { useEffect, useState, useContext } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "./Navbar.css";
import logo from "../../assets/logo.jpg"; // Adjust the path as necessary

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const [darkMode, setDarkMode] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Hide navbar on auth pages
  const hideNavbarPaths = ["/login", "/register", "/forgot-password"];
  if (hideNavbarPaths.includes(location.pathname)) return null;

  // Load dark mode preference
  useEffect(() => {
    const savedTheme = localStorage.getItem("darkMode");
    if (savedTheme === "true") {
      setDarkMode(true);
      document.body.classList.add("bg-dark", "text-white");
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !darkMode;
    setDarkMode(newTheme);
    localStorage.setItem("darkMode", newTheme);
    document.body.classList.toggle("bg-dark");
    document.body.classList.toggle("text-white");
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav
      className={`navbar navbar-expand-lg sticky-top shadow-sm py-3 ${
        darkMode ? "navbar-dark bg-dark" : "navbar-light bg-light"
      }`}
    >
      <div className="container-fluid px-4">
        <NavLink
          className="navbar-brand fw-bold fs-4 text-primary d-flex align-items-center gap-2"
          to="/"
        >
          <img
            src={logo} // Replace with your actual image path
            alt="EventEase Logo"
            style={{ width: "200px", height: "40px" }}
          />
        </NavLink>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {[
              { name: "Home", path: "/" },
              { name: "Services", path: "/services" },
              { name: "About", path: "/about" },
            ].map(({ name, path }) => (
              <li className="nav-item" key={path}>
                <NavLink className="nav-link fw-semibold fs-5 me-3" to={path}>
                  {name}
                </NavLink>
              </li>
            ))}
          </ul>

          <div className="d-flex align-items-center gap-3">
            <input
              type="text"
              className="form-control form-control-sm fw-semibold"
              placeholder="Search..."
              style={{ maxWidth: "200px" }}
            />

            {/* <button
              className="btn btn-outline-secondary position-relative fw-bold"
              title="Notifications"
            >
              🔔
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                3
              </span>
            </button> */}

            <button
              className={`btn btn-sm fw-bold fs-6 ${
                darkMode ? "btn-light" : "btn-dark"
              }`}
              onClick={toggleTheme}
              title="Toggle Theme"
            >
              {darkMode ? "☀️" : "🌙"}
            </button>

            {user ? (
              <>
                <div className="dropdown">
                  <button
                    className="btn btn-outline-primary dropdown-toggle fw-bold"
                    id="profileDropdown"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    {user.firstName || user.name || "User"}
                  </button>
                  <ul
                    className="dropdown-menu dropdown-menu-end"
                    aria-labelledby="profileDropdown"
                  >
                    <li>
                      <NavLink className="dropdown-item" to="/profile">
                        Profile
                      </NavLink>
                    </li>
                    <li>
                      <NavLink className="dropdown-item" to="/settings">
                        Settings
                      </NavLink>
                    </li>
                    <li>
                      <hr className="dropdown-divider" />
                    </li>
                    <li>
                      <button
                        className="dropdown-item text-danger"
                        onClick={handleLogout}
                      >
                        Logout
                      </button>
                    </li>
                  </ul>
                </div>
              </>
            ) : (
              <NavLink className="btn btn-primary fw-bold fs-6" to="/login">
                Login
              </NavLink>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
