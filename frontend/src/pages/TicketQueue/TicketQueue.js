import React, { useState, useEffect } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Cookies from 'js-cookie';

const TicketQueue = () => {
    const [tickets, setTickets] = useState([]);

    useEffect(() => {
        const fetchTickets = async () => {
            try {
                // Get the token from cookies
                const token = Cookies.get("token");
                // Change base URL for production
                const response = await fetch(`http://localhost:3302/api/tickets`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch tickets");
                }

                const data = await response.json();


                const detailedTickets = await Promise.all(
                    data.map(async (ticket) => {
                        const detailsResponse = await fetch(`http://localhost:3302/api/tickets/${ticket.ticket_id}`, {
                            method: "GET",
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${token}`,
                            },
                        });
                        if (detailsResponse.ok) {
                            const detailedTicket = await detailsResponse.json();
                            return {
                                ...ticket,
                                student_name: detailedTicket.student_name,
                                team_name: detailedTicket.team_name,
                            };
                        } else {
                            console.error(`Failed to fetch details for ticket ${ticket.ticket_id}`);
                            return ticket; // fallback to original data if details fetch fails
                        }
                    })
                );
                setTickets(detailedTickets); // Assuming data is an array of tickets
            } catch (error) {
                console.error("Error fetching tickets:", error);
                //setError("Could not fetch tickets. Please try again later.");
            }
        };
        fetchTickets();
    }, []);

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
                    {tickets.map((ticket) => (
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

export default TicketQueue