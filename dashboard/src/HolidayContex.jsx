import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';

// Create context for holidays
const HolidaysContext = createContext();

// Custom hook to use the holidays context
export const useHolidays = () => useContext(HolidaysContext);

const HolidaysProvider = ({ children }) => {
    const holidayList = [
        { date: 'January 1', name: 'New Year\'s Day' },
        { date: 'January 26', name:'Republic Day' },
        { date: 'March 25', name:'Holi' },
        { date: 'August 15', name: 'Independence Day' },
        { date: 'October 02', name:'Gandhi Jayanti' },
        { date: 'October 12', name:'Dussehra' },
        { date: 'November 01', name:'Diwali' },
        { date: 'December 25', name: 'Christmas Day' },
    ];

    // Function to parse the date strings into actual Date objects for comparison
    const parseDate = (dateStr) => {
        const [month, day] = dateStr.split(' ');
        return new Date(`${new Date().getFullYear()} ${month} ${day}`);
    };

    // Function to find the upcoming holiday
    const getUpcomingHoliday = () => {
        const today = new Date();
        const upcoming = holidayList.find(holiday => parseDate(holiday.date) >= today);
        console.log(upcoming);
        return upcoming || holidayList[0]; // Return the first holiday next year if no upcoming holiday found
    };

    const [upcomingHoliday, setUpcomingHoliday] = useState(getUpcomingHoliday);

    // Recalculate the upcoming holiday every 24 hours
    useEffect(() => {
        const interval = setInterval(() => {
            setUpcomingHoliday(getUpcomingHoliday());
        }, 24 * 60 * 60 * 1000); // 24 hours
        console.log(upcomingHoliday);
        return () => clearInterval(interval);
    }, []);

   

    return (
        <HolidaysContext.Provider value={{upcomingHoliday,holidayList}}>
            {children}
        </HolidaysContext.Provider>
    );
};
export default HolidaysProvider;