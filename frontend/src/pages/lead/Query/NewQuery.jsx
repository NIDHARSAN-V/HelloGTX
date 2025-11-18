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
    'Package', 'Flight', 'Transfer', 'Visa', 'Hotel',
    'Sightseeing', 'Miscellaneous', 'Company Formation', 'Forex', 'Day-wise Itinerary'
  ];
  const [activeTab, setActiveTab] = useState(0);
  
  // Send Itinerary Modal State
  const [showItineraryModal, setShowItineraryModal] = useState(false);
  const [itinerarySelections, setItinerarySelections] = useState({});
  const [sendingItinerary, setSendingItinerary] = useState(false);

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

  // Day-wise Itinerary State
  const [dayWiseItinerary, setDayWiseItinerary] = useState([
    {
      day: 1,
      date: '',
      description: '',
      flights: [{
        airline: '',
        flightNumber: '',
        from: '',
        to: '',
        departureTime: '',
        arrivalTime: '',
        flightClass: '',
        preferredAirline: ''
      }],
      hotels: [{
        name: '',
        checkIn: '',
        checkOut: '',
        roomType: '',
        mealPlan: '',
        adults: 2,
        children: 0
      }],
      transfers: [{
        pickup: '',
        dropoff: '',
        vehicleType: 'Sedan'
      }],
      activities: [],
      meals: [],
      notes: ''
    }
  ]);

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

  // Auto-create days when noOfDays changes
  useEffect(() => {
    if (formData.noOfDays && formData.noOfDays > 0) {
      const numberOfDays = parseInt(formData.noOfDays);
      if (numberOfDays > dayWiseItinerary.length) {
        // Add new days
        const newDays = [];
        for (let i = dayWiseItinerary.length + 1; i <= numberOfDays; i++) {
          newDays.push({
            day: i,
            date: '',
            description: '',
            flights: [{
              airline: '',
              flightNumber: '',
              from: '',
              to: '',
              departureTime: '',
              arrivalTime: '',
              flightClass: '',
              preferredAirline: ''
            }],
            hotels: [{
              name: '',
              checkIn: '',
              checkOut: '',
              roomType: '',
              mealPlan: '',
              adults: 2,
              children: 0
            }],
            transfers: [{
              pickup: '',
              dropoff: '',
              vehicleType: 'Sedan'
            }],
            activities: [],
            meals: [],
            notes: ''
          });
        }
        setDayWiseItinerary(prev => [...prev, ...newDays]);
      } else if (numberOfDays < dayWiseItinerary.length) {
        // Remove extra days
        setDayWiseItinerary(prev => prev.slice(0, numberOfDays));
      }
    }
  }, [formData.noOfDays]);

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

  // Day-wise Itinerary Handlers
  const addNewDay = () => {
    setDayWiseItinerary(prev => [
      ...prev,
      {
        day: prev.length + 1,
        date: '',
        description: '',
        flights: [{
          airline: '',
          flightNumber: '',
          from: '',
          to: '',
          departureTime: '',
          arrivalTime: '',
          flightClass: '',
          preferredAirline: ''
        }],
        hotels: [{
          name: '',
          checkIn: '',
          checkOut: '',
          roomType: '',
          mealPlan: '',
          adults: 2,
          children: 0
        }],
        transfers: [{
          pickup: '',
          dropoff: '',
          vehicleType: 'Sedan'
        }],
        activities: [],
        meals: [],
        notes: ''
      }
    ]);
  };

  const removeDay = (dayIndex) => {
    if (dayWiseItinerary.length > 1) {
      setDayWiseItinerary(prev => prev.filter((_, index) => index !== dayIndex));
    }
  };

  const handleDayFieldChange = (dayIndex, field, value) => {
    setDayWiseItinerary(prev => 
      prev.map((day, index) => 
        index === dayIndex ? { ...day, [field]: value } : day
      )
    );
  };

  const handleDayFlightChange = (dayIndex, flightIndex, field, value) => {
    setDayWiseItinerary(prev => 
      prev.map((day, index) => {
        if (index === dayIndex) {
          const flights = [...day.flights];
          flights[flightIndex] = { ...flights[flightIndex], [field]: value };
          return { ...day, flights };
        }
        return day;
      })
    );
  };

  const handleDayHotelChange = (dayIndex, hotelIndex, field, value) => {
    setDayWiseItinerary(prev => 
      prev.map((day, index) => {
        if (index === dayIndex) {
          const hotels = [...day.hotels];
          hotels[hotelIndex] = { ...hotels[hotelIndex], [field]: value };
          return { ...day, hotels };
        }
        return day;
      })
    );
  };

  const handleDayTransferChange = (dayIndex, transferIndex, field, value) => {
    setDayWiseItinerary(prev => 
      prev.map((day, index) => {
        if (index === dayIndex) {
          const transfers = [...day.transfers];
          transfers[transferIndex] = { ...transfers[transferIndex], [field]: value };
          return { ...day, transfers };
        }
        return day;
      })
    );
  };

  const addActivity = (dayIndex) => {
    setDayWiseItinerary(prev => 
      prev.map((day, index) => 
        index === dayIndex 
          ? { ...day, activities: [...day.activities, ''] }
          : day
      )
    );
  };

  const removeActivity = (dayIndex, activityIndex) => {
    setDayWiseItinerary(prev => 
      prev.map((day, index) => 
        index === dayIndex 
          ? { ...day, activities: day.activities.filter((_, idx) => idx !== activityIndex) }
          : day
      )
    );
  };

  const handleDayActivityChange = (dayIndex, activityIndex, value) => {
    setDayWiseItinerary(prev => 
      prev.map((day, index) => {
        if (index === dayIndex) {
          const activities = [...day.activities];
          activities[activityIndex] = value;
          return { ...day, activities };
        }
        return day;
      })
    );
  };

  const handleDayMealChange = (dayIndex, meal, isChecked) => {
    setDayWiseItinerary(prev => 
      prev.map((day, index) => {
        if (index === dayIndex) {
          const meals = isChecked 
            ? [...day.meals, meal]
            : day.meals.filter(m => m !== meal);
          return { ...day, meals };
        }
        return day;
      })
    );
  };

  // Sync data from individual tabs to day-wise itinerary
  const syncDataToDayWiseItinerary = () => {
    setDayWiseItinerary(prev => 
      prev.map((day, index) => {
        const updatedDay = { ...day };
        
        // Sync flight data
        if (formData.sourceCity || formData.destinationCity) {
          updatedDay.flights = [{
            ...updatedDay.flights[0],
            airline: formData.preferredAirline || '',
            from: formData.sourceCity || '',
            to: formData.destinationCity || '',
            departureTime: formData.departureDate || '',
            arrivalTime: formData.returnDate || '',
            flightClass: formData.flightClass || '',
            preferredAirline: formData.preferredAirline || ''
          }];
        }

        // Sync hotel data
        if (formData.goingTo || formData.hotelDetails.checkIn) {
          updatedDay.hotels = [{
            ...updatedDay.hotels[0],
            name: `Hotel in ${formData.goingTo}`,
            checkIn: formData.hotelDetails.checkIn || '',
            checkOut: formData.hotelDetails.checkOut || '',
            roomType: formData.hotelDetails.roomType || '',
            mealPlan: formData.hotelDetails.mealPlan || '',
            adults: formData.hotelDetails.adults || 2,
            children: formData.hotelDetails.children || 0
          }];
        }

        // Sync transfer data
        if (formData.transferDetails.pickup || formData.transferDetails.dropoff) {
          updatedDay.transfers = [{
            ...updatedDay.transfers[0],
            pickup: formData.transferDetails.pickup || '',
            dropoff: formData.transferDetails.dropoff || '',
            vehicleType: formData.transferDetails.vehicleType || 'Sedan'
          }];
        }

        // Sync visa data to notes
        if (formData.visaDetails.country) {
          updatedDay.notes = `Visa Requirements: ${formData.visaDetails.country} - ${formData.visaDetails.type} Visa (Processing: ${formData.visaDetails.processingTime})`;
        }

        return updatedDay;
      })
    );
  };

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
      // Sync data before moving to next tab
      if (activeTab === 0) { // Package tab
        // Auto-create days based on noOfDays
        if (formData.noOfDays && formData.noOfDays > 0) {
          const numberOfDays = parseInt(formData.noOfDays);
          const newDays = [];
          for (let i = 1; i <= numberOfDays; i++) {
            newDays.push({
              day: i,
              date: formData.specificDate || '',
              description: `Day ${i} of your ${formData.noOfDays}-day ${formData.queryType} package from ${formData.goingFrom} to ${formData.goingTo}`,
              flights: [{
                airline: '',
                flightNumber: '',
                from: formData.goingFrom || '',
                to: formData.goingTo || '',
                departureTime: '',
                arrivalTime: '',
                flightClass: formData.flightClass || 'Economy',
                preferredAirline: formData.preferredAirline || ''
              }],
              hotels: [{
                name: '',
                checkIn: '',
                checkOut: '',
                roomType: formData.hotelDetails.roomType || 'Standard',
                mealPlan: formData.hotelDetails.mealPlan || 'breakfast',
                adults: formData.travellers || 2,
                children: 0
              }],
              transfers: [{
                pickup: '',
                dropoff: '',
                vehicleType: 'Sedan'
              }],
              activities: [],
              meals: formData.foodPreferences || [],
              notes: formData.remarks || ''
            });
          }
          setDayWiseItinerary(newDays);
        }
      } else {
        // Sync data from current tab to day-wise itinerary
        syncDataToDayWiseItinerary();
      }
      
      setActiveTab(activeTab + 1);
    } else {
      // Final submission
      const payload = {
        formData: {
          ...formData,
          // Include day-wise itinerary if we're on that tab
          ...(requirementTypes[activeTab] === 'Day-wise Itinerary' && { dayWiseItinerary })
        },
        leadId,
        customer,
        employee,
      };

      console.log(payload, 'Submitting payload');

      try {
        const response = await axios.post(
          "http://localhost:8000/api/employee/new-query",
          payload
        );

        console.log('Final form submission:', payload);
        alert('Form submitted successfully!');
      } catch (error) {
        console.error('Error submitting form:', error);
        alert('Failed to submit the form. Please try again.');
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

      // Extract relevant data for each requirement type
      const itineraryData = {};
      
      if (itinerarySelections.Package?.selected) {
        itineraryData.package = {
          queryType: formData.queryType,
          goingFrom: formData.goingFrom,
          goingTo: formData.goingTo,
          specificDate: formData.specificDate,
          noOfDays: formData.noOfDays,
          travellers: formData.travellers,
          priceRange: formData.priceRange,
          inclusions: formData.inclusions,
          themes: formData.themes,
          hotelPreference: formData.hotelPreference,
          foodPreferences: formData.foodPreferences,
          remarks: formData.remarks,
          expectedClosureDate: formData.expectedClosureDate,
          expectedClosureAmount: itinerarySelections.Package.withAmount ? formData.expectedClosureAmount : undefined
        };
      }

      if (itinerarySelections.Flight?.selected) {
        itineraryData.flight = {
          selectionType: formData.flightSelectionType,
          selectedFlightPackage: formData.selectedFlightPackage,
          flightType: formData.flightType,
          sourceCity: formData.sourceCity,
          destinationCity: formData.destinationCity,
          departureDate: formData.departureDate,
          returnDate: formData.returnDate,
          adults: formData.adults,
          children: formData.children,
          infants: formData.infants,
          flightClass: formData.flightClass,
          preferredAirline: formData.preferredAirline,
          remarks: formData.remarks,
          expectedClosureDate: formData.expectedClosureDate,
          expectedClosureAmount: itinerarySelections.Flight.withAmount ? formData.expectedClosureAmount : undefined,
          thirdPartyDetails: formData.flightSelectionType === 'thirdParty' ? {
            pnr: formData.thirdPartyFlightDetails.pnr,
            supplier: formData.thirdPartyFlightDetails.supplier,
            cost: formData.thirdPartyFlightDetails.cost
          } : undefined
        };
      }

      if (itinerarySelections.Hotel?.selected) {
        itineraryData.hotel = {
          selectionType: formData.hotelSelectionType,
          selectedHotelPackage: formData.selectedHotelPackage,
          location: formData.goingTo,
          hotelPreference: formData.hotelPreference,
          hotelDetails: {
            checkIn: formData.hotelDetails.checkIn,
            checkOut: formData.hotelDetails.checkOut,
            roomType: formData.hotelDetails.roomType,
            adults: formData.hotelDetails.adults,
            children: formData.hotelDetails.children,
            mealPlan: formData.hotelDetails.mealPlan
          },
          remarks: formData.remarks,
          expectedClosureDate: formData.expectedClosureDate,
          expectedClosureAmount: itinerarySelections.Hotel.withAmount ? formData.expectedClosureAmount : undefined,
          thirdPartyDetails: formData.hotelSelectionType === 'thirdParty' ? {
            confirmationNumber: formData.thirdPartyHotelDetails.confirmationNumber,
            supplier: formData.thirdPartyHotelDetails.supplier,
            cost: formData.thirdPartyHotelDetails.cost
          } : undefined
        };
      }

      // Add other requirement types
      if (itinerarySelections.Transfer?.selected) {
        itineraryData.transfer = {
          pickup: formData.transferDetails.pickup,
          dropoff: formData.transferDetails.dropoff,
          vehicleType: formData.transferDetails.vehicleType,
          remarks: formData.remarks,
          expectedClosureDate: formData.expectedClosureDate,
          expectedClosureAmount: itinerarySelections.Transfer.withAmount ? formData.expectedClosureAmount : undefined
        };
      }

      if (itinerarySelections.Visa?.selected) {
        itineraryData.visa = {
          country: formData.visaDetails.country,
          type: formData.visaDetails.type,
          processingTime: formData.visaDetails.processingTime,
          remarks: formData.remarks,
          expectedClosureDate: formData.expectedClosureDate,
          expectedClosureAmount: itinerarySelections.Visa.withAmount ? formData.expectedClosureAmount : undefined
        };
      }

      // Include day-wise itinerary if selected
      if (itinerarySelections['Day-wise Itinerary']?.selected) {
        itineraryData.dayWiseItinerary = dayWiseItinerary;
      }

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
        
        ${data.flight ? `
        <div class="itinerary-section">
            <div class="section-title"><span class="section-icon">✈️</span> Flight Details</div>
            <table class="details-table">
                <tr>
                    <th>Route</th>
                    <th>Departure</th>
                    <th>Passengers</th>
                    <th>Class</th>
                </tr>
                <tr>
                    <td>${data.flight.sourceCity} → ${data.flight.destinationCity}</td>
                    <td>${data.flight.departureDate}</td>
                    <td>${data.flight.adults} Adults, ${data.flight.children} Children, ${data.flight.infants} Infants</td>
                    <td>${data.flight.flightClass}</td>
                </tr>
            </table>
            ${data.flight.expectedClosureAmount ? `
            <div class="amount-section">
                <div class="amount-label">Expected Closure Amount</div>
                <div class="amount-value">$${data.flight.expectedClosureAmount}</div>
            </div>` : ''}
        </div>` : ''}
        
        ${data.hotel ? `
        <div class="itinerary-section">
            <div class="section-title"><span class="section-icon">🏨</span> Hotel Details</div>
            <table class="details-table">
                <tr>
                    <th>Location</th>
                    <th>Check-in</th>
                    <th>Check-out</th>
                    <th>Guests</th>
                </tr>
                <tr>
                    <td>${data.hotel.location}</td>
                    <td>${data.hotel.hotelDetails.checkIn}</td>
                    <td>${data.hotel.hotelDetails.checkOut}</td>
                    <td>${data.hotel.hotelDetails.adults} Adults, ${data.hotel.hotelDetails.children} Children</td>
                </tr>
            </table>
            ${data.hotel.expectedClosureAmount ? `
            <div class="amount-section">
                <div class="amount-label">Expected Closure Amount</div>
                <div class="amount-value">$${data.hotel.expectedClosureAmount}</div>
            </div>` : ''}
        </div>` : ''}
        
        ${data.transfer ? `
        <div class="itinerary-section">
            <div class="section-title"><span class="section-icon">🚗</span> Transfer Details</div>
            <table class="details-table">
                <tr>
                    <th>Pickup</th>
                    <th>Dropoff</th>
                    <th>Vehicle Type</th>
                </tr>
                <tr>
                    <td>${data.transfer.pickup}</td>
                    <td>${data.transfer.dropoff}</td>
                    <td>${data.transfer.vehicleType}</td>
                </tr>
            </table>
            ${data.transfer.expectedClosureAmount ? `
            <div class="amount-section">
                <div class="amount-label">Expected Closure Amount</div>
                <div class="amount-value">$${data.transfer.expectedClosureAmount}</div>
            </div>` : ''}
        </div>` : ''}
        
        ${data.visa ? `
        <div class="itinerary-section">
            <div class="section-title"><span class="section-icon">🛂</span> Visa Details</div>
            <table class="details-table">
                <tr>
                    <th>Country</th>
                    <th>Visa Type</th>
                    <th>Processing Time</th>
                </tr>
                <tr>
                    <td>${data.visa.country}</td>
                    <td>${data.visa.type}</td>
                    <td>${data.visa.processingTime}</td>
                </tr>
            </table>
            ${data.visa.expectedClosureAmount ? `
            <div class="amount-section">
                <div class="amount-label">Expected Closure Amount</div>
                <div class="amount-value">$${data.visa.expectedClosureAmount}</div>
            </div>` : ''}
        </div>` : ''}
        
        ${data.dayWiseItinerary && data.dayWiseItinerary.length > 0 ? `
        <div class="itinerary-section">
            <div class="section-title"><span class="section-icon">📅</span> Day-wise Itinerary</div>
            ${data.dayWiseItinerary.map(day => `
                <div style="margin-bottom: 30px; padding: 20px; background: #f8fafc; border-radius: 8px; border-left: 4px solid #4299e1;">
                    <h3 style="color: #2d3748; margin-bottom: 15px; font-size: 1.2em;">Day ${day.day} ${day.date ? `- ${day.date}` : ''}</h3>
                    ${day.description ? `<p style="margin-bottom: 15px; color: #4a5568;">${day.description}</p>` : ''}
                    
                    ${day.flights && day.flights[0] && day.flights[0].airline ? `
                    <div style="margin-bottom: 15px;">
                        <h4 style="color: #2d3748; margin-bottom: 8px;">✈️ Flight</h4>
                        <p><strong>${day.flights[0].airline}</strong> ${day.flights[0].flightNumber || ''} | 
                        ${day.flights[0].from || ''} → ${day.flights[0].to || ''}</p>
                        ${day.flights[0].departureTime ? `<p>Departure: ${day.flights[0].departureTime}</p>` : ''}
                        ${day.flights[0].arrivalTime ? `<p>Arrival: ${day.flights[0].arrivalTime}</p>` : ''}
                    </div>
                    ` : ''}
                    
                    ${day.hotels && day.hotels[0] && day.hotels[0].name ? `
                    <div style="margin-bottom: 15px;">
                        <h4 style="color: #2d3748; margin-bottom: 8px;">🏨 Accommodation</h4>
                        <p><strong>${day.hotels[0].name}</strong> | ${day.hotels[0].roomType || ''}</p>
                        ${day.hotels[0].checkIn ? `<p>Check-in: ${day.hotels[0].checkIn}</p>` : ''}
                        ${day.hotels[0].checkOut ? `<p>Check-out: ${day.hotels[0].checkOut}</p>` : ''}
                    </div>
                    ` : ''}
                    
                    ${day.activities && day.activities.length > 0 ? `
                    <div style="margin-bottom: 15px;">
                        <h4 style="color: #2d3748; margin-bottom: 8px;">🏛️ Activities</h4>
                        <ul style="padding-left: 20px;">
                            ${day.activities.map(activity => `<li>${activity}</li>`).join('')}
                        </ul>
                    </div>
                    ` : ''}
                    
                    ${day.meals && day.meals.length > 0 ? `
                    <div style="margin-bottom: 15px;">
                        <h4 style="color: #2d3748; margin-bottom: 8px;">🍽️ Meals Included</h4>
                        <p>${day.meals.join(', ')}</p>
                    </div>
                    ` : ''}
                    
                    ${day.notes ? `
                    <div>
                        <h4 style="color: #2d3748; margin-bottom: 8px;">📝 Notes</h4>
                        <p>${day.notes}</p>
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

  // Day-wise Itinerary Component
  const dayWiseItineraryFields = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Day-wise Itinerary Planner</h3>
        <button
          type="button"
          onClick={addNewDay}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          Add Day
        </button>
      </div>

      {dayWiseItinerary.map((day, dayIndex) => (
        <div key={dayIndex} className="border border-gray-200 rounded-lg p-6 bg-gray-50">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-lg font-semibold text-blue-600">Day {day.day}</h4>
            {dayWiseItinerary.length > 1 && (
              <button
                type="button"
                onClick={() => removeDay(dayIndex)}
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
                value={day.date}
                onChange={(e) => handleDayFieldChange(dayIndex, 'date', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Day Number</label>
              <input
                type="number"
                value={day.day}
                onChange={(e) => handleDayFieldChange(dayIndex, 'day', parseInt(e.target.value))}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                min="1"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Day Description</label>
            <textarea
              value={day.description}
              onChange={(e) => handleDayFieldChange(dayIndex, 'description', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              rows="3"
              placeholder="Describe the activities and schedule for this day..."
            />
          </div>

          {/* Flight for this day */}
          <div className="mb-4 p-4 bg-white rounded-lg border">
            <h5 className="font-semibold mb-3 flex items-center">
              <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
              Flight Details
            </h5>
            {day.flights.map((flight, flightIndex) => (
              <div key={flightIndex} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Airline</label>
                    <input
                      type="text"
                      value={flight.airline}
                      onChange={(e) => handleDayFlightChange(dayIndex, flightIndex, 'airline', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Airline name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Flight Number</label>
                    <input
                      type="text"
                      value={flight.flightNumber}
                      onChange={(e) => handleDayFlightChange(dayIndex, flightIndex, 'flightNumber', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Flight number"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">From</label>
                    <input
                      type="text"
                      value={flight.from}
                      onChange={(e) => handleDayFlightChange(dayIndex, flightIndex, 'from', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Departure city"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
                    <input
                      type="text"
                      value={flight.to}
                      onChange={(e) => handleDayFlightChange(dayIndex, flightIndex, 'to', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Arrival city"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Departure Time</label>
                    <input
                      type="time"
                      value={flight.departureTime}
                      onChange={(e) => handleDayFlightChange(dayIndex, flightIndex, 'departureTime', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Arrival Time</label>
                    <input
                      type="time"
                      value={flight.arrivalTime}
                      onChange={(e) => handleDayFlightChange(dayIndex, flightIndex, 'arrivalTime', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Hotel for this day */}
          <div className="mb-4 p-4 bg-white rounded-lg border">
            <h5 className="font-semibold mb-3 flex items-center">
              <svg className="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              Hotel Details
            </h5>
            {day.hotels.map((hotel, hotelIndex) => (
              <div key={hotelIndex} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Hotel Name</label>
                    <input
                      type="text"
                      value={hotel.name}
                      onChange={(e) => handleDayHotelChange(dayIndex, hotelIndex, 'name', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Hotel name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Room Type</label>
                    <select
                      value={hotel.roomType}
                      onChange={(e) => handleDayHotelChange(dayIndex, hotelIndex, 'roomType', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select Room Type</option>
                      <option value="Standard">Standard</option>
                      <option value="Deluxe">Deluxe</option>
                      <option value="Suite">Suite</option>
                      <option value="Executive">Executive</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Check-in</label>
                    <input
                      type="time"
                      value={hotel.checkIn}
                      onChange={(e) => handleDayHotelChange(dayIndex, hotelIndex, 'checkIn', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Check-out</label>
                    <input
                      type="time"
                      value={hotel.checkOut}
                      onChange={(e) => handleDayHotelChange(dayIndex, hotelIndex, 'checkOut', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Transfer for this day */}
          <div className="mb-4 p-4 bg-white rounded-lg border">
            <h5 className="font-semibold mb-3 flex items-center">
              <svg className="w-5 h-5 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
              Transfer Details
            </h5>
            {day.transfers.map((transfer, transferIndex) => (
              <div key={transferIndex} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Pickup Location</label>
                    <input
                      type="text"
                      value={transfer.pickup}
                      onChange={(e) => handleDayTransferChange(dayIndex, transferIndex, 'pickup', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Pickup location"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Dropoff Location</label>
                    <input
                      type="text"
                      value={transfer.dropoff}
                      onChange={(e) => handleDayTransferChange(dayIndex, transferIndex, 'dropoff', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Dropoff location"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Type</label>
                  <select
                    value={transfer.vehicleType}
                    onChange={(e) => handleDayTransferChange(dayIndex, transferIndex, 'vehicleType', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="Sedan">Sedan</option>
                    <option value="SUV">SUV</option>
                    <option value="Van">Van</option>
                    <option value="Luxury">Luxury</option>
                    <option value="Bus">Bus</option>
                  </select>
                </div>
              </div>
            ))}
          </div>

          {/* Activities for this day */}
          <div className="mb-4 p-4 bg-white rounded-lg border">
            <h5 className="font-semibold mb-3 flex items-center">
              <svg className="w-5 h-5 mr-2 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Activities & Sightseeing
            </h5>
            {day.activities.map((activity, activityIndex) => (
              <div key={activityIndex} className="flex gap-4 mb-3">
                <input
                  type="text"
                  value={activity}
                  onChange={(e) => handleDayActivityChange(dayIndex, activityIndex, e.target.value)}
                  className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Activity description"
                />
                <button
                  type="button"
                  onClick={() => removeActivity(dayIndex, activityIndex)}
                  className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addActivity(dayIndex)}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Add Activity
            </button>
          </div>

          {/* Meals for this day */}
          <div className="mb-4 p-4 bg-white rounded-lg border">
            <h5 className="font-semibold mb-3 flex items-center">
              <svg className="w-5 h-5 mr-2 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
              </svg>
              Meals Included
            </h5>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {['Breakfast', 'Lunch', 'Dinner', 'Snacks'].map((meal) => (
                <label key={meal} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={day.meals.includes(meal)}
                    onChange={(e) => handleDayMealChange(dayIndex, meal, e.target.checked)}
                    className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">{meal}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Notes for this day */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Additional Notes</label>
            <textarea
              value={day.notes}
              onChange={(e) => handleDayFieldChange(dayIndex, 'notes', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              rows="2"
              placeholder="Any special notes for this day..."
            />
          </div>
        </div>
      ))}
    </div>
  );

  // Individual Tab Components with Day-wise Structure
  const flightTabWithDays = () => (
    <div className="space-y-6">
      <div className="mb-6">
        <div className="flex border-b border-gray-200">
          <button
            type="button"
            onClick={() => setFormData({...formData, flightSelectionType: 'new'})}
            className={`py-2 px-4 font-medium text-sm ${formData.flightSelectionType === 'new' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Create New Flight
          </button>
          <button
            type="button"
            onClick={() => setFormData({...formData, flightSelectionType: 'existing'})}
            className={`py-2 px-4 font-medium text-sm ${formData.flightSelectionType === 'existing' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Select From Existing
          </button>
          <button
            type="button"
            onClick={() => setFormData({...formData, flightSelectionType: 'thirdParty'})}
            className={`py-2 px-4 font-medium text-sm ${formData.flightSelectionType === 'thirdParty' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Third Party Flight
          </button>
        </div>
      </div>

      {formData.flightSelectionType === 'new' && (
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

          {/* Day-wise Flight Sections */}
          {dayWiseItinerary.map((day, dayIndex) => (
            <div key={dayIndex} className="border border-gray-200 rounded-lg p-6 bg-gray-50">
              <h4 className="text-lg font-semibold text-blue-600 mb-4">Day {day.day} - Flight Details</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Source City *</label>
                  <input
                    type="text"
                    value={day.flights[0]?.from || formData.sourceCity}
                    onChange={(e) => {
                      handleDayFlightChange(dayIndex, 0, 'from', e.target.value);
                      setFormData(prev => ({...prev, sourceCity: e.target.value}));
                    }}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Destination City *</label>
                  <input
                    type="text"
                    value={day.flights[0]?.to || formData.destinationCity}
                    onChange={(e) => {
                      handleDayFlightChange(dayIndex, 0, 'to', e.target.value);
                      setFormData(prev => ({...prev, destinationCity: e.target.value}));
                    }}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Departure Date *</label>
                  <input
                    type="date"
                    value={formData.departureDate}
                    onChange={handleInputChange}
                    name="departureDate"
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Airline</label>
                  <input
                    type="text"
                    value={day.flights[0]?.airline || formData.preferredAirline}
                    onChange={(e) => {
                      handleDayFlightChange(dayIndex, 0, 'airline', e.target.value);
                      setFormData(prev => ({...prev, preferredAirline: e.target.value}));
                    }}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Airline name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
                  <select
                    value={day.flights[0]?.flightClass || formData.flightClass}
                    onChange={(e) => {
                      handleDayFlightChange(dayIndex, 0, 'flightClass', e.target.value);
                      setFormData(prev => ({...prev, flightClass: e.target.value}));
                    }}
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
          ))}
        </div>
      )}

      {formData.flightSelectionType === 'existing' && existingFlightPackages()}
      {formData.flightSelectionType === 'thirdParty' && ThirdPartyFlight()}
    </div>
  );

  const hotelTabWithDays = () => (
    <div className="space-y-6">
      <div className="mb-6">
        <div className="flex border-b border-gray-200">
          <button
            type="button"
            onClick={() => setFormData({...formData, hotelSelectionType: 'new'})}
            className={`py-2 px-4 font-medium text-sm ${formData.hotelSelectionType === 'new' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Create New Hotel
          </button>
          <button
            type="button"
            onClick={() => setFormData({...formData, hotelSelectionType: 'existing'})}
            className={`py-2 px-4 font-medium text-sm ${formData.hotelSelectionType === 'existing' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Select From Existing
          </button>
          <button
            type="button"
            onClick={() => setFormData({...formData, hotelSelectionType: 'thirdParty'})}
            className={`py-2 px-4 font-medium text-sm ${formData.hotelSelectionType === 'thirdParty' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Third Party Hotel
          </button>
        </div>
      </div>

      {formData.hotelSelectionType === 'new' && (
        <div className="space-y-6">
          {/* Day-wise Hotel Sections */}
          {dayWiseItinerary.map((day, dayIndex) => (
            <div key={dayIndex} className="border border-gray-200 rounded-lg p-6 bg-gray-50">
              <h4 className="text-lg font-semibold text-blue-600 mb-4">Day {day.day} - Hotel Details</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location/City *</label>
                  <input
                    type="text"
                    value={formData.goingTo}
                    onChange={handleInputChange}
                    name="goingTo"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Hotel Name</label>
                  <input
                    type="text"
                    value={day.hotels[0]?.name}
                    onChange={(e) => handleDayHotelChange(dayIndex, 0, 'name', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Hotel name"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Room Type</label>
                  <select
                    value={day.hotels[0]?.roomType || formData.hotelDetails.roomType}
                    onChange={(e) => {
                      handleDayHotelChange(dayIndex, 0, 'roomType', e.target.value);
                      setFormData(prev => ({
                        ...prev,
                        hotelDetails: {...prev.hotelDetails, roomType: e.target.value}
                      }));
                    }}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  >
                    {roomTypeOptions.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Meal Plan</label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {mealPlanOptions.map(option => (
                      <label key={option} className="inline-flex items-center">
                        <input
                          type="radio"
                          name={`mealPlan-${dayIndex}`}
                          checked={day.hotels[0]?.mealPlan === option || formData.hotelDetails.mealPlan === option}
                          onChange={() => {
                            handleDayHotelChange(dayIndex, 0, 'mealPlan', option);
                            setFormData(prev => ({
                              ...prev,
                              hotelDetails: {...prev.hotelDetails, mealPlan: option}
                            }));
                          }}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                        <span className="ml-2 text-sm text-gray-700 capitalize">{option.replace('_', ' ')}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {formData.hotelSelectionType === 'existing' && existingHotelPackages()}
      {formData.hotelSelectionType === 'thirdParty' && ThirdPartyHotel()}
    </div>
  );

  const transferTabWithDays = () => (
    <div className="space-y-6">
      {/* Day-wise Transfer Sections */}
      {dayWiseItinerary.map((day, dayIndex) => (
        <div key={dayIndex} className="border border-gray-200 rounded-lg p-6 bg-gray-50">
          <h4 className="text-lg font-semibold text-blue-600 mb-4">Day {day.day} - Transfer Details</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Pickup Location *</label>
              <input
                type="text"
                value={day.transfers[0]?.pickup || formData.transferDetails.pickup}
                onChange={(e) => {
                  handleDayTransferChange(dayIndex, 0, 'pickup', e.target.value);
                  setFormData(prev => ({
                    ...prev,
                    transferDetails: {...prev.transferDetails, pickup: e.target.value}
                  }));
                }}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Dropoff Location *</label>
              <input
                type="text"
                value={day.transfers[0]?.dropoff || formData.transferDetails.dropoff}
                onChange={(e) => {
                  handleDayTransferChange(dayIndex, 0, 'dropoff', e.target.value);
                  setFormData(prev => ({
                    ...prev,
                    transferDetails: {...prev.transferDetails, dropoff: e.target.value}
                  }));
                }}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Type</label>
            <select
              value={day.transfers[0]?.vehicleType || formData.transferDetails.vehicleType}
              onChange={(e) => {
                handleDayTransferChange(dayIndex, 0, 'vehicleType', e.target.value);
                setFormData(prev => ({
                  ...prev,
                  transferDetails: {...prev.transferDetails, vehicleType: e.target.value}
                }));
              }}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="Sedan">Sedan</option>
              <option value="SUV">SUV</option>
              <option value="Van">Van</option>
              <option value="Luxury">Luxury</option>
              <option value="Bus">Bus</option>
            </select>
          </div>
        </div>
      ))}
    </div>
  );

  const visaTabWithDays = () => (
    <div className="space-y-6">
      {/* Day-wise Visa Sections */}
      {dayWiseItinerary.map((day, dayIndex) => (
        <div key={dayIndex} className="border border-gray-200 rounded-lg p-6 bg-gray-50">
          <h4 className="text-lg font-semibold text-blue-600 mb-4">Day {day.day} - Visa Requirements</h4>
          
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

          <div className="mt-4">
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

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Visa Notes</label>
            <textarea
              value={day.notes}
              onChange={(e) => handleDayFieldChange(dayIndex, 'notes', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              rows="3"
              placeholder="Visa requirements and notes..."
            />
          </div>
        </div>
      ))}
    </div>
  );

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

  // Rest of the existing code for existingFlightPackages, existingHotelPackages, ThirdPartyFlight, ThirdPartyHotel
  // ... (keep all the existing functions for flight packages, hotel packages, etc.)

  const existingFlightPackages = () => (
    <div>
      {flightLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div>
          {/* Flight package filters */}
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

          {/* Flight packages list */}
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

  const existingHotelPackages = () => (
    <div>
      {hotelLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div>
          {/* Hotel package filters */}
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

          {/* Hotel packages list */}
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

  const ThirdPartyFlight = () => (
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

  const ThirdPartyHotel = () => (
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

    const packageFields = () => (
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
            <label className="block text-sm font-medium text-gray-700 mb-1">No Of Days *</label>
            <input
              type="number"
              name="noOfDays"
              value={formData.noOfDays}
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

        {/* Show created days preview */}
        {formData.noOfDays && parseInt(formData.noOfDays) > 0 && (
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2">
              {formData.noOfDays} days will be created automatically when you click "Save & Continue"
            </h4>
            <p className="text-sm text-blue-600">
              Each day will include the basic information from this package and can be customized in subsequent tabs.
            </p>
          </div>
        )}
      </div>
    );

    const typeSpecificFields = () => {
      const currentType = requirementTypes[activeTab];
      
      switch(currentType) {
        case 'Package':
          return packageFields();
        case 'Flight':
          return flightTabWithDays();
        case 'Hotel':
          return hotelTabWithDays();
        case 'Transfer':
          return transferTabWithDays();
        case 'Visa':
          return visaTabWithDays();
        case 'Day-wise Itinerary':
          return dayWiseItineraryFields();
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
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4-4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
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