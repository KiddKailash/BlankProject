import React, { useState, useEffect } from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

const words = ["Write SOAs", "Work Smarter", "Vellum" ];

const TypewriterEffect = () => {
  const [displayedText, setDisplayedText] = useState("");
  const [wordIndex, setWordIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isBlinking, setIsBlinking] = useState(true);

  const currentWord = words[wordIndex];

  useEffect(() => {
    let typingSpeed = isDeleting ? 50 : 150;

    const typeTimeout = setTimeout(() => {
      if (isDeleting) {
        setDisplayedText(currentWord.substring(0, charIndex - 1));
        setCharIndex((prev) => prev - 1);
      } else {
        setDisplayedText(currentWord.substring(0, charIndex + 1));
        setCharIndex((prev) => prev + 1);
      }

      // Finished typing the word
      if (!isDeleting && charIndex === currentWord.length) {
        setTimeout(() => setIsDeleting(true), 2700);
      }

      // Finished deleting the word
      if (isDeleting && charIndex === 0) {
        setIsDeleting(false);
        setWordIndex((prev) => (prev + 1) % words.length);
      }
    }, typingSpeed);

    return () => clearTimeout(typeTimeout);
  }, [charIndex, isDeleting, currentWord]);

  // Blinking cursor toggle
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setIsBlinking((prev) => !prev);
    }, 700);
    return () => clearInterval(blinkInterval);
  }, []);

  return (
    <Box display="flex" justifyContent="center" alignItems="center">
      <Typography component="span" sx={{ typography: { xs: 'h2', sm: 'h1' } }} color="primary">
        {displayedText}
        <Box
          sx={{
            display: "inline-block",
            color: "primary.main",
            visibility: isBlinking ? "visible" : "hidden",
          }}
        >
        |
        </Box>
      </Typography>
    </Box>
  );
};

export default TypewriterEffect;
