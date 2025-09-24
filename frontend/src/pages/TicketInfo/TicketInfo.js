import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { Typography, Select, MenuItem, FormControl, InputLabel, Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Stack from "@mui/material/Stack";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ConfirmDelete from "../../components/ConfirmDelete/ConfirmDelete";
import ConfirmEdit from "../../components/ConfirmEdit/ConfirmEdit";
import EditTicket from "../../components/EditTicket/EditTicket";
import ConfirmReassign from "../../components/ConfirmReassign/ConfirmReassign";
import ConfirmEscalate from "../../components/ConfirmEscalate/ConfirmEscalate";
import ReplySection from "../../components/ReplySection/ReplySection";
import TicketStatusIndicator from "../../components/TicketStatusIndicator/TicketStatusIndicator";
import { issueTypeDisplay } from "../../constants/IssueTypes";
import "./TicketInfo.css";

const baseURL = process.env.REACT_APP_API_BASE_URL;
const TicketSubject = "Sponsor Isn’t Responding";

const TicketInfo = () => {
    const theme = useTheme();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editFormOpen, setEditFormOpen] = useState(false);
  const [reassignOpen, setReassignOpen] = useState(false);
  const [escalateOpen, setEscalateOpen] = useState(false);
  const [ticketData, setTicketData] = useState(null);
  const [ticketStatus, setTicketStatus] = useState("");
  const [loadingTicketData, setLoadingTicketData] = useState(true);
  const [unauthorized, setUnauthorized] = useState(false);
  const [error, setError] = useState(false);
  const [AssignedID, setAssignedID] = useState([]);
  const [idToNameMap, setIdToNameMap] = useState({});

  const navigate = useNavigate();
  const location = useLocation();
  const token = Cookies.get("token");
  const decodedToken = jwtDecode(token);
  const userType = decodedToken.role;

  const urlParameters = new URLSearchParams(location.search);
  const ticketId = urlParameters.get("ticket");


  const fetchData = async () => {
    try {
      const token = Cookies.get("token");
      const ticketDataResponse = await fetch(`${baseURL}/api/tickets/info/${ticketId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!ticketDataResponse.ok) {
        setUnauthorized(true);
        throw new Error("Failed to fetch tickets");
        
      } else {
        const data = await ticketDataResponse.json();
        setTicketData(data);
        setTicketStatus(data.status);
        setLoadingTicketData(false);
      }
      
    } catch (err) {
      console.error("Error: ", err);
      setError(true);
    }
  };

  const handleSaveEdit = async () => {
    setEditOpen(false);
    try {
      const token = Cookies.get("token");
      console.log("Editing Ticket: ", ticketId);

      const response = await fetch(`${baseURL}/api/tickets/${ticketId}/edit`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          status: "Updated",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to edit ticket");
      }

      console.log("Ticket successfully updated!");
      setEditFormOpen(false);
      fetchData();
    } catch (error) {
      console.error("Error editing ticket:", error);
    }
  };

  const handleStatusChange = async (event) => {
    const newStatus = event.target.value;
    try {
      const token = Cookies.get("token");
      const response = await fetch(`${baseURL}/api/tickets/${ticketId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) throw new Error("Failed to update status");

      const updated = await response.json();
      setTicketStatus(updated.status);
      setTicketData(updated);
      window.dispatchEvent(new Event("ticketUpdated"));
    } catch (error) {
      console.error("Error updating ticket status:", error);
    }
  };

  const resolveEscalation = async () => {
    try{
        const deescalateResponse = await fetch(
            `${baseURL}/api/tickets/${ticketId}/deescalate`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            }
        );
    
        if (!deescalateResponse.ok) {
            console.error(`Failed to de-escalate ticket. Status: ${deescalateResponse.status}`);
            console.error(`${deescalateResponse.reason}`);
            alert("Failed to de-escalate ticket. Please try again.");
        } else {
            alert("Ticket was de-escalated successfully.");        
        }
        

    } catch(error) {
        console.log("Error: ", error);
        setError(true);
    }
  };

  useEffect(() => {
    fetchData();
  }, [ticketId]);

  //TICKET ASSIGNMENTS: from ticket_id get user_id (database has multiple users assigned to same ticket?)
  const fetchAssignedTaID = async () => {
    try {
      const token = Cookies.get("token");
      
      const getResponse = await fetch(
        `${baseURL}/api/ticketassignments/ticket/${ticketId}`,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        //console.log("Assigned TA ID: ", getResponse);

        if (!getResponse.ok) {
          console.error(`Failed to get assigned TAs ID. Status: ${getResponse.status}`);
          console.error(`${getResponse.reason}`);
        }
      
        const list = await getResponse.json();
        console.log("Assigned TA ID: ", list);
        const TA_id = list.map(obj => obj.user_id)[0]; //if tickets have multiple TAs, only get the first one
        setAssignedID(TA_id);

      } catch (err) {
        console.log("Error: ", err);
        setError(true);
      }
  }

  const convertToMap = (list) => {
    return list.reduce((acc, obj) => { //map ID to name
      acc[obj.user_id] = obj.name;
      return acc;
    }, {});
  };

  const fetchTaMap = async () => {
    try {
      const token = Cookies.get("token");
      
      const getResponse = await fetch(
        `${baseURL}/api/users/role/TA`,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        if (!getResponse.ok) {
          console.error(`Failed to get TAs. Status: ${getResponse.status}`);
          console.error(`${getResponse.reason}`);
        }
      
        const list = await getResponse.json();
        console.log("all ID: ", list);
        const idToNameMap = convertToMap(list);
        setIdToNameMap(idToNameMap);

      } catch (err) {
        console.log("Error: ", error);
        setError(true);
      }
  }

  useEffect(() => {
    fetchTaMap();
    fetchAssignedTaID();    
  }, []);


  if (error) {
    // navigate("/unauthorized");
  }

  //Robert Naff: Need to have Back button do something
  const handleBack = () => {
    console.log("Back Button Clicked");
    navigate(-1);
  };

  const editPopupClose = () => setEditOpen(false);
  const handleConfirmEdit = () => {
    setEditOpen(false);
    setEditFormOpen(true);
  };

  if (unauthorized){
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", backgroundColor: "#f0f0f0" }}>
        <Typography variant="h6" sx={{ color: "#8C1D40" }}>Sorry, you are not authorized to view this ticket</Typography>
      </div>
    );
  }
  
  if (loadingTicketData) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", backgroundColor: "#f0f0f0", flexDirection: "column", gap: "20px" }}>
        <CircularProgress size={80} thickness={4} />
        <Typography variant="h6" sx={{ color: "#8C1D40" }}>Loading, please wait...</Typography>
      </div>
    );
  }

  return (

    <Box sx={{ backgroundColor: theme.palette.background.default, p: 6}}>
      <Box sx={{backgroundColor: theme.palette.background.paper, p: 3, borderRadius: 1, flex: 1 }}>
        <Stack className="ticketInfo" sx={{ backgroundColor: theme.palette.background.paper, border: `5px solid ${theme.palette.divider}`}}>
          <Button variant="text" className="backButton" onClick={handleBack} startIcon={<ArrowBackIosNewIcon />}>Back</Button>
            <Typography variant="h5" component="div" sx={{ fontWeight: 'bold' }}>
                Capstone Ticket - {ticketId}
            </Typography>
            <Typography variant="h6" component="div" color="text.secondary">
                {issueTypeDisplay[ticketData.issue_type] || "Unknown issue type"}
            </Typography>

          <Stack direction="row" className="statusButtons">
            <TicketStatusIndicator status={ticketStatus.toUpperCase() || "UNKNOWN"} />
            {ticketData.escalated && <TicketStatusIndicator status={"ESCALATED"} />}
            <FormControl sx={{ minWidth: 150, ml: 2, mt: 1 }}>
              <InputLabel sx={{ top: "-5px" }}>Status</InputLabel>
              <Select value={ticketStatus} onChange={handleStatusChange} sx={{ padding: "10px", height: "40px" }}>
                <MenuItem value="new">New</MenuItem>
                <MenuItem value="ongoing">Ongoing</MenuItem>
                <MenuItem value="resolved">Resolved</MenuItem>
                {/*<MenuItem value="Escalated">Escalated</MenuItem>*/}
              </Select>
            </FormControl>
            <Button variant="contained" className="editButton" onClick={() => setEditOpen(true)}>Edit Ticket</Button>
            <ConfirmEdit handleOpen={editOpen} handleClose={editPopupClose} onConfirmEdit={handleConfirmEdit} />
            <Button variant="contained" color="error" className="deleteButton" onClick={() => setDeleteOpen(true)}>Delete Ticket</Button>
            <ConfirmDelete handleOpen={deleteOpen} handleClose={() => setDeleteOpen(false)} />
            {userType === "TA" && ticketData.escalated === false && (
              <Button variant="contained" color="warning" className="escalateButton" onClick={() => setEscalateOpen(true)}>Escalate Ticket</Button>
            )}
            <ConfirmEscalate handleOpen={escalateOpen} handleClose={() => setEscalateOpen(false)} ticketID={ticketId} />
            {userType === "admin" && ticketData.escalated && (
              <Button variant="contained" color="success" className="deEscalateButton" onClick={() => resolveEscalation()}>Resolve Escalation</Button>
            )}

          </Stack>

            <Typography variant="h6" sx={{ mt: 2, fontWeight: "bold", }}>Description:</Typography>
            <Typography variant="body1">{ticketData.issue_description}</Typography>

            <Typography variant="h6" sx={{ mt: 2, fontWeight: "bold", }}>Student - ID:</Typography>
            <Typography variant="body1">{ticketData.student_name} - {ticketData.student_id}</Typography>

            <Typography variant="h6" sx={{ mt: 2, fontWeight: "bold", }}>TA:</Typography>
            <Box className="ticketAsset">
            {idToNameMap[AssignedID]}&nbsp;
            {userType === "admin" && (
              <Button variant="contained" className="reassignButton" style={{ marginTop: "10px" }} onClick={() => setReassignOpen(true)}>Reassign</Button>
            )}
            <ConfirmReassign handleOpen={reassignOpen} handleClose={() => setReassignOpen(false)} ticketID={ticketId} oldTAID={AssignedID} idNameMap={idToNameMap} updateTA={(newTAID) => setAssignedID(newTAID)} />
          </Box>

            <Typography variant="h6" sx={{ mt: 2, fontWeight: "bold", }}>Sponsor:</Typography>
            <Typography variant="body1">{ticketData.sponsor_name}</Typography>

            <Typography variant="h6" sx={{ mt: 2, fontWeight: "bold", }}>Project - ID:</Typography>
            <Typography variant="body1">{ticketData.team_name} - {ticketData.team_id}</Typography>

            <Typography variant="h6" sx={{ mt: 2, fontWeight: "bold", }}>Created at:</Typography>
            <Typography variant="body1">{ticketData.created_at ? new Date(ticketData.created_at).toLocaleString() : "N/A"}</Typography>

            <Typography variant="h6" sx={{ mt: 2, fontWeight: "bold", }}>Last Updated:</Typography>
            <Typography variant="body1">{ticketData.updated_at ? new Date(ticketData.updated_at).toLocaleString() : "N/A"}</Typography>

            <Typography variant="h6" sx={{ mt: 2, fontWeight: "bold", }}>Replies:</Typography>
          <ReplySection />
        </Stack>
      </Box>
      {editFormOpen && <EditTicket ticketId={ticketId} onClose={() => setEditFormOpen(false)} handleSaveEdit={handleSaveEdit} />}
    </Box>
  );
};

export default TicketInfo;


//github tracking 

