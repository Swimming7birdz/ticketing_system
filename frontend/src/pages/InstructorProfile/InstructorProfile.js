import {
  Button,
  CircularProgress,
  Menu,
  MenuItem,
  TextField,
  Typography,
  Box
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import TicketCard from "../../components/TicketCard";
import ArticleIcon from "@mui/icons-material/Article";
import PeopleIcon from "@mui/icons-material/People";
import { Avatar } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import InstructorCard from "../../components/InstructorCard";
import { jwtDecode } from "jwt-decode";
const baseURL = process.env.REACT_APP_API_BASE_URL;
//const token = Cookies.get("token");
const InstructorProfile = () => {
  const theme = useTheme();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalTickets, setTotalTickets] = useState(0);
  const [filterAnchor, setFilterAnchor] = useState(null); // For dropdown
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [TA, setTA] = useState(null);
  const [TATickets, setTATickets] = useState([]);
  const [activeFilters, setActiveFilters] = useState({
    sort: null,
    status: null,
    search: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isUser, setIsUser] = useState(false);
  const [newTime, setNewTime] = useState(null);
  const [time, setTime] = useState({monday: {start: '', end: ''}, 
				    tuesday: {start: '', end:''},
		 		    wednesday: {start: '', end: ''},
				    thursday: {start: '', end: ''},
				    friday: {start: '', end: ''},
				    saturday: {start: '', end: ''},
				    sunday: {start: '', end: ''}});
  
  
  const [selectedDays, setSelectedDays] = useState({
  monday: true,
  tuesday: true,
  wednesday: true,
  thursday: true,
  friday: true,
  saturday: true,
  sunday: true,
  });
  
  const location = useLocation();
  const urlParameters = new URLSearchParams(location.search);
  const userId = urlParameters.get("user");
  
  useEffect(() => {
    fetchTicketsAssigned();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [tickets, activeFilters]);

  useEffect(() => {
    fetchTADetails();
    fetchOfficeHours();
  }, [userId]);

  const fetchOfficeHours = async () => {
    try {
      const token = Cookies.get("token");
      const response = await fetch(`${baseURL}/api/officehours/users/${userId}`,{
        headers: {
        'Authorization': `Bearer ${token}`,
      },
      });
      
      const data = await response.json();
      
      console.log("response okay?: ", response.ok, "data?: ", data) 
      if (response.ok && data.office_hours) { // if ta is found in table and office_hours is not null
        setTime(data.office_hours);
        console.log("fetched office hours:", time);
      } else if (data) {setTime(time);} // to stop error from ta not being in table yet. ta's office hours are added in same fashion as ticket communications right now
      
    } catch (err) {
      console.error("error fetching office hours:", err);
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = async () => {
    try {
    const token = Cookies.get("token");
    const response = await fetch(`${baseURL}/api/officehours/users/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, 
      },
      body: JSON.stringify({ office_hours: time }), //put in jsonb format for database
    });

    const result = await response.json();
    console.log('saved office hours', result);
    } catch (error) {
      console.error('failed to save office hours', error);
    }
    setTime(time)
    setIsEditing(false);
  };
  const handleCloseClick = () => {
    // some way to set it back to previous information
    setIsEditing(false);
  };

  const handleTime = (e,start_or_end) => {
	
        const {value} = e.target;
        setInputTime(prev => ({...prev, value})); 
  console.log(value);
  };        
       
  function handleDisplayTime(time) {
    if (time) {
      let hrs = time.split(':')[0], mins = time.split(':')[1];
      if (hrs > 12){return (hrs - 12) + ':' + mins + ' PM';}
      else if (hrs == 0) {return '12:' + mins + ' PM';}
      else {return (time + ' AM');}
    }
  }
  
  const handleDayChange = (day) => {
    setSelectedDays((prevState) => ({
      ...prevState,
      [day]: !prevState[day],
    }));
  };
 
  const handleChange = (day, field, value) => {
    setTime(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [field]: value
      }
    }));
  };

  const fetchTADetails = async () => {
    try {
    const token = Cookies.get("token");
      const response = await fetch(`${baseURL}/api/users/${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch TA details");
      }

      const taData = await response.json();
      setTA(taData);
      const decodedToken = jwtDecode(token);
      console.log("token",decodedToken.id)
      if (decodedToken.id === taData.user_id) {setIsUser(true);} //set logged in user for edit function on office hours
      console.log("TA data: ", taData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching TA details:", error);
      setLoading(false);
    }
  
  };
  


  const applyFilters = () => {
    let filtered = [...tickets];

    // Apply sort filter
    if (activeFilters.sort === "newest") {
      filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    } else if (activeFilters.sort === "oldest") {
      filtered.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    }

    // Apply status filter
    if (activeFilters.status) {
      filtered = filtered.filter(
        (ticket) =>
          ticket.status.toLowerCase() === activeFilters.status.toLowerCase()
      );
    }

    // Apply search filter
    if (activeFilters.search) {
      filtered = filtered.filter((ticket) =>
        ticket.userName
          .toLowerCase()
          .includes(activeFilters.search.toLowerCase())
      );
    }
    setFilteredTickets(filtered);
  };

  const handleFilterClick = (event) => {
    setFilterAnchor(event.currentTarget);
  };

  const handleFilterClose = () => {
    setFilterAnchor(null);
  };

  const handleClearFilters = () => {
    setActiveFilters({ sort: null, status: null, search: "" });
  };

  const fetchNameFromId = async (student_id) => {
    try {
      const token = Cookies.get("token");
      const response = await fetch(`${baseURL}/api/users/${student_id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        console.warn(`Failed to fetch user name for ticket ${student_id}`);
        return "Unknown Name"; // Default name if user fetch fails
      }

      const data = await response.json();
      return data.name; // Assuming the API returns { name: "User Name" }
    } catch (error) {
      console.error(`Error fetching name for ticket ${student_id}:`, error);
      return "Unknown Name";
    }
  };
  const fetchTicketDetails = async (ticketId) => {
  try {
    const token = Cookies.get("token");
    const response = await fetch(`${baseURL}/api/tickets/${ticketId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch details for ticket ${ticketId}`);
    }

    return await response.json(); // Assuming the response returns ticket details
  } catch (error) {
    console.error(`Error fetching ticket ${ticketId}:`, error);
    return null; // Return null for failed requests
  }
  };

  const fetchTicketsAssigned = async () => {
    try {
      const token = Cookies.get("token");
      const response = await fetch(`${baseURL}/api/ticketassignments/users/${userId}`, {
        method: "GET",
        headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      throw new Error("Failed to fetch Ticket Assignment details");
    }

    const ticketsAssigned = await response.json();
    setTATickets(ticketsAssigned);
    // get ticket_ids from the ticketsAssigned data
    const ticketIds = ticketsAssigned.map((assignment) => assignment.ticket_id);

    // api requests to fetch details for each ticket
    const ticketDetailsPromises = ticketIds.map((ticketId) => fetchTicketDetails(ticketId));

    const ticketDetails = await Promise.all(ticketDetailsPromises);
    let uniqueTickets = [...new Map(ticketDetails.map((ticket) => [ticket.ticket_id, ticket])).values()];
    //console.log("unique tickets:", ticketIds);
    
    // temporary way of making students only view their own tickets -- change it to check authentication instead, like studentdash/studenttickets
    const decodedToken = jwtDecode(token);
    const checkId = decodedToken.id; // Extract user ID from JWT
    //console.log("token role:",decodedToken.role);

    //console.log("rolecheck:", roleCheck);
    if (decodedToken.role === 'student') {
      uniqueTickets = uniqueTickets.filter(ticket => ticket.student_id === decodedToken.id);
    }
    
    const ticketsWithNames = await Promise.all(
        uniqueTickets.map(async (ticket) => {
          const userName = await fetchNameFromId(ticket.student_id);
          return { ...ticket, userName };
        })
      );
      setTickets(ticketsWithNames);
      setTotalTickets(uniqueTickets.length);
    
    setLoading(false);
  } catch (error) {
      console.error("Error fetching Ticket Assignment details:", error);
      setLoading(false);
    }
  };
  
  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          backgroundColor: theme.palette.background.default,
          flexDirection: "column",
          gap: 2.5,
        }}
      >
        <CircularProgress size={80} thickness={4} />
        <Typography variant="h6" sx={{ color: theme.palette.primary.main }}>
          Loading, please wait...
        </Typography>
      </Box>
    );
  }
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        backgroundColor: theme.palette.background.default,
        p: 6.25,
        gap: 6.25,
      }}
    >
      <Typography
        variant="h1"
        sx={{ 
          fontWeight: "bold", 
          fontSize: "2rem", 
          textAlign: "center",
          color: theme.palette.text.primary
        }}
      >
        {TA.name || ' '} Profile
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2.5,
          backgroundColor: theme.palette.background.paper,
          p: 2.5,
          borderRadius: 1,
          flex: 1,
          border: `1px solid ${theme.palette.divider}`
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "right",
            alignItems: "right",
            gap: 2.5,
          }}
        >{/*
          <TextField
            label="Search by Student Name"
            variant="outlined"
            value={activeFilters.search}
            onChange={(e) =>
              setActiveFilters({ ...activeFilters, search: e.target.value })
            }
            sx={{ flex: 1 }}
          />*/}
          <Button
            variant="contained"
            onClick={handleFilterClick}
            sx={{ backgroundColor: theme.palette.primary.main, color: "white" }}
          >
            {activeFilters.sort || activeFilters.status
              ? `Filters: ${activeFilters.sort || ""} ${
                  activeFilters.status || ""
                }`
              : "Add Filter"}
          </Button>
          <Button
            variant="outlined"
            onClick={handleClearFilters}
            sx={{ borderColor: theme.palette.primary.main, color: theme.palette.primary.main }}
          >
            Clear Filters
          </Button>
        </Box>

        {/* Filter Dropdown */}
        <Menu
          anchorEl={filterAnchor}
          open={Boolean(filterAnchor)}
          onClose={handleFilterClose}
        >
          <MenuItem
            onClick={() => {
              setActiveFilters({ ...activeFilters, sort: "newest" });
              handleFilterClose();
            }}
          >
            Newest
          </MenuItem>
          <MenuItem
            onClick={() => {
              setActiveFilters({ ...activeFilters, sort: "oldest" });
              handleFilterClose();
            }}
          >
            Oldest
          </MenuItem>
          <MenuItem
            onClick={() => {
              setActiveFilters({ ...activeFilters, status: "New" });
              handleFilterClose();
            }}
          >
            Status: New
          </MenuItem>
          <MenuItem
            onClick={() => {
              setActiveFilters({ ...activeFilters, status: "Ongoing" });
              handleFilterClose();
            }}
          >
            Status: Ongoing
          </MenuItem>
          <MenuItem
            onClick={() => {
              setActiveFilters({ ...activeFilters, status: "Resolved" });
              handleFilterClose();
            }}
          >
            Status: Resolved
          </MenuItem>
        </Menu>


        {/* Tickets Grid */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: 2.5,
            justifyContent: "center",
            maxHeight: "calc(100vh - 400px)",
            overflowY: "auto",
          }}
        >
          {filteredTickets.map((ticket) => (
            <TicketCard
              key={ticket.ticket_id}
              ticketId={ticket.ticket_id}
              issueDescription={ticket.issue_description}
              status={ticket.status}
              name={ticket.userName}
            />
          ))}
        </Box>
      </Box>
	{/*Schedule section*/}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2.5,
          backgroundColor: theme.palette.background.paper,
          p: 2.5,
          borderRadius: 1,
          flex: 1,
          border: `1px solid ${theme.palette.divider}`
        }}
      ><Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            gap: 2.5,
          }}
        ><Typography
              variant="h1"
              sx={{ 
                fontWeight: "bold", 
                fontSize: "2rem", 
                textAlign: "center",
                color: theme.palette.text.primary
              }}
            >
              Office Hours
            </Typography>
	{/*check if logged in user is viewing their own profile*/}
	{isUser && (
	
          <Button
            variant="contained"
            onClick={handleEditClick}
            sx={{ backgroundColor: theme.palette.primary.main, color: "white" }}
          >
          Edit
          </Button>
	 )}
        </Box>
        	
	<div style={{ display: "grid", flexDirection: "column", justifyContent: "center" }}>
	{isEditing ? (
	<>
  	<Typography variant="p" sx={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '8px', alignItems: 'center', color: "#737373", fontSize: "0.8rem", padding: "2px" }}>
	<label> <input
          type="checkbox"
          checked={selectedDays.monday}
          onChange={() => handleDayChange('monday')}
        />
        Monday </label>
	
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
		   <input type="time" 
		   step="300" 
		   id="monday" 
		   name="monday" 
		   value={time.monday.start} 
		   onChange={e=> handleChange("monday", "start", e.target.value)}
		   style={{ width: "120px" }}
		   />
		    - 
		   <input type="time" 
		   step="300"
		   id="monday"
		   name="monday" 
		   value={time.monday.end}
		   onChange={e=> handleChange("monday", "end", e.target.value)}
		   style={{ width: "120px" }}
		   />
	</div>
	
        <label> <input
          type="checkbox"
          checked={selectedDays.tuesday}
          onChange={() => handleDayChange('tuesday')}
        />
        Tuesday </label>
	<div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                   <input type="time" 
		   id="tuesday" 
		   step="300"
		   value={time.tuesday.start} 
		   onChange={e=> handleChange("tuesday", "start", e.target.value)}
		   style={{ width: "120px" }}
		   /> 
		    - 
		   <input type="time" 
		   step="300" 
		   value={time.tuesday.end}
		   onChange={e=> handleChange("tuesday", "end", e.target.value)}
		   style={{ width: "120px" }}
   		   />
        </div>
        <label> <input
          type="checkbox"
          checked={selectedDays.wednesday}
          onChange={() => handleDayChange('wednesday')}
        />
        Wednesday </label>
	<div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                   <input type="time" 
		   step="300"
		   value={time.wednesday.start}
		   onChange={e=> handleChange("wednesday", "start", e.target.value)}
		   style={{ width: "120px" }}
		   /> 
		    - 
		   <input type="time" 
		   step="300"
		   value={time.wednesday.end}
		   onChange={e=> handleChange("wednesday", "end", e.target.value)}
		   style={{ width: "120px" }}
   		   />
        </div>
        <label> <input
          type="checkbox"
          checked={selectedDays.thursday}
          onChange={() => handleDayChange('thursday')}
        />
        Thursday </label>
	<div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                   <input type="time" 
		   step="300"
		   value={time.thursday.start} 
		   onChange={e=> handleChange("thursday", "start", e.target.value)}
		   style={{ width: "120px" }}
  		   />
		    - 
		   <input type="time" 
		   step="300" 
		   value={time.thursday.end}
		   onChange={e=> handleChange("thursday", "end", e.target.value)}
		   style={{ width: "120px" }}
  		   />
        </div>
        <label> <input
          type="checkbox"
          checked={selectedDays.friday}
          onChange={() => handleDayChange('friday')}
        />
        Friday </label>
	<div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                   <input type="time" 
		   step="300"
		   value={time.friday.start}
		   onChange={e=> handleChange("friday", "start", e.target.value)}
		   style={{ width: "120px" }}
		   /> 
		    - 
		   <input type="time" 
		   step="300"
		   value={time.friday.start}
		   onChange={e=> handleChange("friday", "end", e.target.value)}
		   style={{ width: "120px" }}
		   />
        </div>
        <label> <input
          type="checkbox"
          checked={selectedDays.saturday}
          onChange={() => handleDayChange('saturday')}
        />
        Saturday </label>
	<div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                   <input type="time" 
		   step="300"
		   value={time.saturday.start}
		   onChange={e=> handleChange("saturday", "start", e.target.value)}
		   style={{ width: "120px" }}
		   />
		    - 
		   <input type="time" 
		   step="300"
		   value={time.saturday.end}
		   onChange={e=> handleChange("saturday", "end", e.target.value)}
		   style={{ width: "120px" }}
		   />
        </div>
        <label> <input
          type="checkbox"
          checked={selectedDays.sunday}
          onChange={() => handleDayChange('sunday')}
        />
        Sunday </label>
	<div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                   <input type="time" 
		   step="300"
		   value={time.sunday.start}
		   onChange={e=> handleChange("sunday", "start", e.target.value)}
		   style={{ width: "120px" }}
		   /> 
		    - 
		   <input type="time" 
	   	   step="300"
		   value={time.sunday.end}
		   onChange={e=> handleChange("sunday", "end", e.target.value)}
		   style={{ width: "120px" }}
		   />
        </div>
          </Typography>
	<div style= {{ display: "flex", flexDirection: "row", justifyContent: "space-between" }} >
	<Button
		variant="contained"
		onClick={handleSaveClick}
		sx={{ backgroundColor: theme.palette.primary.main, color: "white", padding:"2px 10px" }}
	>
	Save
	</Button>
	<Button
                variant="contained"
                onClick={handleCloseClick}
                sx={{ backgroundColor: theme.palette.primary.main, color: "white", padding:"2px" }}
        >
        Close
        </Button>
	</div>
	</>) : ( <>
	  <Typography variant="p" sx={{  display: 'grid', gridTemplateColumns: '1fr 2fr', alignItems: 'center', gap: '4px', color: theme.palette.text.secondary, fontSize: "0.8rem" , textAlign: "left"}}>
	  {selectedDays.monday && (time.monday.start != '' && time.monday.end != '') && ( <>
	    <label> Monday: </label>
	    <div style={{ display: "flex", alignItems: "left", gap: "8px" }}>
            {handleDisplayTime(time.monday.start)} - {handleDisplayTime(time.monday.end)}
	    </div>
            </>)}
          {selectedDays.tuesday && (time.tuesday.start != '' && time.tuesday.end != '') && ( <>
	    <label> Tuesday: </label>
            <div style={{ display: "flex", alignItems: "left", gap: "8px" }}>
            {handleDisplayTime(time.tuesday.start)} - {handleDisplayTime(time.tuesday.end)}
	    </div>
            </>)}
          {selectedDays.wednesday && (time.wednesday.start != '' && time.wednesday.end != '') && ( <>
	    <label> Wednesday: </label>
            <div style={{ display: "flex", alignItems: "left", gap: "8px" }}>
            {handleDisplayTime(time.wednesday.start)} - {handleDisplayTime(time.wednesday.end)}
            </div>
	    </>)}
          {selectedDays.thursday && (time.thursday.start != '' && time.thursday.end != '') && ( <>
	    <label> Thursday: </label>
            <div style={{ display: "flex", alignItems: "left", gap: "8px" }}>
            {handleDisplayTime(time.thursday.start)} - {handleDisplayTime(time.thursday.end)}
            </div>
	    </>)}
          {selectedDays.friday && (time.friday.start != '' && time.friday.end != '') && ( <>
	    <label> Friday: </label>
            <div style={{ display: "flex", alignItems: "left", gap: "8px" }}>
            {handleDisplayTime(time.friday.start)} - {handleDisplayTime(time.friday.end)}
            </div>
	    </>)}
          {selectedDays.saturday && (time.saturday.start != '' && time.saturday.end != '') && ( <>
	    <label> Saturday: </label>
            <div style={{ display: "flex", alignItems: "left", gap: "8px" }}>
            {handleDisplayTime(time.saturday.start)} - {handleDisplayTime(time.saturday.end)}
            </div>
	    </>)}
          {selectedDays.sunday && (time.sunday.start != '' && time.sunday.end != '') && ( <>
	    <label> Sunday: </label>
            <div style={{ display: "flex", alignItems: "left", gap: "8px" }}>
            {handleDisplayTime(time.sunday.start)} - {handleDisplayTime(time.sunday.end)}
            </div>
	    </>)}
          </Typography>
	  </>)}
        </div>
	</Box> 
    </Box>
  );
};

export default InstructorProfile;
