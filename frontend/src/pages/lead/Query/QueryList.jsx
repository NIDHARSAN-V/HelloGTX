import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// Follow-up Interaction Component
function FollowUpInteraction({ query, onClose, user }) {

  const [interactions, setInteractions] = useState([]);
  const [pendingFollowUps, setPendingFollowUps] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingInteraction, setEditingInteraction] = useState(null);
  const [activeTab, setActiveTab] = useState("all"); // "all", "pending"
  const [newInteraction, setNewInteraction] = useState({
    type: "outbound_call",
    direction: "outbound",
    summary: "",
    sentiment: "neutral",
    requiresFollowUp: false,
    followUpDetails: {
      scheduledAt: "",
      priority: "medium",
      notes: ""
    },
    callDetails: {
      duration: "",
      fromNumber: "",
      toNumber: ""
    }
  });

  // Fetch interactions for this query
  useEffect(() => {


    console.log(user , "User in FollowUpInteraction");
    const fetchInteractions = async () => {
      try {
        setLoading(true);
        const [allResponse, pendingResponse] = await Promise.all([
          axios.get(`http://localhost:8000/api/followup/query/${query._id}/followups`),
          axios.get(`http://localhost:8000/api/followup/query/${query._id}/followups/pending`)
        ]);
        
        setInteractions(allResponse.data.interactions || []);
        setPendingFollowUps(pendingResponse.data.pendingFollowUps || []);
      } catch (error) {
        console.error("Error fetching interactions:", error);
      } finally {
        setLoading(false);
      }
    };

    if (query?._id) {
      fetchInteractions();
    }
  }, [query]);

  // Handle adding new interaction
  const handleAddInteraction = async (e) => {
    e.preventDefault();
    try {
      console.log(user.employeeId , "***Employee ID in FollowUpInteraction***");
      const response = await axios.post(
        `http://localhost:8000/api/followup/query/${query._id}/followup`,
        {
          ...newInteraction,
          employeeId:user.employeeId,
          employeeEmail : user.email,
        }
      );
      
      setInteractions(prev => [response.data.interaction, ...prev]);
      if (response.data.interaction.requiresFollowUp && !response.data.interaction.followUpDetails.completed) {
        setPendingFollowUps(prev => [response.data.interaction, ...prev]);
      }
      
      setShowAddForm(false);
      resetForm();
    } catch (error) {
      console.error("Error adding interaction:", error);
      alert("Error adding follow-up. Please try again.");
    }
  };

  // Handle updating interaction
  const handleUpdateInteraction = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `http://localhost:8000/api/followup/followup/${editingInteraction._id}`,
        {
          ...editingInteraction,
          employee: { id: user?.id || user?._id }
        }
      );
      
      setInteractions(prev => 
        prev.map(interaction => 
          interaction._id === editingInteraction._id ? response.data.interaction : interaction
        )
      );
      
      setPendingFollowUps(prev => 
        prev.filter(interaction => 
          interaction._id !== editingInteraction._id || 
          (response.data.interaction.requiresFollowUp && !response.data.interaction.followUpDetails.completed)
        )
      );
      
      if (response.data.interaction.requiresFollowUp && !response.data.interaction.followUpDetails.completed) {
        setPendingFollowUps(prev => [response.data.interaction, ...prev.filter(i => i._id !== editingInteraction._id)]);
      }
      
      setEditingInteraction(null);
    } catch (error) {
      console.error("Error updating interaction:", error);
      alert("Error updating follow-up. Please try again.");
    }
  };

  // Handle deleting interaction
  const handleDeleteInteraction = async (interactionId) => {
    if (!window.confirm("Are you sure you want to delete this interaction?")) {
      return;
    }

    try {
      await axios.delete(`http://localhost:8000/api/followup/followup/${interactionId}`);
      
      setInteractions(prev => prev.filter(interaction => interaction._id !== interactionId));
      setPendingFollowUps(prev => prev.filter(interaction => interaction._id !== interactionId));
      
      alert("Interaction deleted successfully!");
    } catch (error) {
      console.error("Error deleting interaction:", error);
      alert("Error deleting follow-up. Please try again.");
    }
  };

  // Handle marking follow-up as completed
  const handleMarkCompleted = async (interactionId, notes = "") => {
    try {
      const response = await axios.patch(
        `http://localhost:8000/api/followup/followup/${interactionId}/complete`,
        { notes, employee: { id: user?.id || user?._id } }
      );
      
      setInteractions(prev => 
        prev.map(interaction => 
          interaction._id === interactionId ? response.data.interaction : interaction
        )
      );
      
      setPendingFollowUps(prev => 
        prev.filter(interaction => interaction._id !== interactionId)
      );
      
      alert("Follow-up marked as completed!");
    } catch (error) {
      console.error("Error marking follow-up as completed:", error);
      alert("Error marking follow-up as completed. Please try again.");
    }
  };

  // Reset form
  const resetForm = () => {
    setNewInteraction({
      type: "outbound_call",
      direction: "outbound",
      summary: "",
      sentiment: "neutral",
      requiresFollowUp: false,
      followUpDetails: {
        scheduledAt: "",
        priority: "medium",
        notes: ""
      },
      callDetails: {
        duration: "",
        fromNumber: "",
        toNumber: ""
      }
    });
  };

  // Handle input changes
  const handleInputChange = (path, value, isEditing = false) => {
    const setter = isEditing ? setEditingInteraction : setNewInteraction;
    const data = isEditing ? editingInteraction : newInteraction;

    if (path.includes('.')) {
      const [parent, child] = path.split('.');
      setter({
        ...data,
        [parent]: {
          ...data[parent],
          [child]: value
        }
      });
    } else {
      setter({
        ...data,
        [path]: value
      });
    }
  };

  // Start editing an interaction
  const startEditing = (interaction) => {
    setEditingInteraction({...interaction});
    setShowAddForm(false);
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingInteraction(null);
  };

  // Format date for display
  const formatDateTime = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return "N/A";
    }
  };

  // Get sentiment color
  const getSentimentColor = (sentiment) => {
    switch (sentiment) {
      case 'positive': return 'text-green-600 bg-green-100';
      case 'negative': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  // Get type icon
  const getTypeIcon = (type) => {
    switch (type) {
      case 'inbound_call': return '📞 In';
      case 'outbound_call': return '📞 Out';
      case 'email': return '📧 Email';
      case 'whatsapp': return '💬 WhatsApp';
      case 'sms': return '💬 SMS';
      case 'meeting': return '👥 Meeting';
      case 'chat': return '💬 Chat';
      default: return '📝 Note';
    }
  };

  // Get priority color
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Get display data based on active tab
  const displayData = activeTab === "pending" ? pendingFollowUps : interactions;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-teal-500 text-white p-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">Follow-up Interactions</h2>
              <p className="text-teal-100 mt-1">Query: {query?.name}</p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-teal-200 text-2xl font-bold"
            >
              ×
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[70vh]">
          {/* Stats and Actions */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex space-x-4">
              <div className="bg-blue-50 px-3 py-2 rounded-lg">
                <span className="text-blue-600 font-semibold">Total: {interactions.length}</span>
              </div>
              <div className="bg-orange-50 px-3 py-2 rounded-lg">
                <span className="text-orange-600 font-semibold">Pending: {pendingFollowUps.length}</span>
              </div>
            </div>
            
            <div className="flex space-x-2">
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition duration-200"
              >
                <span>+</span>
                <span>Add New</span>
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b mb-4">
            <button
              onClick={() => setActiveTab("all")}
              className={`px-4 py-2 font-medium ${
                activeTab === "all" 
                  ? "border-b-2 border-teal-500 text-teal-600" 
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              All Interactions
            </button>
            <button
              onClick={() => setActiveTab("pending")}
              className={`px-4 py-2 font-medium ${
                activeTab === "pending" 
                  ? "border-b-2 border-orange-500 text-orange-600" 
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Pending Follow-ups
              {pendingFollowUps.length > 0 && (
                <span className="ml-2 bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {pendingFollowUps.length}
                </span>
              )}
            </button>
          </div>

          {/* Add/Edit Interaction Form */}
          {(showAddForm || editingInteraction) && (
            <div className="bg-gray-50 p-4 rounded-lg mb-6 border">
              <h3 className="text-lg font-semibold mb-4">
                {editingInteraction ? "Edit Interaction" : "Add New Interaction"}
              </h3>
              <form onSubmit={editingInteraction ? handleUpdateInteraction : handleAddInteraction} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Type
                    </label>
                    <select
                      value={editingInteraction ? editingInteraction.type : newInteraction.type}
                      onChange={(e) => handleInputChange('type', e.target.value, !!editingInteraction)}
                      className="w-full p-2 border rounded-lg"
                      required
                    >
                      <option value="outbound_call">Outbound Call</option>
                      <option value="inbound_call">Inbound Call</option>
                      <option value="email">Email</option>
                      <option value="whatsapp">WhatsApp</option>
                      <option value="sms">SMS</option>
                      <option value="meeting">Meeting</option>
                      <option value="chat">Chat</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Sentiment
                    </label>
                    <select
                      value={editingInteraction ? editingInteraction.sentiment : newInteraction.sentiment}
                      onChange={(e) => handleInputChange('sentiment', e.target.value, !!editingInteraction)}
                      className="w-full p-2 border rounded-lg"
                    >
                      <option value="positive">Positive</option>
                      <option value="neutral">Neutral</option>
                      <option value="negative">Negative</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Summary
                  </label>
                  <textarea
                    value={editingInteraction ? editingInteraction.summary : newInteraction.summary}
                    onChange={(e) => handleInputChange('summary', e.target.value, !!editingInteraction)}
                    className="w-full p-2 border rounded-lg"
                    rows="3"
                    placeholder="Enter interaction summary..."
                    required
                  />
                </div>

                {/* Call-specific fields */}
                {(editingInteraction ? editingInteraction.type : newInteraction.type).includes('call') && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Duration (seconds)
                      </label>
                      <input
                        type="number"
                        value={editingInteraction ? editingInteraction.callDetails?.duration : newInteraction.callDetails.duration}
                        onChange={(e) => handleInputChange('callDetails.duration', e.target.value, !!editingInteraction)}
                        className="w-full p-2 border rounded-lg"
                        placeholder="300"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        From Number
                      </label>
                      <input
                        type="text"
                        value={editingInteraction ? editingInteraction.callDetails?.fromNumber : newInteraction.callDetails.fromNumber}
                        onChange={(e) => handleInputChange('callDetails.fromNumber', e.target.value, !!editingInteraction)}
                        className="w-full p-2 border rounded-lg"
                        placeholder="+1234567890"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        To Number
                      </label>
                      <input
                        type="text"
                        value={editingInteraction ? editingInteraction.callDetails?.toNumber : newInteraction.callDetails.toNumber}
                        onChange={(e) => handleInputChange('callDetails.toNumber', e.target.value, !!editingInteraction)}
                        className="w-full p-2 border rounded-lg"
                        placeholder="+0987654321"
                      />
                    </div>
                  </div>
                )}

                {/* Follow-up details */}
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="requiresFollowUp"
                    checked={editingInteraction ? editingInteraction.requiresFollowUp : newInteraction.requiresFollowUp}
                    onChange={(e) => handleInputChange('requiresFollowUp', e.target.checked, !!editingInteraction)}
                    className="rounded"
                  />
                  <label htmlFor="requiresFollowUp" className="text-sm font-medium text-gray-700">
                    Requires Follow-up
                  </label>
                </div>

                {(editingInteraction ? editingInteraction.requiresFollowUp : newInteraction.requiresFollowUp) && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Scheduled Date & Time
                      </label>
                      <input
                        type="datetime-local"
                        value={editingInteraction ? editingInteraction.followUpDetails?.scheduledAt?.slice(0, 16) : newInteraction.followUpDetails.scheduledAt}
                        onChange={(e) => handleInputChange('followUpDetails.scheduledAt', e.target.value, !!editingInteraction)}
                        className="w-full p-2 border rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Priority
                      </label>
                      <select
                        value={editingInteraction ? editingInteraction.followUpDetails?.priority : newInteraction.followUpDetails.priority}
                        onChange={(e) => handleInputChange('followUpDetails.priority', e.target.value, !!editingInteraction)}
                        className="w-full p-2 border rounded-lg"
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Follow-up Notes
                      </label>
                      <textarea
                        value={editingInteraction ? editingInteraction.followUpDetails?.notes : newInteraction.followUpDetails.notes}
                        onChange={(e) => handleInputChange('followUpDetails.notes', e.target.value, !!editingInteraction)}
                        className="w-full p-2 border rounded-lg"
                        rows="2"
                        placeholder="Additional notes for follow-up..."
                      />
                    </div>
                  </div>
                )}

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={editingInteraction ? cancelEditing : () => setShowAddForm(false)}
                    className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600"
                  >
                    {editingInteraction ? "Update Interaction" : "Add Interaction"}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Interactions List */}
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500"></div>
            </div>
          ) : displayData.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p className="text-lg">
                {activeTab === "pending" ? "No pending follow-ups" : "No follow-up interactions yet"}
              </p>
              <p className="text-sm mt-2">
                {activeTab === "pending" 
                  ? "All follow-ups are completed!" 
                  : "Add your first interaction to track customer communications"
                }
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {displayData.map((interaction) => (
                <div key={interaction._id} className="border rounded-lg p-4 bg-white shadow-sm">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center space-x-3">
                      <span className="text-lg">{getTypeIcon(interaction.type)}</span>
                      <div>
                        <h4 className="font-semibold text-gray-800 capitalize">
                          {interaction.type.replace('_', ' ')}
                        </h4>
                        <p className="text-sm text-gray-500">
                          {formatDateTime(interaction.createdAt)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSentimentColor(interaction.sentiment)}`}>
                        {interaction.sentiment}
                      </span>
                      {interaction.pointsEarned > 0 && (
                        <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs font-medium">
                          {interaction.pointsEarned} pts
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="text-gray-700 mb-3">{interaction.summary}</p>

                  {/* Interaction Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 mb-3">
                    {interaction.callDetails?.duration && (
                      <p><strong>Duration:</strong> {interaction.callDetails.duration} seconds</p>
                    )}
                    {interaction.callDetails?.fromNumber && (
                      <p><strong>From:</strong> {interaction.callDetails.fromNumber}</p>
                    )}
                    {interaction.callDetails?.toNumber && (
                      <p><strong>To:</strong> {interaction.callDetails.toNumber}</p>
                    )}
                  </div>

                  {/* Follow-up Details */}
                  {interaction.requiresFollowUp && interaction.followUpDetails && (
                    <div className="mt-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center space-x-2">
                          <span className="text-yellow-600">⏰</span>
                          <h5 className="font-semibold text-yellow-800">Follow-up Required</h5>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(interaction.followUpDetails.priority)}`}>
                          {interaction.followUpDetails.priority} priority
                        </span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                        <p><strong>Scheduled:</strong> {formatDateTime(interaction.followUpDetails.scheduledAt)}</p>
                        {interaction.followUpDetails.notes && (
                          <p className="md:col-span-2"><strong>Notes:</strong> {interaction.followUpDetails.notes}</p>
                        )}
                        <p><strong>Status:</strong> 
                          <span className={`ml-1 px-2 py-1 rounded-full text-xs ${
                            interaction.followUpDetails.completed ? 
                            'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {interaction.followUpDetails.completed ? 'Completed' : 'Pending'}
                          </span>
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex justify-end space-x-2 mt-4 pt-3 border-t">
                    {interaction.requiresFollowUp && interaction.followUpDetails && !interaction.followUpDetails.completed && (
                      <button
                        onClick={() => {
                          const notes = prompt("Enter completion notes (optional):");
                          if (notes !== null) {
                            handleMarkCompleted(interaction._id, notes);
                          }
                        }}
                        className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600"
                      >
                        Mark Completed
                      </button>
                    )}
                    <button
                      onClick={() => startEditing(interaction)}
                      className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteInteraction(interaction._id)}
                      className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">
              Showing {displayData.length} of {interactions.length} interactions
            </span>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition duration-200"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}































function QueryList({ leadId, customer, user }) {

  const [queries, setQueries] = useState([]);
  const [selectedQuery, setSelectedQuery] = useState(null);
  const [showFollowUp, setShowFollowUp] = useState(false);
  const [selectedQueryForFollowUp, setSelectedQueryForFollowUp] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!leadId) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(
          `http://localhost:8000/api/employee/get-queries/${leadId}`
        );
        setQueries(data.queries);
      } catch (error) {
        console.error("Error fetching queries:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [leadId]);

  // Format date function
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return "N/A";
    }
  };

  // Helper function to safely access nested properties
  const getSafe = (obj, path, defaultValue = "N/A") => {
    if (!obj) return defaultValue;
    const keys = path.split('.');
    let result = obj;
    
    for (const key of keys) {
      if (result === null || result === undefined) return defaultValue;
      result = result[key];
    }
    
    return result !== undefined && result !== null ? result : defaultValue;
  };

  // Check if array exists and has items
  const hasItems = (array) => {
    return array && Array.isArray(array) && array.length > 0;
  };

  // Handle edit query - navigate to edit page with query data
  const handleEditQuery = (query) => {
    navigate('/query/edit-query', { 
      state: { 
        query: query,
        customer: customer
      }
    });
  };

  // Handle view follow-ups
  const handleViewFollowUps = (query) => {
    setSelectedQueryForFollowUp(query);
    setShowFollowUp(true);
  };

  // Handle close follow-up modal
  const handleCloseFollowUp = () => {
    setShowFollowUp(false);
    setSelectedQueryForFollowUp(null);
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      {/* Follow-up Interaction Modal */}
      {showFollowUp && selectedQueryForFollowUp && (
        <FollowUpInteraction 
          query={selectedQueryForFollowUp} 
          onClose={handleCloseFollowUp}
          user={user}
        />
      )}

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 text-center md:text-left">
          Queries for {getSafe(customer, 'firstName', 'Customer')} {getSafe(customer, 'lastName', '')}
        </h1>
        <div className="text-sm text-gray-500">
          {queries.length} query{queries.length !== 1 ? 's' : ''} found
        </div>
      </div>

      <div className="space-y-6">
        {queries.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No queries found for this lead.</p>
            <p className="text-gray-400 text-sm mt-2">Create a new query to get started.</p>
          </div>
        )}

        {queries.map((q) => (
          <div
            key={q._id || Math.random()}
            className="w-full border rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition"
          >
            {/* ---------- Query Header ---------- */}
            <div className="flex justify-between items-center p-4 bg-gradient-to-r from-teal-100 to-white">
              <button
                onClick={() =>
                  setSelectedQuery(selectedQuery?._id === q._id ? null : q)
                }
                className="flex-1 flex justify-between items-center text-left"
              >
                <div>
                  <p className="text-lg font-semibold text-gray-800">{getSafe(q, 'name', 'Unnamed Query')}</p>
                  <p className="text-sm text-gray-600 mt-1">
                    Status: <span className="font-medium text-teal-700 capitalize">{getSafe(q, 'onStatus')}</span> | 
                    Off Status: <span className="font-medium text-blue-700 capitalize">{getSafe(q, 'offStatus')}</span>
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Total Price: <span className="font-semibold">
                      {getSafe(q, 'pricing.totalPrice', 'N/A')} {getSafe(q, 'pricing.currency')}
                    </span> | 
                    Created: <span className="font-mono">{formatDate(getSafe(q, 'createdAt'))}</span>
                  </p>
                </div>
                <div className="text-gray-400 text-xl">
                  {selectedQuery?._id === q._id ? "▲" : "▼"}
                </div>
              </button>
              
              {/* Action Buttons */}
              <div className="flex space-x-2 ml-4">
                {/* Follow-up Button */}
                <button
                  onClick={() => handleViewFollowUps(q)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition duration-200 flex items-center space-x-2"
                  title="View Follow-ups"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                  <span>Follow-ups</span>
                  {hasItems(q.followupId) && (
                    <span className="bg-blue-700 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {q.followupId.length}
                    </span>
                  )}
                </button>

                {/* Edit Button */}
                <button
                  onClick={() => handleEditQuery(q)}
                  className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-lg transition duration-200 flex items-center space-x-2"
                  title="Edit Query"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  <span>Edit</span>
                </button>
              </div>
            </div>

            {/* ---------- Sliding Query Details ---------- */}
            <div
              className={`transition-all duration-500 ease-in-out overflow-hidden ${
                selectedQuery?._id === q._id ? "max-h-[80vh]" : "max-h-0"
              }`}
            >
              <div className="p-6 bg-gray-50 border-t overflow-y-auto max-h-[80vh]">
                <div className="space-y-6">

                  {/* ---------- Action Header ---------- */}
                  <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow">
                    <h3 className="text-lg font-semibold text-gray-800">Query Details</h3>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleViewFollowUps(q)}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition duration-200 flex items-center space-x-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                        </svg>
                        <span>Manage Follow-ups</span>
                      </button>
                      <button
                        onClick={() => handleEditQuery(q)}
                        className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-lg transition duration-200 flex items-center space-x-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        <span>Edit Complete Query</span>
                      </button>
                    </div>
                  </div>

                  {/* ---------- Main Image ---------- */}
                  {getSafe(q, 'images.mainImage') && getSafe(q, 'images.mainImage') !== "N/A" && (
                    <section className="bg-white rounded-lg shadow p-4">
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="text-lg font-semibold text-gray-800">Main Image</h4>
                        <button
                          onClick={() => handleEditQuery(q)}
                          className="bg-teal-500 hover:bg-teal-600 text-white px-3 py-1 rounded text-sm transition duration-200"
                        >
                          Edit Images
                        </button>
                      </div>
                      <img 
                        src={getSafe(q, 'images.mainImage')} 
                        alt="Package main image" 
                        className="max-w-full h-auto rounded-lg max-h-64 object-cover"
                      />
                      {hasItems(getSafe(q, 'images.gallery', [])) && (
                        <div className="mt-4">
                          <h5 className="font-semibold text-gray-700 mb-2">Gallery Images</h5>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                            {getSafe(q, 'images.gallery', []).map((img, index) => (
                              <img 
                                key={index} 
                                src={img} 
                                alt={`Gallery ${index + 1}`} 
                                className="w-full h-24 object-cover rounded"
                              />
                            ))}
                          </div>
                        </div>
                      )}
                    </section>
                  )}

                  {/* ---------- Basic Info ---------- */}
                  <section className="bg-white rounded-lg shadow p-4">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="text-lg font-semibold text-gray-800">Basic Information</h4>
                      <button
                        onClick={() => handleEditQuery(q)}
                        className="bg-teal-500 hover:bg-teal-600 text-white px-3 py-1 rounded text-sm transition duration-200"
                      >
                        Edit Basic Info
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700 text-sm">
                      <p><strong>Query ID:</strong> {getSafe(q, '_id')}</p>
                      <p><strong>Name:</strong> {getSafe(q, 'name')}</p>
                      <p><strong>Slug:</strong> {getSafe(q, 'slug')}</p>
                      <p><strong>On Status:</strong> <span className="capitalize">{getSafe(q, 'onStatus')}</span></p>
                      <p><strong>Off Status:</strong> <span className="capitalize">{getSafe(q, 'offStatus')}</span></p>
                      <p><strong>Tags:</strong> {hasItems(getSafe(q, 'tags', [])) ? getSafe(q, 'tags', []).join(", ") : "N/A"}</p>
                      <p><strong>Created:</strong> {formatDate(getSafe(q, 'createdAt'))}</p>
                      <p><strong>Last Updated:</strong> {formatDate(getSafe(q, 'updatedAt'))}</p>
                    </div>
                  </section>

                  {/* ---------- Description ---------- */}
                  <section className="bg-white rounded-lg shadow p-4">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="text-lg font-semibold text-gray-800">Description</h4>
                      <button
                        onClick={() => handleEditQuery(q)}
                        className="bg-teal-500 hover:bg-teal-600 text-white px-3 py-1 rounded text-sm transition duration-200"
                      >
                        Edit Description
                      </button>
                    </div>
                    <p className="text-gray-700 whitespace-pre-wrap">{getSafe(q, 'description', 'No description available')}</p>
                  </section>

                  {/* ---------- Lead Info ---------- */}
                  <section className="bg-white rounded-lg shadow p-4">
                    <h4 className="text-lg font-semibold text-gray-800 mb-3">Lead Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700 text-sm">
                      <p><strong>Lead ID:</strong> {getSafe(q, 'leadId._id')}</p>
                      <p><strong>Name:</strong> {getSafe(q, 'leadId.firstName')} {getSafe(q, 'leadId.lastName')}</p>
                      <p><strong>Email:</strong> {getSafe(q, 'leadId.email')}</p>
                      <p><strong>Phone:</strong> {getSafe(q, 'leadId.phone')}</p>
                      <p><strong>Source:</strong> <span className="capitalize">{getSafe(q, 'leadId.source', 'N/A').replace(/_/g, ' ')}</span></p>
                      <p><strong>Trip Type:</strong> <span className="capitalize">{getSafe(q, 'leadId.tripType', 'N/A').replace(/_/g, ' ')}</span></p>
                      <p><strong>Status:</strong> <span className="capitalize">{getSafe(q, 'leadId.status', 'N/A').replace(/_/g, ' ')}</span></p>
                      <p><strong>Priority:</strong> <span className="capitalize">{getSafe(q, 'leadId.priority')}</span></p>
                      <p><strong>Lead Score:</strong> {getSafe(q, 'leadId.leadScore', 0)}</p>
                    </div>

                    {/* Travelers Details */}
                    <div className="mt-4">
                      <h5 className="font-semibold text-gray-700 mb-2">Travelers</h5>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                        <p><strong>Adults:</strong> {getSafe(q, 'leadId.travelers.adults', 0)}</p>
                        <p><strong>Children:</strong> {getSafe(q, 'leadId.travelers.children', 0)}</p>
                        <p><strong>Infants:</strong> {getSafe(q, 'leadId.travelers.infants', 0)}</p>
                      </div>
                    </div>
                  </section>

                  {/* ---------- Includes ---------- */}
                  {getSafe(q, 'includes') && (
                    <section className="bg-white rounded-lg shadow p-4">
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="text-lg font-semibold text-gray-800">What's Included</h4>
                        <button
                          onClick={() => handleEditQuery(q)}
                          className="bg-teal-500 hover:bg-teal-600 text-white px-3 py-1 rounded text-sm transition duration-200"
                        >
                          Edit Inclusions
                        </button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700 text-sm">
                        {/* Meals */}
                        <div>
                          <h5 className="font-semibold text-gray-700 mb-2">Meals</h5>
                          <div className="space-y-1">
                            {getSafe(q, 'includes.meals.breakfast', false) && <p>✅ Breakfast included</p>}
                            {getSafe(q, 'includes.meals.lunch', false) && <p>✅ Lunch included</p>}
                            {getSafe(q, 'includes.meals.dinner', false) && <p>✅ Dinner included</p>}
                            {!getSafe(q, 'includes.meals.breakfast', false) && 
                             !getSafe(q, 'includes.meals.lunch', false) && 
                             !getSafe(q, 'includes.meals.dinner', false) && (
                              <p>❌ No meals included</p>
                            )}
                          </div>
                        </div>

                        {/* Other Inclusions */}
                        <div className="space-y-2">
                          {getSafe(q, 'includes.flights', false) && <p>✅ Flights included</p>}
                          {getSafe(q, 'includes.hotels', false) && <p>✅ Hotels included</p>}
                          {getSafe(q, 'includes.visas', false) && <p>✅ Visas included</p>}
                          {getSafe(q, 'includes.transfers', false) && <p>✅ Transfers included</p>}
                          {getSafe(q, 'includes.activities', false) && <p>✅ Activities included</p>}
                          {getSafe(q, 'includes.insurance', false) && <p>✅ Insurance included</p>}
                        </div>
                      </div>
                    </section>
                  )}

                  {/* ---------- Pricing Details ---------- */}
                  {getSafe(q, 'pricing') && (
                    <section className="bg-white rounded-lg shadow p-4">
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="text-lg font-semibold text-gray-800">Pricing Details</h4>
                        <button
                          onClick={() => handleEditQuery(q)}
                          className="bg-teal-500 hover:bg-teal-600 text-white px-3 py-1 rounded text-sm transition duration-200"
                        >
                          Edit Pricing
                        </button>
                      </div>
                      
                      {/* Summary */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 p-3 bg-teal-50 rounded-lg">
                        <p><strong>Base Price:</strong> {getSafe(q, 'pricing.basePrice')} {getSafe(q, 'pricing.currency')}</p>
                        <p><strong>Total Price:</strong> {getSafe(q, 'pricing.totalPrice')} {getSafe(q, 'pricing.currency')}</p>
                        <p><strong>Currency:</strong> {getSafe(q, 'pricing.currency')}</p>
                      </div>

                      {/* Price Components */}
                      <div className="mb-4">
                        <h5 className="font-semibold text-gray-700 mb-2">Price Components</h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                          <p>Flights: {getSafe(q, 'pricing.components.flights', 0)} {getSafe(q, 'pricing.currency')}</p>
                          <p>Accommodation: {getSafe(q, 'pricing.components.accommodation', 0)} {getSafe(q, 'pricing.currency')}</p>
                          <p>Visas: {getSafe(q, 'pricing.components.visas', 0)} {getSafe(q, 'pricing.currency')}</p>
                          <p>Taxes: {getSafe(q, 'pricing.components.taxes', 0)} {getSafe(q, 'pricing.currency')}</p>
                          <p>Fees: {getSafe(q, 'pricing.components.fees', 0)} {getSafe(q, 'pricing.currency')}</p>
                        </div>
                      </div>

                      {/* Payment Plan */}
                      <div className="mb-4">
                        <h5 className="font-semibold text-gray-700 mb-2">Payment Plan</h5>
                        <p><strong>Deposit Required:</strong> {getSafe(q, 'pricing.paymentPlan.depositRequired', false) ? "✅ Yes" : "❌ No"}</p>
                        {getSafe(q, 'pricing.paymentPlan.depositRequired', false) && (
                          <p><strong>Deposit Amount:</strong> {getSafe(q, 'pricing.paymentPlan.depositAmount', 0)} {getSafe(q, 'pricing.currency')}</p>
                        )}
                      </div>
                    </section>
                  )}

                  {/* ---------- Hotels ---------- */}
                  {hasItems(getSafe(q, 'hotels', [])) && (
                    <section className="bg-white rounded-lg shadow p-4">
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="text-lg font-semibold text-gray-800">Hotels</h4>
                        <button
                          onClick={() => handleEditQuery(q)}
                          className="bg-teal-500 hover:bg-teal-600 text-white px-3 py-1 rounded text-sm transition duration-200"
                        >
                          Edit Hotels
                        </button>
                      </div>
                      <div className="space-y-4">
                        {getSafe(q, 'hotels', []).map((hotel, index) => (
                          <div key={hotel._id || index} className="border rounded-lg p-4 bg-gray-50 shadow-sm">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <p className="font-semibold text-lg text-gray-800">
                                  {getSafe(hotel, 'name', 'Unnamed Hotel')} ({getSafe(hotel, 'starRating', 'N/A')}★)
                                </p>
                                <p className="text-sm text-gray-600">Room Type: {getSafe(hotel, 'roomType')}</p>
                                <p className="text-sm text-gray-600">Day: {getSafe(hotel, 'day', 'N/A')}</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-600">
                                  <strong>Location:</strong> {getSafe(hotel, 'location.city', 'N/A')}, {getSafe(hotel, 'location.address', 'N/A')}
                                </p>
                                <p className="text-sm text-gray-600">
                                  <strong>Check-in:</strong> {formatDate(getSafe(hotel, 'checkIn'))}
                                </p>
                                <p className="text-sm text-gray-600">
                                  <strong>Check-out:</strong> {formatDate(getSafe(hotel, 'checkOut'))}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </section>
                  )}

                  {/* ---------- Flights ---------- */}
                  {hasItems(getSafe(q, 'flights', [])) && (
                    <section className="bg-white rounded-lg shadow p-4">
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="text-lg font-semibold text-gray-800">Flights</h4>
                        <button
                          onClick={() => handleEditQuery(q)}
                          className="bg-teal-500 hover:bg-teal-600 text-white px-3 py-1 rounded text-sm transition duration-200"
                        >
                          Edit Flights
                        </button>
                      </div>
                      <div className="space-y-3">
                        {getSafe(q, 'flights', []).map((flight, index) => (
                          <div key={flight._id || index} className="border rounded-lg p-3 bg-gray-50">
                            <p><strong>Flight Details:</strong> {getSafe(flight, 'airline')} - {getSafe(flight, 'flightNumber')}</p>
                            <p><strong>From:</strong> {getSafe(flight, 'departure.airport')} to <strong>To:</strong> {getSafe(flight, 'arrival.airport')}</p>
                            <p><strong>Departure:</strong> {formatDate(getSafe(flight, 'departure.datetime'))}</p>
                            <p><strong>Arrival:</strong> {formatDate(getSafe(flight, 'arrival.datetime'))}</p>
                          </div>
                        ))}
                      </div>
                    </section>
                  )}

                  {/* ---------- Bottom Edit Button ---------- */}
                  <div className="flex justify-center pt-4">
                    <button
                      onClick={() => handleEditQuery(q)}
                      className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-3 rounded-lg transition duration-200 flex items-center space-x-2 text-lg font-semibold"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      <span>Edit Complete Query</span>
                    </button>
                  </div>

                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default QueryList;