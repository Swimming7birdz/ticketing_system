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

const TAs = ["John Smith"]
const TicketSubject = "Sponsor Isn’t Responding"

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
                
            }
            catch (err) {
                console.log(error)
                setError(true)
            }
            finally {
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
        { !loadingTicketData ? (
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
                <ReplySection></ReplySection>
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