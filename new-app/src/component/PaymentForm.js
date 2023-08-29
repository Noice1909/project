import React from 'react';
import Cards from 'react-credit-cards-2';
import 'react-credit-cards-2/dist/es/styles-compiled.css';
import "./PaymentForm.css"

const PaymentForm = () => {
  const state = {
    number: '1234123412341234',
    expiry: '09-2028',
    cvc: '232',
    name: 'OM PARMAR',
    focus: '',
  }
  const cardStyle = {
    width: '150px',            
    height: 'calc(150px * 1.5858)',  
  };
  return (
    <div style={cardStyle}>
      <Cards
        number={state.number}
        expiry={state.expiry}
        cvc={state.cvc}
        name={state.name}
        focused={state.focus}
      />
    </div>
  );
}

export default PaymentForm;