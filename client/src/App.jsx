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
import Footer from "./components/pages/Footer";
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
import EventManage from "./components/pages/EventManage";
import ForgotPassword from "./components/authentication/ForgotPassword";
import ResetPassword from "./components/authentication/ResetPassword";
import AdminRoute from "./admin/AdminRoute";
import AddService from "./admin/AddService";
import AdminDashboard from "./admin/AdminDashboard";

// ✅ Layout Component
const AppLayout = () => {
  const location = useLocation();
  const hideNavbar = [
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
    "/admin",
  ].includes(location.pathname);

  return (
    <>
      {!hideNavbar && <Navbar />}
      <Outlet />
      {!hideNavbar && <Footer />}
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

        // Services & Nested Routes
        { path: "services", element: <ServicesSection /> },
        {
          path: "services/:serviceId",
          element: <ServiceDetail />,
        },
        {
          path: "services/:serviceId/payment",
          element: (
            <PrivateRoute>
              <Payment />
            </PrivateRoute>
          ),
        },

        { path: "about", element: <About /> },
        { path: "login", element: <Login /> },
        { path: "register", element: <Register /> },
        { path: "forgot-password", element: <ForgotPassword /> },
        { path: "reset-password/:token", element: <ResetPassword /> },

        // Admin Routes
        {
          path: "admin",
          element: (
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          ),
        },
        {
          path: "add-services",
          element: (
            <AdminRoute>
              <AddService />
            </AdminRoute>
          ),
        },

        // Protected Routes
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
        {
          path: "event-manage",
          element: (
            <PrivateRoute>
              <EventManage />
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
      v7_startTransition: true,
      v7_fetcherPersist: true,
      v7_normalizeFormMethod: true,
      v7_partialHydration: true,
      v7_skipActionErrorRevalidation: true,
    },
  }
);

// ✅ App Root
function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
      <ToastContainer position="top-right" autoClose={3000} />
    </AuthProvider>
  );
}

export default App;
