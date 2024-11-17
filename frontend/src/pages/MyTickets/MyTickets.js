import React, { useState, useEffect } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Cookies from 'js-cookie';

// const baseURL = "https://helpdesk.asucapstonetools.com";
const baseURL = "http://localhost:3302";

const MyTickets = ({ user_id }) => {
    const [ticketsForUser, setTicketsForUser] = useState([]);

    useEffect(() => {
        const fetchAssignments = async () => {
            try {
                // Get the token from cookies
                const token = Cookies.get("token");
                // Change base URL for production
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

                const data = await response.json();
                const ticketIds = data
                    .filter(assignment => assignment.user_id === user_id)
                    .map(assignment => assignment.ticket_id);

                // We have ticket ids, now we need to fetch the tickets
                const ticketInformation = async (ticketIds) => {
                    const tickets = await Promise.all(
                        ticketIds.map(async (ticketId) => {
                            const response = await fetch(`${baseURL}/api/tickets/${ticketId}`, {
                                method: "GET",
                                headers: {
                                    "Content-Type": "application/json",
                                    Authorization: `Bearer ${token}`,
                                },
                            });
                            if (response.ok) {
                                const ticket = await response.json();
                                return ticket;
                            } else {
                                console.error(`Failed to fetch ticket ${ticketId}`);
                                return null; // Return null if ticket not found
                            }
                        })
                    );
                    return tickets; // Filter out null values
                };

                setTicketsForUser(await ticketInformation(ticketIds));
            }
            catch (error) {
                console.error("Error fetching ticket assignments:", error);
                //setError("Could not fetch ticket assignments. Please try again later.");
            }
        };
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
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell component="th" scope="row">
                                {ticket.ticket_id}
                            </TableCell>
                            <TableCell sx={{ color: ticket.status === 'ongoing' ? 'blue' : ticket.status === 'escalated' ? 'red' : 'green' }}>{ticket.status}</TableCell>
                            {/* <TableCell>{row.assigned_to}</TableCell> */}
                            <TableCell>{ticket.issue_description}</TableCell>
                            <TableCell>{ticket.student_name}</TableCell>
                            <TableCell>{ticket.team_name}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>

    )
}

export default MyTickets