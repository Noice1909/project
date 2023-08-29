import React, {useContext } from 'react'
import './Register.css'
import { Link } from 'react-router-dom'
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import CustomerContext from './CustomerContext';

const Register = (props) => {
  const { setCreatedCustomer } = useContext(CustomerContext);
  const registerUser = async (registrationDetails) => {
    try {
      const response = await axios.post('http://localhost:8080/api/customer/customers', registrationDetails);
      return response;
    } catch (error) {
      console.error('Error during registration:', error);
      throw error;
    }
  };
  const navigate = useNavigate()
    const formik = useFormik({
        initialValues: {
          fullName: '',
          email: '',
          phone:'',
          address:'',
          city:'',
          region:'',
          postalCode:'',
          birthDate:'',
          role:'customer'
        },
        validationSchema: Yup.object({
            fullName: Yup.string().min(3, 'Username must be at least 3 characters').required('Username is required.'),
            email: Yup.string().email('Invalid email address.').required('Email is required.'),
            phone: Yup.string().matches(/^(?:\+?\d{1,3}\s?)?\d{10}$/, 'Invalid phone number').required('Phone number is required'),
            birthDate: Yup.date().max(new Date(), 'Birth date cannot be in the future').required('Birth date is required'),
            address: Yup.string().required('Address is required.'),
            city: Yup.string().required('City is required.'),
            region: Yup.string().required('Region is required.'),
            postalCode : Yup.string()
            .matches(/^\d{6}$/, 'Postal code must be exactly 6 digits').required('Postal code is required'),
        }),
        onSubmit: async (values, { setSubmitting }) => {
          console.log(values)
          try {
            const response = await registerUser(values);
            if (response.data.success) {
              // Registration successful, redirect to login or dashboard
              console.log('Registration successful');
              setCreatedCustomer(response.data.customer);
              navigate('/createusernamepassword'); // or navigate to dashboard
            } else {
              // Registration failed, show error message
              const errorMessage = 'Registration failed. Please try again.';
              navigate(`/error?message=${encodeURIComponent(errorMessage)}`);
            }
          } catch (error) {
            console.error('Error during registration:', error);
            const errorMessage = 'An error occurred during registration. Please try again later.';
            navigate(`/error?message=${encodeURIComponent(errorMessage)}`);
          } finally {
            setSubmitting(false);
          }
        },
        
      });
  return (
    <section className="container">
      <header>Registration Form</header>
      <form onSubmit={formik.handleSubmit} className="form">
        <div className="input-box">
            <label>Full Name</label>
            <input type="text" name='fullName' value={formik.values.fullName} onChange={formik.handleChange} onBlur={formik.handleBlur} placeholder="Enter full name" required />
            {formik.touched.fullName && formik.errors.fullName && (<span className="error">{formik.errors.fullName}</span>)}
        </div>
        <div className="input-box">
            <label>Email Address</label>
            <input type="text" name='email' value={formik.values.email} onChange={formik.handleChange} onBlur={formik.handleBlur} placeholder="Enter email address" required />
            {formik.touched.email && formik.errors.email && (<span className="error">{formik.errors.email}</span>)}
        </div>
        <div className="column">
          <div className="input-box">
            <label>Phone Number</label>
            <input type="text" name='phone' value={formik.values.phone} onChange={formik.handleChange} onBlur={formik.handleBlur} placeholder="Enter phone number" required />
            {formik.touched.phone && formik.errors.phone && (<span className="error">{formik.errors.phone}</span>)}
          </div>
          <div className="input-box">
            <label>Birth Date</label>
            <input type="date" name='birthDate' value={formik.values.birthDate} onChange={formik.handleChange} onBlur={formik.handleBlur} placeholder="Enter birth date" required />
            {formik.touched.birthDate && formik.errors.birthDate && (<span className="error">{formik.errors.birthDate}</span>)}
          </div>
        </div>
        <div className="gender-box">
          <h3>Gender</h3>
          <div className="gender-option">
            <div className="gender">
              <input type="radio" id="check-male" name="gender" value="male" checked={formik.values.gender === 'male'} onChange={formik.handleChange} />
              <label htmlFor="check-male">male</label>
            </div>
            <div className="gender">
              <input type="radio" id="check-female" name="gender" value="female" checked={formik.values.gender === 'female'} onChange={formik.handleChange} />
              <label htmlFor="check-female">Female</label>
            </div>
            <div className="gender">
              <input type="radio" id="check-other" name="gender" value="prefer-not-to-say" checked={formik.values.gender === 'prefer-not-to-say'} onChange={formik.handleChange} />
              <label htmlFor="check-other">prefer not to say</label>
            </div>
          </div>
        </div>
        <div className="input-box address">
          <label>Address</label>
          <input type="text" value={formik.values.address} name='address' onChange={formik.handleChange} onBlur={formik.handleBlur} placeholder="Enter street address" required />
          {formik.touched.address && formik.errors.address && (<span className="error">{formik.errors.address}</span>)}
          <div className="column">
            <div className="select-box">
              <select>
                <option hidden>Country</option>
                <option>America</option>
                <option>Japan</option>
                <option>India</option>
                <option>Nepal</option>
              </select>
            </div>
            <input type="text" value={formik.values.city} name='city' onChange={formik.handleChange} onBlur={formik.handleBlur} placeholder="Enter your city" required />
            {formik.touched.city && formik.errors.city && (<span className="error">{formik.errors.city}</span>)}
          </div>
          <div className="column">
            <input type="text" value={formik.values.region} name='region' onChange={formik.handleChange} onBlur={formik.handleBlur} placeholder="Enter your region" required />
            {formik.touched.region && formik.errors.region && (<span className="error">{formik.errors.region}</span>)}
            <input type="text" value={formik.values.postalCode} name='postalCode' onChange={formik.handleChange} onBlur={formik.handleBlur} placeholder="Enter postal code" required />
            {formik.touched.postalCode && formik.errors.postalCode && (<span className="error">{formik.errors.postalCode}</span>)}
          </div>
        </div>
        <button type='submit'>Submit</button>
      </form>
      <span className='toggle'><Link to='/login'>Already have an account?</Link></span>
    </section>
  )
}

export default Register

//create make username and password tab or send user name and password through email 
