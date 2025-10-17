import {
  Button,
  CircularProgress,
  Menu,
  MenuItem,
  TextField,
  Typography,
  Box,
  Avatar,
} from "@mui/material";
import ArticleIcon from "@mui/icons-material/Article";
import { useTheme } from "@mui/material/styles";
import Cookies from "js-cookie";
import React, { act, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TicketsViewController from "../../components/TicketsViewController";
import TaTicketsViewController from "../../components/TaTicketsViewController";

const baseURL = process.env.REACT_APP_API_BASE_URL;

const AllTickets = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalTickets, setTotalTickets] = useState(0);
  const [escalatedTickets, setEscalatedTickets] = useState(0);
  const [openTickets, setOpenTickets] = useState(0);
  const [closedTickets, setClosedTickets] = useState(0);
  const [filterAnchor, setFilterAnchor] = useState(null);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [activeFilters, setActiveFilters] = useState({
    sort: null,
    status: null,
    source: null,
    search: "",
    teamNameSearch: "",
  });

  const [hideResolved, setHideResolved] = useState(true);

  useEffect(() => {
    fetchTickets();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [tickets, activeFilters]);

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
      filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    } else if (activeFilters.sort === "oldest") {
      filtered.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    } else if (activeFilters.sort === "id-asc") {
      filtered.sort((a, b) => a.ticket_id - b.ticket_id);
    } else if (activeFilters.sort === "id-desc") {
      filtered.sort((a, b) => b.ticket_id - a.ticket_id);
    }

    // Apply status filter
    if(activeFilters.status) {
      if (activeFilters.status.toLowerCase() === "escalated") {
        filtered = filtered.filter(
          (ticket) => ticket.escalated === true
        );
      } else {
        filtered = filtered.filter(
          (ticket) => ticket.status.toLowerCase() === activeFilters.status.toLowerCase()
        );
      }
    }

    // Apply search filter
    if (activeFilters.search) {
      filtered = filtered.filter((ticket) =>
        ticket.userName
          .toLowerCase()
          .includes(activeFilters.search.toLowerCase())
      );
    }

    // Search by ticket ID
    if (activeFilters.ticketIdSearch) {
      filtered = filtered.filter(
        (ticket) => ticket.ticket_id.toString() === activeFilters.ticketIdSearch
      );
    }

    if (activeFilters.teamNameSearch) {
      filtered = filtered.filter((ticket) =>
        ticket.teamName
          .toLowerCase()
          .includes(activeFilters.teamNameSearch.toLowerCase())
      );
    }

    if (hideResolved) {
      filtered = filtered.filter(
        (ticket) => ticket.status.toLowerCase() !== "resolved"
      );
    }
      // Apply source filter
    if (activeFilters.source) {
        const source_type = activeFilters.source === 'student' ? 'regular' : 'ta';
          filtered = filtered.filter(
              (ticket) => ticket.source === source_type
          );
    }

    if (hideResolved) {
        filtered = filtered.filter(
            (ticket) => ticket.status.toLowerCase() !== "resolved"
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
    setActiveFilters({ sort: null, status: null, source: null, search: "", teamIdSearch: "" });
  };

    const fetchUserNameForTicket = async (ticket) => {
        // 1. Determine which ID to use based on the ticket's source
        const userId = ticket.source === 'ta' ? ticket.ta_id : ticket.student_id;

        // 2. Handle cases where the ticket might not have an ID
        if (!userId) {
            console.warn("Ticket object is missing a valid ID.", ticket);
            return "Unknown Name";
        }

        try {
            const token = Cookies.get("token");
            // 3. Use the determined userId in the API call
            const response = await fetch(`${baseURL}/api/users/${userId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                console.warn(`Failed to fetch user name for ID: ${userId}`);
                return "Unknown Name";
            }

            const data = await response.json();
            return data.name;
        } catch (error) {
            console.error(`Error fetching name for ID ${userId}:`, error);
            return "Unknown Name";
        }
    };

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
        console.warn(`Failed to fetch team name for ticket ${team_id}`);
        return "Unknown Name";
      }

      const data = await response.json();
      return data.team_name;
    } catch (error) {
      console.error(`Error fetching name for ticket ${team_id}:`, error);
      return "Unknown Name";
    }
  };

    const fetchTickets = async () => {
        try {
            const token = Cookies.get("token");
            const headers = {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            };

            // 1. Create promises for both fetch requests
            const ticketsPromise = fetch(`${baseURL}/api/tickets`, { method: "GET", headers });
            const taTicketsPromise = fetch(`${baseURL}/api/tatickets`, { method: "GET", headers });

            // 2. Await both promises to resolve concurrently
            const [ticketsResponse, taTicketsResponse] = await Promise.all([
                ticketsPromise,
                taTicketsPromise,
            ]);

            // Check if either request failed
            if (!ticketsResponse.ok || !taTicketsResponse.ok) {
                throw new Error("Failed to fetch one or more ticket lists");
            }

            // 3. Get the JSON data from both responses
            const ticketsData = await ticketsResponse.json();
            const taTicketsData = await taTicketsResponse.json();

            // Add a 'source' property to each ticket from the regular endpoint
            const sourcedTickets = ticketsData.map(ticket => ({ ...ticket, source: 'regular' }));

            // Add a 'source' property to each ticket from the TA endpoint
            const sourcedTaTickets = taTicketsData.map(ticket => ({ ...ticket, source: 'ta' }));

            // 4. Combine the two arrays into one
            const allTicketsData = [...sourcedTickets, ...sourcedTaTickets];

            // The rest of the logic remains the same, but operates on the combined array
            const ticketsWithNames = await Promise.all(
                allTicketsData.map(async (ticket) => {
                    const userName = await fetchUserNameForTicket(ticket); // New call
                    const teamName = await fetchTeamNameFromId(ticket.team_id);
          return { ...ticket, userName, teamName };
        })
      );


      // Calculate ticket counts
      const escalatedCount = ticketsWithNames.filter(ticket =>
        ticket.escalated === true
      ).length;

      const openCount = ticketsWithNames.filter(ticket =>
        ticket.status === "new" || ticket.status === "ongoing"
      ).length;
                const closedCount = ticketsWithNames.filter(ticket =>
            ticket.status === "resolved"
      ).length;

            setTickets(ticketsWithNames);
            setTotalTickets(allTicketsData.length); // Use the combined length
            setEscalatedTickets(escalatedCount);
      setOpenTickets(openCount);
      setClosedTickets(closedCount);setLoading(false);
        } catch (error) {
            console.error("Error fetching tickets:", error);
            setLoading(false);
        }
    };

  const toggleHideResolved = () => {
    setHideResolved((prev) => !prev);
  };

  const openTicket = (t) => navigate(`/ticketinfo?ticket=${t.ticket_id}`);

    // Add this logic before the return statement
    const studentTickets = filteredTickets.filter(
        (ticket) => ticket.source === 'regular'
    );
    const taTickets = filteredTickets.filter(
        (ticket) => ticket.source === 'ta'
    );

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
        All Tickets
      </Typography>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2.5,
          backgroundColor: theme.palette.background.paper,
          padding: 2.5,
          borderRadius: 1,
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
        </div>
      </Box>

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
            label="Search by Team Name"
            variant="outlined"
            value={activeFilters.teamNameSearch}
            onChange={(e) =>
              setActiveFilters({ ...activeFilters, teamNameSearch: e.target.value })
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
            {hideResolved ? "Include Resolved Tickets" : "Hide Resolved Tickets"}
          </Button>
        </div>

        {/* Filter Dropdown */}
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
                setActiveFilters({ ...activeFilters, status: "Escalated" });
              }
              handleFilterClose();
            }}
          >
            {activeFilters.status === "Escalated" && (
              <span style={{ marginRight: 8 }}>✔</span>
            )}
            Status: Escalated
          </MenuItem>

            {/* Source: Student */}
            <MenuItem
                onClick={() => {
                    setActiveFilters({
                        ...activeFilters,
                        source: activeFilters.source === "student" ? null : "student",
                    });
                    handleFilterClose();
                }}
            >
                {activeFilters.source === "student" && (
                    <span style={{ marginRight: 8 }}>✔</span>
                )}
                Source: Student
            </MenuItem>

            {/* Source: TA */}
            <MenuItem
                onClick={() => {
                    setActiveFilters({
                        ...activeFilters,
                        source: activeFilters.source === "ta" ? null : "ta",
                    });
                    handleFilterClose();
                }}
            >
                {activeFilters.source === "ta" && (
                    <span style={{ marginRight: 8 }}>✔</span>
                )}
                Source: TA
            </MenuItem>
        </Menu>

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
              {/* Render Student Tickets Section */}
              {studentTickets.length > 0 && (
                  <>
                      <Typography variant="h6" sx={{ mb: 1 }}>
                          Student Tickets
                      </Typography>
                      <TicketsViewController
                          tickets={studentTickets}
                          defaultView="list"
                          onOpenTicket={(t) => navigate(`/ticketinfo?ticket=${t.ticket_id}`)}
                      />
                  </>
              )}

              {/* Render TA Tickets Section */}
              {taTickets.length > 0 && (
                  <>
                      <Typography
                          variant="h6"
                          sx={{ mb: 1, mt: studentTickets.length > 0 ? 4 : 0 }}
                      >
                          TA Tickets
                      </Typography>
                      <TaTicketsViewController
                          tickets={taTickets}
                          defaultView="list"
                          onOpenTicket={(t) => navigate(`/taticketinfo?ticket=${t.ticket_id}`)}
                      />
                  </>
              )}

              {/* Display a message if no tickets match the filters */}
              {filteredTickets.length === 0 && (
                  <Typography>No tickets to display.</Typography>
              )}
          </Box>
      </Box>
    </Box>
  );
};

export default AllTickets;
