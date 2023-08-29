import React, { useState } from 'react'
import './Services.css'
import UpdateUserDetails from './UpdateUserDetails'
import ShowTransaction from './ShowTransactions'
import CreateAccount from './CreateAccount'
import Transaction from './Transaction'

const Services = () => {
  const [user,setUser] = useState(false)
  const[transactionDetails,setTransactionDetails]=useState(false)
  const [account,setAccount] =useState(false)
  const [show,setShow] = useState(false)
  const [transaction,setTransaction]=useState(false)
  const handleUser = () => {
    setTransaction(false)
    setUser(false)
    setUser(true)
    setTransactionDetails(false)
    setAccount(false)
    setShow(false)
  }
  const handleTransactionDetails = () =>{
    setTransaction(false)
    setTransactionDetails(true)
    setUser(false)
    setAccount(false)
    setShow(false)
    setTransaction(false)
  }
  const handleAccountCreate =()=>{
    setAccount(false)
    setAccount(true)
    setTransactionDetails(false)
    setUser(false)
    setShow(false)
    setTransaction(false)

  }
  const handleTransaction = ()=>{
    setTransaction(false)
    setTransaction(true)
    setUser(false)
    setTransactionDetails(false)
    setAccount(false)
  }

  return (
    <>
    <div className='services-container'>
      <button className='services-btn' onClick={handleUser}>Update User Details</button>
      <button className='services-btn' onClick={handleTransaction}>Make Transaction</button>
      <button className='services-btn' onClick={handleTransactionDetails}>Transaction Details</button>
      <button className='services-btn' onClick={handleAccountCreate}>Create Your Account</button>
    </div>
      {user ? <UpdateUserDetails show={show}/> : <span></span>}
      {transactionDetails? <ShowTransaction show={show} /> : <span></span>}
      {account ? <CreateAccount show={true} /> : <span></span>}
      {transaction ? <div className='dashboard-container'><Transaction show={true} /></div> : <span></span>}
    </>
  )
}

export default Services