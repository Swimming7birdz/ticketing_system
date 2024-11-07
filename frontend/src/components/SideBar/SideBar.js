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
import AddCircleIcon from '@mui/icons-material/AddCircle';
import Cookies from 'js-cookie';
import { jwtDecode } from "jwt-decode";


const SideBar = () => {
    const [selectedPage, setSelectedPage] = React.useState(0);
    let navigate = useNavigate();

    const token = Cookies.get('token');
    const decodedToken = jwtDecode(token);
    const userType = decodedToken.role;

    const handleLogout = () => {
        setSelectedPage(4)
        Cookies.remove('token')
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
                    if (userType == "admin") {
                        navigate('/admindash');
                    }
                    else if (userType == "student") {
                        navigate('/studentdash')
                    }
                    else if (userType == "TA") {
                        navigate('/instructordash')
                    }
                }}>
                    <ListItemIcon>
                        <DashboardIcon className='iconStyle' />
                    </ListItemIcon>
                    <ListItemText className="fontStyle" primary="Dashboard" />
                </ListItemButton>
                <ListItemButton className='buttonStyle' selected={selectedPage === 1} onClick={() => {
                    setSelectedPage(1);
                    navigate(`/ticketinfo?ticket=1`);
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
                <ListItemButton className='buttonStyle' selected={selectedPage === 3} onClick={() => {
                    setSelectedPage(3);
                    navigate('ticketsubmit')
                }}>
                    <ListItemIcon>
                        <AddCircleIcon className='iconStyle'/>
                    </ListItemIcon>
                    <ListItemText className="fontStyle" primary="Create A Ticket" />
                </ListItemButton>
            </List>

            <List className='settingsAndLogOut'>
                <ListItemButton className='buttonStyle' onClick={() => setSelectedPage(4)} selected={selectedPage === 4}>
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