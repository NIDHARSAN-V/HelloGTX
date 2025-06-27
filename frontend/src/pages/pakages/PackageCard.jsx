import { Star } from 'lucide-react'
import React from 'react'

const PackageCard = ({ item }) => {
  return (
    <div className="relative bg-white rounded-lg overflow-hidden border-1 border-gray-200">
      {/* Discount Badge */}
      <div className="bg-red-500 text-white text-sm font-semibold px-3 py-1 inline-block rounded-br-lg absolute top-0 left-0 z-10">
        {item.discount} OFF
      </div>

      {/* Image Section */}
      <img
        src={item.image}
        alt={item.title}
        className="w-full h-48 object-cover"
      />

      {/* Content Section */}
      <div className="p-4">
        {/* Rating */}
        <div className="flex items-center mb-2">
          <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />{" "}
          {/* Star icon */}
          <span className="ml-1 text-sm font-semibold">{item.rating}</span>
        </div>

        {/* Title */}
        <h3 className="text-md font-bold mb-2">{item.title}</h3>

        {/* Description */}
        <p className="text-sm text-gray-600 mb-4">{item.description}</p>

        {/* Price and Discounted Price */}
        <div className="flex items-center mb-4">
          <span className="text-sm font-semibold text-gray-500 line-through ">
            ${item.originalPrice}
          </span>
          <span className="ml-2 text-sm font-bold text-blue-600 text-primary">
            ${item.discountedPrice}/person
          </span>
        </div>

        {/* Book Now Button */}
        <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 bg-primary">
          Book Now
        </button>
      </div>
    </div>
  )
}

export default PackageCard