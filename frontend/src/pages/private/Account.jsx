import React from "react";
import PageWrapper from "../../components/PageWrapper";
import UserContext from "../../services/UserContext";

// MUI
import Typography from "@mui/material/Typography";

const Account = () => {
  const { user } = React.useContext(UserContext);

  return (
    <PageWrapper>
      <Typography variant="h1">{user ? user.name : "Account"}</Typography>
    </PageWrapper>
  );
};

export default Account;
