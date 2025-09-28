import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { createNewLead, getLeadfromEmployee } from "../../Store/Lead";
import axios from "axios";

function LeadCreation({ customer: propCustomer }) {
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);
  const customer = propCustomer || location.state;
  
  const [leadStatus, setLeadStatus] = useState("new");
  const [leadSource, setLeadSource] = useState("");
  const [leads, setLeads] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [loadingLeads, setLoadingLeads] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("desc");
  const [followUps, setFollowUps] = useState([]);


const priorityStyles = {
  high: "bg-red-100 text-red-700",
  medium: "bg-yellow-100 text-yellow-700",
  low: "bg-green-100 text-green-700",
};


  
  const dispatch = useDispatch();
  const navigate  = useNavigate();

  const fetchLeads = async () => {
    if (!user?.employeeId) return;
    setLoadingLeads(true);
    try {
      const result = await dispatch(getLeadfromEmployee(user.employeeId));
      const fetchedLeads = result.payload?.leads || [];
      setLeads(fetchedLeads);
      setFilteredLeads(fetchedLeads);
    } catch (error) {
      setLeads([]);
      setFilteredLeads([]);
      console.error("Error fetching leads:", error);
    }
    setLoadingLeads(false);
  };



// useEffect(() => {
//     console.log(user?.employeeId , "***Employee ID in LeadCreation***");
//     const response = axios.get(`http://localhost:8000/api/followup/employee/${user?.employeeId}/followups/pending`);

