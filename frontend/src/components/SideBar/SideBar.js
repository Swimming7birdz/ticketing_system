import React from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { useNavigate } from "react-router-dom";
import './SideBar.css'
import ASULogo from '../../assets/ASULogo.png'
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ListIcon from '@mui/icons-material/List';
import LayersIcon from '@mui/icons-material/Layers';


const SideBar = () => {
    let navigate = useNavigate();

    const handleLogout = () => {
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
            <img src={ASULogo} alt="Logo"/>
            <List className='ticketsNavigation'>
                <ListItem button className='buttonStyle' onClick={() => navigate('/dashboard')}>
                    <ListItemIcon>
                        <DashboardIcon className='iconStyle'/>
                    </ListItemIcon>
                    <ListItemText className="fontStyle" primary="Dashboard" />
                </ListItem>
                <ListItem button className='buttonStyle' onClick={() => navigate('/ticketinfo')}> {/* Links to ticketinfo rn for demo purposes*/}
                    <ListItemIcon>
                        <LayersIcon className='iconStyle'/>
                    </ListItemIcon>
                    <ListItemText className="fontStyle" primary="My Tickets" />
                </ListItem>
                <ListItem button className='buttonStyle'>
                    <ListItemIcon>
                        <ListIcon className='iconStyle'/>
                    </ListItemIcon>
                    <ListItemText className="fontStyle" primary="All Tickets" />
                </ListItem>
            </List>
            <List className='settingsAndLogOut'>
                <ListItem button className='buttonStyle'>
                    <ListItemIcon>
                        <SettingsIcon className='iconStyle'/>
                    </ListItemIcon>
                    <ListItemText className="fontStyle" primary="Settings" />
                </ListItem>
                <ListItem button className='buttonStyle' onClick={handleLogout} >
                    <ListItemIcon>
                        <LogoutIcon className='iconStyle'/>
                    </ListItemIcon>
                    <ListItemText className="fontStyle" primary="Log Out" />
                </ListItem>
            </List>
        </Drawer>
    )
};

export default SideBar;