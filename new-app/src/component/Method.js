import React, { useState, useEffect } from 'react';
import './Method.css';
import PageNotFound from './PageNotFound.js'
import { useUserAuth } from './UserAuthContext';
import axios from 'axios';
import Success from './Success';
import Withdrawal from './Withdrawal';

const Method = (props) => {
  const { transactionType } = props;
  const [amount, setAmount] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [accounts, setAccounts] = useState([]);
  const [errorPage,setErrorPage] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [responseMessage, setResponseMessage] = useState('')
  var { userAuthData } = useUserAuth();
  userAuthData = JSON.parse(localStorage.getItem('userAuthData'));
  const [showPage,setShowPage] = useState(false)
  const [selectedAccountError,setSelectedAccountError] = useState(false)
  const [accountNumberError,setAccountNumberError] = useState(false)
  const [amountError,setAmountError] = useState(false)
  const [selectedAccountErrorMessage,setSelectedAccountErrorMessage] = useState(false)
  const [accountNumberErrorMessage,setAccountNumberErrorMessage] = useState(false)
  const [amountErrorMessage,setAmountErrorMessage] = useState(false)

  const jwtToken = localStorage.getItem('jwtToken')
  const config = {
    headers: {
      Authorization: `Bearer ${jwtToken}`,
    },
  };

  useEffect(() => {
    const fetchAccountDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/account/by-customer/${userAuthData?.customer?.customerId}`,config
        );
        setAccounts(response.data);
      } catch (error) {
        console.error('Error fetching account details:', error);
      }
    };

    fetchAccountDetails();
  }, [userAuthData?.customer?.customerId]);

  const handleAmountChange = (event) => {
    setAmount(event.target.value);
  };

  const handleAccountNumberChange = (event) => {
    setAccountNumber(event.target.value);
  };

  const handleAccountChange = (event) => {
    const selectedAccountId = event.target.value;
    setSelectedAccount(accounts.find((account) => account.accountId === Number(selectedAccountId)));
  };
  const payNow = async (requestBody) => {
    try {
      const response = await axios.post('http://localhost:8080/api/transaction/process', requestBody, config);
      return response;
    } catch (error) {
      console.error('Error during registration:', error);
      throw error;
    }
  };
  
  const handlePayNow = async () => {
    // if(handleError()){
    //   return
    // }
    if(!selectedAccount){
      setSelectedAccountError(true)
      setSelectedAccountErrorMessage("Please Select Account")
      return 
    }
    else{
      setSelectedAccountError(false)
      setSelectedAccountErrorMessage("")
    }
    if(selectedAccount.status!=="active"){
      setSelectedAccountError(true)
      setSelectedAccountErrorMessage("Select Account is not active now.")
      return
    }
    else{
      setSelectedAccountError(false)
      setSelectedAccountErrorMessage("")
    }
    if(accountNumber <=0){
      setAccountNumberError(true)
      setAccountNumberErrorMessage("Account number should be positive non zero number")
      return
    }
    else{
      setAccountNumberError(false)
      setAccountNumberErrorMessage("")
    }
    if(amount<=0){
      setAmountError(true)
      setAmountErrorMessage("Amount should be positive non zero number")
      return 
    }
    else{
      setAccountNumberError(false)
      setAmountErrorMessage("")
    }
    const requestBody = {
      senderAccountId: parseInt(selectedAccount.accountId),
      receiverAccountId: parseInt(accountNumber),
      amount: amount.toString(),
      transactionType: transactionType
    };
    
    try{
      payNow(requestBody)
        .then(response => {
          console.log(response.data,"response data")
          if(response.data.success) {
            setResponseMessage(response.data.message)
            setShowPage(true)
            console.log("i am here")
          }
          else{
            setResponseMessage(response.data.message);
            setShowPage(true)
            setErrorPage(true);
          }
        })
        .catch(error => {
          console.log("Error while processing Transaction : ",error)
          setErrorPage(true)
          setResponseMessage(error)
        })
    }catch(error){
      console.error('Error during registration:', error);
    }
  };
  if(transactionType === "withdrawal"){
    return(
      <>
        <Withdrawal/>
      </>
    )
  }

  if(useUserAuth === undefined || useUserAuth == null){
    return(
      <>
        <PageNotFound errorMessage="Its seem you are not logged in please login."></PageNotFound>
      </>
    )
  }
  
  return (
    
    <>
    {showPage ? (
      !errorPage ? (
        <Success show={true} message="Transaction Successful" navigateTo="/dashboard" buttonMessage="Dashboard"/>
      ) : (
        <PageNotFound show={true} message={responseMessage} navigateTo="/dashboard" buttonMessage="Dashboard" />
      )
    ) : (
      <div className="transaction-component">
        <h2>{transactionType.toUpperCase()} Transaction</h2>
        <div style={{ alignItems: "flex-start" }}>
          <select onChange={handleAccountChange} className="account-number-select">
            <option value="">Select Account</option>
            {accounts.map((account) => (
              <option key={account.accountId} value={account.accountId}>
                {account.accountId}
              </option>
            ))}
          </select>
          {selectedAccount ? (
              <p>
                <br />
                <strong>Account Balance: $</strong> {selectedAccount.balance}
              </p>
            ) : null}
          {selectedAccountError ? <span>{selectedAccountErrorMessage}</span> : null}
        </div>
        <div className="transaction-form">
          <label>Account Number:</label>
          <input type="number" value={accountNumber} onChange={handleAccountNumberChange} />
          {accountNumberError ? <span>{accountNumberErrorMessage}</span>:null}
          <label>Amount:</label>
          <input style={{}} type="number" value={amount} onChange={handleAmountChange} />
          {amountError ? <span>{amountErrorMessage}</span> : null}
          <button onClick={handlePayNow}>Pay Now</button>
        </div>
      </div>
    )}
  </>
  
  );
};

export default Method;