import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import { useCallback, useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { useLocation } from "react-router";
import CommonButton from "components/CommonButton";
import BackHeader from "components/BackHeader";
import api from "utils/apiInstance";

const payDateOptions = Array.from({ length: 31 }, (_, i) => i + 1);
const koreanRegex = /[ㄱ-ㅎㅏ-ㅣ가-힣]/g;
const nonKoreanRegex = /[^ㄱ-ㅎㅏ-ㅣ가-힣a-zA-Z0-9\s]/g;
const maxSubLength = 40;

function MakeGroup({ user }) {
  const { state } = useLocation(); //-- '/sub'에서 넘어온 경우 구독객체 받기
  const isFixedService = state && state.subId ? true : false;
  const [groupName, setGroupName] = useState("");
  const [selectedService, setSelectedService] = useState(state || null);
  const [representativeAccount, setRepresentativeAccount] = useState(
    user.bankAccount
  );
  const [payDate, setPayDate] = useState(1);

  const [groupNameError, setGroupNameError] = useState(false);
  const [serviceError, setServiceError] = useState(false);
  const [accountError, setAccountError] = useState(false);

  const navigate = useNavigate();
  const [serviceOptions, setServiceOptions] = useState([]);

  const groupNameInputRef = useRef(null);

  const fetchServices = useCallback(async () => {
    try {
      if (!isFixedService) {
        const { data } = await api("mysub").get("/my-subs/not-join-group", {
          params: { userId: user.id },
        });
        setServiceOptions(data.response);
      }
    } catch (err) {
      console.error(err);
    }
  }, [user, isFixedService]);

  useEffect(() => {
    fetchServices();

    if (groupNameInputRef.current) {
      groupNameInputRef.current.focus();
    }
  }, [fetchServices]);

  const createGroup = () => {
    const isValid = validateInputs();
    if (isValid) {
      const groupData = {
        groupName,
        subId: selectedService?.subId,
        leaderId: user.id,
        bankName: representativeAccount.split(':')[0].trim(),
        bankAccount: representativeAccount.split(':')[1].trim(),
        paymentDay: payDate,
      };

      api("mygrp")
        .post("/my-groups", groupData)
        .then((response) => {
          //window.localStorage.setItem("invitationCode", response.data.invitationCode);
          navigate("/subgroup/success-room", {
            state: { inviteCode: response.data.response },
          });
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  const validateInputs = () => {
    let isValid = true;

    if (!groupName || nonKoreanRegex.test(groupName)) {
      setGroupNameError(true);
      isValid = false;
    } else {
      setGroupNameError(false);
    }

    if (!selectedService) {
      setServiceError(true);
      isValid = false;
    } else {
      setServiceError(false);
    }

    if (!representativeAccount) {
      setAccountError(true);
      isValid = false;
    } else {
      setAccountError(false);
    }

    return isValid;
  };

  const handleInputFocus = () => {
    setGroupNameError(false);
    setServiceError(false);
    setAccountError(false);
  };

  const handleGroupNameChange = (event) => {
    const value = event.target.value;
    const koreanLength = (value.match(koreanRegex) || []).length;
    const nonKoreanLength = value.length - koreanLength;

    if (koreanLength + nonKoreanLength <= maxSubLength) {
      setGroupName(value);
    }
  };

  const getGroupNameLength = () => {
    const koreanLength = (groupName.match(koreanRegex) || []).length;
    const nonKoreanLength = groupName.length - koreanLength;
    return koreanLength * 2 + nonKoreanLength;
  };

  return (
    <>
      <BackHeader text="썹 만들기" />

      <Box
        sx={{
          width: "100%",
          flexDirection: "column",
          justifyContent: "center",
          marginTop: "60px",
          marginBottom: "80px",
          paddingLeft: "20px",
          paddingRight: "20px",
        }}
      >
        <Stack spacing={4}>
          <TextField
            id="groupName"
            label="썹 그룹 이름"
            variant="standard"
            value={groupName}
            onChange={handleGroupNameChange}
            onFocus={handleInputFocus}
            error={groupNameError}
            helperText={
              groupNameError
                ? "한글, 영문, 숫자만 입력해주세요."
                : `${getGroupNameLength()}/${maxSubLength}`
            }
            inputRef={groupNameInputRef}
          />

          <Autocomplete
            value={selectedService}
            onChange={(_, newValue) => setSelectedService(newValue)}
            options={isFixedService ? [selectedService] : serviceOptions}
            disabled={isFixedService}
            disableClearable
            renderOption={(props, option) => (
              <Box {...props}>
                <img
                  loading="lazy"
                  width="20"
                  src={`/service/${option.logo}`}
                  alt="서비스 로고"
                  style={{ marginRight: "10px" }}
                />
                <div>
                  {option.subName} {option.fee.toLocaleString("ko-KR")}원
                </div>
              </Box>
            )}
            renderInput={(params) => (
              <TextField
                {...params}
                label="구독서비스 선택하기"
                variant="standard"
                onFocus={handleInputFocus}
                error={serviceError}
                helperText={serviceError ? "구독 서비스를 선택해주세요." : ""}
              />
            )}
            getOptionLabel={(option) => option.subName}
            isOptionEqualToValue={(option, value) =>
              option.subId === value.subId
            }
          />

          <FormControl variant="standard" error={accountError}>
            <InputLabel id="representative-account-label">
              대표계좌 선택하기
            </InputLabel>
            <Select
              labelId="representative-account-label"
              id="representative-account-select"
              value={representativeAccount}
              onChange={(e) => setRepresentativeAccount(e.target.value)}
              label="대표계좌 선택하기"
              onFocus={handleInputFocus}
            >
              <MenuItem value={user.bankName+":"+user.bankAccount}>
                {user.bankName+":"+user.bankAccount}
              </MenuItem>
            </Select>
            {accountError && (
              <span style={{ color: "red", fontSize: "0.75rem" }}>
                대표계좌를 선택해주세요.
              </span>
            )}
          </FormControl>

          <FormControl variant="standard">
            <InputLabel id="pay-date-label">결제일</InputLabel>
            <Select
              labelId="pay-date-label"
              id="pay-date-select"
              value={payDate}
              onChange={(e) => setPayDate(e.target.value)}
              label="결제일"
            >
              {payDateOptions.map((date) => (
                <MenuItem key={date} value={date}>
                  {date}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>
      </Box>
      <CommonButton text="썹 만들기" handleClick={createGroup} />
      
    </>
  );
}

export default MakeGroup;
