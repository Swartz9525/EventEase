import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";

const Navbar = () => {
  const { user, login, logout } = useAuth();
  const [darkMode, setDarkMode] = useState(false);

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
      className={`navbar navbar-expand-lg ${
        darkMode ? "navbar-dark bg-dark" : "navbar-light bg-light"
      } shadow`}
    >
      <div className="container">
        <NavLink className="navbar-brand fw-bold eventease-logo" to="/">
          EventEase
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
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 ms-3">
            <li className="nav-item">
              <NavLink className="nav-link" to="/">
                Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/services">
                Services
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/about">
                About
              </NavLink>
            </li>
          </ul>

          <div className="d-flex align-items-center gap-3">
            <input
              type="text"
              className="form-control form-control-sm"
              placeholder="Search..."
            />

            <button className="btn btn-outline-secondary position-relative">
              🔔
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                3
              </span>
            </button>

            <button
              className="btn btn-outline-secondary btn-sm"
              onClick={toggleTheme}
            >
              {darkMode ? "Light Mode" : "Dark Mode"}
            </button>

            {user ? (
              <div className="dropdown">
                <button
                  className="btn btn-outline-primary dropdown-toggle"
                  data-bs-toggle="dropdown"
                >
                  {user.name || "User"}
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
            ) : (
              <button
                className="btn btn-primary"
                onClick={() => login({ name: "Sahil", profilePic: "" })}
              >
                Login
              </button>
            )}

            {user && (
              <img
                src={user.profilePic || "https://via.placeholder.com/35"}
                alt="profile"
                className="rounded-circle"
                width={35}
                height={35}
              />
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
