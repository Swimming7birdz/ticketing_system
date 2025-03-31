import { Avatar, Button, Chip, Typography } from "@mui/material";
import React, { useState } from "react";
import TicketView from "./TicketView/TicketView"; // Import your TicketView component

function stringAvatar(name) {
  return {
    sx: { bgcolor: stringToColor(name) },
    children: (() => {
      const nameParts = name.split(" ");
      const initials = nameParts.length >= 2 ? `${nameParts[0][0]}${nameParts[1][0]}` : nameParts[0][0];
      return initials.toUpperCase();
    })(),
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

    color += `00${value.toString(16)}`.slice(-2);
  }
  /* eslint-enable no-bitwise */

  return color;
}

const defaultProps = {
  ticketId: "12345",
  issueDescription: "Test Description",
  status: "Ongoing",
  name: "No Name",
};

const TicketCard = ({
  ticketId = defaultProps.ticketId,
  issueDescription = defaultProps.issueDescription,
  status = defaultProps.status,
  name = defaultProps.name,
}) => {
  const [showTicketView, setShowTicketView] = useState(false);

  const handleOpenTicket = () => {
    setShowTicketView(true);
  };

  const handleCloseTicketView = () => {
    setShowTicketView(false);
  };

  return (
    <>
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
                color: "#212121",
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
            color: "#212121",
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
        <div style={{ display: "flex", flexDirection: "row", gap: 10 }}>
          <Typography variant="body2" sx={{ fontWeight: "bold" }}>
            Status:
          </Typography>
          {status === "ongoing" && (
            <Chip
              label="Ongoing"
              size="small"
              sx={{ backgroundColor: "#ADE1BE", color: "#1C741F" }}
            />
          )}
          {status === "escalated" && (
            <Chip
              label="Escalated"
              size="small"
              sx={{ backgroundColor: "#A0C0F0", color: "#1965D8" }}
            />
          )}
          {status === "new" && (
            <Chip
              label="New"
              size="small"
              sx={{ backgroundColor: "#A9CDEB", color: "#326D94" }}
            />
          )}
          {status === "resolved" && (
            <Chip
              label="Resolved"
              size="small"
              sx={{ backgroundColor: "#F89795", color: "#D00505" }}
            />
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
            backgroundColor: "#8C1D40",
            color: "white",
            borderRadius: 999,
            fontSize: "0.75rem",
            width: "fit-content",
            alignSelf: "flex-end",
          }}
        >
          Open Ticket
        </Button>
      </div>

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