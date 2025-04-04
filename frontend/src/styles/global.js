import { createTheme } from "@mui/material/styles";

export const getTheme = (mode = "light") => {
  const basePalette = {
    primary: {
      main: "#0A3F44", // Do not change
      dark: "#062f2f", // Even deeper teal-black tone
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#9AC02C", // Light green
      dark: "#78ba00", // Rich grassy green
      light: "#c6df8c", // Pale lime
      contrastText: "#0A3F44",
    },
    link: {
      main: "#13578b", // QG Blue Dark
      visited: "#8800BB",
    },
    info: {
      main: "#1E77AA",
      dark: "#125b84",
      light: "#5da2ce",
      contrastText: "#ffffff",
    },
    success: {
      main: "#9EBF6D",
      dark: "#6e8b48",
      light: "#cbe3a4",
      contrastText: "#0A3F44",
    },
    warning: {
      main: "#F9AF71",
      dark: "#d9883f",
      light: "#fdd3b0",
      contrastText: "#3a1e00",
    },
    error: {
      main: "#B90824",
      dark: "#8f061c",
      light: "#e9526d",
      contrastText: "#ffffff",
    },
    neutral: {
      main: "#586368",
      light: "#A0AEB3",
      dark: "#323b40",
      contrastText: "#ffffff",
    },
  };

  const themeOptions = {
    palette: {
      mode,
      ...basePalette,
      background: mode === "light"
        ? {
            paper: "#ffffff", // clean white surface
            default: "#f4f7f8", // soft neutral grey
          }
        : {
            paper: "#1c262b",
            default: "#12191d",
          },
      text: mode === "light"
        ? {
            primary: "#212529",
            secondary: "#585e62",
            disabled: "#A0AEB3",
          }
        : {
            primary: "#EFF2F4",
            secondary: "#B0BEC5",
            disabled: "#718792",
          },
    },
    typography: {
      h4: {
        fontWeight: 600,
      },
    },
    shape: {
      border: 3,
    },
  };

  return createTheme(themeOptions);
};
