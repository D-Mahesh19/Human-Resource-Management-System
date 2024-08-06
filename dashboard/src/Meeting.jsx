import axios from 'axios';
import React, { useEffect, useState } from 'react';


const MeetingPage = () => {
 
  const [meetings, setMeetings] = useState([])
  const Email  = localStorage.getItem('Email');

  useEffect(()=>{
    axios.post('http://localhost:8081/getemp',{Email})
    .then((response)=>{
      setMeetings(response.data.meetings)
    })
  },[Email])

  const markMeetingDone = (meetid) => {
    axios.post('http://localhost:8081/donemeet', { meetid })
      .then((response) => {
        // Update the local state directly
        setMeetings((prevMeetings) => 
          prevMeetings.map((meeting) =>
            meeting._id === meetid ? { ...meeting, MeetingStatus: 'Done' } : meeting
          )
        );
        renderMeetings('Upcoming')
        renderMeetings('Done')
      })
      .catch((error) => {
        console.error('Error marking meeting as done:', error);
      });
  };
  

  // Function to render meetings based on status
  const renderMeetings = (status) => {
    return meetings
      .filter((meeting) => meeting.MeetingStatus === status)
      .map((meeting) => (
        <div key={meeting._id} className="meeting-item">
          <h3>{meeting.MeetingName}</h3>
          <p>Date: {new Date(meeting.MeetingDate).toLocaleDateString()}</p>
          <p>Time: {meeting.MeetingTime}</p>
          Link : <span className='lin' onClick={() => handlemeet(meeting.MeetingLink)}>{meeting.MeetingLink}</span> <p></p><br />
          {status === 'Upcoming' && (
            <button onClick={() => markMeetingDone(meeting._id)}>Mark Done</button>
          )}
        </div>
      ))
};

const handlemeet = (link) => {
    if (link) {
        window.open(link, '_blank'); // Opens the link in a new tab
    } else {
        alert('No link available');
    }
};

  return (
    <div className="meeting-page">
      <div className="meetimg-main">
      <div className="upcoming-meetings">
        <h2>Upcoming Meetings</h2>
        {renderMeetings('Upcoming')}
        
      </div>
      <div className="done-meetings">
        <h2>Done Meetings</h2>
        {renderMeetings('Done')}
      </div>
      </div>
    </div>
  );
};

export default MeetingPage;
