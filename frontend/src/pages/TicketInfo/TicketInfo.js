import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Stack from "@mui/material/Stack";
import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ReplySection from "../../components/ReplySection/ReplySection";
import TicketStatusIndicator from "../../components/TicketStatusIndicator/TicketStatusIndicator";
import "./TicketInfo.css"; 
import Typography from "@mui/material/Typography"; 
import { Select, MenuItem, FormControl, InputLabel } from "@mui/material";



const baseURL = process.env.REACT_APP_API_BASE_URL;
const TAs = ["John Smith"];
const TicketSubject = "Sponsor Isn’t Responding";

const TicketInfo = () => {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [ticketData, setTicketData] = useState(null);
  const [loadingTicketData, setLoadingTicketData] = useState(true);
  const [error, setError] = useState(false);
  const navigate = useNavigate();
  const location = useLocation(); 
  const [ticketStatus, setTicketStatus] = useState("");



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
        throw new Error("Failed to fetch tickets");
      }

      const ticketData = await ticketDataResponse.json();
      console.log("Ticket Data: ", ticketData);
      setTicketData(ticketData); 
      setTicketStatus(ticketData.status);
      setLoadingTicketData(false); 
    } catch (err) {
      console.error("Error: ", err);
      setError(true);
    }
  };

  useEffect(() => {
    fetchData();
  }, [ticketId]);

  const handleBack = () => { 
    navigate("/alltickets");
    console.log("Back Button Clicked");
  };

  const handleDeleteTicket = async () => {
    try {
      const token = Cookies.get("token");
      const response = await fetch(`${baseURL}/api/tickets/${ticketId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 204) {
        alert("Ticket deleted successfully!");
        navigate("/alltickets");
      } else {
        const data = await response.json();
        alert(`Failed to delete ticket: ${data.error}`);
      }
    } catch (error) {
      console.error("Error deleting ticket:", error);
      alert("Something went wrong while deleting the ticket.");
    } finally {
      setDeleteOpen(false); // Close modal
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
      if (!response.ok) {
        throw new Error("Failed to update status");
      }
      const updatedTicket = await response.json();
      setTicketStatus(updatedTicket.status); // Update dropdown value
      setTicketData(updatedTicket); // Update ticket info
      // Dispatch an event so that AllTickets refreshes its data
      window.dispatchEvent(new Event("ticketUpdated"));
    } catch (error) {
      console.error("Error updating ticket status:", error);
    }
  };  
    
  if (loadingTicketData) {
    return (
      <div className="loading-container">
        <CircularProgress size={80} thickness={4} />
        <Typography variant="h6" sx={{ color: "#8C1D40" }}>Loading, please wait...</Typography>
      </div>
    );
  }
  
  return (
    <>
      <div className="ticketInfoContainer">
        <Stack className="ticketInfo">
          <Button variant="text" className="backButton" onClick={handleBack} startIcon={<ArrowBackIosNewIcon />}>
            Back
          </Button>
          <div className="ticketId">Capstone Ticket - {ticketId}</div>
          <div className="subject">{TicketSubject}</div>
          
          <Stack direction="row" className="statusButtons">
            {/* Status Indicator */}
            <TicketStatusIndicator status={ticketData.status.toUpperCase() || "UNKNOWN"} />
            {ticketData.escalated && <TicketStatusIndicator status={"ESCALATED"} />}
  
            {/* Status Update Dropdown */}
            <FormControl sx={{ minWidth: 150, ml: 2, mt: 1 }}>
              <InputLabel sx={{ top: "-5px" }}>Status</InputLabel>
              <Select
                value={ticketStatus}
                onChange={handleStatusChange}
                sx={{ padding: "10px", height: "40px" }}
              >
                <MenuItem value="New">New</MenuItem>
                <MenuItem value="In Progress">In Progress</MenuItem>
                <MenuItem value="Resolved">Resolved</MenuItem>
              </Select>
            </FormControl>


  
            <Button variant="contained" className="editButton">
              Edit Ticket
            </Button>
            <Button variant="contained" className="deleteButton" onClick={() => setDeleteOpen(true)}>
              Delete Ticket
            </Button>
          </Stack>
  
          <h3>Description:</h3>
          <div className="ticketDescription">{ticketData.issue_description}</div>
          <h3>Replies:</h3>
          <ReplySection />
        </Stack>
  
        <Stack className="ticketUsers">
          <div>Student: <div>{ticketData.student_name}</div></div>
          <div>TA: {TAs.map((TaName) => <div key={TaName}>{TaName}</div>)}</div>
          <div>Project: <div>{ticketData.team_name}</div></div>
        </Stack>
      </div>
  
      {/* Confirmation Dialog for Deletion */}
      <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)}>
        <DialogTitle>Delete Ticket</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this ticket? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteOpen(false)} color="primary">Cancel</Button>
          <Button onClick={handleDeleteTicket} color="error">Delete</Button>
        </DialogActions>
      </Dialog>
    </>
  );
  
};

export default TicketInfo;

