import React, { useState, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";

// MUI imports
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";

// Context
import { SnackbarContext } from "../../contexts/SnackbarContext";

const AuthPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { showSnackbar } = useContext(SnackbarContext);

  const mode = new URLSearchParams(location.search).get("mode");

  const isLogin = mode === "login";

  // Shared states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Register-only state
  const [name, setName] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8000/teachers/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("access_token", data.access);
        showSnackbar("Login successful!", "success");
        console.log("Token:", data.access);
        // navigate('/dashboard'); // if needed
      } else {
        showSnackbar(data.message || "Login failed", "error");
      }
    } catch (error) {
      console.error("Login error:", error);
      showSnackbar("Something went wrong", "error");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://127.0.0.1:8000/teachers/register/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        showSnackbar("Teacher registered successfully!", "success");
        console.log("Success:", data);
        // Optionally redirect to login or dashboard
      } else {
        showSnackbar(data.message || "Error registering teacher", "error");
      }
    } catch (error) {
      console.error("Register error:", error);
      showSnackbar("Something went wrong!", "error");
    }
  };

  const toggleModeUrl = () => {
    const newMode = isLogin ? "register" : "login";
    navigate(`?mode=${newMode}`);
  };

  return (
    <Container maxWidth="sm" sx={{ p: 12 }}>
      <Box
        component="form"
        noValidate
        onSubmit={isLogin ? handleLogin : handleRegister}
        sx={(theme) => ({
          padding: theme.spacing(4),
          marginTop: theme.spacing(4),
          bgcolor: theme.palette.background.paper,
          borderRadius: theme.shape.border,
          border: `1px solid ${theme.palette.primary.dark}`,
        })}
      >
        <Stack direction="column" spacing={1.5}>
          <Typography variant="h4" align="center" gutterBottom>
            {isLogin ? "Teacher Login Portal" : "Register Teacher"}
          </Typography>

          <Typography variant="subtitle1" align="center" color="text.secondary">
            {isLogin ? (
              <>
                Don't have an account?{" "}
                <Link color="primary" onClick={toggleModeUrl} sx={{ cursor: "pointer" }}>
                  Sign Up
                </Link>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <Link color="primary" onClick={toggleModeUrl} sx={{ cursor: "pointer" }}>
                  Login
                </Link>
              </>
            )}
          </Typography>

          {!isLogin && (
            <TextField
              fullWidth
              label="Name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              variant="outlined"
            />
          )}

          <TextField
            fullWidth
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            variant="outlined"
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            variant="outlined"
          />
          <Button fullWidth type="submit" variant="contained" color="primary">
            {isLogin ? "Login" : "Register"}
          </Button>
        </Stack>
      </Box>
    </Container>
  );
};

export default AuthPage;
