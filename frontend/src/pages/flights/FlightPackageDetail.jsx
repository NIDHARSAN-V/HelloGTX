import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const FlightPackageDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const flightId = location.state?.flightId;

  const [flight, setFlight] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!flightId) {
      toast.error("Flight ID not provided");
      navigate("/flight-packages");
      return;
    }

    const fetchFlight = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/flight-packages/${flightId}`
        );
        setFlight(response.data);
        setLoading(false);
      } catch (error) {
        toast.error("Failed to fetch flight details");
        navigate("/flight-packages");
      }
    };

    fetchFlight();
  }, [flightId, navigate]);

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const formatDateTime = (dateString) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleString(undefined, options);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">Loading...</div>
    );
  }

  if (!flight) {
    return <div className="text-center py-12">Flight package not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          {flight.airline} Flight {flight.flightNumber}
        </h1>
        <div className="flex space-x-2">
          <button
            onClick={() => navigate(`/admin/flight-packages/edit/${id}`)}
            className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
          >
            Edit Flight
          </button>
          <button
            onClick={() => navigate("/flight-packages")}
            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
          >
            Back to List
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          {/* Status Badge */}
          <div className="mb-4">
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                flight.status === "available"
                  ? "bg-green-100 text-green-800"
                  : flight.status === "on_hold"
                  ? "bg-yellow-100 text-yellow-800"
                  : flight.status === "booked"
                  ? "bg-blue-100 text-blue-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {flight.status.replace("_", " ").toUpperCase()}
            </span>
          </div>

          {/* Flight Image */}
          {flight.image && (
            <div className="mb-6">
              <img
                src={flight.image}
                alt={`${flight.airline} flight`}
                className="w-full h-64 object-cover rounded-md"
              />
            </div>
          )}

          {/* Route */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Route</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <p className="font-medium">Departure</p>
                <p>{formatDateTime(flight.departure.datetime)}</p>
                <p>
                  {flight.departure.airport}
                  {flight.departure.terminal &&
                    ` (Terminal ${flight.departure.terminal})`}
                </p>
                <p>{flight.departure.city}</p>
              </div>

              <div className="text-center">
                <p className="font-medium">{formatDuration(flight.duration)}</p>
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
                <p>{formatDateTime(flight.arrival.datetime)}</p>
                <p>
                  {flight.arrival.airport}
                  {flight.arrival.terminal &&
                    ` (Terminal ${flight.arrival.terminal})`}
                </p>
                <p>{flight.arrival.city}</p>
              </div>
            </div>
          </div>

          {/* Stops */}
          {flight.stops.count > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Stop Details</h2>
              <div className="space-y-4">
                {flight.stops.details.map((stop, index) => (
                  <div key={index} className="border p-4 rounded-md">
                    <h3 className="font-medium mb-2">Stop {index + 1}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Airport</p>
                        <p>{stop.airport || "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">City</p>
                        <p>{stop.city || "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">
                          Layover Duration
                        </p>
                        <p>{formatDuration(stop.duration)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Flight Details */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Flight Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-sm text-gray-500">Airline</p>
                <p className="font-medium">{flight.airline}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Flight Number</p>
                <p className="font-medium">{flight.flightNumber}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Class</p>
                <p className="font-medium">{flight.class.replace("_", " ")}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Fare Type</p>
                <p className="font-medium">{flight.fareType || "Standard"}</p>
              </div>
            </div>
          </div>

          {/* Baggage */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Baggage Allowance</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border p-4 rounded-md">
                <h3 className="font-medium mb-2">Cabin Baggage</h3>
                {flight.baggageAllowance?.cabin ? (
                  <div className="space-y-2">
                    <p>
                      Weight: {flight.baggageAllowance.cabin.weight}{" "}
                      {flight.baggageAllowance.cabin.unit}
                    </p>
                    {flight.baggageAllowance.cabin.dimensions && (
                      <p>
                        Dimensions: {flight.baggageAllowance.cabin.dimensions}
                      </p>
                    )}
                  </div>
                ) : (
                  <p>Not specified</p>
                )}
              </div>
              <div className="border p-4 rounded-md">
                <h3 className="font-medium mb-2">Checked Baggage</h3>
                {flight.baggageAllowance?.checked ? (
                  <div className="space-y-2">
                    <p>Pieces: {flight.baggageAllowance.checked.pieces}</p>
                    <p>
                      Weight per piece:{" "}
                      {flight.baggageAllowance.checked.weightPerPiece}{" "}
                      {flight.baggageAllowance.checked.unit}
                    </p>
                  </div>
                ) : (
                  <p>Not specified</p>
                )}
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Pricing</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="text-sm text-gray-500">Base Fare</p>
                <p className="text-lg font-medium">
                  {flight.currency} {flight.baseFare.toFixed(2)}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="text-sm text-gray-500">Taxes</p>
                <p className="text-lg font-medium">
                  {flight.currency} {flight.taxes.toFixed(2)}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-md">
                <div className="bg-gray-50 p-4 rounded-md">
                  <p className="text-sm text-gray-500">Fees</p>
                  <p className="text-lg font-medium">
                    {flight.currency} {flight.fees.toFixed(2)}
                  </p>
                </div>
                <div className="bg-blue-50 p-4 rounded-md border border-blue-100">
                  <p className="text-sm text-gray-500">Total Price</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {flight.currency} {flight.totalPrice.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>

            {/* Policies */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Policies</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border p-4 rounded-md">
                  <h3 className="font-medium mb-2">Cancellation Policy</h3>
                  <p className="text-gray-700">
                    {flight.cancellationPolicy ||
                      "No cancellation policy specified"}
                  </p>
                </div>
                <div className="border p-4 rounded-md">
                  <h3 className="font-medium mb-2">Change Policy</h3>
                  <p className="text-gray-700">
                    {flight.changePolicy || "No change policy specified"}
                  </p>
                </div>
              </div>
            </div>

            {/* Timestamps */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Timestamps</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Created At</p>
                  <p>{new Date(flight.createdAt).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Updated At</p>
                  <p>
                    {flight.updatedAt
                      ? new Date(flight.updatedAt).toLocaleString()
                      : "Never updated"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlightPackageDetail;
