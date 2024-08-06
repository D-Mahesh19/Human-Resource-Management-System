import axios from 'axios';
import React, { useEffect, useState } from 'react';



export default function AtendenceRecords() {
  const [Details, setDetails] = useState([]);
  const [filteredDetails, setFilteredDetails] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const Email  = localStorage.getItem('Email');

  const calculateTimeDifference = (startTime, endTime) => {
    const [startHour, startMinute] = startTime.split(':').map(Number);
    const [endHour, endMinute] = endTime.split(':').map(Number);

    const startDate = new Date(0, 0, 0, startHour, startMinute, 0);
    const endDate = new Date(0, 0, 0, endHour, endMinute, 0);

    let diff = endDate - startDate;
    const hours = Math.floor(diff / 1000 / 60 / 60);
    diff -= hours * 1000 * 60 * 60;
    const minutes = Math.floor(diff / 1000 / 60);

    return `${hours}h ${minutes}m`;
  };

  useEffect(() => {
    axios.post('http://localhost:8081/getemp', { Email })
      .then((response) => {
        setDetails(response.data.attendanceRecords);
        setFilteredDetails(response.data.attendanceRecords);
      });
  }, [Email]);

  useEffect(() => {
    if (selectedMonth || selectedYear) {
      const filtered = Details.filter(detail => {
        const [year, month, day] = detail.Date.split(':').map(Number);
        const yearMatch = selectedYear ? year === parseInt(selectedYear, 10) : true;
        const monthMatch = selectedMonth ? month === parseInt(selectedMonth, 10) : true;
        return yearMatch && monthMatch;
      });
      setFilteredDetails(filtered);
    } else {
      setFilteredDetails(Details);
    }
  }, [selectedMonth, selectedYear, Details]);

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
  };

  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
  };

  return (
    <div className="AtRe">
      <div className='AtendenceRecords'>
        <div className="attendencerecords">
          <h3>Attendance Records</h3>
          <div className="filter-container">
            <label htmlFor="year-select">Select Year: </label>
            <select id="year-select" onChange={handleYearChange}>
              <option value="">All</option>
              <option value="2021">2021</option>
              <option value="2022">2022</option>
              <option value="2023">2023</option>
              <option value="2024">2024</option>
              <option value="2025">2025</option>
              <option value="2026">2026</option>
              <option value="2027">2027</option>
            </select>
            <label htmlFor="month-select">Select Month: </label>
            <select id="month-select" onChange={handleMonthChange}>
              <option value="">All</option>
              <option value="1">January</option>
              <option value="2">February</option>
              <option value="3">March</option>
              <option value="4">April</option>
              <option value="5">May</option>
              <option value="6">June</option>
              <option value="7">July</option>
              <option value="8">August</option>
              <option value="9">September</option>
              <option value="10">October</option>
              <option value="11">November</option>
              <option value="12">December</option>
            </select>
          </div>
          <table>
            <thead>
              <tr>
                <td>Date</td>
                <td>Punch In</td>
                <td>Punch Out</td>
                <td>Production</td>
                <td>Break</td>
                <td>Overtime</td>
              </tr>
            </thead>
            <tbody>
              {filteredDetails.map((data, index) => {
                const punchIn = data.Records?.[0]?.PunchIn ?? 'N/A';
                const punchOut = data.Records?.[data.Records.length - 1]?.PunchOut ?? 'N/A';

                const productionTime = (punchIn !== 'N/A' && punchOut !== 'N/A')
                  ? calculateTimeDifference(punchIn, punchOut)
                  : 'N/A';
                // Replace below with actual calculation logic for break and overtime
                const breakTime = '1h 30m';
                const overtime = 'N/A';

                return (
                  <tr key={index}>
                    <td>{data.Date}</td>
                    <td>{punchIn}</td>
                    <td>{punchOut}</td>
                    <td>{productionTime}</td>
                    <td>{breakTime}</td>
                    <td>{overtime}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
