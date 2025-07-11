// File: src/components/pages/Navbar.jsx
import React, { useEffect, useState, useContext } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "./Navbar.css";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const [darkMode, setDarkMode] = useState(false);
  const location = useLocation();

  // Hide navbar on login, register, forgot-password pages
  const hideNavbarPaths = ["/login", "/register", "/forgot-password"];
  if (hideNavbarPaths.includes(location.pathname)) return null;

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

  return (
    <nav
      className={`navbar navbar-expand-lg sticky-top shadow-sm py-4 ${
        darkMode ? "navbar-dark bg-dark" : "navbar-light bg-light"
      }`}
    >
      <div className="container d-flex justify-content-between align-items-center">
        <NavLink className="navbar-brand fw-bold fs-4 text-primary" to="/">
          🎉 EventEase
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
              <li className="nav-item fw-bold fs-5 me-4" key={name}>
                <NavLink className="nav-link" to={path}>
                  {name}
                </NavLink>
              </li>
            ))}
          </ul>

          <div className="d-flex align-items-center gap-3">
            <input
              type="text"
              className="form-control form-control-sm fw-semibold fs-6"
              placeholder="Search..."
              style={{ maxWidth: "220px" }}
            />

            <button className="btn btn-outline-secondary position-relative fw-bold">
              🔔
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                3
              </span>
            </button>

            <button
              className={`btn btn-sm fw-bold fs-6 ${
                darkMode ? "btn-light" : "btn-dark"
              }`}
              onClick={toggleTheme}
            >
              {darkMode ? "☀️" : "🌙"}
            </button>

            {user ? (
              <>
                <div className="dropdown">
                  <button
                    className="btn btn-outline-primary dropdown-toggle fw-bold"
                    data-bs-toggle="dropdown"
                  >
                    {user.firstName || user.name || "User"}
                  </button>
                  <ul className="dropdown-menu dropdown-menu-end">
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
                        onClick={logout}
                      >
                        Logout
                      </button>
                    </li>
                  </ul>
                </div>

                <img
                  src={user.profilePic || "https://via.placeholder.com/40"}
                  alt="Profile"
                  className="rounded-circle border border-secondary"
                  width={50}
                  height={50}
                />
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
