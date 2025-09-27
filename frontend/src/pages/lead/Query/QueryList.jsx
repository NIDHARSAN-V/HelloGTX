import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function QueryList({ leadId, customer, user }) {
  const [queries, setQueries] = useState([]);
  const [selectedQuery, setSelectedQuery] = useState(null);
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
              
              {/* Edit Button */}
              <button
                onClick={() => handleEditQuery(q)}
                className="ml-4 bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-lg transition duration-200 flex items-center space-x-2"
                title="Edit Query"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                <span>Edit</span>
              </button>
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