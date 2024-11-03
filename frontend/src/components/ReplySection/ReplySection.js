import React from 'react';
import { TextField, Stack, Button } from '@mui/material';
import ReplyBox from '../ReplyBox/ReplyBox';
import './ReplySection.css'

const ReplySection = ({replies}) => {

    const handleSubmit = () => {
        console.log("Post Reply button clicked")
        // Post reply to database
    }

    return(
        <Stack className='replySection' direction="column">
            <TextField
                id="outlined-multiline-static"
                multiline
                rows={4}
                label="Enter Your Reply Here"
            />
            <Button className="postButton" variant="contained" onClick={handleSubmit}>Post Reply</Button>
            {replies.map((reply) => (
                <ReplyBox key={reply.id} className="reply" reply={reply.replyText} author={reply.author} time={reply.time}></ReplyBox>
            ))}
        </Stack>
    );
}

export default ReplySection;