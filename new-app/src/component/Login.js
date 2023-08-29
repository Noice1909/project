import React from 'react'
import './Register.css'
import { Link } from 'react-router-dom'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useUserAuth } from './UserAuthContext';
const Login = () => {
  const { setUserAuthData } = useUserAuth(); // Access the setUserAuthData function from the context
  const navigate = useNavigate();

  const loginUser = async (credentials) => {
    try {
      const response = await axios.post('http://localhost:8080/api/user/user-auth-login', credentials);
      return response;
    } catch (error) {
      console.error('Error during login:', error);
      throw error;
    }
  };
  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    validationSchema: Yup.object({
      username: Yup.string().required('Username is required'),
      password: Yup.string().required('Password is required'),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const response = await loginUser(values);

        if (response.data.success) {
          // Authentication successful, redirect to dashboard
          // console.log('Authentication successful');
          // console.log(response.data.userAuthData)
          const response1 = await axios.post('http://localhost:8080/auth/login',values)
          // console.log("response1 : ",response1.data.jwtToken)
          localStorage.setItem("jwtToken",response1.data.jwtToken)
          setUserAuthData(response.data.userAuthData);
          localStorage.setItem('userAuthData', JSON.stringify(response.data.userAuthData));
          console.log(response.data.userAuthData,"here")
          if(response.data.userAuthData?.customer?.role==="admin"){
            navigate('/option')
          }
          else{
            navigate('/dashboard');
          }
        } else {
          // Authentication failed, show error message
          const error = response.data.message;
          console.log(error)
          navigate(`/error?message=${encodeURIComponent(error)}`);
        }
      } catch (error) {
        
        console.error('Error during authentication:', error);
        navigate(`/error?message=${encodeURIComponent('An error occurred during login. Please try again later.')}`);
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <>
      <section className="container">
          <header>Login</header>
                <form onSubmit={formik.handleSubmit} className="form">
        <div className="input-box">
          <label>User Name</label>
          <input type="text" name='username' value={formik.values.username} onChange={formik.handleChange} onBlur={formik.handleBlur} placeholder="Enter full name" required />
          {formik.touched.username && formik.errors.username && (<span className='error'>{formik.errors.username}</span>)}
        </div>
        <div className="input-box">
          <label>Password</label>
          <input type="password" name='password' value={formik.values.password} onChange={formik.handleChange} onBlur={formik.handleBlur} placeholder="Enter Password" required autoComplete='password' />
          {formik.touched.password && formik.errors.password && (<span className='error'>{formik.errors.password}</span>)}
        </div>
        <button type='submit'>Login</button>
      </form>
      <span className='toggle'><Link to='/register'>New customer?</Link></span>
    </section>
    </>
  );
};

export default Login