import React, { useEffect, useState } from "react";
import { Avatar, Button, Typography, Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import ArticleIcon from "@mui/icons-material/Article";
import CircularProgress from "@mui/material/CircularProgress";
import Cookies from "js-cookie";
import TicketsViewController from "../../components/TicketsViewController";
import Pagination from "../../components/Pagination/Pagination";
import { fetchTicketsByUserId } from "../../services/ticketServices";
import { useNavigate } from "react-router-dom"; // ✅ Import navigation

const baseURL = process.env.REACT_APP_API_BASE_URL;

const StudentDash = () => {
  const theme = useTheme();
  const [allTickets, setAllTickets] = useState([]); // Store all tickets
  const [tickets, setTickets] = useState([]); // Store current page tickets
  const [loading, setLoading] = useState(true);
  const [totalTickets, setTotalTickets] = useState(0);
  const navigate = useNavigate(); // ✅ Initialize navigation function
  
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [pagination, setPagination] = useState({
    totalItems: 0,
    totalPages: 1,
    hasNextPage: false,
    hasPreviousPage: false
  });

  const openTicket = (ticket) => navigate(`/ticketinfo?ticket=${ticket.ticket_id}`);

  const applyPagination = (ticketsList, page, itemsPerPage) => {
    const totalItems = ticketsList.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    
    const paginatedTickets = ticketsList.slice(startIndex, endIndex);
    
    setTickets(paginatedTickets);
    setPagination({
      totalItems: totalItems,
      totalPages: totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1
    });
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  useEffect(() => {
    loadTickets();
  }, []);

  useEffect(() => {
    if (allTickets.length > 0) {
      applyPagination(allTickets, currentPage, itemsPerPage);
    }
  }, [allTickets, currentPage, itemsPerPage]);

  const loadTickets = async () => {
    try {
      const response = await fetchTicketsByUserId();
      
      // Handle both old format (array) and new format (object with pagination)
      const studentTickets = response.tickets || response;
      
      // Add userName property for TicketsViewController consistency
      const ticketsWithUserName = studentTickets.map(ticket => ({
        ...ticket,
        userName: ticket.student_name || "Unknown"
      }));
      
      setAllTickets(ticketsWithUserName); // Store all tickets
      setTotalTickets(response.pagination ? response.pagination.totalItems : ticketsWithUserName.length);
      
      applyPagination(ticketsWithUserName, currentPage, itemsPerPage);
      
      setLoading(false);
    } catch (error) {
      console.error("Error fetching student tickets:", error);
      setAllTickets([]);
      setTickets([]);
      setPagination({
        totalItems: 0,
        totalPages: 1,
        hasNextPage: false,
        hasPreviousPage: false
      });
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
        Student Dashboard
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
            onClick={() => navigate("/mytickets")} // ✅ Navigate to all student tickets
          >
            View All
          </Button>
        </div>

        {/* TICKETS */}
        <TicketsViewController
          tickets={tickets}
          defaultView="grid"
          onOpenTicket={openTicket}
          header={<Typography variant="subtitle2">
            {pagination.totalPages > 1 ? `My Tickets (Page ${currentPage} of ${pagination.totalPages})` : "My Tickets"}
          </Typography>}
        />
        
        {/* PAGINATION */}
        {pagination.totalPages > 1 && (
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
            <Pagination
              currentPage={currentPage}
              totalPages={pagination.totalPages}
              itemsPerPage={itemsPerPage}
              totalItems={pagination.totalItems}
              hasNextPage={pagination.hasNextPage}
              hasPreviousPage={pagination.hasPreviousPage}
              onPageChange={handlePageChange}
              onItemsPerPageChange={handleItemsPerPageChange}
              itemsPerPageOptions={[5, 10, 25, 50]}
            />
          </Box>
        )}
        
        {/* NO TICKETS MESSAGE */}
        {tickets.length === 0 && !loading && (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body1" color="text.secondary">
              You haven't submitted any tickets yet.
            </Typography>
            <Button
              variant="contained"
              sx={{ mt: 2 }}
              onClick={() => navigate("/createticket")}
            >
              Create Your First Ticket
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default StudentDash;
