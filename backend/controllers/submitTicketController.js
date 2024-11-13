//const SubmitTicket = require("../models/SubmitTicket");

exports.submittedData = async (req, res) => {
    try {
        const response = await fetch('http://localhost:/api/tickets',
        {
            method: 'POST',
            headers: {
                'Content-Type' : 'application/json'
            },
            body: JSON.stringify(submittedData)
        });
    if (response.ok) {
        const submittedData = await response.json();
        console.log(submittedData);
        alert('Ticket submitted successfully!');
    }
    else{
        alert('Failed to submit ticket');
    }
}
    catch(error){
        console.error('Error:', error);
        alert('An error occured while submitting the ticket');
    }
}
