// ticketing_system/frontend/src/pages/Profile/Profile.js
import React, { useEffect, useState } from 'react';
import { TextField, Button, Typography } from '@mui/material';
import Cookies from "js-cookie";
import Avatar from '@mui/material/Avatar';
import './Profile.css'
const baseURL = process.env.REACT_APP_API_BASE_URL;

function Profile() {
  const [user, setUser] = useState(null);  
  const [error, setError] = useState(null);
  const [isEditing,setIsEditing] = useState(false);
  const [editData,setEditData] = useState({name: '',email: ''});
  

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
        throw new Error(`failed to update profile. Status ${response.status}`);
      }
      const updatedUser = await response.json();
      setUser(updatedUser);
      setIsEditing(false);
    } catch(err){
      console.error("Error updating profile: ",err);
      setError(err.message);
    }
  };

  const handleChangePasswordClick = async() => {
    alert("Change pass coming soon");
  };

  return (
    <div className="profile-container">
      <div className='profile-card'>
        <Avatar className="profile-avatar" src={user.profilePicture || ''}>
          {user.name ? user.name.charAt(0).toUpperCase() : ''}
        </Avatar>
        {!isEditing ? (
          <>
            <div className="profile-details">
              <p><strong>Name:</strong> {user.name}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Role:</strong> {user.role}</p>
            </div>
            <div className="redirect-button">
              <button onClick={handleEditClick}>
                Edit Info
              </button>
            </div>
          </>
        ) : (
          <>
          <div className="profile-edit-form">
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
          </div>
          <div className="profile-edit-buttons">
              <Button variant="contained" color="primary" onClick={handleSaveClick}>
                Save
              </Button>
              <Button variant="outlined" onClick={handleCancelClick} style={{ marginLeft: '10px' }}>
                Cancel
              </Button>
              <Button variant="outlined" onClick={handleChangePasswordClick} style={{ marginLeft: '10px' }}>
                Change Password
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Profile;
