// src/components/TicketRow.js
import React from "react";
import { Avatar, Chip, Typography, IconButton, Stack, Box, Tooltip } from "@mui/material";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";

const statusChip = (s = "unknown") => {
  const m = {
    ongoing:   { label: "Ongoing",   sx: { bgcolor: "#A0C0F0", color: "#1965D8" } },
    escalated: { label: "Escalated", sx: { bgcolor: "#A9CDEB", color: "#326D94" } },
    new:       { label: "New",       sx: { bgcolor: "#F89795", color: "#D00505" } },
    resolved:  { label: "Resolved",  sx: { bgcolor: "#ADE1BE", color: "#1C741F" } },
    unknown:   { label: "Unknown",   sx: { bgcolor: "#D3D3D3", color: "#000" } },
  };
  return <Chip size="small" {...(m[(s || "").toLowerCase()] || m.unknown)} />;
};

function initials(name = "") {
  const parts = name.trim().split(/\s+/);
  if (!parts[0]) return "??";
  const a = parts[0][0] || "";
  const b = parts[1]?.[0] || "";
  return (a + b).toUpperCase();
}

export default function TicketRow({ ticket, onOpen }) {
  const {
    ticket_id,
    issue_description,
    status,
    userName,
    student_name,
    updated_at,
  } = ticket;


  return (
    <Box
      role="button"
      tabIndex={0}
      onClick={() => onOpen?.(ticket)}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onOpen?.(ticket)}
      sx={{
        display: "grid",
        gridTemplateColumns: "auto 1fr auto auto auto",
        alignItems: "center",
        gap: 2,
        px: 2,
        py: 1.25,
        borderBottom: "1px solid",
        borderColor: "divider",
        cursor: "pointer",
        "&:hover": { bgcolor: "action.hover" },
        "&:focus-visible": { outline: "2px solid", outlineColor: "primary.main" },
      }}
      aria-label={`Open ticket for ${userName}`}
    >
      <Avatar>{initials(userName)}</Avatar>

      <Stack spacing={0.25} sx={{ minWidth: 0 }}>
        {}
        <Typography variant="body2" fontWeight={600} noWrap title={userName}>
          {userName}
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
          title={issue_description}
        >
          {issue_description}
        </Typography>

        {/* (Optional) show id subtly — remove if you don’t want it */}
        {/* <Typography variant="caption" color="text.disabled">#{ticket_id}</Typography> */}
      </Stack>

      <Box>{statusChip(status)}</Box>

      <Typography variant="caption" color="text.secondary" sx={{ whiteSpace: "nowrap" }}>
        {updated_at ? new Date(updated_at).toLocaleString() : ""}
      </Typography>

      <Tooltip title="Open ticket">
        <IconButton
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            onOpen?.(ticket);
          }}
        >
          <OpenInNewIcon fontSize="inherit" />
        </IconButton>
      </Tooltip>
    </Box>
  );
}
