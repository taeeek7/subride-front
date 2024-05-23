// src/routes/main.routes.js
import React from "react";
import { Routes, Route } from "react-router-dom";
import Main from "pages/Main/Main";

const MainRoutes = ({ user }) => {
  return (
    <Routes>
      <Route path="/" element={<Main user={user} />} />
    </Routes>
  );
};

export default MainRoutes;