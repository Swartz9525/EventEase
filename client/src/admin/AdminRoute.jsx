// components/routes/AdminRoute.jsx
import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../components/context/AuthContext";

const AdminRoute = ({ children }) => {
  const { user } = useContext(AuthContext);

  if (!user) {
    // not logged in
    return <Navigate to="/login" replace />;
  }

  if (user.email !== "admin@admin.com") {
    // logged in but not admin
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminRoute;
