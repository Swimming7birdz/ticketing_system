import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Stack from '@mui/material/Stack';
import { Avatar } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import PlaceholderProfilePicture from '../../assets/pfp.png'
import './TopBar.css'

const TopBar = () => {

  const handleProfileClick = () => {
    console.log("Profile Clicked")
  }

  return (
    <AppBar position="static" className='topBar'>
      <Toolbar className='toolBar'>
        <Stack className='topBarElements'>
          <IconButton onClick={handleProfileClick}>
            <Avatar alt="Profile Picture" src={PlaceholderProfilePicture} />
          </IconButton>

          {/* Add more topbar elements here  */}

        </Stack>
      </Toolbar>
    </AppBar>
    );
}


export default TopBar;