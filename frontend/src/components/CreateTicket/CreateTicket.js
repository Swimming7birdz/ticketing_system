import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import "./CreateTicket.css";

//In order to have the buttons have a ripple effect, this page has to be rebuilt with mui
//mui by default does the ripple effect
import { Button } from "@mui/material";

const baseURL = process.env.REACT_APP_API_BASE_URL;

const CreateTicket = ({ onClose }) => {
  const [studentName, setStudentName] = useState("");
  const [teamName, setTeamName] = useState("");
  const [sponsorName, setSponsorName] = useState("");
  const [section, setSection] = useState("");
  const [instructorName, setInstructorName] = useState("");
  const [issueType, setIssueType] = useState("");
  const [description, setDescription] = useState("");
  const [taList, setTaList] = useState([]); // Initialize as empty array
  const [teamList, setTeamList] = useState([]); // Initialize as empty array for teams

  useEffect(() => {
    fetchTAs();
    fetchTeams();
  }, []);

  // Fetch TA users from the API
  const fetchTAs = async () => {
    try {
      const token = Cookies.get("token");
      const response = await fetch(`${baseURL}/api/users/role/TA`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setTaList(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch TAs:", error);
      setTaList([]); // Fallback to empty array
    }
  };

  // Fetch Teams from the API
  const fetchTeams = async () => {
    try {
      const token = Cookies.get("token");
      const response = await fetch(`${baseURL}/api/teams`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setTeamList(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch teams:", error);
      setTeamList([]); // Fallback to empty array
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const submittedData = {
      studentName,
      teamName,
      sponsorName,
      section,
      instructorName,
      issueType,
      description,
    };

    try {
      const token = Cookies.get("token");
      const id = Cookies.get("user_id");

      // Step 2: Create the ticket
      const ticketResponse = await fetch(`${baseURL}/api/tickets`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          team_id: teamName, // Use the team ID selected from the dropdown
          student_id: id,
          sponsor_name: submittedData.sponsorName,
          section: submittedData.section,
          issue_type: submittedData.issueType,
          issue_description: submittedData.description,
        }),
      });

      if (!ticketResponse.ok) {
        throw new Error("Failed to create ticket.");
      }

      const ticket = await ticketResponse.json();

      // Step 3: Assign the TA to the ticket
      const assignResponse = await fetch(
        `${baseURL}/api/ticketassignments/ticket/${ticket.ticket_id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            user_id: submittedData.instructorName, // TA ID
          }),
        }
      );

      if (!assignResponse.ok) {
        throw new Error("Failed to assign ticket to TA.");
      }

      const a = await assignResponse.json();
      alert("Ticket submitted successfully!");
      console.log("Ticket created:", ticket);
      console.log("Assignment", a);

      // Reset the form
      setStudentName("");
      setTeamName("");
      setSponsorName("");
      setSection("");
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
    <div className="modal-overlay">
      <div className="modal-content">
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
        <h1>Create New Ticket</h1>
        <form onSubmit={handleSubmit}>
          <label>
            Student Name:
            <input
              type="text"
              placeholder="Enter your name"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              required
            />
          </label>
          <label>
            Section:
            <input
              type="text"
              placeholder="Enter your section"
              value={section}
              onChange={(e) => setSection(e.target.value)}
              required
            />
          </label>
          <label>
            Team:
            <select
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              required
            >
              <option value="">Select a team</option>
              {teamList.map((team) => (
                <option key={team.team_id} value={team.team_id}>
                  {team.team_name}
                </option>
              ))}
            </select>
          </label>
          <label>
            Sponsor Name:
            <input
              type="text"
              placeholder="Enter your Sponsor's name"
              value={sponsorName}
              onChange={(e) => setSponsorName(e.target.value)}
              required
            />
          </label>
          <label>
            Instructor (TA):
            <select
              value={instructorName}
              onChange={(e) => setInstructorName(e.target.value)}
              required
            >
              <option value="">Select an instructor</option>
              {taList.map((ta) => (
                <option key={ta.user_id} value={ta.user_id}>
                  {ta.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            Issue Type:
            <select
              value={issueType}
              onChange={(e) => setIssueType(e.target.value)}
              required
            >
              <option value="">Select an issue</option>
              <option value="sponsorIssue">Issues with Sponsor</option>
              <option value="teamIssue">Issues within the Team</option>
              <option value="assignmentIssue">Issues with Assignments</option>
              <option value="Bug">Bug</option>
              <option value="Feature Request">Feature Request</option>
              <option value="Question">Question</option>
              <option value="other">Other</option>
            </select>
          </label>
          <label>
            Description:
            <textarea
              placeholder="Describe your issue"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </label>
          <Button type="submit">Submit Ticket</Button>
        </form>
      </div>
    </div>
  );
};

export default CreateTicket;
