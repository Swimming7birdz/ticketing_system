import React, { useEffect, useState } from "react";
import Button from '@mui/material/Button';
import Cookies from "js-cookie";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import TextField from '@mui/material/TextField';
import { useTheme } from '@mui/material/styles';
const baseURL = process.env.REACT_APP_API_BASE_URL;

const TaConfirmEscalate = ({handleOpen, handleClose, ticketID}) => {
    const theme = useTheme();
    const [userInput, setUserInput] = useState('');
    const [error, setError] = useState(false);
    const token = Cookies.get("token");

    const handleUpdate = async (event) => {
        try{
            const escalateResponse = await fetch(
                `${baseURL}/api/tatickets/${ticketID}/escalate`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!escalateResponse.ok) {
                console.error(`Failed to escalate ticket. Status: ${escalateResponse.status}`);
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
                sx: {
                    bgcolor: theme.palette.background.paper,
                    color: theme.palette.text.primary,
                }
            }}
        >
            <DialogContent>
                <DialogContentText sx={{ color: theme.palette.text.primary, mb: 2 }}>
                    Note: This action will escalate the ticket Capstone coordinators.
                </DialogContentText>

                <TextField
                    placeholder="Enter comments"
                    value={userInput}
                    onChange={(event) => setUserInput(event.target.value)}
                    multiline
                    rows={4}
                    fullWidth
                    variant="outlined"
                    sx={{ mt: 1 }}
                />
                <DialogActions sx={{ mt: 2 }}>
                    <Button
                        onClick={handleClose}
                        sx={{ color: theme.palette.text.secondary }}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        type="submit"
                        onClick={handleSubmit}
                        sx={{
                            backgroundColor: theme.palette.primary.main,
                            '&:hover': {
                                backgroundColor: theme.palette.primary.dark,
                            },
                        }}
                    >
                        Confirm
                    </Button>
                </DialogActions>
            </DialogContent>
        </Dialog>
    )
}
export default TaConfirmEscalate;