import ArticleIcon from "@mui/icons-material/Article";
import PeopleIcon from "@mui/icons-material/People";
import { Avatar, Button, Typography } from "@mui/material";
import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import InstructorCard from "../../components/InstructorCard";
import TicketCard from "../../components/TicketCard";
//const baseURL = "https://helpdesk.asucapstonetools.com";
const baseURL = "http://localhost:3302";

const AdminDash = () => {
  const [tickets, setTickets] = useState([]);
  const [totalTickets, setTotalTickets] = useState(0);
  const [statusCounts, setStatusCounts] = useState({});
  const [assignees, setAssignees] = useState([]);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      // Get the token from cookies
      const token = Cookies.get("token");

      const response = await fetch(`${baseURL}/api/tickets`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch tickets");
      }

      const data = await response.json();
      console.log(data);
      setTickets(data); // Assuming data is an array of tickets
    } catch (error) {
      console.error("Error fetching tickets:", error);
      //setError("Could not fetch tickets. Please try again later.");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#DBDADA",
        padding: 50,
        gap: 50,
      }}
    >
      <Typography
        variant="h1"
        sx={{ fontWeight: "bold", fontSize: "2rem", textAlign: "center" }}
      >
        Admin Dashboard
      </Typography>
      {/* TICKET SECTION CONTAINER */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 20,
          backgroundColor: "#F5F5F5",
          padding: 20,
          borderRadius: 5,
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
              1234
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
          >
            View All
          </Button>
        </div>
        {/* TICKETS */}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 10,
          }}
        >
          {tickets.map((ticket) => (
            <TicketCard
              key={ticket.ticket_id}
              ticketId={ticket.ticket_id}
              issueDescription={ticket.issue_description}
              status={ticket.status}
            />
          ))}
        </div>
      </div>

      {/* TA SECTION CONTAINER */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 20,
          backgroundColor: "#F5F5F5",
          padding: 20,
          borderRadius: 5,
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
            <PeopleIcon sx={{ fontSize: "2rem" }} />
          </Avatar>
          <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
            <Typography
              variant="h1"
              sx={{ fontWeight: "bold", fontSize: "2rem" }}
            >
              15
            </Typography>
            <Typography
              variant="p"
              sx={{ fontSize: "0.8rem", color: "#737373" }}
            >
              Assignees
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
          >
            View All
          </Button>
        </div>
        {/* TICKETS */}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 10,
          }}
        >
          <InstructorCard />
          <InstructorCard />
          <InstructorCard />
        </div>
      </div>
    </div>
  );
};

export default AdminDash;
