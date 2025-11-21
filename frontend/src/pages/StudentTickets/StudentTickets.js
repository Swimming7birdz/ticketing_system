import React, { useEffect, useMemo, useState } from "react";
import { Box, Typography, Avatar, Button, CircularProgress, TextField, Menu, MenuItem } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import ArticleIcon from "@mui/icons-material/Article";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import TicketsViewController from "../../components/TicketsViewController";

const baseURL = process.env.REACT_APP_API_BASE_URL;

// Read user_id from JWT (no secret; just decode payload)
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

export default function StudentTickets() {
  const theme = useTheme();
  const navigate = useNavigate();
  const userId = useMemo(getUserIdFromToken, []);
  const [tickets, setTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filterAnchor, setFilterAnchor] = useState(null);
  const [activeFilters, setActiveFilters] = useState({
    sort: null,
    status: null,
    search: "",
  });
  const [hideResolved, setHideResolved] = useState(true);

  const applyFilters = () => {
    let filtered = [...tickets];

    // Apply sort filter
    if (activeFilters.sort === "newest") {
      filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    } else if (activeFilters.sort === "oldest") {
      filtered.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    } else if (activeFilters.sort === "id-asc") {
      filtered.sort((a, b) => a.ticket_id - b.ticket_id);
    } else if (activeFilters.sort === "id-desc") {
      filtered.sort((a, b) => b.ticket_id - a.ticket_id);
    }

    // Apply status filter
    if (activeFilters.status) {
      if (activeFilters.status.toLowerCase() === "escalated") {
        filtered = filtered.filter(
          (ticket) => ticket.escalated === true
        );
      } else {
        filtered = filtered.filter(
        (ticket) =>
          ticket.status?.toLowerCase() === activeFilters.status.toLowerCase()
        );
      }
    }

    // Apply search filter (search by student name)
    if (activeFilters.search) {
      filtered = filtered.filter((ticket) =>
        ticket.userName
          ?.toLowerCase()
          .includes(activeFilters.search.toLowerCase())
      );
    }

    // Hide resolved tickets if toggle is active
    if (hideResolved) {
      filtered = filtered.filter(
        (ticket) => ticket.status?.toLowerCase() !== "resolved"
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

        // Backend: ticketController.getTicketsByUserId
        const res = await fetch(`${baseURL}/api/tickets/user/${userId}`, {
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch student tickets");
        const response = await res.json();

        // Handle both old format (array) and new format (object with pagination)
        const data = response.tickets || response;
        
        if (!Array.isArray(data)) {
          console.error("API response is not an array:", data);
          throw new Error("Invalid API response format");
        }

        const enriched = await Promise.all(
          data.map(async (t) => ({
            ...t,
            userName: await fetchNameFromId(t.student_id),
          }))
        );

        if (!cancelled) {
          setTickets(enriched);
          setFilteredTickets(enriched);
          setCount(enriched.length);
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
  }, [userId]);

  useEffect(() => {
    applyFilters();
  }, [tickets, activeFilters, hideResolved]);

  useEffect(() => {
    if (activeFilters.status && activeFilters.status.toLowerCase() === "resolved") {
      setHideResolved(false);
    }
  }, [activeFilters.status]);

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
            <Typography variant="h6">My Tickets</Typography>
            <Typography variant="body2" color="text.secondary">
              {count} total
            </Typography>
          </Box>
        </Box>
        <Button variant="contained" onClick={() => navigate(-1)}>Back</Button>
      </Box>

      {/* Search and Filter Controls */}
      <Box
        sx={{
          bgcolor: "background.paper",
          border: "1px solid",
          borderColor: "divider",
          p: 2,
          borderRadius: 2,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 2,
            mb: 2,
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
        </Box>

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
              if (activeFilters.status === "Escalated") {
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
          tickets={filteredTickets}
          defaultView="list"
          onOpenTicket={openTicket}
          header={<Typography variant="subtitle2">Tickets</Typography>}
        />
      </Box>
    </Box>
  );
}
