import React from 'react'
import TicketCard from '../components/TicketCard'
import InstructorCard from '../components/InstructorCard'
import ArticleIcon from '@mui/icons-material/Article';
import PeopleIcon from '@mui/icons-material/People';
import { Avatar, Button, Typography } from '@mui/material';

const AdminDash = () => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', backgroundColor: '#DBDADA', padding: 50, gap: 50 }}>
            <Typography variant="h1" sx={{ fontWeight: 'bold', fontSize: '2rem', textAlign: 'center' }}>Admin Dashboard</Typography>
            {/* TICKET SECTION CONTAINER */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20, backgroundColor: '#F5F5F5', padding: 20, borderRadius: 5, flex: 1 }}>
                {/* SECTION HEADER */}
                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10 }}>
                    <Avatar><ArticleIcon sx={{ fontSize: "2rem" }} /></Avatar>
                    <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                        <Typography variant="h1" sx={{ fontWeight: 'bold', fontSize: '2rem' }}>1234</Typography>
                        <Typography variant="p" sx={{ fontSize: '0.8rem', color: '#737373' }}>Total Tickets</Typography>
                    </div>
                    <Button variant="contained" disableElevation sx={{ backgroundColor: '#8C1D40', color: 'white', borderRadius: 999, fontSize: '0.75rem' }}>View All</Button>
                </div>
                {/* TICKETS */}
                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
                    <TicketCard />
                    <TicketCard />
                    <TicketCard />
                </div>
            </div>

            {/* TA SECTION CONTAINER */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20, backgroundColor: '#F5F5F5', padding: 20, borderRadius: 5, flex: 1 }}>
                {/* SECTION HEADER */}
                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10 }}>
                    <Avatar><PeopleIcon sx={{ fontSize: "2rem" }} /></Avatar>
                    <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                        <Typography variant="h1" sx={{ fontWeight: 'bold', fontSize: '2rem' }}>15</Typography>
                        <Typography variant="p" sx={{ fontSize: '0.8rem', color: '#737373' }}>Assignees</Typography>
                    </div>
                    <Button variant="contained" disableElevation sx={{ backgroundColor: '#8C1D40', color: 'white', borderRadius: 999, fontSize: '0.75rem' }}>View All</Button>
                </div>
                {/* TICKETS */}
                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
                    <InstructorCard />
                    <InstructorCard />
                    <InstructorCard />
                </div>
            </div>
        </div>
    )
}

export default AdminDash