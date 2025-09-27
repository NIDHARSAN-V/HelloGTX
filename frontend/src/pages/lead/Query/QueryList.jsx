import axios from "axios";
import React, { useEffect, useState } from "react";

function QueryList({ leadId, customer, user }) {
  const [queries, setQueries] = useState([]);
  const [selectedQuery, setSelectedQuery] = useState(null);

  useEffect(() => {
    if (!leadId) return;

    const fetchData = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:8000/api/employee/get-queries/${leadId}`
        );
        setQueries(data.queries);
      } catch (error) {
        console.error("Error fetching queries:", error);
      }
    };

    fetchData();
  }, [leadId]);

  // Format date function
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center md:text-left">
        Queries for {customer?.firstName} {customer?.lastName || ""}
      </h1>

      <div className="space-y-6">
        {queries.length === 0 && (
          <p className="text-gray-500 text-center">No queries found for this lead.</p>
        )}

        {queries.map((q) => (
          <div
            key={q._id}
            className="w-full border rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition"
          >
            {/* ---------- Query Header ---------- */}
            <button
              onClick={() =>
                setSelectedQuery(selectedQuery?._id === q._id ? null : q)
              }
              className="w-full flex justify-between items-center p-4 bg-gradient-to-r from-teal-100 to-white hover:from-teal-200 transition"
            >
              <div>
                <p className="text-lg font-semibold text-gray-800">{q.name}</p>
                <p className="text-sm text-gray-600 mt-1">
                  Status: <span className="font-medium text-teal-700">{q.onStatus}</span> | 
                  Off Status: <span className="font-medium text-blue-700">{q.offStatus}</span>
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Total Price: <span className="font-semibold">{q.pricing?.totalPrice} {q.pricing?.currency}</span> | 
                  Slug: <span className="font-mono">{q.slug}</span>
                </p>
              </div>
              <div className="text-gray-400 text-xl">
                {selectedQuery?._id === q._id ? "▲" : "▼"}
              </div>
            </button>

            {/* ---------- Sliding Query Details ---------- */}
            <div
              className={`transition-all duration-500 ease-in-out overflow-hidden ${
                selectedQuery?._id === q._id ? "max-h-[80vh]" : "max-h-0"
              }`}
            >
              <div className="p-6 bg-gray-50 border-t overflow-y-auto max-h-[80vh]">
                <div className="space-y-6">

                  {/* ---------- Main Image ---------- */}
                  {q.images?.mainImage && (
                    <section className="bg-white rounded-lg shadow p-4">
                      <h4 className="text-lg font-semibold text-gray-800 mb-3">Main Image</h4>
                      <img 
                        src={q.images.mainImage} 
                        alt="Package main image" 
                        className="max-w-full h-auto rounded-lg max-h-64 object-cover"
                      />
                      {q.images.gallery && q.images.gallery.length > 0 && (
                        <div className="mt-4">
                          <h5 className="font-semibold text-gray-700 mb-2">Gallery Images</h5>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                            {q.images.gallery.map((img, index) => (
                              <img 
                                key={index} 
                                src={img} 
                                alt={`Gallery ${index + 1}`} 
                                className="w-full h-24 object-cover rounded"
                              />
                            ))}
                          </div>
                        </div>
                      )}
                    </section>
                  )}

                  {/* ---------- Basic Info ---------- */}
                  <section className="bg-white rounded-lg shadow p-4">
                    <h4 className="text-lg font-semibold text-gray-800 mb-3">Basic Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700 text-sm">
                      <p><strong>Query ID:</strong> {q._id}</p>
                      <p><strong>Name:</strong> {q.name}</p>
                      <p><strong>Slug:</strong> {q.slug}</p>
                      <p><strong>On Status:</strong> <span className="capitalize">{q.onStatus}</span></p>
                      <p><strong>Off Status:</strong> <span className="capitalize">{q.offStatus}</span></p>
                      <p><strong>Tags:</strong> {q.tags?.join(", ") || "No tags"}</p>
                    </div>
                  </section>

                  {/* ---------- Description ---------- */}
                  <section className="bg-white rounded-lg shadow p-4">
                    <h4 className="text-lg font-semibold text-gray-800 mb-2">Description</h4>
                    <p className="text-gray-700 whitespace-pre-wrap">{q.description}</p>
                  </section>

                  {/* ---------- Lead Info ---------- */}
                  <section className="bg-white rounded-lg shadow p-4">
                    <h4 className="text-lg font-semibold text-gray-800 mb-3">Lead Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700 text-sm">
                      <p><strong>Lead ID:</strong> {q.leadId?._id}</p>
                      <p><strong>Name:</strong> {q.leadId?.firstName} {q.leadId?.lastName}</p>
                      <p><strong>Email:</strong> {q.leadId?.email}</p>
                      <p><strong>Phone:</strong> {q.leadId?.phone}</p>
                      <p><strong>Source:</strong> <span className="capitalize">{q.leadId?.source?.replace('_', ' ')}</span></p>
                      <p><strong>Trip Type:</strong> <span className="capitalize">{q.leadId?.tripType?.replace('_', ' ')}</span></p>
                      <p><strong>Status:</strong> <span className="capitalize">{q.leadId?.status?.replace('_', ' ')}</span></p>
                      <p><strong>Priority:</strong> <span className="capitalize">{q.leadId?.priority}</span></p>
                      <p><strong>Lead Score:</strong> {q.leadId?.leadScore}</p>
                      <p><strong>Created:</strong> {formatDate(q.leadId?.createdAt)}</p>
                      <p><strong>Last Updated:</strong> {formatDate(q.leadId?.updatedAt)}</p>
                    </div>

                    {/* Travelers Details */}
                    <div className="mt-4">
                      <h5 className="font-semibold text-gray-700 mb-2">Travelers</h5>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                        <p><strong>Adults:</strong> {q.leadId?.travelers?.adults || 0}</p>
                        <p><strong>Children:</strong> {q.leadId?.travelers?.children || 0}</p>
                        <p><strong>Infants:</strong> {q.leadId?.travelers?.infants || 0}</p>
                      </div>
                      {q.leadId?.travelers?.details?.length > 0 && (
                        <div className="mt-2">
                          <h6 className="font-medium text-gray-600">Traveler Details:</h6>
                          <ul className="list-disc ml-5">
                            {q.leadId.travelers.details.map((detail, index) => (
                              <li key={index}>{detail}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    {/* Travel Dates */}
                    <div className="mt-4">
                      <h5 className="font-semibold text-gray-700 mb-2">Travel Dates</h5>
                      <p><strong>Flexible:</strong> {q.leadId?.travelDates?.flexible ? "Yes" : "No"}</p>
                      {q.leadId?.travelDates?.preferredMonths?.length > 0 && (
                        <p><strong>Preferred Months:</strong> {q.leadId.travelDates.preferredMonths.join(", ")}</p>
                      )}
                    </div>

                    {/* Status History */}
                    {q.leadId?.statusHistory?.length > 0 && (
                      <div className="mt-4">
                        <h5 className="font-semibold text-gray-700 mb-2">Status History</h5>
                        <div className="space-y-2">
                          {q.leadId.statusHistory.map((history, index) => (
                            <div key={index} className="border-l-2 border-teal-500 pl-3">
                              <p><strong>Status:</strong> <span className="capitalize">{history.status?.replace('_', ' ')}</span></p>
                              <p><strong>Changed By:</strong> {history.changedBy}</p>
                              <p><strong>Date:</strong> {formatDate(history.timestamp)}</p>
                              <p><strong>Notes:</strong> {history.notes}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </section>

                  {/* ---------- Includes ---------- */}
                  {q.includes && (
                    <section className="bg-white rounded-lg shadow p-4">
                      <h4 className="text-lg font-semibold text-gray-800 mb-3">What's Included</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700 text-sm">
                        {/* Meals */}
                        <div>
                          <h5 className="font-semibold text-gray-700 mb-2">Meals</h5>
                          <div className="space-y-1">
                            {q.includes.meals.breakfast && <p>✅ Breakfast included</p>}
                            {q.includes.meals.lunch && <p>✅ Lunch included</p>}
                            {q.includes.meals.dinner && <p>✅ Dinner included</p>}
                            {!q.includes.meals.breakfast && !q.includes.meals.lunch && !q.includes.meals.dinner && (
                              <p>❌ No meals included</p>
                            )}
                          </div>
                        </div>

                        {/* Other Inclusions */}
                        <div className="space-y-2">
                          {q.includes.flights && <p>✅ Flights included</p>}
                          {q.includes.hotels && <p>✅ Hotels included</p>}
                          {q.includes.visas && <p>✅ Visas included</p>}
                          {q.includes.transfers && <p>✅ Transfers included</p>}
                          {q.includes.activities && <p>✅ Activities included</p>}
                          {q.includes.insurance && <p>✅ Insurance included</p>}
                        </div>
                      </div>
                    </section>
                  )}

                  {/* ---------- Pricing Details ---------- */}
                  {q.pricing && (
                    <section className="bg-white rounded-lg shadow p-4">
                      <h4 className="text-lg font-semibold text-gray-800 mb-3">Pricing Details</h4>
                      
                      {/* Summary */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 p-3 bg-teal-50 rounded-lg">
                        <p><strong>Base Price:</strong> {q.pricing.basePrice} {q.pricing.currency}</p>
                        <p><strong>Total Price:</strong> {q.pricing.totalPrice} {q.pricing.currency}</p>
                        <p><strong>Currency:</strong> {q.pricing.currency}</p>
                      </div>

                      {/* Price Components */}
                      <div className="mb-4">
                        <h5 className="font-semibold text-gray-700 mb-2">Price Components</h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                          <p>Flights: {q.pricing.components.flights} {q.pricing.currency}</p>
                          <p>Accommodation: {q.pricing.components.accommodation} {q.pricing.currency}</p>
                          <p>Visas: {q.pricing.components.visas} {q.pricing.currency}</p>
                          <p>Taxes: {q.pricing.components.taxes} {q.pricing.currency}</p>
                          <p>Fees: {q.pricing.components.fees} {q.pricing.currency}</p>
                        </div>
                      </div>

                      {/* Payment Plan */}
                      <div className="mb-4">
                        <h5 className="font-semibold text-gray-700 mb-2">Payment Plan</h5>
                        <p><strong>Deposit Required:</strong> {q.pricing.paymentPlan.depositRequired ? "✅ Yes" : "❌ No"}</p>
                        {q.pricing.paymentPlan.depositRequired && (
                          <p><strong>Deposit Amount:</strong> {q.pricing.paymentPlan.depositAmount} {q.pricing.currency}</p>
                        )}
                        
                        {q.pricing.paymentPlan.installmentOptions?.length > 0 && (
                          <div className="mt-2">
                            <h6 className="font-medium text-gray-600">Installment Options:</h6>
                            {q.pricing.paymentPlan.installmentOptions.map((installment, index) => (
                              <div key={index} className="ml-4 text-sm">
                                <p>{installment.percentage}% due on {formatDate(installment.dueDate)}</p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Discounts */}
                      {q.pricing.discounts && (
                        <div>
                          <h5 className="font-semibold text-gray-700 mb-2">Discounts</h5>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                            <p>Early Bird: {q.pricing.discounts.earlyBird || 0} {q.pricing.currency}</p>
                            <p>Group Discount: {q.pricing.discounts.group || 0} {q.pricing.currency}</p>
                            {q.pricing.discounts.promoCode && (
                              <p>Promo Code: {q.pricing.discounts.promoCode}</p>
                            )}
                          </div>
                        </div>
                      )}
                    </section>
                  )}

                  {/* ---------- Hotels ---------- */}
                  {q.hotels?.length > 0 && (
                    <section className="bg-white rounded-lg shadow p-4">
                      <h4 className="text-lg font-semibold text-gray-800 mb-3">Hotels</h4>
                      <div className="space-y-4">
                        {q.hotels.map((hotel, index) => (
                          <div key={hotel._id || index} className="border rounded-lg p-4 bg-gray-50 shadow-sm">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <p className="font-semibold text-lg text-gray-800">{hotel.name} ({hotel.starRating}★)</p>
                                <p className="text-sm text-gray-600">Room Type: {hotel.roomType}</p>
                                <p className="text-sm text-gray-600">Day: {hotel.day}</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-600">
                                  <strong>Location:</strong> {hotel.location.city}, {hotel.location.address}
                                </p>
                                <p className="text-sm text-gray-600">
                                  <strong>Check-in:</strong> {formatDate(hotel.checkIn)}
                                </p>
                                <p className="text-sm text-gray-600">
                                  <strong>Check-out:</strong> {formatDate(hotel.checkOut)}
                                </p>
                              </div>
                            </div>
                            
                            {hotel.amenities?.length > 0 && (
                              <div className="mt-2">
                                <p className="text-sm font-medium text-gray-700">Amenities:</p>
                                <p className="text-sm text-gray-600">{hotel.amenities.join(", ")}</p>
                              </div>
                            )}
                            
                            {hotel.cancellationPolicy?.length > 0 && (
                              <div className="mt-2">
                                <p className="text-sm font-medium text-gray-700">Cancellation Policy:</p>
                                <p className="text-sm text-gray-600">{hotel.cancellationPolicy.join(", ")}</p>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </section>
                  )}

                  {/* ---------- Flights ---------- */}
                  {q.flights?.length > 0 && (
                    <section className="bg-white rounded-lg shadow p-4">
                      <h4 className="text-lg font-semibold text-gray-800 mb-3">Flights</h4>
                      <div className="space-y-3">
                        {q.flights.map((flight, index) => (
                          <div key={flight._id || index} className="border rounded-lg p-3 bg-gray-50">
                            <p><strong>Flight Details:</strong> {flight.airline} - {flight.flightNumber}</p>
                            <p><strong>From:</strong> {flight.departure?.airport} to <strong>To:</strong> {flight.arrival?.airport}</p>
                            <p><strong>Departure:</strong> {formatDate(flight.departure?.dateTime)}</p>
                            <p><strong>Arrival:</strong> {formatDate(flight.arrival?.dateTime)}</p>
                          </div>
                        ))}
                      </div>
                    </section>
                  )}

                  {/* ---------- Visas ---------- */}
                  {q.visas?.length > 0 && (
                    <section className="bg-white rounded-lg shadow p-4">
                      <h4 className="text-lg font-semibold text-gray-800 mb-3">Visas</h4>
                      <div className="space-y-3">
                        {q.visas.map((visa, index) => (
                          <div key={visa._id || index} className="border rounded-lg p-3 bg-gray-50">
                            <p><strong>Type:</strong> {visa.type}</p>
                            <p><strong>Country:</strong> {visa.country}</p>
                            <p><strong>Processing Time:</strong> {visa.processingTime}</p>
                            <p><strong>Validity:</strong> {visa.validity}</p>
                          </div>
                        ))}
                      </div>
                    </section>
                  )}

                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default QueryList;