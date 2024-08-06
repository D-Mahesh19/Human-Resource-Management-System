const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const crypto=require('crypto');
const jwt=require('jsonwebtoken')

const app = express();
app.use(express.json());
app.use(cors());

const Acsess_key='61b41464b416640a6902a3d12b24b0cedcc1f19f080c6ecd52b4b171a30f7999'


const generatetoken=(user)=>{
    return jwt.sign(user,Acsess_key,{ expiresIn: '1h' })
}
mongoose.connect('mongodb://localhost:27017/dashbord')
    .then(() => {
        console.log("Database connected successfully");
    })
    .catch((err) => {
        console.error("Failed to connect with database:", err);
    });

const eachAttendanceSchema = new mongoose.Schema({
    PunchIn: { type: String, default: '00:00' },
    PunchOut: { type: String, default: 'N/A' },
}, { _id: false });

const attendanceSchema = new mongoose.Schema({
    Emp_ID:String,
    Date: String,
    weekNumber: Number,
    monthNumber: Number,
    year: Number,
    Records: [eachAttendanceSchema],
}, { _id: false });

const calendarSchema = new mongoose.Schema({
    PresentDays: [],
    AbsentDays: [],
    LeaveDays: []
});

const meetingSchema = new mongoose.Schema({
    MeetingName: String,
    MeetingDate: Date,
    MeetingTime:String,
    MeetingLink:String,
    MeetingStatus: { type: String, default: "Upcoming" }
});

const leaveSchema = new mongoose.Schema({
    FromDate: String,
    ToDate: String,
    Day: String,
    Time: String,
    Reason: String,
    Remark: String,
    Status: { type: String, default: "Pending" },
    Type: String
});

const ticketsSchema = new mongoose.Schema({
    Name: String,
    Email: String,
    Issuetype: String,
    Description: String,
    Priority: String,
    Status: { type: String, default: "Pending" }
});

const plansSchema = new mongoose.Schema({
    PlanName: String,
    Description: String,
    StartDate: Date,
    
});

const workHoursSchema = new mongoose.Schema({
    workDate: Date,
    weekNumber: Number,
    monthNumber: Number,
    year: Number,
    hoursWorked: Number,
    overtime: Number,
    status: String
});

const notificationSchema = new mongoose.Schema({
    userId: String,
    message: String,
    read: { type: Boolean, default: false },
    date: { type: Date, default: Date.now }
});

const userSchema = new mongoose.Schema({
    Name: String,
    Email: String,
    Password: String,
    ContactNumber: Number,
    Birth: String,
    Designation: String,
    Grade: { type: String, default: "" },
    JoiningDate: String,
    EmployeeID: String,
    Department: String,
    Manager_TL: String,
    Location: String,
    Days_Present: { type: Number, default: 0 },
    Days_Absent: { type: Number, default: 0 },
    Leaves_Taken: { type: Number, default: 0 },
    No_OfLeaves: { type: Number, default: 24 },
    Earned_Leaves: { type: Number, default: 15 },
    Unpaid_leaves: { type: Number, default: 9 },
    Others: Number,
    Leave_Balance: { type: Number },
    Total_Working_days: { type: Number, default: 0 },
    Last_Login_Time: { type: String, default: "" },
    attendanceRecords: [attendanceSchema],
    leaveRecords: [leaveSchema],
    calendarData: [calendarSchema],
    tickets: [ticketsSchema],
    plans: [plansSchema],
    meetings: [meetingSchema],
    stats: [workHoursSchema],
    notifications: [notificationSchema]
}, { collection: "employedashbord" });

const userModel = mongoose.model("employedashbord", userSchema);

// Function to create a notification
const createNotification = async (Email, message) => {
    try {
        await userModel.findOneAndUpdate(
            { Email },
            { $push: { notifications: { userId: Email, message, date: new Date() } } },
            { new: true }
        );
    } catch (err) {
        console.error('Error creating notification:', err);
    }
};

app.post('/getNotifications', (req, res) => {
    const { Email } = req.body;
    
    userModel.findOne({ Email })
        .then(user => {
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.json({ notifications: user.notifications });
        })
        .catch(err => {
            console.error('Error fetching notifications:', err);
            res.status(500).json({ message: 'Server error' });
        });
});

