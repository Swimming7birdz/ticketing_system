import React, { useEffect, useMemo, useState } from "react";
import { Box, Typography, Avatar, Button, CircularProgress } from "@mui/material";
import ArticleIcon from "@mui/icons-material/Article";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import TicketsViewController from "../../components/TicketsViewController";

const baseURL = process.env.REACT_APP_API_BASE_URL;

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

export default function StudentDash() {
  const navigate = useNavigate();
  const userId = useMemo(getUserIdFromToken, []);
  const [tickets, setTickets] = useState([]);
  const [count, setCount] = useState(0);
  const [openCount, setOpenCount] = useState(0); // e.g., new+ongoing
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

        // Get my tickets
        const res = await fetch(`${baseURL}/api/tickets/user/${userId}`, {
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch tickets");
        const data = await res.json();

        const enriched = await Promise.all(
          data.map(async (t) => ({
            ...t,
            userName: await fetchNameFromId(t.student_id),
          }))
        );

        const openStatuses = new Set(["new", "ongoing", "escalated"]);
        const openNum = enriched.reduce(
          (acc, t) => acc + (openStatuses.has(String(t.status || "").toLowerCase()) ? 1 : 0),
          0
        );

        if (!cancelled) {
          setTickets(enriched.slice(0, 20)); // recent subset for dashboard
          setCount(enriched.length);
          setOpenCount(openNum);
        }
      } catch (e) {
        console.error(e);
        if (!cancelled) {
          setTickets([]);
          setCount(0);
          setOpenCount(0);
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
      {/* Stats */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: 2,
        }}
      >
        <Box
          sx={{
            p: 2,
            borderRadius: 2,
            bgcolor: "background.paper",
            border: "1px solid",
            borderColor: "divider",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Avatar><ArticleIcon /></Avatar>
            <Box>
              <Typography variant="overline" color="text.secondary">My Tickets</Typography>
              <Typography variant="h6">{count}</Typography>
            </Box>
          </Box>
          <Button size="small" variant="contained" onClick={() => navigate("/studenttickets")}>
            View All
          </Button>
        </Box>

        <Box
          sx={{
            p: 2,
            borderRadius: 2,
            bgcolor: "background.paper",
            border: "1px solid",
            borderColor: "divider",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Avatar><ArticleIcon /></Avatar>
            <Box>
              <Typography variant="overline" color="text.secondary">Open</Typography>
              <Typography variant="h6">{openCount}</Typography>
            </Box>
          </Box>
          <Button size="small" variant="contained" onClick={() => navigate("/studenttickets")}>
            Manage
          </Button>
        </Box>
      </Box>

      {/* Recent Tickets */}
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
          header={<Typography variant="subtitle2">Recent Tickets</Typography>}
        />
      </Box>
    </Box>
  );
}
