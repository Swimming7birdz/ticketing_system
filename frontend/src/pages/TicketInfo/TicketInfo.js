import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { Typography, Select, MenuItem, FormControl, InputLabel } from "@mui/material";
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
import "./TicketInfo.css";

const baseURL = process.env.REACT_APP_API_BASE_URL;
const TicketSubject = "Sponsor Isn’t Responding";

const TicketInfo = () => {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editFormOpen, setEditFormOpen] = useState(false);
  const [reassignOpen, setReassignOpen] = useState(false);
  const [escalateOpen, setEscalateOpen] = useState(false);
  const [ticketData, setTicketData] = useState(null);
  const [ticketStatus, setTicketStatus] = useState("");
  const [loadingTicketData, setLoadingTicketData] = useState(true);
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

      if (!ticketDataResponse.ok) throw new Error("Failed to fetch tickets");

      const data = await ticketDataResponse.json();
      setTicketData(data);
      setTicketStatus(data.status);
      setLoadingTicketData(false);
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

  useEffect(() => {
    fetchData();
  }, [ticketId]);

  useEffect(() => {
    getTAs();
    getAssignedTAID();
  }, []);

  const getAssignedTAID = async () => {
    try {
      const token = Cookies.get("token");
      const res = await fetch(`${baseURL}/api/ticketassignments/ticket/${ticketId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const list = await res.json();
      const TA_id = list.map(obj => obj.user_id)[0];
      setAssignedID(TA_id);
    } catch (err) {
      console.log("Error: ", err);
      setError(true);
    }
  };

  const getTAs = async () => {
    try {
      const token = Cookies.get("token");
      const res = await fetch(`${baseURL}/api/users/role/TA`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const list = await res.json();
      const map = list.reduce((acc, obj) => {
        acc[obj.user_id] = obj.name;
        return acc;
      }, {});
      setIdToNameMap(map);
    } catch (err) {
      console.log("Error: ", err);
      setError(true);
    }
  };

  const handleBack = () => {
    console.log("Back Button Clicked");
    navigate(-1);
  };

  const editPopupClose = () => setEditOpen(false);
  const handleConfirmEdit = () => {
    setEditOpen(false);
    setEditFormOpen(true);
  };

  if (loadingTicketData) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", backgroundColor: "#f0f0f0", flexDirection: "column", gap: "20px" }}>
        <CircularProgress size={80} thickness={4} />
        <Typography variant="h6" sx={{ color: "#8C1D40" }}>Loading, please wait...</Typography>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", backgroundColor: "#DBDADA", padding: 50, gap: 50 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 20, backgroundColor: "#FFFFFF", padding: 20, borderRadius: 5, flex: 1 }}>
        <Stack className="ticketInfo">
          <Button variant="text" className="backButton" onClick={handleBack} startIcon={<ArrowBackIosNewIcon />}>Back</Button>
          <div className="ticketId">Capstone Ticket - {ticketId}</div>
          <div className="subject">{TicketSubject}</div>

          <Stack direction="row" className="statusButtons">
            <TicketStatusIndicator status={ticketStatus.toUpperCase() || "UNKNOWN"} />
            {ticketData.escalated && <TicketStatusIndicator status={"ESCALATED"} />}
            <FormControl sx={{ minWidth: 150, ml: 2, mt: 1 }}>
              <InputLabel sx={{ top: "-5px" }}>Status</InputLabel>
              <Select value={ticketStatus} onChange={handleStatusChange} sx={{ padding: "10px", height: "40px" }}>
                <MenuItem value="New">New</MenuItem>
                <MenuItem value="In Progress">In Progress</MenuItem>
                <MenuItem value="Resolved">Resolved</MenuItem>
                <MenuItem value="Escalated">Escalated</MenuItem>
              </Select>
            </FormControl>
            <Button variant="contained" className="editButton" onClick={() => setEditOpen(true)}>Edit Ticket</Button>
            <ConfirmEdit handleOpen={editOpen} handleClose={editPopupClose} onConfirmEdit={handleConfirmEdit} />
            <Button variant="contained" className="deleteButton" onClick={() => setDeleteOpen(true)}>Delete Ticket</Button>
            <ConfirmDelete handleOpen={deleteOpen} handleClose={() => setDeleteOpen(false)} />
            {userType === "TA" && (
              <Button variant="contained" className="escalateButton" onClick={() => setEscalateOpen(true)}>Escalate Ticket</Button>
            )}
            <ConfirmEscalate handleOpen={escalateOpen} handleClose={() => setEscalateOpen(false)} />
          </Stack>

          <h3>Description:</h3>
          <div className="ticketAsset">{ticketData.issue_description}</div>
          <h3>Student:</h3>
          <div className="ticketAsset">{ticketData.student_name}</div>
          <h3>TA:</h3>
          <div className="ticketAsset">
            {idToNameMap[AssignedID]}&nbsp;
            {userType === "admin" && (
              <Button variant="contained" className="reassignButton" style={{ marginTop: "10px" }} onClick={() => setReassignOpen(true)}>Reassign</Button>
            )}
            <ConfirmReassign handleOpen={reassignOpen} handleClose={() => setReassignOpen(false)} ticketID={ticketId} oldTAID={AssignedID} idNameMap={idToNameMap} updateTA={(newTAID) => setAssignedID(newTAID)} />
          </div>
          <h3>Project:</h3>
          <div className="ticketAsset">{ticketData.team_name}</div>
          <h3>Replies:</h3>
          <ReplySection />
        </Stack>
      </div>
      {editFormOpen && <EditTicket ticketId={ticketId} onClose={() => setEditFormOpen(false)} handleSaveEdit={handleSaveEdit} />}
    </div>
  );
};

export default TicketInfo;


//github tracking 

