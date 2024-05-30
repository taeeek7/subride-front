import React, { useState } from "react";
import {
  TextField,
  Button,
  FormControl,
  Autocomplete,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "utils/apiInstance"; // apiInstance 임포트

const generateRandomAccountNumber = () => {
  const bankCode = Math.floor(Math.random() * (999 - 100 + 1)) + 100;
  const branchCode = Math.floor(Math.random() * (99 - 10 + 1)) + 10;
  const accountNumberPart =
    Math.floor(Math.random() * (9999999 - 1000000 + 1)) + 1000000;

  return `${bankCode}-${branchCode}-${accountNumberPart}`;
};

const bankOptions = [
  { label: "KB" },
  { label: "신한은행" },
  { label: "하나은행" },
  { label: "우리은행" },
  { label: "NH은행" },
];

const Signup = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [userName, setUserName] = useState("");
  const [bankName, setBankName] = useState("KB");
  const [bankAccount, setBankAccount] = useState(generateRandomAccountNumber());
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    // 필드 값 유효성 검사
    if (!userId) {
      newErrors.userId = "사용자 ID를 입력해주세요.";
    }
    if (!password) {
      newErrors.password = "암호를 입력해주세요.";
    } else if (
      !/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/.test(
        password
      )
    ) {
      newErrors.password =
        "암호는 영어, 숫자, 특수문자를 포함한 8자 이상이어야 합니다.";
    }
    if (!confirmPassword) {
      newErrors.confirmPassword = "암호 확인을 입력해주세요.";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "암호와 암호 확인이 일치하지 않습니다.";
    }
    if (!userName) {
      newErrors.userName = "닉네임을 입력해주세요.";
    }
    if (!bankName) {
      newErrors.bankName = "은행명을 선택해주세요.";
    }
    if (!bankAccount) {
      newErrors.bankAccount = "계좌번호를 입력해주세요.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const { data:result } = await api("member").post("/auth/signup", {
        // apiInstance 사용
        userId: userId,
        password: password,
        roles: ["USER"],
        userName,
        bankName,
        bankAccount,
      });

     // console.log(result);
      toast.success(result.response, {
        position: "top-center",
        autoClose: 300,
        onClose: () => navigate('/login'),
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
      });
    } catch (error) {
      
      toast.error(error.response.data.message, {
        position: "top-center",
        autoClose: 300,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
      });
    }
  };

  const handleCancel = () => {
    navigate("/login");
  };

  const handleFocus = (field) => {
    setErrors((prevErrors) => ({ ...prevErrors, [field]: "" }));
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleClickShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <div>
      <h2>회원가입</h2>
      <form onSubmit={handleSubmit}>
        <TextField
          label="사용자 ID"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          error={!!errors.userId}
          helperText={errors.userId}
          fullWidth
          margin="normal"
          onFocus={() => handleFocus("userId")}
        />
        <TextField
          label="암호"
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={!!errors.password}
          helperText={errors.password}
          fullWidth
          margin="normal"
          onFocus={() => handleFocus("password")}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                >
                  {showPassword ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <TextField
          label="암호 확인"
          type={showConfirmPassword ? "text" : "password"}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          error={!!errors.confirmPassword}
          helperText={errors.confirmPassword}
          fullWidth
          margin="normal"
          onFocus={() => handleFocus("confirmPassword")}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={handleClickShowConfirmPassword}
                  onMouseDown={handleMouseDownPassword}
                >
                  {showConfirmPassword ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <TextField
          label="닉네임"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          error={!!errors.userName}
          helperText={errors.userName}
          fullWidth
          margin="normal"
          onFocus={() => handleFocus("userName")}
        />
        <FormControl fullWidth margin="normal">
          <Autocomplete
            options={bankOptions}
            getOptionLabel={(option) => option.label}
            value={
              bankOptions.find((option) => option.label === bankName) || null
            }
            onChange={(event, newValue) =>
              setBankName(newValue ? newValue.label : "")
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label="은행명"
                error={!!errors.bankName}
                helperText={errors.bankName}
                onFocus={() => handleFocus("bankName")}
              />
            )}
          />
        </FormControl>
        <TextField
          label="계좌번호"
          value={bankAccount}
          onChange={(e) => setBankAccount(e.target.value)}
          error={!!errors.bankAccount}
          helperText={errors.bankAccount}
          fullWidth
          margin="normal"
          onFocus={() => handleFocus("bankAccount")}
        />
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "16px",
          }}
        >
          <Button variant="contained" type="submit">
            가입하기
          </Button>
          <Button variant="outlined" onClick={handleCancel}>
            취소
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Signup;
