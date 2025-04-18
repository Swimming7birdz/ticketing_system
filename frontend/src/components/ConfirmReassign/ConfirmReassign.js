import React, { useEffect, useState } from "react";
import Button from '@mui/material/Button';
import Cookies from "js-cookie";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import './ConfirmReassign.css'
const baseURL = process.env.REACT_APP_API_BASE_URL;


const ConfirmReassign = ({handleOpen, handleClose, ticketID, oldTAID, idNameMap, updateTA}) => { 
    const [selectedTA, setSelectedTA] = useState(''); //current TA
    const [error, setError] = useState(false);

    const handleSelectChange = (event) => {
        setSelectedTA(Number(event.target.value));
    };

    const taEntries = Object.entries(idNameMap);

    const handleSubmit = async (event) => {
        event.preventDefault(); // Prevent form submission
        //console.log("Selected TA: ", typeof selectedTA, selectedTA);
        //console.log("Old TA: ", typeof oldTAID, oldTAID);

        if (selectedTA === oldTAID) {
            alert("You cannot reassign the ticket to the same TA. Please select a different TA.");
            return; // Exit without making the PUT request
        }
        
        try{
            const token = Cookies.get("token");

            const assignResponse = await fetch(
                `${baseURL}/api/ticketassignments/ticket/${ticketID}/assignment/${oldTAID}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        new_user_id: selectedTA
                    }),
                }
            );
        
            if (!assignResponse.ok) {
                console.error(`Failed to updated TA assignment. Status: ${assignResponse.status}`);
                console.error(`${assignResponse.reason}`);
            }
            const assignment = await assignResponse.json(); //for testing
            console.log("Assignment", assignment);
            updateTA(selectedTA);
            handleClose();

        } catch(error) {
            console.log("Error: ", error);
            setError(true);
        }
    }

    return(
        <Dialog
        open={handleOpen}
        onClose={handleClose}
        PaperProps={{
            component: 'form',
            onSubmit: (event) => {
            event.preventDefault();
            //handleClose();
            },
        }}
        >
            <DialogContent>
                <DialogContentText> 
                Pick a new TA to reassign this ticket 
                </DialogContentText>
                <DialogActions classname="dropdown">
                    <select value={selectedTA} onChange={handleSelectChange}>
                        <option value="" disabled>Select a TA</option>
                        {taEntries.map(([user_id, name]) => (
                        <option key={user_id} value={user_id}>{name}</option> //TA name is displayed but actual value for 'selectedTA' is user_id
                        ))}
                    </select>
                    
                </DialogActions>
                <DialogActions classname="buttons">
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleSubmit} variant="contained" type="submit">
                        Confirm
                    </Button>
                </DialogActions>
            </DialogContent>
        </Dialog>
    )
}


export default ConfirmReassign;