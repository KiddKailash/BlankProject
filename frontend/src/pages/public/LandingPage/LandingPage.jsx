import React from "react";
import { useNavigate } from "react-router-dom";

// Components
import TypewriterEffect from "./TypewriterEffect";
import AnimatedGradientBackground from "./AnimatedBackground";

// Images
import Logo from "/images/logo.png";

// MUI Components
import { Box, Button, Container, Typography, Stack } from "@mui/material";

/**
 * LandingPage Component
 *
 * This component renders the landing page with an animated gradient background.
 * It includes a navigation bar with logo and authentication buttons, a hero section with
 * a typewriter text effect, and a subheading.
 *
 * Navigation is handled using React Router's useNavigate hook.
 *
 * @component
 * @returns {JSX.Element} The landing page component.
 */
const LandingPage = () => {
  const navigate = useNavigate();

  /**
   * Navigates to the authentication page in "login" mode.
   */
  const handleLogin = () => navigate("/auth?mode=login");

  /**
   * Navigates to the authentication page in "register" mode.
   */
  const handleRegister = () => navigate("/auth?mode=register");

  return (
    // Wraps the landing page content with an animated gradient background.
    <AnimatedGradientBackground>
      <Container maxWidth="lg" sx={{ minHeight: "100%" }}>
        {/* Navigation Bar */}
        <Box sx={{ my: 6 }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            {/* Left Side: Logo and Brand Name */}
            <Box display="flex" alignItems="center" gap={1}>
              <img src={Logo} alt="Logo" style={{ height: 24 }} />
              <Typography variant="h6" fontWeight="bold" color="primary">
                Vellum
              </Typography>
            </Box>

            {/* Right Side: Login and Registration Buttons */}
            <Stack direction="row" spacing={1.5}>
              <Button onClick={handleLogin} color="primary">
                Log in
              </Button>
              <Button variant="contained" onClick={handleRegister}>
                Get Access
              </Button>
            </Stack>
          </Stack>
        </Box>

        {/* Hero Section */}
        <Box sx={{ my: 24 }}>
          {/* Typewriter effect paired with hero text */}
          <Box textAlign="center" my={4}>
            <TypewriterEffect />
          </Box>

          {/* Subtitle or tagline */}
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
