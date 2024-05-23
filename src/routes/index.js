// src/routes/index.js
import React from "react";
import { Routes, Route } from "react-router-dom";
import PrivateRouter from "components/PrivateRouter";
import AuthRoutes from "routes/auth.routes";
import MainRoutes from "routes/main.routes";

const AppRoutes = ({ user, handleAfterLogin }) => {
  return (
    <Routes>
      <Route path="/*" element={<AuthRoutes handleAfterLogin={handleAfterLogin} />} />
      <Route path="/*" element={<PrivateRouter isLoggedIn={!!user} />}>
        <Route path="/*" element={<MainRoutes user={user} />} />
      
      </Route>
    </Routes>
  );
};

export default AppRoutes;