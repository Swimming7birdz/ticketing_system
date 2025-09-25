import { Avatar, Button, Typography, Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import React from "react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
const baseURL = process.env.REACT_APP_API_BASE_URL;



function stringAvatar(name) {
  if (!name || typeof name !== "string") {
    return {
      sx: { bgcolor: "#000" },
      children: "?"
    };
  }
  const nameParts = name.split(" ");
  const initials = nameParts[0]
    ? (nameParts[1] ? `${nameParts[0][0]}${nameParts[1][0]}` : nameParts[0][0])
    : "?";
  return {
    sx: { bgcolor: stringToColor(name) },
    children: initials.toUpperCase(),
  };
}

function stringToColor(string) {
  let hash = 0;
  let i;

  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = "#";
  for (i = 0; i < 3; i += 1) {
    let value = (hash >> (i * 8)) & 0xff;
    if (value > 200) value -= 55;
    if (value < 55) value += 55;
    if (i === 0 && value > 180) value -= 40;
    if (i === 1 && value > 180) value -= 40;
    if (i === 2 && value > 180) value -= 40;
    color += `00${value.toString(16)}`.slice(-2);
  }
  return color;
}

const defaultProps = {
  name: "Unknown Name",
  counts: {
    new: -1,
    ongoing: -1,
    resolved: -1,
  },
  userId: "1",
};

const InstructorCard = ({
  name = defaultProps.name,
  counts = defaultProps.counts,
  userId = defaultProps.userId,
}) => {
  const theme = useTheme();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  let navigate = useNavigate();

  useEffect(() => {
    fetchUserDetails();
  }, [userId]);

  const onViewProfile = () => {
    navigate(`/instructorprofile?user=${userId}`)
  }

  const fetchUserDetails = async () => {
    try {
      const token = Cookies.get("token");
      const response = await fetch(`${baseURL}/api/users/${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch TA details");
      }

      const taData = await response.json();
      setUser(taData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching TA details:", error);
      setLoading(false);
    }

  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        backgroundColor: theme.palette.background.paper,
        padding: 2.5,
        borderRadius: 1,
        flex: 1,
        gap: 1.25,
        width: "100%",
        height: "300px",
        overflow: "hidden",
        boxSizing: "border-box",
        border: 1,
        borderColor: theme.palette.divider,
      }}
    >
      {/* HEADER */}
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <Avatar {...stringAvatar(name)} />
        <div style={{ display: "flex", flexDirection: "column" }}>
          <Typography
            variant="p"
            sx={{
              fontSize: "1rem",
              color: theme.palette.text.primary,
              fontWeight: "bold",
              textAlign: "right",
            }}
          >
            {name}
          </Typography>
          <Typography
            variant="p"
            sx={{ fontSize: "0.8rem", color: "#212121", textAlign: "right" }}
          >
            UGTA
          </Typography>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          gap: 20,
        }}
      >
        <div style={{ display: "flex", flexDirection: "row", gap: 10 }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <Typography variant="p" sx={{ fontWeight: "bold", color: "green" }}>
              Open
            </Typography>
            <Typography variant="p" sx={{ fontWeight: "bold", color: "red" }}>
              Closed
            </Typography>
            <Typography variant="p" sx={{ fontWeight: "bold", color: "blue" }}>
              Escalated
            </Typography>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              textAlign: "right",
            }}
          >
            <Typography variant="p">{counts.new}</Typography>
            <Typography variant="p">{counts.ongoing}</Typography>
            <Typography variant="p">{counts.resolved}</Typography>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <Typography variant="p" sx={{ color: theme.palette.text.secondary, fontSize: "0.8rem" }}>
            Monday: 01:00 PM - 02:00 PM
          </Typography>
          <Typography variant="p" sx={{ color: theme.palette.text.secondary, fontSize: "0.8rem" }}>
            Tuesday: 01:00 PM - 02:00 PM
          </Typography>
          <Typography variant="p" sx={{ color: theme.palette.text.secondary, fontSize: "0.8rem" }}>
            Wednesday: 01:00 PM - 02:00 PM
          </Typography>
          <Typography variant="p" sx={{ color: theme.palette.text.secondary, fontSize: "0.8rem" }}>
            Thursday: 01:00 PM - 02:00 PM
          </Typography>
          <Typography variant="p" sx={{ color: theme.palette.text.secondary, fontSize: "0.8rem" }}>
            Friday: 01:00 PM - 02:00 PM
          </Typography>
          <Typography variant="p" sx={{ color: theme.palette.text.secondary, fontSize: "0.8rem" }}>
            Saturday: 01:00 PM - 02:00 PM
          </Typography>
          <Typography variant="p" sx={{ color: theme.palette.text.secondary, fontSize: "0.8rem" }}>
            Sunday: 01:00 PM - 02:00 PM
          </Typography>
        </div>
      </div>

      <Button
        variant="contained"
        disableElevation
        sx={{
          backgroundColor: theme.palette.primary.main,
          color: "white",
          borderRadius: 999,
          fontSize: "0.75rem",
          width: "fit-content",
          alignSelf: "flex-end",
        }} 
	onClick={onViewProfile} //need to grab TA's specific information
      >
        View Profile
      </Button>
    </Box>
  );
};

export default InstructorCard;