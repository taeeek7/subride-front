import Box from "@mui/material/Box";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";

function BackHeader(props) {
  const navigate = useNavigate();
  const location = useLocation();

  const pagebackClick = () => {
    const from = location.state?.from;
    if (from && from.startsWith("/subscription/service/")) {
      navigate("/");
    } else {
      navigate(-1);
    }
  };

  return (
    <Box
      sx={{
        position: "fixed", // 고정 위치로 설정
        top: 0, // 상단에 위치하도록 설정
        left: 0, // 왼쪽에 위치하도록 설정
        display: "flex",
        alignItems: "center",
        padding: "0.5rem 1rem", // 내부 여백 추가
        backgroundColor: "white", // 배경색 설정
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)", // 그림자 효과 추가
        zIndex: 100, // 다른 요소 위에 나타나도록 설정
        width: "100%", // 전체 너비를 차지하도록 설정
        height: "50px", 
      }}
    >
      <ArrowBackIosIcon onClick={pagebackClick} sx={{ mr: 1 }} />
      <div>{props.text}</div>
    </Box>
  );
}

export default BackHeader;