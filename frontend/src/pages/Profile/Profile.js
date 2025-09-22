// ticketing_system/frontend/src/pages/Profile/Profile.js
import React, { useEffect, useState } from 'react';
import { TextField, Button, Typography, Box } from '@mui/material';
import { useTheme } from "@mui/material/styles";
import Cookies from "js-cookie";
import Avatar from '@mui/material/Avatar';
import './Profile.css'
const baseURL = process.env.REACT_APP_API_BASE_URL;

function Profile() {
    const theme = useTheme();
    const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [isEditing,setIsEditing] = useState(false);
  const [editData,setEditData] = useState({name: '',email: ''});
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
  });

  const token = Cookies.get("token"); 


  useEffect(() => {
    fetch(`${baseURL}/api/users/profile`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Server responded with ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setUser(data);
      })
      .catch((err) => {
        console.error('Error fetching user profile:', err);
        setError(err.message);
      });
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!user) {
    return <div>Loading profile...</div>;
  }

  const handleEditClick = () => {
    setEditData({name:user.name,email: user.email});
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    setShowChangePassword(false);
    setPasswordData({ currentPassword: '', newPassword: '' });
  };

  const handleInputChange = (e) => {
    const {name, value} = e.target;
    setEditData(prev => ({...prev,[name]: value}));
  };

  const handleSaveClick = async() => {
    try{
      const response = await fetch(`${baseURL}/api/users/${user.user_id}`, {
        method: "PUT",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editData),
      });      
      if(!response.ok)
      {
        alert(`ERROR failed to update profile. Status ${response.status}`);
        //throw new Error(`failed to update profile. Status ${response.status}`);
      } else {
        const updatedUser = await response.json();
        setUser(updatedUser);
        setIsEditing(false);

      }
    } catch(err){
      console.error("Error updating profile: ",err);
      setError(err.message);
    }
  };

  const handlePasswordInputChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdatePassword = async () => {
    const { currentPassword, newPassword } = passwordData;
    if (!currentPassword || !newPassword) {
      alert("Please fill in both fields.");
      return;
    }
    try {
      const response = await fetch(`${baseURL}/api/users/change-password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to change password. Status ${response.status}`);
      }
  
      alert("Password updated successfully.");
      setPasswordData({ currentPassword: '', newPassword: '' });
      setShowChangePassword(false);
    } catch (err) {
      console.error("Error updating password:", err);
      alert(err.message);    }

  };
  

  const handleChangePasswordClick = () => {
    setShowChangePassword((prev) => !prev);
  };

  return (
    <Box className="profile-container"
         sx={{
             display: 'flex',
             flexDirection: 'column',
             alignItems: 'center',
             justifyContent: 'center',
             maxWidth: 1000,
             margin: '2rem auto',
             padding: 2,
         }}
    >

      <Box className="profile-card"
           sx={{
               background: theme.palette.background.paper,
               borderRadius: 2,
               boxShadow: 1,
               padding: '30px 20px',
               maxWidth: 400,
               width: '100%',
               textAlign: 'center',
               border: `1px solid ${theme.palette.divider}`
           }}
      >
        <Typography variant="h5" sx={{ marginBottom: 2, background: theme.palette.primary.main, color:"white" }}>
          My Profile
        </Typography>
        <Avatar className="profile-avatar"
                sx={{
                    width: 100,
                    height: 100,
                    margin: '20px auto',
                }}
                src={user.profilePicture || ''}>
          {user.name ? user.name.charAt(0).toUpperCase() : ''}
        </Avatar>
        {!isEditing ? (
          <>
            <Box className="profile-details" sx={{ mb: 2.5, '& p': { fontSize: '16px', margin: '6px 0' }, color: theme.palette.text.primary }}>
              <p><strong>Name:</strong> {user.name}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Role:</strong> {user.role}</p>
              {/* <p><strong>ASU ID:</strong> {user.asu_id}</p> */}
            </Box>
            <Box className="redirect-button">
              <Button variant="contained" onClick={handleEditClick}>
                Edit Info
              </Button>
            </Box>
          </>
        ) : (
          <>
            <Box className="profile-edit-form">
              <TextField
                label="Name"
                name="name"
                value={editData.name}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Email"
                name="email"
                value={editData.email}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
              />
            </Box>
            <Box className="profile-edit-buttons">
              <Button variant="contained" color="primary" onClick={handleSaveClick}>
                Save
              </Button>
              <Button variant="outlined" onClick={handleCancelClick} sx={{ marginLeft: 2 }}>
                Cancel
              </Button>
              <Button variant="outlined" onClick={handleChangePasswordClick} sx={{ ml: 1, mt: 2 }}>
                {showChangePassword ? "Hide Change Password" : "Change Password"}
              </Button>
            </Box>
            {showChangePassword && (
              <Box className="change-password-form">
                <TextField
                  label="Current Password"
                  name="currentPassword"
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordInputChange}
                  fullWidth
                  margin="normal"
                />
                <TextField
                  label="New Password"
                  name="newPassword"
                  type="password"
                  value={passwordData.newPassword}
                  onChange={handlePasswordInputChange}
                  fullWidth
                  margin="normal"
                />
                <Box className="password-buttons" style={{ marginTop: 10 }}>
                  <Button variant="contained" color="primary" onClick={handleUpdatePassword}>
                    Update Password
                  </Button>
                </Box>
              </Box>
            )}
          </>
        )}
      </Box>
    </Box>
  );
}

export default Profile;