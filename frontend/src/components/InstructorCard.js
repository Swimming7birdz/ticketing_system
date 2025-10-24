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
      let hrs = parseInt(time.split(':')[0]), mins = time.split(':')[1];
      if (hrs > 12) {
        return (hrs - 12) + ':' + mins + ' PM';
      } else if (hrs === 12) {
        return '12:' + mins + ' PM';
      } else if (hrs === 0) {
        return '12:' + mins + ' AM';
      } else {
        return hrs + ':' + mins + ' AM';
      }
    }
    return '';
  }

  const getActiveOfficeHours = () => {
    const dayAbbreviations = {
      monday: 'Mon',
      tuesday: 'Tue', 
      wednesday: 'Wed',
      thursday: 'Thu',
      friday: 'Fri',
      saturday: 'Sat',
      sunday: 'Sun'
    };

    const daysInOrder = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

    const activeHours = [];
    daysInOrder.forEach(day => {
      const hours = officeHours[day];
      if (hours && hours.start && hours.end) {
        activeHours.push({
          day: dayAbbreviations[day],
          start: handleDisplayTime(hours.start),
          end: handleDisplayTime(hours.end)
        });
      }
    });

    return activeHours; 
  };

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

      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          gap: 3,
          flex: 1,
          minHeight: 0, 
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "row", gap: 1, minWidth: "fit-content" }}>
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <Typography variant="body2" sx={{ fontWeight: "bold", color: "#D00505", fontSize: "0.8rem" }}>
              New
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: "bold", color: "#1965D8", fontSize: "0.8rem" }}>
              Ongoing
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: "bold", color: "#1C741F", fontSize: "0.8rem" }}>
              Resolved
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              textAlign: "right",
              minWidth: "30px"
            }}
          >
            <Typography variant="body2" sx={{ fontSize: "0.8rem" }}>{counts.new}</Typography>
            <Typography variant="body2" sx={{ fontSize: "0.8rem" }}>{counts.ongoing}</Typography>
            <Typography variant="body2" sx={{ fontSize: "0.8rem" }}>{counts.resolved}</Typography>
          </Box>
        </Box>

        <Box 
          sx={{ 
            display: "flex", 
            flexDirection: "column",
            minWidth: 0, 
            flex: 1,
            overflow: "hidden"
          }}
        >
          <Typography 
            variant="caption" 
            sx={{ 
              color: theme.palette.text.primary, 
              fontSize: "0.85rem",
              fontWeight: "bold",
              marginBottom: 0.5
            }}
          >
            Office Hours:
          </Typography>
          <Box sx={{ 
            maxHeight: "100px", 
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            gap: 0.25
          }}>
            {getActiveOfficeHours().length > 0 ? (
              getActiveOfficeHours().map((hours, index) => (
                <Typography 
                  key={index}
                  variant="body2" 
                  sx={{ 
                    color: theme.palette.text.secondary, 
                    fontSize: "0.8rem",
                    lineHeight: 1.3,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis"
                  }}
                >
                  {hours.day}: {hours.start} - {hours.end}
                </Typography>
              ))
            ) : (
              <Typography 
                variant="body2" 
                sx={{ 
                  color: theme.palette.text.disabled, 
                  fontSize: "0.8rem",
                  fontStyle: "italic"
                }}
              >
                No hours set
              </Typography>
            )}
          </Box>
        </Box>
      </Box>

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