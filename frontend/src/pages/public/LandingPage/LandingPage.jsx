import React from "react";
import { useNavigate } from "react-router-dom";

// Components
import TypewriterEffect from "./TypewriterEffect";
import AnimatedGradientBackground from "./AnimatedBackground";

// Images
import Logo from "/images/logo.png";

// MUI
import { Box, Button, Container, Typography, Stack } from "@mui/material";

const LandingPage = () => {
  const navigate = useNavigate();

  const handleLogin = () => navigate("/auth?mode=login");
  const handleRegister = () => navigate("/auth?mode=register");

  return (
    <AnimatedGradientBackground>
      <Container maxWidth="lg" sx={{ minHeight: "100%" }}>
        {/* MENUBAR */}
        <Box sx={{ my: 6 }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            verticalAlign="middle"
          >
            {/* Left Side */}
            <Box display="flex" alignItems="center" gap={1}>
              <img src={Logo} alt="Logo" style={{ height: 24 }} />
              <Typography variant="h6" fontWeight="bold" color="primary">
                Vellum
              </Typography>
            </Box>

            {/* Right Side */}
            <Stack direction="row" spacing={2}>
              <Button onClick={handleLogin} color="primary">
                Log in
              </Button>
              <Button variant="contained" onClick={handleRegister}>
                Get Access ↗
              </Button>
            </Stack>
          </Stack>
        </Box>

        <Box sx={{ my: 24 }}>
          {/* Typewriter + Hero Text */}
          <Box textAlign="center" my={4}>
            <TypewriterEffect />
          </Box>

          <Box textAlign="center">
            <Typography
              variant="h5"
              fontWeight="bold"
              color="primary"
              gutterBottom
            >
              AI-Powered. Adviser-Controlled.
            </Typography>
          </Box>
        </Box>
      </Container>
    </AnimatedGradientBackground>
  );
};

export default LandingPage;
