import React from "react";
import './TicketStatusIndicator.css';

const TicketStatusIndicator = ({status}) => {
    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case "new":
                return "#FFFFC5";
            case "ongoing":
                return "#ADE1BE";
            case "escalated":
                return "#F89795";
            case "resolved":
                return "#A0C0F0";
            default:
                return "gray"; 
        }
    };

    return (
        <div className="ticketStatusIndicator">
            <span 
                className="statusCircle" 
                style={{ backgroundColor: getStatusColor(status) }} 
            >
                {status}
            </span>
        </div>
    );
}


export default TicketStatusIndicator;