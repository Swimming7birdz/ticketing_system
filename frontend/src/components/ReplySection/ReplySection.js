import { Button, Stack, TextField } from "@mui/material";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import ReplyBox from "../ReplyBox/ReplyBox";
import "./ReplySection.css";
const baseURL = process.env.REACT_APP_API_BASE_URL;

const ReplySection = () => {
  const [newReplyText, setNewReplyText] = useState("");
  const [repliesData, setRepliesData] = useState(null);
  const [loadingRepliesData, setLoadingRepliesData] = useState(true);
  const [error, setError] = useState(false);
  const [shouldRefresh, setShouldRefresh] = useState(false);

  const location = useLocation();
  const urlParameters = new URLSearchParams(location.search);
  const ticketId = urlParameters.get("ticket");

  const token = Cookies.get("token");
  const decodedToken = jwtDecode(token);
  const userId = decodedToken.id;

  useEffect(() => {
    const fetchReplies = async () => {
      try {
        const repliesDataResponse = await fetch(
          `${baseURL}/api/communications/${ticketId}/communications`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const repliesData = await repliesDataResponse.json(); // iterate through replies and use user_id to grab names

        repliesData.map((reply) => {
          // convert date into a more readable string
          const date = new Date(reply.created_at);
          const dateString = date.toLocaleString("en-US");
          reply.created_at = dateString;
        });

        setRepliesData(repliesData);
        console.log(repliesData);
      } catch (err) {
        console.log(error);
        setError(true);
      } finally {
        setLoadingRepliesData(false);
      }
    };
    fetchReplies();
  }, [ticketId, shouldRefresh]);

  if (error) {
    navigate("/unauthorized");
  }

  const handleChange = (event) => {
    setNewReplyText(event.target.value);
  };

  const handleSubmit = async () => {
    if (newReplyText != "") {
      try {
        const response = await fetch(
          `${baseURL}/api/communications/${ticketId}/communications`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              ticket_id: ticketId,
              user_id: userId,
              message: newReplyText,
            }),
          }
        );
        setShouldRefresh((prev) => !prev);
        setNewReplyText("");
      } catch (err) {
        console.log(err);
      }
    }
  };

  return (
    <>
      {!loadingRepliesData ? (
        <Stack className="replySection" direction="column">
          <TextField
            id="outlined-multiline-static"
            multiline
            rows={4}
            label="Enter Your Reply Here"
            value={newReplyText}
            onChange={handleChange}
          />
          <Button
            className="postButton"
            variant="contained"
            onClick={handleSubmit}
          >
            Post Reply
          </Button>
          {repliesData.map((reply) => (
            <ReplyBox
              key={reply.communication_id}
              className="reply"
              reply={reply.message}
              author={reply.user_name}
              time={reply.created_at}
            ></ReplyBox>
          ))}
        </Stack>
      ) : (
        <div>Loading Replies </div>
      )}
    </>
  );
};

export default ReplySection;
