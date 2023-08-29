import React, { useState, useEffect } from 'react';
import moment from 'moment';
import './HomePage.css'; 

function HomePage() {
  const [currentDateTime, setCurrentDateTime] = useState({
    time: moment().format('LT'),
    date: moment().format('LL'),
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDateTime({
        time: moment().format('LT'),
        date: moment().format('LL'),
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <div className="home-container">
      <div >
        <div className="top">
            <div className="time-date-display">
          <div className="time">{currentDateTime.time}</div>
          <div className="date">{currentDateTime.date}</div>
        </div>
        </div>
      </div>
      </div>
    </>
  );
}

export default HomePage;
