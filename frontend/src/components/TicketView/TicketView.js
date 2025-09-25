import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Box, Typography, Modal } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { issueTypeDisplay } from "../../constants/IssueTypes";

const baseURL = process.env.REACT_APP_API_BASE_URL;

const TicketView = ({ ticketId, onClose }) => {
  const theme = useTheme();
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
      <Modal open={true} onClose={onClose}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 500,
            maxWidth: '90%',
            maxHeight: '80vh',
            overflow: 'auto',
            bgcolor: theme.palette.background.paper,
            color: theme.palette.text.primary,
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography>Loading ticket details...</Typography>
        </Box>
      </Modal>
    );
  }

  if (!ticket) {
    return (
      <Modal open={true} onClose={onClose}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 500,
            maxWidth: '90%',
            maxHeight: '80vh',
            overflow: 'auto',
            bgcolor: theme.palette.background.paper,
            color: theme.palette.text.primary,
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography>Failed to load ticket details.</Typography>
          <Button onClick={onClose} sx={{ mt: 2 }}>Close</Button>
        </Box>
      </Modal>
    );
  }

  return (
    <Modal open={true} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 500,
          maxWidth: '90%',
          maxHeight: '80vh',
          overflow: 'auto',
          bgcolor: theme.palette.background.paper,
          color: theme.palette.text.primary,
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
        }}
      >
        <Button 
          onClick={onClose}
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            minWidth: "32px",
            minHeight: "32px",
            borderRadius: "50%",
            backgroundColor: theme.palette.primary.main,
            color: "white",
            "&:hover": {
              backgroundColor: theme.palette.primary.dark,
            },
          }}
        >
          &times;
        </Button>
        
        <Typography variant="h4" component="h1" sx={{ mb: 3, textAlign: 'center', fontWeight: 'bold' }}>
          Ticket Details
        </Typography>
        
        <Typography sx={{ mb: 1 }}>
          <strong>Ticket ID:</strong> {ticket.ticket_id}
        </Typography>
        <Typography sx={{ mb: 1 }}>
          <strong>Student ID:</strong> {ticket.student_id}
        </Typography>
        <Typography sx={{ mb: 1 }}>
          <strong>Team ID:</strong> {ticket.team_id}
        </Typography>
        <Typography sx={{ mb: 1 }}>
          <strong>Issue Description:</strong> {ticket.issue_description}
        </Typography>
        <Typography sx={{ mb: 1 }}>
          <strong>Sponsor Name:</strong> {ticket.sponsor_name || "N/A"}
        </Typography>
        <Typography sx={{ mb: 1 }}>
          <strong>Section:</strong> {ticket.section}
        </Typography>
        <Typography sx={{ mb: 1 }}>
          <strong>Issue Type:</strong> {issueTypeDisplay[ticket.issue_type] || "Unknown Issue Type"}
        </Typography>
        <Typography sx={{ mb: 1 }}>
          <strong>Status:</strong> {ticket.status}
        </Typography>
        <Typography sx={{ mb: 1 }}>
          <strong>Escalated:</strong> {ticket.escalated ? "Yes" : "No"}
        </Typography>
        <Typography sx={{ mb: 1 }}>
          <strong>Created At:</strong> {new Date(ticket.created_at).toLocaleString()}
        </Typography>
        <Typography sx={{ mb: 3 }}>
          <strong>Updated At:</strong> {new Date(ticket.updated_at).toLocaleString()}
        </Typography>
        
        <Button 
          onClick={onOpenTicket}
          variant="contained"
          sx={{
            display: 'block',
            margin: '0 auto',
            backgroundColor: theme.palette.primary.main,
            '&:hover': {
              backgroundColor: theme.palette.primary.dark,
            },
          }}
        >
          VIEW TICKET PAGE
        </Button>
      </Box>
    </Modal>
  );
};

export default TicketView;
