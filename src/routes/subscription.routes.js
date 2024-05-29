// src/routes/subscription.routes.js
import React from "react";
import { Routes, Route } from "react-router-dom";
import MySubscription from "pages/Subscription/MySubscription";
import ServiceDetail from "pages/Subscription/ServiceDetail";
import Recommend from "pages/Subscription/Recommend";

const SubscriptionRoutes = ({ user }) => {
  return (
    <Routes>
      <Route path="/mysubscription" element={<MySubscription user={user} />} />
      <Route path="/recommend" element={<Recommend user={user} />} />
      <Route path="/service/:serviceId" element={<ServiceDetail user={user} />} />
    </Routes>
  );
};

export default SubscriptionRoutes;