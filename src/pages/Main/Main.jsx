import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "pages/Main/components/Header";
import Navigation from "components/Navigation";
import RecommendService from "pages/Main/components/RecommendService";

function Home({ user }) {
  const navigate = useNavigate();


  const handleLogout = () => {
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("accessToken");
    sessionStorage.removeItem("refreshToken");
    navigate("/login");
  };


  return (
    <>
      <Header handleLogout={handleLogout} />
    
      <RecommendService navigate={navigate} />
      <Navigation />
    </>
  );
}

export default Home;