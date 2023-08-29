import React, { useContext, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import CustomerContext from './CustomerContext.js';
import Success from './Success.js';
import { useNavigate } from 'react-router-dom';
const UserNamePassword = () => {
    const { createdCustomer } = useContext(CustomerContext);
    const [done,setDone] = useState(false);
    const [usernameError, setUsernameError] = useState('');
    const navigate = useNavigate();
    // console.log(createdCustomer,"createdCustomer");
    const formik = useFormik({
        initialValues: {
            username: '',
            password: '',
            confirmPassword:'',
        },
        validationSchema: Yup.object({
            username: Yup.string().required('Username is required'),
            password: Yup.string().required('Password is required').matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, 'Password must be 8 character long having at least one uppercase,lowercase and special characters'),
            confirmPassword: Yup.string().oneOf([Yup.ref('password'), null], 'Passwords must match').required('Confirm Password is required'),
        }),
        onSubmit: async (values, { setSubmitting }) => {
            try {
                // const userNameCheck = await axios.post(`http://localhost:8080/api/v1/user-auth/username-check?username=${values.username}`)
                // if(userNameCheck){
                //     console.error('Username already exists:');
                //     formik.setFieldError('username', 'Username already exists');
                // }
                const response = await axios.post('http://localhost:8080/api/user/user-auth', {
                    username: values.username,
                    password: values.password,
                    customer: createdCustomer, // Include the customer data from context
                });
                if (response.data.success) {
                    // UserAuth created successfully
                    const newUser = {
                        username: values.username,
                        password: values.password,
                        customerId: createdCustomer.customerId
                    }
                    const response1 = await axios.post('http://localhost:8080/auth/create-user',newUser)
                    console.log(response1)
                    console.log('UserAuth created successfully');
                    setDone(true);
                } else {
                    // UserAuth creation failed, show error message
                    console.error('UserAuth creation failed:', response.data.message);
                    const error = response.data.message;
                    const show = true;
                    const navigateTo = '/register';
                    const buttonMessage = 'Register';
                    navigate(`/error?error=${encodeURIComponent(error)}&show=${show}&navigateTo=${encodeURIComponent(navigateTo)}&buttonMessage=${encodeURIComponent(buttonMessage)}`);
                }
            } catch (error) {
                console.error('Error creating UserAuth:', error.response.data);
                if(error.response.data.username){
                    setUsernameError('Username is already taken. Please choose another one.');
                }
            } finally {
                setSubmitting(false);
            }
        },
    });

    return (
        <>
        {!done ? (
        <section className="container">
            <header>Create Username and Password</header>
            <form onSubmit={formik.handleSubmit} className="form">
                <div className="input-box">
                    <label>User Name</label>
                    <input type="text" name="username" value={formik.values.username} onChange={formik.handleChange} onBlur={formik.handleBlur} placeholder="Enter username" required/>
                    {formik.touched.username && formik.errors.username && (<span className="error">{formik.errors.username}</span>)}
                    {usernameError && <span>{usernameError}</span>}
                </div>
                <div className="input-box">
                    <label>Password</label>
                    <input type="password" name="password" value={formik.values.password} onChange={formik.handleChange} onBlur={formik.handleBlur} placeholder="Enter password" required autoComplete='new-password' />
                    {formik.touched.password && formik.errors.password && (<span className="error">{formik.errors.password}</span>)}
                </div>
                <div className="input-box">
                    <label>Confirm Password</label>
                    <input type="password" name="confirmPassword" value={formik.values.confirmPassword} onChange={formik.handleChange} onBlur={formik.handleBlur} placeholder="Confirm password" required/>
                    {formik.touched.confirmPassword && formik.errors.confirmPassword && (<span className="error">{formik.errors.confirmPassword}</span>)}
                </div>
                <button type="submit">Create</button>
            </form>
        </section>)  : <Success show={true} message="Username and Password Created successfully!" navigateTo="/login" buttonMessage="Login" /> }
        </>
    );
};

export default UserNamePassword;
