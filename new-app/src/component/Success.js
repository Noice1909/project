import React from 'react';
import './Success.css'; // You can define your own styles for this page
import chekedmark from './assets/checked.png'
import { Link } from 'react-router-dom';
const Success = (props) => {
  const {message,show,navigateTo,buttonMessage} = props;
  return (
    <>
    <div className='popup' id='success'>
      <div className='popup-content'>
        <div className='imgbox'>
          <img src={chekedmark} alt='checkedmark' className='img'/>
        </div>
        <div className='title'>
          <h3>Success!</h3>
        </div>
        <p className='para'>{message} </p>
        {show ? (<Link className='button' id="s_button" to={navigateTo}>{buttonMessage}</Link>) : null}
      </div>
    </div>
    </>
  );
};

export default Success;
