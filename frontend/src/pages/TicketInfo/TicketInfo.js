import React, { useState, useEffect } from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TicketStatusIndicator from "../../components/TicketStatusIndicator/TicketStatusIndicator";
import ConfirmDelete from "../../components/ConfirmDelete/ConfirmDelete";
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ReplySection from "../../components/ReplySection/ReplySection";
import { useLocation, useNavigate } from 'react-router-dom';
import Cookies from "js-cookie";
import './TicketInfo.css';

const students = ["Kevin Tang", "Shabib Huq", "Rhea Mane", "Issac Alemu", "Ryan Radtke"]
const TAs = ["Vinayak Sharma"]
const ProjectName = "Capstone Ticketing System"
const ticketID = "CPSTN1-2345678"
const TicketSubject = "Sponsor Isn’t Responding"
const TicketDescription = "We’re having some communication issues with our project sponsor. Our sponsor missed a scheduled meeting with the team on Monday and has not responded to any email communication all week. We are unable to get our sprint document signed for this week because the sponsor is unresponsive. How should we approach this situation and can we get an extension on the sprint document this week?"

const replyList = [
    { id: 1, replyText: "Hi team, sorry to hear this. Has this happened before in the past?", author: "Jane Doe", time: "2 November 6:30pm" },
    { id: 2, replyText: "No the sponsor is typically responsive but has not responded in a week.", author: "Kevin Tang", time: "2 November 7:30pm" },
    { id: 3, replyText: "Ok I would recommend you to send a follow up. We will extend your deadline for the sprint retrospective this week.", author: "Jane Doe", time: "2 November 8:30pm" }
]


const TicketInfo = () => {
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [ticketData, setTicketData] = useState(null);
    const [repliesData, setRepliesData] = useState(null);
    const [loadingTicketData, setLoadingTicketData] = useState(true);
    const [loadingRepliesData, setLoadingRepliesData] = useState(true);
    const [error, setError] = useState(false);

    const navigate = useNavigate();

    const location = useLocation();
    const urlParameters = new URLSearchParams(location.search)
    const ticketId = urlParameters.get('ticket')

    const token = Cookies.get('token')


    useEffect(() => {
        const fetchData = async () => {
            try {
                const ticketDataResponse = await fetch(
                    `http://localhost:3000/api/tickets/info/${ticketId}`,
                    {
                      method: "GET",
                      headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                      },
                    }
                  );
                  
                const ticketData = await ticketDataResponse.json()
                setTicketData(ticketData)
                console.log(ticketData)
                

                const repliesDataResponse = await fetch(
                    `http://localhost:3000/api/communications/${ticketId}/communications`,
                    {
                      method: "GET",
                      headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                      },
                    }
                  );
                
                const repliesData = await repliesDataResponse.json() // iterate through replies and use user_id to grab names

                repliesData.map((reply) => {  // convert date into a more readable string
                    const date = new Date(reply.created_at)
                    const dateString = date.toLocaleString('en-US')
                    reply.created_at = dateString
                })

                setRepliesData(repliesData)
                console.log(repliesData)
            }
            catch (err) {
                console.log(error)
                setError(true)
            }
            finally {
                setLoadingRepliesData(false);
                setLoadingTicketData(false);
            }
        };
        fetchData();
    }, [ticketId]);

    if (error) {
        navigate('/unauthorized')
    }

    const handleBack = () => {
        console.log("Back Button Clicked")
    }

    const handleEditTicket = () => {
        console.log("Edit Ticket Button Clicked")
    }

    const handleDeleteTicket = () => {
        console.log("Delete Ticket Button Clicked")
        setDeleteOpen(true)
    }

    const deletePopupClose = () => {
        setDeleteOpen(false)
    }

    return(
        <>
        { !loadingRepliesData && !loadingTicketData ? (
        <div className="ticketInfoContainer">
            <Stack className="ticketInfo">
                <Button
                    variant="text"
                    className="backButton"
                    onClick={handleBack}
                    startIcon={<ArrowBackIosNewIcon />}
                >
                Back
                </Button>
                <div className="ticketId">Capstone Ticket - {ticketId}</div>
                <div className="subject">{TicketSubject}</div>
                <Stack direction="row" className="statusButtons">
                    <TicketStatusIndicator status={ticketData.status.toUpperCase()}/>
                    {ticketData.escalated && (
                        <TicketStatusIndicator status={"ESCALATED"}/>
                    )}
                    <Button
                        variant="contained"
                        className="editButton"
                        onClick={handleEditTicket}
                    >
                    Edit Ticket
                    </Button>
                    <Button
                        variant="contained"
                        className="deleteButton"
                        onClick={handleDeleteTicket}
                    >
                    Delete Ticket
                    </Button>
                    <ConfirmDelete handleOpen={deleteOpen} handleClose={deletePopupClose}/>
                </Stack>
                <h3>Description:</h3>
                <div className="ticketDescription">{ticketData.issue_description}</div>
                <h3>Replies:</h3>
                <ReplySection replies={repliesData}></ReplySection>
            </Stack>
            <Stack className="ticketUsers">
                <div>  
                    Student:
                    <div>{ticketData.student_name}</div>
                </div>
                <div>
                    TA:
                    {TAs.map((TaName) => {
                        return <div key={TaName}>{TaName}</div>
                    })}
                </div>
                <div>
                    Project:
                    <div>{ticketData.team_name}</div>
                </div>
            </Stack>
        </div>
        ) : (
            <div>Loading Ticket Info...</div>
        )
        }
        </>
    )
}




export default TicketInfo;