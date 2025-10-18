import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { checkCustomerByEmail, createNewLead, getLeadfromEmployee } from "../../Store/Lead";
import axios from "axios";

function LeadCreation({ }) {
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);
  // const customer = propCustomer || location.state
  const [customer, setCustomerData] = useState(null);



  
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
  const [filter, setFilter] = useState("all");
  const [isCreatingLead, setIsCreatingLead] = useState(false);
  // const customerData = useState(null);


  const priorityStyles = {
    high: "bg-red-100 text-red-700 border border-red-200",
    medium: "bg-yellow-100 text-yellow-700 border border-yellow-200",
    low: "bg-green-100 text-green-700 border border-green-200",
  };

  const statusStyles = {
    new: "bg-blue-100 text-blue-800 border border-blue-200",
    contacted: "bg-purple-100 text-purple-800 border border-purple-200",
    proposal_sent: "bg-indigo-100 text-indigo-800 border border-indigo-200",
    follow_up: "bg-amber-100 text-amber-800 border border-amber-200",
    negotiation: "bg-orange-100 text-orange-800 border border-orange-200",
    converted: "bg-green-100 text-green-800 border border-green-200",
    lost: "bg-red-100 text-red-800 border border-red-200",
    not_interested: "bg-gray-100 text-gray-800 border border-gray-200",
  };
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

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

  useEffect(() => {
    fetchLeads();
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
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      results = results.filter(lead => 
        (lead.firstName + ' ' + lead.lastName).toLowerCase().includes(term) ||
        lead.email.toLowerCase().includes(term)
      );
    }
    
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

    setIsCreatingLead(true);
    try {
      const payload = {
        assignedTo: user.employeeId,
        assignedFor: customer.customer._id,
        status: leadStatus,
        source: leadSource,
      };

      await dispatch(createNewLead(payload));
      await fetchLeads();
      
      // Reset form
      setLeadStatus("new");
      setLeadSource("");
    } catch (error) {
      console.error("Error creating lead:", error);
    } finally {
      setIsCreatingLead(false);
    }
  };



