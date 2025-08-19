// File: src/App.jsx
import React from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  useLocation,
} from "react-router-dom";

// Context & Components
import { AuthProvider } from "./components/context/AuthContext";
import Navbar from "./components/pages/Navbar";
import PrivateRoute from "./components/routes/PrivateRoute";

// Toastify
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Pages
import Home from "./components/pages/Home";
import Payment from "./components/pages/Payment";
import ServicesSection from "./components/pages/ServicesSection";
import ServiceDetail from "./components/pages/ServiceDetail";
import Register from "./components/authentication/Register";
import Login from "./components/authentication/Login";
import Profile from "./components/pages/Profile";
import Settings from "./components/pages/Settings";
import About from "./components/pages/About";
import NotFound from "./components/pages/NotFound";
import ForgotPassword from "./components/authentication/ForgotPassword";
import ResetPassword from "./components/authentication/ResetPassword";
import AdminServices from "./admin/AdminServices";
import AdminSubServices from "./admin/AdminSubServices";
import AddService from "./admin/AddService";
import AdminDashboard from "./admin/AdminDashboard";

// ✅ Layout Component
const AppLayout = () => {
  const location = useLocation();
  const hideNavbar = ["/login", "/register", "/forgot-password"].includes(
    location.pathname
  );

  return (
    <>
      {!hideNavbar && <Navbar />}
      <Outlet />
    </>
  );
};

// ✅ Router Configuration
const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <AppLayout />,
      children: [
        { index: true, element: <Home /> },
        { path: "services", element: <ServicesSection /> },
        { path: "services/:serviceId", element: <ServiceDetail /> },
        { path: "about", element: <About /> },
        { path: "login", element: <Login /> },
        { path: "register", element: <Register /> },
        { path: "forgot-password", element: <ForgotPassword /> },
        { path: "reset-password/:token", element: <ResetPassword /> },
        { path: "admin-services", element: <AdminServices /> },
        { path: "admin", element: <AdminDashboard /> },
        { path: "admin-subservices", element: <AdminSubServices /> },
        { path: "add-services", element: <AddService /> },

        {
          path: "payment",
          element: (
            <PrivateRoute>
              <Payment />
            </PrivateRoute>
          ),
        },
        {
          path: "profile",
          element: (
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          ),
        },
        {
          path: "settings",
          element: (
            <PrivateRoute>
              <Settings />
            </PrivateRoute>
          ),
        },

        { path: "*", element: <NotFound /> },
      ],
    },
  ],
  {
    future: {
      v7_relativeSplatPath: true,
    },
  }
);

// ✅ App Root
function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
      {/* Toast container should be outside RouterProvider so it's global */}
      <ToastContainer position="top-right" autoClose={3000} />
    </AuthProvider>
  );
}

export default App;
