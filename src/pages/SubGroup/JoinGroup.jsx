import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "@emotion/styled";
import { toast } from "react-toastify";
import comeGroupImg from "assets/comeGroup.png";
import CommonButton from "components/CommonButton";
import api from "utils/apiInstance";
import BackHeader from "components/BackHeader";

const ImgAndTextContainer = styled.div`
  margin: 100px 40px 20px 30px;
  display: flex;
  flex-direction: column;
  .welcome-text {
    font-size: 30px;
    color: #f2dc14;
    margin-bottom: 10px;
  }
  .detail-text {
    margin-bottom: 4px;
    font-size: 20px;
    color: #999999;
  }
  img {
    display: block;
    margin: 40px auto;
  }
`;

const PasswordContainer = styled.div`
  margin: 20px 30px;
  display: flex;
  flex-direction: column;
  .password-text {
    font-size: 17px;
    margin-bottom: 10px;
  }
  .input-box {
    margin-bottom: 10px;
    width: 100%;
    font-size: 20px;
    color: #999999;
    border: none;
    border-bottom: solid 2px #f2dc14;
    outline: none;
  }
`;

function JoinGroup() {
  const [isJoining, setIsJoining] = useState(false);
  const navigate = useNavigate();
  const passwordInputRef = useRef(null);

  useEffect(() => {
    passwordInputRef.current.focus();
  }, []);

  const handleJoinGroup = async () => {
    const userData = JSON.parse(window.sessionStorage.getItem("user"));
    const password = document.getElementById("비밀번호").value;

    if (!password) {
      toast.error("초대코드를 입력하세요", {
        position: "top-center",
        autoClose: 500,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        onClose: () => {
          const ps = passwordInputRef.current;
          ps.focus();
          ps.select(); // 전체 선택
        },
      });
      return;
    }

    setIsJoining(true);
    const lastData = {
      userId: userData.id,
      inviteCode: password,
    };

    try {
      const { data } =  await api("mygrp").post("/my-groups/join", lastData);
      if(data.code === 200) {
        toast.success("가입 되었습니다.", {
          position: "top-center",
          autoClose: 500,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          onClose: () => navigate("/"),
        });
      } 
    } catch (err) {
      toast.error(err.response.data.message, {
        position: "top-center",
        autoClose: 500,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        onClose: () => {
          const ps = passwordInputRef.current;
          ps.focus();
          ps.select(); // 전체 선택
        },
      });
      setIsJoining(false);
      const ps = document.getElementById("비밀번호");
      ps.value = null;
    }
  };

  return (
    <>
      <BackHeader text="썹 참여하기" />
      <ImgAndTextContainer>
        <div className="welcome-text">환영합니다</div>
        <div className="detail-text">초대코드를 입력하고,</div>
        <div className="detail-text">새로운 썹을 타보세요</div>
        <img src={comeGroupImg} alt="곰돌이" />
      </ImgAndTextContainer>
      <PasswordContainer>
        <div className="password-text">초대코드</div>
        <input className="input-box" id="비밀번호" ref={passwordInputRef} />
        <CommonButton
          text={isJoining ? "참여중..." : "참여하기"}
          handleClick={handleJoinGroup}
          disabled={isJoining}
        />
      </PasswordContainer>
    </>
  );
}

export default JoinGroup;