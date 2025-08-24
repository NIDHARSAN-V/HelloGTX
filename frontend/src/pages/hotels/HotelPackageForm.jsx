import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const HotelPackageForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    chain: '',
    location: {
      address: '',
      city: '',
      country: '',
      coordinates: {
        lat: '',
        lng: ''
      },
      landmark: ''
    },
    starRating: 3,
    amenities: [],
    roomType: '',
    bedType: 'double',
    maxOccupancy: 2,
    roomView: '',
    roomAmenities: [],
    nights: 1,
    baseRate: 0,
    taxes: 0,
    fees: 0,
    totalPrice: 0,
    currency: 'USD',
    mealPlan: 'room_only',
    cancellationPolicy: '',
    paymentPolicy: '',
    childPolicy: '',
    status: 'available'
  });

  const [amenitiesList, setAmenitiesList] = useState([
    'WiFi', 'Pool', 'Gym', 'Spa', 'Restaurant', 
    'Bar', 'Parking', 'Air Conditioning', 'Room Service'
  ]);
  const [roomAmenitiesList, setRoomAmenitiesList] = useState([
    'TV', 'Mini Bar', 'Safe', 'Coffee Maker', 
    'Hair Dryer', 'Iron', 'Desk', 'Balcony'
  ]);
  const [newAmenity, setNewAmenity] = useState('');
  const [newRoomAmenity, setNewRoomAmenity] = useState('');

  useEffect(() => {
    if (id) {
      fetchPackage();
    }
  }, [id]);

  useEffect(() => {
    // Calculate total price when baseRate, taxes, fees, or nights change
    setFormData(prev => ({
      ...prev,
      totalPrice: (prev.baseRate + prev.taxes + prev.fees) * prev.nights
    }));
  }, [formData.baseRate, formData.taxes, formData.fees, formData.nights]);

  const fetchPackage = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:8000/api/hotel-packages/${id}`);
      setFormData(response.data);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to fetch package');
      navigate('/hotel-packages');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child, subChild] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: subChild ? {
            ...prev[parent][child],
            [subChild]: value
          } : value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleCheckboxChange = (e, listName) => {
    const { value, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [listName]: checked
        ? [...prev[listName], value]
        : prev[listName].filter(item => item !== value)
    }));
  };

  const addNewAmenity = () => {
    if (newAmenity && !amenitiesList.includes(newAmenity)) {
      setAmenitiesList([...amenitiesList, newAmenity]);
      setFormData(prev => ({
        ...prev,
        amenities: [...prev.amenities, newAmenity]
      }));
      setNewAmenity('');
    }
  };

  const addNewRoomAmenity = () => {
    if (newRoomAmenity && !roomAmenitiesList.includes(newRoomAmenity)) {
      setRoomAmenitiesList([...roomAmenitiesList, newRoomAmenity]);
      setFormData(prev => ({
        ...prev,
        roomAmenities: [...prev.roomAmenities, newRoomAmenity]
      }));
      setNewRoomAmenity('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      if (id) {
        await axios.put(`http://localhost:8000/api/hotel-packages/${id}`, formData, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        toast.success('Package updated successfully');
      } else {
        await axios.post('http://localhost:8000/api/hotel-packages', formData, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        toast.success('Package created successfully');
      }
      navigate('/hotel-packages');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to save package');
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        {id ? 'Edit Hotel Package' : 'Create New Hotel Package'}
      </h1>
      
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Hotel Details Section */}
          <div className="col-span-2">
            <h2 className="text-xl font-semibold mb-4 border-b pb-2">Hotel Details</h2>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Hotel Name*</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Chain</label>
            <input
              type="text"
              name="chain"
              value={formData.chain}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Star Rating*</label>
            <select
              name="starRating"
              value={formData.starRating}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              {[1, 2, 3, 4, 5].map(num => (
                <option key={num} value={num}>{num} Star{num !== 1 ? 's' : ''}</option>
              ))}
            </select>
          </div>
          
          {/* Location Section */}
          <div className="col-span-2">
            <h2 className="text-xl font-semibold mb-4 border-b pb-2">Location</h2>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <input
              type="text"
              name="location.address"
              value={formData.location.address}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">City*</label>
            <input
              type="text"
              name="location.city"
              value={formData.location.city}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Country*</label>
            <input
              type="text"
              name="location.country"
              value={formData.location.country}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Landmark</label>
            <input
              type="text"
              name="location.landmark"
              value={formData.location.landmark}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Latitude</label>
            <input
              type="number"
              step="any"
              name="location.coordinates.lat"
              value={formData.location.coordinates.lat}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Longitude</label>
            <input
              type="number"
              step="any"
              name="location.coordinates.lng"
              value={formData.location.coordinates.lng}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          {/* Amenities Section */}
          <div className="col-span-2">
            <h2 className="text-xl font-semibold mb-4 border-b pb-2">Hotel Amenities</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {amenitiesList.map(amenity => (
                <div key={amenity} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`amenity-${amenity}`}
                    value={amenity}
                    checked={formData.amenities.includes(amenity)}
                    onChange={(e) => handleCheckboxChange(e, 'amenities')}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor={`amenity-${amenity}`} className="ml-2 text-sm text-gray-700">
                    {amenity}
                  </label>
                </div>
              ))}
            </div>
            <div className="mt-4 flex">
              <input
                type="text"
                value={newAmenity}
                onChange={(e) => setNewAmenity(e.target.value)}
                placeholder="Add new amenity"
                className="px-3 py-2 border border-gray-300 rounded-l-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 flex-grow"
              />
              <button
                type="button"
                onClick={addNewAmenity}
                className="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700"
              >
                Add
              </button>
            </div>
          </div>
          
          {/* Room Details Section */}
          <div className="col-span-2">
            <h2 className="text-xl font-semibold mb-4 border-b pb-2">Room Details</h2>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Room Type*</label>
            <input
              type="text"
              name="roomType"
              value={formData.roomType}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bed Type</label>
            <select
              name="bedType"
              value={formData.bedType}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="single">Single</option>
              <option value="double">Double</option>
              <option value="twin">Twin</option>
              <option value="suite">Suite</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Max Occupancy</label>
            <input
              type="number"
              min="1"
              name="maxOccupancy"
              value={formData.maxOccupancy}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Room View</label>
            <input
              type="text"
              name="roomView"
              value={formData.roomView}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          {/* Room Amenities Section */}
          <div className="col-span-2">
            <h2 className="text-xl font-semibold mb-4 border-b pb-2">Room Amenities</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {roomAmenitiesList.map(amenity => (
                <div key={amenity} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`room-amenity-${amenity}`}
                    value={amenity}
                    checked={formData.roomAmenities.includes(amenity)}
                    onChange={(e) => handleCheckboxChange(e, 'roomAmenities')}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor={`room-amenity-${amenity}`} className="ml-2 text-sm text-gray-700">
                    {amenity}
                  </label>
                </div>
              ))}
            </div>
            <div className="mt-4 flex">
              <input
                type="text"
                value={newRoomAmenity}
                onChange={(e) => setNewRoomAmenity(e.target.value)}
                placeholder="Add new room amenity"
                className="px-3 py-2 border border-gray-300 rounded-l-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 flex-grow"
              />
              <button
                type="button"
                onClick={addNewRoomAmenity}
                className="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700"
              >
                Add
              </button>
            </div>
          </div>
          
          {/* Stay Details Section */}
          <div className="col-span-2">
            <h2 className="text-xl font-semibold mb-4 border-b pb-2">Stay Details</h2>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Number of Nights*</label>
            <input
              type="number"
              min="1"
              name="nights"
              value={formData.nights}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Meal Plan</label>
            <select
              name="mealPlan"
              value={formData.mealPlan}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="room_only">Room Only</option>
              <option value="breakfast">Breakfast</option>
              <option value="half_board">Half Board</option>
              <option value="full_board">Full Board</option>
              <option value="all_inclusive">All Inclusive</option>
            </select>
          </div>
          
          {/* Pricing Section */}
          <div className="col-span-2">
            <h2 className="text-xl font-semibold mb-4 border-b pb-2">Pricing</h2>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Base Rate (per night)*</label>
            <input
              type="number"
              min="0"
              step="0.01"
              name="baseRate"
              value={formData.baseRate}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Taxes (per night)*</label>
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Fees (per night)</label>
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
              <option value="INR">INR (₹)</option>
              <option value="AUD">AUD (A$)</option>
            </select>
          </div>
          
          <div className="col-span-2 bg-gray-50 p-4 rounded-md">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500">Total for {formData.nights} night(s)</p>
                <p className="text-2xl font-bold text-blue-600">
                  {formData.currency} {formData.totalPrice.toFixed(2)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Per night: {formData.currency} {(formData.totalPrice / formData.nights).toFixed(2)}</p>
                <p className="text-sm text-gray-500">Includes taxes and fees</p>
              </div>
            </div>
          </div>
          
          {/* Policies Section */}
          <div className="col-span-2">
            <h2 className="text-xl font-semibold mb-4 border-b pb-2">Policies</h2>
          </div>
          
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Payment Policy</label>
            <textarea
              name="paymentPolicy"
              value={formData.paymentPolicy}
              onChange={handleChange}
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Child Policy</label>
            <textarea
              name="childPolicy"
              value={formData.childPolicy}
              onChange={handleChange}
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          {/* Status Section */}
          <div className="col-span-2">
            <h2 className="text-xl font-semibold mb-4 border-b pb-2">Status</h2>
          </div>
          
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
            onClick={() => navigate('/admin/hotel-packages')}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {isSubmitting ? 'Saving...' : id ? 'Update Package' : 'Create Package'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default HotelPackageForm;