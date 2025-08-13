import React, { useState } from 'react';

function NewQuery() {
  // Customer profile data
  const [customerData] = useState({
    name: "Mr. Niðhar Sankala",
    owner: "Gaurav Gupta",
    contact: "91 9344686218",
    type: "B2C",
    email: "Niðharsankala8800@gmail.com",
    activeSince: "19-Mar-25 01:37:38"
  });

  // Requirement types and active tab state
  const requirementTypes = [
    'Package', 'Flight', 'Transfer', 'Visa', 'Hotel', 
    'Sightseeing', 'Miscellaneous', 'Company Formation', 'Forex'
  ];
  const [activeTab, setActiveTab] = useState(0);
  const [formData, setFormData] = useState({
    queryType: 'FIT',
    goingFrom: '',
    goingTo: '',
    specificDate: '',
    noOfDays: '',
    priceRange: '',
    hotelPreference: '',
    foodPreference: '',
    travellers: 2,
    remarks: '',
    expectedClosureDate: '',
    expectedClosureAmount: '',
    // Additional fields for specific requirement types
    flightDetails: {
      departure: '',
      arrival: '',
      class: 'Economy'
    },
    hotelDetails: {
      checkIn: '',
      checkOut: '',
      roomType: 'Standard'
    },
    visaDetails: {
      country: '',
      type: 'Tourist',
      processingTime: ''
    }
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNestedInputChange = (section, e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [name]: value
      }
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (activeTab < requirementTypes.length - 1) {
      setActiveTab(activeTab + 1);
    } else {
      console.log('Final form submission:', formData);
      // Submit to backend
      alert('Form submitted successfully!');
    }
  };

  const renderFormFields = () => {
    const currentType = requirementTypes[activeTab];
    
    const commonFields = (
      <>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Going From *</label>
            <input
              type="text"
              name="goingFrom"
              value={formData.goingFrom}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Going To *</label>
            <input
              type="text"
              name="goingTo"
              value={formData.goingTo}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Specific Date *</label>
            <input
              type="date"
              name="specificDate"
              value={formData.specificDate}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">No Of Days</label>
            <input
              type="number"
              name="noOfDays"
              value={formData.noOfDays}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              min="1"
            />
          </div>
        </div>
      </>
    );

    const typeSpecificFields = () => {
      switch(currentType) {
        case 'Flight':
          return (
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Flight Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Departure Time</label>
                  <input
                    type="time"
                    name="departure"
                    value={formData.flightDetails.departure}
                    onChange={(e) => handleNestedInputChange('flightDetails', e)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Arrival Time</label>
                  <input
                    type="time"
                    name="arrival"
                    value={formData.flightDetails.arrival}
                    onChange={(e) => handleNestedInputChange('flightDetails', e)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
                  <select
                    name="class"
                    value={formData.flightDetails.class}
                    onChange={(e) => handleNestedInputChange('flightDetails', e)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="Economy">Economy</option>
                    <option value="Premium Economy">Premium Economy</option>
                    <option value="Business">Business</option>
                    <option value="First Class">First Class</option>
                  </select>
                </div>
              </div>
            </div>
          );
        case 'Hotel':
          return (
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Hotel Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Check-In Date</label>
                  <input
                    type="date"
                    name="checkIn"
                    value={formData.hotelDetails.checkIn}
                    onChange={(e) => handleNestedInputChange('hotelDetails', e)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Check-Out Date</label>
                  <input
                    type="date"
                    name="checkOut"
                    value={formData.hotelDetails.checkOut}
                    onChange={(e) => handleNestedInputChange('hotelDetails', e)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Room Type</label>
                  <select
                    name="roomType"
                    value={formData.hotelDetails.roomType}
                    onChange={(e) => handleNestedInputChange('hotelDetails', e)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="Standard">Standard</option>
                    <option value="Deluxe">Deluxe</option>
                    <option value="Suite">Suite</option>
                    <option value="Executive">Executive</option>
                  </select>
                </div>
              </div>
            </div>
          );
        case 'Visa':
          return (
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Visa Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                  <input
                    type="text"
                    name="country"
                    value={formData.visaDetails.country}
                    onChange={(e) => handleNestedInputChange('visaDetails', e)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Visa Type</label>
                  <select
                    name="type"
                    value={formData.visaDetails.type}
                    onChange={(e) => handleNestedInputChange('visaDetails', e)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="Tourist">Tourist</option>
                    <option value="Business">Business</option>
                    <option value="Student">Student</option>
                    <option value="Work">Work</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Processing Time</label>
                  <input
                    type="text"
                    name="processingTime"
                    value={formData.visaDetails.processingTime}
                    onChange={(e) => handleNestedInputChange('visaDetails', e)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., 5-7 business days"
                  />
                </div>
              </div>
            </div>
          );
        default:
          return null;
      }
    };

    return (
      <>
        {commonFields}
        {typeSpecificFields()}
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">Remarks</label>
          <textarea
            name="remarks"
            value={formData.remarks}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            rows="3"
          ></textarea>
        </div>
      </>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        {/* Header with customer profile */}
        <div className="bg-blue-600 p-6 text-white">
          <h1 className="text-2xl font-bold">Global Travel CRM</h1>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="font-semibold">Customer: {customerData.name}</p>
              <p className="text-sm">Owner: {customerData.owner}</p>
            </div>
            <div>
              <p className="text-sm">Contact: {customerData.contact}</p>
              <p className="text-sm">Email: {customerData.email}</p>
              <p className="text-sm">Active Since: {customerData.activeSince}</p>
            </div>
          </div>
        </div>

        {/* Tabs navigation */}
        <div className="border-b border-gray-200">
          <nav className="flex overflow-x-auto">
            {requirementTypes.map((type, index) => (
              <button
                key={type}
                onClick={() => setActiveTab(index)}
                className={`px-4 py-3 text-sm font-medium whitespace-nowrap ${activeTab === index ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              >
                {type}
              </button>
            ))}
          </nav>
        </div>

        {/* Form content */}
        <div className="p-6">
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">{requirementTypes[activeTab]} Requirements</h2>
              
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Query Type:</h3>
                <div className="flex space-x-4">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="queryType"
                      checked={formData.queryType === 'FIT'}
                      onChange={() => setFormData({...formData, queryType: 'FIT'})}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <span className="ml-2 text-gray-700">FIT (Normal)</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="queryType"
                      checked={formData.queryType === 'GIT'}
                      onChange={() => setFormData({...formData, queryType: 'GIT'})}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <span className="ml-2 text-gray-700">GIT (Group)</span>
                  </label>
                </div>
              </div>

              {renderFormFields()}
            </div>

            <div className="flex justify-between items-center border-t pt-4">
              <button
                type="button"
                onClick={() => activeTab > 0 && setActiveTab(activeTab - 1)}
                disabled={activeTab === 0}
                className={`px-4 py-2 rounded-md ${activeTab === 0 ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
              >
                Previous
              </button>
              
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                {activeTab < requirementTypes.length - 1 ? 'Save & Next' : 'Save'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default NewQuery;