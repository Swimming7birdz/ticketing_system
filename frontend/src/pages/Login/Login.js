import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import MuiCard from '@mui/material/Card';
import ForgotPassword from '../../components/ForgotPassword/ForgotPassword';
import { useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';
import { jwtDecode } from "jwt-decode";
import './Login.css'

export default function SignIn(props) {
  let navigate = useNavigate();
  const [emailError, setEmailError] = React.useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = React.useState('');
  const [passwordError, setPasswordError] = React.useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = React.useState('');
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit =  async (event) => {
    event.preventDefault();
    if (emailError || passwordError) {
      return;
    }
    const data = new FormData(event.currentTarget);
    const response = await fetch('http://localhost:3000/api/auth/login', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: data.get('email'), password: data.get('password') })  
    })
    if (response.ok == false) {
      setEmailError(true);
      setEmailErrorMessage('Incorrect Email or Password');
      setPasswordError(true);
      setPasswordErrorMessage('Incorrect Email or Password');
      return
    }
    else {
      const responseData = await response.json()
      const token = responseData.token
      Cookies.set('token', token) // Currently storing auth token in cookies client side, should look into keeping tokens server side for improved security

      const decodedToken = jwtDecode(token);
      const userType = decodedToken.role;
      if (userType == "admin") {
        navigate('/admindash');
      }
      else if (userType == "student") {
          navigate('/studentdash')
      }
      else if (userType == "TA") {
          navigate('/instructordash')
      }
    }
  };

  const validateInputs = () => {
    const email = document.getElementById('email');
    const password = document.getElementById('password');

    let isValid = true;

    if (!email.value || !/\S+@\S+\.\S+/.test(email.value)) {
      setEmailError(true);
      setEmailErrorMessage('Please enter a valid email address.');
      isValid = false;
    } else {
      setEmailError(false);
      setEmailErrorMessage('');
    }

    if (!password.value || password.value.length < 4) {
      setPasswordError(true);
      setPasswordErrorMessage('Password must be at least 4 characters long.');
      isValid = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage('');
    }

    return isValid;
  };

  return (
    <Stack className="signInContainer">
      <MuiCard className="card" variant="outlined">
        <Typography
          component="h1"
          variant="h4"
        >
          Sign in
        </Typography>
        <Box
          className="loginForm"
          component="form"
          onSubmit={handleSubmit}
          noValidate
        >
          <FormControl>
            <FormLabel className="emailLabel" htmlFor="email">Email</FormLabel>
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
              color={emailError ? 'error' : 'primary'}
            />
          </FormControl>
          <FormControl>
            <Box className="passwordControls">
              <FormLabel htmlFor="password">Password</FormLabel>
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
              autoFocus
              required
              fullWidth
              variant="outlined"
              color={passwordError ? 'error' : 'primary'}
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
          {/* <Typography>
            Don&apos;t have an account?{' '}
            <span>
              <Link
                href="/material-ui/getting-started/templates/sign-in/"
                variant="body2"
              >
                Sign up
              </Link>
            </span>
          </Typography> */}
        </Box>
      </MuiCard>
    </Stack>
  );
}