import React, { useEffect, useState } from "react";
import { Avatar, Button, Typography, Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import ArticleIcon from "@mui/icons-material/Article";
import CircularProgress from "@mui/material/CircularProgress";
import Cookies from "js-cookie";
import TicketsViewController from "../../components/TicketsViewController";
import { fetchTicketsByUserId } from "../../services/ticketServices";
import { useNavigate } from "react-router-dom"; // ✅ Import navigation

const baseURL = process.env.REACT_APP_API_BASE_URL;

const StudentDash = () => {
  const theme = useTheme();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalTickets, setTotalTickets] = useState(0);
  const navigate = useNavigate(); // ✅ Initialize navigation function

  const openTicket = (ticket) => navigate(`/ticketinfo?ticket=${ticket.ticket_id}`);

  useEffect(() => {
    loadTickets();
  }, []);

  const fetchTeamNameFromId = async (team_id) => {
    try {
      const token = Cookies.get("token");
      const response = await fetch(`${baseURL}/api/teams/${team_id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        console.warn(`Failed to fetch team name for team_id=${team_id}`);
        return "No Team";
      }

      const data = await response.json();
      return data.team_name || "No Team";
    } catch (error) {
      console.error(`Error fetching team name for team_id=${team_id}:`, error);
      return "No Team";
    }
  };

  const loadTickets = async () => {
    try {
      const studentTickets = await fetchTicketsByUserId();
      
      // Add userName and teamName properties for TicketsViewController consistency
      const ticketsWithNames = await Promise.all(
        studentTickets.map(async (ticket) => {
          const teamName = await fetchTeamNameFromId(ticket.team_id);
          return {
            ...ticket,
            userName: ticket.student_name || "Unknown",
            teamName: teamName
          };
        })
      );
      
      setTickets(ticketsWithNames);
      setTotalTickets(ticketsWithNames.length);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching student tickets:", error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          backgroundColor: theme.palette.background.default,
          flexDirection: "column",
          gap: 2.5,
        }}
      >
        <CircularProgress size={80} thickness={4} />
        <Typography variant="h6" sx={{ color: theme.palette.primary.main }}>
          Loading, please wait...
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        backgroundColor: theme.palette.background.default,
        padding: 6.25,
        gap: 6.25,
      }}
    >
      <Typography
        variant="h1"
        sx={{ fontWeight: "bold", fontSize: "2rem", textAlign: "center" }}
      >
        Student Dashboard
      </Typography>

      {/* TICKET SECTION CONTAINER */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2.5,
          backgroundColor: theme.palette.background.paper,
          padding: 2.5,
          borderRadius: 1,
          flex: 1,
        }}
      >
        {/* SECTION HEADER */}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: 10,
          }}
        >
          <Avatar>
            <ArticleIcon sx={{ fontSize: "2rem" }} />
          </Avatar>
          <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
            <Typography
              variant="h1"
              sx={{ fontWeight: "bold", fontSize: "2rem" }}
            >
              {totalTickets}
            </Typography>
            <Typography
              variant="p"
              sx={{ fontSize: "0.8rem", color: theme.palette.text.secondary }}
            >
              Total Tickets
            </Typography>
          </div>
          <Button
            variant="contained"
            disableElevation
            sx={{
              backgroundColor: theme.palette.primary.main,
              color: "white",
              borderRadius: 999,
              fontSize: "0.75rem",
            }}
            onClick={() => navigate("/mytickets")} // ✅ Navigate to all student tickets
          >
            View All
          </Button>
        </div>

        {/* TICKETS */}
        <TicketsViewController
          tickets={tickets}
          defaultView="grid"
          onOpenTicket={openTicket}
        />
      </Box>
    </Box>
  );
};

export default StudentDash;
