// src/routes/subgroup.routes.js
import React from "react";
import { Routes, Route } from "react-router-dom";
import SubGroupCandidate from "pages/SubGroup/SubGroupCandidate";
import MySubGroup from "pages/SubGroup/MySubGroup";
import GroupDetail from "pages/SubGroup/GroupDetail";
import MakeGroup from "pages/SubGroup/MakeGroup";
import JoinGroup from "pages/SubGroup/JoinGroup";
import SuccessRoom from "pages/SubGroup/SuccessRoom";

const SubGroupRoutes = ({ user }) => {
  return (
    <Routes>
      <Route path="/subgroup-candidate" element={<SubGroupCandidate user={user} />} />
      <Route path="/mysubgroup" element={<MySubGroup user={user} />} />
      <Route path="/makegroup" element={<MakeGroup user={user} />} />
      <Route path="/success-room" element={<SuccessRoom />} />
      <Route path="/joingroup" element={<JoinGroup />} />
      <Route path="/groupdetail" element={<GroupDetail user={user} />} />
    </Routes>
  );
};

export default SubGroupRoutes;