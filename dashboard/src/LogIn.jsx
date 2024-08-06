
import { useEffect, useState } from 'react';
import Bc from './Assets/Bc2.png'
import Log from'./Assets/LogIn_Bc.jpg'
import Logo from'./Assets/Logo2.png'
import axios from'axios'
import { useNavigate } from 'react-router-dom';

export default function LogIn() {
    
     const [Password,setPassword]=useState('');
     const[Email,setEmail]=useState('');
     const[Invalid,setInvalid]=useState('');
     const[Cap,setCap]=useState('');
     const[inputcap,setInputcap]=useState('');
     
     
     const navigate=useNavigate();

function captch(n)
  {
    const char='abcdefghijklmnopqrrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0987654321'
    let capcha='';

    for(let i=0;i<n;i++)
      {
        capcha+=char[(Math.floor(Math.random()*char.length))];
      }
      setCap(capcha);

    
  }

  useEffect(() => {
    captch(6);
  }, []);

     const fetchDetails=(Email)=>{
        axios.post('http://localhost:8081/getemp', { Email })
        .then((response)=>{
            console.log(response.data);
              if (response.data &&  response.data.Email === Email && response.data.Password===Password) {
               
                  if(inputcap===Cap)
                    {
                        
                        localStorage.setItem('Email',Email);
                        localStorage.setItem('User',JSON.stringify(response.data));
                        navigate(`/Layout`);
                    }
                    else
                    {
                      setInvalid('Enter a valid captcha')
                      setInputcap('')
                    }
                
            } else {
                setInvalid("Enter a Valid Credential");
            }
        })
        .catch((error)=>{
            console.error("Error fetching employee details:", error);
            setInvalid("Error fetching details");
        })
     }
    
    const sublog = async (e) => {
        e.preventDefault();
        fetchDetails(Email);
    };

  return (
    <div className='LogIn'>
        <div className="LogInbox">
            <div className="LogInDetails">
            <p style={{ color: 'red' }}></p>
                <img src={Logo} alt="" />
                <h3>Welcome Back !</h3>
                <p>Please enter your details</p>
                <form action="">
                <h4>Email  Address <br /><input type="email"  value={Email} onChange={e=>{setEmail(e.target.value)}} required /></h4>
                <h4>Password <br /><input type="text"   value={Password} onChange={e=>{setPassword(e.target.value)}} required /></h4>
             
                <p id='cap'>{Cap}  </p>
                <input className="capi"type="text" placeholder='Enter the Captcha' value={inputcap} onChange={e=>{setInputcap(e.target.value)}}/>
                <p className='re-icon'><i class="fa-solid fa-arrows-rotate" onClick={()=>{captch(6)}}></i></p>
                <button onClick={sublog} >Login  </button>
                <p id='invalid'>{Invalid}</p>
                </form>
            </div>
            <div className="LogInImg">
               <img src={Bc} alt="" />
                <div className="LogInpic">
                    <img src={Log} alt="" />
                    <h3>World-Class IT Solutions at your finger tips <br /> <p></p></h3>
                </div>
              
            </div>
        </div>
    </div>
  )
}
