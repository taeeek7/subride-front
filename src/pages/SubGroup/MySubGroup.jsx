import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import styled from "@emotion/styled";
import { Button } from "@mui/material";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import KeyIcon from "@mui/icons-material/Key";
import api from "utils/apiInstance";
import Navigation from "components/Navigation";
import BackHeader from "components/BackHeader";
import SubListItem from "pages/SubGroup/components/SubListItem";

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
    margin-top: 0px;
  }
  .empty-message {
    text-align: center;
    margin-top: 20px;
  }
`;

const ModalContent = styled.div`
  text-align: center;
  p {
    margin: 3%;
    font-size: 15px;
  }
  .button-box {
    display: flex;
    padding: 3%;
  }
`;

function MySubGroup({ user }) {
  const navigate = useNavigate();
  const [subGroupList, setSubGroupList] = useState([]);

  const getSubGroupList = useCallback(async (userId) => {
    try {
      const { data } = await api("mygrp").get("/my-groups", {
        params: { userId },
      });
      return data.response;
    } catch (err) {
      return err;
    }
  }, []);

  useEffect(() => {
    getSubGroupList(user.id).then((result) => {
      setSubGroupList(result);
    });
  }, [user.id, getSubGroupList]);

  const handleGroupDetail = (groupId) => {
    navigate("/subgroup/groupdetail", { state: { groupId: groupId } });
  };

  return (
    <>
      <BackHeader text="Sub" />
      <SubPage>
        <div className="title">
          <p style={{ color: "rgb(248, 168, 9)" }}>
            My <span style={{ color: "#4A483F" }}>그룹</span>
          </p>
        </div>
        <ModalContent>
          <div className="button-box">
            <Button sx={{ width: "100%", color: "#4A4646" }} onClick={() => navigate("/subgroup/makegroup")}>
              <GroupAddIcon />썹 만들기
            </Button>
            <Button sx={{ width: "100%", color: "#4A4646" }} onClick={() => navigate("/subgroup/joingroup")}>
              <KeyIcon sx={{ marginRight: "10px" }} />썹 참여하기
            </Button>
          </div>
        </ModalContent>
        {subGroupList && (
          subGroupList.length === 0 ? (
            <p className="empty-message">타고 있는 썹이 없어요.</p>
          ) : (
            <ul>
              {subGroupList.map((item) => (
                <SubListItem
                  key={item.groupId}
                  serviceName={item.groupName}
                  logo={item.logo}
                  handleClick={() => handleGroupDetail(item.groupId)}
                  description={`썹타서 ${item.fee - item.fee / item.memberCount.toLocaleString("ko-KR")}원 아끼는 중`}
                />
              ))}
            </ul>
          )
        )}
      </SubPage>
      <Navigation />
    </>
  );
}

export default MySubGroup;