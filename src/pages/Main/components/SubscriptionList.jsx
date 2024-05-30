import React, {useState, useEffect} from "react";
import styled from "@emotion/styled";
import { Button } from "@mui/material";
import { ArrowForwardIos } from "@mui/icons-material";
import api from "utils/apiInstance";

const SubscriptionListContainer = styled.div`
  background-color: #f8f8f8;
  padding: 1rem;
  width: 100%;
  border-radius: 10px;
  margin: 1rem 0rem;
  color: #4a483f;

  .display-flex {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 0.5rem;
  }

  p {
    margin: 0px;
  }

  .images {
    list-style: none;
    padding: 0;
    margin-top: 20px;
    overflow-x: auto;
    white-space: nowrap;
    margin: 0px;
  }

  .image-box {
    display: inline-block;
    width: 65px;
    height: 65px;
    border-radius: 70%;
    background-color: pink;
    margin: 0rem 1rem 0rem 0rem;
    object-fit: cover;
    cursor: pointer; 
    p {
      font-size: 10px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      word-break: break-all;
      text-align: center;
    }
  }

  .image-profile {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .image-box-recommend {
    display: inline-block;
    width: 90px;
    height: 120px;
    border-radius: 5px;
    background-color: pink;
    margin: 7px;
  }
`;

const getSubscriptionList = async (userId) => {
  try {
    const { data } = await api("mysub").get("/my-subs", {
      params: { userId },
    });
    return data.response;
  } catch (err) {
    return err;
  }
};

function SubscriptionList({ user, navigate, onTotalFee }) {
  const [subscriptionList, setSubscriptionList] = useState([]);
  const [totalFee, setTotalFee] = useState({
    payedFee: 0,
    discountedFee: 0,
    feeLevel: 0,
  });
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [subscriptionList] = await Promise.all([
          getSubscriptionList(user.id),
        ]);
        setSubscriptionList(subscriptionList);

        // totalFee 객체 생성
        const newTotalFee = subscriptionList.reduce(
          (acc, item) => {
            acc.payedFee += item.payedFee;
            acc.discountedFee += item.discountedFee;
            return acc;
          },
          { payedFee: 0, discountedFee: 0, feeLevel: 0 }
        );

        // feeLevel 계산
        let feeLevel = 0;
        if (newTotalFee.payedFee >= 200000) {
          feeLevel = 3;
        } else if (newTotalFee.payedFee >= 100000) {
          feeLevel = 2;
        } else if (newTotalFee.payedFee >= 50000) {
          feeLevel = 1;
        }
        newTotalFee.feeLevel = feeLevel;

        setTotalFee(newTotalFee);
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, [user]);

  useEffect(() => {
    onTotalFee(totalFee);
  }, [totalFee, onTotalFee]);


  const handleNavigateToMySubscription = () => {
    navigate("/subscription/mysubscription");
  };

  const handleServiceClick = (serviceId) => {
    navigate(`/subscription/service/${serviceId}`, {
      state: { serviceId: serviceId },
    });
  };

  return (
    <SubscriptionListContainer>
      <div className="display-flex">
        <p className="title">{user.userName}님의 구독 서비스</p>
        <Button
          onClick={handleNavigateToMySubscription}
          sx={{ marginRight: "-1.5rem" }}
        >
          <ArrowForwardIos />
        </Button>
      </div>
      <ul className="images">
        {subscriptionList.map((item) => (
          <li
            key={item.subId}
            className="image-box"
            onClick={() => handleServiceClick(item.subId)}
          >
            <img
              className="image-profile"
              src={`${process.env.PUBLIC_URL}/service/${item.logo}`}
              alt={item.subName}
            />
            <p>{item.subName}</p>
          </li>
        ))}
      </ul>
    </SubscriptionListContainer>
  );
}

export default SubscriptionList;