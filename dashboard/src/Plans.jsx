import axios from 'axios';
import React, { useEffect, useState } from 'react';



const CreatePlansPage = () => {
    
    const [plans, setPlans] = useState([]);
    const Email  = localStorage.getItem('Email');
    const [PlanName, setPlanName] = useState('');
    const [Description, setDescription] = useState('');
    const [StartDate, setStartDate] = useState('');
    

    useEffect(()=>{
        axios.post('http://localhost:8081/getemp',{Email})
        .then((response)=>{
            setPlans(response.data.plans)
        })
    })

   
    const handleSubmit = (event) => {
        event.preventDefault();
        axios.post('http://localhost:8081/createplans',{Email,PlanName,Description,StartDate})
        .then((response)=>{
            alert("Plans Created Sucsessfully ");
            setPlanName('');
            setDescription('');
            setStartDate('');
        
        })
    };

    return (
        <div className='plans'>
            <h1>Create Plans</h1>
            <div className="plancontain">
                <div className="form-section">
                    <h2>Create New Plan</h2>
                    <form onSubmit={handleSubmit}>
                        <label >Plan Name:</label><br />
                        <input type='text' value={PlanName}  onChange={(e) => setPlanName(e.target.value)} required /><br /><br />
                        <label>Description:</label><br />
                        <textarea  value={Description}  onChange={(e) => setDescription(e.target.value)} required ></textarea><br /><br />
                        <label > Date:</label><br />
                        <input type="date" value={StartDate} onChange={(e) => setStartDate(e.target.value)} required /><br /><br />
                        <button type="submit">Create Plan</button>
                    </form>
                </div>
                <div className="plans-section">
                    <h2>Created Plans</h2>
                    {plans.length === 0 ? (
                        <p>No plans created yet.</p>
                    ) : (
                        plans.map(plan => (
                            <div className="plan-item">
                                <h3>{plan.PlanName}</h3>
                                <p><strong>Description:</strong> {plan.Description}</p>
                                <p><strong>Date:</strong> {plan.StartDate} </p>
                               
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default CreatePlansPage;
