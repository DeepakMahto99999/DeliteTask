import { useState } from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import OAuth from '../components/OAuth'

const Login = () => {
  const [state, setState] = useState('Sign Up') // or 'Sign In'
  const [step, setStep] = useState(1) // Step 1: get OTP, Step 2: enter OTP
  const [name, setName] = useState('')
  const [dob, setDob] = useState('')
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [keepLoggedIn, setKeepLoggedIn] = useState(false)

  const navigate = useNavigate()

  const onSubmitHandler = (e) => {
    e.preventDefault()
    if (step === 1) {
      // Simulate sending OTP
      setStep(2)
    } else {
      // Simulate auth success
      console.log({ name, dob, email, otp, keepLoggedIn })
      navigate('/dashboard') // Example route
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

          {/* Email Field (shared) */}
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

          {/* OTP Step */}
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

          {/* Additional Options for Sign In */}
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
            className='w-full bg-gradient-to-r from-blue-600 to-indigo-00 text-white py-2 rounded-md font-medium hover:from-blue-600 hover:to-indigo-700 transition'
          >
            {step === 1
              ? 'Get OTP'
              : state === 'Sign Up'
              ? 'Sign up'
              : 'Sign in'}
          </button>
            <OAuth/>
          {/* Toggle Link */}
          <p className='text-center text-sm text-gray-600'>
            {state === 'Sign Up'
              ? 'Already have an account?'
              : 'Need an account?'}{' '}
            <span
              onClick={() => {
                setState(state === 'Sign Up' ? 'Sign In' : 'Sign Up')
                setStep(1)
              }}
              className='text-blue-600 font-medium cursor-pointer hover:underline'
            >
              {state === 'Sign Up' ? 'Sign in' : 'Create one'}
            </span>
          </p>
        </form>
      </div>

      {/* Right Section - Image */}
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
