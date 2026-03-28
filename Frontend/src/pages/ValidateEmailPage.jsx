import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { MailCheck } from 'lucide-react';
import { authService } from '../services/auth';

export default function ValidateEmailPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [otp, setOtp] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // If user got routed here without state (e.g. they refreshed), they won't see their email
  const email = location.state?.email || 'your email';

  // Automatically validate if OTP is passed via query string (e.g., from an email link)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tokenFromUrl = params.get('token');
    if (tokenFromUrl) {
      setOtp(tokenFromUrl);
      // Optional: automatically submit if a full 6-digit token is in URL
      // submitValidation(tokenFromUrl);
    }
  }, [location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await submitValidation(otp);
  };

  const submitValidation = async (otpCode) => {
    if (!otpCode || otpCode.length < 6) {
      setError('Please enter a valid 6-digit code');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await authService.validateEmail(otpCode);
      // Validation successful, navigate to test success page
      navigate('/test-success');
    } catch (err) {
      setError(err.message || 'Verification failed. Please check your code and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center text-indigo-600 mb-4">
          <MailCheck size={48} />
        </div>
        <h2 className="mt-2 text-center text-3xl font-extrabold text-gray-900">
          Verify your email
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          We've sent a 6-digit verification code to
          <br />
          <span className="font-medium text-gray-900">{email}</span>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl sm:rounded-lg sm:px-10 border border-gray-100">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-md">
                <div className="flex">
                  <div className="ml-3">
                    <p className="text-sm text-red-700 font-medium">{error}</p>
                  </div>
                </div>
              </div>
            )}

            <div>
              <label htmlFor="otp" className="block text-sm font-medium text-gray-700 text-center mb-2">
                Verification Code
              </label>
              <div className="mt-1">
                <input
                  id="otp"
                  name="otp"
                  type="text"
                  required
                  maxLength={6}
                  className="block w-full text-center text-2xl tracking-widest px-3 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 transition-all font-mono"
                  placeholder="000000"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))} // Only allow numbers
                />
              </div>
              <p className="mt-2 text-xs text-center text-gray-500">
                Enter the 6-digit code sent to your email
              </p>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading || otp.length < 6}
                className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors ${
                  (isLoading || otp.length < 6) ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Verifying...
                  </span>
                ) : (
                  'Verify Email'
                )}
              </button>
            </div>
            
             <div className="mt-4 text-center">
              <Link to="/login" className="text-sm font-medium text-indigo-600 hover:text-indigo-500 transition-colors">
                Back to Login
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
