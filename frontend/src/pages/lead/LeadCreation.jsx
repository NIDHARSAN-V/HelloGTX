import React from 'react'
import { useLocation } from 'react-router-dom';

function LeadCreation({ customer: propCustomer }) {
  const location = useLocation();
  
  const customer = propCustomer || location.state;

  const DataView = function() {
    if (!customer) {
      console.log("User Not found");

    
      return;
    }
    console.log(customer);
  }

  return (
    <div>
      <button onClick={DataView}>click</button>
    </div>
  )
}

export default LeadCreation