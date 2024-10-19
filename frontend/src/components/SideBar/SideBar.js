import React from 'react';
import { Drawer, List, ListItemButton, ListItemText } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import './SideBar.css'
import ASULogo from '../../assets/ASULogo.png'

const SideBar = () => {
    const [selectedPage, setSelectedPage] = React.useState(0);

    return (
        <Drawer
            variant="permanent"
            anchor="left"
            className="sideBar"
            classes={{
                paper: 'sidebar-paper',
            }}
        >
            <img src={ASULogo} alt="Logo" />
            <List component="nav">
                <ListItemButton onClick={() => setSelectedPage(0)} selected={selectedPage === 0}>
                    <ListItemText className="fontStyle" primary="Dashboard" />
                </ListItemButton>
                <ListItemButton onClick={() => setSelectedPage(1)} selected={selectedPage === 1}>
                    <ListItemText className="fontStyle" primary="My Tickets" />
                </ListItemButton>
                <ListItemButton onClick={() => setSelectedPage(2)} selected={selectedPage === 2}>
                    <ListItemText className="fontStyle" primary="Settings" />
                </ListItemButton>
                <ListItemButton onClick={() => setSelectedPage(3)} selected={selectedPage === 3}>
                    <ListItemText className="fontStyle" primary="Log Out" />
                </ListItemButton>
            </List>
        </Drawer>
    )
};

export default SideBar;