app.post('/markNotificationAsRead', async (req, res) => {
    const { Email, notificationId } = req.body;

    try {
        // Update the notification status to read
        await userModel.updateOne(
            { Email, 'notifications._id': notificationId },
            { $set: { 'notifications.$.read': true } }
        );

        // Fetch updated notifications
        const user = await userModel.findOne({ Email });
        res.send({ notifications: user.notifications });
    } catch (error) {
        console.error('Error marking notification as read:', error);
        res.status(500).send({ error: 'Internal server error' });
    }
})

app.post('/attendence', (req, res) => {
    const { Email, Date, PunchIn, PunchOut,weekNumber, monthNumber,year } = req.body;

    userModel.findOne({ Email, 'attendanceRecords.Date': Date })
        .then(user => {
            if (!user) {
                const newRecord = {
                    Emp_ID:Email,
                    Date,
                    weekNumber,
                     monthNumber,
                     year,
                    Records: [{ PunchIn, PunchOut }]
                };
                userModel.findOneAndUpdate(
                    { Email },
                    { $push: { attendanceRecords: newRecord } },
                    { new: true }
                )
                .then(result => {
                    res.send(result);
                    // createNotification(Email, 'Attendance recorded for ' + Date);
                })
                .catch(error => {
                    console.error('Error creating new attendance record:', error);
                    res.status(500).send(error);
                });
            } else {
                if (PunchOut) {
                    userModel.findOneAndUpdate(
                        { Email, 'attendanceRecords.Date': Date, 'attendanceRecords.Records.PunchOut': 'N/A' },
                        {
                            $set: {
                                'attendanceRecords.$.Records.$[record].PunchOut': PunchOut
                            }
                        },
                        {
                            arrayFilters: [{ 'record.PunchOut': 'N/A' }],
                            new: true
                        }
                    )
                    .then(result => {
                        res.send(result);
                        // createNotification(Email, 'Punch out recorded for ' + Date);
                    })
                    .catch(error => {
                        console.error('Error updating punch-out:', error);
                        res.status(500).send(error);
                    });
                } else {
                    userModel.findOneAndUpdate(
                        { Email, 'attendanceRecords.Date': Date },
                        {
                            $push: {
                                'attendanceRecords.$.Records': { PunchIn }
                            }
                        },
                        { new: true }
                    )
                    .then(result => {
                        res.send(result);
                        // createNotification(Email, 'Punch in recorded for ' + Date);
                    })
                    .catch(error => {
                        console.error('Error inserting punch-in:', error);
                        res.status(500).send(error);
                    });
                }
            }
        })
        .catch(error => {
            console.error('Error finding user:', error);
            res.status(500).send(error);
        });
});

app.post('/getemp', (req, res) => {
    const { Email } = req.body;
    userModel.findOne({ Email })
        .then((result) => {
            res.send(result);
        })
        .catch((err) => {
            console.error('Error fetching employee data:', err);
            res.status(500).send({ error: 'Internal server error' });
        });
});

app.get('/getfull', (req, res) => {
    userModel.find({})
        .then((result) => {
            res.send(result);
        })
        .catch((err) => {
            console.error('Error fetching employee data:', err);
            res.status(500).send({ error: 'Internal server error' });
        });
});

app.post('/Leavedata/:Email', (req, res) => {
    const Email = req.params.Email;
    const { FromDate, ToDate, Day, Time, Reason, Remark } = req.body;
    userModel.updateOne({ Email }, {
        $push: { leaveRecords: { FromDate, ToDate, Day, Time, Reason, Remark } }
    })
    .then((result) => {
        res.send(result);
        createNotification(Email, 'Leave request submitted.');
    })
    .catch((err) => {
        res.send(err);
    });
});

app.post('/Employeinsert', (req, res) => {
    userModel.create(req.body)
    .then((result) => {
        res.send(result);
        createNotification(req.body.Email, 'Welcome to the company!');
    })
    .catch((error) => {
        res.send(error);
    });
});

app.post('/raiseTicket', (req, res) => {
    const { Name, Email, Issuetype, Description, Priority } = req.body;
    userModel.updateOne({ Email },
        { $push: { tickets: { Name,Email, Issuetype, Description, Priority } } }
    )
    .then((result) => {
        res.send(result);
        createNotification(Email, 'Ticket raised: ' + Issuetype);
    })
    .catch((err) => {
        res.send(err);
    });
});

