import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './Calender.css';
// import axios from 'axios';

const NHolidays = [
  '2024-01-01',
 '2024-01-26',
 '2024-03-25',
 '2024-06-17',
 '2024-08-15',
 '2024-10-02',
 '2024-10-12',
 '2024-11-01',
 '2024-12-25',
];

export default function Calender({ Email }) {
  const [value, setValue] = useState(new Date());
  const [leaveData, setLeaveData] = useState({
    PresentDays: [],
    AbsentDays: [],
    LeavesDays: [],
    Holidays: [],
    StartDates:[]
  });

  useEffect(() => {
    const fetchLeaveData = async () => {
      try {
        const response = await fetch(`http://localhost:8081/calendar/${Email}`);
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        
        const data = await response.json();
        // console.log(data);
        // console.log(data.user.calendarData);
        // console.log(data.user.plans);
        // const Plan =[data.user.plans];
        // const StartDates=Plan.map(plan=>plan.StartDate);
        if (data.user) {
          const { PresentDays=[]} = data.user.calendarData[0][0] || {};
          const { AbsentDays =[]} = data.user.calendarData[0][1] || {};
          const { LeavesDays =[]} = data.user.calendarData[0][2] || {};
          const StartDates = data.user.plans.map(plan => plan.StartDate);
          
          setLeaveData({
            // PresentDays: PresentDays.map(day => parseDateString(day)),  
            AbsentDays: AbsentDays.map(day => parseDateString(day)),
            LeavesDays: LeavesDays.map(day => parseDateString(day)),
            Holidays: NHolidays.map(day => new Date(day)),
            StartDates: StartDates.map(dateStr => new Date(dateStr)),
          });
         
        }
      } catch (err) {
        console.error('Error fetching leave data:', err);
      }
    };

    if (Email) {
      fetchLeaveData();
    }
    
  }, [Email]);
  

  const parseDateString = (dateString) => {
    const [year, month, day] = dateString.split(':').map(Number);
    return new Date(year, month - 1, day); // month - 1 because months are zero-based in Date object
  };

  // function formatDateString(dateString) {
  //   const date = new Date(dateString);
  
  //   const options = { year: 'numeric', month: 'long', day: 'numeric' };
  //   return date.toLocaleDateString(undefined, options);
  // }

  const isSameDay = (date1, date2) => {
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    );
  };

  const tileClassName = ({ date, view }) => {
    if (view === 'month') {
      if (leaveData.AbsentDays.some(day => isSameDay(day, date))) {
        return 'absent';
      }
      // if (leaveData.PresentDays.some(day => isSameDay(day, date))) {
      //   return 'present';
      // }
      if (leaveData.LeavesDays.some(day => isSameDay(day, date))) {
        return 'leavesTaken';
      }
      if (leaveData.Holidays.some(day => isSameDay(day, date))) {
        // console.log(`Holiday matched: ${date}`);
        return 'holiday';
      }
      if (leaveData.StartDates.some(day => isSameDay(day, date))) {
        // console.log(`Plan matched: ${date}`);
        return 'plansdata';
      }
    }
    return null;
  };

  return (
    <div>
      <Calendar
        onChange={setValue}
        value={value}
        tileClassName={tileClassName}
      />
    </div>
  );
}
