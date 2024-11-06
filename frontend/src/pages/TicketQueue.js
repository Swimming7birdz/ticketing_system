import React, { useState, useEffect } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

const TicketQueue = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        const rows = [];

        const statuses = ["Ongoing", "Escalated", "Resolved"];
        const assignedTos = ["Adam Smith", "Kent Dodds", "Gina Matthews", "Jane Doe"];

        for (let index = 0; index < 50; index++) {
            rows.push({
                number: `CPSTN-2357${index % 10}`,
                status: statuses[Math.floor(Math.random() * statuses.length)],
                assigned_to: assignedTos[Math.floor(Math.random() * assignedTos.length)],
                description: "This is a description",
                name: assignedTos[Math.floor(Math.random() * assignedTos.length)],
            })
        }

        setData(rows);
    }, []);

    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }}>
                <TableHead>
                    <TableRow>
                        <TableCell>Number</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Assigned to</TableCell>
                        <TableCell>Description</TableCell>
                        <TableCell>Name</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.map((row) => (
                        <TableRow
                            key={row.number}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell component="th" scope="row">
                                {row.number}
                            </TableCell>
                            <TableCell sx={{ color: row.status === 'Ongoing' ? 'blue' : row.status === 'Escalated' ? 'red' : 'green' }}>{row.status}</TableCell>
                            <TableCell>{row.assigned_to}</TableCell>
                            <TableCell>{row.description}</TableCell>
                            <TableCell>{row.name}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>

    )
}

export default TicketQueue