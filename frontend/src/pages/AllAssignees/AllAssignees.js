import { Button, CircularProgress, TextField, Typography, Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import InstructorCard from "../../components/InstructorCard";
const baseURL = process.env.REACT_APP_API_BASE_URL;

const AllAssignees = () => {
  const theme = useTheme();
  const [tas, setTAs] = useState([]);
  const [filteredTAs, setFilteredTAs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [taCounts, setTACounts] = useState({});

  useEffect(() => {
    fetchTAs();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [tas, search]);

  const fetchTAs = async () => {
    try {
      const token = Cookies.get("token");

      const response = await fetch(`${baseURL}/api/users/role/TA`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch TAs");
      }

      const tasData = await response.json();
      setTAs(tasData);
      setFilteredTAs(tasData);
      await fetchTACounts(tasData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching TAs:", error);
      setLoading(false);
    }
  };

  const fetchTACounts = async (tasData) => {
    try {
      const token = Cookies.get("token");

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

      const ticketCounts = {};

      tasData.forEach((ta) => {
        ticketCounts[ta.user_id] = {
          name: ta.name,
          counts: { new: 0, ongoing: 0, resolved: 0 },
        };

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

      setTACounts(ticketCounts);
    } catch (err) {
      console.error("Error fetching TA ticket counts:", err);
    }
  };

  const applyFilters = () => {
    const filtered = tas.filter((ta) =>
      ta.name.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredTAs(filtered);
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
          gap: "20px",
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
        All Teaching Assistants (TAs)
      </Typography>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <TextField
          label="Search TAs"
          variant="outlined"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ width: "300px" }}
        />
        <Button
          variant="outlined"
          onClick={() => setSearch("")}
          sx={{ color: theme.palette.primary.main, borderColor: theme.palette.primary.main }}
        >
          Clear Search
        </Button>
      </div>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: 2.5,
          maxHeight: "70vh",
          overflowY: "auto",
          padding: 0.625,
          border: 1,
          borderColor: theme.palette.divider,
          borderRadius: 1,
        }}
      >
        {filteredTAs.map((ta) => (
          <InstructorCard
            key={ta.user_id}
            name={ta.name}
            counts={taCounts[ta.user_id]?.counts || {new:0, ongoing:0, resolved:0}} 
            userId={ta.user_id}
          />
        ))}
      </Box>
    </Box>
  );
};

export default AllAssignees;
