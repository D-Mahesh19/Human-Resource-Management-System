// src/RaiseTicket.js
import axios from 'axios';
import React, { useState } from 'react';


const RaiseTicket = () => {
    const[Name,setName]=useState('');
    const Email  = localStorage.getItem('Email');
    const[Issuetype,setIssuetype]=useState('');
    const[Description,setDescription]=useState('');
    const[Priority,setPriority]=useState('');

    const handleSubmit=(e)=>{
        
        axios.post('http://localhost:8081/raiseTicket',{Name,Email,Issuetype,Description,Priority})
        .then((response)=>{
            alert("Ticket Raised Sucsessfully ")
        })
       
        setName('');
        setIssuetype('');
        setDescription('');
        setPriority('');
    }

    return (
        <div className='Tickets'>
        <div className="ticket-container">
            <h2>Raise a Ticket</h2>
            <form className="ticket-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="name">Name</label><br />
                    <input type="text" value={Name} onChange={e=>{setName(e.target.value)}} required/>
                </div>
                <div className="form-group">
                    <label htmlFor="issueType">Issue Type</label><br />
                    <input type="text" value={Issuetype} onChange={e=>{setIssuetype(e.target.value)}} required />
                </div>
                <div className="form-group">
                    <label htmlFor="description">Description</label><br />
                    <textarea  value={Description} onChange={e=>{setDescription(e.target.value)}} required 
                    ></textarea>
                </div>
                <div className="form-group">
                    <label htmlFor="priority">Priority</label><br />
                    <select
                        value={Priority} 
                        onChange={e=>{setPriority(e.target.value)}}>
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                    </select>
                </div>
                <button type="submit">Submit Ticket</button>
            </form>
        </div>
        </div>
    );
};

export default RaiseTicket;
