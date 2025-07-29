import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const FlightPackageList = () => {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: "",
    departureCity: "",
    arrivalCity: "",
    minPrice: "",
    maxPrice: "",
    sort: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchFlights();
    fetchAllFlightPackages();
  }, [filters]);

  const fetchAllFlightPackages = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "http://localhost:8000/api/flight-packages"
      );
      setFlights(response.data);
      setLoading(false);
    } catch (error) {
      toast.error("Failed to fetch flight packages");
      setLoading(false);
    }
  };

  const fetchFlights = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });

      const response = await axios.get(
        `http://localhost:8000/api/flight-packages?${params.toString()}`
      );
      setFlights(response.data);
      setLoading(false);
    } catch (error) {
      toast.error("Failed to fetch flights");
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleDelete = async (id) => {
    if (
      window.confirm("Are you sure you want to delete this flight package?")
    ) {
      try {
        await axios.delete(`/api/flight-packages/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        toast.success("Flight package deleted successfully");
        fetchFlights();
      } catch (error) {
        toast.error("Failed to delete flight package");
      }
    }
  };

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">Loading...</div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Flight Packages</h1>
        <button
          onClick={() => navigate("/admin/flight-packages/create")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
        >
          Create New Flight
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4">Filters</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Status
            </label>
            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              <option value="">All</option>
              <option value="available">Available</option>
              <option value="on_hold">On Hold</option>
              <option value="booked">Booked</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Departure City
            </label>
            <input
              type="text"
              name="departureCity"
              value={filters.departureCity}
              onChange={handleFilterChange}
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
              value={filters.arrivalCity}
              onChange={handleFilterChange}
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
              value={filters.minPrice}
              onChange={handleFilterChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Max Price
            </label>
            <input
              type="number"
              name="maxPrice"
              value={filters.maxPrice}
              onChange={handleFilterChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Sort By
            </label>
            <select
              name="sort"
              value={filters.sort}
              onChange={handleFilterChange}
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

      {/* Flights List */}
      <div className="space-y-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {flights.map((flight) => (
          <div
            key={flight._id}
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            <img
              src={flight.image}
              alt={`${flight.airline} flight`}
              className="w-full h-64 object-cover rounded-md"
            />
            <div className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-bold text-gray-800">
                    {flight.departure.city} ({flight.departure.airport}) →{" "}
                    {flight.arrival.city} ({flight.arrival.airport})
                  </h3>
                  <p className="text-gray-600">
                    {flight.airline} • {flight.flightNumber} •{" "}
                    {flight.class.replace("_", " ")}
                  </p>
                </div>
                <span
                  className={`px-2 py-1 text-xs rounded-full ${
                    flight.status === "available"
                      ? "bg-green-100 text-green-800"
                      : flight.status === "on_hold"
                      ? "bg-yellow-100 text-yellow-800"
                      : flight.status === "booked"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {flight.status.replace("_", " ")}
                </span>
              </div>

              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <p className="font-medium">Departure</p>
                  <p>{new Date(flight.departure.datetime).toLocaleString()}</p>
                  <p>
                    {flight.departure.airport}{" "}
                    {flight.departure.terminal &&
                      `(Terminal ${flight.departure.terminal})`}
                  </p>
                </div>

                <div className="text-center">
                  <p className="font-medium">
                    {formatDuration(flight.duration)}
                  </p>
                  <div className="relative pt-4">
                    <div
                      className="absolute inset-0 flex items-center"
                      aria-hidden="true"
                    >
                      <div className="w-full border-t border-gray-300" />
                    </div>
                    <div className="relative flex justify-center">
                      <span className="px-2 bg-white text-sm text-gray-500">
                        {flight.stops.count > 0
                          ? `${flight.stops.count} stop${
                              flight.stops.count > 1 ? "s" : ""
                            }`
                          : "Non-stop"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="font-medium">Arrival</p>
                  <p>{new Date(flight.arrival.datetime).toLocaleString()}</p>
                  <p>
                    {flight.arrival.airport}{" "}
                    {flight.arrival.terminal &&
                      `(Terminal ${flight.arrival.terminal})`}
                  </p>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="font-medium">Baggage</p>
                  <p>
                    Cabin: {flight.baggageAllowance?.cabin?.weight || "N/A"}{" "}
                    {flight.baggageAllowance?.cabin?.unit}
                  </p>
                  <p>
                    Checked: {flight.baggageAllowance?.checked?.pieces || "N/A"}{" "}
                    ×{" "}
                    {flight.baggageAllowance?.checked?.weightPerPiece || "N/A"}{" "}
                    {flight.baggageAllowance?.checked?.unit}
                  </p>
                </div>

                <div>
                  <p className="font-medium">Fare Type</p>
                  <p>{flight.fareType || "Standard"}</p>
                </div>

                <div className="text-right">
                  <p className="text-sm text-gray-500">Total Price</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {flight.currency} {flight.totalPrice.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 px-4 py-3 flex justify-end space-x-2">
              <button
                onClick={() =>
                  navigate("/flight-packages/details", {
                    state: { flightId: flight._id },
                  })
                }
                className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
              >
                View
              </button>

              <button
                onClick={() =>
                  navigate(`/admin/flight-packages/edit/${flight._id}`)
                }
                className="px-3 py-1 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 text-sm"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(flight._id)}
                className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {flights.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">
            No flights found matching your criteria
          </p>
        </div>
      )}
    </div>
  );
};

export default FlightPackageList;
