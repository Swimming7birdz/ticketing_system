import React, { useEffect, useState } from "react";
import Button from '@mui/material/Button';
import Cookies from "js-cookie";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';

const ConfirmEscalate = ({handleOpen, handleClose}) => {
    const [userInput, setUserInput] = useState('');
    
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
                    <Button variant="contained" type="submit">
                        Confirm
                    </Button>
                </DialogActions>
            </DialogContent>
        </Dialog>  
    )
}
export default ConfirmEscalate;