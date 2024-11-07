import React, { useState } from 'react';
import { TextField, Stack, Button } from '@mui/material';
import { useLocation } from 'react-router-dom';
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import ReplyBox from '../ReplyBox/ReplyBox';
import './ReplySection.css'

const ReplySection = ({replies}) => {
    const [newReplyText, setNewReplyText] = useState('')

    const location = useLocation();
    const urlParameters = new URLSearchParams(location.search)
    const ticketId = urlParameters.get('ticket')

    const token = Cookies.get('token')
    const decodedToken = jwtDecode(token);
    const userId = decodedToken.id;

    const handleChange = (event) => {
        setNewReplyText(event.target.value);
    };

    const handleSubmit = async () => {
        if (newReplyText != '') {
            const response = await fetch(
                `http://localhost:3000/api/communications/${ticketId}/communications`,
                {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    ticket_id: ticketId,
                    user_id: userId,
                    message: newReplyText,
                }),
                }
            );
            setNewReplyText('')
        }
    }

    return(
        <Stack className='replySection' direction="column">
            <TextField
                id="outlined-multiline-static"
                multiline
                rows={4}
                label="Enter Your Reply Here"
                value={newReplyText}
                onChange={handleChange}
            />
            <Button className="postButton" variant="contained" onClick={handleSubmit}>Post Reply</Button>
            {replies.map((reply) => (
                <ReplyBox key={reply.communication_id} className="reply" reply={reply.message} author={reply.user_name} time={reply.created_at}></ReplyBox>
            ))}
        </Stack>
    );
}

export default ReplySection;