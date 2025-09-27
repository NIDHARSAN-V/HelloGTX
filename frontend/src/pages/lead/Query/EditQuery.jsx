import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';

function EditQuery() {
  const navigate = useNavigate();
  const employee = JSON.parse(localStorage.getItem('user'));
  
  const location = useLocation();
  const { query, customer } = location.state || {};

  useEffect(() => {
    console.log(query)
  }, []);

  

  // Customer profile data
  const [customerData, setCustomerData] = useState({
    name: '',
    owner: '',
    contact: '',
    type: '',
    email: '',
    activeSince: ''
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
    flightSelectionType: 'new',
    selectedFlightPackage: null,
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
    // Hotel specific
    hotelSelectionType: 'new',
    selectedHotelPackage: null,
    hotelDetails: {
      checkIn: '',
      checkOut: '',
      roomType: 'Standard',
      adults: 2,
      children: 0,
      mealPlan: 'breakfast'
    },
    // Third Party Details
    thirdPartyFlightDetails: {
        pnr: '',
        supplier: '',
        cost: '',
        confirmationFile: null
    },
    thirdPartyHotelDetails: {
        confirmationNumber: '',
        supplier: '',
        cost: '',
        voucherFile: null
    },
    // Additional fields for other requirement types
    transferDetails: {
      pickup: '',
      dropoff: '',
      vehicleType: 'Sedan'
    },
    visaDetails: {
      country: '',
      type: 'Tourist',
      processingTime: ''
    }
  });

  // Flight packages state
  const [flightPackages, setFlightPackages] = useState([]);
  const [flightLoading, setFlightLoading] = useState(false);
  const [flightFilters, setFlightFilters] = useState({
    departureCity: '',
    arrivalCity: '',
    minPrice: '',
    maxPrice: '',
    sort: ''
  });

  // Hotel packages state
  const [hotelPackages, setHotelPackages] = useState([]);
  const [hotelLoading, setHotelLoading] = useState(false);
  const [hotelFilters, setHotelFilters] = useState({
    city: '',
    country: '',
    minPrice: '',
    maxPrice: '',
    sort: '',
    starRating: ''
  });

  // Options for multi-select fields
  const inclusionOptions = ['Flights', 'Hotels', 'Transfers', 'Meals', 'Sightseeing', 'Insurance', 'Visa Assistance'];
  const themeOptions = ['Beach', 'Adventure', 'Honeymoon', 'Family', 'Luxury', 'Wildlife', 'Cultural'];
  const foodPreferenceOptions = ['Vegetarian', 'Vegan', 'Halal', 'Kosher', 'Gluten-Free', 'Jain'];
  const mealPlanOptions = ['breakfast', 'half_board', 'full_board', 'all_inclusive'];
  const roomTypeOptions = ['Standard', 'Deluxe', 'Suite', 'Executive', 'Family'];

  // Initialize form data from query prop
  useEffect(() => {
    if (query) {
      console.log('Initializing form with query data:', query);
      
      setFormData(prev => ({
        ...prev,
        name: query.name || '',
        description: query.description || '',
        queryType: query.queryType || 'FIT',
        goingFrom: query.goingFrom || '',
        goingTo: query.goingTo || '',
        specificDate: query.specificDate || '',
        noOfDays: query.noOfDays || '',
        travellers: query.travellers || 2,
        priceRange: query.priceRange || '',
        inclusions: query.includes ? getInclusionsFromQuery(query.includes) : [],
        themes: query.tags || [],
        hotelPreference: query.hotelPreference || '3',
        foodPreferences: query.foodPreferences || [],
        remarks: query.remarks || '',
        expectedClosureDate: query.expectedClosureDate || '',
        expectedClosureAmount: query.expectedClosureAmount || '',
        
        // Flight data
        flightType: query.flights?.[0]?.flightType || 'oneway',
        sourceCity: query.flights?.[0]?.departure?.city || '',
        destinationCity: query.flights?.[0]?.arrival?.city || '',
        departureDate: query.flights?.[0]?.departure?.datetime ? 
          new Date(query.flights[0].departure.datetime).toISOString().split('T')[0] : '',
        returnDate: query.flights?.[0]?.arrival?.datetime ? 
          new Date(query.flights[0].arrival.datetime).toISOString().split('T')[0] : '',
        adults: query.leadId?.travelers?.adults || 1,
        children: query.leadId?.travelers?.children || 0,
        infants: query.leadId?.travelers?.infants || 0,
        flightClass: query.flights?.[0]?.cabinClass || 'Economy',
        preferredAirline: query.flights?.[0]?.airline || '',
        
        // Hotel data
        hotelDetails: {
          checkIn: query.hotels?.[0]?.checkIn ? 
            new Date(query.hotels[0].checkIn).toISOString().split('T')[0] : '',
          checkOut: query.hotels?.[0]?.checkOut ? 
            new Date(query.hotels[0].checkOut).toISOString().split('T')[0] : '',
          roomType: query.hotels?.[0]?.roomType || 'Standard',
          adults: query.leadId?.travelers?.adults || 2,
          children: query.leadId?.travelers?.children || 0,
          mealPlan: query.hotels?.[0]?.mealPlan || 'breakfast'
        },
        
        expectedClosureAmount: query.pricing?.totalPrice || ''
      }));
    }
  }, [query]);

  // Helper function to extract inclusions from query
  const getInclusionsFromQuery = (includes) => {
    const inclusions = [];
    if (includes.flights) inclusions.push('Flights');
    if (includes.hotels) inclusions.push('Hotels');
    if (includes.transfers) inclusions.push('Transfers');
    if (includes.meals?.breakfast || includes.meals?.lunch || includes.meals?.dinner) inclusions.push('Meals');
    if (includes.activities) inclusions.push('Sightseeing');
    if (includes.insurance) inclusions.push('Insurance');
    if (includes.visas) inclusions.push('Visa Assistance');
    return inclusions;
  };

  // Initialize customer data
  useEffect(() => {
    if (customer) {
      setCustomerData({
        name: `${customer.firstName || ''} ${customer.lastName || ''}`.trim(),
        owner: `${customer.firstName || ''} ${customer.lastName || ''}`.trim(),
        contact: customer.phone || '',
        type: customer.type || '',
        email: customer.email || '',
        activeSince: customer.createdAt ? new Date(customer.createdAt).toLocaleDateString() : ''
      });
    }
  }, [customer]);

  // Fetch flight packages when flight tab is active
  useEffect(() => {
    if (requirementTypes[activeTab] === 'Flight' && formData.flightSelectionType === 'existing') {
      fetchFlightPackages();
    }
  }, [activeTab, formData.flightSelectionType, flightFilters]);

  // Fetch hotel packages when hotel tab is active
  useEffect(() => {
    if (requirementTypes[activeTab] === 'Hotel' && formData.hotelSelectionType === 'existing') {
      fetchHotelPackages();
    }
  }, [activeTab, formData.hotelSelectionType, hotelFilters]);

  const fetchFlightPackages = async () => {
    try {
      setFlightLoading(true);
      const params = new URLSearchParams();
      Object.entries(flightFilters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });

      const response = await axios.get(`http://localhost:8000/api/flight-packages?${params.toString()}`);
      setFlightPackages(response.data);
      setFlightLoading(false);
    } catch (error) {
      console.error("Failed to fetch flight packages", error);
      setFlightPackages([]);
      setFlightLoading(false);
    }
  };

  const fetchHotelPackages = async () => {
    try {
      setHotelLoading(true);
      const params = new URLSearchParams();
      Object.entries(hotelFilters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });

      const response = await axios.get(`http://localhost:8000/api/hotel-packages?${params.toString()}`);
      setHotelPackages(response.data);
      setHotelLoading(false);
    } catch (error) {
      console.error("Failed to fetch hotel packages", error);
      setHotelPackages([]);
      setHotelLoading(false);
    }
  };

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

  const handleFlightFilterChange = (e) => {
    const { name, value } = e.target;
    setFlightFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleHotelFilterChange = (e) => {
    const { name, value } = e.target;
    setHotelFilters(prev => ({
      ...prev,
      [name]: value
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

  const handleFlightPackageSelect = (flight) => {
    setFormData(prev => ({
      ...prev,
      selectedFlightPackage: flight._id,
      flightType: flight.tripType || 'oneway',
      sourceCity: flight.departure?.city || '',
      destinationCity: flight.arrival?.city || '',
      departureDate: flight.departure?.datetime ? flight.departure.datetime.split('T')[0] : '',
      returnDate: flight.returnFlight?.datetime ? flight.returnFlight.datetime.split('T')[0] : '',
      adults: flight.passengers?.adults?.toString() || "1",
      children: flight.passengers?.children || 0,
      infants: flight.passengers?.infants || 0,
      flightClass: flight.class || 'Economy',
      preferredAirline: flight.airline || '',
      remarks: flight.remarks || ''
    }));
  };

  const handleHotelPackageSelect = (hotel) => {
    setFormData(prev => ({
      ...prev,
      selectedHotelPackage: hotel._id,
      goingTo: hotel.location?.city || '',
      hotelDetails: {
        checkIn: hotel.checkIn ? new Date(hotel.checkIn).toISOString().split('T')[0] : '',
        checkOut: hotel.checkOut ? new Date(hotel.checkOut).toISOString().split('T')[0] : '',
        roomType: hotel.roomType || 'Standard',
        adults: hotel.guests?.adults || 2,
        children: hotel.guests?.children || 0,
        mealPlan: hotel.mealPlan || 'breakfast'
      },
      hotelPreference: hotel.starRating?.toString() || '3',
      remarks: hotel.remarks || ''
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (activeTab < requirementTypes.length - 1) {
      setActiveTab(activeTab + 1);
    } else {
      const payload = {
        queryId: query._id,
        formData: formData,
        leadId: query.leadId?._id || query.leadId,
        customer: customer,
        employee: employee
      };

      console.log('Submitting edit payload:', payload);

      try {
        const response = await axios.put(
          "http://localhost:8000/api/employee/edit-query",
          payload
        );

        console.log('Query updated successfully:', response.data);
        alert('Query updated successfully!');
        navigate('/query/edit-query');
      } catch (error) {
        console.error('Error updating query:', error);
        alert('Failed to update the query. Please try again.');
      }
    }
  };

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
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

    const selectionTabs = (type) => (
      <div className="mb-6">
        <div className="flex border-b border-gray-200">
          <button
            type="button"
            onClick={() => setFormData({...formData, [`${type.toLowerCase()}SelectionType`]: 'new'})}
            className={`py-2 px-4 font-medium text-sm ${formData[`${type.toLowerCase()}SelectionType`] === 'new' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Create New {type}
          </button>
          <button
            type="button"
            onClick={() => setFormData({...formData, [`${type.toLowerCase()}SelectionType`]: 'existing'})}
            className={`py-2 px-4 font-medium text-sm ${formData[`${type.toLowerCase()}SelectionType`] === 'existing' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Select From Existing
          </button>
          <button
            type="button"
            onClick={() => setFormData({...formData, [`${type.toLowerCase()}SelectionType`]: 'thirdParty'})}
            className={`py-2 px-4 font-medium text-sm ${formData[`${type.toLowerCase()}SelectionType`] === 'thirdParty' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Third Party {type}
          </button>
        </div>
      </div>
    );

    const flightFormFields = (
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

    const existingFlightPackages = (
      <div>
        {flightLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div>
            <div className="bg-white p-4 rounded-lg shadow-md mb-6">
              <h2 className="text-xl font-semibold mb-4">Filter Flight Packages</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Departure City
                  </label>
                  <input
                    type="text"
                    name="departureCity"
                    value={flightFilters.departureCity}
                    onChange={handleFlightFilterChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Arrival City
                  </label>
                  <input
                    type="text"
                    name="arrivalCity"
                    value={flightFilters.arrivalCity}
                    onChange={handleFlightFilterChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Min Price
                  </label>
                  <input
                    type="number"
                    name="minPrice"
                    value={flightFilters.minPrice}
                    onChange={handleFlightFilterChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Sort By
                  </label>
                  <select
                    name="sort"
                    value={flightFilters.sort}
                    onChange={handleFlightFilterChange}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  >
                    <option value="">Default</option>
                    <option value="price_asc">Price: Low to High</option>
                    <option value="price_desc">Price: High to Low</option>
                    <option value="duration">Duration</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {flightPackages.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">
                    No flight packages found matching your criteria
                  </p>
                </div>
              ) : (
                flightPackages.map((flight) => (
                  <div
                    key={flight._id}
                    className={`bg-white rounded-lg shadow-md overflow-hidden border-2 ${
                      formData.selectedFlightPackage === flight._id ? 'border-blue-500' : 'border-transparent'
                    }`}
                  >
                    <div className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-bold text-gray-800">
                            {flight.departure.city} ({flight.departure.airport}) → {flight.arrival.city} ({flight.arrival.airport})
                          </h3>
                          <p className="text-gray-600">
                            {flight.airline} • {flight.flightNumber} • {flight.class.replace("_", " ")}
                          </p>
                        </div>
                        <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                          Available
                        </span>
                      </div>

                      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <p className="font-medium">Departure</p>
                          <p>{new Date(flight.departure.datetime).toLocaleString()}</p>
                          <p>
                            {flight.departure.airport} {flight.departure.terminal && (`Terminal ${flight.departure.terminal}`)}
                          </p>
                        </div>

                        <div className="text-center">
                          <p className="font-medium">{formatDuration(flight.duration)}</p>
                          <div className="relative pt-4">
                            <div className="absolute inset-0 flex items-center" aria-hidden="true">
                              <div className="w-full border-t border-gray-300" />
                            </div>
                            <div className="relative flex justify-center">
                              <span className="px-2 bg-white text-sm text-gray-500">
                                {flight.stops > 0 ? `${flight.stops} stop${flight.stops > 1 ? 's' : ''}` : 'Non-stop'}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <p className="font-medium">Arrival</p>
                          <p>{new Date(flight.arrival.datetime).toLocaleString()}</p>
                          <p>
                            {flight.arrival.airport} {flight.arrival.terminal && (`Terminal ${flight.arrival.terminal}`)}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 flex justify-between items-center">
                        <div>
                          <p className="text-sm text-gray-500">Total Price</p>
                          <p className="text-xl font-bold text-blue-600">
                            {flight.currency} {flight.price?.toLocaleString() ?? "0"}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleFlightPackageSelect(flight)}
                          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        >
                          {formData.selectedFlightPackage === flight._id ? 'Selected' : 'Select'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    );

    const ThirdPartyFlight = (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Booking Reference / PNR *</label>
                <input
                    type="text"
                    name="pnr"
                    value={formData.thirdPartyFlightDetails.pnr}
                    onChange={(e) => handleNestedInputChange('thirdPartyFlightDetails', e)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    required
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Supplier / Vendor Name *</label>
                <input
                    type="text"
                    name="supplier"
                    value={formData.thirdPartyFlightDetails.supplier}
                    onChange={(e) => handleNestedInputChange('thirdPartyFlightDetails', e)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    required
                />
            </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Total Cost *</label>
                <input
                    type="number"
                    name="cost"
                    value={formData.thirdPartyFlightDetails.cost}
                    onChange={(e) => handleNestedInputChange('thirdPartyFlightDetails', e)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    min="0"
                    step="0.01"
                    required
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Upload Confirmation</label>
                <input
                    type="file"
                    name="confirmationFile"
                    onChange={(e) => handleNestedInputChange('thirdPartyFlightDetails', { target: { name: 'confirmationFile', value: e.target.files[0] } })}
                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
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
      </div>
    );

    const hotelFormFields = (
      <div className="space-y-6">
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Adults</label>
            <input
              type="number"
              name="adults"
              value={formData.hotelDetails.adults}
              onChange={(e) => handleNestedInputChange('hotelDetails', e)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              min="1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Children</label>
            <input
              type="number"
              name="children"
              value={formData.hotelDetails.children}
              onChange={(e) => handleNestedInputChange('hotelDetails', e)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              min="0"
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
              {roomTypeOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Meal Plan</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
            {mealPlanOptions.map(option => (
              <label key={option} className="inline-flex items-center">
                <input
                  type="radio"
                  name="mealPlan"
                  checked={formData.hotelDetails.mealPlan === option}
                  onChange={() => setFormData(prev => ({
                    ...prev,
                    hotelDetails: {
                      ...prev.hotelDetails,
                      mealPlan: option
                    }
                  }))}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <span className="ml-2 text-gray-700 capitalize">{option.replace('_', ' ')}</span>
              </label>
            ))}
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

    const existingHotelPackages = (
      <div>
        {hotelLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div>
            <div className="bg-white p-4 rounded-lg shadow-md mb-6">
              <h2 className="text-xl font-semibold mb-4">Filter Hotel Packages</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    City
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={hotelFilters.city}
                    onChange={handleHotelFilterChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Country
                  </label>
                  <input
                    type="text"
                    name="country"
                    value={hotelFilters.country}
                    onChange={handleHotelFilterChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Star Rating
                  </label>
                  <select
                    name="starRating"
                    value={hotelFilters.starRating}
                    onChange={handleHotelFilterChange}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  >
                    <option value="">Any</option>
                    <option value="1">1 Star</option>
                    <option value="2">2 Stars</option>
                    <option value="3">3 Stars</option>
                    <option value="4">4 Stars</option>
                    <option value="5">5 Stars</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Min Price
                  </label>
                  <input
                    type="number"
                    name="minPrice"
                    value={hotelFilters.minPrice}
                    onChange={handleHotelFilterChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Sort By
                  </label>
                  <select
                    name="sort"
                    value={hotelFilters.sort}
                    onChange={handleHotelFilterChange}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  >
                    <option value="">Default</option>
                    <option value="price_asc">Price: Low to High</option>
                    <option value="price_desc">Price: High to Low</option>
                    <option value="rating">Rating</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {hotelPackages.length === 0 ? (
                <div className="text-center py-12 col-span-3">
                  <p className="text-gray-500">
                    No hotel packages found matching your criteria
                  </p>
                </div>
              ) : (
                hotelPackages.map((hotel) => (
                  <div
                    key={hotel._id}
                    className={`bg-white rounded-lg shadow-md overflow-hidden border-2 ${
                      formData.selectedHotelPackage === hotel._id ? 'border-blue-500' : 'border-transparent'
                    }`}
                  >
                    <img
                      src={hotel.images?.[0] || "https://via.placeholder.com/300x200?text=No+Image"}
                      alt={hotel.name}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-4">
                      <div className="flex justify-between items-start">
                        <h3 className="text-lg font-bold text-gray-800">{hotel.name}</h3>
                        <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                          Available
                        </span>
                      </div>

                      <div className="mt-2 flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`w-4 h-4 ${
                              i < hotel.starRating ? "text-yellow-400" : "text-gray-300"
                            }`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                        <span className="ml-1 text-gray-600 text-sm">
                          {hotel.starRating} stars
                        </span>
                      </div>

                      <p className="mt-2 text-gray-600">
                        <svg
                          className="w-4 h-4 inline mr-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                        {hotel.location?.city}, {hotel.location?.country}
                      </p>

                      <div className="mt-4 grid grid-cols-2 gap-2">
                        <div>
                          <p className="text-sm text-gray-500">Room Type</p>
                          <p className="font-medium">{hotel.roomType}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Meal Plan</p>
                          <p className="font-medium capitalize">
                            {hotel.mealPlan?.replace('_', ' ') || 'Not specified'}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Check In</p>
                          <p className="font-medium">
                            {formatDate(hotel.checkIn)}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Check Out</p>
                          <p className="font-medium">
                            {formatDate(hotel.checkOut)}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4">
                        <p className="text-sm text-gray-500">Guests</p>
                        <p className="font-medium">
                          {hotel.guests?.adults || 0} Adults, {hotel.guests?.children || 0} Children
                        </p>
                      </div>

                      <div className="mt-4 flex justify-between items-center">
                        <div>
                          <p className="text-sm text-gray-500">Total Price</p>
                          <p className="text-xl font-bold text-blue-600">
                            {hotel.currency} {hotel.totalPrice?.toLocaleString() ?? "0"}
                          </p>
                          <p className="text-sm text-gray-500">
                            {hotel.nights} night{hotel.nights !== 1 ? 's' : ''}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleHotelPackageSelect(hotel)}
                          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        >
                          {formData.selectedHotelPackage === hotel._id ? 'Selected' : 'Select'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    );

    const ThirdPartyHotel = (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Booking Confirmation # *</label>
                    <input
                        type="text"
                        name="confirmationNumber"
                        value={formData.thirdPartyHotelDetails.confirmationNumber}
                        onChange={(e) => handleNestedInputChange('thirdPartyHotelDetails', e)}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Supplier / Vendor Name *</label>
                    <input
                        type="text"
                        name="supplier"
                        value={formData.thirdPartyHotelDetails.supplier}
                        onChange={(e) => handleNestedInputChange('thirdPartyHotelDetails', e)}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        required
                    />
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Total Cost *</label>
                    <input
                        type="number"
                        name="cost"
                        value={formData.thirdPartyHotelDetails.cost}
                        onChange={(e) => handleNestedInputChange('thirdPartyHotelDetails', e)}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        min="0"
                        step="0.01"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Upload Voucher</label>
                    <input
                        type="file"
                        name="voucherFile"
                        onChange={(e) => handleNestedInputChange('thirdPartyHotelDetails', { target: { name: 'voucherFile', value: e.target.files[0] } })}
                        className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
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
        </div>
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
            <div>
              {selectionTabs('Flight')}
              {formData.flightSelectionType === 'new'
                ? flightFormFields
                : formData.flightSelectionType === 'existing'
                ? existingFlightPackages
                : ThirdPartyFlight
              }
            </div>
          );
        case 'Hotel':
          return (
            <div>
              {selectionTabs('Hotel')}
              {formData.hotelSelectionType === 'new'
                ? hotelFormFields
                : formData.hotelSelectionType === 'existing'
                ? existingHotelPackages
                : ThirdPartyHotel
              }
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
              <h1 className="text-2xl font-bold">Edit Travel Query</h1>
              <p className="text-sm opacity-90">Editing: {query?.name || 'Unnamed Query'}</p>
              <p className="text-xs opacity-80 mt-1">Query ID: {query?._id || 'N/A'}</p>
            </div>
            <div className="bg-blue-500 text-xs px-3 py-1 rounded-full">
              {customerData.type || 'Customer'}
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
              <p className="text-sm opacity-90">Status: {query?.onStatus || 'N/A'}</p>
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
              <p className="text-sm text-gray-500 mb-6">Edit the details for the {requirementTypes[activeTab].toLowerCase()} requirements.</p>
              
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
              
              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => navigate('/query/edit-query')}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  Cancel
                </button>
                
                <button
                  type="submit"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  {activeTab < requirementTypes.length - 1 ? (
                    <>
                      Save & Continue
                      <svg className="-mr-1 ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    </>
                  ) : 'Update Query'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditQuery;