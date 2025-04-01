import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Typography from '@mui/material/Typography';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from "@mui/material/DialogTitle";
import { Stack } from '@mui/material';
import './ConfirmEdit.css'


const ConfirmEdit = ({ handleOpen, handleClose, onConfirmEdit }) => {
    return (
      <Dialog open={handleOpen} onClose={handleClose}>
        <DialogTitle>Edit Ticket</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to edit this ticket?</Typography>
        </DialogContent>
        <DialogActions className="buttons">
          <Button onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="contained" type="submit" onClick={onConfirmEdit}>
            Edit
          </Button>
        </DialogActions>
      </Dialog>
    );
};



export default ConfirmEdit;