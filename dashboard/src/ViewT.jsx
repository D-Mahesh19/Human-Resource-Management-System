import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ViewTickets = () => {
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8081/tickets')
      .then((response) => {
        const allUsers = response.data;
        // Flatten the tickets from all users
        const allTickets = allUsers.flatMap(user => user.tickets);
        setTickets(allTickets);
        console.log(allTickets);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleSolve = (ticketId, Email, issueType) => {
    axios.post('http://localhost:8081/tickets/solve', { Email, ticketId })
      .then((response) => {
        console.log(response.data); 
        // Update state to remove the solved ticket
        setTickets(tickets.filter(ticket => ticket._id !== ticketId));
        // Format mailto link correctly
        const mailtoLink = `mailto:${Email}?subject=Re: ${issueType}&body=Please%20solve%20the%20ticket%20with%20ID%20${ticketId}.`;
        window.location.href = mailtoLink;
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className='ticketView'>
      <h1>View Tickets</h1>
      <div className="ticketcontainer">
        <ul>
          {tickets.filter(ticket => ticket.Status === 'Pending').map((ticket) => (
            <li key={ticket._id}>
              <p><strong>Title:</strong> {ticket.Issuetype}</p>
              <p><strong>Description:</strong> {ticket.Description}</p>
              <button onClick={() => handleSolve(ticket._id, ticket.Email, ticket.Issuetype)}>Solve</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ViewTickets;
