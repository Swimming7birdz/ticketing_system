import React from 'react';
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import MuiCard from "@mui/material/Card";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";
import './ResetPassword.css';

const ResetPassword = () => {
  const [passwordError, setPasswordError] = React.useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = React.useState("");
  const [showPass, setShowPass] = React.useState(false);
  const baseURL = process.env.REACT_APP_API_BASE_URL;

    
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
        >
          <FormControl>
            <Box className="passwordControls">
              <FormLabel htmlFor="password">New Password</FormLabel>
            </Box>
            <TextField
              error={passwordError}
              helperText={passwordErrorMessage}
              name="password"
              placeholder="••••••"
              type={showPass ? "text" : "password"}
              id="password"
              autoComplete="current-password"
              autoFocus
              required
              fullWidth
              variant="outlined"
              color={passwordError ? "error" : "primary"}
            /> 
              <label className="checkBoxLabel">
                <input 
                  type="checkbox"
                  id="showPassCheckBox"
                  onChange={e => setShowPass(e.target.checked)}
                  checked={showPass}
                  style={{ marginRight: '0px'}}
                />
                <span style={{ marginLeft: "0.5rem" }}>Show Password</span>
              </label>
          </FormControl>
          <Button
            type="submit"
            fullWidth
            variant="contained"
          >
            Reset
          </Button>
        </Box>
      </MuiCard>
    </Stack>
  );
}

export default ResetPassword;