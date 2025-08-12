import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import axios from "axios";

import { createNewLead } from "../../Store/Lead";

function LeadCreation({ customer: propCustomer }) {
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);

  const customer = propCustomer || location.state;

  const [leadStatus, setLeadStatus] = useState("new");
  const [leadSource, setLeadSource] = useState("");

  const dispatch = useDispatch();

  const CreateLead = async () => {
    if (!customer || !user) {
      console.error("Missing customer or user");
      return;
    }

    try {
      const payload = {
        assignedTo: user.employeeId,
        assignedFor: customer.customer._id,
        status: leadStatus,
        source: leadSource,
      };

      // console.log("Data in lead creation" , payload)

      // const { data } = await axios.post("/api/leads", payload, {
      //   withCredentials: true,
      // });
      // console.log("Lead created:", data);

      dispatch(createNewLead(payload)).then((data) , function()
    {
      console.log(data)
    })

      
    } catch (error) {
      console.error("Error creating lead:", error.response?.data || error.message);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white shadow-lg rounded-xl border border-gray-200">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Create New Lead</h2>

      {/* Status Selector */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-600 mb-1">
          Lead Status
        </label>
        <select
          value={leadStatus}
          onChange={(e) => setLeadStatus(e.target.value)}
          className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 text-sm p-2"
        >
          <option value="new">New</option>
          <option value="contacted">Contacted</option>
          <option value="proposal_sent">Proposal Sent</option>
          <option value="follow_up">Follow Up</option>
          <option value="negotiation">Negotiation</option>
          <option value="converted">Converted</option>
          <option value="lost">Lost</option>
          <option value="not_interested">Not Interested</option>
        </select>
      </div>

      {/* Source Selector */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-600 mb-1">
          Lead Source
        </label>
        <select
          value={leadSource}
          onChange={(e) => setLeadSource(e.target.value)}
          className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 text-sm p-2"
        >
          <option value="">-- Select Source --</option>
          <option value="website_form">Website Form</option>
          <option value="whatsapp">WhatsApp</option>
          <option value="phone_call">Phone Call</option>
          <option value="walk_in">Walk In</option>
          <option value="referral">Referral</option>
          <option value="social_media">Social Media</option>
          <option value="email_campaign">Email Campaign</option>
          <option value="other">Other</option>
        </select>
      </div>

      {/* Submit Button */}
      <button
        onClick={CreateLead}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition"
      >
        Create Lead
      </button>
    </div>
  );
}

export default LeadCreation;
