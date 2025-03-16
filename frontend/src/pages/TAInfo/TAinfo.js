import React from 'react'
import { Avatar, Typography, Button } from '@mui/material';

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

    for (i = 0; i < string.length; i += 1) {
        hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = '#';

    for (i = 0; i < 3; i += 1) {
        const value = (hash >> (i * 8)) & 0xff;
        color += `00${value.toString(16)}`.slice(-2);
    }

    return color;
}


const TAinfo = () => {
    return (
        <div style={{ margin: '50px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20, backgroundColor: 'white', borderRadius: 5, padding: '10px' }}>
                {/* TA Name and Avatar */}
                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10 }}>
                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'left', alignItems: 'flex-start', gap: 10 }}>
                        <Avatar {...stringAvatar('Adam Hughes')} style={{ marginRight: '2px', width: '100px', height: '100px', fontSize: '1.5rem' }} />
                        <div style={{ display: 'flex', flexDirection: 'column', alignSelf: 'center' }}>
                            <Typography variant="h1" sx={{ fontWeight: 'bold', fontSize: '2rem' }}>Adam Hughes</Typography>
                            <Typography variant="h2" sx={{ fontWeight: 'semibold', fontSize: '1rem', color: '#737373' }}>UGTA</Typography>
                            <Typography variant="h3" sx={{ fontSize: '0.8rem', color: '#737373' }}>adhughes@asu.edu</Typography>
                        </div>
                    </div>
                    <div style={{ alignSelf: 'center', margin: '20px' }}>
                        <Button variant="contained" disableElevation sx={{ backgroundColor: '#8C1D40', color: 'white', borderRadius: 999, fontSize: '0.75rem', width: "fit-content", alignSelf: "flex-end" }}>
                            View Tickets
                        </Button>
                    </div>
                </div>
                {/* Ticket Stats */}
                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'flex-start', gap: 10 }}>
                    {/* Left Side */}
                    <div>
                        <Typography variant="h3" sx={{ fontWeight: 'semibold', fontSize: '1.5rem', color: '#737373', alignSelf: 'flex-start', margin: '15px' }}>Tickets</Typography>
                        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly', alignItems: 'flex-start', gap: 5 }}>
                            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                                    <Typography variant="h1" sx={{ fontWeight: 'bold', fontSize: '1rem', color: '#1C741F', marginRight: '3px' }}>Open</Typography>
                                    <Typography variant="h1" sx={{ fontWeight: 'bold', fontSize: '1rem', color: '#D00505', marginRight: '3px' }}>Resolved</Typography>
                                    <Typography variant="h1" sx={{ fontWeight: 'bold', fontSize: '1rem', color: '#1965D8', marginRight: '3px' }}>Escalated</Typography>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                                    <Typography variant="h1" sx={{ fontWeight: 'bold', fontSize: '1rem' }}>10</Typography>
                                    <Typography variant="h1" sx={{ fontWeight: 'bold', fontSize: '1rem' }}>24</Typography>
                                    <Typography variant="h1" sx={{ fontWeight: 'bold', fontSize: '1rem' }}>7</Typography>
                                </div>
                            </div>
                        </div>
                    </div >
                    {/* Right Side */}
                    <div>
                        {/* Working Hours */}
                        <Typography variant="h3" sx={{ fontWeight: 'semibold', fontSize: '1.5rem', color: '#737373', margin: '15px' }}>Working Hours</Typography>
                        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10 }}>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <Typography variant="p" sx={{ fontSize: '1rem' }}>Monday-Friday: 01:00 PM - 02:00 PM</Typography>
                                //<Typography variant="p" sx={{ fontSize: '1rem' }}>Tuesday: 01:00 PM - 02:00 PM</Typography>
                                //<Typography variant="p" sx={{ fontSize: '1rem' }}>Wednesday: 01:00 PM - 02:00 PM</Typography>
                                //<Typography variant="p" sx={{ fontSize: '1rem' }}>Thursday: 01:00 PM - 02:00 PM</Typography>
                                //<Typography variant="p" sx={{ fontSize: '1rem' }}>Friday: 01:00 PM - 02:00 PM</Typography>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TAinfo
