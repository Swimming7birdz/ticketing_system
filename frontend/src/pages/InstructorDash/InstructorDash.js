//import React from 'react'
import { Avatar, Button, Typography, Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import ArticleIcon from '@mui/icons-material/Article';
import TicketCard from '../../components/TicketCard';
import SideBar from '../../components/SideBar/SideBar'; //to make the sidebar highlight when clicking view all button in dashboard
// pasted from AdminDash
import PeopleIcon from "@mui/icons-material/People";
import CircularProgress from "@mui/material/CircularProgress";
import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import InstructorCard from "../../components/InstructorCard";
import { fetchTicketAssignmentsByUserId, fetchTicketById } from "../../services/ticketServices";
const baseURL = process.env.REACT_APP_API_BASE_URL;

const InstructorDash = () => {
// start copy and paste from admindash
  const theme = useTheme();
  const [selectedPage, setSelectedPage] = useState(0); //copied from sidebar

  const [tickets, setTickets] = useState([]);
  const [TACounts, setTACounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalTickets, setTotalTickets] = useState(0);
  const [totalTAs, setTotalTAs] = useState(0);
  const [escalatedTickets, setEscalatedTickets] = useState(0);
  const [openTickets, setOpenTickets] = useState(0);
  const [closedTickets, setClosedTickets] = useState(0);
  const [statusCounts, setStatusCounts] = useState({});
  const [assignees, setAssignees] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [activeFilters, setActiveFilters] = useState({
    sort: null,
    status: null,
    search: "",
  });
  const [filterAnchor, setFilterAnchor] = useState(null);
  let navigate = useNavigate();

  useEffect(() => {
    fetchTickets();
    fetchTACounts();
  }, []);

  const fetchTACounts = async () => {
    try {
      const token = Cookies.get("token");

      // Step 1: Fetch all users
      const usersResponse = await fetch(`${baseURL}/api/users`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!usersResponse.ok) {
        throw new Error(
          `Failed to fetch users, status: ${usersResponse.status}`
        );
      }

      const users = await usersResponse.json();
      const tas = users.filter((user) => user.role === "TA"); // Filter TAs
      setTotalTAs(tas.length);

      // Step 2: Fetch all ticket assignments
      const assignmentsResponse = await fetch(
        `${baseURL}/api/ticketassignments`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
           Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!assignmentsResponse.ok) {
        throw new Error(
          `Failed to fetch ticket assignments, status: ${assignmentsResponse.status}`
        );
      }

      const assignments = await assignmentsResponse.json();

      // Step 3: Fetch all tickets
      const ticketsResponse = await fetch(`${baseURL}/api/tickets`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!ticketsResponse.ok) {
        throw new Error(
          `Failed to fetch tickets, status: ${ticketsResponse.status}`
        );
      }

      const tickets = await ticketsResponse.json();

      // Step 4: Map tickets and increment counts for each TA
      const ticketCounts = {}; // Store ticket counts for each TA

      tas.forEach((ta) => {
        // Initialize counts for this TA
        ticketCounts[ta.user_id] = {
          name: ta.name, // Store the TA's name
          counts: { new: 0, ongoing: 0, resolved: 0 },
        };

        // Filter assignments for this TA
        const taAssignments = assignments.filter(
          (assignment) => assignment.user_id === ta.user_id
        );

        // For each assignment, find the corresponding ticket and increment counts
        taAssignments.forEach((assignment) => {
          const ticket = tickets.find(
            (t) => t.ticket_id === assignment.ticket_id
          );

          if (ticket) {
            // Increment the status count
            if (ticket.status === "new")
              ticketCounts[ta.user_id].counts.new += 1;
            else if (ticket.status === "ongoing")
              ticketCounts[ta.user_id].counts.ongoing += 1;
            else if (ticket.status === "resolved")
              ticketCounts[ta.user_id].counts.resolved += 1;
          }
        });
      });



      console.log(ticketCounts);
      setTACounts(ticketCounts); // Update state with counts
    } catch (err) {
      console.error("Error fetching TA ticket counts:", err);
    }
  };



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

  const fetchTickets = async () => {
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
      
      // Count different ticket types
      const escalatedCount = ticketList.filter(ticket => 
        ticket.ticketData && ticket.ticketData.escalated === true
      ).length;
      
      const openCount = ticketList.filter(ticket => 
        ticket.ticketData && (ticket.ticketData.status === 'new' || ticket.ticketData.status === 'ongoing')
      ).length;
      
      const closedCount = ticketList.filter(ticket => 
        ticket.ticketData && ticket.ticketData.status === 'resolved'
      ).length;
      
      // Limit to 21 tickets for dashboard display
      const limitedTickets = ticketList.slice(0, 21); 
      
      setTickets(limitedTickets);
      setTotalTickets(ticketList.length);
      setEscalatedTickets(escalatedCount);
      setOpenTickets(openCount);
      setClosedTickets(closedCount);
      setLoading(false);
      
    } catch (error) {
      console.error("Error fetching tickets:", error);
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
          height: "100vh", // Full viewport height to center vertically
          backgroundColor: theme.palette.background.default, // Use theme background
          flexDirection: "column",
          gap: 2.5,
        }}
      >
        <CircularProgress size={80} thickness={4} />{" "}
        {/* Adjust size and thickness */}
        <Typography variant="h6" sx={{ color: theme.palette.primary.main }}>
          Loading, please wait...
        </Typography>
      </Box>
    );
  }

