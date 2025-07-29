import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const FlightPackageForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    airline: '',
    flightNumber: '',
    departure: {
      airport: '',
      city: '',
      terminal: '',
      datetime: new Date(),
    },
    arrival: {
      airport: '',
      city: '',
      terminal: '',
      datetime: new Date(Date.now() + 3600000), // 1 hour later
    },
    duration: 60,
    stops: {
      count: 0,
      details: [],
    },
    image: '',
    class: 'economy',
    fareType: '',
    baseFare: 0,
    taxes: 0,
    fees: 0,
    totalPrice: 0,
    currency: 'USD',
    baggageAllowance: {
      cabin: {
        weight: 7,
        unit: 'kg',
        dimensions: '',
      },
      checked: {
        pieces: 1,
        weightPerPiece: 23,
        unit: 'kg',
      },
    },
    cancellationPolicy: '',
    changePolicy: '',
    status: 'available',
  });

  useEffect(() => {
    if (id) {
      fetchFlight();
    }
  }, [id]);

  useEffect(() => {
    // Calculate duration when departure or arrival datetime changes
    if (formData.departure.datetime && formData.arrival.datetime) {
      const diffMs = new Date(formData.arrival.datetime) - new Date(formData.departure.datetime);
      const minutes = Math.floor(diffMs / (1000 * 60));
      setFormData(prev => ({
        ...prev,
        duration: minutes,
        totalPrice: prev.baseFare + prev.taxes + prev.fees
      }));
    }
  }, [formData.departure.datetime, formData.arrival.datetime]);

  useEffect(() => {
    // Calculate total price when baseFare, taxes, or fees change
    setFormData(prev => ({
      ...prev,
      totalPrice: prev.baseFare + prev.taxes + prev.fees
    }));
  }, [formData.baseFare, formData.taxes, formData.fees]);

  const fetchFlight = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:8000/api/flight-packages/${id}`);
      setFormData({
        ...response.data,
        departure: {
          ...response.data.departure,
          datetime: new Date(response.data.departure.datetime)
        },
        arrival: {
          ...response.data.arrival,
          datetime: new Date(response.data.arrival.datetime)
        }
      });
      setLoading(false);
    } catch (error) {
      toast.error('Failed to fetch flight package');
      navigate('/flight-packages');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child, subChild, subSubChild] = name.split('.');
      setFormData(prev => {
        const newData = { ...prev };
        if (subSubChild) {
          newData[parent][child][subChild][subSubChild] = value;
        } else if (subChild) {
          newData[parent][child][subChild] = value;
        } else {
          newData[parent][child] = value;
        }
        return newData;
      });
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleDateChange = (date, field) => {
    setFormData(prev => ({
      ...prev,
      [field]: date
    }));
  };

  const handleStopChange = (index, field, value) => {
    setFormData(prev => {
      const newStops = { ...prev.stops };
      newStops.details[index][field] = value;
      return {
        ...prev,
        stops: newStops
      };
    });
  };

  const addStop = () => {
    setFormData(prev => ({
      ...prev,
      stops: {
        count: prev.stops.count + 1,
        details: [
          ...prev.stops.details,
          { airport: '', city: '', duration: 60 }
        ]
      }
    }));
  };

  const removeStop = (index) => {
    setFormData(prev => ({
      ...prev,
      stops: {
        count: prev.stops.count - 1,
        details: prev.stops.details.filter((_, i) => i !== index)
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      if (id) {
        await axios.put(`http://localhost:8000/api/flight-packages/${id}`, formData, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        toast.success('Flight package updated successfully');
      } else {
        await axios.post('http://localhost:8000/api/flight-packages', formData, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        toast.success('Flight package created successfully');
      }
      navigate('/flight-packages');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to save flight package');
      setIsSubmitting(false);
    }
  };

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        {id ? 'Edit Flight Package' : 'Create New Flight Package'}
      </h1>
      
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
        <div className="grid grid-cols-1 gap-6">
          {/* Flight Details Section */}
          <div className="col-span-1">
            <h2 className="text-xl font-semibold mb-4 border-b pb-2">Flight Details</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Airline*</label>
              <input
                type="text"
                name="airline"
                value={formData.airline}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Flight Number*</label>
              <input
                type="text"
                name="flightNumber"
                value={formData.flightNumber}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Flight Image URL</label>
            <input
              type="text"
              name="image"
              value={formData.image}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          {/* Departure & Arrival */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border p-4 rounded-md">
              <h3 className="font-medium mb-4">Departure</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Airport*</label>
                  <input
                    type="text"
                    name="departure.airport"
                    value={formData.departure.airport}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City*</label>
                  <input
                    type="text"
                    name="departure.city"
                    value={formData.departure.city}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Terminal</label>
                  <input
                    type="text"
                    name="departure.terminal"
                    value={formData.departure.terminal}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date & Time*</label>
                  <DatePicker
                    selected={formData.departure.datetime}
                    onChange={(date) => handleDateChange(date, 'departure.datetime')}
                    showTimeSelect
                    timeFormat="HH:mm"
                    timeIntervals={15}
                    dateFormat="MMMM d, yyyy h:mm aa"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>
            </div>
            
            <div className="border p-4 rounded-md">
              <h3 className="font-medium mb-4">Arrival</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Airport*</label>
                  <input
                    type="text"
                    name="arrival.airport"
                    value={formData.arrival.airport}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City*</label>
                  <input
                    type="text"
                    name="arrival.city"
                    value={formData.arrival.city}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Terminal</label>
                  <input
                    type="text"
                    name="arrival.terminal"
                    value={formData.arrival.terminal}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date & Time*</label>
                  <DatePicker
                    selected={formData.arrival.datetime}
                    onChange={(date) => handleDateChange(date, 'arrival.datetime')}
                    showTimeSelect
                    timeFormat="HH:mm"
                    timeIntervals={15}
                    dateFormat="MMMM d, yyyy h:mm aa"
                    minDate={formData.departure.datetime}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-md">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">Flight Duration</p>
                <p>{formatDuration(formData.duration)}</p>
              </div>
            </div>
          </div>
          
          {/* Stops */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium">Stops</h3>
              <button
                type="button"
                onClick={addStop}
                className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
              >
                Add Stop
              </button>
            </div>
            
            {formData.stops.details.map((stop, index) => (
              <div key={index} className="border p-4 rounded-md mb-4">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium">Stop {index + 1}</h4>
                  <button
                    type="button"
                    onClick={() => removeStop(index)}
                    className="px-2 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm"
                  >
                    Remove
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Airport</label>
                    <input
                      type="text"
                      value={stop.airport}
                      onChange={(e) => handleStopChange(index, 'airport', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                    <input
                      type="text"
                      value={stop.city}
                      onChange={(e) => handleStopChange(index, 'city', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Layover Duration (minutes)</label>
                    <input
                      type="number"
                      min="0"
                      value={stop.duration}
                      onChange={(e) => handleStopChange(index, 'duration', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Booking Class & Pricing */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Class*</label>
              <select
                name="class"
                value={formData.class}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="economy">Economy</option>
                <option value="premium_economy">Premium Economy</option>
                <option value="business">Business</option>
                <option value="first">First Class</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fare Type</label>
              <input
                type="text"
                name="fareType"
                value={formData.fareType}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Base Fare*</label>
              <input
                type="number"
                min="0"
                step="0.01"
                name="baseFare"
                value={formData.baseFare}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Taxes*</label>
              <input
                type="number"
                min="0"
                step="0.01"
                name="taxes"
                value={formData.taxes}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fees</label>
              <input
                type="number"
                min="0"
                step="0.01"
                name="fees"
                value={formData.fees}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
              <select
                name="currency"
                value={formData.currency}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="JPY">JPY (¥)</option>
              </select>
            </div>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-md border border-blue-200">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-blue-600">Total Price</p>
                <p className="text-xl font-bold text-blue-600">
                  {formData.currency} {formData.totalPrice.toFixed(2)}
                </p>
              </div>
            </div>
          </div>
          
          {/* Baggage Allowance */}
          <div>
            <h3 className="font-medium mb-4">Baggage Allowance</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border p-4 rounded-md">
                <h4 className="font-medium mb-2">Cabin Baggage</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Weight</label>
                    <input
                      type="number"
                      min="0"
                      name="baggageAllowance.cabin.weight"
                      value={formData.baggageAllowance.cabin.weight}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
                    <select
                      name="baggageAllowance.cabin.unit"
                      value={formData.baggageAllowance.cabin.unit}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="kg">kg</option>
                      <option value="lbs">lbs</option>
                    </select>
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Dimensions (L+W+H)</label>
                    <input
                      type="text"
                      name="baggageAllowance.cabin.dimensions"
                      value={formData.baggageAllowance.cabin.dimensions}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
              
              <div className="border p-4 rounded-md">
                <h4 className="font-medium mb-2">Checked Baggage</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Pieces</label>
                    <input
                      type="number"
                      min="0"
                      name="baggageAllowance.checked.pieces"
                      value={formData.baggageAllowance.checked.pieces}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Weight per Piece</label>
                    <input
                      type="number"
                      min="0"
                      name="baggageAllowance.checked.weightPerPiece"
                      value={formData.baggageAllowance.checked.weightPerPiece}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
                    <select
                      name="baggageAllowance.checked.unit"
                      value={formData.baggageAllowance.checked.unit}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="kg">kg</option>
                      <option value="lbs">lbs</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Policies */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cancellation Policy</label>
              <textarea
                name="cancellationPolicy"
                value={formData.cancellationPolicy}
                onChange={handleChange}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Change Policy</label>
              <textarea
                name="changePolicy"
                value={formData.changePolicy}
                onChange={handleChange}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          
          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="available">Available</option>
              <option value="on_hold">On Hold</option>
              <option value="booked">Booked</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
        
        <div className="mt-8 flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => navigate('/admin/flight-packages')}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {isSubmitting ? 'Saving...' : id ? 'Update Flight' : 'Create Flight'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FlightPackageForm;