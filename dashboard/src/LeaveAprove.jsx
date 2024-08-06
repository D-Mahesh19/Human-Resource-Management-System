import React, { useEffect, useState } from 'react';
import axios from 'axios';

const LeaveApproval = () => {
  const [leaves, setLeaves] = useState([]);
  const [Type, setType] = useState('');

  
  
  // Function to fetch leave data
  const fetchLeaves = () => {
    axios.get('http://localhost:8081/getfull')
      .then((response) => {
        setLeaves(response.data);
      })
      .catch(error => console.error('Error fetching leave data:', error));
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  const handleApprove = (Email,leaveId) => {
    if (Type === '') {
      alert("Select a Type");
      return;
    }

    axios.post('http://localhost:8081/Aprove', { Email,leaveId, Status: 'Approved', Type })
      .then((response) => {
        const leavecount=response.data.Leaves_Taken;console.log(leavecount);
        axios.post('http://localhost:8081/count',{Email,Leaves_Taken:leavecount+1})
        {}
        setType('');
        fetchLeaves(); // Re-fetch data after approval
        console.log("fetched");
      })
      .catch(error => console.error('Error approving leave:', error));
  };

  const handleReject = (Email,leaveId) => {
    axios.post('http://localhost:8081/Aprove', {Email, leaveId, Status: 'Rejected', Type })
      .then(() => {
        setType('');
        fetchLeaves(); // Re-fetch data after rejection
      })
      .catch(error => console.error('Error rejecting leave:', error));
  };

  return (
    <div className="approve-container">
      <div className="leave-approval-container">
        <table className="leave-approval-table">
          <thead>
            <tr>
              <th>Employee ID</th>
              <th>Employee Name</th>
              <th>From Date</th>
              <th>To Date</th>
              <th>Leave Reason</th>
              <th>Leave Type</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {leaves.map((employee) =>
              employee.leaveRecords
                .filter((leave) => leave.Status === 'Pending')
                .map((leave, index) => (
                  <tr key={index}>
                    <td>{employee.Email}</td>
                    <td>{employee.Name}</td>
                    <td>{leave.FromDate}</td>
                    <td>{leave.ToDate}</td>
                    <td>{leave.Reason}</td>
                    <td>
                      <select
                        value={Type}
                        className="leave-type-select"
                        onChange={(e) => setType(e.target.value)}
                      >
                        <option value="" disabled>Select Leave Type</option>
                        <option value="Paid Leave">Paid Leave</option>
                        <option value="Unpaid Leave">Unpaid Leave</option>
                      </select>
                    </td>
                    <td>
                      <button
                        className="btn1 approve-button"
                        onClick={() => handleApprove(employee.Email,leave._id)}
                      >
                        Approve
                      </button>
                      <button
                        className="btn1 reject-button"
                        onClick={() => handleReject(employee.Email,leave._id)}
                      >
                        Reject
                      </button>
                    </td>
                  </tr>
                ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeaveApproval;
