import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ManageWithdrawal = () => {
  const [withdrawals, setWithdrawals] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [customerIdFilter, setCustomerIdFilter] = useState('');
  const jwtToken = localStorage.getItem('jwtToken')
  const config = {
    headers: {
      Authorization: `Bearer ${jwtToken}`,
    },
  };
  useEffect(() => {
    axios.get('http://localhost:8080/api/withdraw/withdrawal',config)
      .then(response => {
        setWithdrawals(response.data);
      })
      .catch(error => console.log(error));
  }, []);

  const handleStatusChange = (withdrawal, newStatus) => {
    axios.put(`http://localhost:8080/api/withdraw/withdrawal/${withdrawal.withdrawalId}`, {
      ...withdrawal,
      status:newStatus
    },config)
      .then(response => {
        console.log(response.data)
        const updatedWithdrawals = withdrawals.map(existingWithdrawal =>
          existingWithdrawal.withdrawalId === withdrawal.withdrawalId
            ? { ...existingWithdrawal, status: newStatus }
            : existingWithdrawal
        );
        setWithdrawals(updatedWithdrawals);
      })
      .catch(error => console.log(error));
  };
  
  const filteredWithdrawals = withdrawals.filter(withdrawal => {
    if (selectedFilter === 'all') {
      return true;
    }
    return withdrawal.status === selectedFilter;
  }).filter(withdrawal => {
    if (!customerIdFilter) {
      return true;
    }
    return withdrawal.customer.customerId.toString().includes(customerIdFilter);
  });


  return (
    <div className='admin-container'>
          <h2 className='table-head'>Withdrawal Requests</h2>
          <div className='filter'>
              <div className="filter-container">
                <span className='withdrawal-span'>Filter : </span>
                <select value={selectedFilter} onChange={(e) => setSelectedFilter(e.target.value)}>
                  <option value='all'>All</option>
                  <option value='pending'>Pending</option>
                  <option value='accepted'>Accepted</option>
                  <option value='rejected'>Rejected</option>
                </select>
              </div>
              <div className="customer-filter">
                <label className='withdrawal-label'>Customer ID Filter:</label>
                <input type="text" value={customerIdFilter} onChange={(e) => setCustomerIdFilter(e.target.value)}/>
              </div>
          </div>
          <table className='styled-table'>
            <thead>
              <tr>
                <th>Withdrawal ID</th>
                <th>Account Number</th>
                <th>Customer ID</th>
                <th>Withdrawal Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredWithdrawals.map((withdrawal) => (
                <tr key={withdrawal.withdrawalId}>
                  <td>{withdrawal.withdrawalId}</td>
                  <td>{withdrawal.account.accountId}</td>
                  <td>{withdrawal.customer.customerId}</td>
                  <td>{withdrawal.withdrawalAmount}</td>
                  <td>
                    <select
                      value={withdrawal.status}
                      onChange={(e) => handleStatusChange(withdrawal, e.target.value)}
                    >
                      <option value='pending'>pending</option>
                      <option value='accepted'>accepted</option>
                      <option value='rejected'>rejected</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
  );
};

export default ManageWithdrawal;
