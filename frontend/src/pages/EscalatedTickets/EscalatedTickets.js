import {
  Button,
  CircularProgress,
  Menu,
  MenuItem,
  TextField,
  Typography,
  Box
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import TicketCard from "../../components/TicketCard";

const baseURL = process.env.REACT_APP_API_BASE_URL;

const EscalatedTickets = () => {
    const theme = useTheme();
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalTickets, setTotalTickets] = useState(0);
    const [filterAnchor, setFilterAnchor] = useState(null); 
    const [filteredTickets, setFilteredTickets] = useState([]);
    const [activeFilters, setActiveFilters] = useState({
    sort: null,
    status: null,
    search: "",
    ticketIdSearch: "", 
    });
    
    useEffect(() => {
    fetchTickets();
    }, []);

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

        // Apply search filter
        if (activeFilters.search) {
        filtered = filtered.filter((ticket) =>
            ticket.userName
            .toLowerCase()
            .includes(activeFilters.search.toLowerCase())
        );
        }

        // Search by ticket ID
        //Can repurpose this section for Team Name filter
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
        setActiveFilters({ sort: null, status: null, search: "", ticketIdSearch });
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

    return (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            backgroundColor: theme.palette.background.default,
            p: 6.25,
            gap: 6.25,
          }}
    >
      <Typography
        variant="h1"
        sx={{ fontWeight: "bold", fontSize: "2rem", textAlign: "center" }}
      >
        Escalated Tickets
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
          border: `1px solid ${theme.palette.divider}`
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 2.5,
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

        </Box>

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
      </Box>
    </Box>

    );

}
export default EscalatedTickets;