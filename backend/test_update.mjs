//NOTE: database must be running for this to work
import * as dotenv from 'dotenv' 
dotenv.config();

const baseURL = process.env.BASE_URL;
//console.log("Base URL: ", baseURL);
const token = process.env.COOKIE; //NOTE: must run project and get new token from Cookies (see steps below)
//console.log("Token: ", token);

const updateTicket = async () => {
    /*
    Methods to get token:

    1. run project and inspect page --> cookies --> application --> token

    2. include lines in TicketInfo.JS to get token and URL when running project:  
        console.log("Token: ", token);
        console.log("URL: ", `${baseURL}`);
    */

    //future update: translate TA name to numeric id
    const ticketId = 2; 
    const new_id = 76; 
    const old_user_id = 15; //NOTE: check database for current user_id for given ticketId
    
  
    const assignResponse = await fetch(
        `${baseURL}/api/ticketassignments/ticket/${ticketId}/assignment/${old_user_id}`,
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                new_user_id: new_id
            }),
        }
    );

    if (!assignResponse.ok) {
        console.error(`Failed to updated TA assignment. Status: ${assignResponse.status}`);
        console.error(`${assignResponse.reason}`);
    }

    const assignment = await assignResponse.json();
    console.log("Assignment", assignment);
};

updateTicket();