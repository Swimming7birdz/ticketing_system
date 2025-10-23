import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { useDropzone } from "react-dropzone";
import Papa from "papaparse";

import {
  Button,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  Typography,
  Switch,
  FormControlLabel,
  Divider,
  Box,
  TextField,
  FormControl,
  RadioGroup,
  Radio,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import {useNavigate} from "react-router-dom";
import ConfirmTADelete from "../../components/ConfirmTADelete/ConfirmTADelete";
import { useTheme as useCustomTheme } from "../../contexts/ThemeContext";

const AdminSettings = () => {
  const [teams, setTeams] = useState([]);
  const [tas, setTAs] = useState([]);
  const [newTeamName, setNewTeamName] = useState("");
  const [newTAName, setNewTAName] = useState("");
  const [newTAEmail, setNewTAEmail] = useState("");
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedTA, setSelectedTA] = useState(null); // To track which TA is being deleted
  const [idNameMap, setIdToNameMap] = useState({});
  const [deleteStatus, setDeleteStatus] = useState(false);
  const [user, setUser] = useState(null);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const token = Cookies.get("token");
  const navigate = useNavigate();
  const theme = useTheme();
  const { isDarkMode, themeMode, setTheme } = useCustomTheme();
  const [selectedFiles, setSelectedFiles] = useState([]);

  const REQUIRED_HEADERS = ["name", "canvas_user_id", "user_id", "login_id", "sections", "group_name", "canvas_group_id", "sponsor"]; // adjust to your required columns
  const SCHEMA = {
      name: "string",
      canvas_user_id: "number",
      user_id: "number",
      login_id: "string",
      sections: "number",
      group_name: "string",
      canvas_group_id: "number",
      sponsor: "string",
    };

  useEffect(() => {
    fetchTeams();
    fetchTAs();
    fetchUserProfile();
  }, [deleteStatus]); // Fetch teams and TAs when the component mounts or when deleteStatus changes

  const fetchUserProfile = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/users/profile`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data);
        setNotificationsEnabled(data.notifications_enabled);
      }
    } catch (error) {
      console.error("Failed to load user profile:", error);
    }
  };

  const updatePreference = (updates) => {
    if (!user) return;

    fetch(`${process.env.REACT_APP_API_BASE_URL}/api/users/${user.user_id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        ...user,
        ...updates,
      }),
    })
      .then((res) => res.json())
      .then((updatedUser) => {
        setUser(updatedUser);
      })
      .catch((err) => {
        console.error("Error saving preferences:", err);
      });
  };

  const handleNotificationsToggle = () => {
    const newValue = !notificationsEnabled;
    setNotificationsEnabled(newValue);
    updatePreference({ notifications_enabled: newValue });
  };

  const handleThemeModeChange = (event) => {
    const newThemeMode = event.target.value;
    setTheme(newThemeMode);
    updatePreference({ 
      theme_mode: newThemeMode,
      dark_mode: newThemeMode === 'dark'
    });
  };

  const fetchTeams = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/api/teams`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch teams.");
      const data = await response.json();
      setTeams(data);
    } catch (error) {
      console.error(error);
    }
  };

  const convertToMap = (list) => {
    return list.reduce((acc, obj) => { //map ID to name
      acc[obj.user_id] = obj.name;
      return acc;
    }, {});
  };

  const fetchTAs = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/api/users/role/TA`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch TAs.");
      const data = await response.json();
      setTAs(data);

      const idToNameMap = convertToMap(data);
      setIdToNameMap(idToNameMap);
    } catch (error) {
      console.error(error);
    }
  };

  const addTeam = async () => {
    if (!newTeamName.trim())           //validation check to prevent adding blank team name
    {
      alert("Team name cannot be blank.");
      return;
    }
    
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/api/teams`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ team_name: newTeamName }),
        }
      );

      if (!response.ok) throw new Error("Failed to add team.");
      setNewTeamName("");
      fetchTeams(); // Refresh the list of teams
    } catch (error) {
      console.error(error);
    }
  };

  const encryptPassword = async (password) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/encrypt`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ password }),
        }
      );

      if (!response.ok) throw new Error("Failed to encrypt password.");
      const data = await response.json();
      return data.hashedPassword;

    } catch (error) {
      console.error(error);
    }
  }

  const addTA = async () => {
    if (!newTAName.trim())           //validation check to prevent adding blank TA name
    {
      alert("TA name cannot be blank.");
      return;
    }
    if (!newTAEmail.trim())           //validation check to prevent adding blank TA email
    {
      alert("TA Email name cannot be blank.");
      return;
    }
    
    const defaultPassword = await encryptPassword(`password`); // Encrypt the default password
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/api/users`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: newTAName,
            email: newTAEmail,
            role: "TA",
            password: defaultPassword, // Default password
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to add TA.");
      setNewTAName("");
      setNewTAEmail("");
      fetchTAs(); // Refresh the list of TAs
    } catch (error) {
      console.error(error);
    }
  };

  const deleteTeam = async (teamId) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/api/teams/${teamId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to delete team.");
      fetchTeams(); // Refresh the list of teams
    } catch (error) {
      console.error(error);
    }
  };

  // const deleteTA = async (taId) => {
  //   try {
  //     const response = await fetch(
  //       `${process.env.REACT_APP_API_BASE_URL}/api/users/${taId}`,
  //       {
  //         method: "DELETE",
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }
  //     );

  //     if (!response.ok) throw new Error("Failed to delete TA.");
  //     fetchTAs(); // Refresh the list of TAs
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  const handleDelete = (ta) => {
    console.log("Delete TA Button Clicked");
    setSelectedTA(ta);
    setDeleteOpen(true);
  }

  const deletePopupClose = () => {
    setDeleteOpen(false);
    setSelectedTA(null); // Clear the selected TA
  };

  const updateStatus = (status) => {
    console.log("This is the update status:", status)
    setDeleteStatus(status);
  }

  const onDrop = React.useCallback((acceptedFiles) => {
    setSelectedFiles((prev) => [...prev, ...acceptedFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "text/csv": [".csv"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"]
    },
    maxSize: 10 * 1024 * 1024, // 10MB
  });

  //const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validateCell = (key, value) => {
    //console.log('validateCell called', { key, raw: JSON.stringify(value), typeof: typeof value });
   
    if (value == null) return `${key} is missing`;
    const v = String(value).trim();
    const normalizeDigits = (s) => String(s).replace(/[, \u00A0\r\n\t]+/g, '').trim();
    const normalized = normalizeDigits(v);
   
    //console.log('normalized for', key, ':', JSON.stringify(normalized)); // shows empty string clearly
   
    if (SCHEMA[key] === "number") {
      if (!/^\d+$/.test(normalized)) return `${key} must be an integer made only of digits`;
      return null;
    }
    if (v === "") return `${key} must be a non-empty string`;
    return null;
  };

  const verifyFile = (file) => {
  return new Promise((resolve) => {
    if (!file) return resolve({ valid: false, errors: ["No file provided"], rows: [] });

    const name = file.name?.toLowerCase?.() || "";
    if (!name.endsWith(".csv")) {
      return resolve({ valid: false, errors: ["Only CSV files are supported"], rows: [] });
    }

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      quoteChar: '"',         
      escapeChar: '"',        
      delimiter: ',',         
      encoding: "UTF-8",
      newline: "\r\n",
      transformHeader: (h) => h.trim(),
      transform: (value) => value.trim(),
      complete: (results) => {
          console.log("Parsed data:", results.data);
        const errors = [];
        const headers = results.meta.fields || [];

        const missingHeaders = REQUIRED_HEADERS.filter(
          (h) => !headers.map(x => x.toLowerCase()).includes(h.toLowerCase())
        );
        if (missingHeaders.length) {
          errors.push(`Missing required header(s): ${missingHeaders.join(", ")}`);
        }

        const rows = results.data || [];
        rows.forEach((row, idx) => {
          
          REQUIRED_HEADERS.forEach((key) => {
            console.log('DEBUG:', key, JSON.stringify(row[key]));
            const err = validateCell(key, row[key] ?? '');
            if (err) errors.push(`Row ${idx + 2}: ${err}`);
          });
        });

        resolve({ valid: errors.length === 0, errors, rows });
      },
      error: (err) => {
        resolve({ valid: false, errors: [String(err)], rows: [] });
      },
    });
  });
};

  const handleUploadFiles = async () => {
    if (selectedFiles.length === 0) return;
    // verify all files
    for (const f of selectedFiles) {
      const result = await verifyFile(f);
      if (!result.valid) {
        console.error("File verification failed:", result.errors);
        alert("File validation errors:\n" + result.errors.join("\n"));
        return; // stop upload
      }
      // result.rows contains parsed rows you can transform and send
    }
    alert("All files verified successfully. Ready to upload.");
    // proceed to build FormData and upload
  };


  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 60px)",
        backgroundColor: theme.palette.background.default,
        padding: "20px 0",
      }}
    >
      <Box
        sx={{
          padding: 5,
          backgroundColor: theme.palette.background.paper,
          borderRadius: "10px",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
          maxWidth: "800px",
          margin: "40px auto",
        }}
      >
      <Typography 
        variant="h4" 
        sx={{ 
          marginBottom: 5, 
          textAlign: "center", 
          fontWeight: "bold",
          color: theme.palette.text.primary
        }}
      >
        Settings
      </Typography>
      
      {/* Personal Preferences Section */}
      <Box
        sx={{
          marginBottom: 5,
          backgroundColor: theme.palette.background.paper,
          borderRadius: "10px",
          border: `1px solid ${theme.palette.divider}`,
          padding: 2.5,
          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Typography 
          variant="h5" 
          sx={{ 
            marginBottom: 2.5, 
            fontWeight: "bold",
            color: theme.palette.text.primary
          }}
        >
          Personal Preferences
        </Typography>
        <FormControlLabel
          control={<Switch checked={notificationsEnabled} onChange={handleNotificationsToggle} />}
          label="Email Notifications"
        />
        
        <Typography variant="subtitle1" gutterBottom sx={{ marginTop: "20px" }}>
          Theme Mode
        </Typography>
        <FormControl component="fieldset">
          <RadioGroup
            value={themeMode}
            onChange={handleThemeModeChange}
            row
          >
            <FormControlLabel value="light" control={<Radio />} label="Light" />
            <FormControlLabel value="dark" control={<Radio />} label="Dark" />
            <FormControlLabel value="auto" control={<Radio />} label="Auto (Time-based)" />
          </RadioGroup>
        </FormControl>
      </Box>

      <Divider sx={{ margin: "20px 0" }} />

      {/* Teams Section */}
      <Box
        sx={{
          marginBottom: 5,
          backgroundColor: theme.palette.background.paper,
          borderRadius: "10px",
          border: `1px solid ${theme.palette.divider}`,
          padding: 2.5,
          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Typography 
          variant="h5" 
          sx={{ 
            marginBottom: 2.5, 
            fontWeight: "bold",
            color: theme.palette.text.primary
          }}
        >
          Teams
        </Typography>
        <List 
          sx={{
            maxHeight: "300px",
            overflowY: "auto",
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: "5px",
            padding: 1.25,
            backgroundColor: isDarkMode ? "#2d2d2d" : theme.palette.background.default,
          }}
        >
          {teams.map((team) => (
            <ListItem key={team.team_id}>
              <ListItemText primary={team.team_name} />
              <ListItemSecondaryAction>
                <Button
                  variant="outlined"
                  onClick={() => deleteTeam(team.team_id)}
                  sx={{ 
                    color: isDarkMode ? "white" : "black", 
                    borderColor: isDarkMode ? "white" : "black" 
                  }}
                >
                  Delete
                </Button>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
        <Box sx={{ marginTop: 2.5, display: "flex", gap: 1.25 }}>
          <TextField
            fullWidth
            value={newTeamName}
            placeholder="New Team Name"
            onChange={(e) => setNewTeamName(e.target.value)}
            variant="outlined"
            size="small"
          />
          <Button 
            variant="contained" 
            onClick={addTeam}
            sx={{ backgroundColor: theme.palette.primary.main }}
          >
            Add Team
          </Button>
        </Box>
      </Box>

      {/* Teaching Assistants Section */}
      <Box
        sx={{
          marginBottom: 5,
          backgroundColor: theme.palette.background.paper,
          borderRadius: "10px",
          border: `1px solid ${theme.palette.divider}`,
          padding: 2.5,
          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Typography 
          variant="h5" 
          sx={{ 
            marginBottom: 2.5, 
            fontWeight: "bold",
            color: theme.palette.text.primary
          }}
        >
          Teaching Assistants (TAs)
        </Typography>
        <TableContainer 
          component={Paper} 
          sx={{
            marginTop: 1.25,
            maxHeight: "300px",
            overflowY: "auto",
            backgroundColor: isDarkMode ? "#2d2d2d" : theme.palette.background.default,
          }}
        >
      <Table>
        <TableHead>
          <TableRow>
            <TableCell sx={{ backgroundColor: theme.palette.background.paper, color: theme.palette.text.primary }}>Name</TableCell>
            <TableCell sx={{ backgroundColor: theme.palette.background.paper, color: theme.palette.text.primary }}>Email</TableCell>
            <TableCell align="right" sx={{ backgroundColor: theme.palette.background.paper, color: theme.palette.text.primary }}>Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tas.map((ta) => (
            <TableRow key={ta.user_id}>
              <TableCell sx={{ color: theme.palette.text.primary }}>{ta.name}</TableCell>
              <TableCell sx={{ color: theme.palette.text.primary }}>{ta.email}</TableCell>
              <TableCell align="right">
              <Button 
                  variant="outlined"
                  onClick={() =>  { 
                    handleDelete(ta);
                    }
                  }
                  sx={{ 
                    color: isDarkMode ? "white" : "black", 
                    borderColor: isDarkMode ? "white" : "black" 
                  }}
                > 
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    {deleteOpen && (
      <ConfirmTADelete
        handleOpen={deleteOpen}
        handleClose={deletePopupClose}
        ta={selectedTA}
        idNameMap={idNameMap}
        updateStatus={updateStatus}
      />
    )}



        {/* <List className="scrollable-list">
          {tas.map((ta) => (
            <ListItem key={ta.user_id}>
              <ListItemText primary={`${ta.name} (${ta.email})`} />
              <ListItemSecondaryAction>
                <Button 
                  color="secondary" 
                  onClick={() =>  { 
                    handleDelete(ta);
                    }
                  }> 
                  Delete
                </Button>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List> */}
        <Box sx={{ marginTop: 2.5, display: "flex", gap: 1.25 }}>
          <TextField
            fullWidth
            value={newTAName}
            placeholder="New TA Name"
            onChange={(e) => setNewTAName(e.target.value)}
            variant="outlined"
            size="small"
          />
          <TextField
            fullWidth
            type="email"
            value={newTAEmail}
            placeholder="New TA Email"
            onChange={(e) => setNewTAEmail(e.target.value)}
            variant="outlined"
            size="small"
          />
          <Button 
            variant="contained" 
            onClick={addTA}
            sx={{ backgroundColor: theme.palette.primary.main }}
          >
            Add TA
          </Button>
        </Box>
      </Box>

      {/* bulk upload */}
       <Box
        sx={{
          marginBottom: 5,
          backgroundColor: theme.palette.background.paper,
          borderRadius: "10px",
          border: `1px solid ${theme.palette.divider}`,
          padding: 2.5,
          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
        }}
      >
         <Typography 
          variant="h5" 
          sx={{ 
            marginBottom: 2.5, 
            fontWeight: "bold",
            color: theme.palette.text.primary
          }}
        >
          Student Data Bulk Upload
        </Typography>


        <Box
          {...getRootProps()}
          sx={{
            border: `2px dashed ${isDragActive ? theme.palette.primary.main : theme.palette.divider}`,
            borderRadius: 1,
            p: 3,
            textAlign: "center",
            cursor: "pointer",
          }}
        >
          <input {...getInputProps()} />
          <UploadFileIcon fontSize="large" sx={{ mb: 1 }} />
          <Typography>Drop files here or click to select</Typography>
          <Typography variant="caption">CSV, XLSX — max 10MB each</Typography>
        </Box>

        {selectedFiles.length > 0 && (
          <Box sx={{ mt: 2 }}>
            {selectedFiles.map((f, i) => (
              <Box key={`${f.name}-${i}`} sx={{ display: "flex", justifyContent: "space-between", p: 1, border: `1px solid ${theme.palette.divider}`, borderRadius: 1, mb: 1 }}>
                <Typography sx={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{f.name}</Typography>
                <Button size="small" onClick={() => setSelectedFiles(prev => prev.filter((_, idx) => idx !== i))}>Remove</Button>
              </Box>
            ))}
            <Box sx={{ display: "flex", gap: 1 }}>
              <Button variant="contained" onClick={()=>handleUploadFiles()} >Upload Files</Button>
              <Button variant="outlined" onClick={() => setSelectedFiles([])}>Clear</Button>
            </Box>
          </Box>
        )}

      </Box>
      
      <Box sx={{ marginBottom: 1.25, display: "flex", justifyContent: "center" }}>
        <Button 
          variant="contained" 
          onClick={() => navigate("/profile")}
          sx={{ backgroundColor: theme.palette.primary.main }}
        >
          Go To Account Settings
        </Button>
      </Box>
      </Box>
    </Box>
  );
};

export default AdminSettings;