const handlecustomerdata = async (email) => {
  const res = await dispatch(checkCustomerByEmail({ email: email.toString() }));
  console.log("*-*-*-*-*-*-customer", res.payload);
  
  const customerData = res.payload?.customer;
  setCustomerData(customerData);

  return customerData; // ✅ return it for navigation
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

  const filteredFollowUps = filter === "all" 
    ? followUps 
    : followUps.filter(item => 
        item.followUpDetails?.priority?.toLowerCase() === filter.toLowerCase()
      );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Lead Creation Form */}
          <div className="w-full lg:w-1/3">
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Create New Lead</h2>
              </div>

              <div className="space-y-5">
                <div className="transform transition-all duration-200 hover:scale-[1.02]">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Lead Status
                  </label>
                  <select
                    value={leadStatus}
                    onChange={(e) => setLeadStatus(e.target.value)}
                    className="w-full border border-gray-300 rounded-xl shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 text-sm p-3 bg-white"
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

                <div className="transform transition-all duration-200 hover:scale-[1.02]">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Lead Source
                  </label>
                  <select
                    value={leadSource}
                    onChange={(e) => setLeadSource(e.target.value)}
                    className="w-full border border-gray-300 rounded-xl shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 text-sm p-3 bg-white"
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
                  disabled={isCreatingLead}
                  className={`w-full py-3 px-4 rounded-xl font-semibold text-white transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] ${
                    isCreatingLead 
                      ? 'bg-blue-400 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl'
                  }`}
                >
                  {isCreatingLead ? (
                    <div className="flex items-center justify-center">
                      <div className="w-5 h-5 border-t-2 border-white border-solid rounded-full animate-spin mr-2"></div>
                      Creating Lead...
                    </div>
                  ) : (
                    'Create Lead'
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="w-full lg:w-2/3 space-y-8">
            {/* ToDo List Section */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="p-6">
                <div className="flex flex-col md:flex-row items-center justify-between mb-6">
                  <div className="flex items-center mb-4 md:mb-0">
                    <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center mr-3">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800">📋 ToDo List</h2>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {["all", "high", "medium", "low"].map((p) => (
                      <button
                        key={p}
                        onClick={() => setFilter(p)}
                        className={`px-4 py-2 rounded-full text-sm font-medium capitalize transition-all duration-200 transform hover:scale-105 ${
                          filter === p
                            ? "bg-blue-600 text-white shadow-lg"
                            : "bg-gray-100 text-gray-700 hover:bg-blue-100 hover:text-blue-700"
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredFollowUps.length === 0 ? (
                    <div className="col-span-full text-center py-12">
                      <div className="text-gray-400 mb-4">
                        <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <p className="text-gray-500 text-lg">No follow-ups found</p>
                      <p className="text-gray-400 text-sm mt-1">for this priority filter</p>
                    </div>
                  ) : (
                    filteredFollowUps.map((item, index) => (
                      <div
                        key={item._id}
                        className="bg-gradient-to-br from-white to-gray-50 p-6 rounded-xl border border-gray-200 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
                        style={{
                          animationDelay: `${index * 100}ms`,
                          animation: 'slideInUp 0.5s ease-out forwards'
                        }}
                      >
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-semibold text-gray-800 capitalize">
                            {item.type.replace("_", " ")}
                          </h3>
                          <span
                            className={`text-xs px-3 py-1 rounded-full font-semibold ${
                              priorityStyles[item.followUpDetails?.priority] || "bg-gray-200 text-gray-600"
                            }`}
                          >
                            {item.followUpDetails?.priority || "N/A"}
                          </span>
                        </div>

                        <div className="space-y-3">
                          <div>
                            <span className="text-sm font-medium text-gray-600">Summary:</span>
                            <p className="text-gray-800 mt-1 line-clamp-2">{item.summary}</p>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-gray-600">Sentiment:</span>
                            <span className="capitalize px-2 py-1 bg-gray-100 rounded-lg text-xs">
                              {item.sentiment}
                            </span>
                          </div>
                          <div>
                            <span className="text-sm font-medium text-gray-600">Scheduled:</span>
                            <p className="text-gray-800 text-sm mt-1">
                              {new Date(item.followUpDetails?.scheduledAt).toLocaleString()}
                            </p>
                          </div>
                          {item.followUpDetails?.notes && (
                            <div>
                              <span className="text-sm font-medium text-gray-600">Notes:</span>
                              <p className="text-gray-800 text-sm mt-1 line-clamp-2">
                                {item.followUpDetails.notes}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Leads List Section */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="p-6">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center mr-3">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-800">Leads Under You</h3>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                    <div className="relative w-full sm:w-64">
                      <input
                        type="text"
                        placeholder="Search by name or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-all duration-200 bg-white"
                      />
                      <div className="absolute left-3 top-3.5 text-gray-400">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </div>
                    </div>
                    
                    <button
                      onClick={toggleSortOrder}
                      className="flex items-center gap-2 px-4 py-3 border border-gray-300 rounded-xl text-sm font-medium hover:bg-gray-50 transition-all duration-200 transform hover:scale-105 whitespace-nowrap"
                    >
                      <span>Date {sortOrder === 'asc' ? '↑' : '↓'}</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                      </svg>
                    </button>
                  </div>
                </div>

                {loadingLeads ? (
                  <div className="flex justify-center items-center py-16">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                  </div>
                ) : filteredLeads.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="text-gray-400 mb-4">
                      <svg className="w-20 h-20 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <h4 className="text-lg font-semibold text-gray-600 mb-2">
                      {searchTerm ? "No matching leads found" : "No leads found"}
                    </h4>
                    <p className="text-gray-500">
                      {searchTerm ? "Try adjusting your search terms" : "Start by creating your first lead"}
                    </p>
                  </div>
                ) : (
                  <div className="overflow-hidden rounded-lg border border-gray-200">
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Email</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Phone</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                              <button 
                                onClick={toggleSortOrder}
                                className="flex items-center gap-2 hover:text-gray-700 transition-colors duration-200"
                              >
                                Created
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                                </svg>
                              </button>
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {filteredLeads.map((lead, index) => (
                            <tr 
                              key={lead._id} 
                              onClick={() => handleLeadClick(lead)}
                              className="hover:bg-blue-50 cursor-pointer transition-all duration-200 transform hover:scale-[1.01]"
                              style={{
                                animationDelay: `${index * 50}ms`,
                                animation: 'fadeInUp 0.5s ease-out forwards'
                              }}
                            >
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm mr-3">
                                    {lead.firstName?.[0]}{lead.lastName?.[0]}
                                  </div>
                                  <div>
                                    <div className="text-sm font-semibold text-gray-900">
                                      {lead.firstName} {lead.lastName}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                {lead.email}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                {lead.phone}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                  statusStyles[lead.status] || 'bg-gray-100 text-gray-800'
                                }`}>
                                  {lead.status.replace(/_/g, ' ')}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                {formatDate(lead.createdAt)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lead Detail Modal */}
      {isDetailOpen && selectedLead && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-slideInUp">
            <div className="p-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-3xl font-bold text-gray-800 mb-2">
                    {selectedLead.firstName} {selectedLead.lastName}
                  </h2>
                  <p className="text-gray-600">Lead ID: {selectedLead._id}</p>
                </div>
                <button 
                  onClick={() => setIsDetailOpen(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors duration-200 transform hover:scale-110 p-2 rounded-lg hover:bg-gray-100"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Basic Info */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100">
                  <h3 className="font-semibold text-gray-700 mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Basic Information
                  </h3>
                  <div className="space-y-3">
                    {[
                      { label: 'Email', value: selectedLead.email },
                      { label: 'Phone', value: selectedLead.phone },
                      { label: 'Status', value: selectedLead.status.replace(/_/g, ' ') },
                      { label: 'Source', value: selectedLead.source.replace(/_/g, ' ') },
                      { label: 'Created', value: formatDate(selectedLead.createdAt) }
                    ].map((item, index) => (
                      <div key={index} className="flex justify-between items-center py-2 border-b border-blue-100 last:border-b-0">
                        <span className="text-sm font-medium text-gray-600">{item.label}:</span>
                        <span className="text-sm text-gray-800 font-medium">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Travel Info */}
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl border border-green-100">
                  <h3 className="font-semibold text-gray-700 mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Travel Information
                  </h3>
                  <div className="space-y-3">
                    {[
                      { label: 'Trip Type', value: selectedLead.tripType?.replace(/_/g, ' ') || 'Not specified' },
                      { label: 'Travelers', value: `${selectedLead.travelers?.adults || 0} Adults, ${selectedLead.travelers?.children || 0} Children, ${selectedLead.travelers?.infants || 0} Infants` },
                      { label: 'Budget', value: selectedLead.budget?.amount ? `${selectedLead.budget.amount} ${selectedLead.budget.currency || ''}` : 'Not specified' },
                      { label: 'Flexible Dates', value: selectedLead.travelDates?.flexible ? 'Yes' : 'No' }
                    ].map((item, index) => (
                      <div key={index} className="flex justify-between items-center py-2 border-b border-green-100 last:border-b-0">
                        <span className="text-sm font-medium text-gray-600">{item.label}:</span>
                        <span className="text-sm text-gray-800 font-medium text-right">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Additional Sections */}
                {selectedLead.destinations?.length > 0 && (
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-100">
                    <h3 className="font-semibold text-gray-700 mb-4 flex items-center">
                      <svg className="w-5 h-5 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      Destinations
                    </h3>
                    <ul className="space-y-2">
                      {selectedLead.destinations.map((dest, index) => (
                        <li key={index} className="flex items-center text-gray-800">
                          <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                          {dest}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {selectedLead.notes?.length > 0 && (
                  <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-6 rounded-xl border border-amber-100">
                    <h3 className="font-semibold text-gray-700 mb-4 flex items-center">
                      <svg className="w-5 h-5 mr-2 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Notes
                    </h3>
                    <ul className="space-y-3">
                      {selectedLead.notes.map((note, index) => (
                        <li key={index} className="text-gray-800 bg-white p-3 rounded-lg border border-amber-200">
                          {note}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4">
                <button 
                  onClick={() => setIsDetailOpen(false)}
                  className="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-all duration-200 transform hover:scale-105 font-medium"
                >
                  Close
                </button>
                <button 
                  className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200 transform hover:scale-105 font-medium"
                >
                  Update Status
                </button>



            <button 
  onClick={async () => {
    const customerData = await handlecustomerdata(selectedLead.email);
    if (customerData) {
      navigate('/lead/dashboard', { 
        state: { 
          leadId: selectedLead._id, 
          customer: customerData 
        } 
      });
    } else {
      alert('Customer data not found');
    }
  }}
  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 transform hover:scale-105 font-medium"
>
  Go to Dashboard
</button>




                
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add CSS animations */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        .animate-fadeInUp {
          animation: fadeInUp 0.5s ease-out;
        }
        
        .animate-slideInUp {
          animation: slideInUp 0.3s ease-out;
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}

export default LeadCreation;