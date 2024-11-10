import { Avatar, Button, Chip, Typography } from "@mui/material";
import React from "react";

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
    const value = (hash >> (i * 8)) & 0xff;
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
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#E0E0E0",
        padding: 20,
        borderRadius: 5,
        flex: 1,
        gap: 10,
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
            {ticketId}
          </Typography>
          <Typography
            variant="p"
            sx={{ fontSize: "0.8rem", color: "#212121", textAlign: "right" }}
          >
            {issueDescription}
          </Typography>
        </div>
      </div>
      {/* STATUS */}
      <div style={{ display: "flex", flexDirection: "row", gap: 10 }}>
        <Typography variant="body2" sx={{ fontWeight: "bold" }}>
          Status:
        </Typography>
        {status === "Ongoing" && (
          <Chip
            label="Ongoing"
            size="small"
            sx={{ backgroundColor: "#ADE1BE", color: "#1C741F" }}
          />
        )}
        {status === "Escalated" && (
          <Chip
            label="Escalated"
            size="small"
            sx={{ backgroundColor: "#A0C0F0", color: "#1965D8" }}
          />
        )}
        {status === "Resolved" && (
          <Chip
            label="Resolved"
            size="small"
            sx={{ backgroundColor: "#F89795", color: "#D00505" }}
          />
        )}
      </div>

      {/* NAME */}
      <div style={{ display: "flex", flexDirection: "row", gap: 10 }}>
        <Typography variant="p" sx={{ fontWeight: "bold" }}>
          Name:
        </Typography>
        <Typography variant="p">{name}</Typography>
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
      >
        Open Ticket
      </Button>
    </div>
  );
};

export default TicketCard;
