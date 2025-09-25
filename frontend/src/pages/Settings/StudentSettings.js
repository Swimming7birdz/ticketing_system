// minor change for git tracking
import {
  Typography,
  Switch,
  FormControlLabel,
  Divider,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  RadioGroup,
  Radio
} from "@mui/material";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../contexts/ThemeContext";

const baseURL = process.env.REACT_APP_API_BASE_URL;

const StudentSettings = () => {
  const token = Cookies.get("token");
  console.log("Token:", token);

  const navigate = useNavigate();
  const { isDarkMode, themeMode, setTheme } = useTheme();

  const [user, setUser] = useState(null);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [ticketView, setTicketView] = useState("all"); // new

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
        console.log("Loaded user:", data);
        setUser(data);
        setNotificationsEnabled(data.notifications_enabled);
      })
      .catch((err) => console.error("Failed to load settings:", err));

    // Load ticket view from localStorage
    const storedView = localStorage.getItem("default_ticket_view");
    if (storedView) setTicketView(storedView);
  }, []);

  const updatePreference = (updates) => {
    if (!user) return;

    console.log("Updating user:", user);

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

  const handleThemeModeChange = (event) => {
    const newThemeMode = event.target.value;
    setTheme(newThemeMode);
    updatePreference({ 
      theme_mode: newThemeMode,
      dark_mode: newThemeMode === 'dark' // Update dark_mode for backward compatibility
    });
  };

  const handleTicketViewChange = (event) => {
    const newView = event.target.value;
    setTicketView(newView);
    localStorage.setItem("default_ticket_view", newView);
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "auto" }}>
      <Typography variant="h4" gutterBottom>
        Student Settings
      </Typography>

      <Divider sx={{ margin: "20px 0" }} />

      <Typography variant="h6" gutterBottom>
        Preferences
      </Typography>

      <FormControlLabel
        control={<Switch checked={notificationsEnabled} onChange={handleNotificationsToggle} />}
        label="Email Notifications"
      />
      
      <Typography variant="subtitle1" gutterBottom sx={{ marginTop: "20px" }}>
        Theme Mode
      </Typography>
      <FormControl component="fieldset">
        <RadioGroup
          value={themeMode}
          onChange={handleThemeModeChange}
          row
        >
          <FormControlLabel value="light" control={<Radio />} label="Light" />
          <FormControlLabel value="dark" control={<Radio />} label="Dark" />
          <FormControlLabel value="auto" control={<Radio />} label="Auto (Time-based)" />
        </RadioGroup>
      </FormControl>

      <FormControl fullWidth sx={{ marginTop: "20px" }}>
        <InputLabel id="ticket-view-label">Default Ticket View</InputLabel>
        <Select
          labelId="ticket-view-label"
          value={ticketView}
          label="Default Ticket View"
          onChange={handleTicketViewChange}
        >
          <MenuItem value="all">All My Tickets</MenuItem>
          <MenuItem value="new">New</MenuItem>
          <MenuItem value="ongoing">Ongoing</MenuItem>
          <MenuItem value="resolved">Resolved</MenuItem>
        </Select>
      </FormControl>

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

export default StudentSettings;




