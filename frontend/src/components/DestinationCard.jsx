import { MapPin, Star } from 'lucide-react'
import React from 'react'

const DestinationCard = ({item}) => {
  return (
    <div className="relative bg-white rounded-lg border-1 border-gray-200 overflow-hidden">
    {/* Image Section */}
    <img
      src={item.image}
      alt={item.name}
      className="w-full h-48 object-cover transition-transform transform hover:scale-105"
    />

    {/* Content Section */}
    <div className="p-4">
      {/* Rating */}
      <div className="flex items-center mb-2 absolute top-4 right-4 z-10 bg-white/100 p-1 rounded-md">
        <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />{" "}
        {/* Star icon */}
        <span className="ml-1 text-sm font-semibold">{item.rating}</span>
      </div>

      {/* Destination Name and Price */}
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-md font-bold">{item.name}</h3>
        <p className="text-sm font-semibold text-blue-600 text-primary">
          ${item.price}/person
        </p>
      </div>

      {/* Description */}
      <p className="text-sm text-gray-600 mb-4">{item.description}</p>

      {/* Location and Explore Button */}
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <MapPin className="h-4 w-4 text-gray-500" /> {/* Map pin icon */}
          <span className="ml-2 text-sm text-gray-600">{item.location}</span>
        </div>
        <button className="text-gray-500 border-1 border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors ">
          Explore
        </button>
      </div>
    </div>
  </div>
  )
}

export default DestinationCard