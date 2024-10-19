import React from 'react'
import Paper from '@mui/material/Paper';
import { Avatar, Chip } from '@mui/material';


function stringAvatar(name) {
    return {
        sx: {
            bgcolor: stringToColor(name),
        },
        children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`,
    };
}

function stringToColor(string) {
    let hash = 0;
    let i;

    /* eslint-disable no-bitwise */
    for (i = 0; i < string.length; i += 1) {
        hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = '#';

    for (i = 0; i < 3; i += 1) {
        const value = (hash >> (i * 8)) & 0xff;
        color += `00${value.toString(16)}`.slice(-2);
    }
    /* eslint-enable no-bitwise */

    return color;
}


const TicketCard = () => {
    return (
        <div className="ticketcard">
            <Paper sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 1 }}>
                <div className="TopHalf" style={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'space-between', alignItems: 'flex-start', margin: 0, padding: 0 }}>
                    <Avatar {...stringAvatar('Kent Dodds')} />
                    <div className="ticketTitle" style={{ textAlign: 'right', justifyContent: 'flex-end', alignItems: 'flex-end', margin: 0, padding: 0 }}>
                        <p style={{ fontWeight: "bold" }}>CPSTN1-45688</p>
                        <p style={{ fontWeight: "bold" }}>Sponsor isn't Responding</p>
                    </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', width: '100%', justifyContent: 'space-between', alignItems: 'flex-start', margin: 0, padding: 0 }}>
                    <div style={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'space-between', alignItems: 'flex-start', margin: 0, padding: 0 }}>
                        <p style={{ fontWeight: 'bold', margin: 0, padding: 0 }}>Status:</p>
                        <Chip label="Ongoing" size="small" sx={{ backgroundColor: '#ADE1BE', color: '#1C741F' }} />
                        <Chip label="Escalated" color="info" size="small" sx={{ backgroundColor: '#A0C0F0', color: '#1965D8' }} />
                        <Chip label="Resolved" color="success" size="small" sx={{ backgroundColor: '#F89795', color: '#D00505' }} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'space-between', alignItems: 'flex-start', margin: 0, padding: 0 }}>
                        <p style={{ fontWeight: 'bold' }}>Name:</p>
                        <p>Kent Dodds</p>
                    </div>
                    <div style={{ alignItems: 'flex-end' }} backgroundColor="green">
                        <Chip label="Open Ticket" size="small" sx={{ backgroundColor: '#8C1D40', color: 'white' }} />
                    </div>
                </div>
            </Paper>

        </div>
    )
}

export default TicketCard