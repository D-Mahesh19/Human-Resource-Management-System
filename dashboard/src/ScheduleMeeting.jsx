import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { IoCloseOutline } from "react-icons/io5";


const ScheduleMeeting = () => {
    const [Details, setDetails] = useState([]);  
    const [selectedEmployees, setSelectedEmployees] = useState([]);
    const [MeetingDate, setMeetingDate] = useState('');
    const [MeetingTime, setMeetingTime] = useState('');
    const [MeetingName, setMeetingName] = useState('');
    const [MeetingLink, setMeetingLink] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredDetails, setFilteredDetails] = useState([]);
    const [showPopup, setShowPopup] = useState(false);

    useEffect(() => {
        axios.get('http://localhost:8081/getfull')
          .then((response) => {
            console.log(response.data);
            setDetails(response.data);
            setFilteredDetails(response.data);  // Set filtered details initially
          })
          .catch((error) => {
            console.error('There was an error fetching the data!', error);
          });
      }, []);

    const handleEmployeeClick = (employee) => {
        setSelectedEmployees(prevSelected => {
            if (prevSelected.some(e => e.Email === employee.Email)) {
                return prevSelected.filter(e => e.Email !== employee.Email);
            } else {
                return [...prevSelected, employee];
            }
        });
    };

    const handleClosePopup = () => {
        setSelectedEmployees([]);
        setMeetingDate('');
        setMeetingTime('');
        setMeetingName('');
        setMeetingLink('');
        setShowPopup(false);
    };

    const handleSubmit = () => {
      if (MeetingName !== '' && MeetingDate !== '' && MeetingTime !== '' && MeetingLink !== '') {
          const Emails = selectedEmployees.map(employee => employee.Email);
          axios.post('http://localhost:8081/Schedulemeet', { Emails, MeetingName, MeetingDate, MeetingTime, MeetingLink })
              .then(() => {
                  alert("Meeting is Scheduled");
                  handleClosePopup();
              })
              .catch(error => {
                  console.error('There was an error scheduling the meeting!', error);
              });
      } else {
          alert("Enter required fields");
      }
  };
  

    const handleFormSubmit = (e) => {
        e.preventDefault();
        handleSubmit();
    };

    const handleSearchChange = (event) => {
        const term = event.target.value;
        setSearchTerm(term);

        if (term === '') {
            setFilteredDetails(Details);
        } else {
            const filtered = Details.filter((employee) =>
                employee.Name.toLowerCase().includes(term.toLowerCase())
            );
            setFilteredDetails(filtered);
        }
    };

    return (
        <div className="Schedule">
            <div className="sc-container">
                <div className="search-bar">
                    <input 
                        type="text" 
                        placeholder="Search by employee name..." 
                        value={searchTerm} 
                        onChange={handleSearchChange} 
                    />
                </div>
                <h1>Schedule a Meeting</h1>
                <ul className="sc-employee-list">
                    {filteredDetails.map((employee) => (
                        <li key={employee.id}>
                            <button 
                                onClick={() => handleEmployeeClick(employee)}
                                className={selectedEmployees.some(e => e.Email === employee.Email) ? 'selected' : ''}
                            >
                                Name : {employee.Name} <br />
                                Email : {employee.Email}
                            </button>
                        </li>
                    ))}
                </ul>

                {selectedEmployees.length > 0 && (
                    <button className="sc-schedule-btn" onClick={() => setShowPopup(true)}>
                        Schedule Meeting for Selected Employees
                    </button>
                )}

                {showPopup && (
                    <div className="sc-popup">
                        <div className="sc-popup-content">
                            <h2>Schedule Meeting for {selectedEmployees.map(e => e.Name).join(', ')}</h2>
                            <form onSubmit={handleFormSubmit}>
                                <p onClick={handleClosePopup} id='close'><IoCloseOutline /></p>
                                <div className="sc-form-group">
                                    <label>Meeting Name</label>
                                    <input
                                        type="text"
                                        value={MeetingName}
                                        onChange={e => setMeetingName(e.target.value)}
                                    />
                                </div>
                                <div className="sc-form-group">
                                    <label>Date</label>
                                    <input
                                        type="date"
                                        value={MeetingDate}
                                        onChange={e => setMeetingDate(e.target.value)}
                                    />
                                </div>
                                <div className="sc-form-group">
                                    <label>Time</label>
                                    <input
                                        type="time"
                                        value={MeetingTime}
                                        onChange={e => setMeetingTime(e.target.value)}
                                    />
                                </div>
                                <div className="sc-form-group">
                                    <label>Meeting Link</label>
                                    <input
                                        type="text"
                                        value={MeetingLink}
                                        onChange={e => setMeetingLink(e.target.value)}
                                    />
                                </div>
                                <div className="sc-form-group">
                                    <label>Status</label>
                                    <input
                                        type="text"
                                        value="Upcoming"
                                        readOnly
                                    />
                                </div>
                                <button type="submit">
                                    Schedule
                                </button>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ScheduleMeeting;
