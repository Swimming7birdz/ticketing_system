import React from 'react'
import TicketCard from '../components/TicketCard'
import ArticleIcon from '@mui/icons-material/Article';
import { Chip } from '@mui/material';

const AdminDash = () => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: '#DBDADA' }}>
            <h1>Admin Dashboard</h1>
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly', alignItems: 'center', width: '75%', backgroundColor: '#F5F5F5', margin: 10, padding: 20 }}>
                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'start', alignItems: 'flex-start', width: '100%' }}>
                    <ArticleIcon />
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <h1>1234</h1>
                        <p>Total Tickets</p>
                    </div>
                    <div style={{ alignItems: 'flex-end' }} backgroundColor="green">
                        <Chip label="View All" size="small" sx={{ backgroundColor: '#8C1D40', color: 'white' }} />
                    </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center', width: '100%' }}>
                    <TicketCard />
                    <TicketCard />
                    <TicketCard />
                </div>
            </div>
        </div>
    )
}

export default AdminDash