import { Avatar, Button, Typography } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
const baseURL = process.env.REACT_APP_API_BASE_URL;



function stringAvatar(name) {
  if (!name || typeof name !== "string") {
    return {
      sx: {
        bgcolor: "#000", // Default background color
      },
      children: "?", // Default initials
    };
  }

  const nameParts = name.split(" ");
  const initials =
    nameParts.length > 1
      ? `${nameParts[0][0]}${nameParts[1][0]}`
      : `${nameParts[0][0]}`; // Handle single-word names

  return {
    sx: {
      bgcolor: stringToColor(name),
    },
    children: initials.toUpperCase(), // Use uppercase initials
  };
}

function stringToColor(string) {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = "#";

  for (i = 0; i < 3; i += 1) {
    let value = (hash >> (i * 8)) & 0xff;

    // Adjust the value to avoid pure red, green, or blue
    if (value > 200) value -= 55; // Avoid very high intensities
    if (value < 55) value += 55; // Avoid very low intensities

    // Ensure the value isn't too dominant for R, G, or B
    if (i === 0 && value > 180) value -= 40; // Red
    if (i === 1 && value > 180) value -= 40; // Green
    if (i === 2 && value > 180) value -= 40; // Blue

    color += `00${value.toString(16)}`.slice(-2);
  }
  /* eslint-enable no-bitwise */

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
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        backgroundColor: "#E0E0E0",
        padding: 20,
        borderRadius: 5,
        flex: 1,
        gap: 10,
        width: "100%",
        height: "300px",
        overflow: "hidden",
        boxSizing: "border-box",
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
              color: "#212121",
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
          <Typography variant="p" sx={{ color: "#737373", fontSize: "0.8rem" }}>
            Monday: 01:00 PM - 02:00 PM
          </Typography>
          <Typography variant="p" sx={{ color: "#737373", fontSize: "0.8rem" }}>
            Tuesday: 01:00 PM - 02:00 PM
          </Typography>
          <Typography variant="p" sx={{ color: "#737373", fontSize: "0.8rem" }}>
            Wednesday: 01:00 PM - 02:00 PM
          </Typography>
          <Typography variant="p" sx={{ color: "#737373", fontSize: "0.8rem" }}>
            Thursday: 01:00 PM - 02:00 PM
          </Typography>
          <Typography variant="p" sx={{ color: "#737373", fontSize: "0.8rem" }}>
            Friday: 01:00 PM - 02:00 PM
          </Typography>
          <Typography variant="p" sx={{ color: "#737373", fontSize: "0.8rem" }}>
            Saturday: 01:00 PM - 02:00 PM
          </Typography>
          <Typography variant="p" sx={{ color: "#737373", fontSize: "0.8rem" }}>
            Sunday: 01:00 PM - 02:00 PM
          </Typography>
        </div>
      </div>

      <Button
        variant="contained"
        disableElevation
        sx={{
          backgroundColor: "#8C1D40",
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
    </div>
  );
};

export default InstructorCard;
