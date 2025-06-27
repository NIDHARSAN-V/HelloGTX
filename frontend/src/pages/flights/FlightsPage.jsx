import React, { useState } from "react";
import { Plane, Calendar, Users } from "lucide-react";

export default function FlightsPage() {
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="container py-8 ">
      <div className="max-w-screen-2xl mx-auto">
        <h1 className="text-4xl font-bold mb-2">Find Flights</h1>
        <p className="text-muted-foreground mb-8">
          Search for the best flight deals to your dream destination
        </p>
      </div>

      {/* Flight Search Form */}
      <div className="bg-white rounded-lg border p-6 mb-8 max-w-screen-2xl mx-auto">
        <div className="flex gap-4 mb-6">
          <button className="flex-1 py-2 px-4 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200">
            Round Trip
          </button>
          <button className="flex-1 py-2 px-4 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200">
            One Way
          </button>
          <button className="flex-1 py-2 px-4 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200">
            Multi-City
          </button>
        </div>

        {/* Round Trip Form */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="text-sm font-medium mb-2 block">From</label>
            <div className="relative">
              <Plane className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                placeholder="City or airport"
                className="w-full pl-10 py-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">To</label>
            <div className="relative">
              <Plane className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground rotate-90" />
              <input
                placeholder="City or airport"
                className="w-full pl-10 py-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Departure</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="date"
                className="w-full pl-10 py-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Return</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="date"
                className="w-full pl-10 py-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Passengers</label>
            <div className="relative">
              <Users className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <select className="w-full pl-10 py-2 border border-gray-300 rounded-lg">
                <option>1 Adult</option>
                <option>2 Adults</option>
                <option>3 Adults</option>
                <option>4 Adults</option>
                <option>2 Adults, 2 Children</option>
              </select>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Class</label>
            <select className="w-full py-2 border border-gray-300 rounded-lg">
              <option>Economy</option>
              <option>Premium Economy</option>
              <option>Business</option>
              <option>First Class</option>
            </select>
          </div>
          <div className="flex items-end">
            <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 bg-primary">
              Search Flights
            </button>
          </div>
        </div>
      </div>

      {/* Flight Results */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 max-w-screen-2xl mx-auto">
        {/* Filters Sidebar */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg border p-4">
            <h3 className="font-medium mb-4">Price Range</h3>
            <input
              type="range"
              min={0}
              max={2000}
              defaultValue={200}
              step={50}
              className="w-full mb-6"
            />
            <div className="flex items-center justify-between">
              <div className="border rounded-md px-3 py-1">
                <span className="text-sm">$200</span>
              </div>
              <div className="border rounded-md px-3 py-1">
                <span className="text-sm">$800</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border p-4">
            <h3 className="font-medium mb-4">Airlines</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="airline-1"
                  className="w-4 h-4 border border-gray-300 rounded"
                />
                <label htmlFor="airline-1" className="text-sm">
                  Emirates
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="airline-2"
                  className="w-4 h-4 border border-gray-300 rounded"
                />
                <label htmlFor="airline-2" className="text-sm">
                  Singapore Airlines
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="airline-3"
                  className="w-4 h-4 border border-gray-300 rounded"
                />
                <label htmlFor="airline-3" className="text-sm">
                  Qatar Airways
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="airline-4"
                  className="w-4 h-4 border border-gray-300 rounded"
                />
                <label htmlFor="airline-4" className="text-sm">
                  Lufthansa
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="airline-5"
                  className="w-4 h-4 border border-gray-300 rounded"
                />
                <label htmlFor="airline-5" className="text-sm">
                  British Airways
                </label>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border p-4">
            <h3 className="font-medium mb-4">Stops</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="nonstop"
                  className="w-4 h-4 border border-gray-300 rounded"
                />
                <label htmlFor="nonstop" className="text-sm">
                  Nonstop
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="1-stop"
                  className="w-4 h-4 border border-gray-300 rounded"
                />
                <label htmlFor="1-stop" className="text-sm">
                  1 Stop
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="2-stops"
                  className="w-4 h-4 border border-gray-300 rounded"
                />
                <label htmlFor="2-stops" className="text-sm">
                  2+ Stops
                </label>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border p-4">
            <h3 className="font-medium mb-4">Departure Time</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="early-morning"
                  className="w-4 h-4 border border-gray-300 rounded"
                />
                <label htmlFor="early-morning" className="text-sm">
                  Early Morning (12am - 6am)
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="morning"
                  className="w-4 h-4 border border-gray-300 rounded"
                />
                <label htmlFor="morning" className="text-sm">
                  Morning (6am - 12pm)
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="afternoon"
                  className="w-4 h-4 border border-gray-300 rounded"
                />
                <label htmlFor="afternoon" className="text-sm">
                  Afternoon (12pm - 6pm)
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="evening"
                  className="w-4 h-4 border border-gray-300 rounded"
                />
                <label htmlFor="evening" className="text-sm">
                  Evening (6pm - 12am)
                </label>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border p-4">
            <h3 className="font-medium mb-4">Flight Duration</h3>
            <input
              type="range"
              min={0}
              max={30}
              defaultValue={0}
              step={1}
              className="w-full mb-6"
            />
            <div className="flex items-center justify-between">
              <div className="border rounded-md px-3 py-1">
                <span className="text-sm">0h</span>
              </div>
              <div className="border rounded-md px-3 py-1">
                <span className="text-sm">20h</span>
              </div>
            </div>
          </div>
        </div>

        {/* Flight Listings */}
        <div className="lg:col-span-3">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
            <p className="text-muted-foreground mb-4 sm:mb-0">
              Showing 15 flights from New York to London
            </p>
            <select className="w-[180px] py-2 border border-gray-300 rounded-lg">
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="duration">Duration</option>
              <option value="departure">Departure Time</option>
              <option value="arrival">Arrival Time</option>
            </select>
          </div>

          <div className="space-y-6">
            {/* Flight Card Example */}
            <div className="bg-white rounded-lg border-1 border-gray-200 p-2 grid grid-cols-5 gap-4">
              <div className="col-span-2">
                <div className="flex  justify-between flex-col mb-4 gap-2">
                  <div className="flex items-center">
                    <img
                      src="https://media.istockphoto.com/id/155380716/photo/commercial-jet-flying-over-clouds.jpg?s=612x612&w=0&k=20&c=idhnJ7ZdrLA1Dv5GO2R28A8WCx1SXCFVLu5_2cfdvXw="
                      alt="Emirates"
                      className="w-full h-50 object-cover rounded-lg"
                    />
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <h3 className="font-bold">Emirates</h3>
                      <p className="text-sm text-muted-foreground">
                        Flight EK201
                      </p>
                    </div>
                    <span className="text-lg font-bold">$649</span>
                  </div>
                </div>
              </div>
              <div className="col-span-3 flex flex-col p-4">
                <div className="flex justify-between gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Departure</p>
                    <p className="font-medium">08:30</p>
                    <p className="text-sm text-muted-foreground">
                      JFK, New York
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Arrival</p>
                    <p className="font-medium">20:45</p>
                    <p className="text-sm text-muted-foreground">LHR, London</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Duration</p>
                    <p className="font-medium">7h 15m</p>
                    <p className="text-sm text-muted-foreground">Nonstop</p>
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-sm text-muted-foreground">
                    Amenities: In-flight Meals, Wi-Fi, Entertainment, Power
                    Outlets
                  </p>
                </div>
                <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 mt-4 bg-primary">
                  Book Now
                </button>
              </div>
            </div>

            {/* Repeat for other flights */}
          </div>

          <div className="flex justify-center mt-8">
            <button className="mx-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100">
              1
            </button>
            <button className="mx-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100">
              2
            </button>
            <button className="mx-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100">
              3
            </button>
            <button className="mx-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
