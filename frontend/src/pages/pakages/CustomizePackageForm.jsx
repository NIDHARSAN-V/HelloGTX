import React, { useState } from "react";
import {
  MapPin,
  Calendar,
  Clock,
  Users,
  Plane,
  Hotel,
  Train,
  Car,
  Utensils,
  Wifi,
  Luggage,
  Sun,
  Moon,
  Check,
  ChevronLeft,
  ChevronRight,
  Star,
  Waves,
} from "lucide-react";

const CustomizePackageForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    destination: "",
    travelDates: {
      start: "",
      end: "",
    },
    travelers: {
      adults: 1,
      children: 0,
      infants: 0,
    },
    flights: {
      departure: null,
      return: null,
      class: "economy",
    },
    hotels: [],
    trains: [],
    activities: [],
    preferences: {
      mealType: "",
      specialRequirements: "",
    },
    contactInfo: {
      name: "",
      email: "",
      phone: "",
    },
  });

  const destinations = [
    { id: 1, name: "Bali, Indonesia", image: "bali.jpg" },
    { id: 2, name: "Tokyo, Japan", image: "tokyo.jpg" },
    { id: 3, name: "Paris, France", image: "paris.jpg" },
    { id: 4, name: "New York, USA", image: "newyork.jpg" },
    { id: 5, name: "Sydney, Australia", image: "sydney.jpg" },
  ];

  const flightOptions = [
    {
      id: 1,
      airline: "Garuda Indonesia",
      flightNumber: "GA 123",
      departure: "08:00",
      arrival: "11:30",
      duration: "3h 30m",
      price: 250,
      stops: 0,
      class: "economy",
    },
    // More flight options...
  ];

  const hotelOptions = [
    {
      id: 1,
      name: "The Ritz-Carlton Bali",
      rating: 5,
      price: 200,
      amenities: ["pool", "spa", "wifi", "restaurant"],
      location: "Nusa Dua",
      image: "ritz-carlton.jpg",
    },
    // More hotel options...
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNestedInputChange = (section, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const handleDateChange = (field, date) => {
    setFormData((prev) => ({
      ...prev,
      travelDates: {
        ...prev.travelDates,
        [field]: date,
      },
    }));
  };

  const handleTravelerChange = (type, operation) => {
    setFormData((prev) => ({
      ...prev,
      travelers: {
        ...prev.travelers,
        [type]: operation === "increase" 
          ? prev.travelers[type] + 1 
          : Math.max(0, prev.travelers[type] - 1),
      },
    }));
  };

  const addHotel = (hotel) => {
    setFormData((prev) => ({
      ...prev,
      hotels: [...prev.hotels, hotel],
    }));
  };

  const removeHotel = (index) => {
    setFormData((prev) => {
      const updatedHotels = [...prev.hotels];
      updatedHotels.splice(index, 1);
      return {
        ...prev,
        hotels: updatedHotels,
      };
    });
  };

  const nextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, 6));
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Submit form data to backend
    console.log("Form submitted:", formData);
  };

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        {/* Form Header with Progress Steps */}
        <div className="bg-gray-50 px-6 py-4 border-b">
          <h1 className="text-2xl font-bold text-gray-800">
            Customize Your Travel Package
          </h1>
          <div className="flex justify-between mt-6">
            {[1, 2, 3, 4, 5, 6].map((step) => (
              <div
                key={step}
                className={`flex flex-col items-center ${
                  step < currentStep ? "text-green-500" : ""
                } ${step === currentStep ? "text-blue-500 font-medium" : ""}`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    step <= currentStep
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {step}
                </div>
                <span className="text-xs mt-1">
                  {step === 1 && "Destination"}
                  {step === 2 && "Travelers"}
                  {step === 3 && "Flights"}
                  {step === 4 && "Hotels"}
                  {step === 5 && "Extras"}
                  {step === 6 && "Review"}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="p-6">
          {/* Step 1: Destination */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-800">
                Where do you want to go?
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {destinations.map((destination) => (
                  <div
                    key={destination.id}
                    className={`border rounded-lg overflow-hidden cursor-pointer transition-all ${
                      formData.destination === destination.name
                        ? "ring-2 ring-blue-500 border-blue-500"
                        : "hover:border-blue-300"
                    }`}
                    onClick={() =>
                      handleInputChange({
                        target: { name: "destination", value: destination.name },
                      })
                    }
                  >
                    <div className="h-32 bg-gray-200 relative">
                      <img
                        src={`/images/${destination.image}`}
                        alt={destination.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-3">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1 text-gray-500" />
                        <h3 className="font-medium">{destination.name}</h3>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <input
                      type="date"
                      className="w-full pl-10 pr-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                      value={formData.travelDates.start}
                      onChange={(e) => handleDateChange("start", e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Date
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <input
                      type="date"
                      className="w-full pl-10 pr-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                      value={formData.travelDates.end}
                      onChange={(e) => handleDateChange("end", e.target.value)}
                      min={formData.travelDates.start}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Travelers */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-800">
                Who's traveling?
              </h2>
              
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">Adults</h3>
                      <p className="text-sm text-gray-500">Age 12+</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        className="w-8 h-8 rounded-full border flex items-center justify-center hover:bg-gray-100"
                        onClick={() => handleTravelerChange("adults", "decrease")}
                        disabled={formData.travelers.adults <= 1}
                      >
                        -
                      </button>
                      <span>{formData.travelers.adults}</span>
                      <button
                        type="button"
                        className="w-8 h-8 rounded-full border flex items-center justify-center hover:bg-gray-100"
                        onClick={() => handleTravelerChange("adults", "increase")}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">Children</h3>
                      <p className="text-sm text-gray-500">Ages 2-11</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        className="w-8 h-8 rounded-full border flex items-center justify-center hover:bg-gray-100"
                        onClick={() => handleTravelerChange("children", "decrease")}
                        disabled={formData.travelers.children <= 0}
                      >
                        -
                      </button>
                      <span>{formData.travelers.children}</span>
                      <button
                        type="button"
                        className="w-8 h-8 rounded-full border flex items-center justify-center hover:bg-gray-100"
                        onClick={() => handleTravelerChange("children", "increase")}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">Infants</h3>
                      <p className="text-sm text-gray-500">Under 2 years</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        className="w-8 h-8 rounded-full border flex items-center justify-center hover:bg-gray-100"
                        onClick={() => handleTravelerChange("infants", "decrease")}
                        disabled={formData.travelers.infants <= 0}
                      >
                        -
                      </button>
                      <span>{formData.travelers.infants}</span>
                      <button
                        type="button"
                        className="w-8 h-8 rounded-full border flex items-center justify-center hover:bg-gray-100"
                        onClick={() => handleTravelerChange("infants", "increase")}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Flights */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-800">
                Flight Options
              </h2>
              
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-3">Departure Flight</h3>
                  <div className="space-y-3">
                    {flightOptions.map((flight) => (
                      <div
                        key={flight.id}
                        className={`border rounded-lg p-3 cursor-pointer ${
                          formData.flights.departure?.id === flight.id
                            ? "border-blue-500 bg-blue-50"
                            : "hover:border-blue-300"
                        }`}
                        onClick={() =>
                          handleNestedInputChange("flights", "departure", flight)
                        }
                      >
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <Plane className="h-5 w-5 mr-2 text-blue-500" />
                            <span className="font-medium">{flight.airline}</span>
                          </div>
                          <span className="font-medium">${flight.price}</span>
                        </div>
                        <div className="grid grid-cols-3 mt-2 text-sm">
                          <div>
                            <div className="font-medium">{flight.departure}</div>
                            <div className="text-gray-500">Departure</div>
                          </div>
                          <div className="text-center">
                            <div className="text-xs text-gray-500">
                              {flight.duration}
                            </div>
                            <div className="w-full border-t my-1"></div>
                            <div className="text-xs">
                              {flight.stops === 0
                                ? "Non-stop"
                                : `${flight.stops} stop${flight.stops > 1 ? "s" : ""}`}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium">{flight.arrival}</div>
                            <div className="text-gray-500">Arrival</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-3">Return Flight</h3>
                  <div className="space-y-3">
                    {flightOptions.map((flight) => (
                      <div
                        key={flight.id}
                        className={`border rounded-lg p-3 cursor-pointer ${
                          formData.flights.return?.id === flight.id
                            ? "border-blue-500 bg-blue-50"
                            : "hover:border-blue-300"
                        }`}
                        onClick={() =>
                          handleNestedInputChange("flights", "return", flight)
                        }
                      >
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <Plane className="h-5 w-5 mr-2 text-blue-500" />
                            <span className="font-medium">{flight.airline}</span>
                          </div>
                          <span className="font-medium">${flight.price}</span>
                        </div>
                        <div className="grid grid-cols-3 mt-2 text-sm">
                          <div>
                            <div className="font-medium">{flight.departure}</div>
                            <div className="text-gray-500">Departure</div>
                          </div>
                          <div className="text-center">
                            <div className="text-xs text-gray-500">
                              {flight.duration}
                            </div>
                            <div className="w-full border-t my-1"></div>
                            <div className="text-xs">
                              {flight.stops === 0
                                ? "Non-stop"
                                : `${flight.stops} stop${flight.stops > 1 ? "s" : ""}`}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium">{flight.arrival}</div>
                            <div className="text-gray-500">Arrival</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-3">Flight Class</h3>
                  <div className="grid grid-cols-3 gap-2">
                    {["Economy", "Premium", "Business"].map((classType) => (
                      <button
                        key={classType}
                        type="button"
                        className={`py-2 px-3 rounded-md text-sm ${
                          formData.flights.class.toLowerCase() ===
                          classType.toLowerCase()
                            ? "bg-blue-500 text-white"
                            : "border hover:bg-gray-50"
                        }`}
                        onClick={() =>
                          handleNestedInputChange(
                            "flights",
                            "class",
                            classType.toLowerCase()
                          )
                        }
                      >
                        {classType}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Hotels */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-800">
                Accommodation
              </h2>
              
              <div className="space-y-4">
                {hotelOptions.map((hotel) => (
                  <div
                    key={hotel.id}
                    className={`border rounded-lg overflow-hidden ${
                      formData.hotels.some((h) => h.id === hotel.id)
                        ? "ring-2 ring-blue-500"
                        : ""
                    }`}
                  >
                    <div className="flex flex-col md:flex-row">
                      <div className="md:w-1/3 h-48 bg-gray-200 relative">
                        <img
                          src={`/images/${hotel.image}`}
                          alt={hotel.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-4 md:w-2/3">
                        <div className="flex justify-between">
                          <h3 className="font-medium text-lg">{hotel.name}</h3>
                          <div className="flex">
                            {Array.from({ length: hotel.rating }).map((_, i) => (
                              <Star
                                key={i}
                                className="h-4 w-4 fill-yellow-400 text-yellow-400"
                              />
                            ))}
                          </div>
                        </div>
                        <div className="flex items-center text-sm text-gray-500 mt-1">
                          <MapPin className="h-4 w-4 mr-1" />
                          <span>{hotel.location}</span>
                        </div>
                        
                        <div className="flex flex-wrap gap-2 mt-3">
                          {hotel.amenities.map((amenity, i) => (
                            <span
                              key={i}
                              className="flex items-center text-xs px-2 py-1 bg-gray-100 rounded-full"
                            >
                              {amenity === "wifi" && <Wifi className="h-3 w-3 mr-1" />}
                              {amenity === "pool" && (
                                <Waves className="h-3 w-3 mr-1" />
                              )}
                              {amenity === "restaurant" && (
                                <Utensils className="h-3 w-3 mr-1" />
                              )}
                              {amenity}
                            </span>
                          ))}
                        </div>
                        
                        <div className="flex justify-between items-center mt-4">
                          <div>
                            <span className="font-medium text-lg">
                              ${hotel.price}
                            </span>
                            <span className="text-sm text-gray-500">
                              /night
                            </span>
                          </div>
                          {formData.hotels.some((h) => h.id === hotel.id) ? (
                            <button
                              type="button"
                              className="px-4 py-2 bg-red-100 text-red-600 rounded-md text-sm"
                              onClick={() =>
                                removeHotel(
                                  formData.hotels.findIndex((h) => h.id === hotel.id)
                                )
                              }
                            >
                              Remove
                            </button>
                          ) : (
                            <button
                              type="button"
                              className="px-4 py-2 bg-blue-500 text-white rounded-md text-sm"
                              onClick={() => addHotel(hotel)}
                            >
                              Add to Package
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 5: Extras */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-800">
                Additional Options
              </h2>
              
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-3">Transportation</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border rounded-lg p-3 cursor-pointer hover:border-blue-300">
                      <div className="flex items-center">
                        <Car className="h-5 w-5 mr-2 text-blue-500" />
                        <span className="font-medium">Car Rental</span>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        Explore at your own pace with a rental car
                      </p>
                    </div>
                    <div className="border rounded-lg p-3 cursor-pointer hover:border-blue-300">
                      <div className="flex items-center">
                        <Train className="h-5 w-5 mr-2 text-blue-500" />
                        <span className="font-medium">Train Pass</span>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        Unlimited train travel within the region
                      </p>
                    </div>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-3">Activities</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border rounded-lg p-3 cursor-pointer hover:border-blue-300">
                      <div className="flex items-center">
                        <Sun className="h-5 w-5 mr-2 text-blue-500" />
                        <span className="font-medium">Guided Tours</span>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        Explore with expert local guides
                      </p>
                    </div>
                    <div className="border rounded-lg p-3 cursor-pointer hover:border-blue-300">
                      <div className="flex items-center">
                        <Moon className="h-5 w-5 mr-2 text-blue-500" />
                        <span className="font-medium">Night Experiences</span>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        Unique after-dark activities
                      </p>
                    </div>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-3">Meal Preferences</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {["Vegetarian", "Vegan", "Gluten-Free", "Halal"].map(
                      (mealType) => (
                        <button
                          key={mealType}
                          type="button"
                          className={`py-2 px-3 rounded-md text-sm ${
                            formData.preferences.mealType === mealType
                              ? "bg-blue-500 text-white"
                              : "border hover:bg-gray-50"
                          }`}
                          onClick={() =>
                            handleNestedInputChange(
                              "preferences",
                              "mealType",
                              mealType
                            )
                          }
                        >
                          {mealType}
                        </button>
                      )
                    )}
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-3">Special Requirements</h3>
                  <textarea
                    className="w-full p-3 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                    rows="3"
                    placeholder="Any special requests or requirements?"
                    value={formData.preferences.specialRequirements}
                    onChange={(e) =>
                      handleNestedInputChange(
                        "preferences",
                        "specialRequirements",
                        e.target.value
                      )
                    }
                  ></textarea>
                </div>
              </div>
            </div>
          )}

          {/* Step 6: Review & Contact */}
          {currentStep === 6 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-800">
                Review Your Package
              </h2>
              
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-3">Trip Summary</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="flex items-center text-gray-500 mb-1">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span>Destination</span>
                      </div>
                      <p className="font-medium">{formData.destination}</p>
                    </div>
                    <div>
                      <div className="flex items-center text-gray-500 mb-1">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>Travel Dates</span>
                      </div>
                      <p className="font-medium">
                        {formData.travelDates.start} to {formData.travelDates.end}
                      </p>
                    </div>
                    <div>
                      <div className="flex items-center text-gray-500 mb-1">
                        <Users className="h-4 w-4 mr-1" />
                        <span>Travelers</span>
                      </div>
                      <p className="font-medium">
                        {formData.travelers.adults} Adult
                        {formData.travelers.adults !== 1 ? "s" : ""}
                        {formData.travelers.children > 0 &&
                          `, ${formData.travelers.children} Child${
                            formData.travelers.children !== 1 ? "ren" : ""
                          }`}
                        {formData.travelers.infants > 0 &&
                          `, ${formData.travelers.infants} Infant${
                            formData.travelers.infants !== 1 ? "s" : ""
                          }`}
                      </p>
                    </div>
                    <div>
                      <div className="flex items-center text-gray-500 mb-1">
                        <Plane className="h-4 w-4 mr-1" />
                        <span>Flight Class</span>
                      </div>
                      <p className="font-medium capitalize">
                        {formData.flights.class}
                      </p>
                    </div>
                  </div>
                </div>

                {formData.flights.departure && (
                  <div className="border rounded-lg p-4">
                    <h3 className="font-medium mb-3">Flights</h3>
                    <div className="space-y-3">
                      <div className="border rounded-lg p-3">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <Plane className="h-5 w-5 mr-2 text-blue-500" />
                            <span className="font-medium">
                              {formData.flights.departure.airline}
                            </span>
                          </div>
                          <span className="font-medium">
                            ${formData.flights.departure.price}
                          </span>
                        </div>
                        <div className="grid grid-cols-3 mt-2 text-sm">
                          <div>
                            <div className="font-medium">
                              {formData.flights.departure.departure}
                            </div>
                            <div className="text-gray-500">Departure</div>
                          </div>
                          <div className="text-center">
                            <div className="text-xs text-gray-500">
                              {formData.flights.departure.duration}
                            </div>
                            <div className="w-full border-t my-1"></div>
                            <div className="text-xs">
                              {formData.flights.departure.stops === 0
                                ? "Non-stop"
                                : `${formData.flights.departure.stops} stop${
                                    formData.flights.departure.stops > 1 ? "s" : ""
                                  }`}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium">
                              {formData.flights.departure.arrival}
                            </div>
                            <div className="text-gray-500">Arrival</div>
                          </div>
                        </div>
                      </div>

                      {formData.flights.return && (
                        <div className="border rounded-lg p-3">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center">
                              <Plane className="h-5 w-5 mr-2 text-blue-500" />
                              <span className="font-medium">
                                {formData.flights.return.airline}
                              </span>
                            </div>
                            <span className="font-medium">
                              ${formData.flights.return.price}
                            </span>
                          </div>
                          <div className="grid grid-cols-3 mt-2 text-sm">
                            <div>
                              <div className="font-medium">
                                {formData.flights.return.departure}
                              </div>
                              <div className="text-gray-500">Departure</div>
                            </div>
                            <div className="text-center">
                              <div className="text-xs text-gray-500">
                                {formData.flights.return.duration}
                              </div>
                              <div className="w-full border-t my-1"></div>
                              <div className="text-xs">
                                {formData.flights.return.stops === 0
                                  ? "Non-stop"
                                  : `${formData.flights.return.stops} stop${
                                      formData.flights.return.stops > 1 ? "s" : ""
                                    }`}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-medium">
                                {formData.flights.return.arrival}
                              </div>
                              <div className="text-gray-500">Arrival</div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {formData.hotels.length > 0 && (
                  <div className="border rounded-lg p-4">
                    <h3 className="font-medium mb-3">Accommodations</h3>
                    <div className="space-y-4">
                      {formData.hotels.map((hotel, index) => (
                        <div
                          key={index}
                          className="border rounded-lg overflow-hidden"
                        >
                          <div className="flex flex-col md:flex-row">
                            <div className="md:w-1/3 h-32 bg-gray-200 relative">
                              <img
                                src={`/images/${hotel.image}`}
                                alt={hotel.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="p-3 md:w-2/3">
                              <div className="flex justify-between">
                                <h3 className="font-medium">{hotel.name}</h3>
                                <div className="flex">
                                  {Array.from({ length: hotel.rating }).map(
                                    (_, i) => (
                                      <Star
                                        key={i}
                                        className="h-4 w-4 fill-yellow-400 text-yellow-400"
                                      />
                                    )
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center text-sm text-gray-500 mt-1">
                                <MapPin className="h-4 w-4 mr-1" />
                                <span>{hotel.location}</span>
                              </div>
                              <div className="mt-2">
                                <span className="font-medium">${hotel.price}</span>
                                <span className="text-sm text-gray-500">
                                  /night
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-3">Contact Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                        value={formData.contactInfo.name}
                        onChange={(e) =>
                          handleNestedInputChange(
                            "contactInfo",
                            "name",
                            e.target.value
                          )
                        }
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                        value={formData.contactInfo.email}
                        onChange={(e) =>
                          handleNestedInputChange(
                            "contactInfo",
                            "email",
                            e.target.value
                          )
                        }
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                        value={formData.contactInfo.phone}
                        onChange={(e) =>
                          handleNestedInputChange(
                            "contactInfo",
                            "phone",
                            e.target.value
                          )
                        }
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Form Navigation */}
          <div className="flex justify-between mt-8">
            {currentStep > 1 ? (
              <button
                type="button"
                className="px-4 py-2 border rounded-md flex items-center"
                onClick={prevStep}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Back
              </button>
            ) : (
              <div></div>
            )}
            {currentStep < 6 ? (
              <button
                type="button"
                className="px-4 py-2 bg-blue-500 text-white rounded-md flex items-center"
                onClick={nextStep}
                disabled={
                  (currentStep === 1 && !formData.destination) ||
                  (currentStep === 3 && !formData.flights.departure)
                }
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </button>
            ) : (
              <button
                type="submit"
                className="px-6 py-2 bg-green-500 text-white rounded-md flex items-center"
              >
                <Check className="h-4 w-4 mr-1" />
                Complete Booking
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default CustomizePackageForm;