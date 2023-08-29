import React, { useState } from 'react';
import { Formik, Field, ErrorMessage, Form } from 'formik';
import * as Yup from 'yup';
import Success from './Success';
import axios from 'axios';

const validationSchema = Yup.object().shape({
    name: Yup.string()
      .matches(/^[A-Za-z\s]+$/, 'Name can only contain alphabetical characters')
      .required('Name is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    message: Yup.string().required('Message is required'),
  });
  

const ContactUs = () => {
  const jwtToken = localStorage.getItem('jwtToken')
  const config = {
    headers: {
      Authorization: `Bearer ${jwtToken}`,
    },
  };
  const [formStatus, setFormStatus] = React.useState('Send');
    const [status,setStatus] = useState(false)
  const formHandler = async (values, actions) => {
    try {
      const response = await axios.post("http://localhost:8080/api/contact-us/contact",values,config)
      if(response.data.success){
        setStatus(true)
      }
      setTimeout(() => {
        setFormStatus('Success');
        actions.setSubmitting(false);
      }, 1500);
    } catch (error) {
      actions.setSubmitting(false);
      console.error(error);
    }
  };

  return (
    <>
    {!status ? <>({formStatus === 'Send' ? (
        <section className="container">
          <header>Contact Us</header>
          <Formik
            initialValues={{ name: '', email: '', message: '' }}
            validationSchema={validationSchema}
            onSubmit={formHandler}
          >
            <Form className="form">
              <div className="input-box">
                <label>Name</label>
                <Field type="text" name="name" placeholder="Enter Name" />
                <ErrorMessage name="name" component="div" className="error" />
              </div>
              <div className="input-box">
                <label>Email</label>
                <Field type="email" name="email" placeholder="Email" />
                <ErrorMessage name="email" component="div" className="error" />
              </div>
              <div className="input-box">
                <label>Message</label>
                <Field as="textarea" name="message" placeholder="Write your message for us." />
                <ErrorMessage name="message" component="div" className="error" />
              </div>
              <button type="submit" disabled={formStatus === 'Submitting...'}>
                {formStatus}
              </button>
            </Form>
          </Formik>
        </section>
      ) : (
        <Success />
      )})</> : (<Success show={true} message="Thank you for contacting us.Our team will contact you." navigateTo="/" buttonMessage="Home"/>)}
    </>
  );
};

export default ContactUs;
