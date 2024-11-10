import React, { useState } from 'react';
import './IssueSubmissionForm.css';

const IssueSubmissionForm = () => {
    const [studentName, setStudentName] = useState('');
    const [teamName, setTeamName] = useState('');
    const [sponsorName, setSponsorName] = useState('');
    const [section, setSection] = useState('');
    const [instructorName, setInstructorName] = useState('');
    const [issueType, setIssueType] = useState('');
    const [description, setDescription] = useState('');
    const [teamMembers, setTeamMembers] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();

        const submittedData = {
            studentName,
            teamName,
            sponsorName,
            section,
            instructorName,
            issueType,
            description,
            teamMembers
        }

        console.log(submittedData);
        alert('Ticket submitted successfully!');

        // Resets the form
        setStudentName('');
        setTeamName('');
        setSponsorName('');
        setSection('');
        setInstructorName('');
        setIssueType('');
        setDescription('');
        setTeamMembers('');
    };

    return (
        <div className="container">
            <h1 className='header'>Submit New Request</h1>
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

                <label className='formLabel' htmlFor="sponsorName">Sponsor Name:</label>
                <input
                    type="text"
                    id="sponsorName"
                    className='formControl'
                    value={sponsorName}
                    onChange={(e) => setSponsorName(e.target.value)}
                    required
                />

                <label className='formLabel' htmlFor="section">Class Section:</label>
                <select
                    id="section"
                    className='formControl'
                    value={section}
                    onChange={(e) => setSection(e.target.value)}
                    required
                >
                    <option value="" disabled>Select Section</option>
                    <option value="MW1">M/W 10:30-11:20</option>
                    <option value="MW2">M/W 12:00-12:50</option>
                    <option value="MW3">M/W 3:00-3:50</option>
                    <option value="MW4">M/W 4:30-5:20</option>
                    <option value="TT1">T/Th 10:30-11:20</option>
                    <option value="TT2">T/Th 12:00-12:50</option>
                    <option value="TT3">T/Th 3:00-3:50</option>
                    <option value="TT4">T/Th 4:30-5:20</option>
                </select>

                <label className='formLabel' htmlFor="instructorName">Instructor Name:</label>
                <input
                    type="text"
                    id="instructorName"
                    className='formControl'
                    value={instructorName}
                    onChange={(e) => setInstructorName(e.target.value)}
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
                    <option value="sponsorIssue">Issues with Sponsor</option>
                    <option value="teamIssue">Issues within the Team</option>
                    <option value="assignmentIssue">Issues with Assignments or Grading (Including Extensions)</option>
                    <option value="other">Other</option>
                </select>

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

                <button className='submitButton' type="submit">Submit Request</button>
            </form>
        </div>
    );
};

export default IssueSubmissionForm;