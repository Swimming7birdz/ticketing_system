import {
  Typography,
  Switch,
  FormControlLabel,
  Divider,
  Button
} from "@mui/material";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../contexts/ThemeContext";

const baseURL = process.env.REACT_APP_API_BASE_URL;

const TASettings = () => {
  const token = Cookies.get("token");
  const navigate = useNavigate();
  const { isDarkMode, toggleTheme } = useTheme();

  const [user, setUser] = useState(null);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  useEffect(() => {
    fetch(`${baseURL}/api/users/profile`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setUser(data);
        setNotificationsEnabled(data.notifications_enabled);
      })
      .catch((err) => console.error("Failed to load settings:", err));
  }, []);

  const updatePreference = (updates) => {
    if (!user) return;

    fetch(`${baseURL}/api/users/${user.user_id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        ...user,
        ...updates,
      }),
    })
      .then((res) => res.json())
      .then((updatedUser) => {
        setUser(updatedUser);
      })
      .catch((err) => {
        console.error("Error saving preferences:", err);
      });
  };

  const handleNotificationsToggle = () => {
    const newValue = !notificationsEnabled;
    setNotificationsEnabled(newValue);
    updatePreference({ notifications_enabled: newValue });
  };

  const handleDarkModeToggle = () => {
    const newValue = !isDarkMode;
    toggleTheme();
    updatePreference({ dark_mode: newValue });
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "auto" }}>
      <Typography variant="h4" gutterBottom>
        Teaching Assistant Settings
      </Typography>

      <Divider sx={{ margin: "20px 0" }} />

      <Typography variant="h6" gutterBottom>
        Preferences
      </Typography>

      <FormControlLabel
        control={<Switch checked={notificationsEnabled} onChange={handleNotificationsToggle} />}
        label="Email Notifications"
      />
      <br />
      <FormControlLabel
        control={<Switch checked={isDarkMode} onChange={handleDarkModeToggle} />}
        label="Dark Mode"
      />

      <Divider sx={{ margin: "30px 0" }} />

      <Typography variant="h6" gutterBottom>
        Account Management
      </Typography>
      <Button
        variant="outlined"
        color="error"
        onClick={() => alert("Delete account coming soon")}
      >
        Delete Account
      </Button>

      <div style={{ marginTop: "30px" }}>
        <Button
          variant="outlined"
          onClick={() => navigate("/profile")}
        >
          Go to Account Settings
        </Button>
      </div>
    </div>
  );
};

export default TASettings;
