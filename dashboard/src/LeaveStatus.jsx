// src/LeaveStatus.js
import axios from 'axios';
import React, { useEffect, useState } from 'react';

const LeaveStatus = () => {
    const Email  = localStorage.getItem('Email');
    const [Leaves, setLeaves] = useState([]);
    useEffect(() => {
        axios.post('http://localhost:8081/getemp',{Email})
          .then((response) => {
            setLeaves(response.data.leaveRecords);
            console.log(response.data.leaveRecords);
          })
          .catch((err) => {
            console.log(err);
          });
      },[Email]);
    return (
        <div className="leave-container">
            <h2>Leave Applications</h2>
            <table className="leave-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>From Date</th>
                        <th>To Date</th>
                        <th>Reason</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {Leaves.map((Leave) => (
                        <tr>
                            <td>{Leave._id}</td>
                            <td>{Leave.FromDate}</td>
                            <td>{Leave.ToDate}</td>
                            <td>{Leave.Reason}</td>
                            <td className={`status ${Leave.Status.toLowerCase()}`}>{Leave.Status}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default LeaveStatus;
