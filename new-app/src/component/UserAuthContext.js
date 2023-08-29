import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const UserAuthContext = createContext();


const UserAuthProvider = ({ children }) => {
  const [userAuthData, setUserAuthData] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const jwtToken = localStorage.getItem('jwtToken')
  const config = {
    headers: {
      Authorization: `Bearer ${jwtToken}`,
    },
  };
  useEffect(() => {
    if (userAuthData) {
      const customerId = userAuthData.customer.customerId;
      axios.get(`http://localhost:8080/api/account/by-customer/${customerId}`,config)
        .then(response => setAccounts(response.data))
        .catch(error => console.error('Error fetching account details:', error));

      axios.get(`http://localhost:8080/api/transaction/transactions/${customerId}`,config)
        .then(response => setTransactions(response.data))
        .catch(error => console.error('Error fetching transactions:', error));
    }
  }, [userAuthData]);

  // eslint-disable-next-line no-unused-vars
  const contextValue = {
    userAuthData,
    accounts,
    transactions,
  };
  return (
    <UserAuthContext.Provider value={{ userAuthData, setUserAuthData }}>
      {children}
    </UserAuthContext.Provider>
  );
};

const useUserAuth = () => {
  const context = useContext(UserAuthContext);
  if (context === undefined) {
    throw new Error('useUserAuth must be used within a UserAuthProvider');
  }
  return context;
};

export { UserAuthProvider, useUserAuth };