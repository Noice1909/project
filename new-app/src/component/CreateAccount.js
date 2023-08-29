import React, { useState } from 'react';
import './Services.css';
import axios from 'axios';
import { useUserAuth } from './UserAuthContext';
import PageNotFound from './PageNotFound';
import Success from './Success';

const CreateAccount = () => {
  const [selectedAccountType, setSelectedAccountType] = useState('');
  const [apiResponse, setApiResponse] = useState(null); // To store the API response
  var { userAuthData } = useUserAuth();
  userAuthData = JSON.parse(localStorage.getItem('userAuthData'));
  const customer = userAuthData?.customer;
  const sty = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    margin: "auto",
    marginTop: "1%",
    minWidth: "350px",
    width: "35%",
    background: "#fff",
    /* padding: "35px", */
    borderRadius: "8px",
    boxShadow: "0 0 15px rgba(0, 0, 0, 0.1)",
  };
  const jwtToken = localStorage.getItem('jwtToken')
  const config = {
    headers: {
      Authorization: `Bearer ${jwtToken}`,
    },
  };
  const handleAccountTypeChange = (event) => {
    setSelectedAccountType(event.target.value);
  };
  
  const handleCreateAccount = async () => {
    try {
      const newAccountData = {
        accountType: selectedAccountType,
        customer: customer,
        balance: 0,
        status: 'pending'
      };

      const response = await axios.post('http://localhost:8080/api/account/accounts', newAccountData,config);
      setApiResponse(response);
      console.log(response);
    } catch (error) {
      console.error('Error creating account:', error);
    }
  };
  // if(useUserAuth === undefined || useUserAuth == null){
  //   return(
  //     <>
  //       <PageNotFound errorMessage="Its seem you are not logged in please login."></PageNotFound>
  //     </>
  //   )
  // }
  return (
    <div>
      {!apiResponse && (
        <div className='account-container'>
          <select className="account-type-select" value={selectedAccountType} onChange={handleAccountTypeChange}>
            <option value="">Select Account Type</option>
            <option value="current">Current account</option>
            <option value="savings">Savings account</option>
            <option value="salary">Salary account</option>
            {/* <option value="fixed-deposit">Fixed deposit account</option>
            <option value="recurring-deposit">Recurring deposit account</option>
            <option value="nri">NRI accounts</option> */}
          </select>
          <button className='account-btn' onClick={handleCreateAccount}>Create Account</button>
        </div>
      )}

      <div className='create-container' style={sty}>
        {apiResponse && apiResponse.data.success ? (
          <Success show={true} message="Your account request is submitted successfully" navigateTo="/dashboard" buttonMessage="Dashboard"/>
        ) : (
          apiResponse && (
            <PageNotFound show={!apiResponse.success} message="You have reached your account limits. Please contact the bank if this is a mistake." navigateTo="/dashboard" buttonMessage="Dashboard"/>
          )
        )}
      </div>
    </div>
  );
}

export default CreateAccount;
