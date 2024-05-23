import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    typography: {
      fontFamily: "KBFGTextB, KBFGDisplayB",
    },
    components: {
      MuiCssBaseline: {
        "*": {
          boxSizing: "border-box",
          margin: 0,
          padding: 0,
          fontFamily: "KBFGTextB",
        }
      },
  },
  // 색깔 수정 예정
  palette: {
    KByellow: {
      main: '#E3D026',
      light: '#E9DB5D',
      dark: '#A29415'
    },
  },
});

export default theme;
