import React from "react";
import './TicketStatusIndicator.css';

const TicketStatusIndicator = ({status}) => {
    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case "new":
                return "#F89795";
            case "ongoing":
                return "#A0C0F0";
            case "escalated":
                return "#A9CDEB";
            case "resolved":
                return "#ADE1BE";
            default:
                return "gray"; 
        }
    };

    const getStatusFontColor = (status) => {
        switch (status.toLowerCase()) {
            case "new":
                return "#D00505";
            case "ongoing":
                return "#1965D8";
            case "escalated":
                return "#326D94";
            case "resolved":
                return "#1C741F";
            default:
                return "black"; 
        }
    };

    return (
        <div className="ticketStatusIndicator">
            <span 
                className="statusCircle" 
                style={{ backgroundColor: getStatusColor(status), color: getStatusFontColor(status) }} 
            >
                {status}
            </span>
        </div>
    );
}


export default TicketStatusIndicator;