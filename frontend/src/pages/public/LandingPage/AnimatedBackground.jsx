import React from "react";
import Box from "@mui/material/Box";

const AnimatedGradientBackground = ({ children }) => {
  return (
    <Box
      sx={{
        width: "100%",
        animation: "gradientShift 90s ease infinite",
        background: `linear-gradient(
          -45deg,
          rgba(205, 231, 234, 0.5),
          rgba(210, 227, 242, 0.5),
          rgba(234, 245, 208, 0.5),
          rgba(247, 216, 220, 0.5)
        )`,
        backgroundSize: "400% 400%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        "@keyframes gradientShift": {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
      }}
    >
      {children}
    </Box>
  );
};

export default AnimatedGradientBackground;
