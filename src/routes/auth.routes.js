// src/routes/auth.routes.js
import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "pages/Auth/Login";
import Signup from "pages/Auth/Signup";

const AuthRoutes = ({ handleAfterLogin }) => {
  return (
    <Routes>
      <Route path="/login" element={<Login handleAfterLogin={handleAfterLogin} />} />
      <Route path="/signup" element={<Signup />} />
    </Routes>
  );
};

export default AuthRoutes;