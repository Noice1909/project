import React, {useState,useEffect} from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useUserAuth } from './UserAuthContext';
import axios from 'axios';
import './Withdrawal.css'
import PageNotFound from './PageNotFound';
const validationSchema = Yup.object().shape({
  account: Yup.string().required('Please select an account'),
  amount: Yup.number()
    .required('Amount is required')
    .positive('Amount must be positive')
    .integer('Amount must be an integer')
    .moreThan(0, 'Amount must be greater than 0'),
  password: Yup.string().required('Password is required'),
});
const jwtToken = localStorage.getItem('jwtToken')
  const config = {
    headers: {
      Authorization: `Bearer ${jwtToken}`,
    },
  };
const Withdrawal = () => {
    const [show,setShow] = useState(false)
    const[success,setSuccess] =useState(false)
    const [fail,setFail] =useState(false)
    const [accounts, setAccounts] = useState([]);
    const { userAuthData } = useUserAuth();
    const [refNumber,setRefNumber] = useState('')
    const [message,setMessage] = useState("")
  

    useEffect(() => {
        const fetchAccountDetails = async () => {
          try {
            const response = await axios.get(
              `http://localhost:8080/api/account/by-customer/${userAuthData?.customer?.customerId}`,config
            );
            setAccounts(response.data);
          } catch (error) {
            console.error('Error fetching account details:', error);
          }
        };
    
        fetchAccountDetails();
      }, [userAuthData?.customer?.customerId]);
    
      const handleSubmit = async (values) => {
        try {
          
            const selectedAccount = accounts.find(account => account.accountId === parseInt(values.account));
            const account = selectedAccount;

            const withdrawalData = {
                account: account,
                customer: account.customer,
                withdrawalAmount: values.amount.toString()
            };
      
          // Make the Axios POST request
          const params = {
            password: values.password
          };
          const headers = {
            'Authorization': `Bearer ${jwtToken}`,
            'Content-Type': 'application/json'
          };
          const response = await axios.post('http://localhost:8080/api/withdraw/request', withdrawalData, {headers,params});
      
          if (response.data.success) {
            // Show Success page if the response is successful
            console.log('Withdrawal successful:', response.data);
            setMessage(response.data.message)
            setRefNumber(response.data.referenceNumber)
            setSuccess(true);
            setFail(false);
            setShow(true);
      
          } else {
            // Show PageNotFound page if the response is not successful
            console.log('Withdrawal failed:', response.data.message);
            setMessage(response.data.message)
            setSuccess(false);
            setFail(true);
            setShow(true);
      
          }
        } catch (error) {
          console.error('Error during withdrawal:', error);
            setMessage(error.data.message)
            setSuccess(false);
            setFail(true);
            setShow(true);
        }
      };

      if(useUserAuth === undefined || useUserAuth == null){
        return(
          <>
            <PageNotFound errorMessage="Its seem you are not logged in please login."></PageNotFound>
          </>
        )
      }
  return (
    <>
    {!show ? (<div className='withdrawal-container'>
    <Formik
      initialValues={{
        account: '',
        amount: '',
        password: '',
      }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      <Form className="form">
        <h2 style={{textAlign: "center"}}>Withdrawal Form</h2>
        <div className='input-box'>
          <label>Select Account:</label>
          <Field name="account" as="select" className="withdrawal-select">
            <option value="">Select Account</option>
            {accounts
              .filter((account) => account.status === 'active') // Filter active accounts
              .map((account) => (
                <option key={account.accountId} value={account.accountId}>
                  {account.accountId}
                </option>
              ))}
          </Field>
          <span><ErrorMessage name="account" component="div" className="error-message" /></span>
        </div>
        <div className='input-box'>
          <label>Amount:</label>
          <Field type="number" name="amount"className="input-box" />
          <span><ErrorMessage name="amount" component="div" className="error-message" /></span>
        </div>
        <div className='input-box'>
          <label>Password:</label>
          <Field type="password" name="password" className="input-box"/>
          <span><ErrorMessage name="password" component="div" className="error-message" /></span>
        </div>
        <button type="submit">Withdraw Now</button>
      </Form>
    </Formik>
    </div>) : (<div className='message-container'>
          {success && <p className='success-message'>Withdrawal successful! This is your reference number: <span className='success-span'>{refNumber}</span></p>}
          {fail && <p className='error-message'>{message || "Withdrawal failed. Please try again."}</p>}
        </div>)}
    
    </>
  );
};

export default Withdrawal;  