// end copy and paste from admindash
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
        Instructor Dashboard
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10 }}>
            <Avatar>
              <ArticleIcon sx={{ fontSize: "2rem" }} />
            </Avatar>
            <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
              <Typography variant="h1" sx={{ fontWeight: 'bold', fontSize: '2rem' }}>
                {totalTickets}
              </Typography>
              <Typography variant="p" sx={{ fontSize: '0.8rem', color: theme.palette.text.secondary }}>
                Total Tickets
              </Typography>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
              <Typography variant="h1" sx={{ fontWeight: 'bold', fontSize: '2rem' }}>
                {openTickets}
              </Typography>
              <Typography variant="p" sx={{ fontSize: '0.8rem', color: theme.palette.text.secondary }}>
                Open
              </Typography>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
              <Typography variant="h1" sx={{ fontWeight: 'bold', fontSize: '2rem' }}>
                {escalatedTickets}
              </Typography>
              <Typography variant="p" sx={{ fontSize: '0.8rem', color: theme.palette.text.secondary }}>
                Escalated
              </Typography>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
              <Typography variant="h1" sx={{ fontWeight: 'bold', fontSize: '2rem' }}>
                {closedTickets}
              </Typography>
              <Typography variant="p" sx={{ fontSize: '0.8rem', color: theme.palette.text.secondary }}>
                Closed
              </Typography>
            </div>
            <Button 
              variant="contained" 
              disableElevation 
              sx={{ backgroundColor: theme.palette.primary.main, color: 'white', borderRadius: 999, fontSize: '0.75rem', width: '15%' }}
              onClick={() => navigate("/instructortickets")}
            >
              View My Tickets
            </Button>
          </div>

          {/* TICKETS */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: "20px",
              justifyContent: "center",
              padding: "5px",
              maxHeight: "950px",
              overflowY: "hidden",
            }}
          >
            {tickets.map((ticket) => (
              <TicketCard
                key={ticket.ticketData.ticket_id}
                ticketId={ticket.ticketData.ticket_id}
                issueDescription={ticket.ticketData.issue_description}
                status={ticket.ticketData.status}
                name={ticket.ticketData.student?.name || "Unknown"}
              />
            ))}
          </div>
        </div>
      </Box>

      {/* TA SECTION CONTAINER */}
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
            <PeopleIcon sx={{ fontSize: "2rem" }} />
          </Avatar>
          <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
            <Typography
              variant="h1"
              sx={{ fontWeight: "bold", fontSize: "2rem" }}
            >
              {totalTAs}
            </Typography>
            <Typography
              variant="p"
              sx={{ fontSize: "0.8rem", color: theme.palette.text.secondary }}
            >
              Assignees
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
            onClick={() => navigate("/allassignees")}
          >
            View All
          </Button>
        </div>

        {/* TA CARDS */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "20px",
            justifyContent: "center",
            padding: "5px",
            maxHeight: "950px",
            overflowY: "hidden",
          }}
        >
          {Object.entries(TACounts).map(([id, ta]) => (
            <InstructorCard
              key={id}
              name={ta.name || "Unknown"}
              counts={ta.counts}
              userId={id}
            />
          ))}
        </div>
      </Box>
    </Box>
  );
};

export default InstructorDash