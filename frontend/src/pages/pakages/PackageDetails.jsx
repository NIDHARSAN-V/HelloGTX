import React from "react";
import { ArrowLeft } from "lucide-react";
import { Star } from "lucide-react";
import { format } from "date-fns";

const PackageDetails = ({ pkg, onBack }) => {
  const formatDateRange = () => {
    if (!pkg.flights || pkg.flights.length === 0) return 'Flexible dates';
    
    const departureDate = new Date(pkg.flights[0].departure.datetime);
    const returnFlight = pkg.flights.find(f => f.arrival.city === pkg.flights[0].departure.city);
    const returnDate = returnFlight ? new Date(returnFlight.arrival.datetime) : null;
    
    if (returnDate) {
      return `${format(departureDate, 'MMM d, yyyy')} - ${format(returnDate, 'MMM d, yyyy')}`;
    }
    return `From ${format(departureDate, 'MMM d, yyyy')}`;
  };

  const calculateDuration = () => {
    if (!pkg.flights || pkg.flights.length === 0) return 'N/A';
    
    const departureDate = new Date(pkg.flights[0].departure.datetime);
    const returnFlight = pkg.flights.find(f => f.arrival.city === pkg.flights[0].departure.city);
    if (!returnFlight) return 'N/A';
    
    const returnDate = new Date(returnFlight.arrival.datetime);
    const diffTime = Math.abs(returnDate - departureDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return `${diffDays} days`;
  };

  return (
    <div className="max-w-screen-xl mx-auto">
      <button 
        onClick={onBack}
        className="flex items-center text-blue-600 mb-6 hover:text-blue-800 transition-colors"
      >
        <ArrowLeft className="h-5 w-5 mr-2" />
        Back to Packages
      </button>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Package Header */}
        <div className="relative">
          <img
            src={pkg.images.mainImage}
            alt={pkg.name}
            className="w-full h-96 object-cover"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-6">
            <h1 className="text-3xl font-bold text-white">{pkg.name}</h1>
            <div className="flex items-center mt-2">
              <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
              <span className="ml-1 text-white">4.8 (120 reviews)</span>
            </div>
          </div>
        </div>

        {/* Package Body */}
        <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="flex flex-wrap gap-2 mb-6">
              {pkg.tags?.map((tag) => (
                <span 
                  key={tag} 
                  className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                >
                  {tag.charAt(0).toUpperCase() + tag.slice(1)}
                </span>
              ))}
            </div>

            <h2 className="text-2xl font-bold mb-4">Package Details</h2>
            <p className="text-gray-700 mb-6">{pkg.description}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <h3 className="font-semibold mb-2">Duration</h3>
                <p>{calculateDuration()}</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Travel Dates</h3>
                <p>{formatDateRange()}</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Includes</h3>
                <ul className="list-disc pl-5">
                  {pkg.includes.flights && <li>Flights</li>}
                  {pkg.includes.hotels && <li>Hotels</li>}
                  {pkg.includes.visas && <li>Visa assistance</li>}
                  {pkg.includes.transfers && <li>Transfers</li>}
                  {pkg.includes.activities && <li>Activities</li>}
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Meals</h3>
                <ul className="list-disc pl-5">
                  {pkg.includes.meals?.breakfast && <li>Breakfast</li>}
                  {pkg.includes.meals?.lunch && <li>Lunch</li>}
                  {pkg.includes.meals?.dinner && <li>Dinner</li>}
                </ul>
              </div>
            </div>

            <h2 className="text-2xl font-bold mb-4">Itinerary</h2>
            {pkg.hotels?.map((hotel, index) => (
              <div key={index} className="mb-6 border-l-4 border-blue-500 pl-4">
                <h3 className="font-semibold">Day {hotel.day}: {hotel.name}</h3>
                <p className="text-gray-600 text-sm mb-2">
                  {format(new Date(hotel.checkIn), 'MMM d, yyyy')} - {format(new Date(hotel.checkOut), 'MMM d, yyyy')}
                </p>
                <p className="text-gray-700">{hotel.location.address}, {hotel.location.city}</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {hotel.amenities?.map((amenity, i) => (
                    <span key={i} className="px-2 py-1 bg-gray-100 rounded-full text-xs">
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 p-6 rounded-lg sticky top-6">
              <h2 className="text-xl font-bold mb-4">Pricing</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span>Base Price:</span>
                  <span>${pkg.pricing.basePrice}</span>
                </div>
                {pkg.pricing.discounts?.earlyBird && (
                  <div className="flex justify-between text-green-600">
                    <span>Early Bird Discount:</span>
                    <span>-${pkg.pricing.discounts.earlyBird}</span>
                  </div>
                )}
                {pkg.pricing.discounts?.group && (
                  <div className="flex justify-between text-green-600">
                    <span>Group Discount:</span>
                    <span>-${pkg.pricing.discounts.group}</span>
                  </div>
                )}
                <div className="border-t border-gray-200 pt-2 font-bold flex justify-between">
                  <span>Total Price:</span>
                  <span>${pkg.pricing.totalPrice}</span>
                </div>
              </div>

              <h3 className="font-semibold mb-2">Payment Plan</h3>
              {pkg.pricing.paymentPlan?.installmentOptions?.map((option, index) => (
                <div key={index} className="mb-2 text-sm">
                  <div className="flex justify-between">
                    <span>{option.percentage}%:</span>
                    <span>${(pkg.pricing.totalPrice * option.percentage / 100).toFixed(2)}</span>
                  </div>
                  <div className="text-gray-500 text-xs">
                    Due: {format(new Date(option.dueDate), 'MMM d, yyyy')}
                  </div>
                </div>
              ))}

              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-semibold mt-6 transition-colors">
                Book Now
              </button>

              <div className="mt-4 text-sm text-gray-600">
                <h3 className="font-semibold mb-1">Cancellation Policy</h3>
                {pkg.cancellationPolicy?.freeCancellation ? (
                  <p>Free cancellation until {format(new Date(pkg.cancellationPolicy.deadline), 'MMM d, yyyy')}</p>
                ) : (
                  <p>Non-refundable</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PackageDetails;