import logo from './Assets/Logo1.png'
import { BsArrowUpRightCircle } from "react-icons/bs";
import { FaRegClipboard } from "react-icons/fa6";
import { BiHomeCircle } from "react-icons/bi";
import { IoSunnyOutline } from "react-icons/io5";
import { IoMdNotificationsOutline } from "react-icons/io";
import { FaUserCircle } from "react-icons/fa";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { GoArrowDownLeft } from "react-icons/go";
import { GoArrowUpRight } from "react-icons/go";
import lay from './Assets/lay.png'
import colour from './Assets/colour.png'
import { CiCalendar } from "react-icons/ci";
import Calendar from './Calender';
import {  useNavigate, Link } from 'react-router-dom'
import axios from 'axios';
import React, { useState, useEffect,} from 'react';
import { Doughnut } from 'react-chartjs-2';
import 'chart.js/auto';
import { TbDashboard } from "react-icons/tb";
import { useAttendance } from './AttendanceContext';
import { useHolidays } from './HolidayContex';
import { IoIosMenu } from "react-icons/io";
import { IoCloseSharp } from "react-icons/io5";


export default function Layout() {
    const Email  = localStorage.getItem('Email');
    const [Details, setDetails] = useState('');
    const { seconds, isActive, punchInTime, punchOutTime, startTimer, stopTimer } = useAttendance();
    const [In, setIn] = useState('button punchin visible');
    const [Out, setOut] = useState('button punchout hidden');
    const [days, setDays] = useState(0);
    const [dashVisible, setDashVisible] = useState(false);
    const [plans, setPlans] = useState([]);
    const navigate = useNavigate();
    const date = new Date();
    const totalDays = 30;
    const totalSeconds = 12 * 60 * 60;
    let temp = 1;
    const {upcomingHoliday} = useHolidays();
    const [notifications, setNotifications] = useState([]);
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);
    const [notificationsCount, setNotificationsCount] = useState(0);
    const[side,setside]=useState('sideclickitem hidden');
    const[MonthLeave,setMonthLeave]=useState('');
    const [PunchIn, setPunchIn] = useState('');

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
};

