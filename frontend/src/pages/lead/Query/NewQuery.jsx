import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';

function NewQuery({ leadId, user, customer }) {
  // Customer profile data
  const employee = user;
  const [customerData, setCustomerData] = useState({
    name: '',
    owner: '',
    contact: '',
    type: '',
    email: '',
    activeSince: ''
  });

  useEffect(() => {
    console.log('Lead ID:', leadId);
    console.log('Customer:', customer);
    console.log('Employee:', employee);

    if (customer) {
      setCustomerData({
        name: customer.user.firstName + ' ' + customer.user.lastName || '',
        owner: customer.user.firstName + ' ' + customer.user.lastName || '',
        contact: customer.user.phone || '',
        type: customer.type || '',
        email: customer.user ? customer.user.email || '' : '',
        activeSince: customer.user.createdAt || ''
      });
    }
  }, [customer]);

  // Requirement types and active tab state
  const requirementTypes = [
    'Package', 'Flight', 'Hotel', 'Transfer', 'Visa', 
    'Sightseeing', 'Miscellaneous', 'Company Formation', 'Forex', 'Review'
  ];
  const [activeTab, setActiveTab] = useState(0);
  
  // Send Itinerary Modal State
  const [showItineraryModal, setShowItineraryModal] = useState(false);
  const [itinerarySelections, setItinerarySelections] = useState({});
  const [sendingItinerary, setSendingItinerary] = useState(false);

  // Main form data structure matching the schema
  const [formData, setFormData] = useState({
    // Query Status
    onStatus: 'draft',
    
    // Package Details
    package: {
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
      name: '',
      description: '',
      tags: []
    },

    // Pricing
    pricing: {
      basePrice: '',
      components: {
        flights: '',
        accommodation: '',
        visas: '',
        transfers: '',
        activities: '',
        taxes: '',
        fees: ''
      },
      discounts: {
        earlyBird: '',
        group: '',
        promoCode: ''
      },
      totalPrice: '',
      currency: 'USD',
      paymentPlan: {
        depositRequired: false,
        depositAmount: '',
        installmentOptions: []
      }
    },

    // Common fields
    expectedClosureDate: '',
    expectedClosureAmount: '',
    remarks: ''
  });

  // Day-wise data for all requirement types
  const [dayWiseData, setDayWiseData] = useState({
    flights: [
      {
        day: 1,
        date: '',
        flightType: 'oneway',
        airline: '',
        flightNumber: '',
        departure: {
          airport: '',
          terminal: '',
          datetime: '',
          city: ''
        },
        arrival: {
          airport: '',
          terminal: '',
          datetime: '',
          city: ''
        },
        duration: '',
        cabinClass: 'economy',
        baggage: {
          carryOn: { allowed: false, weight: '', dimensions: '' },
          checked: { allowed: false, pieces: '', weight: '' }
        },
        refundable: false,
        adults: 1,
        children: 0,
        infants: 0,
        preferredAirline: '',
        selectionType: 'new',
        selectedFlightPackage: null,
        thirdPartyDetails: {
          pnr: '',
          supplier: '',
          cost: '',
          confirmationFile: null
        },
        price: '',
        remarks: ''
      }
    ],
    hotels: [
      {
        day: 1,
        date: '',
        name: '',
        starRating: 3,
        location: {
          address: '',
          city: '',
          coordinates: []
        },
        roomType: 'Standard',
        amenities: [],
        checkIn: '',
        checkOut: '',
        cancellationPolicy: [],
        mealPlan: 'breakfast',
        adults: 2,
        children: 0,
        selectionType: 'new',
        selectedHotelPackage: null,
        thirdPartyDetails: {
          confirmationNumber: '',
          supplier: '',
          cost: '',
          voucherFile: null
        },
        price: '',
        remarks: ''
      }
    ],
    transfers: [
      {
        day: 1,
        date: '',
        pickup: '',
        dropoff: '',
        vehicleType: 'Sedan',
        time: '',
        duration: '',
        cost: '',
        price: '',
        remarks: ''
      }
    ],
    visas: [
      {
        day: 1,
        date: '',
        country: '',
        type: 'tourist',
        processingTime: '',
        requirements: [],
        price: '',
        remarks: ''
      }
    ],
    sightseeing: [
      {
        day: 1,
        date: '',
        activity: '',
        location: '',
        duration: '',
        time: '',
        cost: '',
        price: '',
        includes: [],
        remarks: ''
      }
    ],
    miscellaneous: [
      {
        day: 1,
        date: '',
        description: '',
        category: '',
        cost: '',
        price: '',
        remarks: ''
      }
    ],
    companyFormation: [
      {
        day: 1,
        date: '',
        description: '',
        requirements: [],
        timeline: '',
        documents: [],
        price: '',
        remarks: '',
        expectedClosureDate: '',
        expectedClosureAmount: ''
      }
    ],
    forex: [
      {
        day: 1,
        date: '',
        description: '',
        currency: 'USD',
        amount: '',
        exchangeRate: '',
        deliveryDate: '',
        price: '',
        remarks: '',
        expectedClosureDate: '',
        expectedClosureAmount: ''
      }
    ]
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
  const cabinClassOptions = ['economy', 'premium', 'business', 'first'];
  const visaTypeOptions = ['tourist', 'business', 'student', 'work'];
  const currencyOptions = ['USD', 'EUR', 'GBP', 'INR'];
  const vehicleTypeOptions = ['Sedan', 'SUV', 'Van', 'Luxury', 'Bus'];
  const flightTypeOptions = ['oneway', 'roundtrip', 'multicity'];

  // Initialize itinerary selections based on requirement types
  useEffect(() => {
    const initialSelections = {};
    requirementTypes.forEach(type => {
      initialSelections[type] = {
        selected: false,
        withAmount: false
      };
    });
    setItinerarySelections(initialSelections);
  }, []);

  // Helper function to calculate date for a specific day
  const calculateDateForDay = (dayNumber) => {
    if (!formData.package.specificDate) return '';
    
    const startDate = new Date(formData.package.specificDate);
    const dayDate = new Date(startDate);
    dayDate.setDate(startDate.getDate() + (dayNumber - 1));
    
    return dayDate.toISOString().split('T')[0];
  };

  // Helper function to calculate dates for all days
  const calculateAllDates = () => {
    if (!formData.package.specificDate || !formData.package.noOfDays) return;
    
    const numberOfDays = parseInt(formData.package.noOfDays);
    const updatedDayWiseData = { ...dayWiseData };
    
    Object.keys(updatedDayWiseData).forEach(category => {
      updatedDayWiseData[category] = Array.from({ length: numberOfDays }, (_, i) => {
        const existingDay = updatedDayWiseData[category][i] || {};
        return {
          day: i + 1,
          date: calculateDateForDay(i + 1),
          ...getDefaultDayData(category),
          ...existingDay
        };
      });
    });
    
    setDayWiseData(updatedDayWiseData);
  };

  // Auto-create days and calculate dates when noOfDays or specificDate changes
  useEffect(() => {
    if (formData.package.noOfDays && formData.package.noOfDays > 0) {
      calculateAllDates();
    }
  }, [formData.package.noOfDays, formData.package.specificDate]);

  // Helper function to get default day data for each category
  const getDefaultDayData = (category) => {
    const defaults = {
      flights: {
        flightType: 'oneway',
        airline: '',
        flightNumber: '',
        departure: { airport: '', terminal: '', datetime: '', city: '' },
        arrival: { airport: '', terminal: '', datetime: '', city: '' },
        duration: '',
        cabinClass: 'economy',
        baggage: {
          carryOn: { allowed: false, weight: '', dimensions: '' },
          checked: { allowed: false, pieces: '', weight: '' }
        },
        refundable: false,
        adults: 1,
        children: 0,
        infants: 0,
        preferredAirline: '',
        selectionType: 'new',
        selectedFlightPackage: null,
        thirdPartyDetails: {
          pnr: '',
          supplier: '',
          cost: '',
          confirmationFile: null
        },
        price: '',
        remarks: ''
      },
      hotels: {
        name: '',
        starRating: 3,
        location: { address: '', city: '', coordinates: [] },
        roomType: 'Standard',
        amenities: [],
        checkIn: '',
        checkOut: '',
        cancellationPolicy: [],
        mealPlan: 'breakfast',
        adults: 2,
        children: 0,
        selectionType: 'new',
        selectedHotelPackage: null,
        thirdPartyDetails: {
          confirmationNumber: '',
          supplier: '',
          cost: '',
          voucherFile: null
        },
        price: '',
        remarks: ''
      },
      transfers: {
        pickup: '',
        dropoff: '',
        vehicleType: 'Sedan',
        time: '',
        duration: '',
        cost: '',
        price: '',
        remarks: ''
      },
      visas: {
        country: '',
        type: 'tourist',
        processingTime: '',
        requirements: [],
        price: '',
        remarks: ''
      },
      sightseeing: {
        activity: '',
        location: '',
        duration: '',
        time: '',
        cost: '',
        price: '',
        includes: [],
        remarks: ''
      },
      miscellaneous: {
        description: '',
        category: '',
        cost: '',
        price: '',
        remarks: ''
      },
      companyFormation: {
        description: '',
        requirements: [],
        timeline: '',
        documents: [],
        price: '',
        remarks: '',
        expectedClosureDate: '',
        expectedClosureAmount: ''
      },
      forex: {
        description: '',
        currency: 'USD',
        amount: '',
        exchangeRate: '',
        deliveryDate: '',
        price: '',
        remarks: '',
        expectedClosureDate: '',
        expectedClosureAmount: ''
      }
    };
    return defaults[category] || {};
  };

  // Calculate flight duration
  const calculateFlightDuration = (departureDateTime, arrivalDateTime) => {
    if (!departureDateTime || !arrivalDateTime) return '';
    
    const departure = new Date(departureDateTime);
    const arrival = new Date(arrivalDateTime);
    const durationMs = arrival - departure;
    
    if (durationMs < 0) return 'Invalid dates';
    
    const hours = Math.floor(durationMs / (1000 * 60 * 60));
    const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}h ${minutes}m`;
  };

  // Update duration when departure or arrival times change
  useEffect(() => {
    dayWiseData.flights.forEach((flight, dayIndex) => {
      if (flight.departure.datetime && flight.arrival.datetime) {
        const duration = calculateFlightDuration(flight.departure.datetime, flight.arrival.datetime);
        if (duration !== flight.duration) {
          handleDayFieldChange('flights', dayIndex, 'duration', duration);
        }
      }
    });
  }, [dayWiseData.flights]);

  // Fetch flight packages when flight tab is active
  useEffect(() => {
    if (requirementTypes[activeTab] === 'Flight') {
      const hasExistingSelection = dayWiseData.flights.some(flight => 
        flight.selectionType === 'existing'
      );
      if (hasExistingSelection) {
        fetchFlightPackages();
      }
    }
  }, [activeTab, flightFilters]);

  // Fetch hotel packages when hotel tab is active
  useEffect(() => {
    if (requirementTypes[activeTab] === 'Hotel') {
      const hasExistingSelection = dayWiseData.hotels.some(hotel => 
        hotel.selectionType === 'existing'
      );
      if (hasExistingSelection) {
        fetchHotelPackages();
      }
    }
  }, [activeTab, hotelFilters]);

  // Enhanced input handlers for nested objects
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      const keys = name.split('.');
      setFormData(prev => {
        const updated = { ...prev };
        let current = updated;
        
        for (let i = 0; i < keys.length - 1; i++) {
          current = current[keys[i]] = { ...current[keys[i]] };
        }
        
        current[keys[keys.length - 1]] = type === 'checkbox' ? checked : value;
        return updated;
      });
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleNestedInputChange = (section, e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [name]: type === 'checkbox' ? checked : value
      }
    }));
  };

  // Day-wise data handlers
  const addNewDay = (category) => {
    const newDayNumber = dayWiseData[category].length + 1;
    setDayWiseData(prev => ({
      ...prev,
      [category]: [
        ...prev[category],
        {
          day: newDayNumber,
          date: calculateDateForDay(newDayNumber),
          ...getDefaultDayData(category)
        }
      ]
    }));
  };

  const removeDay = (category, dayIndex) => {
    if (dayWiseData[category].length > 1) {
      setDayWiseData(prev => ({
        ...prev,
        [category]: prev[category].filter((_, index) => index !== dayIndex)
      }));
    }
  };

  const handleDayFieldChange = (category, dayIndex, field, value) => {
    setDayWiseData(prev => ({
      ...prev,
      [category]: prev[category].map((day, index) => 
        index === dayIndex ? { ...day, [field]: value } : day
      )
    }));
  };

  const handleDayDeepFieldChange = (category, dayIndex, section, field, value) => {
    setDayWiseData(prev => ({
      ...prev,
      [category]: prev[category].map((day, index) => {
        if (index === dayIndex) {
          return {
            ...day,
            [section]: {
              ...day[section],
              [field]: value
            }
          };
        }
        return day;
      })
    }));
  };

  const handleDayArrayFieldChange = (category, dayIndex, section, field, value) => {
    setDayWiseData(prev => ({
      ...prev,
      [category]: prev[category].map((day, index) => {
        if (index === dayIndex) {
          const currentArray = day[section]?.[field] || [];
          const updatedArray = currentArray.includes(value)
            ? currentArray.filter(item => item !== value)
            : [...currentArray, value];
          
          return {
            ...day,
            [section]: {
              ...day[section],
              [field]: updatedArray
            }
          };
        }
        return day;
      })
    }));
  };

  const addArrayItem = (category, dayIndex, section, field, newItem) => {
    setDayWiseData(prev => ({
      ...prev,
      [category]: prev[category].map((day, index) => {
        if (index === dayIndex) {
          const currentArray = day[section]?.[field] || [];
          return {
            ...day,
            [section]: {
              ...day[section],
              [field]: [...currentArray, newItem]
            }
          };
        }
        return day;
      })
    }));
  };

  const removeArrayItem = (category, dayIndex, section, field, itemIndex) => {
    setDayWiseData(prev => ({
      ...prev,
      [category]: prev[category].map((day, index) => {
        if (index === dayIndex) {
          const currentArray = day[section]?.[field] || [];
          return {
            ...day,
            [section]: {
              ...day[section],
              [field]: currentArray.filter((_, idx) => idx !== itemIndex)
            }
          };
        }
        return day;
      })
    }));
  };

  // Checkbox handlers for arrays
  const handleCheckboxChange = (section, field, option) => {
    setFormData(prev => {
      const currentOptions = prev[section][field] || [];
      if (currentOptions.includes(option)) {
        return {
          ...prev,
          [section]: {
            ...prev[section],
            [field]: currentOptions.filter(item => item !== option)
          }
        };
      } else {
        return {
          ...prev,
          [section]: {
            ...prev[section],
            [field]: [...currentOptions, option]
          }
        };
      }
    });
  };

  // Flight package handlers
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

  const handleFlightPackageSelect = (category, dayIndex, flight) => {
    setDayWiseData(prev => ({
      ...prev,
      [category]: prev[category].map((day, index) => {
        if (index === dayIndex) {
          return {
            ...day,
            selectedFlightPackage: flight._id,
            flightType: flight.tripType || 'oneway',
            airline: flight.airline || '',
            flightNumber: flight.flightNumber || '',
            departure: {
              airport: flight.departure?.airport || '',
              terminal: flight.departure?.terminal || '',
              datetime: flight.departure?.datetime || '',
              city: flight.departure?.city || ''
            },
            arrival: {
              airport: flight.arrival?.airport || '',
              terminal: flight.arrival?.terminal || '',
              datetime: flight.arrival?.datetime || '',
              city: flight.arrival?.city || ''
            },
            duration: flight.duration || '',
            cabinClass: flight.class || 'economy',
            adults: flight.passengers?.adults || 1,
            children: flight.passengers?.children || 0,
            infants: flight.passengers?.infants || 0,
            preferredAirline: flight.airline || '',
            price: flight.price || ''
          };
        }
        return day;
      })
    }));
  };

  const handleHotelPackageSelect = (category, dayIndex, hotel) => {
    setDayWiseData(prev => ({
      ...prev,
      [category]: prev[category].map((day, index) => {
        if (index === dayIndex) {
          return {
            ...day,
            selectedHotelPackage: hotel._id,
            name: hotel.name || '',
            starRating: hotel.starRating || 3,
            location: {
              address: hotel.location?.address || '',
              city: hotel.location?.city || '',
              coordinates: hotel.location?.coordinates || []
            },
            roomType: hotel.roomType || 'Standard',
            amenities: hotel.amenities || [],
            checkIn: hotel.checkIn || '',
            checkOut: hotel.checkOut || '',
            mealPlan: hotel.mealPlan || 'breakfast',
            adults: hotel.guests?.adults || 2,
            children: hotel.guests?.children || 0,
            price: hotel.totalPrice || ''
          };
        }
        return day;
      })
    }));
  };

  // Calculate total price for review tab
  const calculateTotalPrice = () => {
    let total = 0;

    // Add package expected closure amount
    if (formData.package.expectedClosureAmount) {
      total += parseFloat(formData.package.expectedClosureAmount) || 0;
    }

    // Add day-wise prices
    Object.keys(dayWiseData).forEach(category => {
      dayWiseData[category].forEach(day => {
        if (day.price) {
          total += parseFloat(day.price) || 0;
        }
      });
    });

    return total.toFixed(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (activeTab < requirementTypes.length - 1) {
      setActiveTab(activeTab + 1);
    } else {
      // Final submission - structure data according to schema
      const payload = {
        // Core references
        leadId,
        customer: {
          id: customer?._id,
          name: customerData.name,
          email: customerData.email,
          contact: customerData.contact,
          type: customerData.type
        },
        employee: {
          id: employee.employeeId,
          email: employee.email,
          name: employee.name || 'Travel Consultant'
        },

        // Query status
        onStatus: formData.onStatus,

        // Package data
        package: formData.package,

        // Day-wise data
        dayWiseData,

        // Individual requirement types
        includes: {
          flights: requirementTypes.includes('Flight'),
          hotels: requirementTypes.includes('Hotel'),
          visas: requirementTypes.includes('Visa'),
          meals: {
            breakfast: formData.package.foodPreferences.includes('Breakfast'),
            lunch: formData.package.foodPreferences.includes('Lunch'),
            dinner: formData.package.foodPreferences.includes('Dinner')
          },
          transfers: requirementTypes.includes('Transfer'),
          activities: requirementTypes.includes('Sightseeing'),
          insurance: formData.package.inclusions.includes('Insurance')
        },

        // Pricing information
        pricing: formData.pricing,

        // Expected closure
        expectedClosureDate: formData.expectedClosureDate,
        expectedClosureAmount: formData.expectedClosureAmount
      };

      console.log('Submitting payload:', payload);

      try {
        const response = await axios.post(
          "http://localhost:8000/api/employee/new-query",
          payload
        );

        console.log('Form submitted successfully:', response.data);
        alert('Query created successfully!');
      } catch (error) {
        console.error('Error submitting form:', error);
        alert('Failed to submit the query. Please try again.');
      }
    }
  };

  // Itinerary Modal Handlers
  const handleOpenItineraryModal = () => {
    setShowItineraryModal(true);
  };

  const handleCloseItineraryModal = () => {
    setShowItineraryModal(false);
  };

  const handleItinerarySelectionChange = (requirementType, field, value) => {
    setItinerarySelections(prev => ({
      ...prev,
      [requirementType]: {
        ...prev[requirementType],
        [field]: value
      }
    }));
  };

  const handleSendItinerary = async () => {
    setSendingItinerary(true);
    try {
      const selectedItems = Object.entries(itinerarySelections)
        .filter(([_, data]) => data.selected)
        .map(([type, data]) => ({
          type,
          withAmount: data.withAmount
        }));

      // Prepare itinerary data
      const itineraryData = {};
      
      if (itinerarySelections.Package?.selected) {
        itineraryData.package = {
          ...formData.package,
          expectedClosureAmount: itinerarySelections.Package.withAmount ? formData.package.expectedClosureAmount : undefined
        };
      }

      // Include day-wise data for selected types
      Object.entries(itinerarySelections).forEach(([type, data]) => {
        if (data.selected && type !== 'Package') {
          const categoryMap = {
            'Flight': 'flights',
            'Hotel': 'hotels',
            'Transfer': 'transfers',
            'Visa': 'visas',
            'Sightseeing': 'sightseeing',
            'Miscellaneous': 'miscellaneous',
            'Company Formation': 'companyFormation',
            'Forex': 'forex'
          };
          
          const category = categoryMap[type];
          if (category && dayWiseData[category]) {
            itineraryData[category] = dayWiseData[category];
          }
        }
      });

      // Generate HTML content for the itinerary
      const htmlContent = generateItineraryHTML({
        customerName: customerData.name,
        customerEmail: customerData.email,
        customerContact: customerData.contact,
        queryDate: new Date().toLocaleDateString(),
        generatedDate: new Date().toLocaleString(),
        employeeEmail: employee.email,
        employeeName: employee.name || 'Travel Consultant',
        ...itineraryData,
        selectedItems
      });

      const payload = {
        leadId,
        customer: {
          id: customer?._id,
          name: customerData.name,
          email: customerData.email,
          contact: customerData.contact
        },
        employee: {
          id: employee.employeeId,
          email: employee.email,
          name: employee.name || 'Travel Consultant'
        },
        selectedItems,
        data: itineraryData,
        htmlContent: htmlContent,
        to_mail: customerData.email,
        from_mail: employee.email
      };

      console.log('Sending itinerary to backend:', payload);

      // Send to backend endpoint that handles EmailJS
      const response = await axios.post(
        "http://localhost:8000/api/service/itinerary/query/send",
        payload
      );

      if (response.data.success) {
        console.log('Itinerary sent successfully:', response.data);
        alert('Itinerary sent successfully!');
        handleCloseItineraryModal();
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      console.error('Error sending itinerary:', error);
      alert('Failed to send itinerary. Please try again.');
    } finally {
      setSendingItinerary(false);
    }
  };

  // Generate HTML content for the itinerary
  const generateItineraryHTML = (data) => {
    return `
    <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Travel Itinerary - ${data.customerName} | Travel CRM</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <style>
        * { 
            margin: 0; 
            padding: 0; 
            box-sizing: border-box; 
        }
        
        body { 
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; 
            line-height: 1.6; 
            color: #2D3748; 
            background: linear-gradient(135deg, #f8fafc 0%, #edf2f7 100%);
            padding: 30px; 
            min-height: 100vh;
        }
        
        .container { 
            max-width: 1000px; 
            margin: 0 auto; 
            background: white; 
            box-shadow: 
                0 4px 6px -1px rgba(0, 0, 0, 0.1), 
                0 2px 4px -1px rgba(0, 0, 0, 0.06),
                0 20px 25px -5px rgba(0, 0, 0, 0.1);
            border-radius: 16px; 
            overflow: hidden; 
            position: relative;
        }
        
        /* Header with sophisticated gradient */
        .header { 
            background: linear-gradient(135deg, #FF6B35 0%, #F7931E 50%, #FFA048 100%);
            color: white; 
            padding: 40px 35px; 
            text-align: center; 
            position: relative;
            overflow: hidden;
        }
        
        .header::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ffffff' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E");
            opacity: 0.3;
        }
        
        .header h1 { 
            font-size: 2.5em; 
            margin-bottom: 8px; 
            font-weight: 700;
            letter-spacing: -0.5px;
        }
        
        .header .subtitle { 
            font-size: 1.15em; 
            opacity: 0.9; 
            font-weight: 400;
            letter-spacing: 0.2px;
        }
        
        .crm-badge {
            position: absolute;
            top: 25px;
            right: 25px;
            background: rgba(255,255,255,0.15);
            backdrop-filter: blur(10px);
            padding: 8px 16px;
            border-radius: 12px;
            font-size: 0.85em;
            font-weight: 600;
            border: 1px solid rgba(255,255,255,0.2);
        }
        
        /* Customer Info Section */
        .customer-info { 
            background: #f8fafc; 
            padding: 30px 35px; 
            border-bottom: 1px solid #e2e8f0; 
        }
        
        .info-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
        }
        
        .info-card {
            background: white;
            padding: 20px;
            border-radius: 12px;
            box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
            border-left: 4px solid #FF6B35;
        }
        
        .info-label { 
            font-weight: 600; 
            color: #718096; 
            font-size: 0.85em; 
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 6px;
        }
        
        .info-value { 
            color: #2D3748; 
            font-size: 1.1em; 
            font-weight: 500;
        }
        
        /* Itinerary Sections */
        .itinerary-section { 
            padding: 30px 35px; 
            border-bottom: 1px solid #e2e8f0; 
        }
        
        .itinerary-section:last-of-type {
            border-bottom: none;
        }
        
        .section-title { 
            color: #2D3748; 
            font-size: 1.3em; 
            margin-bottom: 20px; 
            padding-bottom: 12px; 
            border-bottom: 2px solid #e2e8f0;
            font-weight: 600;
            display: flex;
            align-items: center;
            letter-spacing: -0.3px;
        }
        
        .section-icon {
            margin-right: 12px;
            background: #FFF5EB;
            padding: 10px;
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 44px;
            height: 44px;
        }
        
        /* Enhanced Tables */
        .details-table {
            width: 100%;
            border-collapse: separate;
            border-spacing: 0;
            margin-bottom: 20px;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
        }
        
        .details-table th {
            background: linear-gradient(135deg, #FFF5EB 0%, #FFEDD5 100%);
            text-align: left;
            padding: 16px 20px;
            font-weight: 600;
            color: #DD6B20;
            border-bottom: 1px solid #FBD38D;
            font-size: 0.9em;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        .details-table td {
            padding: 16px 20px;
            border-bottom: 1px solid #edf2f7;
            font-weight: 500;
        }
        
        .details-table tr:last-child td {
            border-bottom: none;
        }
        
        .details-table tr:nth-child(even) {
            background-color: #fafafa;
        }
        
        .details-table tr:hover {
            background-color: #f7fafc;
        }
        
        /* Amount Section */
        .amount-section { 
            background: linear-gradient(135deg, #f0fff4 0%, #e6fffa 100%); 
            padding: 20px 25px; 
            border-radius: 12px; 
            margin-top: 20px; 
            border-left: 4px solid #38A169;
            display: flex;
            justify-content: space-between;
            align-items: center;
            box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.05);
        }
        
        .amount-label { 
            font-weight: 600; 
            color: #22543D; 
            font-size: 1em;
        }
        
        .amount-value { 
            font-weight: 700; 
            color: #22543D; 
            font-size: 1.4em;
            letter-spacing: -0.5px;
        }
        
        /* Footer */
        .footer { 
            background: linear-gradient(135deg, #2D3748 0%, #4A5568 100%); 
            color: white; 
            padding: 40px 35px; 
            text-align: center; 
            position: relative;
            overflow: hidden;
        }
        
        .footer::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ffffff' fill-opacity='0.05' fill-rule='evenodd'/%3E%3C/svg%3E");
        }
        
        .footer-content {
            position: relative;
            z-index: 1;
        }
        
        .contact-info { 
            margin-top: 12px; 
            opacity: 0.8;
            font-size: 0.95em;
            line-height: 1.7;
        }
        
        .travel-crm-logo {
            font-weight: 700;
            color: #F6AD55;
            font-size: 1.2em;
            letter-spacing: 0.5px;
        }
        
        .footer-divider {
            height: 1px;
            background: rgba(255,255,255,0.2);
            margin: 25px 0;
        }
            .button{
               background-color: #FF6B35;
               color: white;
               padding: 10px 20px;
                text-decoration: none;
                border-radius: 5px;
                font-weight: 600;

            }

            .button a{
             text-decoration: none;
             color: white;
             padding: 10px 20px;
             border-radius: 5px;
             font-weight: 600;
            }
        
        /* Responsive Design */
        @media (max-width: 768px) {
            body {
                padding: 15px;
            }
            
            .container {
                border-radius: 12px;
            }
            
            .header, .customer-info, .itinerary-section {
                padding: 25px 20px;
            }
            
            .footer {
                padding: 30px 20px;
            }
            
            .info-grid {
                grid-template-columns: 1fr;
            }
            
            .crm-badge {
                position: static;
                display: inline-block;
                margin-top: 15px;
            }
            
            .details-table {
                display: block;
                overflow-x: auto;
            }
            
            .header h1 {
                font-size: 2em;
            }
        }
        
        /* Print Styles */
        @media print {
            body {
                background: white;
                padding: 0;
            }
            
            .container {
                box-shadow: none;
                border-radius: 0;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Travel Itinerary</h1>
            <div class="subtitle">Your Personalized Travel Plan</div>
            <div class="crm-badge">Travel CRM</div>
        </div>
        
        <div class="customer-info">
            <div class="info-grid">
                <div class="info-card">
                    <div class="info-label">CUSTOMER NAME</div>
                    <div class="info-value">${data.customerName}</div>
                </div>
                <div class="info-card">
                    <div class="info-label">EMAIL</div>
                    <div class="info-value">${data.customerEmail}</div>
                </div>
                <div class="info-card">
                    <div class="info-label">CONTACT</div>
                    <div class="info-value">${data.customerContact}</div>
                </div>
                <div class="info-card">
                    <div class="info-label">QUERY DATE</div>
                    <div class="info-value">${data.queryDate}</div>
                </div>
            </div>
        </div>
        
        ${data.package ? `
        <div class="itinerary-section">
            <div class="section-title"><span class="section-icon">📦</span> Package Details</div>
            <table class="details-table">
                <tr>
                    <th>From</th>
                    <th>To</th>
                    <th>Travel Date</th>
                    <th>Duration</th>
                    <th>Travellers</th>
                </tr>
                <tr>
                    <td>${data.package.goingFrom}</td>
                    <td>${data.package.goingTo}</td>
                    <td>${data.package.specificDate}</td>
                    <td>${data.package.noOfDays} days</td>
                    <td>${data.package.travellers} persons</td>
                </tr>
            </table>
            ${data.package.expectedClosureAmount ? `
            <div class="amount-section">
                <div class="amount-label">Expected Closure Amount</div>
                <div class="amount-value">$${data.package.expectedClosureAmount}</div>
            </div>` : ''}
        </div>` : ''}
        
        ${data.flights && data.flights.length > 0 ? `
        <div class="itinerary-section">
            <div class="section-title"><span class="section-icon">✈️</span> Flight Details</div>
            ${data.flights.map(flight => `
                <div style="margin-bottom: 30px; padding: 20px; background: #f8fafc; border-radius: 8px; border-left: 4px solid #4299e1;">
                    <h3 style="color: #2d3748; margin-bottom: 15px; font-size: 1.2em;">Day ${flight.day} ${flight.date ? `- ${flight.date}` : ''}</h3>
                    ${flight.airline ? `
                    <div style="margin-bottom: 15px;">
                        <h4 style="color: #2d3748; margin-bottom: 8px;">✈️ Flight Details</h4>
                        <p><strong>${flight.airline}</strong> ${flight.flightNumber || ''}</p>
                        <p>${flight.departure?.city || ''} → ${flight.arrival?.city || ''}</p>
                        ${flight.departure?.datetime ? `<p>Departure: ${flight.departure.datetime}</p>` : ''}
                        ${flight.arrival?.datetime ? `<p>Arrival: ${flight.arrival.datetime}</p>` : ''}
                        ${flight.cabinClass ? `<p>Class: ${flight.cabinClass}</p>` : ''}
                        ${flight.price ? `<p><strong>Price: $${flight.price}</strong></p>` : ''}
                    </div>
                    ` : ''}
                    ${flight.remarks ? `
                    <div>
                        <h4 style="color: #2d3748; margin-bottom: 8px;">📝 Remarks</h4>
                        <p>${flight.remarks}</p>
                    </div>
                    ` : ''}
                </div>
            `).join('')}
        </div>
        ` : ''}
        
        ${data.hotels && data.hotels.length > 0 ? `
        <div class="itinerary-section">
            <div class="section-title"><span class="section-icon">🏨</span> Hotel Details</div>
            ${data.hotels.map(hotel => `
                <div style="margin-bottom: 30px; padding: 20px; background: #f8fafc; border-radius: 8px; border-left: 4px solid #4299e1;">
                    <h3 style="color: #2d3748; margin-bottom: 15px; font-size: 1.2em;">Day ${hotel.day} ${hotel.date ? `- ${hotel.date}` : ''}</h3>
                    ${hotel.name ? `
                    <div style="margin-bottom: 15px;">
                        <h4 style="color: #2d3748; margin-bottom: 8px;">🏨 Hotel Details</h4>
                        <p><strong>${hotel.name}</strong> ${hotel.starRating ? `- ${'★'.repeat(hotel.starRating)}` : ''}</p>
                        ${hotel.location?.city ? `<p>Location: ${hotel.location.city}</p>` : ''}
                        ${hotel.roomType ? `<p>Room Type: ${hotel.roomType}</p>` : ''}
                        ${hotel.mealPlan ? `<p>Meal Plan: ${hotel.mealPlan}</p>` : ''}
                        ${hotel.price ? `<p><strong>Price: $${hotel.price}</strong></p>` : ''}
                    </div>
                    ` : ''}
                    ${hotel.remarks ? `
                    <div>
                        <h4 style="color: #2d3748; margin-bottom: 8px;">📝 Remarks</h4>
                        <p>${hotel.remarks}</p>
                    </div>
                    ` : ''}
                </div>
            `).join('')}
        </div>
        ` : ''}
        
        <div class="footer">
            <div class="footer-content">
                <div>Thank you for choosing our travel services!</div>
                <div class="contact-info">
                    For any queries, please contact ${data.employeeName} at ${data.employeeEmail}
                </div>
                <div class="contact-info">
                    Generated on ${data.generatedDate}
                </div>
                <div class="footer-divider"></div>
                <div class="contact-info">
                    <span class="travel-crm-logo">Travel CRM</span> - Professional Travel Management Solutions
                </div>
            </div>
        </div>
        <button class="button"> <a href="http://localhost:5173">Visit Travel CRM</a> </button>
    </div>
</body>
</html>
`;
  };

  // Component rendering functions for each tab
  const renderPackageTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Package Name *</label>
          <input
            type="text"
            name="package.name"
            value={formData.package.name}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Query Type *</label>
          <div className="flex space-x-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="package.queryType"
                checked={formData.package.queryType === 'FIT'}
                onChange={() => handleInputChange({ target: { name: 'package.queryType', value: 'FIT' } })}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
              />
              <span className="ml-2 text-gray-700">FIT (Normal)</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="package.queryType"
                checked={formData.package.queryType === 'GIT'}
                onChange={() => handleInputChange({ target: { name: 'package.queryType', value: 'GIT' } })}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
              />
              <span className="ml-2 text-gray-700">GIT (Group)</span>
            </label>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Going From *</label>
          <input
            type="text"
            name="package.goingFrom"
            value={formData.package.goingFrom}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Going To *</label>
          <input
            type="text"
            name="package.goingTo"
            value={formData.package.goingTo}
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
            name="package.specificDate"
            value={formData.package.specificDate}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">No Of Days *</label>
          <input
            type="number"
            name="package.noOfDays"
            value={formData.package.noOfDays}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            min="1"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Travellers Count *</label>
          <input
            type="number"
            name="package.travellers"
            value={formData.package.travellers}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            min="1"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Price Range (per person)</label>
          <select
            name="package.priceRange"
            value={formData.package.priceRange}
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
        <label className="block text-sm font-medium text-gray-700 mb-1">Package Description *</label>
        <textarea
          name="package.description"
          value={formData.package.description}
          onChange={handleInputChange}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          rows="3"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Select Inclusions</label>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 mt-2">
          {inclusionOptions.map(option => (
            <label key={option} className="inline-flex items-center">
              <input
                type="checkbox"
                checked={formData.package.inclusions.includes(option)}
                onChange={() => handleCheckboxChange('package', 'inclusions', option)}
                className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">{option}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Select Themes</label>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 mt-2">
          {themeOptions.map(option => (
            <label key={option} className="inline-flex items-center">
              <input
                type="checkbox"
                checked={formData.package.themes.includes(option)}
                onChange={() => handleCheckboxChange('package', 'themes', option)}
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
                onClick={() => handleInputChange({ target: { name: 'package.hotelPreference', value: star.toString() } })}
                className={`p-1 rounded-full ${formData.package.hotelPreference >= star ? 'text-yellow-400' : 'text-gray-300'}`}
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
                  checked={formData.package.foodPreferences.includes(option)}
                  onChange={() => handleCheckboxChange('package', 'foodPreferences', option)}
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
          name="package.remarks"
          value={formData.package.remarks}
          onChange={handleInputChange}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          rows="3"
        />
      </div>

      {/* Expected Closure Section */}
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <h3 className="text-lg font-semibold text-blue-800 mb-3">Expected Closure Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-blue-700 mb-1">Expected Closure Date</label>
            <input
              type="date"
              name="package.expectedClosureDate"
              value={formData.package.expectedClosureDate}
              onChange={handleInputChange}
              className="w-full p-2 border border-blue-300 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-blue-700 mb-1">Expected Closure Amount ($)</label>
            <input
              type="number"
              name="package.expectedClosureAmount"
              value={formData.package.expectedClosureAmount}
              onChange={handleInputChange}
              className="w-full p-2 border border-blue-300 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white"
              min="0"
              step="0.01"
            />
          </div>
        </div>
      </div>
    </div>
  );

  // Flight Tab Component (Day-wise)
  const renderFlightTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Day-wise Flight Details</h3>
        <button
          type="button"
          onClick={() => addNewDay('flights')}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          Add Day
        </button>
      </div>

      {dayWiseData.flights.map((flight, dayIndex) => (
        <div key={dayIndex} className="border border-gray-200 rounded-lg p-6 bg-gray-50">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-lg font-semibold text-blue-600">Day {flight.day}</h4>
            {dayWiseData.flights.length > 1 && (
              <button
                type="button"
                onClick={() => removeDay('flights', dayIndex)}
                className="text-red-600 hover:text-red-800"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input
                type="date"
                value={flight.date}
                onChange={(e) => handleDayFieldChange('flights', dayIndex, 'date', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Day Number</label>
              <input
                type="number"
                value={flight.day}
                onChange={(e) => handleDayFieldChange('flights', dayIndex, 'day', parseInt(e.target.value))}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                min="1"
              />
            </div>
          </div>

          <div className="mb-6">
            <div className="flex border-b border-gray-200">
              <button
                type="button"
                onClick={() => handleDayFieldChange('flights', dayIndex, 'selectionType', 'new')}
                className={`py-2 px-4 font-medium text-sm ${flight.selectionType === 'new' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Create New Flight
              </button>
              <button
                type="button"
                onClick={() => handleDayFieldChange('flights', dayIndex, 'selectionType', 'existing')}
                className={`py-2 px-4 font-medium text-sm ${flight.selectionType === 'existing' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Select From Existing
              </button>
              <button
                type="button"
                onClick={() => handleDayFieldChange('flights', dayIndex, 'selectionType', 'thirdParty')}
                className={`py-2 px-4 font-medium text-sm ${flight.selectionType === 'thirdParty' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Third Party Flight
              </button>
            </div>
          </div>

          {flight.selectionType === 'new' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Flight Type</label>
                  <select
                    value={flight.flightType}
                    onChange={(e) => handleDayFieldChange('flights', dayIndex, 'flightType', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  >
                    {flightTypeOptions.map(option => (
                      <option key={option} value={option}>
                        {option === 'oneway' ? 'One Way' : option === 'roundtrip' ? 'Round Trip' : 'Multi City'}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cabin Class</label>
                  <select
                    value={flight.cabinClass}
                    onChange={(e) => handleDayFieldChange('flights', dayIndex, 'cabinClass', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  >
                    {cabinClassOptions.map(option => (
                      <option key={option} value={option}>
                        {option.charAt(0).toUpperCase() + option.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Airline</label>
                  <input
                    type="text"
                    value={flight.airline}
                    onChange={(e) => handleDayFieldChange('flights', dayIndex, 'airline', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Flight Number</label>
                  <input
                    type="text"
                    value={flight.flightNumber}
                    onChange={(e) => handleDayFieldChange('flights', dayIndex, 'flightNumber', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Departure Airport</label>
                  <input
                    type="text"
                    value={flight.departure.airport}
                    onChange={(e) => handleDayDeepFieldChange('flights', dayIndex, 'departure', 'airport', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., JFK"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Arrival Airport</label>
                  <input
                    type="text"
                    value={flight.arrival.airport}
                    onChange={(e) => handleDayDeepFieldChange('flights', dayIndex, 'arrival', 'airport', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., LAX"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Departure City</label>
                  <input
                    type="text"
                    value={flight.departure.city}
                    onChange={(e) => handleDayDeepFieldChange('flights', dayIndex, 'departure', 'city', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Arrival City</label>
                  <input
                    type="text"
                    value={flight.arrival.city}
                    onChange={(e) => handleDayDeepFieldChange('flights', dayIndex, 'arrival', 'city', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Departure Date & Time</label>
                  <input
                    type="datetime-local"
                    value={flight.departure.datetime}
                    onChange={(e) => handleDayDeepFieldChange('flights', dayIndex, 'departure', 'datetime', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Arrival Date & Time</label>
                  <input
                    type="datetime-local"
                    value={flight.arrival.datetime}
                    onChange={(e) => handleDayDeepFieldChange('flights', dayIndex, 'arrival', 'datetime', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                  <input
                    type="text"
                    value={flight.duration}
                    readOnly
                    className="w-full p-2 border border-gray-300 rounded-md bg-gray-100"
                    placeholder="Calculated automatically"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Airline</label>
                  <input
                    type="text"
                    value={flight.preferredAirline}
                    onChange={(e) => handleDayFieldChange('flights', dayIndex, 'preferredAirline', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Adults</label>
                  <input
                    type="number"
                    value={flight.adults}
                    onChange={(e) => handleDayFieldChange('flights', dayIndex, 'adults', parseInt(e.target.value))}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    min="1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Children</label>
                  <input
                    type="number"
                    value={flight.children}
                    onChange={(e) => handleDayFieldChange('flights', dayIndex, 'children', parseInt(e.target.value))}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Infants</label>
                  <input
                    type="number"
                    value={flight.infants}
                    onChange={(e) => handleDayFieldChange('flights', dayIndex, 'infants', parseInt(e.target.value))}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    min="0"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={flight.refundable}
                  onChange={(e) => handleDayFieldChange('flights', dayIndex, 'refundable', e.target.checked)}
                  className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
                <label className="text-sm font-medium text-gray-700">Refundable Flight</label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
                  <input
                    type="number"
                    value={flight.price}
                    onChange={(e) => handleDayFieldChange('flights', dayIndex, 'price', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>
            </div>
          )}

          {flight.selectionType === 'existing' && renderExistingFlightPackages('flights', dayIndex)}
          {flight.selectionType === 'thirdParty' && renderThirdPartyFlight('flights', dayIndex)}

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Remarks</label>
            <textarea
              value={flight.remarks}
              onChange={(e) => handleDayFieldChange('flights', dayIndex, 'remarks', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              rows="2"
            />
          </div>
        </div>
      ))}

      {/* Expected Closure Section */}
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <h3 className="text-lg font-semibold text-blue-800 mb-3">Expected Closure Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-blue-700 mb-1">Expected Closure Date</label>
            <input
              type="date"
              name="expectedClosureDate"
              value={formData.expectedClosureDate}
              onChange={handleInputChange}
              className="w-full p-2 border border-blue-300 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-blue-700 mb-1">Expected Closure Amount ($)</label>
            <input
              type="number"
              name="expectedClosureAmount"
              value={formData.expectedClosureAmount}
              onChange={handleInputChange}
              className="w-full p-2 border border-blue-300 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white"
              min="0"
              step="0.01"
            />
          </div>
        </div>
      </div>
    </div>
  );

  // Hotel Tab Component (Day-wise)
  const renderHotelTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Day-wise Hotel Details</h3>
        <button
          type="button"
          onClick={() => addNewDay('hotels')}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          Add Day
        </button>
      </div>

      {dayWiseData.hotels.map((hotel, dayIndex) => (
        <div key={dayIndex} className="border border-gray-200 rounded-lg p-6 bg-gray-50">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-lg font-semibold text-blue-600">Day {hotel.day}</h4>
            {dayWiseData.hotels.length > 1 && (
              <button
                type="button"
                onClick={() => removeDay('hotels', dayIndex)}
                className="text-red-600 hover:text-red-800"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input
                type="date"
                value={hotel.date}
                onChange={(e) => handleDayFieldChange('hotels', dayIndex, 'date', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Day Number</label>
              <input
                type="number"
                value={hotel.day}
                onChange={(e) => handleDayFieldChange('hotels', dayIndex, 'day', parseInt(e.target.value))}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                min="1"
              />
            </div>
          </div>

          <div className="mb-6">
            <div className="flex border-b border-gray-200">
              <button
                type="button"
                onClick={() => handleDayFieldChange('hotels', dayIndex, 'selectionType', 'new')}
                className={`py-2 px-4 font-medium text-sm ${hotel.selectionType === 'new' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Create New Hotel
              </button>
              <button
                type="button"
                onClick={() => handleDayFieldChange('hotels', dayIndex, 'selectionType', 'existing')}
                className={`py-2 px-4 font-medium text-sm ${hotel.selectionType === 'existing' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Select From Existing
              </button>
              <button
                type="button"
                onClick={() => handleDayFieldChange('hotels', dayIndex, 'selectionType', 'thirdParty')}
                className={`py-2 px-4 font-medium text-sm ${hotel.selectionType === 'thirdParty' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Third Party Hotel
              </button>
            </div>
          </div>

          {hotel.selectionType === 'new' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Hotel Name</label>
                  <input
                    type="text"
                    value={hotel.name}
                    onChange={(e) => handleDayFieldChange('hotels', dayIndex, 'name', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Star Rating</label>
                  <select
                    value={hotel.starRating}
                    onChange={(e) => handleDayFieldChange('hotels', dayIndex, 'starRating', parseInt(e.target.value))}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="1">1 Star</option>
                    <option value="2">2 Stars</option>
                    <option value="3">3 Stars</option>
                    <option value="4">4 Stars</option>
                    <option value="5">5 Stars</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Room Type</label>
                  <select
                    value={hotel.roomType}
                    onChange={(e) => handleDayFieldChange('hotels', dayIndex, 'roomType', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  >
                    {roomTypeOptions.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Meal Plan</label>
                  <select
                    value={hotel.mealPlan}
                    onChange={(e) => handleDayFieldChange('hotels', dayIndex, 'mealPlan', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  >
                    {mealPlanOptions.map(option => (
                      <option key={option} value={option}>
                        {option === 'breakfast' ? 'Breakfast' : 
                         option === 'half_board' ? 'Half Board' : 
                         option === 'full_board' ? 'Full Board' : 
                         'All Inclusive'}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <input
                    type="text"
                    value={hotel.location.city}
                    onChange={(e) => handleDayDeepFieldChange('hotels', dayIndex, 'location', 'city', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <input
                    type="text"
                    value={hotel.location.address}
                    onChange={(e) => handleDayDeepFieldChange('hotels', dayIndex, 'location', 'address', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Check-In Date</label>
                  <input
                    type="date"
                    value={hotel.checkIn}
                    onChange={(e) => handleDayFieldChange('hotels', dayIndex, 'checkIn', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Check-Out Date</label>
                  <input
                    type="date"
                    value={hotel.checkOut}
                    onChange={(e) => handleDayFieldChange('hotels', dayIndex, 'checkOut', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Adults</label>
                  <input
                    type="number"
                    value={hotel.adults}
                    onChange={(e) => handleDayFieldChange('hotels', dayIndex, 'adults', parseInt(e.target.value))}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    min="1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Children</label>
                  <input
                    type="number"
                    value={hotel.children}
                    onChange={(e) => handleDayFieldChange('hotels', dayIndex, 'children', parseInt(e.target.value))}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    min="0"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
                  <input
                    type="number"
                    value={hotel.price}
                    onChange={(e) => handleDayFieldChange('hotels', dayIndex, 'price', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>
            </div>
          )}

          {hotel.selectionType === 'existing' && renderExistingHotelPackages('hotels', dayIndex)}
          {hotel.selectionType === 'thirdParty' && renderThirdPartyHotel('hotels', dayIndex)}

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Remarks</label>
            <textarea
              value={hotel.remarks}
              onChange={(e) => handleDayFieldChange('hotels', dayIndex, 'remarks', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              rows="2"
            />
          </div>
        </div>
      ))}

      {/* Expected Closure Section */}
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <h3 className="text-lg font-semibold text-blue-800 mb-3">Expected Closure Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-blue-700 mb-1">Expected Closure Date</label>
            <input
              type="date"
              name="expectedClosureDate"
              value={formData.expectedClosureDate}
              onChange={handleInputChange}
              className="w-full p-2 border border-blue-300 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-blue-700 mb-1">Expected Closure Amount ($)</label>
            <input
              type="number"
              name="expectedClosureAmount"
              value={formData.expectedClosureAmount}
              onChange={handleInputChange}
              className="w-full p-2 border border-blue-300 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white"
              min="0"
              step="0.01"
            />
          </div>
        </div>
      </div>
    </div>
  );

  // Transfer Tab Component (Day-wise)
  const renderTransferTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Day-wise Transfer Details</h3>
        <button
          type="button"
          onClick={() => addNewDay('transfers')}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          Add Day
        </button>
      </div>

      {dayWiseData.transfers.map((transfer, dayIndex) => (
        <div key={dayIndex} className="border border-gray-200 rounded-lg p-6 bg-gray-50">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-lg font-semibold text-blue-600">Day {transfer.day}</h4>
            {dayWiseData.transfers.length > 1 && (
              <button
                type="button"
                onClick={() => removeDay('transfers', dayIndex)}
                className="text-red-600 hover:text-red-800"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input
                type="date"
                value={transfer.date}
                onChange={(e) => handleDayFieldChange('transfers', dayIndex, 'date', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Day Number</label>
              <input
                type="number"
                value={transfer.day}
                onChange={(e) => handleDayFieldChange('transfers', dayIndex, 'day', parseInt(e.target.value))}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                min="1"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Pickup Location</label>
              <input
                type="text"
                value={transfer.pickup}
                onChange={(e) => handleDayFieldChange('transfers', dayIndex, 'pickup', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Dropoff Location</label>
              <input
                type="text"
                value={transfer.dropoff}
                onChange={(e) => handleDayFieldChange('transfers', dayIndex, 'dropoff', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Type</label>
              <select
                value={transfer.vehicleType}
                onChange={(e) => handleDayFieldChange('transfers', dayIndex, 'vehicleType', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                {vehicleTypeOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Transfer Time</label>
              <input
                type="time"
                value={transfer.time}
                onChange={(e) => handleDayFieldChange('transfers', dayIndex, 'time', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
              <input
                type="number"
                value={transfer.price}
                onChange={(e) => handleDayFieldChange('transfers', dayIndex, 'price', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                min="0"
                step="0.01"
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Remarks</label>
            <textarea
              value={transfer.remarks}
              onChange={(e) => handleDayFieldChange('transfers', dayIndex, 'remarks', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              rows="2"
            />
          </div>
        </div>
      ))}

      {/* Expected Closure Section */}
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <h3 className="text-lg font-semibold text-blue-800 mb-3">Expected Closure Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-blue-700 mb-1">Expected Closure Date</label>
            <input
              type="date"
              name="expectedClosureDate"
              value={formData.expectedClosureDate}
              onChange={handleInputChange}
              className="w-full p-2 border border-blue-300 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-blue-700 mb-1">Expected Closure Amount ($)</label>
            <input
              type="number"
              name="expectedClosureAmount"
              value={formData.expectedClosureAmount}
              onChange={handleInputChange}
              className="w-full p-2 border border-blue-300 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white"
              min="0"
              step="0.01"
            />
          </div>
        </div>
      </div>
    </div>
  );

  // Visa Tab Component (Day-wise)
  const renderVisaTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Day-wise Visa Details</h3>
        <button
          type="button"
          onClick={() => addNewDay('visas')}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          Add Day
        </button>
      </div>

      {dayWiseData.visas.map((visa, dayIndex) => (
        <div key={dayIndex} className="border border-gray-200 rounded-lg p-6 bg-gray-50">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-lg font-semibold text-blue-600">Day {visa.day}</h4>
            {dayWiseData.visas.length > 1 && (
              <button
                type="button"
                onClick={() => removeDay('visas', dayIndex)}
                className="text-red-600 hover:text-red-800"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input
                type="date"
                value={visa.date}
                onChange={(e) => handleDayFieldChange('visas', dayIndex, 'date', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Day Number</label>
              <input
                type="number"
                value={visa.day}
                onChange={(e) => handleDayFieldChange('visas', dayIndex, 'day', parseInt(e.target.value))}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                min="1"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
              <input
                type="text"
                value={visa.country}
                onChange={(e) => handleDayFieldChange('visas', dayIndex, 'country', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Visa Type</label>
              <select
                value={visa.type}
                onChange={(e) => handleDayFieldChange('visas', dayIndex, 'type', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                {visaTypeOptions.map(option => (
                  <option key={option} value={option}>{option.charAt(0).toUpperCase() + option.slice(1)}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Processing Time</label>
              <input
                type="text"
                value={visa.processingTime}
                onChange={(e) => handleDayFieldChange('visas', dayIndex, 'processingTime', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., 5-7 business days"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
              <input
                type="number"
                value={visa.price}
                onChange={(e) => handleDayFieldChange('visas', dayIndex, 'price', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                min="0"
                step="0.01"
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Remarks</label>
            <textarea
              value={visa.remarks}
              onChange={(e) => handleDayFieldChange('visas', dayIndex, 'remarks', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              rows="2"
            />
          </div>
        </div>
      ))}

      {/* Expected Closure Section */}
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <h3 className="text-lg font-semibold text-blue-800 mb-3">Expected Closure Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-blue-700 mb-1">Expected Closure Date</label>
            <input
              type="date"
              name="expectedClosureDate"
              value={formData.expectedClosureDate}
              onChange={handleInputChange}
              className="w-full p-2 border border-blue-300 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-blue-700 mb-1">Expected Closure Amount ($)</label>
            <input
              type="number"
              name="expectedClosureAmount"
              value={formData.expectedClosureAmount}
              onChange={handleInputChange}
              className="w-full p-2 border border-blue-300 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white"
              min="0"
              step="0.01"
            />
          </div>
        </div>
      </div>
    </div>
  );

  // Sightseeing Tab Component (Day-wise)
  const renderSightseeingTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Day-wise Sightseeing Details</h3>
        <button
          type="button"
          onClick={() => addNewDay('sightseeing')}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          Add Day
        </button>
      </div>

      {dayWiseData.sightseeing.map((activity, dayIndex) => (
        <div key={dayIndex} className="border border-gray-200 rounded-lg p-6 bg-gray-50">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-lg font-semibold text-blue-600">Day {activity.day}</h4>
            {dayWiseData.sightseeing.length > 1 && (
              <button
                type="button"
                onClick={() => removeDay('sightseeing', dayIndex)}
                className="text-red-600 hover:text-red-800"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input
                type="date"
                value={activity.date}
                onChange={(e) => handleDayFieldChange('sightseeing', dayIndex, 'date', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Day Number</label>
              <input
                type="number"
                value={activity.day}
                onChange={(e) => handleDayFieldChange('sightseeing', dayIndex, 'day', parseInt(e.target.value))}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                min="1"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Activity</label>
              <input
                type="text"
                value={activity.activity}
                onChange={(e) => handleDayFieldChange('sightseeing', dayIndex, 'activity', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <input
                type="text"
                value={activity.location}
                onChange={(e) => handleDayFieldChange('sightseeing', dayIndex, 'location', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
              <input
                type="text"
                value={activity.duration}
                onChange={(e) => handleDayFieldChange('sightseeing', dayIndex, 'duration', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., 3 hours"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
              <input
                type="time"
                value={activity.time}
                onChange={(e) => handleDayFieldChange('sightseeing', dayIndex, 'time', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
              <input
                type="number"
                value={activity.price}
                onChange={(e) => handleDayFieldChange('sightseeing', dayIndex, 'price', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                min="0"
                step="0.01"
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Remarks</label>
            <textarea
              value={activity.remarks}
              onChange={(e) => handleDayFieldChange('sightseeing', dayIndex, 'remarks', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              rows="2"
            />
          </div>
        </div>
      ))}

      {/* Expected Closure Section */}
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <h3 className="text-lg font-semibold text-blue-800 mb-3">Expected Closure Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-blue-700 mb-1">Expected Closure Date</label>
            <input
              type="date"
              name="expectedClosureDate"
              value={formData.expectedClosureDate}
              onChange={handleInputChange}
              className="w-full p-2 border border-blue-300 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-blue-700 mb-1">Expected Closure Amount ($)</label>
            <input
              type="number"
              name="expectedClosureAmount"
              value={formData.expectedClosureAmount}
              onChange={handleInputChange}
              className="w-full p-2 border border-blue-300 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white"
              min="0"
              step="0.01"
            />
          </div>
        </div>
      </div>
    </div>
  );

  // Miscellaneous Tab Component (Day-wise)
  const renderMiscellaneousTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Day-wise Miscellaneous Details</h3>
        <button
          type="button"
          onClick={() => addNewDay('miscellaneous')}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          Add Day
        </button>
      </div>

      {dayWiseData.miscellaneous.map((item, dayIndex) => (
        <div key={dayIndex} className="border border-gray-200 rounded-lg p-6 bg-gray-50">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-lg font-semibold text-blue-600">Day {item.day}</h4>
            {dayWiseData.miscellaneous.length > 1 && (
              <button
                type="button"
                onClick={() => removeDay('miscellaneous', dayIndex)}
                className="text-red-600 hover:text-red-800"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input
                type="date"
                value={item.date}
                onChange={(e) => handleDayFieldChange('miscellaneous', dayIndex, 'date', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Day Number</label>
              <input
                type="number"
                value={item.day}
                onChange={(e) => handleDayFieldChange('miscellaneous', dayIndex, 'day', parseInt(e.target.value))}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                min="1"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <input
                type="text"
                value={item.description}
                onChange={(e) => handleDayFieldChange('miscellaneous', dayIndex, 'description', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <input
                type="text"
                value={item.category}
                onChange={(e) => handleDayFieldChange('miscellaneous', dayIndex, 'category', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., Insurance, Tips, etc."
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
              <input
                type="number"
                value={item.price}
                onChange={(e) => handleDayFieldChange('miscellaneous', dayIndex, 'price', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                min="0"
                step="0.01"
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Remarks</label>
            <textarea
              value={item.remarks}
              onChange={(e) => handleDayFieldChange('miscellaneous', dayIndex, 'remarks', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              rows="2"
            />
          </div>
        </div>
      ))}

      {/* Expected Closure Section */}
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <h3 className="text-lg font-semibold text-blue-800 mb-3">Expected Closure Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-blue-700 mb-1">Expected Closure Date</label>
            <input
              type="date"
              name="expectedClosureDate"
              value={formData.expectedClosureDate}
              onChange={handleInputChange}
              className="w-full p-2 border border-blue-300 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-blue-700 mb-1">Expected Closure Amount ($)</label>
            <input
              type="number"
              name="expectedClosureAmount"
              value={formData.expectedClosureAmount}
              onChange={handleInputChange}
              className="w-full p-2 border border-blue-300 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white"
              min="0"
              step="0.01"
            />
          </div>
        </div>
      </div>
    </div>
  );

  // Company Formation Tab Component (Day-wise)
  const renderCompanyFormationTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Day-wise Company Formation Details</h3>
        <button
          type="button"
          onClick={() => addNewDay('companyFormation')}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          Add Day
        </button>
      </div>

      {dayWiseData.companyFormation.map((company, dayIndex) => (
        <div key={dayIndex} className="border border-gray-200 rounded-lg p-6 bg-gray-50">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-lg font-semibold text-blue-600">Day {company.day}</h4>
            {dayWiseData.companyFormation.length > 1 && (
              <button
                type="button"
                onClick={() => removeDay('companyFormation', dayIndex)}
                className="text-red-600 hover:text-red-800"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input
                type="date"
                value={company.date}
                onChange={(e) => handleDayFieldChange('companyFormation', dayIndex, 'date', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Day Number</label>
              <input
                type="number"
                value={company.day}
                onChange={(e) => handleDayFieldChange('companyFormation', dayIndex, 'day', parseInt(e.target.value))}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                min="1"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={company.description}
              onChange={(e) => handleDayFieldChange('companyFormation', dayIndex, 'description', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              rows="3"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Timeline</label>
              <input
                type="text"
                value={company.timeline}
                onChange={(e) => handleDayFieldChange('companyFormation', dayIndex, 'timeline', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., 4-6 weeks"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
              <input
                type="number"
                value={company.price}
                onChange={(e) => handleDayFieldChange('companyFormation', dayIndex, 'price', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                min="0"
                step="0.01"
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Remarks</label>
            <textarea
              value={company.remarks}
              onChange={(e) => handleDayFieldChange('companyFormation', dayIndex, 'remarks', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              rows="2"
            />
          </div>
        </div>
      ))}

      {/* Expected Closure Section */}
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <h3 className="text-lg font-semibold text-blue-800 mb-3">Expected Closure Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-blue-700 mb-1">Expected Closure Date</label>
            <input
              type="date"
              name="expectedClosureDate"
              value={formData.expectedClosureDate}
              onChange={handleInputChange}
              className="w-full p-2 border border-blue-300 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-blue-700 mb-1">Expected Closure Amount ($)</label>
            <input
              type="number"
              name="expectedClosureAmount"
              value={formData.expectedClosureAmount}
              onChange={handleInputChange}
              className="w-full p-2 border border-blue-300 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white"
              min="0"
              step="0.01"
            />
          </div>
        </div>
      </div>
    </div>
  );

  // Forex Tab Component (Day-wise)
  const renderForexTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Day-wise Forex Details</h3>
        <button
          type="button"
          onClick={() => addNewDay('forex')}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          Add Day
        </button>
      </div>

      {dayWiseData.forex.map((forex, dayIndex) => (
        <div key={dayIndex} className="border border-gray-200 rounded-lg p-6 bg-gray-50">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-lg font-semibold text-blue-600">Day {forex.day}</h4>
            {dayWiseData.forex.length > 1 && (
              <button
                type="button"
                onClick={() => removeDay('forex', dayIndex)}
                className="text-red-600 hover:text-red-800"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input
                type="date"
                value={forex.date}
                onChange={(e) => handleDayFieldChange('forex', dayIndex, 'date', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Day Number</label>
              <input
                type="number"
                value={forex.day}
                onChange={(e) => handleDayFieldChange('forex', dayIndex, 'day', parseInt(e.target.value))}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                min="1"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={forex.description}
              onChange={(e) => handleDayFieldChange('forex', dayIndex, 'description', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              rows="3"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
              <select
                value={forex.currency}
                onChange={(e) => handleDayFieldChange('forex', dayIndex, 'currency', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                {currencyOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
              <input
                type="number"
                value={forex.amount}
                onChange={(e) => handleDayFieldChange('forex', dayIndex, 'amount', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                min="0"
                step="0.01"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Exchange Rate</label>
              <input
                type="number"
                value={forex.exchangeRate}
                onChange={(e) => handleDayFieldChange('forex', dayIndex, 'exchangeRate', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                min="0"
                step="0.01"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
              <input
                type="number"
                value={forex.price}
                onChange={(e) => handleDayFieldChange('forex', dayIndex, 'price', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                min="0"
                step="0.01"
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Remarks</label>
            <textarea
              value={forex.remarks}
              onChange={(e) => handleDayFieldChange('forex', dayIndex, 'remarks', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              rows="2"
            />
          </div>
        </div>
      ))}

      {/* Expected Closure Section */}
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <h3 className="text-lg font-semibold text-blue-800 mb-3">Expected Closure Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-blue-700 mb-1">Expected Closure Date</label>
            <input
              type="date"
              name="expectedClosureDate"
              value={formData.expectedClosureDate}
              onChange={handleInputChange}
              className="w-full p-2 border border-blue-300 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-blue-700 mb-1">Expected Closure Amount ($)</label>
            <input
              type="number"
              name="expectedClosureAmount"
              value={formData.expectedClosureAmount}
              onChange={handleInputChange}
              className="w-full p-2 border border-blue-300 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white"
              min="0"
              step="0.01"
            />
          </div>
        </div>
      </div>
    </div>
  );

  // Review Tab Component
  const renderReviewTab = () => {
    const totalPrice = calculateTotalPrice();
    
    return (
      <div className="space-y-6">
        <div className="bg-green-50 p-6 rounded-lg border border-green-200">
          <h3 className="text-xl font-semibold text-green-800 mb-4">Review Your Query</h3>
          <p className="text-green-700 mb-4">
            Please review all the details before submitting your query. You can go back to any tab to make changes.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-lg border border-green-200">
              <h4 className="font-semibold text-green-700 mb-2">Total Calculated Price</h4>
              <p className="text-2xl font-bold text-green-800">${totalPrice}</p>
            </div>
            <div className="bg-white p-4 rounded-lg border border-green-200">
              <h4 className="font-semibold text-green-700 mb-2">Expected Closure</h4>
              <p className="text-lg text-green-800">
                Date: {formData.expectedClosureDate || 'Not set'}
              </p>
              <p className="text-lg text-green-800">
                Amount: ${formData.expectedClosureAmount || '0.00'}
              </p>
            </div>
          </div>
        </div>

        {/* Package Details Review */}
        <div className="border border-gray-200 rounded-lg p-6">
          <h4 className="text-lg font-semibold text-blue-600 mb-4">Package Details</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p><strong>Package Name:</strong> {formData.package.name}</p>
              <p><strong>Query Type:</strong> {formData.package.queryType}</p>
              <p><strong>From:</strong> {formData.package.goingFrom}</p>
              <p><strong>To:</strong> {formData.package.goingTo}</p>
            </div>
            <div>
              <p><strong>Travel Date:</strong> {formData.package.specificDate}</p>
              <p><strong>Duration:</strong> {formData.package.noOfDays} days</p>
              <p><strong>Travellers:</strong> {formData.package.travellers}</p>
              <p><strong>Expected Closure:</strong> ${formData.package.expectedClosureAmount || '0.00'}</p>
            </div>
          </div>
        </div>



        {/* Flights Review */}
        {dayWiseData.flights.some(flight => flight.airline || flight.flightNumber) && (
          <div className="border border-gray-200 rounded-lg p-6">
            <h4 className="text-lg font-semibold text-blue-600 mb-4">Flight Details</h4>
            {dayWiseData.flights.map((flight, index) => (
              flight.airline && (
                <div key={index} className="mb-4 p-4 bg-gray-50 rounded">
                  <h5 className="font-semibold">Day {flight.day}</h5>
                  <p>Airline: {flight.airline} {flight.flightNumber}</p>
                  <p>Route: {flight.departure?.city} → {flight.arrival?.city}</p>
                  <p>Flight Type: {flight.flightType === 'oneway' ? 'One Way' : flight.flightType === 'roundtrip' ? 'Round Trip' : 'Multi City'}</p>
                  <p>Cabin Class: {flight.cabinClass}</p>
                  <p>Duration: {flight.duration}</p>
                  <p>Refundable: {flight.refundable ? 'Yes' : 'No'}</p>
                  <p>Passengers: {flight.adults} adults, {flight.children} children, {flight.infants} infants</p>
                  <p>Price: ${flight.price || '0.00'}</p>
                </div>
              )
            ))}
          </div>
        )}

        {/* Hotels Review */}
        {dayWiseData.hotels.some(hotel => hotel.name) && (
          <div className="border border-gray-200 rounded-lg p-6">
            <h4 className="text-lg font-semibold text-blue-600 mb-4">Hotel Details</h4>
            {dayWiseData.hotels.map((hotel, index) => (
              hotel.name && (
                <div key={index} className="mb-4 p-4 bg-gray-50 rounded">
                  <h5 className="font-semibold">Day {hotel.day}</h5>
                  <p>Hotel: {hotel.name} ({'★'.repeat(hotel.starRating)})</p>
                  <p>Location: {hotel.location?.city}</p>
                  <p>Room Type: {hotel.roomType}</p>
                  <p>Meal Plan: {hotel.mealPlan === 'breakfast' ? 'Breakfast' : hotel.mealPlan === 'half_board' ? 'Half Board' : hotel.mealPlan === 'full_board' ? 'Full Board' : 'All Inclusive'}</p>
                  <p>Guests: {hotel.adults} adults, {hotel.children} children</p>
                  <p>Price: ${hotel.price || '0.00'}</p>
                </div>
              )
            ))}
          </div>
        )}

        {/* Expected Closure Section - Editable in Review Tab */}
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <h3 className="text-lg font-semibold text-blue-800 mb-3">Final Expected Closure Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-blue-700 mb-1">Expected Closure Date</label>
              <input
                type="date"
                name="expectedClosureDate"
                value={formData.expectedClosureDate}
                onChange={handleInputChange}
                className="w-full p-2 border border-blue-300 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-blue-700 mb-1">Expected Closure Amount ($)</label>
              <input
                type="number"
                name="expectedClosureAmount"
                value={formData.expectedClosureAmount}
                onChange={handleInputChange}
                className="w-full p-2 border border-blue-300 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white"
                min="0"
                step="0.01"
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Existing Flight Packages Component
  const renderExistingFlightPackages = (category, dayIndex) => (
    <div>
      {flightLoading ? (
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div>
          <div className="bg-white p-4 rounded-lg shadow-md mb-4">
            <h4 className="text-lg font-semibold mb-3">Filter Flight Packages</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700">Departure City</label>
                <input
                  type="text"
                  value={flightFilters.departureCity}
                  onChange={(e) => setFlightFilters(prev => ({...prev, departureCity: e.target.value}))}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-1 px-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700">Arrival City</label>
                <input
                  type="text"
                  value={flightFilters.arrivalCity}
                  onChange={(e) => setFlightFilters(prev => ({...prev, arrivalCity: e.target.value}))}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-1 px-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700">Min Price</label>
                <input
                  type="number"
                  value={flightFilters.minPrice}
                  onChange={(e) => setFlightFilters(prev => ({...prev, minPrice: e.target.value}))}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-1 px-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700">Sort By</label>
                <select
                  value={flightFilters.sort}
                  onChange={(e) => setFlightFilters(prev => ({...prev, sort: e.target.value}))}
                  className="mt-1 block w-full pl-2 pr-8 py-1 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm rounded-md"
                >
                  <option value="">Default</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="duration">Duration</option>
                </select>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {flightPackages.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-gray-500 text-sm">No flight packages found</p>
              </div>
            ) : (
              flightPackages.map((flight) => (
                <div
                  key={flight._id}
                  className={`bg-white rounded-lg shadow-sm border p-3 ${
                    dayWiseData[category][dayIndex].selectedFlightPackage === flight._id ? 'border-blue-500' : 'border-gray-200'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h5 className="font-medium text-gray-800">
                        {flight.departure.city} → {flight.arrival.city}
                      </h5>
                      <p className="text-xs text-gray-600">
                        {flight.airline} • {flight.flightNumber}
                      </p>
                    </div>
                    <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                      Available
                    </span>
                  </div>

                  <div className="mt-2 flex justify-between items-center">
                    <div>
                      <p className="text-xs text-gray-500">Price</p>
                      <p className="text-sm font-bold text-blue-600">
                        {flight.currency} {flight.price?.toLocaleString() ?? "0"}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleFlightPackageSelect(category, dayIndex, flight)}
                      className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                    >
                      {dayWiseData[category][dayIndex].selectedFlightPackage === flight._id ? 'Selected' : 'Select'}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );

  // Existing Hotel Packages Component
  const renderExistingHotelPackages = (category, dayIndex) => (
    <div>
      {hotelLoading ? (
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div>
          <div className="bg-white p-4 rounded-lg shadow-md mb-4">
            <h4 className="text-lg font-semibold mb-3">Filter Hotel Packages</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700">City</label>
                <input
                  type="text"
                  value={hotelFilters.city}
                  onChange={(e) => setHotelFilters(prev => ({...prev, city: e.target.value}))}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-1 px-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700">Country</label>
                <input
                  type="text"
                  value={hotelFilters.country}
                  onChange={(e) => setHotelFilters(prev => ({...prev, country: e.target.value}))}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-1 px-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700">Star Rating</label>
                <select
                  value={hotelFilters.starRating}
                  onChange={(e) => setHotelFilters(prev => ({...prev, starRating: e.target.value}))}
                  className="mt-1 block w-full pl-2 pr-8 py-1 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm rounded-md"
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
                <label className="block text-xs font-medium text-gray-700">Min Price</label>
                <input
                  type="number"
                  value={hotelFilters.minPrice}
                  onChange={(e) => setHotelFilters(prev => ({...prev, minPrice: e.target.value}))}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-1 px-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700">Sort By</label>
                <select
                  value={hotelFilters.sort}
                  onChange={(e) => setHotelFilters(prev => ({...prev, sort: e.target.value}))}
                  className="mt-1 block w-full pl-2 pr-8 py-1 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm rounded-md"
                >
                  <option value="">Default</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="rating">Rating</option>
                </select>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {hotelPackages.length === 0 ? (
              <div className="text-center py-6 col-span-2">
                <p className="text-gray-500 text-sm">No hotel packages found</p>
              </div>
            ) : (
              hotelPackages.map((hotel) => (
                <div
                  key={hotel._id}
                  className={`bg-white rounded-lg shadow-sm overflow-hidden border ${
                    dayWiseData[category][dayIndex].selectedHotelPackage === hotel._id ? 'border-blue-500' : 'border-gray-200'
                  }`}
                >
                  <img
                    src={hotel.images?.[0] || "https://via.placeholder.com/300x200?text=No+Image"}
                    alt={hotel.name}
                    className="w-full h-32 object-cover"
                  />
                  <div className="p-3">
                    <div className="flex justify-between items-start">
                      <h5 className="font-medium text-gray-800 text-sm">{hotel.name}</h5>
                      <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                        Available
                      </span>
                    </div>

                    <div className="mt-2 flex justify-between items-center">
                      <div>
                        <p className="text-xs text-gray-500">Price</p>
                        <p className="text-sm font-bold text-blue-600">
                          {hotel.currency} {hotel.totalPrice?.toLocaleString() ?? "0"}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleHotelPackageSelect(category, dayIndex, hotel)}
                        className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                      >
                        {dayWiseData[category][dayIndex].selectedHotelPackage === hotel._id ? 'Selected' : 'Select'}
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

  // Third Party Flight Component
  const renderThirdPartyFlight = (category, dayIndex) => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Booking Reference / PNR</label>
          <input
            type="text"
            value={dayWiseData[category][dayIndex].thirdPartyDetails.pnr}
            onChange={(e) => handleDayDeepFieldChange(category, dayIndex, 'thirdPartyDetails', 'pnr', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Supplier / Vendor Name</label>
          <input
            type="text"
            value={dayWiseData[category][dayIndex].thirdPartyDetails.supplier}
            onChange={(e) => handleDayDeepFieldChange(category, dayIndex, 'thirdPartyDetails', 'supplier', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Total Cost</label>
          <input
            type="number"
            value={dayWiseData[category][dayIndex].thirdPartyDetails.cost}
            onChange={(e) => handleDayDeepFieldChange(category, dayIndex, 'thirdPartyDetails', 'cost', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
            min="0"
            step="0.01"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Upload Confirmation</label>
          <input
            type="file"
            onChange={(e) => handleDayDeepFieldChange(category, dayIndex, 'thirdPartyDetails', 'confirmationFile', e.target.files[0])}
            className="w-full text-xs text-gray-500 file:mr-2 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>
      </div>
    </div>
  );

  // Third Party Hotel Component
  const renderThirdPartyHotel = (category, dayIndex) => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Booking Confirmation #</label>
          <input
            type="text"
            value={dayWiseData[category][dayIndex].thirdPartyDetails.confirmationNumber}
            onChange={(e) => handleDayDeepFieldChange(category, dayIndex, 'thirdPartyDetails', 'confirmationNumber', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Supplier / Vendor Name</label>
          <input
            type="text"
            value={dayWiseData[category][dayIndex].thirdPartyDetails.supplier}
            onChange={(e) => handleDayDeepFieldChange(category, dayIndex, 'thirdPartyDetails', 'supplier', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Total Cost</label>
          <input
            type="number"
            value={dayWiseData[category][dayIndex].thirdPartyDetails.cost}
            onChange={(e) => handleDayDeepFieldChange(category, dayIndex, 'thirdPartyDetails', 'cost', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
            min="0"
            step="0.01"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Upload Voucher</label>
          <input
            type="file"
            onChange={(e) => handleDayDeepFieldChange(category, dayIndex, 'thirdPartyDetails', 'voucherFile', e.target.files[0])}
            className="w-full text-xs text-gray-500 file:mr-2 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>
      </div>
    </div>
  );

  // Main render function for form fields
  const renderFormFields = () => {
    const currentType = requirementTypes[activeTab];

    switch(currentType) {
      case 'Package':
        return renderPackageTab();
      case 'Flight':
        return renderFlightTab();
      case 'Hotel':
        return renderHotelTab();
      case 'Transfer':
        return renderTransferTab();
      case 'Visa':
        return renderVisaTab();
      case 'Sightseeing':
        return renderSightseeingTab();
      case 'Miscellaneous':
        return renderMiscellaneousTab();
      case 'Company Formation':
        return renderCompanyFormationTab();
      case 'Forex':
        return renderForexTab();
      case 'Review':
        return renderReviewTab();
      default:
        return <div>Select a requirement type</div>;
    }
  };

  // Send Itinerary Modal Component
  const SendItineraryModal = () => {
    if (!showItineraryModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Send Itinerary</h3>
              <button
                onClick={handleCloseItineraryModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <p className="text-sm text-gray-600 mb-6">
              Select the requirement types you want to include in the itinerary:
            </p>

            <div className="space-y-4">
              {requirementTypes.map((type) => (
                <div key={type} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={itinerarySelections[type]?.selected || false}
                        onChange={(e) => handleItinerarySelectionChange(type, 'selected', e.target.checked)}
                        className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm font-medium text-gray-700">{type}</span>
                    </label>
                  </div>
                  
                  {itinerarySelections[type]?.selected && (
                    <div className="mt-3 ml-7 space-y-2">
                      <label className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name={`${type}-amount`}
                          checked={itinerarySelections[type]?.withAmount === true}
                          onChange={() => handleItinerarySelectionChange(type, 'withAmount', true)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">With Amount</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name={`${type}-amount`}
                          checked={itinerarySelections[type]?.withAmount === false}
                          onChange={() => handleItinerarySelectionChange(type, 'withAmount', false)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">Without Amount</span>
                      </label>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={handleCloseItineraryModal}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSendItinerary}
                disabled={sendingItinerary || !Object.values(itinerarySelections).some(item => item.selected)}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {sendingItinerary ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Sending...
                  </span>
                ) : (
                  'Send Itinerary'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
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
              
              <div className="flex space-x-3">
                {/* Send Itinerary Button */}
                <button
                  type="button"
                  onClick={handleOpenItineraryModal}
                  className="inline-flex items-center px-4 py-2 border border-green-600 text-sm font-medium rounded-md shadow-sm text-green-600 bg-white hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                  Send Itinerary
                </button>

                <button
                  type="submit"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  {activeTab < requirementTypes.length - 1 ? (
                    <>
                      Save & Continue
                      <svg className="-mr-1 ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4-4a1 1 0 010 1.414l-4-4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    </>
                  ) : 'Submit Query'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Send Itinerary Modal */}
      <SendItineraryModal />
    </div>
  );
}

export default NewQuery;