import React from 'react'
import './Services.css'
import { useNavigate } from 'react-router-dom'
const Options = () => {
    const navigate = useNavigate();
    const adminLogin = () =>{
        navigate('/admin')
    }
    const customerLogin = () =>{
        navigate('/dashboard')
    }
  return (
    <div className='services-container'>
        <button className='services-btn' onClick={customerLogin}>As Customer</button>
        <button className='services-btn' onClick={adminLogin}>As Admin</button>
    </div>
  )
}

export default Options