import React, { useEffect, useState } from 'react';
import axios from 'axios';


const YourComponent = () => {
  const Email  = localStorage.getItem('Email');
  const [plans, setPlans] = useState([]);
  const [absentDays, setAbsentDays] = useState([]);
  const [nationalHolidays, setNationalHolidays] = useState([]);

  const holidayList = [
    { date: '01/01/2024', name: 'New Year\'s Day' },
    { date: '26/01/2024', name: 'Republic Day' },
    { date: '25/03/2024', name: 'Holi' },
    { date: '15/08/2024', name: 'Independence Day' },
    { date: '02/10/2024', name: 'Gandhi Jayanti' },
    { date: '12/10/2024', name: 'Dussehra' },
    { date: '01/11/2024', name: 'Diwali' },
    { date: '25/12/2024', name: 'Christmas Day' },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const plansResponse = await axios.get(`http://localhost:8081/plans/${Email}`);
        const plansData = plansResponse.data;
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();

        // Filter plans for the current month
        const filteredPlans = plansData.filter(plan => {
          const planDate = new Date(plan.StartDate); // Assuming the date field is StartDate
          return planDate.getMonth() === currentMonth && planDate.getFullYear() === currentYear;
        });
        setPlans(filteredPlans);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    if (Email) {
      fetchData();
    }

    const filterHolidaysByCurrentMonth = (holidays) => {
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
    //   console.log(currentMonth);
    //   console.log(currentYear);
      return holidays.filter(holiday => {
        const [day, month, year] = holiday.date.split('/');
        const holidayDate = new Date(`${year}-${month}-${day}`);
        // console.log(holidayDate.getMonth());
        return holidayDate.getMonth() === currentMonth && holidayDate.getFullYear() === currentYear;
      });
    };

    const filteredHolidays = filterHolidaysByCurrentMonth(holidayList);
    console.log(filteredHolidays);
    setNationalHolidays(filteredHolidays);

  }, [Email]);

  return (
    <div className="main-container1">
      <div className="section1">
        <h2 className="section-title1">Plans</h2>
        <div className="plans-container1">
          {plans.map(plan => (
            <div key={plan.PlanName} className="plan-card">
              <h3 className="plan-title">{plan.PlanName}</h3>
              <p className="plan-description">{plan.Description}</p>
              <p className="plan-date">{new Date(plan.StartDate).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      </div>
      
      <div className="section1">
        <h2 className="section-title1">Absent Days</h2>
        <div className="plans-container1">
          {absentDays.map(absentDay => (
            <div key={absentDay.Date} className="plan-card">
              <h3 className="plan-title">Absent on {new Date(absentDay.Date).toLocaleDateString()}</h3>
              <p className="plan-description">{absentDay.Reason}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="section1">
        <h2 className="section-title1">National Holidays</h2>
        <div className="plans-container1">
          {nationalHolidays.map(holiday => (
            <div key={holiday.date} className="plan-card">
              <h3 className="plan-title">{holiday.name}</h3>
              <p className="plan-date">{new Date(holiday.date.split('/').reverse().join('-')).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default YourComponent;
