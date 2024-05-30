import styled from "@emotion/styled";
import { useNavigate } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import SubListItem from "pages/SubGroup/components/SubListItem";
import api from "utils/apiInstance";
import BackHeader from "components/BackHeader";
import Navigation from "components/Navigation";

const SubPage = styled.div`
  p {
    margin: 0;
    font-size: 20px;
    color: rgb(55, 53, 47);
  }
  ul {
    list-style: none;
    padding: 0;
  }
  .title {
    margin-top: 40px;
  }
  .buttonContainer {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 20px;
  }
  .joinButton {
    background-color: #4caf50;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  .description {
    margin-bottom: 10px;
    font-size: 15px;
  }
`;

function SubGroupCandidate({ user }) {
  const [serviceList, setServiceList] = useState([]);
  const navigate = useNavigate();

  function goMakeGroup(ele) {
    console.log(ele);
    navigate("/subgroup/makegroup", { state: ele });
  }

  const fetchMySub = useCallback(async () => {
    try {
      const { data } = await api.get("/subscriptions/sub-candidates", {
        params: { userId: user.id },
      });
      setServiceList(data);
    } catch (err) {
      console.log(err);
    }
  }, [user]);

  useEffect(() => {
    fetchMySub();
  }, [fetchMySub]);

  const handleJoinButtonClick = () => {
    navigate("/subgroup/joingroup");
  };

  return (
    <>
      <BackHeader text="Sub 타기" />
      <SubPage>
        <div className="title">
          <p>지인과 함께 구독료를 아껴보세요</p>
        </div>
        <div className="buttonContainer">
          <p className="description">
            구독서비스를 선택하여 썹 그룹을 만들거나 이미 있는 썹 그룹에
            참여하세요!
          </p>
          <button className="joinButton" onClick={handleJoinButtonClick}>
            썹 참여하기
          </button>
        </div>
        <ul>
          {serviceList.map((item) => (
            <SubListItem
              key={item.serviceId}
              serviceId={item.serviceId}
              serviceName={item.serviceName}
              logo={item.logo}
              handleClick={() => goMakeGroup(item)}
              description={"썹 만들기"}
            />
          ))}
        </ul>
      </SubPage>
      <Navigation />
    </>
  );
}

export default SubGroupCandidate;