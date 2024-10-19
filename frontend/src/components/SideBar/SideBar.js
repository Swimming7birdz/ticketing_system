import React from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import './SideBar.css'
import ASULogo from '../../assets/ASULogo.png'

const SideBar = () => {

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
            <List>
                <ListItem button>
                    <ListItemText className="fontStyle" primary="Dashboard" />
                </ListItem>
                <ListItem button>
                    <ListItemText className="fontStyle" primary="My Tickets" />
                </ListItem>
                <ListItem button>
                    <ListItemText className="fontStyle" primary="Settings" />
                </ListItem>
                <ListItem button>
                    <ListItemText className="fontStyle" primary="Log Out" />
                </ListItem>
            </List>
        </Drawer>
    )
};

export default SideBar;