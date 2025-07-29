import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { fetchProfile, saveProfile } from '../../Store/CustomerProfile';
import { toast } from 'react-toastify';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const schema = yup.object().shape({
  firstName: yup.string().required('First name is required'),
  lastName: yup.string().required('Last name is required'),
  phone: yup.string()
    .required('Phone number is required')
    .matches(/^[0-9]{10,15}$/, 'Phone number must be 10-15 digits'),
  alternatePhone: yup.string()
    .matches(/^[0-9]{10,15}$/, 'Alternate phone must be 10-15 digits')
    .nullable(),
  dateOfBirth: yup.date()
    .max(new Date(), 'Date of birth cannot be in the future')
    .nullable(),
  address: yup.object().shape({
    street: yup.string(),
    city: yup.string(),
    state: yup.string(),
    country: yup.string().default('India'),
    zipCode: yup.string(),
  }),
  passport: yup.object().shape({
    passportNumber: yup.string().required('Passport number is required'),
    countryOfIssue: yup.string().required('Country of issue is required'),
    dateOfIssue: yup.date().required('Date of issue is required'),
    dateOfExpiry: yup.date()
      .required('Date of expiry is required')
      .min(yup.ref('dateOfIssue'), 'Expiry date must be after issue date'),
    placeOfIssue: yup.string(),
    nationality: yup.string(),
  }),
  nationality: yup.string(),
  preferredDestinations: yup.array().of(yup.string()),
});

