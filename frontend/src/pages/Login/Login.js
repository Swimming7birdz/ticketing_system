import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import MuiCard from "@mui/material/Card";
import Checkbox from "@mui/material/Checkbox";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import * as React from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

export default function SignIn(props) {
  let navigate = useNavigate();
  const [emailError, setEmailError] = React.useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = React.useState("");
  const [passwordError, setPasswordError] = React.useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const baseURL = process.env.REACT_APP_API_BASE_URL;

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSignUp = () => {
    navigate('/registration')
  }

  const handleSubmit = async (event) => {
    try {
      event.preventDefault();
      if (emailError || passwordError) {
        return;
      }
      const data = new FormData(event.currentTarget);

      const response = await fetch(`${baseURL}/api/auth/login`, {
        //     event.preventDefault();
        //     if (emailError || passwordError) {
        //       return;
        //     }
        //     const data = new FormData(event.currentTarget);
        //     const response = await fetch(
        //       // "https://helpdesk.asucapstonetools.com:3302/api/auth/login", // For Production
        //       "http://localhost:3302/api/auth/login", // For Developing
        //       {

        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: data.get("email"),
          password: data.get("password"),
        }),
      });

      // Handele Response
      if (!response.ok) {
        setEmailError(true);
        setPasswordError(true);
        const errorMessage = "Incorrect Email or Password";
        setEmailErrorMessage(errorMessage);
        setPasswordErrorMessage(errorMessage);
        return;
      }

      // Grab Response
      const responseData = await response.json();
      const token = responseData.token;

      // Store Cookie
      Cookies.set("token", token, { secure: true, sameSite: "Strict" });

      // Get Role
      const decodedToken = jwtDecode(token);
      const userType = decodedToken.role;
      const userId = decodedToken.id;

      // Store ID
      Cookies.set("user_id", userId, { secure: true, sameSite: "Strict" });

      // Redirect based on role
      if (userType === "admin") {
        navigate("/admindash");
      } else if (userType === "student") {
        console.log("Attempting to nav as a student");
        navigate("/studentdash");
      } else if (userType === "TA") {
        navigate("/instructordash");
      }
    } catch (error) {
      console.error("An error occurred while logging in:", error);
      setEmailErrorMessage("Something went wrong. Please try again.");
    }
  };

  const validateInputs = () => {
    const email = document.getElementById("email");
    const password = document.getElementById("password");

    let isValid = true;

    if (!email.value || !/^\S+@asu\.edu$/.test(email.value)) {
      setEmailError(true);
      setEmailErrorMessage("Please enter your ASU email address.");
      isValid = false;
    } else {
      setEmailError(false);
      setEmailErrorMessage("");
    }

    if (!password.value || password.value.length < 4) {
      setPasswordError(true);
      setPasswordErrorMessage("Password must be at least 4 characters long.");
      isValid = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage("");
    }

    return isValid;
  };

  return (
    <Stack className="signInContainer">
      <MuiCard className="card" variant="outlined">
        <Typography component="h1" variant="h4">
          Sign in
        </Typography>
        <Box
          className="loginForm"
          component="form"
          onSubmit={handleSubmit}
          noValidate
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
          <FormControl>
            <Box className="passwordControls">
              <FormLabel htmlFor="password">
		Password
		</FormLabel>
              <Link
                component="button"
                type="button"
                onClick={handleClickOpen}
                variant="body2"
              >
                Forgot your password?
              </Link>
            </Box>
            <TextField
              error={passwordError}
              helperText={passwordErrorMessage}
              name="password"
              placeholder="••••••"
              type="password"
              id="password"
              autoComplete="current-password"
              //autoFocus
              required
              fullWidth
              variant="outlined"
              color={passwordError ? "error" : "primary"}
            />
          </FormControl>
          <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          />
          {/* <ForgotPassword open={open} handleClose={handleClose} /> */}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            onClick={validateInputs}
          >
            Sign in
          </Button>
          <Typography>
            Don&apos;t have an account?{' '}
            <span>
              <Link
                href=""
                variant="body2"
                onClick={handleSignUp}
              >
                Sign up
              </Link>
            </span>
          </Typography>
        </Box>
      </MuiCard>
    </Stack>
  );
}
