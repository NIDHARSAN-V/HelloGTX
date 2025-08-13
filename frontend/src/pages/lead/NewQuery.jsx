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
    travellers: 2,
    priceRange: '',
    inclusions: [],
    themes: [],
    hotelPreference: '3',
    foodPreferences: [],
    remarks: '',
    expectedClosureDate: '',
    expectedClosureAmount: '',
    // Flight specific
    flightType: 'oneway',
    sourceCity: '',
    destinationCity: '',
    departureDate: '',
    returnDate: '',
    adults: 1,
    children: 0,
    infants: 0,
    flightClass: 'Economy',
    preferredAirline: '',
    // Additional fields for other requirement types
    transferDetails: {
      pickup: '',
      dropoff: '',
      vehicleType: 'Sedan'
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

  // Options for multi-select fields
  const inclusionOptions = ['Flights', 'Hotels', 'Transfers', 'Meals', 'Sightseeing', 'Insurance', 'Visa Assistance'];
  const themeOptions = ['Beach', 'Adventure', 'Honeymoon', 'Family', 'Luxury', 'Wildlife', 'Cultural'];
  const foodPreferenceOptions = ['Vegetarian', 'Vegan', 'Halal', 'Kosher', 'Gluten-Free', 'Jain'];

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

  const handleCheckboxChange = (field, option) => {
    setFormData(prev => {
      const currentOptions = prev[field] || [];
      if (currentOptions.includes(option)) {
        return {
          ...prev,
          [field]: currentOptions.filter(item => item !== option)
        };
      } else {
        return {
          ...prev,
          [field]: [...currentOptions, option]
        };
      }
    });
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
      </>
    );

    const typeSpecificFields = () => {
      switch(currentType) {
        case 'Package':
          return (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Travellers Count *</label>
                  <input
                    type="number"
                    name="travellers"
                    value={formData.travellers}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    min="1"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price Range (per person)</label>
                  <select
                    name="priceRange"
                    value={formData.priceRange}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select Range</option>
                    <option value="0-500">$0 - $500</option>
                    <option value="500-1000">$500 - $1000</option>
                    <option value="1000-2000">$1000 - $2000</option>
                    <option value="2000-5000">$2000 - $5000</option>
                    <option value="5000+">$5000+</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Inclusions</label>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 mt-2">
                  {inclusionOptions.map(option => (
                    <label key={option} className="inline-flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.inclusions.includes(option)}
                        onChange={() => handleCheckboxChange('inclusions', option)}
                        className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">{option}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Theme</label>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 mt-2">
                  {themeOptions.map(option => (
                    <label key={option} className="inline-flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.themes.includes(option)}
                        onChange={() => handleCheckboxChange('themes', option)}
                        className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">{option}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Hotel Preference (1-5)</label>
                  <div className="flex items-center space-x-2">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setFormData({...formData, hotelPreference: star.toString()})}
                        className={`p-1 rounded-full ${formData.hotelPreference >= star ? 'text-yellow-400' : 'text-gray-300'}`}
                      >
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Food Preferences</label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {foodPreferenceOptions.map(option => (
                      <label key={option} className="inline-flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.foodPreferences.includes(option)}
                          onChange={() => handleCheckboxChange('foodPreferences', option)}
                          className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">{option}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Remarks</label>
                <textarea
                  name="remarks"
                  value={formData.remarks}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  rows="3"
                ></textarea>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Expected Closure Date</label>
                  <input
                    type="date"
                    name="expectedClosureDate"
                    value={formData.expectedClosureDate}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Expected Closure Amount</label>
                  <input
                    type="number"
                    name="expectedClosureAmount"
                    value={formData.expectedClosureAmount}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>
            </div>
          );
        case 'Flight':
          return (
            <div className="space-y-6">
              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Flight Type:</h3>
                <div className="flex flex-wrap gap-4">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="flightType"
                      checked={formData.flightType === 'oneway'}
                      onChange={() => setFormData({...formData, flightType: 'oneway'})}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <span className="ml-2 text-gray-700">One Way</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="flightType"
                      checked={formData.flightType === 'roundtrip'}
                      onChange={() => setFormData({...formData, flightType: 'roundtrip'})}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <span className="ml-2 text-gray-700">Round Trip</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="flightType"
                      checked={formData.flightType === 'multicity'}
                      onChange={() => setFormData({...formData, flightType: 'multicity'})}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <span className="ml-2 text-gray-700">Multi City</span>
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Source City *</label>
                  <input
                    type="text"
                    name="sourceCity"
                    value={formData.sourceCity}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Destination City *</label>
                  <input
                    type="text"
                    name="destinationCity"
                    value={formData.destinationCity}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Departure Date *</label>
                  <input
                    type="date"
                    name="departureDate"
                    value={formData.departureDate}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                {formData.flightType === 'roundtrip' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Return Date *</label>
                    <input
                      type="date"
                      name="returnDate"
                      value={formData.returnDate}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Adults (12+ yrs)</label>
                  <input
                    type="number"
                    name="adults"
                    value={formData.adults}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    min="1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Children (2-12 yrs)</label>
                  <input
                    type="number"
                    name="children"
                    value={formData.children}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Infants (0-2 yrs)</label>
                  <input
                    type="number"
                    name="infants"
                    value={formData.infants}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    min="0"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
                  <select
                    name="flightClass"
                    value={formData.flightClass}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="Economy">Economy</option>
                    <option value="Premium Economy">Premium Economy</option>
                    <option value="Business">Business</option>
                    <option value="First Class">First Class</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Airline</label>
                  <input
                    type="text"
                    name="preferredAirline"
                    value={formData.preferredAirline}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Any preferred airline?"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Remarks</label>
                <textarea
                  name="remarks"
                  value={formData.remarks}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  rows="3"
                ></textarea>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Expected Closure Date</label>
                  <input
                    type="date"
                    name="expectedClosureDate"
                    value={formData.expectedClosureDate}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Expected Closure Amount</label>
                  <input
                    type="number"
                    name="expectedClosureAmount"
                    value={formData.expectedClosureAmount}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>
            </div>
          );
        case 'Transfer':
          return (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Pickup Location *</label>
                  <input
                    type="text"
                    name="pickup"
                    value={formData.transferDetails.pickup}
                    onChange={(e) => handleNestedInputChange('transferDetails', e)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Dropoff Location *</label>
                  <input
                    type="text"
                    name="dropoff"
                    value={formData.transferDetails.dropoff}
                    onChange={(e) => handleNestedInputChange('transferDetails', e)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Type</label>
                <select
                  name="vehicleType"
                  value={formData.transferDetails.vehicleType}
                  onChange={(e) => handleNestedInputChange('transferDetails', e)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="Sedan">Sedan</option>
                  <option value="SUV">SUV</option>
                  <option value="Van">Van</option>
                  <option value="Luxury">Luxury</option>
                  <option value="Bus">Bus</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Remarks</label>
                <textarea
                  name="remarks"
                  value={formData.remarks}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  rows="3"
                ></textarea>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Expected Closure Date</label>
                  <input
                    type="date"
                    name="expectedClosureDate"
                    value={formData.expectedClosureDate}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Expected Closure Amount</label>
                  <input
                    type="number"
                    name="expectedClosureAmount"
                    value={formData.expectedClosureAmount}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>
            </div>
          );
        case 'Visa':
          return (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Country *</label>
                  <input
                    type="text"
                    name="country"
                    value={formData.visaDetails.country}
                    onChange={(e) => handleNestedInputChange('visaDetails', e)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Visa Type *</label>
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Remarks</label>
                <textarea
                  name="remarks"
                  value={formData.remarks}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  rows="3"
                ></textarea>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Expected Closure Date</label>
                  <input
                    type="date"
                    name="expectedClosureDate"
                    value={formData.expectedClosureDate}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Expected Closure Amount</label>
                  <input
                    type="number"
                    name="expectedClosureAmount"
                    value={formData.expectedClosureAmount}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>
            </div>
          );
        case 'Hotel':
          return (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Check-In Date *</label>
                  <input
                    type="date"
                    name="checkIn"
                    value={formData.hotelDetails.checkIn}
                    onChange={(e) => handleNestedInputChange('hotelDetails', e)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Check-Out Date *</label>
                  <input
                    type="date"
                    name="checkOut"
                    value={formData.hotelDetails.checkOut}
                    onChange={(e) => handleNestedInputChange('hotelDetails', e)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location/City *</label>
                  <input
                    type="text"
                    name="goingTo"
                    value={formData.goingTo}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    required
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Guests *</label>
                  <input
                    type="number"
                    name="travellers"
                    value={formData.travellers}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    min="1"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Hotel Preference (1-5)</label>
                  <div className="flex items-center space-x-2">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setFormData({...formData, hotelPreference: star.toString()})}
                        className={`p-1 rounded-full ${formData.hotelPreference >= star ? 'text-yellow-400' : 'text-gray-300'}`}
                      >
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Remarks</label>
                <textarea
                  name="remarks"
                  value={formData.remarks}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  rows="3"
                ></textarea>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Expected Closure Date</label>
                  <input
                    type="date"
                    name="expectedClosureDate"
                    value={formData.expectedClosureDate}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Expected Closure Amount</label>
                  <input
                    type="number"
                    name="expectedClosureAmount"
                    value={formData.expectedClosureAmount}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>
            </div>
          );
        default:
          return (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  name="remarks"
                  value={formData.remarks}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  rows="3"
                  placeholder={`Describe your ${currentType.toLowerCase()} requirements...`}
                ></textarea>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Expected Closure Date</label>
                  <input
                    type="date"
                    name="expectedClosureDate"
                    value={formData.expectedClosureDate}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Expected Closure Amount</label>
                  <input
                    type="number"
                    name="expectedClosureAmount"
                    value={formData.expectedClosureAmount}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>
            </div>
          );
      }
    };

    return (
      <>
        {commonFields}
        {typeSpecificFields()}
      </>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        {/* Header with customer profile */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6 text-white">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold">Global Travel CRM</h1>
              <p className="text-sm opacity-90">Create New Travel Query</p>
            </div>
            <div className="bg-blue-500 text-xs px-3 py-1 rounded-full">
              {customerData.type}
            </div>
          </div>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="font-semibold text-lg">{customerData.name}</p>
              <p className="text-sm opacity-90">Owner: {customerData.owner}</p>
            </div>
            <div>
              <p className="text-sm">
                <span className="opacity-90">Contact: </span>
                <a href={`tel:${customerData.contact}`} className="hover:underline">{customerData.contact}</a>
              </p>
              <p className="text-sm">
                <span className="opacity-90">Email: </span>
                <a href={`mailto:${customerData.email}`} className="hover:underline">{customerData.email}</a>
              </p>
            </div>
            <div>
              <p className="text-sm opacity-90">Active Since: {customerData.activeSince}</p>
            </div>
          </div>
        </div>

        {/* Tabs navigation */}
        <div className="border-b border-gray-200 bg-gray-50">
          <nav className="flex overflow-x-auto">
            {requirementTypes.map((type, index) => (
              <button
                key={type}
                onClick={() => setActiveTab(index)}
                className={`px-5 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors duration-200 ${activeTab === index ? 'border-blue-500 text-blue-600 bg-white' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
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
              <h2 className="text-xl font-semibold text-gray-900 mb-2 flex items-center">
                <span className="bg-blue-100 text-blue-800 p-2 rounded-full mr-3">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
                  </svg>
                </span>
                {requirementTypes[activeTab]} Requirements
              </h2>
              <p className="text-sm text-gray-500 mb-6">Please provide all the necessary details for the {requirementTypes[activeTab].toLowerCase()} requirements.</p>
              
              <div className="space-y-8">
                {renderFormFields()}
              </div>
            </div>

            <div className="flex justify-between items-center border-t pt-6">
              <button
                type="button"
                onClick={() => activeTab > 0 && setActiveTab(activeTab - 1)}
                disabled={activeTab === 0}
                className={`inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md ${activeTab === 0 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
              >
                <svg className="-ml-1 mr-2 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Previous
              </button>
              
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {activeTab < requirementTypes.length - 1 ? (
                  <>
                    Save & Continue
                    <svg className="-mr-1 ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </>
                ) : 'Submit Query'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default NewQuery;