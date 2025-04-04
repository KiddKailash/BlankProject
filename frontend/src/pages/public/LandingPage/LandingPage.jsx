import React from "react";
import { useNavigate } from "react-router-dom";

// Components
import TypewriterEffect from "./TypewriterEffect";
import AnimatedGradientBackground from "./AnimatedBackground";

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
          >
            {/* Left Side */}
            <Typography variant="h6" fontWeight="bold" color="primary">
              Vellum
            </Typography>

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

        <Box sx={{my: 24}}>
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
