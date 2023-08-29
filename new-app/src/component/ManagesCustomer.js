import React, { useEffect, useState } from 'react';
import axios from 'axios';
const ManagesCustomer = () => {
    const [customers, setCustomers] = useState([]);
    const [selectedStatusFilter, setSelectedStatusFilter] = useState('all');
    const [phoneFilter, setPhoneFilter] = useState('');
    const jwtToken = localStorage.getItem('jwtToken')
    const config = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    };
    useEffect(() => {
        axios.get('http://localhost:8080/api/customer/customers',config)
          .then(response => {
            setCustomers(response.data); // Update customers state
          })
          .catch(error => console.log(error,"error"));
      }, []);

      const handleStatusChange = (customer, newStatus) => {
        // Make a request to update the account's status in the database
        axios.put(`http://localhost:8080/api/customer/customers/${customer.customerId}`, {
            ...customer,
            status: newStatus
        },config)
        .then(response => {
            // Update the account's status in your state or data
            console.log(response)
            const updatedCustomer = customers.map(existingCustomer =>
                existingCustomer.customerId === customer.customerId
                    ? { ...existingCustomer, status: newStatus }
                    : existingCustomer
            );
            setCustomers(updatedCustomer);
        })
        .catch(error => console.log(error));
    };

    const filteredCustomers = customers.filter(customer => {
        if (selectedStatusFilter === 'all') {
          return true;
        }
        return customer.status === selectedStatusFilter;
      }).filter(customer => {
        if (!phoneFilter) {
          return true;
        }
        return customer.phone.includes(phoneFilter);
      });

  return (
    <div className='admin-container'>
          <h2 className='table-head'>Customer List</h2>
          <div className="filter">
            <div className="filter-container">
              <label>Status Filter:</label>
              <select
                value={selectedStatusFilter}
                onChange={(e) => setSelectedStatusFilter(e.target.value)}
              >
                <option value='all'>All</option>
                <option value='active'>Active</option>
                <option value='disabled'>Disabled</option>
              </select>
            </div>
            <div className="customer-filter">
              <label className='withdrawal-label'>Phone Filter:</label>
              <input
                type="text"
                value={phoneFilter}
                onChange={(e) => setPhoneFilter(e.target.value)}
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
                <th>Status</th>
                <th>Change Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map((customer) => (
                <tr key={customer.customerId}>
                  <td>{customer.fullName}</td>
                  <td>{customer.phone}</td>
                  <td>{customer.email}</td>
                  <td>{customer.address + customer.city + customer.region}</td>
                  <td>{customer.status}</td>
                  <td>
                    <select
                      value={customer.status}
                      onChange={(e) => handleStatusChange(customer, e.target.value)}
                    >
                      <option value='active'>Active</option>
                      <option value='disabled'>Disabled</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
  )
}

export default ManagesCustomer