import React from 'react';
import App from './App';
import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";

import LogIn from './LogIn';
import Layout from './Layout'
import Leave from './Leave'
import Project from './Project';
import Plans from './Plans';
import Holidays from './Holidays';
import Ticket from './Ticket';
import LeaveStatus from './LeaveStatus';
import Dashboard from './Dashboard';
import Meeting from './Meeting';
import Notifications from './Notification';
import Employees from './Employees';
import ViewTickets from './ViewT';
import ScheduleMeeting from './ScheduleMeeting';
import { AttendanceProvider } from './AttendanceContext';
import LeaveAprove from './LeaveAprove';
import AtendenceRecords from './AtendenceRecords'
import HolidaysProvider from './HolidayContex';
import CalenderOverview from './CalenderOverview';


const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index element={<LogIn />} />
      <Route path='Layout' element={<Layout />} />
      <Route path='Leave' element={<Leave />} />
      <Route path='Project' element={<Project />} />
      <Route path='Plans' element={<Plans />} />
      <Route path='Holidays' element={<Holidays />} />
      <Route path='Tickets' element={<Ticket />} />
      <Route path='Status' element={<LeaveStatus />} />
      <Route path='dashboard' element={<Dashboard />} />
      <Route path='Meeting' element={<Meeting />} />
      <Route path='Notification' element={<Notifications />} />
      <Route path='employees' element={<Employees />} />
      <Route path='View' element={<ViewTickets />} />
      <Route path='Schedule' element={<ScheduleMeeting />} />
      <Route path='Aprove' element={<LeaveAprove />} />
      <Route path='Records' element={<AtendenceRecords />} />
      <Route path='Calenderview' element={<CalenderOverview />} />
     
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AttendanceProvider> 
      <HolidaysProvider>
        <RouterProvider router={router} />
      </HolidaysProvider>
    </AttendanceProvider>
  </React.StrictMode>
);


