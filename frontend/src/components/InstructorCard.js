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
  const [officeHours, setOfficeHours] = useState({
    monday: {start: '12:00', end: '12:00'},
    tuesday: {start: '12:00', end: '12:00'},
    wednesday: {start: '12:00', end: '12:00'},
    thursday: {start: '12:00', end: '12:00'},
    friday: {start: '12:00', end: '12:00'},
    saturday: {start: '12:00', end: '12:00'},
    sunday: {start: '12:00', end: '12:00'}
  });

  let navigate = useNavigate();

  useEffect(() => {
    fetchUserDetails();
    fetchOfficeHours();
  }, [userId]);

  const fetchOfficeHours = async () => {
    try {
      const token = Cookies.get("token");
      const response = await fetch(`${baseURL}/api/officehours/users/${userId}`,{
        headers: {
        'Authorization': `Bearer ${token}`,
      },
      });
      
      const data = await response.json();
      
      if (response.ok && data.office_hours) {
        setOfficeHours(data.office_hours);
      }
      
    } catch (err) {
      console.error("error fetching office hours:", err);
    }
  };

  function handleDisplayTime(time) {
    if (time) {
      let hrs = time.split(':')[0], mins = time.split(':')[1];
      if (hrs > 12){return (hrs - 12) + ':' + mins + ' PM';}
      else if (hrs == 0) {return '12:' + mins + ' PM';}
      else {return (time + ' AM');}
    }
    return '';
  }

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
            Monday: {handleDisplayTime(officeHours.monday.start)} - {handleDisplayTime(officeHours.monday.end)}
          </Typography>
          <Typography variant="p" sx={{ color: theme.palette.text.secondary, fontSize: "0.8rem" }}>
            Tuesday: {handleDisplayTime(officeHours.tuesday.start)} - {handleDisplayTime(officeHours.tuesday.end)}
          </Typography>
          <Typography variant="p" sx={{ color: theme.palette.text.secondary, fontSize: "0.8rem" }}>
            Wednesday: {handleDisplayTime(officeHours.wednesday.start)} - {handleDisplayTime(officeHours.wednesday.end)}
          </Typography>
          <Typography variant="p" sx={{ color: theme.palette.text.secondary, fontSize: "0.8rem" }}>
            Thursday: {handleDisplayTime(officeHours.thursday.start)} - {handleDisplayTime(officeHours.thursday.end)}
          </Typography>
          <Typography variant="p" sx={{ color: theme.palette.text.secondary, fontSize: "0.8rem" }}>
            Friday: {handleDisplayTime(officeHours.friday.start)} - {handleDisplayTime(officeHours.friday.end)}
          </Typography>
          <Typography variant="p" sx={{ color: theme.palette.text.secondary, fontSize: "0.8rem" }}>
            Saturday: {handleDisplayTime(officeHours.saturday.start)} - {handleDisplayTime(officeHours.saturday.end)}
          </Typography>
          <Typography variant="p" sx={{ color: theme.palette.text.secondary, fontSize: "0.8rem" }}>
            Sunday: {handleDisplayTime(officeHours.sunday.start)} - {handleDisplayTime(officeHours.sunday.end)}
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