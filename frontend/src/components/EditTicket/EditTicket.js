import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "./EditTicket.css";

import { Button } from "@mui/material";

const baseURL = process.env.REACT_APP_API_BASE_URL;

// Fetch current ticket details
//const ticketId = urlParameters.get("ticket");

const EditTicket = ({ onClose}) => {
    const [studentName, setStudentName] = useState("");
    const [section, setSection] = useState("");
    const [team, setTeam] = useState("");
    const [sponsorName, setSponsorName] = useState("");
    const [instructor, setInstructor] = useState("");
    const [issueType, setIssueType] = useState("");
    const [description, setDescription] = useState("");
    const [teamList, setTeamList] = useState([]); //empty array
    const [taList, setTaList] = useState([]); //empty array

    const location = useLocation();
    const urlParameters = new URLSearchParams(location.search);
    const ticketId = urlParameters.get("ticket");

    useEffect(() => {
        console.log("Fetching ticket details for ticketId:", ticketId);
        fetchTicketDetails(ticketId);
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

    const fetchTicketDetails = async (event) => {
      try {
          const token = Cookies.get("token");

          const response = await fetch(`${baseURL}/api/tickets/${ticketId}`, {
              method: "GET",
              headers: {
                  Authorization: `Bearer ${token}`,
              },
          });

          const ticketData = await response.json();
          console.log("Fetched ticket data:", ticketData);

          setStudentName(ticketData.student_name);
          setTeam(ticketData.team_id);
          setSponsorName(ticketData.sponsor_name);
          setSection(ticketData.section);
          setInstructor(ticketData.instructor_id);
          setIssueType(ticketData.issue_type);
          setDescription(ticketData.issue_description);
      } catch (error) {
          console.error("Failed to fetch ticket details:", error);
      }
    };


   // Handle submission for editing the ticket
  const handleEdit = async (event) => {
    event.preventDefault();

    console.log("Submitting ticket data:", {
      team_id: team,
      sponsor_name: sponsorName,
      section: section,
      issue_type: issueType,
      issue_description: description,
      instructor_id: instructor,
    });

    try {
      const token = Cookies.get("token");
      const response = await fetch(`${baseURL}/api/tickets/${ticketId}/edit`, {
        method: "PUT", // Use PUT or PATCH based on your backend setup
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          team_id: team,
          sponsor_name: sponsorName,
          section: section,
          issue_type: issueType,
          issue_description: description,
          instructor_id: instructor, // Update assigned TA if necessary
        }),
      });

      const responseData = await response.json();
      console.log("Response from server:", responseData);

      if(response.ok) {
        alert("Ticket updated successfully!");
        onClose(); // Close the modal after updating
      }
      else {
        console.error("Failed to update ticket:", responseData.message || "Unknown error");
        alert("Failed to update ticket.");
      }
    } catch (error) {
      console.error("Error updating ticket:", error);
      alert("Failed to update the ticket.");
    }
  };

  console.log("Current state values:", {
    studentName,
    section,
    team,
    sponsorName,
    instructor,
    issueType,
    description,
  });


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

        <h1>Edit Ticket</h1>
        <form onSubmit={handleEdit}>
          <label>
            Student Name:
            <input
              type="text"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              disabled // Keep this read-only if needed
            />
          </label>
          <label>
            Section:
            <input
              type="text"
              value={section}
              onChange={(e) => setSection(e.target.value)}
              required
            />
          </label>
          <label>
            Team:
            <select
              value={team}
              onChange={(e) => setTeam(e.target.value)}
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
              value={sponsorName}
              onChange={(e) => setSponsorName(e.target.value)}
              required
            />
          </label>
          <label>
            Instructor (TA):
            <select
              value={instructor}
              onChange={(e) => setInstructor(e.target.value)}
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
              <option value="other">Other</option>
            </select>
          </label>
          <label>
            Description:
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </label>
          <Button type="submit">Update Ticket</Button>
        </form>
      </div>
    </div>
  );
};

export default EditTicket;

