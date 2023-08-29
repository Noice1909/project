import React, { useState } from 'react'
import ManageAccount from './ManageAccount'
import ManageWithdrawal from './ManageWithdrawal'
import ManagesCustomer from './ManagesCustomer'
import ManageContactUs from './ManageContactUs'
const Admin = () => {
    const [account,setAccount] = useState(false)
    const [customer,setCustomer] = useState(false)
    const [withdrawal,setWithdrawal] = useState(false)
    const [contactUs,setContactUs] = useState(false)
    const handleAccount = () =>{
        setAccount(true)
        setWithdrawal(false)
        setCustomer(false)
        setContactUs(false)
    }
    const handleWithdrawals = () =>{
        setWithdrawal(true)
        setAccount(false)
        setContactUs(false)
        setCustomer(false)
    }
    const handleCustomer = () =>{
        setCustomer(true)
        setAccount(false)
        setWithdrawal(false)
        setContactUs(false)
    }
    const handleContactUs = () =>{
        setContactUs(true)
        setAccount(false)
        setCustomer(false)
        setWithdrawal(false)
    }
  return (
    <>
        <div className='services-container'>
            <button className='services-btn' onClick={handleAccount}>Manage Accounts</button>
            <button className='services-btn' onClick={handleCustomer}>Manage Customer</button>
            <button className='services-btn' onClick={handleWithdrawals}>Manage Withdrawal</button>
            <button className='services-btn' onClick={handleContactUs}>Manage Contact Us</button>
        </div>
        {account ? <ManageAccount/> : null}
        {withdrawal? <ManageWithdrawal/> : <span></span>}
        {customer? <ManagesCustomer/> : null}
        {contactUs? <ManageContactUs/> : null}
    </>
  )
}

export default Admin