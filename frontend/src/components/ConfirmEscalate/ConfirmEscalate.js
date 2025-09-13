import React, { useEffect, useState } from "react";
import Button from '@mui/material/Button';
import Cookies from "js-cookie";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
const baseURL = process.env.REACT_APP_API_BASE_URL;

const ConfirmEscalate = ({handleOpen, handleClose, ticketID}) => {
    const [userInput, setUserInput] = useState('');
    const [error, setError] = useState(false);
    const token = Cookies.get("token");
    
      const handleUpdate = async (event) => {
        try{
            const escalateResponse = await fetch(
                `${baseURL}/api/tickets/${ticketID}/escalate`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
        
            if (!escalateResponse.ok) {
                console.error(`Failed to esclate ticket. Status: ${escalateResponse.status}`);
                console.error(`${escalateResponse.reason}`);
                alert("Failed to escalate ticket. Please try again.");
            } else {
                alert("Ticket was escalated successfully.");        
            }
            

        } catch(error) {
            console.log("Error: ", error);
            setError(true);
        }
    }


     const handleSubmit = () => {
        handleUpdate();
        handleClose();  
    }

    return (
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
                Note: This action will escalate the ticket Capstone coordinators. 
                </DialogContentText>
                
                <DialogActions classname="textbox">

                    <textarea
                        placeholder="Enter comments"
                        value={userInput} // Bind the value to a state variable
                        onChange={(event) => setUserInput(event.target.value)} // Update the state on change
                        style={{
                            width: '100%',
                            height: '100px',
                            padding: '8px',
                            margin: '10px 0',
                            border: '1px solid #ccc',
                            borderRadius: '4px',
                            resize: 'vertical',
                        }}
                    />
                    
                </DialogActions>
                <DialogActions classname="buttons">
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button variant="contained" type="submit" onClick={handleSubmit}>
                        Confirm
                    </Button>
                </DialogActions>
            </DialogContent>
        </Dialog>  
    )
}
export default ConfirmEscalate;