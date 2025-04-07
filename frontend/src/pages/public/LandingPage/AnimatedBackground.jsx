import React from "react";
import Box from "@mui/material/Box";

/**
 * AnimatedGradientBackground Component
 *
 * This component renders a Box with an animated gradient background.
 * The background shifts continuously through a set of semi-transparent colors.
 * It is used to wrap its children components, giving them an appealing animated background.
 *
 * @param {object} props - Component props.
 * @param {React.ReactNode} props.children - Child components to render within the animated background.
 * @returns {JSX.Element} A Box component with an animated gradient background and contained children.
 */
const AnimatedGradientBackground = ({ children }) => {
  return (
    <Box
      sx={{
        width: "100%",
        // Apply infinite shifting gradient animation over 90 seconds with easing.
        animation: "gradientShift 90s ease infinite",
        // Define a linear gradient background with semi-transparent colors.
        background: `linear-gradient(
          -45deg,
          rgba(205, 231, 234, 0.5),
          rgba(210, 227, 242, 0.5),
          rgba(234, 245, 208, 0.5),
          rgba(247, 216, 220, 0.5)
        )`,
        // Set the background size to allow for a smooth gradient transition.
        backgroundSize: "400% 400%",
        // Configure layout: Center children both vertically and horizontally.
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        // Define the keyframes for the gradient shift animation.
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
