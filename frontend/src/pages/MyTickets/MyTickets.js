import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
const baseURL = process.env.REACT_APP_API_BASE_URL;

const MyTickets = ({ user_id }) => {
  const [ticketsForUser, setTicketsForUser] = useState([]);
  const [error, setError] = useState(null);

  const fetchAssignments = async () => {
    try {
      // Get the token from cookies
      const token = Cookies.get("token");

      // Fetch ticket assignments
      const response = await fetch(`${baseURL}/api/ticketassignments`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch ticket assignments");
      }

      const assignments = await response.json();

      // Filter assignments by user_id and extract ticket_ids
      const ticketIds = assignments
        .filter((assignment) => assignment.user_id === user_id)
        .map((assignment) => assignment.ticket_id);

      if (ticketIds.length === 0) {
        setTicketsForUser([]); // No tickets for the user
        return;
      }

      // Fetch tickets for the filtered ticketIds
      const tickets = await Promise.all(
        ticketIds.map(async (ticketId) => {
          try {
            const ticketResponse = await fetch(
              `${baseURL}/api/tickets/${ticketId}`,
              {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            if (!ticketResponse.ok) {
              console.error(`Failed to fetch ticket ${ticketId}`);
              return null; // Skip invalid tickets
            }

            return await ticketResponse.json();
          } catch (err) {
            console.error(`Error fetching ticket ${ticketId}:`, err);
            return null; // Skip in case of other errors
          }
        })
      );

      // Filter out null values
      setTicketsForUser(tickets.filter((ticket) => ticket !== null));
    } catch (error) {
      console.error("Error fetching ticket assignments:", error);
      setError("Could not fetch ticket assignments. Please try again later.");
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, [user_id]);

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }}>
        <TableHead>
          <TableRow>
            <TableCell>Number</TableCell>
            <TableCell>Status</TableCell>
            {/* <TableCell>Assigned to</TableCell> */}
            <TableCell>Description</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Team</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {ticketsForUser.map((ticket) => (
            <TableRow
              key={ticket.ticket_id}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {ticket.ticket_id}
              </TableCell>
              <TableCell
                sx={{
                  color:
                    ticket.status === "ongoing"
                      ? "blue"
                      : ticket.status === "escalated"
                      ? "red"
                      : "green",
                }}
              >
                {ticket.status}
              </TableCell>
              {/* <TableCell>{row.assigned_to}</TableCell> */}
              <TableCell>{ticket.issue_description}</TableCell>
              <TableCell>{ticket.student_name}</TableCell>
              <TableCell>{ticket.team_name}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default MyTickets;
