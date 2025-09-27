import React, { useEffect, useState } from "react";
import { Avatar, Button, Typography, Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import ArticleIcon from "@mui/icons-material/Article";
import CircularProgress from "@mui/material/CircularProgress";
import Cookies from "js-cookie";
import TicketCard from "../../components/TicketCard";
import { fetchTicketAssignmentsByUserId, fetchTicketById } from "../../services/ticketServices";
import { useNavigate } from "react-router-dom";

const InstructorTickets = () => {
  const theme = useTheme();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalTickets, setTotalTickets] = useState(0);
  let navigate = useNavigate();

  useEffect(() => {
    loadTickets();
  }, []);

    const filterUniqueTickets = (tickets) => { //Avoid duplicate tickets
        const seen = new Set();
        return tickets.filter((ticket) => {
            if (seen.has(ticket.ticket_id)) {
                return false;
            }
            seen.add(ticket.ticket_id);
            return true; 
        });
    };

    const sortTicketsById = (tickets) => {
        return tickets.sort((a, b) =>  a.ticket_id - b.ticket_id);
    }

    const loadTickets = async () => {
      try {
        const instructorTickets = await fetchTicketAssignmentsByUserId();
        console.log(instructorTickets);
        const sortedTickets = sortTicketsById(instructorTickets);
        const uniqueTickets = filterUniqueTickets(sortedTickets);
       
        const ticketList = await Promise.all(
            uniqueTickets.map(async (ticket_) => {
                const ticketData = await fetchTicketById(ticket_.ticket_id);
                return { ...ticket_, ticketData };
            })
        );
        setTickets(ticketList);
        setTotalTickets(ticketList.length);
        setLoading(false);
        
    } catch (error) {
        console.error("Error fetching instructor tickets:", error);
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
        My Tickets
      </Typography>

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
              sx={{ fontSize: "0.8rem", color: "#737373" }}
            >
              Total Tickets
            </Typography>
          </div>
          <Button
            variant="contained"
            disableElevation
            sx={{
              backgroundColor: "#8C1D40",
              color: "white",
              borderRadius: 999,
              fontSize: "0.75rem",
            }}
            onClick={() => navigate("/instructordash")}
          >
            Back to Dashboard
          </Button>
        </div>

        <div
  style={{
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: "20px",
    justifyContent: "center",
    padding: "5px",
    overflowY: "auto", //  Allows scrolling for more tickets
  }}
>

          {tickets.map((ticket) => (
            ticket = ticket.ticketData,
            <TicketCard
              key={ticket.ticket_id}
              ticketId={ticket.ticket_id}
              issueDescription={ticket.issue_description}
              status={ticket.status} 
              name={ticket.student?.name || "Unknown"}
            />
          ))}
        </div>
      </Box>
    </Box>
  );
};

export default InstructorTickets;
