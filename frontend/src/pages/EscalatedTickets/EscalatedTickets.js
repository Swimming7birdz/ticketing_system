import React, { useEffect, useState } from "react";
import { Box, Typography, Avatar, Button, CircularProgress } from "@mui/material";
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

    useEffect(() => {
    applyFilters();
    }, [tickets, activeFilters]);

    const applyFilters = () => {
        let filtered = tickets.filter(ticket => ticket.escalated === true);

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

        // Search by ticket ID
        if (activeFilters.ticketIdSearch) {
        filtered = filtered.filter(
        (ticket) => ticket.ticket_id.toString() === activeFilters.ticketIdSearch
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

    const fetchNameFromId = async (student_id) => 
    {
      try 
      {
        const token = Cookies.get("token");
        const res = await fetch(`${baseURL}/api/users/${student_id}`, 
        {
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
            console.log("Fetched tickets:", ticketsData);

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
  };

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
        <Button variant="contained" onClick={() => navigate(-1)}>Back</Button>
      </Box>

<<<<<<< HEAD
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
            {/* Show a check if "newest" is the active sort */}
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
              setActiveFilters({ ...activeFilters, status: null});
            } else {
              setActiveFilters({ ...activeFilters, status: "New" })
            }
            handleFilterClose();
          }}  
        >
          { activeFilters.status === "New" && (
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
        </Menu>

        {/* Tickets Grid */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: 2.5,
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
        </Box>
=======
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
          tickets={tickets}
          defaultView="list"
          onOpenTicket={openTicket}
          header={<Typography variant="subtitle2">Escalated</Typography>}
        />
>>>>>>> 19afea1 (WIP: before update)
      </Box>
    </Box>
  );
}