//   }, [user?.employeeId]);
  

  useEffect(() => {
    fetchLeads();
    // eslint-disable-next-line
     axios
    .get(`http://localhost:8000/api/followup/employee/${user?.employeeId}/followups/pending`)
    .then((response) => {
      console.log(response.data, "***Pending FollowUps***");
      setFollowUps(response.data);
    })
    .catch((error) => {
      console.error("Error fetching follow-ups:", error);
    });
  }, [user?.employeeId]);







  // Search and sort leads
  useEffect(() => {
    let results = [...leads];
    
    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      results = results.filter(lead => 
        (lead.firstName + ' ' + lead.lastName).toLowerCase().includes(term) ||
        lead.email.toLowerCase().includes(term)
      );
    }
    
    // Apply sorting
    results.sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });
    
    setFilteredLeads(results);
  }, [searchTerm, sortOrder, leads]);

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

      await dispatch(createNewLead(payload));
      fetchLeads();
    } catch (error) {
      console.error("Error creating lead:", error);
    }
  };

  const handleLeadClick = (lead) => {
    setSelectedLead(lead);
    setIsDetailOpen(true);
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const toggleSortOrder = () => {
    setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
  };
  const [filter, setFilter] = useState("all");

 const filteredFollowUps =
    filter === "all"
      ? followUps
      : followUps.filter(
          (item) =>
            item.followUpDetails?.priority?.toLowerCase() === filter.toLowerCase()
        );



  return (
    <div className="container mx-auto p-4 ">
      <div className="flex flex-col lg:flex-col justify-center align-center  gap-8">
        {/* Lead Creation Form */}
        <div className="w-full lg:w-1/3 bg-white p-6 rounded-xl shadow-md border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Create New Lead</h2>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Lead Status
            </label>
            <select
              value={leadStatus}
              onChange={(e) => setLeadStatus(e.target.value)}
              className="w-full border border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 text-sm p-2"
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

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Lead Source
            </label>
            <select
              value={leadSource}
              onChange={(e) => setLeadSource(e.target.value)}
              className="w-full border border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 text-sm p-2"
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

          <button
            onClick={CreateLead}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition"
          >
            Create Lead
          </button>
        </div>



     <div className="w-full px-6 py-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Title */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-gray-800 mb-4 md:mb-0">📋 ToDo List</h2>

          {/* Filters */}
          <div className="flex gap-2">
            {["all", "high", "medium", "low"].map((p) => (
              <button
                key={p}
                onClick={() => setFilter(p)}
                className={`px-4 py-2 rounded-full text-sm font-medium capitalize transition duration-200 ${
                  filter === p
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-800 hover:bg-blue-100"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFollowUps.length === 0 ? (
            <div className="col-span-full text-center text-gray-500 mt-10">
              No follow-ups found for this priority.
            </div>
          ) : (
            filteredFollowUps.map((item) => (
              <div
                key={item._id}
                className="p-6 bg-white rounded-lg border border-gray-200 shadow-md hover:shadow-lg transition transform hover:scale-[1.01]"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-gray-800 capitalize">
                    {item.type.replace("_", " ")}
                  </h3>
                  <span
                    className={`text-xs px-3 py-1 rounded-full font-medium ${
                      priorityStyles[item.followUpDetails?.priority] || "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {item.followUpDetails?.priority || "N/A"}
                  </span>
                </div>

                <div className="space-y-1 text-sm text-gray-700">
                  <p>
                    <span className="font-semibold text-gray-800">Summary:</span>{" "}
                    {item.summary}
                  </p>
                  <p>
                    <span className="font-semibold text-gray-800">Sentiment:</span>{" "}
                    <span className="capitalize">{item.sentiment}</span>
                  </p>
                  <p>
                    <span className="font-semibold text-gray-800">Scheduled At:</span>{" "}
                    {new Date(item.followUpDetails?.scheduledAt).toLocaleString()}
                  </p>
                  <p>
                    <span className="font-semibold text-gray-800">Notes:</span>{" "}
                    {item.followUpDetails?.notes}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>


        {/* Leads List */}
        <div className="w-full lg:w-2/3">
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
              <h3 className="text-lg font-semibold">Leads Under You</h3>
              
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                {/* Search Input */}
                <div className="relative w-full sm:w-64">
                  <input
                    type="text"
                    placeholder="Search by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm"
                  />
                  <div className="absolute left-3 top-2.5 text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
                
                {/* Sort Button */}
                <button
                  onClick={toggleSortOrder}
                  className="flex items-center gap-1 px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 whitespace-nowrap"
                >
                  <span>Date {sortOrder === 'asc' ? '↑' : '↓'}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                  </svg>
                </button>
              </div>
            </div>

            {loadingLeads ? (
              <div className="flex justify-center items-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : filteredLeads.length === 0 ? (
              <div className="text-gray-500 text-center py-8">
                {searchTerm ? "No matching leads found." : "No leads found."}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <button 
                          onClick={toggleSortOrder}
                          className="flex items-center gap-1 hover:text-gray-700"
                        >
                          Created
                          {sortOrder === 'asc' ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                            </svg>
                          ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          )}
                        </button>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredLeads.map((lead) => (
                      <tr 
                        key={lead._id} 
                        onClick={() => handleLeadClick(lead)}
                        className="hover:bg-gray-50 cursor-pointer transition"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="ml-0">
                              <div className="text-sm font-medium text-gray-900">
                                {lead.firstName} {lead.lastName}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {lead.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {lead.phone}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${lead.status === 'new' ? 'bg-blue-100 text-blue-800' : 
                              lead.status === 'converted' ? 'bg-green-100 text-green-800' :
                              lead.status === 'lost' ? 'bg-red-100 text-red-800' :
                              'bg-yellow-100 text-yellow-800'}`}>
                            {lead.status.replace(/_/g, ' ')}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(lead.createdAt)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>





      {/* Lead Detail Modal - Remains the same as before */}
      {isDetailOpen && selectedLead && (

        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start">
                <h2 className="text-2xl font-bold text-gray-800">

                  <h1>
                    {selectedLead._id}
                  </h1>

                  
                  {selectedLead.firstName} {selectedLead.lastName}
                </h2>
                <button 
                  onClick={() => setIsDetailOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Info */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-700 mb-3">Basic Information</h3>
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm text-gray-500">Email:</span>
                      <p className="text-gray-800">{selectedLead.email}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Phone:</span>
                      <p className="text-gray-800">{selectedLead.phone}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Status:</span>
                      <p className="text-gray-800 capitalize">{selectedLead.status.replace(/_/g, ' ')}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Source:</span>
                      <p className="text-gray-800 capitalize">{selectedLead.source.replace(/_/g, ' ')}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Created:</span>
                      <p className="text-gray-800">{formatDate(selectedLead.createdAt)}</p>
                    </div>
                  </div>
                </div>

                {/* Travel Info */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-700 mb-3">Travel Information</h3>
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm text-gray-500">Trip Type:</span>
                      <p className="text-gray-800 capitalize">{selectedLead.tripType.replace(/_/g, ' ') || 'Not specified'}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Travelers:</span>
                      <p className="text-gray-800">
                        {selectedLead.travelers?.adults || 0} Adults, 
                        {selectedLead.travelers?.children || 0} Children, 
                        {selectedLead.travelers?.infants || 0} Infants
                      </p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Budget:</span>
                      <p className="text-gray-800">
                        {selectedLead.budget?.amount 
                          ? `${selectedLead.budget.amount} ${selectedLead.budget.currency || ''}`
                          : 'Not specified'}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Flexible Dates:</span>
                      <p className="text-gray-800">{selectedLead.travelDates?.flexible ? 'Yes' : 'No'}</p>
                    </div>
                  </div>
                </div>

                {/* Additional Sections */}
                {selectedLead.destinations?.length > 0 && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium text-gray-700 mb-3">Destinations</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      {selectedLead.destinations.map((dest, index) => (
                        <li key={index} className="text-gray-800">{dest}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {selectedLead.notes?.length > 0 && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium text-gray-700 mb-3">Notes</h3>
                    <ul className="space-y-2">
                      {selectedLead.notes.map((note, index) => (
                        <li key={index} className="text-gray-800">{note}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex justify-end space-x-3">
                <button className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
                  Edit
                </button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                  Update Status
                </button>


                <button onClick={() => navigate('/lead/dashboard', { state: { leadId: selectedLead._id  , customer : customer}})}>
                  Go to Dashboard
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}





export default LeadCreation;