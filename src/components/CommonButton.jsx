import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";

const BootstrapButton = styled(Button)({
  width: "100%",
  height: "60px",
  boxShadow: "none",
  textTransform: "none",
  // margin: "20px",
  fontSize: 20,
  backgroundColor: "#FFCC00",
  color: "#000000",
  borderRadius: 15,

  // position: "absolute",
  // bottom: "0px",

  "&:hover": {
    backgroundColor: "#FFCC00",
    boxShadow: "none",
  },
});

function CommonButton({ text, handleClick }) {
  return (
    <>
      <BootstrapButton variant="contained" onClick={handleClick}>
        {text}
      </BootstrapButton>
    </>
  );
}

export default CommonButton;