app.post('/createplans', (req, res) => {
    const { Email, PlanName, Description, StartDate} = req.body;
    userModel.updateOne({ Email },
        {
            $push: { plans: { PlanName, Description, StartDate } }
        }
    )
    .then((result) => {
        res.send(result);
        createNotification(Email, 'New plan created: ' + PlanName);
    })
    .catch((err) => {
        res.send(err);
    });
});

app.get('/calendar/:Email', async (req, res) => {
    const Email = req.params.Email;

    try {
        const user = await userModel.findOne({ Email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ user });
    } catch (err) {
        console.error('Error fetching calendar data:', err);
        res.status(500).json({ message: 'Server error' });
    }
});
  app.post('/AbsentDays/:Email',(req,res)=>{
    const Email=req.params.Email;
    const {formattedDate}=req.body;
    userModel.findOneAndUpdate({Email},{ 
      $addToSet: { "calendarData.1.AbsentDays": formattedDate }
    }, { new: true })
    .then((result)=>{
        res.send(result.calendarData);
        
    })
    .catch((err)=>{res.send(err)})
  })
  app.post('/Presentdays',(req,res)=>{
    const {Email,formattedDate}=req.body;
    userModel.updateOne({Email},{
        $addToSet: { "calendarData.0.PresentDays": formattedDate } 
    },{ new: true })
    .then((result)=>{
        res.send(result.calendarData);
        
    })
    .catch((err)=>{res.send(err)})
  })
  app.get('/tickets',(req,res)=>{
    userModel.find({})
    .then((result)=>{
      res.send(result);
      
    })
  })
  app.post('/tickets/solve',(req,res)=>{
    const {Email, ticketId } = req.body; 
    userModel.updateOne({ 'tickets._id': ticketId },
        { $set: { 'tickets.$.Status': 'Solved' } },)
        .then((result)=>{
            createNotification(Email, 'your Raised Ticket ' + ticketId+" will solved");
            res.send(result)
            
            
          })
  })
  app.post('/Schedulemeet', async (req, res) => {
    const { Emails, MeetingName, MeetingDate, MeetingTime, MeetingLink } = req.body;
    try {
        const results = [];
        
        for (const email of Emails) {
            const result = await userModel.findOneAndUpdate(
                { Email: email },
                { $push: { meetings: { MeetingName, MeetingDate, MeetingTime, MeetingLink } } },
                { new: true } // To return the updated document
            );
            results.push(result);

            // Optionally, create notifications for each email
            createNotification(email, 'Meeting Scheduled for ' + MeetingDate);
        }

        res.send(results);
    } catch (err) {
        console.error('Error updating users:', err);
        res.status(500).send(err);
    }
});


    app.post('/donemeet',(req,res)=>{
        const{meetid}=req.body;
        userModel.updateOne({ 'meetings._id': meetid },
            { $set: { 'meetings.$.MeetingStatus': 'Done' } },)
            .then((result)=>{})  
    })

    // app.post('/stats', async (req, res) => {
    //     const { Email, workDate, weekNumber, monthNumber, year, hoursWorked, overtime, status } = req.body;
        
    //     try {
    //         // console.log('Parameters received:', { Email, workDate, weekNumber, monthNumber, year, hoursWorked, overtime, status });
            
    //         const workDateObj = new Date(workDate);
    //         if (isNaN(workDateObj.getTime())) {
    //             return res.status(400).json({ error: 'Invalid workDate format' });
    //         }
    
    //         let updateData = {
    //             workDate,
    //             weekNumber,
    //             monthNumber,
    //             year,
    //             hoursWorked,
    //             status
    //         };
    
    //         if (overtime !== undefined) {
    //             updateData.overtime = overtime;
    //         }
    
    //         const result = await userModel.findOneAndUpdate(
    //             { Email, "stats.workDate": workDateObj },
    //             { $set: { "stats.$": updateData } },
    //             { new: true }
    //         );
            
    //         if (!result) {
    //             // If no existing record found, push a new record
    //             await userModel.findOneAndUpdate(
    //                 { Email },
    //                 { $push: { stats: {...updateData } } },
    //                 { new: true }
    //             );
    //         }
    
    //         res.status(200).json({ message: 'Record updated successfully' });
    
    //     } catch (error) {
    //         // console.error(error);
    //         res.status(500).json({ error: 'Internal server error' });
    //     }
    // });

    app.get('/weekNumber', async (req, res) => {
        const { Email, weekNumber, year } = req.query;

        // console.log({ Email, weekNumber, year });
      
        try {
          const data = await userModel.find({
            Email,
            'attendanceRecords.weekNumber': weekNumber,
            'attendanceRecords.year': year
          });
      
          if (data.length === 0) {
            console.log('No data found for the given week number and year.');
            return 
          }
         
          const statsData = data.map(doc => 
            doc.attendanceRecords
              .filter(record => record.weekNumber == weekNumber && record.year == year)
              .map(record => record) 
          ).flat(2); 
      
        //   console.log("Stats Data:", statsData);
          res.send(statsData);
        } 
        catch (error) {
          console.error('Error fetching data:', error);
          res.status(500).send({ message: 'Internal Server Error' });
        }
      });

      app.get('/monthNumber', async (req, res) => {
        const { Email, monthNumber, year } = req.query;

        // console.log({ Email, monthNumber, year });
      
        try {
          const data = await userModel.find({
            Email,
            'attendanceRecords.monthNumber':monthNumber,
            'attendanceRecords.year': year
          });
      
          if (data.length === 0) {
            console.log('No data found for the given week number and year.');
            return 
          }
         
          const statsData = data.map(doc => 
            doc.attendanceRecords
              .filter(record => record.monthNumber ==monthNumber && record.year == year)
              .map(record => record) 
          ).flat(2); 
      
        //   console.log("Stats Data:", statsData);
          res.send(statsData);
        } 
        catch (error) {
          console.error('Error fetching data:', error);
          res.status(500).send({ message: 'Internal Server Error' });
        }
      });
  

