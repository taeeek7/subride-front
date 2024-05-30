import React, { useEffect, useState, useCallback } from "react";
import styled from "@emotion/styled";
import List from "@mui/material/List";
import AddIcon from "@mui/icons-material/Add";
import SubscriptItem from "pages/Subscription/components/SubscriptItem";
import Navigation from "components/Navigation";
import BackHeader from "components/BackHeader";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import api from "utils/apiInstance";

const MySubscriptionPage = styled.div`
  p {
    margin: 0;
    font-family: KBFGTextB;
  }
  .title {
    margin: 40px 0;
    font-family: "KBFGDisplayB";
    font-size: 20px;
  }
  .pay-description {
    display: flex;
    justify-content: space-between;
    font-size: 20px;
  }
  .add-button {
    display: flex;
    align-items: center;
    font-size: 14px;
    background: inherit;
    border: none;
    box-shadow: none;
    border-radius: 0;
    overflow: visible;
    cursor: pointer;
    padding: 1rem 2rem 1rem 0;
  }
  .list-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #f7f7f7;
    margin-bottom: 10px;
    padding: 10px;
  }
  .clickable {
    cursor: pointer;
    width: 100%;
  }
`;

function MySubscription({ user }) {
  const [mySubscriptionList, setMySubscriptionList] = useState([]);
  const navigate = useNavigate();
  const [totalFee, setTotalFee] = useState({
    payedFee: 0,
    discountedFee: 0,
  });

  const getMySubscription = useCallback(async (userId) => {
    try {
      const { data } = await api("mysub").get("/my-subs", {
        params: { userId },
      });
      return data.response;
    } catch (err) {
      return err;
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const subscriptionResult = await getMySubscription(user.id);
      setMySubscriptionList(subscriptionResult);
    };

    fetchData();
  }, [user.id, getMySubscription]);

  useEffect(() => {
    const newTotalFee = mySubscriptionList.reduce(
      (acc, item) => {
        acc.payedFee += item.payedFee;
        acc.discountedFee += item.discountedFee;
        return acc;
      },
      { payedFee: 0, discountedFee: 0 }
    );

    setTotalFee(newTotalFee);
  }, [mySubscriptionList]);

  const handleServiceClick = useCallback(
    (serviceId) => {
      navigate(`/subscription/service/${serviceId}`, {
        state: { serviceId: serviceId },
      });
    },
    [navigate]
  );

  const handleMakeGroup = useCallback(
    (item) => {
      const { subId, subName, logo, description } = item;
      const ele = { subId, subName, logo, description };
      navigate("/subgroup/makegroup", { state: ele });
    },
    [navigate]
  );

  return (
    <>
      <BackHeader text="구독현황" />
      <MySubscriptionPage>
        <p className="title" style={{ color: "rgb(248, 168, 9)" }}>
          MY <span style={{ color: "#4a483f" }}> 구독 서비스</span>
        </p>

        <div className="pay-description">
          <p>총 구독료</p>
          <p>
            {totalFee.payedFee && totalFee.payedFee.toLocaleString("ko-KR")} 원
          </p>
        </div>
        <div className="pay-description">
          <p className="subtitle">썹 타면 매월 절감액</p>
          <p>
            <span
              style={{ color: "#ff0000", fontSize: "18px", fontWeight: "bold" }}
            >
              {totalFee.discountedFee &&
                totalFee.discountedFee.toLocaleString("ko-KR")}
              원
            </span>
          </p>
        </div>

        <List sx={{ width: "100%" }}>
          {mySubscriptionList.length > 0 ? (
            mySubscriptionList.map((item, index) => (
              <div key={item.subId} className="list-item">
                <div
                  className="clickable"
                  onClick={() => handleServiceClick(item.subId)}
                >
                  <SubscriptItem item={item} index={index} />
                </div>
                {!item.joinGroup && (
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => handleMakeGroup(item)}
                    sx={{ marginLeft: "1rem", width: "100px" }}
                  >
                    썹 만들기
                  </Button>
                )}
              </div>
            ))
          ) : (
            <div style={{ textAlign: "center", marginTop: "1rem" }}>
              구독 중인 서비스가 없어요.
            </div>
          )}
        </List>
        <button
          className="add-button"
          onClick={() => navigate("/subscription/recommend")}
        >
          <AddIcon sx={{ fontSize: "1rem", marginRight: "1rem" }} />
          <p>추가하기</p>
        </button>
      </MySubscriptionPage>
      <Navigation />
    </>
  );
}

export default MySubscription;
