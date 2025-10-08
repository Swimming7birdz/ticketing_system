import React, { useEffect, useMemo, useState } from "react";
import { Box, Typography, Avatar, Button, CircularProgress } from "@mui/material";
import ArticleIcon from "@mui/icons-material/Article";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import TicketsViewController from "../../components/TicketsViewController";

const baseURL = process.env.REACT_APP_API_BASE_URL;

// Read user_id from JWT (no secret; just decode payload)
function getUserIdFromToken() {
  try {
    const token = Cookies.get("token");
    if (!token) return null;
    const payload = JSON.parse(atob(token.split(".")[1] || ""));
    return payload?.user_id || payload?.id || null;
  } catch {
    return null;
  }
}

export default function StudentTickets() {
  const navigate = useNavigate();
  const userId = useMemo(getUserIdFromToken, []);
  const [tickets, setTickets] = useState([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchNameFromId = async (student_id) => {
    try {
      const token = Cookies.get("token");
      const res = await fetch(`${baseURL}/api/users/${student_id}`, {
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      });
      if (!res.ok) return "Unknown";
      const data = await res.json();
      return data.name || "Unknown";
    } catch {
      return "Unknown";
    }
  };

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    (async () => {
      try {
        setLoading(true);
        const token = Cookies.get("token");

        // Backend: ticketController.getTicketsByUserId
        const res = await fetch(`${baseURL}/api/tickets/user/${userId}`, {
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch student tickets");
        const data = await res.json();

        const enriched = await Promise.all(
          data.map(async (t) => ({
            ...t,
            userName: await fetchNameFromId(t.student_id),
          }))
        );

        if (!cancelled) {
          setTickets(enriched);
          setCount(enriched.length);
        }
      } catch (e) {
        console.error(e);
        if (!cancelled) {
          setTickets([]);
          setCount(0);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [userId]);

  const openTicket = (t) => navigate(`/ticketinfo?ticket=${t.ticket_id}`);

  if (loading) {
    return (
      <Box sx={{ p: 4, display: "grid", placeItems: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ display: "grid", gap: 3, p: 3 }}>
      {/* Header / Stats */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          justifyContent: "space-between",
          bgcolor: "background.paper",
          border: "1px solid",
          borderColor: "divider",
          p: 2,
          borderRadius: 2,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Avatar><ArticleIcon /></Avatar>
          <Box>
            <Typography variant="h6">My Tickets</Typography>
            <Typography variant="body2" color="text.secondary">
              {count} total
            </Typography>
          </Box>
        </Box>
        <Button variant="contained" onClick={() => navigate(-1)}>Back</Button>
      </Box>

      {/* Tickets */}
      <Box
        sx={{
          bgcolor: "background.paper",
          border: "1px solid",
          borderColor: "divider",
          p: 2,
          borderRadius: 2,
        }}
      >
        <TicketsViewController
          tickets={tickets}
          defaultView="list"
          onOpenTicket={openTicket}
          header={<Typography variant="subtitle2">Tickets</Typography>}
        />
      </Box>
    </Box>
  );
}
