// App.js
import React , {useState} from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './component/HomePage.js';
import NavBar from './component/NavBar.js';
import Login from './component/Login.js';
import Services from './component/Services.js';
import Register from './component/Register.js';
import PageNotFound from './component/PageNotFound.js';
import DashBoard from './component/DashBoard.js';
import UserNamePassword from './component/UserNamePassword.js';
import CustomerContext from './component/CustomerContext.js';
import Success from './component/Success.js';
import ContactUs from './component/ContactUs.js';
import ShowTransactions from './component/ShowTransactions.js';
import Options from './component/Options.js';
import Admin from './component/Admin.js';
import PrivateRoute from './component/PrivateRoute.js';

export const App = () => {
  const [createdCustomer, setCreatedCustomer] = useState(null);
  return (
      <BrowserRouter>
        <NavBar />
        <CustomerContext.Provider value={{ createdCustomer, setCreatedCustomer }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />}/>
          <Route path="/services" element={<PrivateRoute><Services/></PrivateRoute>} />
          <Route path="/register" element={<Register />} />
          <Route path='/dashboard' element={<PrivateRoute><DashBoard/></PrivateRoute>}/>
          <Route path='/createusernamepassword'element={<UserNamePassword/>} />
          <Route path='/success' element={<Success/>}/>
          <Route path='/contact-us' element={<ContactUs/>}/>
          <Route path='/option' element={<PrivateRoute><Options/></PrivateRoute>}/>
          <Route path='/admin' element={<PrivateRoute><Admin/></PrivateRoute>}/>
          <Route path='/show-transaction' element={<PrivateRoute><ShowTransactions/></PrivateRoute>}/>
          <Route path="*" element={<PageNotFound />} />
        </Routes>
        </CustomerContext.Provider>
      </BrowserRouter>
  );
};

export default App;

// pagination 
// contact us sort on the basis of status opened   