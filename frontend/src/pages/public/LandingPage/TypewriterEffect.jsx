import React, { useState, useEffect } from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

// List of words to display in the typewriter effect.
const words = ["Write SOAs", "Work Smarter", "Vellum"];

/**
 * TypewriterEffect Component
 *
 * Renders a typewriter effect that cycles through an array of words.
 * It types out each word character-by-character, pauses, then deletes them,
 * before moving on to the next word. A blinking cursor is also displayed.
 *
 * @component
 * @returns {JSX.Element} The rendered typewriter effect component.
 */
const TypewriterEffect = () => {
  // Local state for the current text to display.
  const [displayedText, setDisplayedText] = useState("");
  // Index of the current word in the words array.
  const [wordIndex, setWordIndex] = useState(0);
  // Index of the current character in the current word.
  const [charIndex, setCharIndex] = useState(0);
  // Flag indicating whether the component is currently deleting text.
  const [isDeleting, setIsDeleting] = useState(false);
  // Flag for controlling the blinking cursor's visibility.
  const [isBlinking, setIsBlinking] = useState(true);

  // Get the current word based on the wordIndex.
  const currentWord = words[wordIndex];

  useEffect(() => {
    // Determine the typing speed: faster when deleting.
    let typingSpeed = isDeleting ? 50 : 150;

    // Set up a timeout to update the displayed text.
    const typeTimeout = setTimeout(() => {
      if (isDeleting) {
        // Remove one character when deleting.
        setDisplayedText(currentWord.substring(0, charIndex - 1));
        setCharIndex((prev) => prev - 1);
      } else {
        // Add one character when typing.
        setDisplayedText(currentWord.substring(0, charIndex + 1));
        setCharIndex((prev) => prev + 1);
      }

      // When finished typing the word, start the deletion after a pause.
      if (!isDeleting && charIndex === currentWord.length) {
        setTimeout(() => setIsDeleting(true), 2700);
      }

      // When finished deleting, reset deletion and move to the next word.
      if (isDeleting && charIndex === 0) {
        setIsDeleting(false);
        // Cycle through the words array.
        setWordIndex((prev) => (prev + 1) % words.length);
      }
    }, typingSpeed);

    // Cleanup the timeout on effect re-run.
    return () => clearTimeout(typeTimeout);
  }, [charIndex, isDeleting, currentWord]);

  useEffect(() => {
    // Blink cursor effect: toggle the blinking state every 700 ms.
    const blinkInterval = setInterval(() => {
      setIsBlinking((prev) => !prev);
    }, 700);
    // Cleanup the interval when the component unmounts.
    return () => clearInterval(blinkInterval);
  }, []);

  return (
    <Box display="flex" justifyContent="center" alignItems="center">
      <Typography
        component="span"
        sx={{ typography: { xs: "h2", sm: "h1" } }}
        color="primary"
      >
        {displayedText}
        <Box
          component="span"
          sx={{
            display: "inline-block",
            color: "primary.main",
            // Toggle the cursor visibility based on isBlinking.
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
