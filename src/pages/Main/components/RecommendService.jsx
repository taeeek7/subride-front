// RecommendService.js
import React from "react";
import styled from "@emotion/styled";
import { ArrowForwardIos } from "@mui/icons-material";
import bunnyKing from "assets/bunnyKing.png";

const RecommendServiceContainer = styled.div`
  color: #4a483f;
  background-color: #f9eeee;
  padding: 1rem;
  width: 100%;
  border-radius: 10px;
  position: relative;
  box-shadow: 0 3px 3px rgba(0, 0, 0, 0.2);
  margin-bottom: 60px;
  p {
    margin: 0px;
  }
  span {
    color: #878787;
    font-size: 10px;
    margin-left: 2px;
  }
  .content {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 15px;
    img {
      width: 150px;
    }
    p {
      font-size: 16px;
      font-weight: bold;
    }
    .highlight {
      color: #ff6f61; // 생필품 글씨 색상 변경
      font-size: 16px;
      font-weight: bold; // 생필품 글씨 강조
    }
  }
  .bottom {
    height: 2rem;
    width: 100%;
    background-color: white;
    position: absolute;
    border-radius: 0 0 10px 10px;
    bottom: 0;
    color: #878787;
    font-size: 12px;
    font-family: "KBFGTextM";
    display: flex;
    justify-content: center;
    align-items: center;
  }
  button {
    background: inherit;
    border: none;
    box-shadow: none;
    border-radius: 0;
    padding: 0;
    overflow: visible;
    cursor: pointer;
  }
`;

function getYesterdayDate() {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  const month = yesterday.getMonth() + 1;
  const day = yesterday.getDate();
  return `${month}월 ${day}일 기준`;
}

function RecommendService({ navigate }) {
  return (
    <RecommendServiceContainer>
      <p>
        구독서비스 추천 <span>{getYesterdayDate()}</span>
      </p>
      <div className="content">
        <img src={bunnyKing} alt="kingOfSomething" />
        <p>지난 한 달 당신은 살림왕👑</p>
        <button
          className="bottom"
          onClick={() =>
            navigate("/subscription/recommend", { state: { defaultCategory: 1 } })
          }
        >
          지출 내역 기반으로 <span className="highlight">생필품</span> 구독 서비스를 추천해요! 
          <ArrowForwardIos fontSize="small" />
        </button>
      </div>
    </RecommendServiceContainer>
  );
}

export default RecommendService;