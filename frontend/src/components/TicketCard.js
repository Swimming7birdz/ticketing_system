import { Avatar, Button, Chip, Typography, Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import React, { useState } from "react";
import TicketView from "./TicketView/TicketView"; // Import TicketView component
// minor change for git tracking
function stringAvatar(name) {
  return {
    sx: {
      bgcolor: stringToColor(name),
    },
    children: `${name.split(" ")[0]?.[0] || ""}${name.split(" ")[1]?.[0] || ""}`,
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

    // Adjust the value
    if (value > 200) value -= 55; 
    if (value < 55) value += 55; 

    color += `00${value.toString(16)}`.slice(-2);
  }
  /* eslint-enable no-bitwise */

  return color;
}

const defaultProps = {
  ticketId: "12345",
  issueDescription: "Test Description",
  status: "Ongoing",
  escalated: false,
  name: "No Name",
};

const TicketCard = ({
  ticketId = defaultProps.ticketId,
  issueDescription = defaultProps.issueDescription,
  status = defaultProps.status,
  escalated = defaultProps.escalated,
  name = defaultProps.name,
}) => {
  const theme = useTheme();
  const [showTicketView, setShowTicketView] = useState(false);

  const handleOpenTicket = () => {
    setShowTicketView(true);
  };

  const handleCloseTicketView = () => {
    setShowTicketView(false);
  }; 

  const normalizedStatus = status ? status.toLowerCase() : "unknown";
  const isEscalated = escalated === true;

  return (
    <>
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
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
            }}
          >
            <Typography
              variant="body1"
              sx={{
                fontSize: "1rem",
                color: theme.palette.text.primary,
                fontWeight: "bold",
                textAlign: "right",
              }}
            >
              {ticketId}
            </Typography>
          </div>
        </div>

        {/* ISSUE DESCRIPTION placed below the header */}
        <Typography
          variant="body2"
          sx={{
            fontSize: "0.8rem",
            color: theme.palette.text.primary,
            textAlign: "left",
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 4, // Allow 4 lines before truncating
            WebkitBoxOrient: "vertical",
          }}
        >
          {issueDescription}
        </Typography>

        {/* STATUS */}
        <div style={{ display: "flex", flexDirection: "column", gap:5}}>
          <div style={{ display: "flex", flexDirection: "row", gap: 10 }}>
            <Typography variant="body2" sx={{ fontWeight: "bold" }}>
              Status:
            </Typography>
            {(normalizedStatus === "ongoing") && (
              <Chip label="Ongoing" size="small" sx={{ backgroundColor: "#A0C0F0" , color: "#1965D8"}} />
            )}
            {/*{normalizedStatus === "escalated" && (
              <Chip label="Escalated" size="small" sx={{ backgroundColor: "#A9CDEB", color:"#326D94"  }} />
            )}*/}
            {normalizedStatus === "new" && (
              <Chip label="New" size="small" sx={{ backgroundColor:  "#F89795", color: "#D00505" }} />
            )}
            {normalizedStatus === "resolved" && (
              <Chip label="Resolved" size="small" sx={{ backgroundColor: "#ADE1BE", color:  "#1C741F" }} />
            )}
            {normalizedStatus === "unknown" && (
              <Chip label="Unknown" size="small" sx={{ backgroundColor: "#D3D3D3", color: "#000000" }} />
            )}
          </div>

          {/* Escalated Status Indicator */}
          {isEscalated && (
            <div style={{display: "flex", flexDirection: "row", gap: 10 }}>
              <Typography variant = "body2" sx={{ fontWeight: "bold", color: "#D00505" }}>
                Priority:
              </Typography>
              <Chip label="Escalated" size="small" sx={{ backgroundColor: "#D00505", color: "white"}}
              />
            </div>
        )}
        </div>

        {/* NAME */}
        <div style={{ display: "flex", flexDirection: "row", gap: 10 }}>
          <Typography variant="body2" sx={{ fontWeight: "bold" }}>
            Name:
          </Typography>
          <Typography variant="body2">{name}</Typography>
        </div>

        <Button
          variant="contained"
          disableElevation
          onClick={handleOpenTicket}
          sx={{
            backgroundColor: theme.palette.primary.main,
            color: "white",
            borderRadius: 999,
            fontSize: "0.75rem",
            width: "fit-content",
            alignSelf: "flex-end",
          }}
        >
          Open Ticket
        </Button>
      </Box>

      {/* Render TicketView when the button is clicked */}
      {showTicketView && (
        <TicketView
          ticketId={ticketId}
          issueDescription={issueDescription}
          status={status}
          name={name}
          onClose={handleCloseTicketView}
        />
      )}
    </>
  );
};

export default TicketCard;
