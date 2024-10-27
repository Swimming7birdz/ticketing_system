import React from 'react';
import { useTheme } from '@mui/material/styles';
import { Drawer, List, ListItem, ListItemIcon, ListItemButton, ListItemText } from '@mui/material';
import { useNavigate } from "react-router-dom";
import './SideBar.css'
import ASULogo from '../../assets/ASULogo.png'
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ListIcon from '@mui/icons-material/List';
import LayersIcon from '@mui/icons-material/Layers';


const SideBar = () => {
    const [selectedPage, setSelectedPage] = React.useState(0);
    let navigate = useNavigate();

    const handleLogout = () => {
        setSelectedPage(4)
        navigate('/login')
    }

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
            <List className='ticketsNavigation'>
                <ListItemButton className='buttonStyle' selected={selectedPage === 0} onClick={() => {
                    setSelectedPage(0);
                    navigate('/admindash');
                    /* Links to admindash rn for demo purposes*/
                }}>
                    <ListItemIcon>
                        <DashboardIcon className='iconStyle' />
                    </ListItemIcon>
                    <ListItemText className="fontStyle" primary="Dashboard" />
                </ListItemButton>
                <ListItemButton className='buttonStyle' selected={selectedPage === 1} onClick={() => {
                    setSelectedPage(1);
                    navigate('/ticketinfo');
                    /* Links to ticketinfo rn for demo purposes*/
                }}>
                    <ListItemIcon>
                        <LayersIcon className='iconStyle' />
                    </ListItemIcon>
                    <ListItemText className="fontStyle" primary="My Tickets" />
                </ListItemButton>
                <ListItemButton className='buttonStyle' selected={selectedPage === 2} onClick={() => {
                    setSelectedPage(2);
                    navigate('/ticketqueue');
                }} >
                    <ListItemIcon>
                        <ListIcon className='iconStyle' />
                    </ListItemIcon>
                    <ListItemText className="fontStyle" primary="All Tickets" />
                </ListItemButton>
            </List>

            <List className='settingsAndLogOut'>
                <ListItemButton className='buttonStyle' onClick={() => setSelectedPage(3)} selected={selectedPage === 3}>
                    <ListItemIcon>
                        <SettingsIcon className='iconStyle' />
                    </ListItemIcon>
                    <ListItemText className="fontStyle" primary="Settings" />
                </ListItemButton>
                <ListItemButton className='buttonStyle' onClick={handleLogout}>
                    <ListItemIcon>
                        <LogoutIcon className='iconStyle' />
                    </ListItemIcon>
                    <ListItemText className="fontStyle" primary="Log Out" />
                </ListItemButton>
            </List>
        </Drawer>

    )
};

export default SideBar;