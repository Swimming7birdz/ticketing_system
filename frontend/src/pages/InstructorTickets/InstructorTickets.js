import React, { useEffect, useState } from "react";
import { Avatar, Button, Typography, Box, TextField, Menu, MenuItem } from "@mui/material";
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
  const [escalatedTickets, setEscalatedTickets] = useState(0);
  const [openTickets, setOpenTickets] = useState(0);
  const [closedTickets, setClosedTickets] = useState(0);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [filterAnchor, setFilterAnchor] = useState(null);
  const [activeFilters, setActiveFilters] = useState({
    sort: null,
    status: null,
    search: "",
    ticketIdSearch: "",
  });
  const [hideResolved, setHideResolved] = useState(true);
  let navigate = useNavigate();

  useEffect(() => {
    loadTickets();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [tickets, activeFilters, hideResolved]);

  useEffect(() => {
    if (activeFilters.status && activeFilters.status.toLowerCase() === "resolved") {
      setHideResolved(false);
    }
  }, [activeFilters.status]);

  const applyFilters = () => {
    let filtered = [...tickets];

    // Apply sort filter
    if (activeFilters.sort === "newest") {
      filtered.sort((a, b) => new Date(b.ticketData?.created_at) - new Date(a.ticketData?.created_at));
    } else if (activeFilters.sort === "oldest") {
      filtered.sort((a, b) => new Date(a.ticketData?.created_at) - new Date(b.ticketData?.created_at));
    } else if (activeFilters.sort === "id-asc") {
      filtered.sort((a, b) => a.ticketData?.ticket_id - b.ticketData?.ticket_id);
    } else if (activeFilters.sort === "id-desc") {
      filtered.sort((a, b) => b.ticketData?.ticket_id - a.ticketData?.ticket_id);
    }

    // Apply status filter
    if (activeFilters.status) {
      if (activeFilters.status.toLowerCase() === "escalated") {
        filtered = filtered.filter(
          (ticket) => ticket.ticketData?.escalated === true
        );
      } else {
        filtered = filtered.filter(
        (ticket) =>
          ticket.ticketData?.status?.toLowerCase() === activeFilters.status.toLowerCase()
        );
      }
    }

    // Apply search filter (search by student name)
    if (activeFilters.search) {
      filtered = filtered.filter((ticket) =>
        ticket.ticketData?.student?.name
          ?.toLowerCase()
          .includes(activeFilters.search.toLowerCase())
      );
    }

    // Search by ticket ID
    if (activeFilters.ticketIdSearch) {
      filtered = filtered.filter(
        (ticket) => ticket.ticketData?.ticket_id?.toString() === activeFilters.ticketIdSearch
      );
    }

    // Hide resolved tickets if toggle is active
    if (hideResolved) {
      filtered = filtered.filter(
        (ticket) => ticket.ticketData?.status?.toLowerCase() !== "resolved"
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
    setActiveFilters({ sort: null, status: null, search: "", ticketIdSearch: "" });
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
        
        setTickets(ticketList);
        setFilteredTickets(ticketList); // Initialize filtered tickets
        setTotalTickets(ticketList.length);
        setEscalatedTickets(escalatedCount);
        setOpenTickets(openCount);
        setClosedTickets(closedCount);
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
            sx={{
              backgroundColor: theme.palette.primary.main,
              color: "white",
              borderRadius: 999,
              fontSize: "0.75rem",
            }}
            onClick={() => navigate("/instructordash")}
          >
            Back to Dashboard
          </Button>
        </div>

        {/* Search and Filter Controls */}
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
            label="Search by Name"
            variant="outlined"
            value={activeFilters.search}
            onChange={(e) =>
              setActiveFilters({ ...activeFilters, search: e.target.value })
            }
            sx={{ flex: 1 }}
          />
          <TextField
            label="Search by Ticket ID"
            variant="outlined"
            value={activeFilters.ticketIdSearch}
            onChange={(e) =>
              setActiveFilters({ ...activeFilters, ticketIdSearch: e.target.value })
            }
            sx={{ flex: 1 }}
          />
          <Button
            variant="contained"
            onClick={handleFilterClick}
            sx={{ backgroundColor: theme.palette.primary.main, color: "white" }}
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
            sx={{ borderColor: theme.palette.primary.main, color: theme.palette.primary.main }}
          >
            Clear Filters
          </Button>
          <Button
            variant="outlined"
            onClick={() => setHideResolved(prev => !prev)}
            sx={{ borderColor: theme.palette.primary.main, color: theme.palette.primary.main }}
          >
            {hideResolved ? "Include Resolved" : "Hide Resolved"}
          </Button>
        </div>

        {/* Filter Dropdown Menu */}
        <Menu
          anchorEl={filterAnchor}
          open={Boolean(filterAnchor)}
          onClose={handleFilterClose}
        >
          {/* Sort: Newest */}
          <MenuItem
            onClick={() => {
              if (activeFilters.sort === "newest") {
                setActiveFilters({ ...activeFilters, sort: null });
              } else {
                setActiveFilters({ ...activeFilters, sort: "newest" });
              }
              handleFilterClose();
            }}
          >
            {activeFilters.sort === "newest" && (
              <span style={{ marginRight: 8 }}>✔</span>
            )}
            Newest
          </MenuItem>

          {/* Sort: Oldest */}
          <MenuItem
            onClick={() => {
              if (activeFilters.sort === "oldest") {
                setActiveFilters({ ...activeFilters, sort: null });
              } else {
                setActiveFilters({ ...activeFilters, sort: "oldest" });
              }
              handleFilterClose();
            }}
          >
            {activeFilters.sort === "oldest" && (
              <span style={{ marginRight: 8 }}>✔</span>
            )}
            Oldest
          </MenuItem>

          {/* Sort: ID Ascending */}
          <MenuItem
            onClick={() => {
              if (activeFilters.sort === "id-asc") {
                setActiveFilters({ ...activeFilters, sort: null });
              } else {
                setActiveFilters({ ...activeFilters, sort: "id-asc" });
              }
              handleFilterClose();
            }}
          >
            {activeFilters.sort === "id-asc" && (
              <span style={{ marginRight: 8 }}>✔</span>
            )}
            Sort by ID: Ascending
          </MenuItem>

          {/* Sort: ID Descending */}
          <MenuItem
            onClick={() => {
              if (activeFilters.sort === "id-desc") {
                setActiveFilters({ ...activeFilters, sort: null });
              } else {
                setActiveFilters({ ...activeFilters, sort: "id-desc" });
              }
              handleFilterClose();
            }}
          >
            {activeFilters.sort === "id-desc" && (
              <span style={{ marginRight: 8 }}>✔</span>
            )}
            Sort by ID: Descending
          </MenuItem>

          {/* Status: New */}
          <MenuItem
            onClick={() => {
              if (activeFilters.status === "New") {
                setActiveFilters({ ...activeFilters, status: null });
              } else {
                setActiveFilters({ ...activeFilters, status: "New" });
              }
              handleFilterClose();
            }}
          >
            {activeFilters.status === "New" && (
              <span style={{ marginRight: 8 }}>✔</span>
            )}
            Status: New
          </MenuItem>

          {/* Status: Ongoing */}
          <MenuItem
            onClick={() => {
              if (activeFilters.status === "Ongoing") {
                setActiveFilters({ ...activeFilters, status: null });
              } else {
                setActiveFilters({ ...activeFilters, status: "Ongoing" });
              }
              handleFilterClose();
            }}
          >
            {activeFilters.status === "Ongoing" && (
              <span style={{ marginRight: 8 }}>✔</span>
            )}
            Status: Ongoing
          </MenuItem>

          {/* Status: Resolved */}
          <MenuItem
            onClick={() => {
              if (activeFilters.status === "Resolved") {
                setActiveFilters({ ...activeFilters, status: null });
              } else {
                setActiveFilters({ ...activeFilters, status: "Resolved" });
              }
              handleFilterClose();
            }}
          >
            {activeFilters.status === "Resolved" && (
              <span style={{ marginRight: 8 }}>✔</span>
            )}
            Status: Resolved

          </MenuItem>
          {/* Status: Escalated */}
          <MenuItem
            onClick={() => {
              if (activeFilters.status == "Escalated") {
                setActiveFilters({ ...activeFilters, status: null });
              } else {
                setActiveFilters({ ...activeFilters, status: "Escalated"});
              }
              handleFilterClose();
            }}
          >
            {activeFilters.status === "Escalated" && (
              <span style={{ marginRight: 8}} >✔</span>
            )}
            Status: Escalated
          </MenuItem>
        </Menu>

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

          {filteredTickets.map((ticket) => (
            <TicketCard
              key={ticket.ticketData.ticket_id}
              ticketId={ticket.ticketData.ticket_id}
              issueDescription={ticket.ticketData.issue_description}
              status={ticket.ticketData.status} 
              escalated={ticket.ticketData.escalated}
              name={ticket.ticketData.student?.name || "Unknown"}
            />
          ))}
        </div>
      </Box>
    </Box>
  );
};

export default InstructorTickets;