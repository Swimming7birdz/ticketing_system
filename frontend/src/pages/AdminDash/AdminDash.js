import ArticleIcon from "@mui/icons-material/Article";
import PeopleIcon from "@mui/icons-material/People";
import { Avatar, Button, Typography, Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import CircularProgress from "@mui/material/CircularProgress";
import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import InstructorCard from "../../components/InstructorCard";
import TicketCard from "../../components/TicketCard";
const baseURL = process.env.REACT_APP_API_BASE_URL;

const AdminDash = () => {
  const theme = useTheme();
  const [tickets, setTickets] = useState([]);
  const [TACounts, setTACounts] = useState([]);
  const [TAs, setTAs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalTickets, setTotalTickets] = useState(0);
  const [totalTAs, setTotalTAs] = useState(0);
  const [statusCounts, setStatusCounts] = useState({});
  const [assignees, setAssignees] = useState([]);
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
      setTAs(TAs);

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
	  //userId: ta.user_id,
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

  const fetchNameFromId = async (student_id) => {
    try {
      const token = Cookies.get("token");
      const response = await fetch(`${baseURL}/api/users/${student_id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        console.warn(`Failed to fetch user name for ticket ${student_id}`);
        return "Unknown Name"; // Default name if user fetch fails
      }

      const data = await response.json();
      return data.name; // Assuming the API returns { name: "User Name" }
    } catch (error) {
      console.error(`Error fetching name for ticket ${student_id}:`, error);
      return "Unknown Name";
    }
  };

  const fetchTickets = async () => {
    try {
      // Get the token from cookies
      const token = Cookies.get("token");

      // Get tickets
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

      const ticketsData = await response.json();
      const limitedTickets = ticketsData.slice(0, 21); // Maybe do this to set how may tickets we want to display

      // Grab name from ticket
      const ticketsWithNames = await Promise.all(
        limitedTickets.map(async (ticket) => {
          const userName = await fetchNameFromId(ticket.student_id); // Fetch user name based on ticket ID
          return { ...ticket, userName }; // Add the userName to the ticket object
        })
      );

      // set tickets
      setTickets(ticketsWithNames); // Assuming data is an array of tickets
      setTotalTickets(ticketsData.length);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching tickets:", error);
      //setError("Could not fetch tickets. Please try again later.");
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
          backgroundColor: theme.palette.background.default, // Optional: a subtle background color
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
        Admin Dashboard
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
            onClick={() => navigate("/alltickets")}
          >
            View All
          </Button>
        </div>
        {/* TICKETS */}
        <div
          style={{
            display: "grid", // Use grid layout for better alignment
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", // Responsive columns
            gap: "20px", // Space between cards
            justifyContent: "center", // Center-align cards
            padding: "5px", // Add padding around the grid
            maxHeight: "950px", // CHANGED HERE: Limits height to approximately 3 rows (adjust as needed)
            overflowY: "hidden",
          }}
        >
          {tickets.map((ticket) => (
            <TicketCard
              key={ticket.ticket_id}
              ticketId={ticket.ticket_id}
              issueDescription={ticket.issue_description}
              status={ticket.status}
              name={ticket.userName}
            />
          ))}
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
        {/* TICKETS */}
        <div
          style={{
            display: "grid", // Use grid layout for better alignment
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", // Responsive columns
            gap: "20px", // Space between cards
            justifyContent: "center", // Center-align cards
            padding: "5px", // Add padding around the grid
            maxHeight: "950px", // CHANGED HERE: Limits height to approximately 3 rows (adjust as needed)
            overflowY: "hidden",
          }}
        >
          {Object.entries(TACounts).map(([id,ta]) => (
            <InstructorCard
              key={id}
              name={ta.name || "Unknown"}
              counts={ta.counts}
	      userId={id} //doesn't work when its ta.user_id ????
            />
          ))}
        </div>
      </Box>
    </Box>
  );
};

export default AdminDash;
