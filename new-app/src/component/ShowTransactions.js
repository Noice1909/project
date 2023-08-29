import React, { useState, useEffect } from 'react';
import './ShowTransaction.css';
import axios from 'axios';
import { useUserAuth } from './UserAuthContext';
import PageNotFound from './PageNotFound';
const ShowTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  var { userAuthData } = useUserAuth();
  userAuthData = JSON.parse(localStorage.getItem('userAuthData'));
  const [accounts, setAccounts] = useState([]); // State for user accounts
  const [selectedAccountId, setSelectedAccountId] = useState('');
  const customer = userAuthData.customer;
  const jwtToken = localStorage.getItem('jwtToken')
  const config = {
    headers: {
      Authorization: `Bearer ${jwtToken}`,
    },
  };
  useEffect(() => {
    axios.get(`http://localhost:8080/api/account/by-customer/${customer.customerId}`, config)
      .then(response => {
        setAccounts(response.data);
        setSelectedAccountId(response.data[0]?.accountId || ''); // Default to the first account if available
      })
      .catch(error => console.error('Error fetching accounts:', error));

    axios.get(`http://localhost:8080/api/transaction/transactions/${customer.customerId}`, config)
      .then(response => {
        setTransactions(response.data);
        console.log(response);
      })
      .catch(error => console.error('Error fetching transactions:', error));
  }, []);

  const formatDate = (date) => {
    return new Date(date).toLocaleString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };
  const filteredTransactions = transactions.filter(
    transaction => transaction.account.accountId === Number(selectedAccountId)
  );

  if(useUserAuth === undefined || useUserAuth == null){
    return(
      <>
        <PageNotFound errorMessage="Its seem you are not logged in please login."></PageNotFound>
      </>
    )
  }

  return (
    <div className='transaction-container'>
      <div className='table-div'>
        <h2 className='table-head'>Transaction</h2>
        <div className='paragraph-set'>
              <p>(-) negative shows debited</p>
              <p>(+) positive shows credited</p>
        </div>
      </div>
      <div className='dropdown-container'>
        <label htmlFor='account-select'>Select Account : </label>
        <select
          value={selectedAccountId} name='account-select'
          onChange={event => setSelectedAccountId(event.target.value)}
        >
          {accounts.map(account => (
            <option key={account.accountId} value={account.accountId}>
              {account.accountId}
            </option>
          ))}
        </select>
      </div>
      <table className="styled-table">
        <thead>
          <tr>
            <th>Account No</th>
            <th>Date</th>
            <th>Description</th>
            <th>Transaction Type</th>
            <th>Amount</th>
            <th>Balance</th>                
          </tr>
        </thead>
        <tbody>
          {filteredTransactions.map((transaction)=> 
            <tr key={transaction.transactionId}>
              <th>{transaction.account.accountId}</th>
              <th>{formatDate(transaction.transactionDate)}</th>
              <th>{transaction.description}</th>
              <th>{transaction.transactionType}</th>
              <th>{transaction.amount}</th>
              <th>{transaction.balance}</th>
            </tr>
          )}
        </tbody>
      </table>
    </div> 
  );
}

export default ShowTransactions;
