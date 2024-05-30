import React, {useState} from "react";
import { useNavigate } from "react-router-dom";
import Header from "pages/Main/components/Header";
import Navigation from "components/Navigation";
import TotalFeeSave from "pages/Main/components/TotalFeeSave";
import SubscriptionList from "pages/Main/components/SubscriptionList";
import RecommendService from "pages/Main/components/RecommendService";
import SubGroupList from "pages/Main/components/SubGroupList";

function Home({ user }) {
  const navigate = useNavigate();
  const [totalFee, setTotalFee] = useState({
    payedFee: 0,
    discountedFee: 0,
    feeLevel: 0,
  });

  const handleTotalFee = (data) => {
    setTotalFee(data);
  };

  const handleLogout = () => {
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("accessToken");
    sessionStorage.removeItem("refreshToken");
    navigate("/login");
  };
 
  return (
    <>
      <Header handleLogout={handleLogout} />

      <TotalFeeSave totalFee={totalFee} navigate={navigate} />

      <SubGroupList
        user={user}
        navigate={navigate}
      />

      <SubscriptionList
        user={user}
        navigate={navigate}
        onTotalFee={handleTotalFee}
      />

      <RecommendService navigate={navigate} user={user} />
      
      <Navigation />
    </>
  );
}

export default Home;