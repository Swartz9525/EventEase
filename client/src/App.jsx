import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/pages/Navbar";
import { AuthProvider } from "./components/context/AuthContext";
import Home from "./components/pages/Home";
import Services from "./components/pages/ServicesSection";
const About = () => <div className="container mt-4">About Page</div>;
const Profile = () => <div className="container mt-4">User Profile</div>;
const Settings = () => <div className="container mt-4">Settings</div>;

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/about" element={<About />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
