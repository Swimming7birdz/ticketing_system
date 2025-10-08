import React, { useEffect, useState } from "react";
import { Box, Typography, Avatar, Button, CircularProgress, Menu, MenuItem, TextField } from "@mui/material";
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
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [filterAnchor, setFilterAnchor] = useState(null);
  const [activeFilters, setActiveFilters] = useState({
    sort: null,
    status: null,
    search: "",
    ticketIdSearch: "",
  });
  const [hideResolved, setHideResolved] = useState(true);

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

        // Search by ticket ID
        //Can repurpose this section for Team Name filter
        if (activeFilters.ticketIdSearch) {
        filtered = filtered.filter(
        (ticket) => ticket.ticket_id.toString() === activeFilters.ticketIdSearch
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

  useEffect(() => {
    let filtered = [...tickets];

    if (activeFilters.sort === "newest") {
      filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    } else if (activeFilters.sort === "oldest") {
      filtered.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    } else if (activeFilters.sort === "id-asc") {
      filtered.sort((a, b) => a.ticket_id - b.ticket_id);
    } else if (activeFilters.sort === "id-desc") {
      filtered.sort((a, b) => b.ticket_id - a.ticket_id);
    }

    if (activeFilters.status) {
      filtered = filtered.filter(
        (ticket) => ticket.status.toLowerCase() === activeFilters.status.toLowerCase()
      );
    }

    if (activeFilters.search) {
      filtered = filtered.filter((ticket) =>
        ticket.userName?.toLowerCase().includes(activeFilters.search.toLowerCase())
      );
    }

    if (activeFilters.ticketIdSearch) {
      filtered = filtered.filter(
        (ticket) => ticket.ticket_id.toString() === activeFilters.ticketIdSearch
      );
    }

    if (hideResolved) {
      filtered = filtered.filter(
        (ticket) => ticket.status.toLowerCase() !== "resolved"
      );
    }

    setFilteredTickets(filtered);
  }, [tickets, activeFilters, hideResolved]);

  useEffect(() => {
    if (activeFilters.status && activeFilters.status.toLowerCase() === "resolved") {
      setHideResolved(false);
    }
  }, [activeFilters.status]);

  const handleFilterClick = (event) => {
    setFilterAnchor(event.currentTarget);
  };

  const handleFilterClose = () => {
    setFilterAnchor(null);
  };

  const handleClearFilters = () => {
    setActiveFilters({ sort: null, status: null, search: "", ticketIdSearch: "" });
  };

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
        <Box sx={{ display: "flex", gap: 1 }}>
          <TextField
            label="Search by Name"
            variant="outlined"
            value={activeFilters.search}
            onChange={(e) =>
              setActiveFilters({ ...activeFilters, search: e.target.value })
            }
            size="small"
          />
          {/*Can repurpose Textfield to be used for searching by Team Name*/}
          {/* <TextField
            label="Search by Ticket ID"
            variant="outlined"
            value={activeFilters.ticketIdSearch}
            onChange={(e) =>
              setActiveFilters({ ...activeFilters, ticketIdSearch: e.target.value })
            }
            sx={{ flex: 1 }}
          /> */
          /*Can repurpose Textfield to be used for searching by Team Name*/}
          <Button
            variant="contained"
            onClick={handleFilterClick}
            sx={{ backgroundColor: theme.palette.primary.main, color: "white" }}
          >
            size="small"
          />
          <Button variant="contained" onClick={handleFilterClick}>
            {activeFilters.sort || activeFilters.status
              ? `Filters: ${activeFilters.sort || ""} ${activeFilters.status || ""}`
              : "Add Filter"}
          </Button>
          <Button variant="outlined" onClick={handleClearFilters}>
            Clear Filters
          </Button>
          <Button variant="outlined" onClick={() => setHideResolved((p) => !p)}>
            {hideResolved ? "Include Resolved Tickets" : "Hide Resolved Tickets"}
          </Button>
          <Button variant="contained" onClick={() => navigate(-1)}>Back</Button>
        </Box>
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
          header={<Typography variant="subtitle2">Escalated</Typography>}
        />
      </Box>

      <Menu anchorEl={filterAnchor} open={Boolean(filterAnchor)} onClose={handleFilterClose}>
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
          {activeFilters.sort === "newest" && <span style={{ marginRight: 8 }}>✔</span>}
          Newest
        </MenuItem>
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
          {activeFilters.sort === "oldest" && <span style={{ marginRight: 8 }}>✔</span>}
          Oldest
        </MenuItem>
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
          {activeFilters.sort === "id-asc" && <span style={{ marginRight: 8 }}>✔</span>}
          Sort by ID: Ascending
        </MenuItem>
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
          {activeFilters.sort === "id-desc" && <span style={{ marginRight: 8 }}>✔</span>}
          Sort by ID: Descending
        </MenuItem>
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
          {activeFilters.status === "New" && <span style={{ marginRight: 8 }}>✔</span>}
          Status: New
        </MenuItem>
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
          {activeFilters.status === "Ongoing" && <span style={{ marginRight: 8 }}>✔</span>}
          Status: Ongoing
        </MenuItem>
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
          {activeFilters.status === "Resolved" && <span style={{ marginRight: 8 }}>✔</span>}
          Status: Resolved
        </MenuItem>
      </Menu>
    </Box>
  );
}
