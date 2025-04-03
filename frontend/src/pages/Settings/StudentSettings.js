import {
  Typography,
  Switch,
  FormControlLabel,
  Divider,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel
} from "@mui/material";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

const baseURL = process.env.REACT_APP_API_BASE_URL;

const StudentSettings = () => {
  const token = Cookies.get("token");
  console.log("Token:", token);

  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
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
        setDarkMode(data.dark_mode);
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

  const handleDarkModeToggle = () => {
    const newValue = !darkMode;
    setDarkMode(newValue);
    updatePreference({ dark_mode: newValue });
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
      <br />
      <FormControlLabel
        control={<Switch checked={darkMode} onChange={handleDarkModeToggle} />}
        label="Dark Mode"
      />

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
          <MenuItem value="in-progress">In Progress</MenuItem>
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




