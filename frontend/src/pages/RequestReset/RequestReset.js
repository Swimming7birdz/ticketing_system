import React from 'react';
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import MuiCard from "@mui/material/Card";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import Cookies from "js-cookie";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";

const RequestReset = () => {
    const [emailError, setEmailError] = React.useState(false);
    const [emailErrorMessage, setEmailErrorMessage] = React.useState("");
    const baseURL = process.env.REACT_APP_API_BASE_URL;

    const requestPasswordReset = async (event) => {
      event.preventDefault();
      if (emailError) return;
      const data = new FormData(event.currentTarget);
      const email = data.get("email");
      console.log(email);
      const response = await fetch(`${baseURL}/api/password-reset-tokens/reset/${email}`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        console.log(response.statusText);
        console.log(response.json())
        setEmailError(true);
        const msg = "Email Does Not Exist";
        setEmailErrorMessage(msg);
        return;
      }

    }

    return(
        <Stack className="signInContainer">
          <MuiCard className="card" variant="outlined">
            <Typography component="h1" variant="h4">
              Reset Password
            </Typography>
            <Box
              className="loginForm"
              component="form"
              noValidate
              onSubmit={requestPasswordReset}
            >
            <FormControl>
                <FormLabel className="emailLabel" htmlFor="email">
                Email
                </FormLabel>
                <TextField
                error={emailError}
                helperText={emailErrorMessage}
                id="email"
                type="email"
                name="email"
                placeholder="your@email.com"
                autoComplete="email"
                autoFocus
                required
                fullWidth
                variant="outlined"
                color={emailError ? "error" : "primary"}
                />
            </FormControl>
              <Button
                type="submit"
                fullWidth
                variant="contained"
              >
                Send Recovery Email
              </Button>
            </Box>
          </MuiCard>
        </Stack>
      );
}

export default RequestReset;