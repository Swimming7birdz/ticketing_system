import React, { useEffect, useState } from "react";
import { Avatar, Button, Typography, Box, TextField, Menu, MenuItem } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import ArticleIcon from "@mui/icons-material/Article";
import CircularProgress from "@mui/material/CircularProgress";
import Cookies from "js-cookie";
import TicketsViewController from "../../components/TicketsViewController";
import TaTicketsViewController from "../../components/TaTicketsViewController";
import { fetchTicketAssignmentsByUserId, fetchTicketById, fetchTaTicketAssignmentsByUserId, fetchTaTicketById } from "../../services/ticketServices";
import { useNavigate } from "react-router-dom";

const baseURL = process.env.REACT_APP_API_BASE_URL;

const InstructorTickets = () => {
    const theme = useTheme();
    // ... (all other state declarations remain the same) ...
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
        source: null,
        search: "",
        teamNameSearch: "",
    });
    const [hideResolved, setHideResolved] = useState(true);
    let navigate = useNavigate();

    const openTicket = (ticket) => {
        if (ticket.type === "ta") {
            navigate(`/taticketinfo?ticket=${ticket.ticket_id}`);
        } else {
            navigate(`/ticketinfo?ticket=${ticket.ticket_id}`);
        }
    };

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
                filtered = filtered.filter((ticket) => ticket.escalated === true);
            } else {
                filtered = filtered.filter(
                    (ticket) =>
                        ticket.status?.toLowerCase() === activeFilters.status.toLowerCase()
                );
            }
        }

        // Apply search filter (search by user name)
        if (activeFilters.search) {
            filtered = filtered.filter((ticket) =>
                ticket.userName
                    ?.toLowerCase()
                    .includes(activeFilters.search.toLowerCase())
            );
        }

        // Search by ticket ID
        if (activeFilters.ticketIdSearch) {
            filtered = filtered.filter(
                (ticket) => ticket.ticket_id?.toString() === activeFilters.ticketIdSearch
            );
        }

        // Apply search filter (search by team name)
        if (activeFilters.teamNameSearch) {
            filtered = filtered.filter((ticket) =>
                ticket.teamName
                    ?.toLowerCase()
                    .includes(activeFilters.teamNameSearch.toLowerCase())
            );
        }

        // Apply source filter
        if (activeFilters.source) {
            filtered = filtered.filter(
                (ticket) => ticket.type === activeFilters.source
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
        setActiveFilters({ sort: null, status: null, source: null, search: "", teamNameSearch: "" });
    };

    // Fetch a user's name from their ID.
    const fetchUserNameById = async (userId) => {
        if (!userId) return "Unknown";
        try {
            const token = Cookies.get("token");
            const res = await fetch(`${baseURL}/api/users/${userId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!res.ok) {
                console.warn(`Failed to fetch name for user_id=${userId}`);
                return "Unknown";
            }
            const data = await res.json();
            return data?.name || "Unknown";
        } catch (error) {
            console.error(`Error fetching name for user_id=${userId}:`, error);
            return "Unknown";
        }
    };

    const fetchTeamNameFromId = async (team_id) => {
        try {
            const token = Cookies.get("token");
            const res = await fetch(`${baseURL}/api/teams/${team_id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!res.ok) {
                console.warn(
                    `Failed to fetch user name for team_id=${team_id} (status ${res.status})`
                );
                return "Unknown";
            }

            const data = await res.json();
            return data?.team_name || "Unknown";
        } catch (error) {
            console.error(`Error fetching name for team_id=${team_id}:`, error);
            return "Unknown";
        }
    };

    const filterUniqueTickets = (tickets) => {
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
        return tickets.sort((a, b) => a.ticket_id - b.ticket_id);
    };

    // Load Tickets Assignments
    const loadTickets = async () => {
        try {
            const [instructorAssignments, taAssignments] = await Promise.all([
                fetchTicketAssignmentsByUserId(),
                fetchTaTicketAssignmentsByUserId(),
            ]);

            const typedInstructorAssignments = instructorAssignments.map((ticket) => ({
                ...ticket,
                type: "student",
            }));
            const typedTaAssignments = taAssignments.map((ticket) => ({
                ...ticket,
                type: "ta",
            }));

            const combinedAssignments = [
                ...typedInstructorAssignments,
                ...typedTaAssignments,
            ];

            const sortedTickets = sortTicketsById(combinedAssignments);
            const uniqueTickets = filterUniqueTickets(sortedTickets);

            const ticketList = await Promise.all(
                uniqueTickets.map(async (ticket_) => {
                    let ticketData;
                    if (ticket_.type === "ta") {
                        ticketData = await fetchTaTicketById(ticket_.ticket_id);
                    } else {
                        ticketData = await fetchTicketById(ticket_.ticket_id);
                    }

                    const teamName = await fetchTeamNameFromId(ticketData.team_id);

                    let userName;
                    if (ticket_.type === 'ta') {
                        // For TA tickets, fetch the name using the new helper function and the ta_id.
                        userName = await fetchUserNameById(ticketData.ta_id);
                    } else {
                        // For student tickets, the name is already nested in the object.
                        userName = ticketData.student?.name || "Unknown Student";
                    }

                    return {
                        ...ticketData,
                        userName: userName,
                        teamName: teamName,
                        ticketData: ticketData,
                        type: ticket_.type,
                    };
                })
            );

            const escalatedCount = ticketList.filter(
                (ticket) => ticket.escalated === true
            ).length;
            const openCount = ticketList.filter(
                (ticket) => ticket.status === "new" || ticket.status === "ongoing"
            ).length;
            const closedCount = ticketList.filter(
                (ticket) => ticket.status === "resolved"
            ).length;

            setTickets(ticketList);
            setFilteredTickets(ticketList);
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

    const studentTickets = filteredTickets.filter(
        (ticket) => ticket.type === "student"
    );
    const taTickets = filteredTickets.filter((ticket) => ticket.type === "ta");

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
                <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.25 }}>
                    <Avatar>
                        <ArticleIcon sx={{ fontSize: "2rem" }} />
                    </Avatar>
                    <Box sx={{ display: "flex", flexDirection: "column", flex: 1 }}>
                        <Typography variant="h1" sx={{ fontWeight: 'bold', fontSize: '2rem' }}>
                            {totalTickets}
                        </Typography>
                        <Typography variant="p" sx={{ fontSize: '0.8rem', color: 'text.secondary' }}>
                            Total Tickets
                        </Typography>
                    </Box>
                    <Box sx={{ display: "flex", flexDirection: "column", flex: 1 }}>
                        <Typography variant="h1" sx={{ fontWeight: 'bold', fontSize: '2rem' }}>
                            {openTickets}
                        </Typography>
                        <Typography variant="p" sx={{ fontSize: '0.8rem', color: 'text.secondary' }}>
                            Open
                        </Typography>
                    </Box>
                    <Box sx={{ display: "flex", flexDirection: "column", flex: 1 }}>
                        <Typography variant="h1" sx={{ fontWeight: 'bold', fontSize: '2rem' }}>
                            {escalatedTickets}
                        </Typography>
                        <Typography variant="p" sx={{ fontSize: '0.8rem', color: 'text.secondary' }}>
                            Escalated
                        </Typography>
                    </Box>
                    <Box sx={{ display: "flex", flexDirection: "column", flex: 1 }}>
                        <Typography variant="h1" sx={{ fontWeight: 'bold', fontSize: '2rem' }}>
                            {closedTickets}
                        </Typography>
                        <Typography variant="p" sx={{ fontSize: '0.8rem', color: 'text.secondary' }}>
                            Closed
                        </Typography>
                    </Box>
                    <Button
                        variant="contained"
                        disableElevation
                        sx={{
                            backgroundColor: "primary.main",
                            color: "white",
                            borderRadius: 999,
                            fontSize: "0.75rem",
                        }}
                        onClick={() => navigate("/instructordash")}
                    >
                        Back to Dashboard
                    </Button>
                </Box>

                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 2.5, }}>
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
                        sx={{ backgroundColor: "primary.main", color: "white" }}
                    >
                        {activeFilters.sort || activeFilters.status || activeFilters.source
                            ? `Filters Active`
                            : "Add Filter"}
                    </Button>
                    <Button
                        variant="outlined"
                        onClick={handleClearFilters}
                        sx={{ borderColor: "primary.main", color: "primary.main" }}
                    >
                        Clear Filters
                    </Button>
                    <Button
                        variant="outlined"
                        onClick={() => setHideResolved(prev => !prev)}
                        sx={{ borderColor: "primary.main", color: "primary.main" }}
                    >
                        {hideResolved ? "Include Resolved" : "Hide Resolved"}
                    </Button>
                </Box>

                <Menu anchorEl={filterAnchor} open={Boolean(filterAnchor)} onClose={handleFilterClose}>
                    <MenuItem onClick={() => { setActiveFilters({ ...activeFilters, sort: activeFilters.sort === "newest" ? null : "newest" }); handleFilterClose(); }}>
                        {activeFilters.sort === "newest" && (<span style={{ marginRight: 8 }}>✔</span>)} Newest
                    </MenuItem>
                    <MenuItem onClick={() => { setActiveFilters({ ...activeFilters, sort: activeFilters.sort === "oldest" ? null : "oldest" }); handleFilterClose(); }}>
                        {activeFilters.sort === "oldest" && (<span style={{ marginRight: 8 }}>✔</span>)} Oldest
                    </MenuItem>
                    <MenuItem onClick={() => { setActiveFilters({ ...activeFilters, status: activeFilters.status === "New" ? null : "New" }); handleFilterClose(); }}>
                        {activeFilters.status === "New" && (<span style={{ marginRight: 8 }}>✔</span>)} Status: New
                    </MenuItem>
                    <MenuItem onClick={() => { setActiveFilters({ ...activeFilters, status: activeFilters.status === "Ongoing" ? null : "Ongoing" }); handleFilterClose(); }}>
                        {activeFilters.status === "Ongoing" && (<span style={{ marginRight: 8 }}>✔</span>)} Status: Ongoing
                    </MenuItem>
                    <MenuItem onClick={() => { setActiveFilters({ ...activeFilters, status: activeFilters.status === "Resolved" ? null : "Resolved" }); handleFilterClose(); }}>
                        {activeFilters.status === "Resolved" && (<span style={{ marginRight: 8 }}>✔</span>)} Status: Resolved
                    </MenuItem>
                    <MenuItem onClick={() => { setActiveFilters({ ...activeFilters, status: activeFilters.status === "Escalated" ? null : "Escalated" }); handleFilterClose(); }}>
                        {activeFilters.status === "Escalated" && (<span style={{ marginRight: 8 }}>✔</span>)} Status: Escalated
                    </MenuItem>
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

                <Box>
                    {studentTickets.length > 0 && (
                        <Box>
                            <Typography variant="h6" sx={{ mb: 2, mt: 2 }}>
                                Student Tickets
                            </Typography>
                            <TicketsViewController
                                tickets={studentTickets}
                                defaultView="grid"
                                onOpenTicket={openTicket}
                            />
                        </Box>
                    )}

                    {taTickets.length > 0 && (
                        <Box>
                            <Typography
                                variant="h6"
                                sx={{ mb: 2, mt: studentTickets.length > 0 ? 4 : 2 }}
                            >
                                TA Tickets
                            </Typography>
                            <TaTicketsViewController
                                tickets={taTickets}
                                defaultView="grid"
                                onOpenTicket={openTicket}
                            />
                        </Box>
                    )}

                    {filteredTickets.length === 0 && (
                        <Typography sx={{ mt: 4, textAlign: 'center' }}>
                            No assigned tickets match the current filters.
                        </Typography>
                    )}
                </Box>
            </Box>
        </Box>
    );
};

export default InstructorTickets;