app.get('/dailyRecords', async (req, res) => {
    const { Email, month, year } = req.query;

    try {
         

        const startOfMonth = new Date(year, month - 1, 1);
        const endOfMonth = new Date(year, month, 0);
        //  console.log('Start of month:', startOfMonth);
        //  console.log('End of month:', endOfMonth);

        const data = await userModel.find({
            Email,
            'stats.workDate': { $gte: startOfMonth, $lte: endOfMonth }
        }); // Only return the matched stats element

        if (data.length === 0) {
            // console.log('No data found for the given month and year.');
            return res.status(404).send({ message: 'No data found' });
        }
            // console.log(data);
        const dailyRecords = data.map(doc => doc.stats).flat();
        // console.log('Data found:', dailyRecords);
        res.send(dailyRecords);
    } catch (error) {
        // console.error('Error fetching data:', error);
        res.status(500).send({ message: 'Internal Server Error' });
    }
});

  app.post('/Aprove',(req,res)=>{
    const{Email,leaveId,Status,Type}=req.body;
    userModel.findOneAndUpdate({'leaveRecords._id':leaveId},
        { $set: { 'leaveRecords.$.Status': Status,'leaveRecords.$.Type':Type } },{new:true})
        .then((result)=>{
            res.send(result)
            createNotification(Email, 'Leave '+ Status + ' of ID '+leaveId);
        }
        )
  });
  app.post('/count', (req, res) => {
    const { Email, Leaves_Taken } = req.body;
    userModel.findOneAndUpdate(
        { Email },
        { Leaves_Taken },
        { new: true },)
.then((result)=>{
console.log("Updated");}
)
});

app.get('/plans/:Email', (req, res) => {
    const { Email } = req.params;
    userModel.findOne({ Email })
      .then(result => {
        if (result) {
          res.send(result.plans);
        } else {
          res.status(404).send({ message: 'User not found' });
        }
      })
      .catch(error => {
        console.error('Error fetching plans:', error);
        res.status(500).send({ message: 'Server error' });
      });
  });
  
  app.get('/absentdays', async (req, res) => {
    const{Email}=req.query;
     userModel.findOne({Email})
     .then((result)=>{
        res.send(result)
     })
  });
  
 
  
  
const port = 8081;
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});    
  