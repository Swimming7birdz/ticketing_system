import React from "react";
import './TicketStatusIndicator.css';

const TicketStatusIndicator = ({status}) => {
    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case "open":
                return "#ADE1BE";
            case "escalated":
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