import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { 
  registerUser, 
  verifyRegistrationOTP,
  clearError,
  resetOtpState
} from '../../Store/AuthSlice';
import { useNavigate, Link } from 'react-router-dom';

const AuthRegister = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registrationStep, setRegistrationStep] = useState(1); // 1: Form, 2: OTP Verification
  const [otpResent, setOtpResent] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState('');
  
  const { 
    error,
    otp,
    isLoading
  } = useSelector((state) => ({
    error: state.auth.error,
    otp: state.auth.otp,
    isLoading: state.auth.isLoading
  }));

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    getValues,
    setValue
  } = useForm();

  // Clear errors and OTP state when component unmounts
  useEffect(() => {
    return () => {
      dispatch(clearError());
      dispatch(resetOtpState());
    };
  }, [dispatch]);

  // Handle OTP verification success
  useEffect(() => {
    if (otp.verified) {
      navigate('/login', { 
        state: { 
          registrationSuccess: true,
          email: registeredEmail
        }
      });
    }
  }, [otp.verified, navigate, registeredEmail]);

  // Auto-advance to OTP step when OTP is sent
  useEffect(() => {
    if (otp.sent && registrationStep === 1) {
      setRegistrationStep(2);
    }
  }, [otp.sent, registrationStep]);

  // Handle registration form submission
  const onSubmitRegistration = async (data) => {
    setIsSubmitting(true);
    try {
      await dispatch(registerUser(data));
      console.log(data , " Object Reg +++++++")
      localStorage.setItem('registeredEmail', data.email);
      setRegisteredEmail(data.email); // Store the email for OTP verification
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle OTP verification
  const onSubmitOTPVerification = async (data) => {
    setIsSubmitting(true);

    console.log(data)
    try {
      const Email = registeredEmail || localStorage.getItem('registeredEmail'); //safer purpose
      await dispatch(verifyRegistrationOTP({
        email: Email, // Use the stored email
        otp: data.otp
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Resend OTP
  const handleResendOTP = async () => {
    setIsSubmitting(true);
    setOtpResent(false);
    try {
      const formData = getValues();
      const result = await dispatch(registerUser(formData));
      if (result.payload?.success) {
        setRegisteredEmail(formData.email); // Ensure email is updated
        setOtpResent(true);
        setTimeout(() => setOtpResent(false), 3000);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Format phone number as user types
  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    setValue('phone', value);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {registrationStep === 1 ? 'Create a new account' : 'Verify your email'}
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {/* Success Message (OTP Resent) */}
          {otpResent && (
            <div className="mb-4 bg-green-50 border-l-4 border-green-500 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-green-700">New OTP sent successfully</p>
                </div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error.message || error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Registration Form */}
          {registrationStep === 1 && (
            <form className="space-y-6" onSubmit={handleSubmit(onSubmitRegistration)}>
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                {/* First Name */}
                <div className="sm:col-span-1">
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                    First Name*
                  </label>
                  <div className="mt-1">
                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      autoComplete="given-name"
                      disabled={isLoading || isSubmitting}
                      {...register('firstName', {
                        required: 'First name is required',
                        minLength: {
                          value: 2,
                          message: 'Must be at least 2 characters'
                        }
                      })}
                      className={`appearance-none block w-full px-3 py-2 border ${
                        errors.firstName ? 'border-red-300' : 'border-gray-300'
                      } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:opacity-50`}
                    />
                    {errors.firstName && (
                      <p className="mt-2 text-sm text-red-600">{errors.firstName.message}</p>
                    )}
                  </div>
                </div>

                {/* Last Name */}
                <div className="sm:col-span-1">
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                    Last Name*
                  </label>
                  <div className="mt-1">
                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      autoComplete="family-name"
                      disabled={isLoading || isSubmitting}
                      {...register('lastName', {
                        required: 'Last name is required',
                        minLength: {
                          value: 2,
                          message: 'Must be at least 2 characters'
                        }
                      })}
                      className={`appearance-none block w-full px-3 py-2 border ${
                        errors.lastName ? 'border-red-300' : 'border-gray-300'
                      } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:opacity-50`}
                    />
                    {errors.lastName && (
                      <p className="mt-2 text-sm text-red-600">{errors.lastName.message}</p>
                    )}
                  </div>
                </div>

                {/* Email */}
                <div className="sm:col-span-2">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email Address*
                  </label>
                  <div className="mt-1">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      disabled={isLoading || isSubmitting}
                      {...register('email', {
                        required: 'Email is required',
                        pattern: {
                          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                          message: 'Invalid email format',
                        },
                      })}
                      className={`appearance-none block w-full px-3 py-2 border ${
                        errors.email ? 'border-red-300' : 'border-gray-300'
                      } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:opacity-50`}
                    />
                    {errors.email && (
                      <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>
                    )}
                  </div>
                </div>

                {/* Password */}
                <div className="sm:col-span-2">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password*
                  </label>
                  <div className="mt-1">
                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="new-password"
                      disabled={isLoading || isSubmitting}
                      {...register('password', {
                        required: 'Password is required',
                        minLength: {
                          value: 8,
                          message: 'Password must be at least 8 characters',
                        },
                        validate: {
                          hasNumber: value => /[0-9]/.test(value) || 'Must contain at least one number',
                          hasSpecialChar: value => /[!@#$%^&*(),.?":{}|<>]/.test(value) || 'Must contain at least one special character'
                        }
                      })}
                      className={`appearance-none block w-full px-3 py-2 border ${
                        errors.password ? 'border-red-300' : 'border-gray-300'
                      } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:opacity-50`}
                    />
                    {errors.password && (
                      <p className="mt-2 text-sm text-red-600">{errors.password.message}</p>
                    )}
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="sm:col-span-2">
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                    Confirm Password*
                  </label>
                  <div className="mt-1">
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      autoComplete="new-password"
                      disabled={isLoading || isSubmitting}
                      {...register('confirmPassword', {
                        required: 'Please confirm your password',
                        validate: (value) =>
                          value === watch('password') || 'Passwords do not match',
                      })}
                      className={`appearance-none block w-full px-3 py-2 border ${
                        errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                      } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:opacity-50`}
                    />
                    {errors.confirmPassword && (
                      <p className="mt-2 text-sm text-red-600">{errors.confirmPassword.message}</p>
                    )}
                  </div>
                </div>

                {/* Phone */}
                <div className="sm:col-span-2">
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                    Phone Number*
                  </label>
                  <div className="mt-1">
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      autoComplete="tel"
                      disabled={isLoading || isSubmitting}
                      {...register('phone', {
                        required: 'Phone number is required',
                        pattern: {
                          value: /^[0-9]{10,15}$/,
                          message: 'Phone number must be 10-15 digits',
                        },
                      })}
                      onChange={handlePhoneChange}
                      className={`appearance-none block w-full px-3 py-2 border ${
                        errors.phone ? 'border-red-300' : 'border-gray-300'
                      } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:opacity-50`}
                    />
                    {errors.phone && (
                      <p className="mt-2 text-sm text-red-600">{errors.phone.message}</p>
                    )}
                  </div>
                </div>

                {/* Alternate Phone */}
                <div className="sm:col-span-2">
                  <label htmlFor="alternatePhone" className="block text-sm font-medium text-gray-700">
                    Alternate Phone (Optional)
                  </label>
                  <div className="mt-1">
                    <input
                      id="alternatePhone"
                      name="alternatePhone"
                      type="tel"
                      autoComplete="tel"
                      disabled={isLoading || isSubmitting}
                      {...register('alternatePhone', {
                        pattern: {
                          value: /^[0-9]{10,15}$/,
                          message: 'Phone number must be 10-15 digits',
                        },
                      })}
                      onChange={handlePhoneChange}
                      className={`appearance-none block w-full px-3 py-2 border ${
                        errors.alternatePhone ? 'border-red-300' : 'border-gray-300'
                      } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:opacity-50`}
                    />
                    {errors.alternatePhone && (
                      <p className="mt-2 text-sm text-red-600">{errors.alternatePhone.message}</p>
                    )}
                  </div>
                </div>

                {/* Date of Birth */}
                <div className="sm:col-span-2">
                  <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700">
                    Date of Birth (Optional)
                  </label>
                  <div className="mt-1">
                    <input
                      id="dateOfBirth"
                      name="dateOfBirth"
                      type="date"
                      disabled={isLoading || isSubmitting}
                      {...register('dateOfBirth', {
                        validate: {
                          validDate: value => {
                            if (!value) return true;
                            const dob = new Date(value);
                            const today = new Date();
                            return dob < today || 'Date must be in the past';
                          },
                          minAge: value => {
                            if (!value) return true;
                            const dob = new Date(value);
                            const today = new Date();
                            const age = today.getFullYear() - dob.getFullYear();
                            return age >= 13 || 'Must be at least 13 years old';
                          }
                        }
                      })}
                      className={`appearance-none block w-full px-3 py-2 border ${
                        errors.dateOfBirth ? 'border-red-300' : 'border-gray-300'
                      } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:opacity-50`}
                    />
                    {errors.dateOfBirth && (
                      <p className="mt-2 text-sm text-red-600">{errors.dateOfBirth.message}</p>
                    )}
                  </div>
                </div>

                {/* Role (hidden field - default to customer) */}
                <input type="hidden" {...register('role')} value="customer" />
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading || isSubmitting}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading || isSubmitting ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Registering...
                    </>
                  ) : (
                    'Register'
                  )}
                </button>
              </div>
            </form>
          )}

          {/* OTP Verification Form */}
          {registrationStep === 2 && (
            <form className="space-y-6" onSubmit={handleSubmit(onSubmitOTPVerification)}>
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-4">
                  We've sent a 6-digit verification code to <span className="font-medium">{registeredEmail}</span>
                </p>
                
                <div className="mt-1">
                  <input
                    id="otp"
                    name="otp"
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]{6}"
                    maxLength="6"
                    autoComplete="off"
                    autoFocus
                    disabled={isLoading || isSubmitting}
                    {...register('otp', {
                      required: 'OTP is required',
                      pattern: {
                        value: /^[0-9]{6}$/,
                        message: 'OTP must be 6 digits'
                      }
                    })}
                    className={`appearance-none block w-full px-3 py-2 border ${
                      errors.otp ? 'border-red-300' : 'border-gray-300'
                    } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-center tracking-widest text-lg disabled:opacity-50`}
                  />
                  {errors.otp && (
                    <p className="mt-2 text-sm text-red-600">{errors.otp.message}</p>
                  )}
                </div>

                <p className="mt-4 text-sm text-gray-600">
                  Didn't receive the code?{' '}
                  <button
                    type="button"
                    onClick={handleResendOTP}
                    disabled={isLoading || isSubmitting}
                    className="font-medium text-blue-600 hover:text-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading || isSubmitting ? 'Sending...' : 'Resend OTP'}
                  </button>
                </p>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading || isSubmitting}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading || isSubmitting ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Verifying...
                    </>
                  ) : (
                    'Verify OTP'
                  )}
                </button>
              </div>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setRegistrationStep(1)}
                  disabled={isLoading || isSubmitting}
                  className="text-sm font-medium text-blue-600 hover:text-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Back to registration
                </button>
              </div>
            </form>
          )}

          {/* Login Link */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Already have an account?
                </span>
              </div>
            </div>

            <div className="mt-6">
              <Link
                to="/auth/login"
                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthRegister;