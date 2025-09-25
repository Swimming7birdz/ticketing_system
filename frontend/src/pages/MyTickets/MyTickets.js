import React, { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, Typography, Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";  // Make sure this import is correct!
import { fetchTicketsByUserId } from "../../services/ticketServices";

const MyTickets = () => {
  const theme = useTheme();
  const [ticketsForUser, setTicketsForUser] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStudentTickets();
  }, []);

  const fetchStudentTickets = async () => {
    try {
      const token = Cookies.get("token");
      if (!token) {
        console.error("No token found!");
        return;
      }

      const decodedToken = jwtDecode(token);
      const userId = decodedToken.id; // Get logged-in student ID

      const studentTickets = await fetchTicketsByUserId(userId); // Fetch tickets directly
      setTicketsForUser(studentTickets);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching student tickets:", error);
      setError("Could not fetch tickets. Please try again later.");
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
    <Box sx={{ backgroundColor: theme.palette.background.default, minHeight: "100vh", padding: 2 }}>
      <TableContainer component={Paper} sx={{ backgroundColor: theme.palette.background.paper }}>
        <Table sx={{ minWidth: 650 }}>
        <TableHead>
          <TableRow>
            <TableCell>Number</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Team</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {ticketsForUser.map((ticket) => (
            <TableRow key={ticket.ticket_id} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
              <TableCell component="th" scope="row">{ticket.ticket_id}</TableCell>
              <TableCell sx={{
                color: ticket.status === "ongoing" ? "blue" : ticket.status === "escalated" ? "red" : "green",
              }}>
                {ticket.status}
              </TableCell>
              <TableCell>{ticket.issue_description}</TableCell>
              <TableCell>{ticket.student_name}</TableCell>
              <TableCell>{ticket.team_name}</TableCell>
            </TableRow>
          ))}
        </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default MyTickets;

