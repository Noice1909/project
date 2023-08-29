import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ManageAccount.css'

const ManageContactUs = () => {
  const jwtToken = localStorage.getItem('jwtToken');
  const config = {
    headers: {
      Authorization: `Bearer ${jwtToken}`,
    },
  };

  const [contactMessages, setContactMessages] = useState([]);
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    axios.get('http://localhost:8080/api/contact-us/contact', config)
      .then(response => {
        console.log(response.data)
        setContactMessages(response.data); // Update contact messages state
      })
      .catch(error => console.log(error));
  }, []);

  const handleStatusChange = (message, newStatus) => {
    // Make a request to update the message's status in the database
    axios.put(`http://localhost:8080/api/contact-us/contact/${message.contactusId}`, {
      ...message,
      status: newStatus
    }, config)
    .then(response => {
      // Update the message's status in your state or data
      const updatedMessages = contactMessages.map(existingMessage =>
        existingMessage.messageId === message.messageId
          ? { ...existingMessage, status: newStatus }
          : existingMessage
      );
      setContactMessages(updatedMessages);
    })
    .catch(error => console.log(error));
  };

  const filteredMessages = contactMessages.filter(message => {
    if (selectedStatusFilter === 'all') {
      return true;
    }
    return message.status === selectedStatusFilter;
  }).filter(message => {
    if (!searchTerm) {
      return true;
    }
    const messageId = String(message.contactusId); // Convert to string
    return (
      messageId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });
  
  
  return (
    <div className='admin-container'>
      <h2 className='table-head'>Contact Us Requests</h2>
      <div className="filter">
        <div className="filter-container">
          <label>Status Filter:</label>
          <select
            value={selectedStatusFilter}
            onChange={(e) => setSelectedStatusFilter(e.target.value)}
          >
            <option value='all'>All</option>
            <option value='active'>Active</option>
            <option value='closed'>Closed</option>
          </select>
        </div>
        <div className="customer-filter">
          <label className='withdrawal-label'>Search:</label>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by ID or Name"
          />
        </div>
      </div>
      <table className='styled-table'>
        <thead>
          {/* ... table header rows */}
          <tr>
            <th>Ref No</th>
            <th>Name</th>
            <th>Email</th>
            <th>Message</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredMessages.map((message) => (
            <tr key={message.contactusId}>
              <td>{message.contactusId}</td>
              <td>{message.name}</td>
              <td>{message.email}</td>
              <td>{message.message}</td>
              <td>
                {/* ... button logic */}
                {message.status === 'active' && (
                  <button
                    style={{
                        // flex: 1,
                        height: "29px",
                        width: "100%",
                        color: "#fff",
                        fontSize: "1rem",
                        fontWeight: "400",
                        border: "none",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                        background: "rgb(25, 113, 255)",
                        borderRadius: "5px",
                    }}
                    onClick={() => handleStatusChange(message, 'closed')}
                    disabled={message.status === 'closed'}
                  >
                    {message.status === 'closed' ? 'Closed' : 'Close'}
                  </button>
                )}
                {message.status === 'closed' && (
                  <button style={{
                    // flex: 1,
                    height: "29px",
                    width: "100%",
                    color: "#fff",
                    fontSize: "1rem",
                    fontWeight: "400",
                    border: "none",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    background: "#c3ddeb",
                    borderRadius: "5px",
                }} disabled>Closed</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageContactUs;
