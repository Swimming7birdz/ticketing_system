import React, { useState } from 'react';
import './IssueSubmissionForm.css';

const IssueSubmissionForm = () => {
    const [studentName, setStudentName] = useState('');
    const [teamName, setTeamName] = useState('');
    const [classSection, setClassSection] = useState('');
    const [sponsorName, setSponsorName] = useState('');
    const [instructorName, setInstructorName] = useState('');
    const [isSmallTeam, setIsSmallTeam] = useState(false);
    const [issueType, setIssueType] = useState('');
    const [description, setDescription] = useState('');
    const [teamMembers, setTeamMembers] = useState('');
    const [newMembers, setNewMembers] = useState('');
    const [formData, setFormData] = useState('');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({...formData, [name]: value });
    };

    const handleCheckBoxChange = () => {
        setIsSmallTeam(!isSmallTeam);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        
        const submittedData = {
            studentName,
            teamName,
            classSection,
            sponsorName,
            instructorName,
            issueType,
            description,
            teamMembers,
            newMembers
        }
        
        console.log(submittedData);
        alert('Ticket submitted successfully!');

        // Resets the form
        setStudentName('');
        setTeamName('');
        setClassSection('');
        setSponsorName('');
        setInstructorName('');
        setIssueType('');
        setDescription('');
        setTeamMembers('');
        setNewMembers('');
        setIsSmallTeam(false);
    };

    return (
        <div className="container">
            <h1 className='header'>Submit a Ticket For Project Capstone!</h1>
            <form onSubmit={handleSubmit}>
                <label className='formLabel' htmlFor="studentName">Student Name:</label>
                <input
                    type="text"
                    id="studentName"
                    className='formControl'
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    required
                />

                <label className='formLabel' htmlFor="teamName">Team Name:</label>
                <input
                    type="text"
                    id="teamName"
                    className='formControl'
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    required
                />

                <label className='formLabel' htmlFor="classSection">Class Section Number:</label>
                <input
                    type="text"
                    id="classSection"
                    className='formControl'
                    value={classSection}
                    onChange={(e) => setClassSection(e.target.value)}
                    required
                />

                <label className='formLabel' htmlFor="sponsorName">Sponsor Name:</label>
                <input
                    type="text"
                    id="sponsorName"
                    className='formControl'
                    value={sponsorName}
                    onChange={(e) => setSponsorName(e.target.value)}
                    required
                />

                <label className='formLabel' htmlFor="instructorName">Instructor Name:</label>
                <input
                    type="text"
                    id="instructorName"
                    className='formControl'
                    value={instructorName}
                    onChange={(e) => setInstructorName(e.target.value)}
                    required
                />

                <label className='formLabel' htmlFor="issueType">Select Issue Type:</label>
                <select
                    id="issueType"
                    className='formControl'
                    value={issueType}
                    onChange={(e) => setIssueType(e.target.value)}
                    required
                >
                    <option value="" disabled>Select an issue</option>
                    <option value="sponsorNotCommunicating">Sponsor Not Communicating</option>
                    <option value="teamMemberNotContributing">Team Member Not Contributing</option>
                    <option value="delaysOutOfControl">Project Setbacks</option>
                    <option value="sponsorBeingRude">Sponsor Being Unprofessional</option>
                    <option value="other">Other</option>
                </select>

            <div className="checkbox-container">
                    <label>
                        Small Team? Check if you'd like to add new members.
                    </label>
                    <input
                    type="checkbox"
                    checked={isSmallTeam}
                    onChange={handleCheckBoxChange}
                    />
            </div>


                {isSmallTeam && (
                    <label>
                        Names of potential new team members:
                        <input
                        type="text"
                        name='newMembers'
                        value={formData.newMembers}
                        onChange={handleInputChange}
                        placeholder="Enter names, separated by commas"
                        />
                    </label>
                )}

                <label className='formLabel' htmlFor="description">Description:</label>
                <textarea
                    id="description"
                    className='formControl'
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows="4"
                    required
                />

                <label className='formLabel' htmlFor="teamMembers">Team Members Involved:</label>
                <input
                    type="text"
                    className='formControl'
                    id="teamMembers"
                    value={teamMembers}
                    onChange={(e) => setTeamMembers(e.target.value)}
                    placeholder="Enter names, separated by commas"
                />

                <button className='submitButton' type="submit">Submit Issue</button>
            </form>
        </div>
    );
};

export default IssueSubmissionForm;