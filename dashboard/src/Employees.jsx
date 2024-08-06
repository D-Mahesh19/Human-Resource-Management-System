import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Employees() {
  const [details, setDetails] = useState([]);
  const [filteredDetails, setFilteredDetails] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:8081/getfull')
      .then((response) => {
        setDetails(response.data);
        setFilteredDetails(response.data); // Initialize filtered details with all employees
      })
      .catch((error) => {
        console.error('There was an error fetching the data!', error);
      });
  }, []);

  const handleEmployeeClick = (employee) => {
    setSelectedEmployee(employee);
  };

  const closeModal = () => {
    setSelectedEmployee(null);
  };

  const handleSearchChange = (event) => {
    const term = event.target.value;
    setSearchTerm(term);

    if (term === '') {
      setFilteredDetails(details);
    } else {
      const filtered = details.filter((employee) =>
        employee.Name.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredDetails(filtered);
    }
  };

  return (
    <div className="employees-main">
    <div className="employees-container">
      <div className="search-bar">
        <input 
          type="text" 
          placeholder="Search by employee name..." 
          value={searchTerm} 
          onChange={handleSearchChange} 
        />
      </div>
      <div className="employees-list">
        {filteredDetails.map((employee, index) => (
          <div 
            key={index} 
            className="employee-item"
            onClick={() => handleEmployeeClick(employee)}
          >
            <p><strong>Name:</strong> {employee.Name}</p>
            <p><strong>Email:</strong> {employee.Email}</p>
          </div>
        ))}
      </div>

      {selectedEmployee && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-button" onClick={closeModal}>X</button>
            <h2>{selectedEmployee.Name}</h2>
            <p><strong>Email:</strong> {selectedEmployee.Email}</p>
            <p><strong>Contact Number:</strong> {selectedEmployee.ContactNumber}</p>
            <p><strong>Date of Birth:</strong> {selectedEmployee.Birth}</p>
            <p><strong>Designation:</strong> {selectedEmployee.Designation}</p>
            <p><strong>Joining Date:</strong> {selectedEmployee.JoiningDate}</p>
            <p><strong>Employee ID:</strong> {selectedEmployee.EmployeeID}</p>
            <p><strong>Department:</strong> {selectedEmployee.Department}</p>
            <p><strong>Manager/TL:</strong> {selectedEmployee.Manager_TL}</p>
            <p><strong>Plant Location:</strong> {selectedEmployee.Location}</p>
            <div className="modal-buttons">
              <button onClick={() => navigate(`/Records/${selectedEmployee.Email}`)}>Attendance Record</button>
            </div>
          </div>
        </div>
      )}
    </div>
    </div>
  );
}
