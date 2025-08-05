import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const HotelPackageDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const packageId = location.state?.packageId;
  const [packages, setPackage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!packageId) {
      toast.error("Package ID not provided");
      navigate("/hotel-packages");
      return;
    }

    const fetchPackage = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/hotel-packages/${packageId}`
        );
        setPackage(response.data);
        setLoading(false);
      } catch (error) {
        toast.error("Failed to fetch package details");
        navigate("/hotel-packages");
      }
    };

    fetchPackage();
  }, [packageId, navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">Loading...</div>
    );
  }

  if (!packages) {
    return <div className="text-center py-12">Package not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">{packages.name}</h1>
        <div className="flex space-x-2">
          <button
            onClick={() => navigate(`/admin/hotel-packages/edit/${id}`)}
            className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
          >
            Edit Package
          </button>
          <button
            onClick={() => navigate("/hotel-packages")}
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
                packages.status === "available"
                  ? "bg-green-100 text-green-800"
                  : packages.status === "on_hold"
                  ? "bg-yellow-100 text-yellow-800"
                  : packages.status === "booked"
                  ? "bg-blue-100 text-blue-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {packages.status.replace("_", " ").toUpperCase()}
            </span>
          </div>

          {/* Package Details */}
          <div className="mb-6 ">
            <h2 className="text-2xl font-semibold mb-2">Package Details</h2>
            <div className="flex flex-col md:flex-row gap-4">
              {packages.images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Hotel Image ${index + 1}`}
                  className="w-100 h-48 object-cover mb-4 rounded-lg"
                />
              ))}
            </div>
          </div>

          {/* Hotel Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <h2 className="text-xl font-semibold mb-4">Hotel Information</h2>
              <div className="space-y-2">
                <p>
                  <span className="font-medium">Chain:</span>{" "}
                  {packages.chain || "N/A"}
                </p>
                <p>
                  <span className="font-medium">Rating:</span>{" "}
                  {packages.starRating} stars
                </p>
                <p>
                  <span className="font-medium">Location:</span>{" "}
                  {packages.location.address
                    ? `${packages.location.address}, `
                    : ""}
                  {packages.location.city}, {packages.location.country}
                </p>
                {packages.location.landmark && (
                  <p>
                    <span className="font-medium">Landmark:</span>{" "}
                    {packages.location.landmark}
                  </p>
                )}
                {packages.location.coordinates.lat &&
                  packages.location.coordinates.lng && (
                    <p>
                      <span className="font-medium">Coordinates:</span>{" "}
                      {packages.location.coordinates.lat},{" "}
                      {packages.location.coordinates.lng}
                    </p>
                  )}
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4">Stay Details</h2>
              <div className="space-y-2">
                <p>
                  <span className="font-medium">Check In:</span>{" "}
                  {new Date(packages.checkIn).toLocaleDateString()}
                </p>
                <p>
                  <span className="font-medium">Check Out:</span>{" "}
                  {new Date(packages.checkOut).toLocaleDateString()}
                </p>
                <p>
                  <span className="font-medium">Nights:</span> {packages.nights}
                </p>
                <p>
                  <span className="font-medium">Meal Plan:</span>{" "}
                  {packages.mealPlan
                    ? packages.mealPlan.replace(/_/g, " ").toUpperCase()
                    : "N/A"}
                </p>
              </div>
            </div>
          </div>

          {/* Room Info */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Room Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p>
                  <span className="font-medium">Room Type:</span>{" "}
                  {packages.roomType}
                </p>
                <p>
                  <span className="font-medium">Bed Type:</span>{" "}
                  {packages.bedType}
                </p>
              </div>
              <div>
                <p>
                  <span className="font-medium">Max Occupancy:</span>{" "}
                  {packages.maxOccupancy}
                </p>
                <p>
                  <span className="font-medium">Room View:</span>{" "}
                  {packages.roomView || "N/A"}
                </p>
              </div>
              <div>
                <p className="font-medium">Room Amenities:</p>
                {packages.roomAmenities.length > 0 ? (
                  <ul className="list-disc list-inside">
                    {packages.roomAmenities.map((amenity) => (
                      <li key={amenity}>{amenity}</li>
                    ))}
                  </ul>
                ) : (
                  <p>N/A</p>
                )}
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Pricing</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="text-sm text-gray-500">Base Rate (per night)</p>
                <p className="text-lg font-medium">
                  {packages.currency} {packages.baseRate.toFixed(2)}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="text-sm text-gray-500">Taxes (per night)</p>
                <p className="text-lg font-medium">
                  {packages.currency} {packages.taxes.toFixed(2)}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="text-sm text-gray-500">Fees (per night)</p>
                <p className="text-lg font-medium">
                  {packages.currency} {packages.fees.toFixed(2)}
                </p>
              </div>
              <div className="bg-blue-50 p-4 rounded-md border border-blue-200">
                <p className="text-sm text-blue-600">
                  Total Price ({packages.nights} nights)
                </p>
                <p className="text-xl font-bold text-blue-600">
                  {packages.currency} {packages.totalPrice.toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          {/* Amenities */}
          {packages.amenities.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Hotel Amenities</h2>
              <div className="flex flex-wrap gap-2">
                {packages.amenities.map((amenity) => (
                  <span
                    key={amenity}
                    className="px-3 py-1 bg-gray-100 rounded-full text-sm"
                  >
                    {amenity}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Policies */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {packages.cancellationPolicy && (
              <div>
                <h3 className="font-medium mb-2">Cancellation Policy</h3>
                <p className="text-gray-600 whitespace-pre-line">
                  {packages.cancellationPolicy}
                </p>
              </div>
            )}
            {packages.paymentPolicy && (
              <div>
                <h3 className="font-medium mb-2">Payment Policy</h3>
                <p className="text-gray-600 whitespace-pre-line">
                  {packages.paymentPolicy}
                </p>
              </div>
            )}
            {packages.childPolicy && (
              <div>
                <h3 className="font-medium mb-2">Child Policy</h3>
                <p className="text-gray-600 whitespace-pre-line">
                  {packages.childPolicy}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-gray-50 px-6 py-4 flex justify-between items-center">
          <p className="text-sm text-gray-500">
            Created: {new Date(packages.createdAt).toLocaleString()}
            {packages.updatedAt &&
              ` | Last Updated: ${new Date(
                packages.updatedAt
              ).toLocaleString()}`}
          </p>
          <button
            onClick={() => navigate(`/admin/hotel-packages/edit/${id}`)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Edit Package
          </button>
        </div>
      </div>
    </div>
  );
};

export default HotelPackageDetail;
