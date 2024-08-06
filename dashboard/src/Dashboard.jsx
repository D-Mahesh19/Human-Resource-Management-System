import React, { useEffect, useRef, useState } from 'react';
import { RiMenu2Fill } from "react-icons/ri";
import { CiSearch } from "react-icons/ci";

import { AiOutlineMessage } from "react-icons/ai";
import { FaRegUser } from "react-icons/fa6";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";

import { AiOutlineHome } from "react-icons/ai";
import { AiOutlineDashboard } from "react-icons/ai";
import { Doughnut } from 'react-chartjs-2';
import { Link } from 'react-router-dom'
import axios from 'axios';
import Barch from './Bar';
// import { FaRegDotCircle } from "react-icons/fa";
// import BaChart from './DayBar';
import { IoMdNotificationsOutline } from "react-icons/io";

import { useAttendance } from './AttendanceContext';


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


const Dashboard = () => {
  const Email  = localStorage.getItem('Email');
  const [PunchIn, setPunchIn] = useState('');
  const [PunchOut, setPunchOut] = useState('');
  const intervalRef = useRef(null);
  // const [In, setIn] = useState(' punchin1 visible');
  // const [Out, setOut] = useState(' punchout1 hidden');
  const [workedHoursToday, setWorkedHoursToday] = useState(0);
  const [ManPowerWeekly, setManPowerWeekly] = useState(0);
  const [workedHoursMonthly, setWorkedHoursMonthly] = useState(0);
  const [remainingHoursMonthly, setRemainingHoursMonthly] = useState(0);
  const [overtimeHours, setOvertimeHours] = useState(0);
  const [currentDayRecords, setCurrentDayRecords] = useState([]);
  const[Details,setDetails]=useState([]);
  const { seconds, punchInTime,  stopTimer } = useAttendance();
  const [userRole, setUserRole] = useState('')
  const[fulldetails,setfulldetails]=useState([]);
  const[presentDetail,setPresentDetail]=useState([])
  const totalSeconds = 12 * 60 * 60; 
  const date = new Date();
  let temp = 1;

  const daHours = 8; // Example daily working hours
  const reHours = 160;
  const [notifications, setNotifications] = useState([]);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [notificationsCount, setNotificationsCount] = useState(0);
  const [ManPowerMonthly, setManPowerMonthly] = useState(0);

// Run effect when upcomingHoliday changes

const fetchNotifications = async () => {
  try {
      const response = await axios.post('http://localhost:8081/getNotifications', { Email });
      const notifications = response.data.notifications;
      // Filter notifications where read is false
      const unreadNotifications = notifications.filter(notification => !notification.read);
      setNotifications(unreadNotifications); // Set only unread notifications
      setNotificationsCount(unreadNotifications.length); 
  } catch (error) {
      console.error('Error fetching notifications:', error);
  }
}; useEffect(() => {
  const fetchData = () => {
    axios.get('http://localhost:8081/getfull')
      .then((response) => {
        setfulldetails(response.data);
        
        const fulldata = response.data;

        // Define currentDate in the same format as record.Date
        const currentDate = new Date();
        const formattedCurrentDate = `${currentDate.getDate()}:${currentDate.getMonth() + 1}:${currentDate.getFullYear()}`;

        const filteredRecords = fulldata.map((data) => {
          return data.attendanceRecords.filter((record) => {
            const [year, month, day] = record.Date.split(':').map(Number);
            const recordDate = new Date(year, month - 1, day);

            if (isNaN(recordDate.getTime())) {
              console.error('Invalid date format:', record.Date);
              return false;
            }

            const formattedRecordDate = `${recordDate.getDate()}:${recordDate.getMonth() + 1}:${recordDate.getFullYear()}`;
            return formattedRecordDate === formattedCurrentDate;
          });
        });

        const nonEmptyFilteredRecords = filteredRecords.filter(data => data.length > 0);
        setPresentDetail(nonEmptyFilteredRecords);
        fetchManPower(fulldata);
        fetchmonthlyManPower (fulldata)
      });
  };

  fetchData();
  const interval = setInterval(fetchData, 200);

  return () => clearInterval(interval);
}, []);

useEffect(() => {
  fetchNotifications();
  const intervalId = setInterval(() => {
      fetchNotifications();
  }, 1000); // Fetch every second

  return () => clearInterval(intervalId); // Clean up interval on component unmount
},[]);

const handleNotificationClick = async (notificationId) => {
  try {
      await axios.post('http://localhost:8081/markNotificationAsRead', { Email, notificationId });
      fetchNotifications();
  } catch (error) {
      console.error('Error marking notification as read:', error);
  }
};

const toggleNotifications = () => {
  setIsNotificationOpen(!isNotificationOpen);
};

  // useEffect(() => {
  //   if (isActive) {
  //     intervalRef.current = setInterval(() => {
  //       setSeconds(prevSeconds => {
  //         if (prevSeconds >= totalSeconds) {
  //           clearInterval(intervalRef.current);
  //           return totalSeconds;
  //         }
  //         return prevSeconds + 1;
  //       });
  //     }, 1000);
  //   } else if (!isActive && seconds !== 0) {
  //     clearInterval(intervalRef.current);
  //   }
  //   return () => clearInterval(intervalRef.current);
  // }, [isActive, seconds]);

  // const handleStart = () => {
  //   const currentDate = `${date.getFullYear()}:${date.getMonth() + 1}:${date.getDate()}`;
  //   const Time = `${date.getHours()}:${date.getMinutes()}`;
  //   axios.post('http://localhost:8081/attendence', { Email, Date: currentDate, PunchIn: Time })
  //     .then((response) => {
  //       // console.log(response.data);
  //       if (temp === 1) {
  //         setPunchIn(Time); 
  //         axios.post('http://localhost:8081/Presentdays',{Email,formattedDate:currentDate})
  //         temp++;
  //       }
  //       setIsActive(true);
  //       setOut(' punchout1 visible');
  //       setIn(' punchin1 hidden');
  //     })
  //     .catch((error) => {
  //       console.error('Error while sending attendance data:', error);
  //     });
  // };

  const handleEnd = () => {
    const currentDate = `${date.getFullYear()}:${date.getMonth() + 1}:${date.getDate()}`;
    const Time = `${date.getHours()}:${date.getMinutes()}`;
    axios.post('http://localhost:8081/attendence', { Email, Date: currentDate, PunchOut: Time })
        .then((response) => {
          stopTimer(Time);
      })
      .catch((error) => {
        console.error('Error while sending attendance data:', error);
      });
  };

  // useEffect(() => {
  //   const workedHours = seconds / 3600;
  //   setWorkedHoursToday(workedHours);
  //   setWorkedHoursWeekly(workedHours * 5); // Example logic for weekly calculation
  //   setWorkedHoursMonthly(workedHours * 20); // Example logic for monthly calculation
  //   setRemainingHoursMonthly(160 - workedHoursMonthly); // Assuming total monthly hours is 160
  //   setOvertimeHours(workedHours > 8 ? workedHours - 8 : 0);
  // }, [seconds]); 

  const formatTime = (sec) => {
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  
  const data = {
    datasets: [
      {
        data: [seconds, totalSeconds - seconds],
        backgroundColor: ['#1F86F1', '#DEDFDF'],
        borderWidth: 0
      }
    ]
  };
  
  const options = {
    cutout: '80%',
    plugins: {
      tooltip: { enabled: false },
      legend: { display: false },
      datalabels: { display: false }
    }
  };

  useEffect(() => {
    axios.post('http://localhost:8081/getemp', { Email })
      .then((response) => {
        setUserRole(response.data.Designation);
        // console.log(response.data.Designation);
        // setDetails(response.data.attendanceRecords)
        const date = new Date();
        const currentDate = `${date.getDate()}:${date.getMonth() + 1}:${date.getFullYear()}`;
  
        const filteredRecords = response.data.attendanceRecords.filter(record => {
          const [ year,month,day] = record.Date.split(':').map(Number);
          
          const recordDate = new Date(year, month - 1, day);  

          if (isNaN(recordDate.getTime())) {
            console.error('Invalid date format:', record.Date);
            return false;
          }
  
          const formattedRecordDate = `${recordDate.getDate()}:${recordDate.getMonth() + 1}:${recordDate.getFullYear()}`;
          // console.log(formattedRecordDate);
          // console.log(currentDate);
          return formattedRecordDate === currentDate;
        });
        // console.log(filteredRecords);
        //  console.log(filteredRecords[0].Records);
  
         setCurrentDayRecords( filteredRecords[0].Records);
      })

      .catch((error) => { 
        console.error('There was an error fetching the attendance records!', error);
      });
  },[Email]);
  const parseTimeToHours = (timeString) => {
    const [hours, minutes, seconds] = timeString.split(':').map(Number);
    const totalHours = hours + minutes / 60 + seconds / 3600;
  
    return totalHours.toFixed(2);
    
  };

  const fetchmonthlyManPower = async (fulldata) => {
    const date = new Date();
    const monthNumber = date.getMonth()+1;
    const year = date.getFullYear();

    let newRecordsArray = [];

    for (const data of fulldata) {
        const params = {
            Email: data.Email,
            monthNumber,
            year
        };

        try {
            const response = await axios.get('http://localhost:8081/monthNumber', { params });

            if (response.data && response.data.length > 0) {
                newRecordsArray = [...newRecordsArray, ...response.data];
            }
        } catch (error) {
            console.error(`Error fetching data for ${data.Email}:`, error);
        }
    }

    // Update the total records count once after the loop completes
    setManPowerMonthly(newRecordsArray.length);
    const remainingHours = (fulldata.length * 20) - newRecordsArray.length;  
    setRemainingHoursMonthly(remainingHours)

    // Log the combined records
    console.log("Current recordsArray:", newRecordsArray);
};

const fetchManPower = async (fulldata) => {
  const date = new Date();
  const weekNumber = getWeekNumber(date);
  const year = date.getFullYear();

  let newRecordsArray = [];

  for (const data of fulldata) {
      const params = {
          Email: data.Email,
          weekNumber,
          year
      };

      try {
          const response = await axios.get('http://localhost:8081/weekNumber', { params });

          if (response.data && response.data.length > 0) {
              newRecordsArray = [...newRecordsArray, ...response.data];
          }
      } catch (error) {
          console.error(`Error fetching data for ${data.Email}:`, error);
      }
  }

  // Update the total records count once after the loop completes
  setManPowerWeekly(newRecordsArray.length);
  
  // Log the combined records
  //console.log("Current recordsArray:", newRecordsArray);
};


  
 const getWeekNumber = (date) => {
  const startDate = new Date(date.getFullYear(), 0, 1); // January 1st of the given year
  const days = Math.floor((date - startDate) / (24 * 60 * 60 * 1000)); // Difference in days
  const weekNumber = Math.ceil((date.getDay() + 1 + days) / 7); // Calculate the week number
  return weekNumber;
};



  return (
    <div className='Dashboard'>
      <div className="dashnavbar">
        <div className="dashleft">
          <RiMenu2Fill />
        </div>
        <div className="dashright">
          <input type="text" placeholder='Search here...' /><CiSearch id='search' />
          <div className="notification-icon1" onClick={toggleNotifications}>
                        <IoMdNotificationsOutline />
                        {notificationsCount > 0 && <span className="notification-count1">{notificationsCount}</span>}
                    </div>
          <AiOutlineMessage />
          <FaRegUser />Admin
          <MdOutlineKeyboardArrowDown />
        </div>
        {isNotificationOpen && (
                <div className="notification-dropdown">
                    <h4>Notifications</h4>
                    {notifications.length === 0 ? (
                        <p>No notifications</p>
                    ) : (
                        notifications.map(notification => (
                            <div key={notification._id} onClick={() => handleNotificationClick(notification._id)}>
                                <p>{notification.message}</p>
                                <span>{new Date(notification.date).toLocaleString()}</span>
                            </div>
                        ))
                    )}
                </div>
            )}
        <div className="sidebar">
        {(userRole === 'HR' || userRole === 'Admin') && (
              <>
          <div className="main">
            <p>Main</p>
            <h3 className='h3white'><AiOutlineDashboard />Dashboard</h3>
          </div>
          <div className="employe">
            <p>Employee</p>
            <Link to={'/employees'} style={{textDecoration:'none',color:'white'}}>
            <h4  ><AiOutlineHome /> Employees</h4>
            </Link>
            <Link to={'/View'} style={{textDecoration:'none',color:'white'}}>
            <h4><AiOutlineHome /> Tickets</h4>
            </Link>
            <Link to={'/Schedule'} style={{textDecoration:'none',color:'white'}}>
            <h4><AiOutlineHome /> Schedule a Meeting</h4>
            </Link>
            <Link to={'/Aprove'} style={{textDecoration:'none',color:'white'}}>
            <h4><AiOutlineHome /> Leave's Aprove</h4>
            </Link>
          </div>
        
         </>
        )}
        </div>
      </div>
      <div className='dashpage'>
      <div className='dash-Name'>
        <h3>Attendance</h3>
        <h4>Dashboard/<span>Attendance</span></h4>
      </div>
      
      <div className="firstdiv"> 
        <div className='Timesheet'>
          <h3>Timesheet</h3>
          <div className="punchIn">
            <p><b>Punch in at</b></p>
            <p id='pp'>{punchInTime}</p>
          </div>
          <div className="containertwo">
            <Doughnut data={data} options={options} id='doucharttwo' />
            <div className="timertwo">
              {formatTime(seconds)}
            </div>
            <button className='punchout1  ' onClick={handleEnd}>
              Punch Out
            </button>
          </div>
          <div className='foot'>
            <p>BREAK <br />1.30hrs</p>
            <p>Overtime <br />{overtimeHours} hrs</p>
          </div>
        </div>
        <div className="statistics">
          <h3>Statistics</h3>
          <div className="barChartContainer">
          <div className='dayhrs'>
            <span><p className='none'>Today ManPower</p> <p>{presentDetail.length}/{fulldetails.length}</p></span> 
             <Barch completed={presentDetail.length} total={fulldetails.length} color={'#8FE2C3'}/>
          </div>
          <div className='weekhrs'>
            
            <span><p className='none'>This week</p> <p>{ManPowerWeekly}/{fulldetails.length*5} </p></span> 
            <Barch completed={ManPowerWeekly} total={fulldetails.length*5} color={'#FF6643'}/>
          </div>
          <div className='monthhrs'>
           <span><p className='none'>This Month</p> <p>{ManPowerMonthly}/{fulldetails.length*20}</p></span> 
            <Barch completed={ManPowerMonthly} total={fulldetails.length*20} color={'#FFBA6B'}/>
          </div>
          <div className='remainighrs'>
            <span><p className='none'>Remaining</p> <p>{remainingHoursMonthly}/{fulldetails.length*20}</p></span>
            <Barch completed={remainingHoursMonthly} total={fulldetails.length*20} color={'#1C84F1'}/>
          </div>
          {/* <div className='overhrs'>
            
            <span><p className='none'>Overtime</p> <p>{overtimeHours} hrs</p></span>
            <Barch completed={overtimeHours} total={20} color={'#F0EA1F'}/>
          </div> */}
        </div>
        </div>
        <div className="todaya">
        <h3>Today Activity</h3>
        <div className='daypanch'>
        {presentDetail.map((record, recordIndex) => (
        record.map((data, dataIndex) => {
          const punchIn = data.Records?.[0]?.PunchIn ?? 'N/A';
          const punchOut = data.Records?.[data.Records.length - 1]?.PunchOut ?? 'N/A';
          return (
            <div key={`${recordIndex}-${dataIndex}`}>
              <p>Emp_ID : <span>{data.Emp_ID}</span></p>
              <p>Punch in at : <span>{punchIn}</span></p>
              <p>Punch out at : <span>{punchOut}</span></p>
              <p>----------------------------</p><br />
            </div>
          );
        })
      ))}
        </div>
        </div>
      </div>
      <div className="seconddiv">
        <div className="attendence">
        <h3>Attendance List</h3>
        <div className="attendence-table">
        <table>
          <thead>
            <tr>
              <td>Emp.ID</td>
              <td>Date</td>
              <td>Punch In</td>
              <td>Punch Out</td>
              <td>Production</td>
              <td>Break</td>
              <td>Overtime</td>
            </tr>
          </thead>
          <tbody>
              {presentDetail.map((data, index) => {
                return data.map((record, subIndex) => {
                  const punchIn = record.Records?.[0]?.PunchIn ?? 'N/A';
                  const punchOut = record.Records?.[record.Records.length - 1]?.PunchOut ?? 'N/A';

                  const productionTime = punchIn !== 'N/A' && punchOut !== 'N/A'
                    ? calculateTimeDifference(punchIn, punchOut)
                    : 'N/A';

                  // Replace below with actual calculation logic for break and overtime
                  const breakTime = '1h 30m';
                  const overtime = 'N/A';

                  return (
                    <tr key={`${index}-${subIndex}`}>
                      <td>{record.Emp_ID}</td>
                      <td>{record.Date}</td>
                      <td>{punchIn}</td>
                      <td>{punchOut}</td>
                      <td>{productionTime}</td>
                      <td>{breakTime}</td>
                      <td>{overtime}</td>
                    </tr>
                  );
                });
              })}
            </tbody>
        </table>  
        </div>
        </div>
        {/* <div className="records">
        <h3>Daily Records</h3>
        <div className='days'>
        <BaChart Email={Email} month={new Date().getMonth()+1} year={new Date().getFullYear()} className='daybar'/>
        </div>
        </div> */}
      </div> 
    </div>
    
    </div>
  );
};

export default Dashboard;
