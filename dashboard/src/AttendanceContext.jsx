// AttendanceContext.js
import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

const AttendanceContext = createContext();

export const useAttendance = () => useContext(AttendanceContext);

export const AttendanceProvider = ({ children }) => {
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [punchInTime, setPunchInTime] = useState('');
  const [punchOutTime, setPunchOutTime] = useState('');
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isActive) {
      intervalRef.current = setInterval(() => {
        setSeconds(prevSeconds => prevSeconds + 1);
      }, 1000);
    } else if (!isActive && seconds !== 0) {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [isActive, seconds]);

  const startTimer = (time) => {
    setPunchInTime(time);
    setPunchOutTime('');
    setIsActive(true);
  };

  const stopTimer = (time) => {
    setPunchOutTime(time);
    setIsActive(false);
  };

  return (
    <AttendanceContext.Provider value={{ seconds, isActive, punchInTime, punchOutTime, startTimer, stopTimer }}>
      {children}
    </AttendanceContext.Provider>
  );
};