const ProfileForm = () => {
  const dispatch = useDispatch();
  const { profile, isLoading, error, successMessage } = useSelector((state) => state.customerProfile);
  const [preferredDestinations, setPreferredDestinations] = useState([]);
  const [newDestination, setNewDestination] = useState('');
  
  const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      address: {},
      passport: {},
      preferredDestinations: [],
    }
  });

  // Fetch profile data on component mount
  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  // Reset form with profile data when it's loaded
  useEffect(() => {
    if (profile) {
      const { user, customer } = profile;
      reset({
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        phone: user?.phone || '',
        alternatePhone: user?.alternatePhone || '',
        dateOfBirth: user?.dateOfBirth ? new Date(user.dateOfBirth) : null,
        address: customer?.address || {},
        passport: customer?.passport || {},
        nationality: customer?.nationality || '',
        preferredDestinations: customer?.preferredDestinations || [],
      });
      setPreferredDestinations(customer?.preferredDestinations || []);
    }
  }, [profile, reset]);

  // Handle success/error messages
  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
    }
    if (error) {
      toast.error(error.message || 'An error occurred');
    }
  }, [successMessage, error]);

  const onSubmit = (data) => {
    const profileData = {
      ...data,
      preferredDestinations,
      passport: {
        ...data.passport,
        dateOfIssue: data.passport.dateOfIssue?.toISOString(),
        dateOfExpiry: data.passport.dateOfExpiry?.toISOString(),
      },
      dateOfBirth: data.dateOfBirth?.toISOString(),
    };
    dispatch(saveProfile(profileData));
  };

  const addDestination = () => {
    if (newDestination && !preferredDestinations.includes(newDestination)) {
      setPreferredDestinations([...preferredDestinations, newDestination]);
      setNewDestination('');
    }
  };

  const removeDestination = (destination) => {
    setPreferredDestinations(preferredDestinations.filter(d => d !== destination));
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6">Complete Your Profile</h1>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Personal Information Section */}
        <div className="border-b border-gray-200 pb-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                First Name*
              </label>
              <input
                type="text"
                id="firstName"
                {...register('firstName')}
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${errors.firstName ? 'border-red-500' : 'border'}`}
              />
              {errors.firstName && (
                <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                Last Name*
              </label>
              <input
                type="text"
                id="lastName"
                {...register('lastName')}
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${errors.lastName ? 'border-red-500' : 'border'}`}
              />
              {errors.lastName && (
                <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Phone Number*
              </label>
              <input
                type="tel"
                id="phone"
                {...register('phone')}
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${errors.phone ? 'border-red-500' : 'border'}`}
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="alternatePhone" className="block text-sm font-medium text-gray-700">
                Alternate Phone
              </label>
              <input
                type="tel"
                id="alternatePhone"
                {...register('alternatePhone')}
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${errors.alternatePhone ? 'border-red-500' : 'border'}`}
              />
              {errors.alternatePhone && (
                <p className="mt-1 text-sm text-red-600">{errors.alternatePhone.message}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700">
                Date of Birth
              </label>
              <DatePicker
                id="dateOfBirth"
                selected={watch('dateOfBirth')}
                onChange={(date) => setValue('dateOfBirth', date)}
                dateFormat="yyyy-MM-dd"
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${errors.dateOfBirth ? 'border-red-500' : 'border'}`}
                showYearDropdown
                dropdownMode="select"
                maxDate={new Date()}
              />
              {errors.dateOfBirth && (
                <p className="mt-1 text-sm text-red-600">{errors.dateOfBirth.message}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="nationality" className="block text-sm font-medium text-gray-700">
                Nationality
              </label>
              <input
                type="text"
                id="nationality"
                {...register('nationality')}
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${errors.nationality ? 'border-red-500' : 'border'}`}
              />
              {errors.nationality && (
                <p className="mt-1 text-sm text-red-600">{errors.nationality.message}</p>
              )}
            </div>
          </div>
        </div>
        
        {/* Address Section */}
        <div className="border-b border-gray-200 pb-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Address Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="address.street" className="block text-sm font-medium text-gray-700">
                Street
              </label>
              <input
                type="text"
                id="address.street"
                {...register('address.street')}
                className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
            
            <div>
              <label htmlFor="address.city" className="block text-sm font-medium text-gray-700">
                City
              </label>
              <input
                type="text"
                id="address.city"
                {...register('address.city')}
                className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
            
            <div>
              <label htmlFor="address.state" className="block text-sm font-medium text-gray-700">
                State
              </label>
              <input
                type="text"
                id="address.state"
                {...register('address.state')}
                className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
            
            <div>
              <label htmlFor="address.country" className="block text-sm font-medium text-gray-700">
                Country
              </label>
              <input
                type="text"
                id="address.country"
                {...register('address.country')}
                defaultValue="India"
                className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
            
            <div>
              <label htmlFor="address.zipCode" className="block text-sm font-medium text-gray-700">
                ZIP Code
              </label>
              <input
                type="text"
                id="address.zipCode"
                {...register('address.zipCode')}
                className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
          </div>
        </div>
        
        {/* Passport Information Section */}
        <div className="border-b border-gray-200 pb-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Passport Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="passport.passportNumber" className="block text-sm font-medium text-gray-700">
                Passport Number*
              </label>
              <input
                type="text"
                id="passport.passportNumber"
                {...register('passport.passportNumber')}
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${errors.passport?.passportNumber ? 'border-red-500' : 'border'}`}
              />
              {errors.passport?.passportNumber && (
                <p className="mt-1 text-sm text-red-600">{errors.passport.passportNumber.message}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="passport.countryOfIssue" className="block text-sm font-medium text-gray-700">
                Country of Issue*
              </label>
              <input
                type="text"
                id="passport.countryOfIssue"
                {...register('passport.countryOfIssue')}
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${errors.passport?.countryOfIssue ? 'border-red-500' : 'border'}`}
              />
              {errors.passport?.countryOfIssue && (
                <p className="mt-1 text-sm text-red-600">{errors.passport.countryOfIssue.message}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="passport.dateOfIssue" className="block text-sm font-medium text-gray-700">
                Date of Issue*
              </label>
              <DatePicker
                id="passport.dateOfIssue"
                selected={watch('passport.dateOfIssue')}
                onChange={(date) => setValue('passport.dateOfIssue', date)}
                dateFormat="yyyy-MM-dd"
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${errors.passport?.dateOfIssue ? 'border-red-500' : 'border'}`}
                showYearDropdown
                dropdownMode="select"
                maxDate={new Date()}
              />
              {errors.passport?.dateOfIssue && (
                <p className="mt-1 text-sm text-red-600">{errors.passport.dateOfIssue.message}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="passport.dateOfExpiry" className="block text-sm font-medium text-gray-700">
                Date of Expiry*
              </label>
              <DatePicker
                id="passport.dateOfExpiry"
                selected={watch('passport.dateOfExpiry')}
                onChange={(date) => setValue('passport.dateOfExpiry', date)}
                dateFormat="yyyy-MM-dd"
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${errors.passport?.dateOfExpiry ? 'border-red-500' : 'border'}`}
                showYearDropdown
                dropdownMode="select"
                minDate={watch('passport.dateOfIssue') || new Date()}
              />
              {errors.passport?.dateOfExpiry && (
                <p className="mt-1 text-sm text-red-600">{errors.passport.dateOfExpiry.message}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="passport.placeOfIssue" className="block text-sm font-medium text-gray-700">
                Place of Issue
              </label>
              <input
                type="text"
                id="passport.placeOfIssue"
                {...register('passport.placeOfIssue')}
                className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
            
            <div>
              <label htmlFor="passport.nationality" className="block text-sm font-medium text-gray-700">
                Passport Nationality
              </label>
              <input
                type="text"
                id="passport.nationality"
                {...register('passport.nationality')}
                className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
          </div>
        </div>
        
        {/* Preferred Destinations Section */}
        <div className="pb-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Preferred Destinations</h2>
          <div className="flex items-center mb-2">
            <input
              type="text"
              value={newDestination}
              onChange={(e) => setNewDestination(e.target.value)}
              placeholder="Add a destination"
              className="mr-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
            <button
              type="button"
              onClick={addDestination}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Add
            </button>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {preferredDestinations.map((destination) => (
              <div key={destination} className="flex items-center bg-gray-100 px-3 py-1 rounded-full">
                <span className="mr-1">{destination}</span>
                <button
                  type="button"
                  onClick={() => removeDestination(destination)}
                  className="text-gray-500 hover:text-red-500"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Saving...' : 'Save Profile'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileForm;