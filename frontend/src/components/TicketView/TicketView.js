import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
//import "./TicketView.css"; // You can reuse CreateTicket.css or create a new one
import { useNavigate } from "react-router-dom";

//In order to have the buttons have a ripple effect, this page has to be rebuilt with mui
//mui by default does the ripple effect
import { Button } from "@mui/material";
import "./TicketView.css"; // Adjust if necessary

const baseURL = process.env.REACT_APP_API_BASE_URL;

const TicketView = ({ ticketId, onClose }) => {
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);

  let navigate = useNavigate()

  useEffect(() => {
    fetchTicketDetails();
  }, [ticketId]);

  const onOpenTicket = () => {
    navigate(`/ticketinfo?ticket=${ticketId}`)
  }

  const fetchTicketDetails = async () => {
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
        throw new Error("Failed to fetch ticket details");
      }

      const ticketData = await response.json();
      setTicket(ticketData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching ticket details:", error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <p>Loading ticket details...</p>
        </div>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <p>Failed to load ticket details.</p>
          <Button onClick={onClose}>Close</Button>
        </div>
      </div>
    );
  }

  //Robert: All buttons below have been updated with '<Button/>' in order to have a ripple effect when the button is clicked
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <Button 
          className="close-button" 
          onClick={onClose}
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            minWidth: "32px",
            minHeight: "32px",
            borderRadius: "50%",
            backgroundColor: "#8C1D40",
            color: "white",
            "&:hover": {
              backgroundColor: "#5F0E24",
            },
          }}
        >
          &times;
        </Button>
        <h1>Ticket Details</h1>
        <p>
          <strong>Ticket ID:</strong> {ticket.ticket_id}
        </p>
        <p>
          <strong>Student ID:</strong> {ticket.student_id}
        </p>
        <p>
          <strong>Team ID:</strong> {ticket.team_id}
        </p>
        {/* <p> */}
          {/* <strong>ASU ID:</strong> {ticket.asu_id} */}
        {/* </p> */}
        <p>
          <strong>Issue Description:</strong> {ticket.issue_description}
        </p>
        <p>
          <strong>Sponsor Name:</strong> {ticket.sponsor_name || "N/A"}
        </p>
        <p>
          <strong>Section:</strong> {ticket.section}
        </p>
        <p>
          <strong>Issue Type:</strong> {ticket.issue_type}
        </p>
        <p>
          <strong>Status:</strong> {ticket.status}
        </p>
        <p>
          <strong>Escalated:</strong> {ticket.escalated ? "Yes" : "No"}
        </p>
        <p>
          <strong>Created At:</strong>{" "}
          {new Date(ticket.created_at).toLocaleString()}
        </p>
        <p>
          <strong>Updated At:</strong>{" "}
          {new Date(ticket.updated_at).toLocaleString()}
        </p>
        <Button onClick={onOpenTicket}>View Ticket Page</Button>
      </div>
    </div>
  );
};

export default TicketView;
