import React from "react";
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TicketStatusIndicator from "../../components/TicketStatusIndicator/TicketStatusIndicator";
import './TicketInfo.css';

const students = ["Kevin Tang", "Shabib Huq", "Rhea Mane", "Issac Alemu", "Ryan Radtke"]
const TAs = ["Vinayak Sharma"]
const ProjectName = "Capstone Ticketing System"
const ticketID = "CPSTN1-2345678"
const TicketSubject = "Sponsor Isn’t Responding"
const TicketDescription = "We’re having some communication issues with our project sponsor. Our sponsor missed a scheduled meeting with the team on Monday and has not responded to any email communication all week. We are unable to get our sprint document signed for this week because the sponsor is unresponsive. How should we approach this situation and can we get an extension on the sprint document this week?"

const TicketInfo = () => {

    const editTicket = () => {
        console.log("Edit Ticket Button Clicked")
    }

    const deleteTicket = () => {
        console.log("Delete Ticket Button Clicked")
    }

    return(
        <div className="ticketInfoContainer">
            <Stack className="ticketInfo">
                <div className="ticketId">{ticketID}</div>
                <div className="subject">{TicketSubject}</div>
                <Stack direction="row" className="statusButtons">
                    <TicketStatusIndicator status={"Open"}/>
                    <TicketStatusIndicator status={"Escalated"}/>
                    <Button
                        variant="contained"
                        className="editButton"
                        onClick={editTicket}
                    >
                    Edit Ticket
                    </Button>
                    <Button
                        variant="contained"
                        className="deleteButton"
                        onClick={deleteTicket}
                    >
                    Delete Ticket
                    </Button>
                </Stack>
                Description:
                <div className="ticketDescription">{TicketDescription}</div>
                Replies:
            </Stack>
            <Stack className="ticketUsers">
                <div>  
                    Students:
                    {students.map((studentName) => {
                        return <div key={studentName}>{studentName}</div>
                    })}
                </div>
                <div>
                    TA:
                    {TAs.map((TaName) => {
                        return <div key={TaName}>{TaName}</div>
                    })}
                </div>
                <div>
                    Project:
                    <div>{ProjectName}</div>
                </div>
            </Stack>
        </div>
    )
}




export default TicketInfo;