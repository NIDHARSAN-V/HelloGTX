import React from 'react'
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';

function LeadCreation({ customer: propCustomer }) {
  const location = useLocation();
  const {user} = useSelector((state) => state.auth)
  
  const customer = propCustomer || location.state;

  const DataView = function() {
    if (!customer) {
      console.log("User Not found");

    
      return;
    }
    console.log(customer , "Customer");
    console.log(user , "Employee") 


    //send a function call to create a lead mapped with the   employee and customer

    //create
    //get all
    //get by filters
    //delete 
    //update

  }

  return (
    <div>
      <button onClick={DataView}>click</button>
    </div>
  )
}

export default LeadCreation