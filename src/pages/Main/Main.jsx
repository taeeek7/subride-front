import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "pages/Main/components/Header";
import Navigation from "components/Navigation";
import SubscriptionList from "pages/Main/components/SubscriptionList";
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
    
      <SubscriptionList
        user={user}
        navigate={navigate}
      />

      <RecommendService navigate={navigate} user={user} />
      
      <Navigation />
    </>
  );
}

export default Home;