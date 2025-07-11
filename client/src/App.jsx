// File: src/App.jsx
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

// Context & Components
import { AuthProvider } from "./components/context/AuthContext";
import Navbar from "./components/pages/Navbar";
import PrivateRoute from "./components/routes/PrivateRoute";

// Pages
import Home from "./components/pages/Home";
import Payment from "./components/pages/Payment";
import Services from "./components/pages/ServicesSection";
import ServiceDetail from "./components/pages/ServiceDetail";
import Register from "./components/authentication/Register";
import Login from "./components/authentication/Login";
import Profile from "./components/pages/Profile";
import Settings from "./components/pages/Settings";
import About from "./components/pages/About";
import NotFound from "./components/pages/NotFound"; // Optional
import ForgotPassword from "./components/authentication/ForgotPassword";
import ResetPassword from "./components/authentication/ResetPassword";

const AppLayout = ({ children }) => {
  const location = useLocation();
  const hideNavbar = ["/login", "/register", "/forgot-password"].includes(
    location.pathname
  );

  return (
    <>
      {!hideNavbar && <Navbar />}
      {children}
    </>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppLayout>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/services" element={<Services />} />
            <Route path="/services/:serviceId" element={<ServiceDetail />} />
            <Route path="/about" element={<About />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />

            {/* Protected Routes */}
            <Route
              path="/payment"
              element={
                <PrivateRoute>
                  <Payment />
                </PrivateRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <PrivateRoute>
                  <Settings />
                </PrivateRoute>
              }
            />

            {/* 404 Page */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AppLayout>
      </Router>
    </AuthProvider>
  );
}

export default App;