useEffect(() => {
    fetchNotifications();
    const intervalId = setInterval(() => {
        fetchNotifications();
    }, 1000); // Fetch every second

    return () => clearInterval(intervalId); // Clean up interval on component unmount
}, [Email]);

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
const getWeekNumber = (date) => {
    const startDate = new Date(date.getFullYear(), 0, 1); // January 1st of the given year
    const days = Math.floor((date - startDate) / (24 * 60 * 60 * 1000)); // Difference in days
    const weekNumber = Math.ceil((date.getDay() + 1 + days) / 7); // Calculate the week number
    return weekNumber;
  };


    const handleStart = () => {
        const currentDate = `${date.getFullYear()}:${date.getMonth() + 1}:${date.getDate()}`;
        const weekNumber = getWeekNumber(date);
        const monthNumber = date.getMonth() + 1;
        const year = date.getFullYear();
        const Time = `${date.getHours()}:${date.getMinutes()}`;
        axios.post('http://localhost:8081/attendence', { Email, Date: currentDate, PunchIn: Time ,  weekNumber, monthNumber,year})
            .then((response) => {
                console.log(response.data);
                if (temp == 1) {
                    if(PunchIn)
                   { startTimer(PunchIn);}
                    else{
                        startTimer(Time)
                    }
                    axios.post('http://localhost:8081/Presentdays', { Email, formattedDate: currentDate });
                    temp++;
                }

                setOut('button punchout visible');
                setIn('button punchin hidden');
            })
            .catch((error) => {
                console.error('Error while sending attendance data:', error);
            });
    };

    const handleEnd = () => {
        const currentDate = `${date.getFullYear()}:${date.getMonth() + 1}:${date.getDate()}`;
        const Time = `${date.getHours()}:${date.getMinutes()}`;
        axios.post('http://localhost:8081/attendence', { Email, Date: currentDate, PunchOut: Time })
            .then((response) => {
                console.log(response.data);
                stopTimer(Time);
                setOut('button punchout hidden');
                setIn('button punchin visible');
            })
            .catch((error) => {
                console.error('Error while sending attendance data:', error);
            });
    };

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
                backgroundColor: ['#FF7C00', '#000000'],
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
                const MonthL = response.data.leaveRecords;

                // Get the current month and year
                const currentDate = new Date();
                const currentMonth = currentDate.getMonth(); // 0-indexed (0 for January, 11 for December)
                const currentYear = currentDate.getFullYear();

                // Filter leave records by current month and year
                const currentMonthLeaves = MonthL.filter((leave) => {
                    const leaveDate = new Date(leave.FromDate); // Adjust according to your date format
                    return leaveDate.getMonth() === currentMonth && leaveDate.getFullYear() === currentYear && leave.Status==='Approved';
                });

                // console.log(currentMonthLeaves);
                setDetails(response.data);
                // setDays(response.data.Leaves_Taken);
                setPlans(response.data.plans);
                setMonthLeave(currentMonthLeaves);
                
                const Cdate = `${currentDate.getDate()}:${currentDate.getMonth() + 1}:${currentDate.getFullYear()}`;
          
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
                  return formattedRecordDate === Cdate;
                });
                // console.log(filteredRecords);
                //  console.log(filteredRecords[0].Records);
          
                
                if (filteredRecords.length > 0) {
                    setPunchIn(filteredRecords[0].Records[0].PunchIn);
                } else {
                    
                }

            });
    }, [Email]);

    const data1 = {
        datasets: [
            {
                data: [MonthLeave.length, totalDays - MonthLeave.length],
                backgroundColor: ['#FF7C00', '#000000'],
                borderWidth: 0
            }
        ]
    };

    const options1 = {
        cutout: '80%',
        plugins: {
            tooltip: { enabled: false },
            legend: { display: false },
            datalabels: { display: false }
        }
    };

    const leaveApply = (e) => {
        e.preventDefault();
        navigate(`/Leave`);
    };

    const handlego=()=>{
        if(Details.Designation==='HR' ||Details.Designation==='Admin')
        {
            navigate(`/dashboard`)
        }
        else{
            alert("You are not a HR / Admin")
        }
    }
    return (
        <div className='Layout'>
            <div className="navbar">
                <div className="navleft">
                    <img src={logo} alt="" />
                    <Link to={`/Layout`} style={{ textDecoration: 'none', color: 'black' }}><p id='p1'><BiHomeCircle id='i1' /> Home</p></Link>
                    <p className='dash-icon' onClick={handlego}><TbDashboard />Dashboard</p>
                    <Link to={`/Plans`} style={{ textDecoration: 'none', color: 'black' }}><p id='Leave'><BsArrowUpRightCircle /> Create a Plan </p></Link>
                    <Link to={`/Tickets`} style={{ textDecoration: 'none', color: 'black' }}><p id='Plans'><i className="fa-solid fa-ticket"></i> Raise a Ticket</p></Link>
                </div>
                <div className="navright">
                    <p><IoSunnyOutline /></p>
                    <p>{`${date.getDate()}:${date.getMonth() + 1}:${date.getFullYear()}`}<span> {`${date.getHours()}:${date.getMinutes()}`}</span></p>
                    <div className="notification-icon" onClick={toggleNotifications}>
                        <IoMdNotificationsOutline />
                        {notificationsCount > 0 && <span className="notification-count">{notificationsCount}</span>}
                    </div>
                    <p id='name'>{Details.Name}</p>
                    <p><FaUserCircle /></p>
                    <p><MdOutlineKeyboardArrowDown /></p>
                </div>
            </div>
            <div className="sideclick">
           <p className='sideclick-icon' onClick={e=>{setside('sideclickitem visible')}}><IoIosMenu /></p> 
           <div className={side}>
                    <p className='close' onClick={e=>{setside('sideclickitem hidden')}}><IoCloseSharp /></p>
                    <p className='dash-icon' onClick={handlego}><TbDashboard />Dashboard</p>
                    <Link to={`/Plans`} style={{ textDecoration: 'none', color: 'black' }}><p id='Leave'><BsArrowUpRightCircle /> Create a Plan </p></Link>
                    <Link to={`/Tickets`} style={{ textDecoration: 'none', color: 'black' }}><p id='Plans'><i className="fa-solid fa-ticket"></i> Raise a Ticket</p></Link>
           </div>
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
            <div className="Layout-content">
                <div className='iteam iteam-1'>
                    <Link to={`/Records`} style={{ textDecoration: 'none', color: 'black' }}>
                        <GoArrowUpRight id='ri' />
                        <GoArrowDownLeft id='di' />
                    </Link>
                    <h1>Attendance</h1>
                    <div className="container">
                        <Doughnut data={data} options={options} id='douchart' />
                        <div className="timer">
                            {formatTime(seconds)}
                        </div>
                        <button onClick={handleStart} className={In}>
                            Punch In
                        </button>
                        <button className={Out} onClick={handleEnd}>
                            Punch Out
                        </button>
                    </div>
                    <div className="p-cred">
                        <div><p>punch in</p>
                            <h3>{punchInTime} </h3>
                        </div>
                        <div>
                            <p>punch out</p>
                            <h3>{punchOutTime}</h3>
                        </div>
                    </div>
                </div>
                <div className='iteam iteam-2'>
                    <img src={lay} alt="" />
                    <div>
                        <p>Hii,{Details.Name}</p>
                        <h3>Good Morning</h3>
                        <p id='greet'>Have a good day</p>
                    </div>
                </div>
                <div className='ct1'>
                    <h3>Quick status</h3>
                    <Link to={'/Project'} style={{ color: 'black' }}>
                        <div className='item31'>
                            <img src={colour} alt="" />
                            <h4><FaRegClipboard />Project</h4>
                            <p>The company made projects should be displayed here</p>
                        </div>
                    </Link>
                    <Link to={`/Status`} style={{ color: 'black' }}>
                        <div className='item32'>
                            <img src={colour} alt="" />
                            <h4><BsArrowUpRightCircle /> Leave</h4>
                            <p>You applied Leaves should be displayed here</p>
                        </div>
                    </Link>
                    <Link to={'/Holidays'} style={{ color: 'black' }}>
                        <div className='item33'>
                            <img src={colour} alt="" />
                            <h4><BsArrowUpRightCircle /> Holiday</h4>
                            {upcomingHoliday ? (
                                <div>
                                    <p>{upcomingHoliday.date}</p>
                                    <p id='day'>{upcomingHoliday.name}</p>
                                </div>
                            ) : (
                                <p>Loading...</p>
                            )}
                        </div>
                    </Link>
                    <Link to={`/Meeting`} style={{ textDecoration: 'none', color: 'black' }}>
                        <div className='item34'>
                            <img src={colour} alt="" />
                            <h4><CiCalendar /> Meeting</h4>
                            <p>The scheduled meetings will appear here</p>
                        </div>
                    </Link>
                </div>
                <div className='ct2'>
                    <div className='iteam iteam-4'>
                    <Link to={`/Calenderview`} style={{ textDecoration: 'none', color: 'black' }}>
                        <div>
                            <GoArrowUpRight id='rii' />
                            <GoArrowDownLeft id='dii' />
                        </div>
                        </Link>
                        <h3>Calendar</h3>
                        <div id='cale'>
                            <Calendar Email={Email} />
                        </div>
                    </div>
                    <div className='iteam iteam-5'>
                        <h2>Leave stats</h2>
                        <Link to={`/Status`} style={{ textDecoration: 'none', color: 'black' }}>
                            <GoArrowUpRight id='rii' />
                            <GoArrowDownLeft id='dii' />
                        </Link>
                        <div className="container1">
                            <Doughnut data={data1} options={options1} id='douchart1' />
                            <div className="days-display">
                            {MonthLeave.length} days
                            </div>
                        </div>
                        <h3>{MonthLeave.length}/30</h3>
                        <button onClick={e => { leaveApply(e) }}>Apply for leave</button>
                    </div>
                </div>
            </div>
        </div>
    )
}
