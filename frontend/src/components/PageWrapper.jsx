import Container from "@mui/material/Container";

const PageWrapper = ({ children }) => {
  return (
    <Container
      maxWidth="lg"
      sx={(theme) => ({
        display: "flex",
        flexDirection: "column",
        height: "100%",
        width: "100%",
        m: 2,
        background: theme.palette.background.paper,
        borderRadius: theme.shape.borderRadius,
      })}
    >
      {children}
    </Container>
  );
};
export default PageWrapper;
