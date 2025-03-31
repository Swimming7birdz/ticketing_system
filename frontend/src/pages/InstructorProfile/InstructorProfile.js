import {
  Button,
  CircularProgress,
  Menu,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import TicketCard from "../../components/TicketCard";
import ArticleIcon from "@mui/icons-material/Article";
import PeopleIcon from "@mui/icons-material/People";
import { Avatar } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import InstructorCard from "../../components/InstructorCard";

const baseURL = process.env.REACT_APP_API_BASE_URL;

const InstructorProfile = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalTickets, setTotalTickets] = useState(0);
  const [filterAnchor, setFilterAnchor] = useState(null); // For dropdown
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [TA, setTA] = useState(null);
  const [TATickets, setTATickets] = useState([]);
  const [activeFilters, setActiveFilters] = useState({
    sort: null,
    status: null,
    search: "",
  });

  const location = useLocation();

  const urlParameters = new URLSearchParams(location.search);
  const userId = urlParameters.get("user");

  useEffect(() => {
    fetchTicketsAssigned();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [tickets, activeFilters]);

  useEffect(() => {
    fetchTADetails();
  }, [userId]);

  const fetchTADetails = async () => {
    try {
      const token = Cookies.get("token");
      const response = await fetch(`${baseURL}/api/users/${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch TA details");
      }

      const taData = await response.json();
      setTA(taData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching TA details:", error);
      setLoading(false);
    }
  
  };


  const applyFilters = () => {
    let filtered = [...tickets];

    // Apply sort filter
    if (activeFilters.sort === "newest") {
      filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    } else if (activeFilters.sort === "oldest") {
      filtered.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    }

    // Apply status filter
    if (activeFilters.status) {
      filtered = filtered.filter(
        (ticket) =>
          ticket.status.toLowerCase() === activeFilters.status.toLowerCase()
      );
    }

    // Apply search filter
    if (activeFilters.search) {
      filtered = filtered.filter((ticket) =>
        ticket.userName
          .toLowerCase()
          .includes(activeFilters.search.toLowerCase())
      );
    }
    setFilteredTickets(filtered);
  };

  const handleFilterClick = (event) => {
    setFilterAnchor(event.currentTarget);
  };

  const handleFilterClose = () => {
    setFilterAnchor(null);
  };

  const handleClearFilters = () => {
    setActiveFilters({ sort: null, status: null, search: "" });
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
  const fetchTicketDetails = async (ticketId) => {
  try {
    const token = Cookies.get("token");
    const response = await fetch(`${baseURL}/api/tickets/${ticketId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch details for ticket ${ticketId}`);
    }

    return await response.json(); // Assuming the response returns ticket details
  } catch (error) {
    console.error(`Error fetching ticket ${ticketId}:`, error);
    return null; // Return null for failed requests
  }
  };

  const fetchTicketsAssigned = async () => {
    try {
      const token = Cookies.get("token");
      const response = await fetch(`${baseURL}/api/ticketassignments/users/${userId}`, {
        method: "GET",
        headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      throw new Error("Failed to fetch Ticket Assignment details");
    }

    const ticketsAssigned = await response.json();
    setTATickets(ticketsAssigned);
    // Extract ticket_ids from the ticketsAssigned data
    const ticketIds = ticketsAssigned.map((assignment) => assignment.ticket_id);

    // Make API requests to fetch details for each ticket concurrently
    const ticketDetailsPromises = ticketIds.map((ticketId) => fetchTicketDetails(ticketId));

    const ticketDetails = await Promise.all(ticketDetailsPromises);

    console.log(ticketDetails);
    const ticketsWithNames = await Promise.all(
        ticketDetails.map(async (ticket) => {
          const userName = await fetchNameFromId(ticket.student_id);
          return { ...ticket, userName };
        })
      );
      setTickets(ticketsWithNames);
      setTotalTickets(ticketDetails.length);
    
    setLoading(false);
  } catch (error) {
      console.error("Error fetching Ticket Assignment details:", error);
      setLoading(false);
    }
  };
/*
  const fetchTickets = async () => {
    try {
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

      const ticketsData = await response.json();

      const ticketsWithNames = await Promise.all(
        ticketsData.map(async (ticket) => {
          const userName = await fetchNameFromId(ticket.student_id);
          return { ...ticket, userName };
        })
      );
      setTickets(ticketsWithNames);
      setTotalTickets(ticketsData.length);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching tickets:", error);
      setLoading(false);
    }
  };
*/
  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          backgroundColor: "#f0f0f0",
          flexDirection: "column",
          gap: "20px",
        }}
      >
        <CircularProgress size={80} thickness={4} />
        <Typography variant="h6" sx={{ color: "#8C1D40" }}>
          Loading, please wait...
        </Typography>
      </div>
    );
  }
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
        {TA.name} Profile
      </Typography>
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
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 20,
          }}
        >
          <TextField
            label="Search by Student Name"
            variant="outlined"
            value={activeFilters.search}
            onChange={(e) =>
              setActiveFilters({ ...activeFilters, search: e.target.value })
            }
            sx={{ flex: 1 }}
          />
          <Button
            variant="contained"
            onClick={handleFilterClick}
            sx={{ backgroundColor: "#8C1D40", color: "white" }}
          >
            {activeFilters.sort || activeFilters.status
              ? `Filters: ${activeFilters.sort || ""} ${
                  activeFilters.status || ""
                }`
              : "Add Filter"}
          </Button>
          <Button
            variant="outlined"
            onClick={handleClearFilters}
            sx={{ borderColor: "#8C1D40", color: "#8C1D40" }}
          >
            Clear Filters
          </Button>
        </div>

        {/* Filter Dropdown */}
        <Menu
          anchorEl={filterAnchor}
          open={Boolean(filterAnchor)}
          onClose={handleFilterClose}
        >
          <MenuItem
            onClick={() => {
              setActiveFilters({ ...activeFilters, sort: "newest" });
              handleFilterClose();
            }}
          >
            Newest
          </MenuItem>
          <MenuItem
            onClick={() => {
              setActiveFilters({ ...activeFilters, sort: "oldest" });
              handleFilterClose();
            }}
          >
            Oldest
          </MenuItem>
          <MenuItem
            onClick={() => {
              setActiveFilters({ ...activeFilters, status: "New" });
              handleFilterClose();
            }}
          >
            Status: New
          </MenuItem>
          <MenuItem
            onClick={() => {
              setActiveFilters({ ...activeFilters, status: "Ongoing" });
              handleFilterClose();
            }}
          >
            Status: Ongoing
          </MenuItem>
          <MenuItem
            onClick={() => {
              setActiveFilters({ ...activeFilters, status: "Resolved" });
              handleFilterClose();
            }}
          >
            Status: Resolved
          </MenuItem>
        </Menu>


        {/* Tickets Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "20px",
            maxHeight: "calc(100vh - 400px)",
            overflowY: "auto",
          }}
        >
          {filteredTickets.map((ticket) => (
            <TicketCard
              key={ticket.ticket_id}
              ticketId={ticket.ticket_id}
              issueDescription={ticket.issue_description}
              status={ticket.status}
              name={ticket.userName}
            />
          ))}
        </div>
      </div>
	{/*Schedule section*/}
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
	{/*<Avatar>
            <ArticleIcon sx={{ fontSize: "2rem" }} />
          </Avatar>*/}
          <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
            <Typography 
              variant="h1"
              sx={{ fontWeight: "bold", fontSize: "2rem", textAlign: "center" }}
            >
              Schedule
            </Typography>
          </div>	
	<div style={{ display: "flex", flexDirection: "column" }}>
          <Typography variant="p" sx={{ color: "#737373", fontSize: "0.8rem", textAlign: "center" }}>
            Monday: 01:00 PM - 02:00 PM
          </Typography>
          <Typography variant="p" sx={{ color: "#737373", fontSize: "0.8rem" , textAlign: "center"}}>
            Tuesday: 01:00 PM - 02:00 PM
          </Typography>
          <Typography variant="p" sx={{ color: "#737373", fontSize: "0.8rem" , textAlign: "center"}}>
            Wednesday: 01:00 PM - 02:00 PM
          </Typography>
          <Typography variant="p" sx={{ color: "#737373", fontSize: "0.8rem" , textAlign: "center"}}>
            Thursday: 01:00 PM - 02:00 PM
          </Typography>
          <Typography variant="p" sx={{ color: "#737373", fontSize: "0.8rem" , textAlign: "center"}}>
            Friday: 01:00 PM - 02:00 PM
          </Typography>
          <Typography variant="p" sx={{ color: "#737373", fontSize: "0.8rem" , textAlign: "center"}}>
            Saturday: 01:00 PM - 02:00 PM
          </Typography>
          <Typography variant="p" sx={{ color: "#737373", fontSize: "0.8rem" , textAlign: "center"}}>
            Sunday: 01:00 PM - 02:00 PM
          </Typography>
        </div>
	</div> 
    </div>
  );
};

export default InstructorProfile;
