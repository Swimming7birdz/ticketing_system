import React, { useEffect, useState } from "react";
import { Box, Typography, Avatar, Button, CircularProgress } from "@mui/material";
import ArticleIcon from "@mui/icons-material/Article";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import TicketsViewController from "../../components/TicketsViewController";

const baseURL = process.env.REACT_APP_API_BASE_URL;

export default function EscalatedTickets() {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // helper: get student name for avatar/title
  const fetchNameFromId = async (student_id) => {
    try {
      const token = Cookies.get("token");
      const res = await fetch(`${baseURL}/api/users/${student_id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        console.warn(`Failed to fetch user name for student_id=${student_id} (status ${res.status})`);
        return "Unknown";
      }

      const data = await res.json();
      return data?.name || "Unknown";
    } catch (error) {
      console.error(`Error fetching name for student_id=${student_id}:`, error);
      return "Unknown";
    }
  };

  // load escalated tickets and enrich with userName
  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        setLoading(true);
        const token = Cookies.get("token");
        const res = await fetch(`${baseURL}/api/tickets`, {
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch tickets");

        const all = await res.json();
        const onlyEscalated = all.filter((t) => t.escalated === true);

        const enriched = await Promise.all(
          onlyEscalated.map(async (t) => ({
            ...t,
            userName: await fetchNameFromId(t.student_id),
          }))
        );

        if (!cancelled) {
          setTickets(enriched);
          setCount(onlyEscalated.length);
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
  }, []);

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
            <Typography variant="h6">Escalated Tickets</Typography>
            <Typography variant="body2" color="text.secondary">
              {count} escalated
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
          header={<Typography variant="subtitle2">Escalated</Typography>}
        />
      </Box>
    </Box>
  );
}
