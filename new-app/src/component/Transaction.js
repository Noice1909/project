import React, {useState} from 'react';
import './Transaction.css';
import Method from './Method.js'
const Transaction = () => {
    const [selectedTransaction, setSelectedTransaction] = useState(null);

    const handleTransactionChange = (event) => {
      setSelectedTransaction(event.target.value);
    };
    
  
    return (
      <div className="trans-div">
        <h1>Transaction Methods</h1>
        <div className="transaction-options">
          <label><input type="radio" value="rtgs" checked={selectedTransaction === 'rtgs'} onChange={handleTransactionChange}/>RTGS</label>
          <label><input type="radio" value="neft" checked={selectedTransaction === 'neft'} onChange={handleTransactionChange}/>NEFT</label>
          <label><input type="radio" value="imps" checked={selectedTransaction === 'imps'} onChange={handleTransactionChange}/>IMPS</label>
          <label><input type="radio" value="withdrawal" checked={selectedTransaction === 'withdrawal'} onChange={handleTransactionChange}/>WITHDRAWAL</label>
        </div>
        {selectedTransaction && <Method transactionType={selectedTransaction} />}
      </div>
    );
}

export default Transaction