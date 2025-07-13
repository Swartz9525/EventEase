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
import NotFound from "./components/pages/NotFound";
import ForgotPassword from "./components/authentication/ForgotPassword";
import ResetPassword from "./components/authentication/ResetPassword";

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
        { path: "services", element: <Services /> },
        { path: "services/:serviceId", element: <ServiceDetail /> },
        { path: "about", element: <About /> },
        { path: "login", element: <Login /> },
        { path: "register", element: <Register /> },
        { path: "forgot-password", element: <ForgotPassword /> },
        { path: "reset-password/:token", element: <ResetPassword /> },

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
    </AuthProvider>
  );
}

export default App;
