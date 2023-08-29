import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useUserAuth } from './UserAuthContext';
import Success from './Success';
import PageNotFound from './PageNotFound';
const UpdateUserDetails = (props) => {
    var { userAuthData } = useUserAuth();
    userAuthData = JSON.parse(localStorage.getItem('userAuthData'));
    const [details, setDetails] = useState({
        fullName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        postalCode: '',
        region: '',
    });
    const [validationErrors, setValidationErrors] = useState({});
    const jwtToken = localStorage.getItem('jwtToken')
    const config = {
        headers: {
        Authorization: `Bearer ${jwtToken}`,
        },
    };
    useEffect(() => {
        axios.get(`http://localhost:8080/api/customer/customers/${userAuthData?.customer?.customerId}`,config)
            .then(response => {
                const userDetailsFromAPI = response?.data;
                setDetails({
                    fullName: userDetailsFromAPI.fullName,
                    email: userDetailsFromAPI.email,
                    phone: userDetailsFromAPI.phone,
                    address: userDetailsFromAPI.address,
                    city: userDetailsFromAPI.city,
                    postalCode: userDetailsFromAPI.postalCode,
                    region: userDetailsFromAPI.region,
                });
            })
            .catch(error => console.log(error));
    }, [userAuthData?.customer?.customerId]);
    console.log(details)
    const handleChange = (e) => {
        const { name, value } = e.target;
        setDetails(prevDetails => ({
            ...prevDetails,
            [name]: value
        }));
    }

    const validateForm = () => {
        const errors = {};
    
        if (!details.fullName) {
          errors.fullName = 'Full Name is required';
        }
    
        if (!details.email) {
          errors.email = 'Email is required';
        } else if (!/^\S+@\S+\.\S+$/.test(details.email)) {
          errors.email = 'Invalid email format';
        }
    
        if (!details.phone) {
          errors.phone = 'Phone Number is required';
        } else if (!/^[0-9]{10}$/.test(details.phone)) {
          errors.phone = 'Invalid phone number';
        }
    
        setValidationErrors(errors);
        return Object.keys(errors).length === 0; // Return true if there are no errors
      };
    const handleSubmit = async (e) => {
        e.preventDefault();

        if(!validateForm()){
            return
        }
        try {
            await axios.put(`http://localhost:8080/api/customer/customers/${userAuthData?.customer?.customerId}`, details,config);
            setShowStatus(true);
            console.log("Details updated successfully!");
        } catch (error) {
            console.error("Error updating details:", error);
        }
    }
    const [showstatus, setShowStatus] = useState(false);

    if(useUserAuth === undefined || useUserAuth == null){
        return(
          <>
            <PageNotFound errorMessage="Its seem you are not logged in please login." show={true} navigateTo="/login" buttonMessage="Login"/>
          </>
        )
      }
    return (
        <>
            {!showstatus ? (
                <section className="container">
                    <header>Update Form</header>
                    <form className="form">
                        <div className="input-box">
                            <label>Full Name</label>
                            <input type="text" name='fullName' value={details.fullName} onChange={handleChange} required />
                            {validationErrors.fullName && (<div className="error-message">{validationErrors.fullName}</div>)}
                        </div>
                        <div className="input-box">
                            <label>Email Address</label>
                            <input type="text" name='email' value={details.email} onChange={handleChange} required />
                            {validationErrors.email && (<div className="error-message">{validationErrors.email}</div>)}
                        </div>
                        <div className="column">
                            <div className="input-box">
                                <label>Phone Number</label>
                                <input type="text" name='phone' value={details.phone} onChange={handleChange} required />
                                {validationErrors.phone && (<div className="error-message">{validationErrors.phone}</div>)}
                            </div>
                        </div>
                        <div className="input-box address">
                            <label>Address</label>
                            <input type="text" value={details.address} name='address' placeholder="Enter address" onChange={handleChange} required/>
                        </div>
                        <button type='submit' onClick={handleSubmit}>Submit</button>
                    </form>
                </section>
            ) : (<Success show={true} message="User Details Updated Successfully" navigateTo="/dashboard" buttonMessage="Dashboard"/>)}
        </>
    )
}

export default UpdateUserDetails;
