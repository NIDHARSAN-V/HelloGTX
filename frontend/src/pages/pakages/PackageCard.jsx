import { Star } from 'lucide-react';
import React from 'react';
import { format } from 'date-fns';

const PackageCard = ({ pkg, onViewDetails }) => {
  const calculateDiscount = () => {
    if (pkg.pricing.discounts?.earlyBird || pkg.pricing.discounts?.group) {
      const discountAmount = pkg.pricing.basePrice - pkg.pricing.totalPrice;
      return Math.round((discountAmount / pkg.pricing.basePrice) * 100);
    }
    return 0;
  };

  const formatDateRange = () => {
    if (!pkg.flights || pkg.flights.length === 0) return 'Flexible dates';
    
    const departureDate = new Date(pkg.flights[0].departure.datetime);
    return `From ${format(departureDate, 'MMM d')}`;
  };

  const discountPercentage = calculateDiscount();

  return (
    <div className="relative bg-white rounded-lg overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-300">
      {/* Discount Badge */}
      {discountPercentage > 0 && (
        <div className="bg-red-500 text-white text-sm font-semibold px-3 py-1 inline-block rounded-br-lg absolute top-0 left-0 z-10">
          {discountPercentage}% OFF
        </div>
      )}

      {/* Image Section */}
      <img
        src={pkg.images.mainImage}
        alt={pkg.name}
        className="w-full h-48 object-cover cursor-pointer"
        onClick={onViewDetails}
      />

      {/* Content Section */}
      <div className="p-4">
        {/* Rating and Date */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
            <span className="ml-1 text-sm font-semibold">4.8</span>
          </div>
          <span className="text-xs text-gray-500">{formatDateRange()}</span>
        </div>

        {/* Title */}
        <h3 
          className="text-md font-bold mb-2 cursor-pointer hover:text-blue-600"
          onClick={onViewDetails}
        >
          {pkg.name}
        </h3>

        {/* Description */}
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {pkg.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-4">
          {pkg.tags?.map((tag) => (
            <span 
              key={tag} 
              className="text-xs px-2 py-1 bg-gray-100 rounded-full text-gray-600"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Price */}
        <div className="flex items-center justify-between mb-4">
          <div>
            {discountPercentage > 0 && (
              <span className="text-sm font-semibold text-gray-500 line-through mr-2">
                ${pkg.pricing.basePrice}
              </span>
            )}
            <span className="text-lg font-bold text-blue-600">
              ${pkg.pricing.totalPrice}
            </span>
            <span className="text-xs text-gray-500 ml-1">/person</span>
          </div>
          <span className="text-xs text-gray-500">
            {pkg.includes.flights ? 'Flights included' : 'No flights'}
          </span>
        </div>

        {/* View Details Button */}
        <button 
          className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          onClick={onViewDetails}
        >
          View Details
        </button>
      </div>
    </div>
  );
};

export default PackageCard;