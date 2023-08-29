import React, { useEffect, useState } from 'react';
import './ManageAccount.css'
import axios from 'axios';
const ManageAccount = () => {
  const jwtToken = localStorage.getItem('jwtToken')
  const config = {
    headers: {
      Authorization: `Bearer ${jwtToken}`,
    },
  };
    const [accounts, setAccounts] = useState([]);
    const [selectedStatusFilter, setSelectedStatusFilter] = useState('all');
    const [emailFilter, setEmailFilter] = useState('');
    useEffect(() => {
        axios.get('http://localhost:8080/api/account/accounts',config)
          .then(response => {
            setAccounts(response.data); // Update customers state
          })
          .catch(error => console.log(error,"error"));
      }, []);

      const handleStatusChange = (account, newStatus) => {
        // Make a request to update the account's status in the database
        axios.put(`http://localhost:8080/api/account/accounts/${account.accountId}`, {
            ...account,
            status: newStatus
        },config)
        .then(response => {
            // Update the account's status in your state or data
            console.log(response)
            const updatedAccounts = accounts.map(existingAccount =>
                existingAccount.accountId === account.accountId
                    ? { ...existingAccount, status: newStatus }
                    : existingAccount
            );
            setAccounts(updatedAccounts);
        })
        .catch(error => console.log(error));
    };

    const filteredAccounts = accounts.filter(account => {
      if (selectedStatusFilter === 'all') {
        return true;
      }
      return account.status === selectedStatusFilter;
    }).filter(account => {
      if (!emailFilter) {
        return true;
      }
      return account.customer.email.includes(emailFilter);
    });
    
      // console.log(accounts , ' before')
      return (
        <div className='admin-container'>
          <h2 className='table-head'>Account List</h2>
          <div className="filter">
            <div className="filter-container">
              <label>Status Filter:</label>
              <select
                value={selectedStatusFilter}
                onChange={(e) => setSelectedStatusFilter(e.target.value)}
              >
                <option value='all'>All</option>
                <option value='active'>Active</option>
                <option value='pending'>Pending</option>
                <option value='disabled'>Disabled</option>
              </select>
            </div>
            <div className="customer-filter">
              <label className='withdrawal-label'>Email Filter:</label>
              <input
                type="text"
                value={emailFilter}
                onChange={(e) => setEmailFilter(e.target.value)}
              />
            </div>
          </div>
          <table className='styled-table'>
            <thead>
              <tr>
                <th>Name</th>
                <th>Phone Number</th>
                <th>Email</th>
                <th>Address</th>
                <th>Account Type</th>
                <th>Status</th>
                <th>Change Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredAccounts.map((account) => (
                <tr key={account.accountId}>
                  <td>{account.customer.fullName}</td>
                  <td>{account.customer.phone}</td>
                  <td>{account.customer.email}</td>
                  <td>{account.customer.address + account.customer.city + account.customer.region}</td>
                  <td>{account.accountType}</td>
                  <td>{account.status}</td>
                  <td>
                    <select
                      value={account.status}
                      onChange={(e) => handleStatusChange(account, e.target.value)}
                    >
                      <option value='active'>Active</option>
                      <option value='pending'>Pending</option>
                      <option value='disabled'>Disabled</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
}

export default ManageAccount