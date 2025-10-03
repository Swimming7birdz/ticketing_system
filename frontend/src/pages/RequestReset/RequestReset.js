import React from 'react';
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import MuiCard from "@mui/material/Card";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";

const RequestReset = () => {
    let navigate = useNavigate();  
    const [emailError, setEmailError] = React.useState(false);
    const [emailErrorMessage, setEmailErrorMessage] = React.useState("");
    const baseURL = process.env.REACT_APP_API_BASE_URL;

    const handleLogIn = () => {
      navigate('/login')
    }

    const requestPasswordReset = async (event) => {
      event.preventDefault();
      if (emailError) return;
      const data = new FormData(event.currentTarget);
      const user_email = data.get("email");
  
      const response = await fetch(`${baseURL}/api/password-reset-tokens/reset`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: user_email }),
      });

      if (!response.ok) {
        console.log(response.statusText);
        const errorData = await response.json();
        console.log(errorData);
        setEmailError(true);
        const msg = "Email Does Not Exist";
        setEmailErrorMessage(msg);
        return;
      } else {
        setEmailError(false);
        setEmailErrorMessage("");
        alert("Reset link has been sent.");
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
              <Typography sx={{ mt: 3 }}>
                Back to Login Page{' '}
                <span>
                  <Link
                    href=""
                    variant="body2"
                    onClick={handleLogIn}
                  >
                    Log In
                  </Link>
                </span>
              </Typography>
            </Box>
          </MuiCard>
        </Stack>
      );
}

export default RequestReset;