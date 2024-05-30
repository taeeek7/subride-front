// components/GroupInfo.js
import styled from "@emotion/styled";
import { useCallback } from "react";

const ImgContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100dvw;
  height: 396px;
  background-color: #fed337;
  position: absolute;
  left: 0px;
  padding: 30px;

  .servicelogoImg {
    width: 100px;
    height: 100px;
    display: block;
    margin: 2px auto;
    position: absolute;
    bottom: 30px;
    top: 22px;
  }

  .informContainer {
    margin-top: 120px;
    background-color: #ffffff;
    width: 323px;
    height: 160px;
    border-radius: 15px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 10px;
  }

  .groupName {
    font-size: 20px;
    font-weight: bold;
    margin-top: 10px;
    font-family: "KBFGTextM";
    text-align: center;
    max-width: 80%; /* 또는 원하는 최대 너비 값 */
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .serviceName {
    font-size: 14px;
    font-weight: normal;
    font-family: "KBFGTextM";
    text-align: center;
  }

  .serviceDescription {
    font-size: 14px;
    margin-top: 5px;
    font-family: "KBFGTextM";
    text-align: center;
  }

  .characerNameImgContainer {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .characterImgContainter {
    display: flex;
    margin-top: 10px;
    justify-content: center;
    align-items: center;
  }

  .characterImg {
    width: 73px;
    height: 73px;
    margin: 2px auto;
  }

  .characterName {
    margin-top: 5px;
    color: #6f6a6a;
    font-size: 12px;
  }

  .placeholderCharacterImg {
    width: 73px;
    height: 73px;
    margin: 2px auto;
    filter: grayscale(100%);
    opacity: 0.5;
  }
`;

const GroupInfo = ({ groupData }) => {
    const calculateFee = useCallback((fee, usersLength) => {
      return Math.ceil(fee / usersLength).toLocaleString("ko-KR");
    }, []);
  
    const renderPlaceholderMembers = () => {
      const placeholderCount = groupData.maxShareNum - groupData.members.length;
      const placeholderMembers = [];
  
      for (let i = 0; i < placeholderCount; i++) {
        placeholderMembers.push(
          <div className="characerNameImgContainer" key={`placeholder-${i}`}>
            <img
              className="placeholderCharacterImg"
              src="/profile/1.png"
              alt="가상 멤버"
            />
          </div>
        );
      }
  
      return placeholderMembers;
    };
  
    return (
      <ImgContainer>
        <div>
          <div className="informContainer">
            <img
              className="servicelogoImg"
              src={`/service/${groupData.logo}`}
              alt="로고1"
            />
            <div className="groupName">
              {groupData.groupName}
            </div>
            <div className="serviceName">
              {groupData.subName}
            </div>
            <div className="serviceDescription">
              {groupData.description}
            </div>
            <div
              style={{
                marginTop: "10px",
                fontSize: "17px",
                fontFamily: "KBFGTextM",
              }}
            >
              매달 {groupData.paymentDay}일{" "}
              {calculateFee(
                groupData.fee,
                groupData.members.length
              )}
              원 결제돼요
            </div>
          </div>
        </div>
  
        <div className="characterImgContainter">
          {groupData.members.map((item) => (
            <div className="characerNameImgContainer" key={item.userId}>
              <img
                className="characterImg"
                src={`/profile/${item.characterId}.png`}
                alt="캐릭터1"
              />
              <div className="characterName">{item.userName}</div>
            </div>
          ))}
          {renderPlaceholderMembers()}
        </div>
      </ImgContainer>
    );
  };
  
  export default GroupInfo;
  