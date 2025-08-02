import { useState } from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import OAuth from '../components/OAuth'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useAuth } from '../context/ContextProvider' // Add this import

const backendUrl = import.meta.env.VITE_BACKEND_URL

const Login = () => {
  const [state, setState] = useState('Sign Up')
  const [step, setStep] = useState(1)
  const [name, setName] = useState('')
  const [dob, setDob] = useState('')
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [keepLoggedIn, setKeepLoggedIn] = useState(false)
  const [userId, setUserId] = useState('')
  const [loginToken, setLoginToken] = useState('') // Store token from login step

  const navigate = useNavigate()
  const { login } = useAuth() // Get login function from context

  const onSubmitHandler = async (e) => {
    e.preventDefault()

    try {
      if (step === 1) {
        // Step 1: Send OTP based on flow
        if (state === 'Sign Up') {
          const res = await axios.post(`${backendUrl}/api/auth/register`, { name, dob, email })
          if (res.data.success) {
            setUserId(res.data.userId)
            setStep(2)
            toast.success('OTP sent to your email!')
          } else {
            toast.error(res.data.message)
          }
        } else {
          const res = await axios.post(`${backendUrl}/api/auth/login`, { email })
          if (res.data.success) {
            setUserId(res.data.userId)
            setLoginToken(res.data.token) // 🔧 Store token from login
            setStep(2)
            toast.success('OTP sent to your email!')
          } else {
            toast.error(res.data.message)
          }
        }
      } else {
        // Step 2: Verify OTP
        const res = await axios.post(`${backendUrl}/api/auth/verify`, { userId, otp })
        
        console.log('Verify OTP Response:', res.data)
        
        if (res.data.success) {
          // Create token and user data
          let token, user;
          
          // If backend returns token and user (after you fix backend)
          if (res.data.token && res.data.user) {
            token = res.data.token;
            user = res.data.user;
          } 
          // Fallback: Use token from login step or create new session
          else {
            token = loginToken || `verified-${userId}-${Date.now()}`;
            user = {
              id: userId,
              email: email,
              name: name || 'User',
              verified: true,
              loginTime: new Date().toISOString()
            };
          }
          
          // Save to localStorage
          localStorage.setItem('token', token);
          localStorage.setItem('user', JSON.stringify(user));
          
          // Update context
          login(user);
          
          // Optional: Save keepLoggedIn preference
          if (keepLoggedIn) {
            localStorage.setItem('keepLoggedIn', 'true');
          }
          
          toast.success('Authentication successful!');
          navigate('/dashboard');
        } else {
          toast.error(res.data.message);
        }
      }
    } catch (error) {
      console.error('Axios error:', error.response?.data || error.message)
      toast.error(error.response?.data?.message || 'Something went wrong. Try again!')
    }
  }

  return (
    <div className='flex flex-col md:flex-row min-h-screen bg-gray-50'>
      {/* Left Section - Form */}
      <div className='flex flex-1 justify-center items-center px-6 py-8'>
        <form
          onSubmit={onSubmitHandler}
          className='w-full max-w-md bg-white shadow-lg rounded-2xl p-8 space-y-5'
        >
          {/* Header */}
          <div>
            <h2 className='text-3xl font-bold text-gray-800'>
              {state === 'Sign Up' ? 'Sign up' : 'Sign in'}
            </h2>
            <p className='text-gray-500 text-sm mt-1'>
              {state === 'Sign Up'
                ? 'Sign up to enjoy the feature of HD.'
                : 'Please login to continue to your account.'}
            </p>
          </div>

          {/* Sign Up Fields */}
          {state === 'Sign Up' && step === 1 && (
            <>
              <div>
                <label className='text-sm font-medium text-gray-700'>Your Name</label>
                <input
                  type='text'
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className='mt-1 w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
                />
              </div>

              <div>
                <label className='text-sm font-medium text-gray-700'>Date of Birth</label>
                <input
                  type='date'
                  required
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className='mt-1 w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
                />
              </div>
            </>
          )}

          {/* Email Field */}
          <div>
            <label className='text-sm font-medium text-gray-700'>Email</label>
            <input
              type='email'
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className='mt-1 w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
          </div>

          {/* OTP Field */}
          {step === 2 && (
            <div>
              <label className='text-sm font-medium text-gray-700'>OTP</label>
              <input
                type='text'
                required
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className='mt-1 w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
              />
            </div>
          )}

          {/* Sign In Extra Options */}
          {state === 'Sign In' && step === 2 && (
            <div className='flex justify-between items-center'>
              <span className='text-sm text-blue-600 hover:underline cursor-pointer'>
                Resend OTP
              </span>
              <label className='text-sm flex items-center gap-2'>
                <input
                  type='checkbox'
                  checked={keepLoggedIn}
                  onChange={() => setKeepLoggedIn(!keepLoggedIn)}
                  className='accent-blue-600'
                />
                Keep me logged in
              </label>
            </div>
          )}

          {/* Submit Button */}
          <button
            type='submit'
            className='w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2 rounded-md font-medium hover:from-blue-700 hover:to-indigo-700 transition'
          >
            {step === 1
              ? 'Get OTP'
              : state === 'Sign Up'
              ? 'Sign up'
              : 'Sign in'}
          </button>

          <OAuth />

          {/* Switch Link */}
          <p className='text-center text-sm text-gray-600'>
            {state === 'Sign Up'
              ? 'Already have an account?'
              : 'Need an account?'}{' '}
            <span
              onClick={() => {
                setState(state === 'Sign Up' ? 'Sign In' : 'Sign Up')
                setStep(1)
                setLoginToken('') // Clear any stored token
              }}
              className='text-blue-600 font-medium cursor-pointer hover:underline'
            >
              {state === 'Sign Up' ? 'Sign in' : 'Create one'}
            </span>
          </p>
        </form>
      </div>

      {/* Right Section */}
      <div className='hidden md:flex flex-1'>
        <img
          src={assets.home_img}
          alt='HD visual'
          className='object-cover w-full h-full'
        />
      </div>
    </div>
  )
}

export default Login