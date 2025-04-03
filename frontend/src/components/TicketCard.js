import { Avatar, Button, Chip, Typography } from "@mui/material";
import React, { useState } from "react";
import TicketView from "./TicketView/TicketView"; // Import TicketView component

function stringAvatar(name) {
  return {
    sx: {
      bgcolor: stringToColor(name),
    },
    children: `${name.split(" ")[0][0]}${name.split(" ")[1][0]}`,
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

  const normalizedStatus = status ? status.toLowerCase() : "unknown";


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
        {/* STATUS */}
<div style={{ display: "flex", flexDirection: "row", gap: 10 }}>
  <Typography variant="body2" sx={{ fontWeight: "bold" }}>
    Status:
  </Typography>
  {(normalizedStatus === "in progress" || normalizedStatus === "ongoing") && (
  <Chip label="In Progress" size="small" sx={{ backgroundColor: "#ADE1BE", color: "#1C741F" }} />
)}
{normalizedStatus === "escalated" && (
  <Chip label="Escalated" size="small" sx={{ backgroundColor: "#A0C0F0", color: "#1965D8" }} />
)}
{normalizedStatus === "new" && (
  <Chip label="New" size="small" sx={{ backgroundColor: "#A9CDEB", color: "#326D94" }} />
)}
{normalizedStatus === "resolved" && (
  <Chip label="Resolved" size="small" sx={{ backgroundColor: "#F89795", color: "#D00505" }} />
)}
{normalizedStatus === "unknown" && (
  <Chip label="Unknown" size="small" sx={{ backgroundColor: "#D3D3D3", color: "#000000" }} />
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
