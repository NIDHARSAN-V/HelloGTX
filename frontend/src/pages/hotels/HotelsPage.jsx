import React from "react";
import {
  Search,
  Filter,
  MapPin,
  Star,
  Wifi,
  Coffee,
  Tv,
  Utensils,
  ParkingMeterIcon as Parking,
  ShowerHeadIcon as SwimmingPool,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function HotelsPage() {
  return (
    <div className="container py-8 ">
      <div className="max-w-screen-xl mx-auto">
        <h1 className="text-4xl font-bold mb-2">Find the Perfect Hotel</h1>
        <p className="text-muted-foreground mb-8">
          Discover luxury accommodations for your next trip
        </p>
      </div>

      {/* Search Bar */}
      <div className="flex flex-col md:flex-row gap-4 mb-8 max-w-screen-xl mx-auto">
        <div className="relative flex-grow">
          <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Where are you going?"
            className="w-full pl-10 py-2 border border-gray-300 rounded-lg"
          />
        </div>
        <div className="flex-shrink-0 grid grid-cols-2 gap-4 md:w-1/3">
          <input
            type="date"
            placeholder="Check-in"
            className="w-full py-2 border border-gray-300 rounded-lg"
          />
          <input
            type="date"
            placeholder="Check-out"
            className="w-full py-2 border border-gray-300 rounded-lg"
          />
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center bg-primary">
          <Search className="mr-2 h-4 w-4" /> Search Hotels
        </button>
      </div>
      <div className="max-w-screen-xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-1/4 space-y-6">
            <div className="bg-white border-1 border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold mb-4 flex items-center">
                <Filter className="h-4 w-4 mr-2" /> Filters
              </h3>

              {/* Price Range */}
              <div className="mb-6">
                <h4 className="text-sm font-medium mb-2">
                  Price Range (per night)
                </h4>
                <input
                  type="range"
                  min={0}
                  max={1000}
                  defaultValue={100}
                  className="w-full mb-2"
                />
                <div className="flex justify-between text-sm">
                  <span>$0</span>
                  <span>$1000+</span>
                </div>
              </div>

              {/* Star Rating */}
              <div className="mb-6">
                <h4 className="text-sm font-medium mb-2">Star Rating</h4>
                <div className="space-y-2">
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <div key={rating} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`rating-${rating}`}
                        className="mr-2"
                      />
                      <label
                        htmlFor={`rating-${rating}`}
                        className="text-sm flex items-center"
                      >
                        {Array.from({ length: rating }).map((_, i) => (
                          <Star
                            key={i}
                            className="h-3 w-3 fill-yellow-500 text-yellow-500"
                          />
                        ))}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Property Type */}
              <div className="mb-6">
                <h4 className="text-sm font-medium mb-2">Property Type</h4>
                <div className="space-y-2">
                  {["Hotel", "Resort", "Villa", "Apartment", "Guesthouse"].map(
                    (type) => (
                      <div key={type} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`type-${type}`}
                          className="mr-2"
                        />
                        <label htmlFor={`type-${type}`} className="text-sm">
                          {type}
                        </label>
                      </div>
                    )
                  )}
                </div>
              </div>

              {/* Amenities */}
              <div className="mb-6">
                <h4 className="text-sm font-medium mb-2">Amenities</h4>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <input type="checkbox" id="wifi" className="mr-2" />
                    <label htmlFor="wifi" className="text-sm flex items-center">
                      <Wifi className="h-3 w-3 mr-1" /> WiFi
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" id="breakfast" className="mr-2" />
                    <label
                      htmlFor="breakfast"
                      className="text-sm flex items-center"
                    >
                      <Coffee className="h-3 w-3 mr-1" /> Breakfast
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" id="tv" className="mr-2" />
                    <label htmlFor="tv" className="text-sm flex items-center">
                      <Tv className="h-3 w-3 mr-1" /> TV
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" id="restaurant" className="mr-2" />
                    <label
                      htmlFor="restaurant"
                      className="text-sm flex items-center"
                    >
                      <Utensils className="h-3 w-3 mr-1" /> Restaurant
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" id="parking" className="mr-2" />
                    <label
                      htmlFor="parking"
                      className="text-sm flex items-center"
                    >
                      <Parking className="h-3 w-3 mr-1" /> Parking
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" id="pool" className="mr-2" />
                    <label htmlFor="pool" className="text-sm flex items-center">
                      <SwimmingPool className="h-3 w-3 mr-1" /> Swimming Pool
                    </label>
                  </div>
                </div>
              </div>

              <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors bg-primary">
                Apply Filters
              </button>
            </div>
          </div>

          {/* Hotels List */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <p className="text-muted-foreground">120 hotels found</p>
              <div className="flex items-center">
                <span className="text-sm mr-2">Sort by:</span>
                <select className="w-[180px] p-2 border border-gray-300 rounded-lg">
                  <option value="recommended">Recommended</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Rating</option>
                </select>
              </div>
            </div>

            <div className="space-y-6">
              {/* Hotel Card Example */}
              <div className="bg-white flex rounded-lg border-1 border-gray-200 p-2 gap-4 grid-cols-5">
                <img
                  className="w-88 h-50 object-cover rounded-lg col-span-2"
                  src="https://www.leisurekart.com/blog/wp-content/uploads/2024/04/Places-to-visit-in-Mumbai.jpg"
                  alt="Grand Luxury Resort & Spa"
                />
                <div className="mt-4 space-y-2 col-span-3">
                  <h3 className="text-xl font-bold">
                    Grand Luxury Resort & Spa
                  </h3>
                  <p className="text-sm text-gray-600">Bali, Indonesia</p>
                  <div className="flex items-center mt-2">
                    <span className="text-yellow-500 flex">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className="h-4 w-4 fill-yellow-500 text-yellow-500"
                        />
                      ))}
                    </span>
                    <span className="ml-2 text-sm">4.9</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    Tropical paradise with stunning beaches and vibrant culture
                  </p>
                  <div className="flex justify-between items-center mt-4">
                    <span className="text-lg font-bold">$250/night</span>
                    <Link
                      to="/hotels/1"
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors bg-primary"
                    >
                      Book Now
                    </Link>
                  </div>
                </div>
              </div>
              <div className="bg-white flex rounded-lg border-1 border-gray-200 p-2 gap-4 grid-cols-5">
                <img
                  className="w-88 h-50 object-cover rounded-lg col-span-2"
                  src="https://www.leisurekart.com/blog/wp-content/uploads/2024/04/Places-to-visit-in-Mumbai.jpg"
                  alt="Grand Luxury Resort & Spa"
                />
                <div className="mt-4 space-y-2 col-span-3">
                  <h3 className="text-xl font-bold">
                    Grand Luxury Resort & Spa
                  </h3>
                  <p className="text-sm text-gray-600">Bali, Indonesia</p>
                  <div className="flex items-center mt-2">
                    <span className="text-yellow-500 flex">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className="h-4 w-4 fill-yellow-500 text-yellow-500"
                        />
                      ))}
                    </span>
                    <span className="ml-2 text-sm">4.9</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    Tropical paradise with stunning beaches and vibrant culture
                  </p>
                  <div className="flex justify-between items-center mt-4">
                    <span className="text-lg font-bold">$250/night</span>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors bg-primary">
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
              <div className="bg-white flex rounded-lg border-1 border-gray-200 p-2 gap-4 grid-cols-5">
                <img
                  className="w-88 h-50 object-cover rounded-lg col-span-2"
                  src="https://www.leisurekart.com/blog/wp-content/uploads/2024/04/Places-to-visit-in-Mumbai.jpg"
                  alt="Grand Luxury Resort & Spa"
                />
                <div className="mt-4 space-y-2 col-span-3">
                  <h3 className="text-xl font-bold">
                    Grand Luxury Resort & Spa
                  </h3>
                  <p className="text-sm text-gray-600">Bali, Indonesia</p>
                  <div className="flex items-center mt-2">
                    <span className="text-yellow-500 flex">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className="h-4 w-4 fill-yellow-500 text-yellow-500"
                        />
                      ))}
                    </span>
                    <span className="ml-2 text-sm">4.9</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    Tropical paradise with stunning beaches and vibrant culture
                  </p>
                  <div className="flex justify-between items-center mt-4">
                    <span className="text-lg font-bold">$250/night</span>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors bg-primary">
                      Book Now
                    </button>
                  </div>
                </div>
              </div>

              {/* Repeat for other hotels */}
            </div>

            <div className="mt-8 flex justify-center">
              <button className="mx-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 bg-primary text-white">
                Previous
              </button>
              <button className="mx-1 px-4 py-2 border border-gray-300 rounded-lg bg-primary text-white">
                1
              </button>
              <button className="mx-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100">
                2
              </button>
              <button className="mx-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100">
                3
              </button>
              <button className="mx-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 bg-primary text-white">
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
