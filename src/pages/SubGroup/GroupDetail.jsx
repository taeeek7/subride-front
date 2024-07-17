import { useEffect, useState, useCallback } from "react";
import { useLocation } from "react-router";
import BackHeader from "components/BackHeader";
import api from "utils/apiInstance";
import GroupInfo from "./components/GroupInfo";
import InvitationButtonComponent from "./components/InvitationButton";
import PaymentDetail from "./components/PaymentDetail";
import Navigation from "components/Navigation";

function GroupDetail({ user }) {
  const location = useLocation();
  const groupId = location.state?.groupId || null;
  const [groupData, setGroupData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getGroupData = useCallback(async () => {
    try {
      setLoading(true);
      if (groupId !== null) {
        const { data } = await api("mygrp").get("/my-groups/" + groupId, {
          params: {
            userId: user.id
          }
        });
        setGroupData(data.response);
      }
    } catch (err) {
      console.log("error");
      setError("그룹 데이터를 가져오는데 실패했습니다");
    } finally {
      setLoading(false);
    }
  }, [groupId, user]);

  useEffect(() => {
    getGroupData();
  }, [getGroupData]);

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>오류: {error}</div>;

  return ( 
    <>
      <BackHeader text="썹 그룹 상세"></BackHeader>
      {groupData && (<GroupInfo groupData={groupData} />)}
      {groupData && (<InvitationButtonComponent groupData={groupData} user={user} />)}
      <PaymentDetail groupId={groupId} groupData={groupData} />
      <Navigation />
    </>
  );
}

export default GroupDetail;