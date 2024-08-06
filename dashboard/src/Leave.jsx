import axios from 'axios';
import React, { useEffect, useState } from 'react';
import moment from 'moment';


export default function Leave() {
  const [FromDate,setFDate]=useState('');
  const [ToDate,setTDate]=useState('');
  const [Day,setDay]=useState('');
  const [Time,setTime]=useState('');
  const[Reason,setLReson]=useState('');
  const[Remark,setRem]=useState('');
  const[Data,setData]=useState({})
  const[Lbalance,setLbalance]=useState('');
  const Email  = localStorage.getItem('Email');
  const [leavesDays, setLeavesDays] = useState([]);
  const [leaveCountThisMonth, setLeaveCountThisMonth] = useState(0);
  const[loading,setLoading]=useState('Loading..!')

  useEffect(()=>{
   axios.post('http://localhost:8081/getemp',{Email})
   .then((response)=>{
    console.log(response.data);
    setData(response.data);
    
   })
   .catch((error)=>{console.log(error);})
  },[Email])

 useEffect(()=>{
  setLbalance(Data.No_OfLeaves - Data.Leaves_Taken)
 
 })
 const handleLeave=()=>{
  if(FromDate !='' && ToDate !='' && Reason !='')
 { axios.post(`http://localhost:8081/Leavedata/${Email}`,{FromDate,ToDate,Day,Time,Reason,Remark})
  .then((response)=>{
    alert("Leave Request Submitted sucsessfully")
    setDay('')
    setFDate('');
    setTDate('');
    setTime('');
    setRem('');
    setLReson('');
  })
  .catch((error)=>{console.log(error);})
}
else{
  alert("Enter All Fields")
}
 }
 useEffect(() => {
  const fetchData = async () => {
    try {
      const response = await axios.get(`http://localhost:8081/calendar/${Email}`);
      const data = response.data;

      if (data && data.calendarData) {
        const { LeavesDays = [] } = data.calendarData[2] || {};
        // console.log(LeavesDays);
        setLeavesDays(LeavesDays);

         // Filter leave days to count those in the current month
         const currentMonth = moment().month();
         const currentYear = moment().year();
         const leaveCount = LeavesDays.filter(day => {
          const date = moment(day, 'D:M:YYYY');
          return date.isValid() && date.month() === currentMonth && date.year() === currentYear;
        }).length;
        //  console.log(leaveCount);

         setLeaveCountThisMonth(leaveCount);
       

      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  fetchData()
}, [Email]);
 
useEffect(()=>{

})

  return (
    <div className='Emp_Leave'>
      <h1>{Data.Name || loading}</h1>
      <div className="Leave_Balance">
        <h2>Leave Balance : {Lbalance}/24</h2>
        <div>
        {/* <h2>No of Leaves Taken in this Month :{leaveCountThisMonth}</h2> */}
        <h2></h2>
        </div>
      </div>
      <div className="Leave_Date">
        <div className="Leave_date1">
          <label htmlFor="">From Date <br /> <input type="date"  required value={FromDate} onChange={e=>{setFDate(e.target.value)}}/></label>
          <label htmlFor="">Day <br />
            <select value={Day} onChange={e=>{setDay(e.target.value)}}>
              <option value=""></option>
            <option  value="Full Day">Full Day</option>
            <option value="Half Day">Half Day</option>
            </select></label>
        </div>
        <div className="Leave_date2 ">
        <label htmlFor="">To Date <br /> <input type="date" required value={ToDate} onChange={e=>{setTDate(e.target.value)}} /></label>
        
         <label htmlFor="">By Time <br /><select value={Time} onChange={e=>{setTime(e.target.value)}} placeholder="Optional">
          <option value=""></option>
          <option value="Morning">Morning</option>
          <option value="Afternoon">Afternoon</option>
         </select></label>
        
        </div>
      </div>
      <div className='Leave_Dropdown'>
        <h3>Leave Reason <br />
        <select value={Reason} onChange={e=>{setLReson(e.target.value)}}>
        <option value=""></option>
        <option value="Sick leave">Sick leave</option>
        <option value="Emergency leave">Emergency leave</option>
        <option value="Marriage leave">Marriage leave</option>
        <option value="Medical appointments">Medical appointments</option>
        <option value="Family emergency">Family emergency</option>
        <option value="Bereavement leave">Bereavement leave</option>
        <option value="Maternity leave">Maternity leave</option>
        </select>
        </h3>
        <h2>Remarks : <br /><input type="text"  value={Remark} onChange={e=>{setRem(e.target.value)}} placeholder='Optional'/></h2>
      </div>
      <button id='apply' onClick={handleLeave}><h3>Apply</h3></button>
    </div>
   
  );
}


