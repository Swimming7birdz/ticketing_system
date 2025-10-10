import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import { Stack } from '@mui/material';
import './ConfirmDelete.css'


const ConfirmDelete = ({handleOpen, handleClose, onConfirmDelete}) => {
    const handleSubmit = (event) => {
        event.preventDefault();
        if (onConfirmDelete) {
            onConfirmDelete();
        }
        handleClose();
    };

    return(
        <Dialog
        open={handleOpen}
        onClose={handleClose}
        PaperProps={{
            component: 'form',
            onSubmit: handleSubmit,
        }}
        >
            <DialogContent>
                <DialogContentText>
                Are you sure you want to delete this ticket?
                </DialogContentText>
                <DialogActions className="buttons">
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button variant="contained" type="submit">
                        Delete
                    </Button>
                </DialogActions>
            </DialogContent>
        </Dialog>
    )
}



export default ConfirmDelete;