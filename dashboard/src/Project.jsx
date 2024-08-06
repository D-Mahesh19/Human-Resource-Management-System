import React from 'react';

const Projects = () => {
    return (
      <div className='project1'>
        <div className="projects-container">
            <h1 className="title"> Projects</h1>
            <div className="projects-section">
                <h2 className="section-title">Completed Projects</h2>
                <ul className="project-list">
                <li className="project-item">Customer Relationship Management System - February 2024</li>
                <li className="project-item">Udemy Clone  - April 2024</li>
                <li className="project-item">Finance Management System - May 2024</li>
                <li className="project-item">Human Resource Management System - June 2024</li>
                </ul>
            </div>
            <div className="projects-section">
                <h2 className="section-title">Upcoming Projects</h2>
                <ul className="project-list">
                <li className="project-item">Content Management System - July 2024 </li>
                <li className="project-item">Learning Management System - August 2024</li>
                <li className="project-item">AI-based Attendance Prediction - October 2024</li>
                    <li className="project-item">Geo-fencing for Attendance - December 2024</li>
                    <li className="project-item">Voice Recognition Attendance - February 2025</li>
                </ul>
            </div>
        </div>
        </div>
        
    );
};

export default Projects;
