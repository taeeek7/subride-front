import { useState, useRef } from "react";
import { TextField, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "utils/apiInstance";
import { jwtDecode } from "jwt-decode";

const login = async (userId, password) => {
  try {
    const { data } = await api("member").post("/auth/login", { userId, password });
    return data;
  } catch (err) {
    return err;
  }
};

function Login({ handleAfterLogin }) {
  const navigate = useNavigate();
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [userIdError, setUserIdError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const passwordRef = useRef(null);

  const handleUserIdChange = (event) => {
    setUserId(event.target.value);
    setUserIdError("");
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
    setPasswordError("");
  };

  const handleLogin = () => {
    if (!userId) {
      setUserIdError("사용자ID를 입력하세요");
      return;
    }
    if (!password) {
      setPasswordError("암호를 입력하세요");
      return;
    }

    login(userId, password).then((result) => {
      //console.log(result);
      if (result.code === 200) {
        sessionStorage.setItem("accessToken", result.response.accessToken);
        sessionStorage.setItem("refreshToken", result.response.refreshToken);
        
        const decodedToken = jwtDecode(result.response.accessToken);
        const user = {
          id: decodedToken.sub, 
          userId: decodedToken.sub,
          userName: decodedToken.userName,
          bankName: decodedToken.bankName,
          bankAccount: decodedToken.bankAccount,
          profileImg: decodedToken.characterId,
        }
        
        handleAfterLogin(user);
      } else {
        toast.error("사용자 이름 또는 암호를 확인 후 다시 시도 하세요", {
          position: "top-center",
          autoClose: 300,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: false,
        });
      }
    });
  };

  const handleSignUp = () => {
    navigate("/signup");
  };

  const handleUserIdKeyDown = (event) => {
    if (event.key === "Enter") {
      passwordRef.current.focus();
    }
  };

  const handlePasswordKeyDown = (event) => {
    if (event.key === "Enter") {
      handleLogin();
    }
  };

  return (
    <>
      <div style={{ paddingTop: "100px", paddingBottom: "50px", textAlign: "center" }}>
        <img style={{ height: "200px", objectFit: "cover" }} src="/logo/로고1.png" alt="로고" />
      </div>
      <p style={{ fontSize: "20px", marginBottom: "10px" }}>ID와 암호를 입력하세요.</p>
      <p style={{ fontSize: "14px", marginBottom: "30px" }}>처음이신 분은 ID와 암호 입력 후 [Sign Up]을 누르세요</p>
      <TextField
        id="userId"
        label="사용자ID"
        variant="standard"
        type="text"
        value={userId}
        onChange={handleUserIdChange}
        onKeyDown={handleUserIdKeyDown}
        fullWidth
        margin="normal"
        error={!!userIdError}
        helperText={userIdError}
      />
      <TextField
        id="password"
        label="사용자 암호"
        variant="standard"
        type="password"
        value={password}
        onChange={handlePasswordChange}
        onKeyDown={handlePasswordKeyDown}
        fullWidth
        margin="normal"
        error={!!passwordError}
        helperText={passwordError}
        inputRef={passwordRef}
      />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Button variant="contained" onClick={handleLogin}>
          Login
        </Button>
        <Button variant="outlined" onClick={handleSignUp}>
          Sign Up
        </Button>
      </div>
    </>
  );
}

export default Login;