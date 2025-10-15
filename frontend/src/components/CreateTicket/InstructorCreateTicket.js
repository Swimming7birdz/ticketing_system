import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import "./CreateTicket.css";

//In order to have the buttons have a ripple effect, this page has to be rebuilt with mui
//mui by default does the ripple effect
import { Box, Button, Typography, TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { useTheme } from "@mui/material/styles";

const baseURL = process.env.REACT_APP_API_BASE_URL;

const InstructorCreateTicket = ({ onClose }) => {
    const theme = useTheme();
    const [instructorName, setInstructorName] = useState(Cookies.get("name") || "");
    const [issueType, setIssueType] = useState("");
    const [description, setDescription] = useState("");

    const handleSubmit = async (event) => {
        event.preventDefault();

        const submittedData = {
            instructorName,
            issueType,
            description,
        };

        try {
            const token = Cookies.get("token");
            const id = Cookies.get("user_id");
            const name = Cookies.get("name");

            // Step 2: Create the ticket
            const ticketResponse = await fetch(`${baseURL}/api/tatickets`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                     ta_id: id,
                    issue_type: submittedData.issueType,
                    issue_description: submittedData.description,

                }),
            });

            if (!ticketResponse.ok) {
                throw new Error("Failed to create ticket.");
            }

            const ticket = await ticketResponse.json();


            alert("Ticket submitted successfully!");
            console.log("Ticket created:", ticket);

            // Reset the form
            setInstructorName("");
            setIssueType("");
            setDescription("");

            if (onClose) onClose(); // Close modal if `onClose` is provided
            window.location.reload();
        } catch (error) {
            console.error("Error creating ticket:", error);
            alert(error.message || "An error occurred while submitting the ticket.");
        }
    };

    //Robert: All buttons below have been updated with '<Button/>' in order to have a ripple effect when the button is clicked
    return (
        <Box className="modal-overlay"
             sx={{
                 position: 'fixed',
                 top: 0,
                 left: 0,
                 width: '100vw',
                 height: '100vh',
                 bgcolor: 'rgba(0, 0, 0, 0.5)',
                 display: 'flex',
                 justifyContent: 'center',
                 alignItems: 'center',
                 zIndex: 1000,
                 pl: '250px',
                 pt: '50px',
             }}
        >
            <Box className="modal-content"
                 sx={{
                     bgcolor: theme.palette.background.paper,
                     p: 3,
                     borderRadius: 2.5,
                     width: '90%',
                     maxWidth: 600,
                     position: 'relative',
                     boxShadow: 3,
                     mt: -6.25,
                 }}
            >
                {/* Close button */}
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

                {/* Form Content */}
                <Typography variant="h4" sx={{
                    mb: 2,
                    fontWeight: 'bold',
                    textAlign: 'center',
                    color: theme.palette.text.primary
                }}>
                    Create New Ticket
                </Typography>
                <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <TextField
                        label="Your Name"
                        variant="outlined"
                        value={instructorName}
                        required
                        fullWidth
                        disabled
                    />

                    <FormControl fullWidth required>
                        <InputLabel>Issue Type</InputLabel>
                        <Select
                            value={issueType}
                            label="Issue Type"
                            placeholder="Select a issue type"
                            onChange={(e) => setIssueType(e.target.value)}
                        >
                            <MenuItem value="sponsorIssue">Issues with Sponsor</MenuItem>
                            <MenuItem value="teamIssue">Issues within the Team</MenuItem>
                            <MenuItem value="assignmentIssue">Issues with Assignments</MenuItem>
                            <MenuItem value="Bug">Bug</MenuItem>
                            <MenuItem value="Feature Request">Feature Request</MenuItem>
                            <MenuItem value="Question">Question</MenuItem>
                            <MenuItem value="other">Other</MenuItem>
                        </Select>
                    </FormControl>
                    <TextField
                        label="Description"
                        variant="outlined"
                        placeholder="Describe your issue"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                        fullWidth
                        multiline
                        rows={6}
                    />
                    <Button type="submit">Submit Ticket</Button>
                </Box>
            </Box>
        </Box>
    );
};

export default InstructorCreateTicket;
