import React, {memo, useEffect, useState } from "react";
import Button from '@mui/material/Button';
import Cookies from "js-cookie";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
const baseURL = process.env.REACT_APP_API_BASE_URL;


const ConfirmTADelete = memo(({handleOpen, handleClose, ta, idNameMap}) => {
    const [selectedTAs, setSelectedTAs] = useState({}); //make selectedTA an array for each ticket?
    const [confirmedTickets, setConfirmedTickets] = useState({}); //keep track of tickets that have been reassigned
    const [data, setData] = useState([]);

    const handleSelectChange = (ticketId, event) => {
      setSelectedTAs((prevSelectedTAs) => ({
          ...prevSelectedTAs,
          [ticketId]: Number(event.target.value), // Update the selected TA for the specific ticket
      }));
    };

    const handleConfirmedTickets = (ticketId) => {
      setConfirmedTickets((prevConfirmedTickets) => ({
          ...prevConfirmedTickets,
          [ticketId]: true, // this ticket has been reassigned
      }));
    }

    const sortTicketsById = (tickets) => {
      return tickets.sort((a, b) =>  a.ticket_id - b.ticket_id);
    }

    const getTaFromTickets = (ticket) => {
      return idNameMap[selectedTAs[ticket.ticket_id]] || "Unknown TA";
    }

    const checkIfAllTicketsReassigned = () => {
      return data.length === Object.keys(confirmedTickets).length;
    }

    //ADD: rest api to make ticket reassignments for all tickets
    

    const fetchTicketAssignmentsByUserId = async (userId) => {
        try{
            const token = Cookies.get("token");
            const response = await fetch(
            `${baseURL}/api/ticketassignments/users/${userId}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );
    
          if (!response.ok) throw new Error("Failed to fetch ticket assignments.");
          const data = await response.json();
          const sortedData = sortTicketsById(data);
          setData(sortedData);
        } catch (error) {
          console.log(error);
        }
    };

    // Fetch ticket assignments when the pop up opens
    useEffect(() => {
        if (ta?.user_id) {
          fetchTicketAssignmentsByUserId(ta.user_id);
        }
      }, [ta]);

    // FOR TESTING
    useEffect(() => {
      console.log("idNameMap:", idNameMap);
      data.map((item, index) => {
        console.log(`Index: ${index}, Ticket ID: ${item.ticket_id}, User ID: ${item.user_id}`);
      });
    }, []);

    return(
        <Dialog
        open={handleOpen}
        onClose={handleClose}
        PaperProps={{
            component: 'form',
            onSubmit: (event) => {                                                                                                                                                                                                                                                    
            event.preventDefault();
            handleClose();
            },
        }}
        >
            <DialogContent>
                <DialogContentText>
                Are you sure you want to delete {ta.name}?
                If so, please reassign their tickets.
                </DialogContentText>
                
                {data.map((ticket, index) => (
                    <div key={index} style={{ display: "flex", alignItems: "center", margin: "10px" }}>
                      <label htmlFor={`dropdown-${index}`}>
                        <a 
                          href={`${baseURL}/ticketinfo?ticket=${ticket.ticket_id}`}
                          target = "_blank"
                          rel="noopener noreferrer"
                          style={{ textDecoration: "none", color: "#8C1D40", whiteSpace: "nowrap" }} 
                        >
                          Ticket {ticket.ticket_id}:
                        </a>
                      </label> 
                      {(confirmedTickets[ticket.ticket_id] === true) && (
                          <span style={{ marginLeft: "10px", color: "green", fontSize: "20px" }}> ✔ </span>
                      )} 
                      <select 
                        id={`dropdown-${index}`} 
                        style={{ marginLeft: "10px" }} 
                        value={selectedTAs[ticket.ticket_id] || ""} // Use the selected TA for the specific ticket
                        onChange={(event) => handleSelectChange(ticket.ticket_id, event)} 
                      >
                        {/* can't allow empty drop down to be submitted*/}
                          <option value="" disabled>Select a TA</option>
                          {Object.entries(idNameMap).map(([user_id, name]) => (
                            <option key={user_id} value={user_id}>{name}</option> //TA name is displayed but actual value for 'selectedTA' is user_id
                          ))}
                      </select>
                      <Button 
                        variant = "contained"
                        style = {{ marginLeft: "10px"}}
                        onClick={() => {
                          handleConfirmedTickets(ticket.ticket_id);
                          alert(`Ticket ${ticket.ticket_id} reassigned to ${getTaFromTickets(ticket)}`);
                          }
                        }
                      > 
                      {/* check mark should appear when done */}
                      {/* mark that ticket has officially been reassigned */}
                        Confirm
                      </Button>
                      
                    </div>
                ))}

                <DialogActions classname="buttons">
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button variant="contained" type="submit" > 
                      {/* prevent from click until all tickets are reassigned after confirm button clicked or randomized remaining */}
                      {/* add button to randomly reassign TA for unselected tickets */} 
                        Finish
                    </Button>
                </DialogActions>
            </DialogContent>
        </Dialog>
    )

});
export default ConfirmTADelete;