import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

function Login() {
  const navigate = useNavigate()
  const location = useLocation()

  const [showOtp, setShowOtp] = useState(false)
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState('')

  const handleGetOtp = async () => {
   if (!email.includes('@') || !email.endsWith('@gmail.com')) {
     setEmailError('Enter valid Gmail')
     return
   }

   setEmailError('')

   try {
    const response = await fetch(
      'http://127.0.0.1:8000/api/login/check/',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          gmail: email.trim(),
        }),
      }
    )

    const data = await response.json()

    if (!response.ok) {
      setEmailError(data.message)
      return
    }

    setShowOtp(true)

  } catch (error) {
    setEmailError('Unable to connect to server')
    console.error(error)
  }
}

  return (
    <div className="login-page">

      <div className="ambient-shape shape-one"></div>
      <div className="ambient-shape shape-two"></div>
      <div className="ambient-shape shape-three"></div>

      <div className="login-box">

        <div className="login-content">

          <h2>LOGIN</h2>

          {!showOtp && (
            <div className="login-form">
              
              <label htmlFor="email">Gmail</label>

              <input
                type="email"
                id="email"
                placeholder="Enter your Gmail"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />

              {emailError && (
                <p className="email-error">{emailError}</p>
              )}

            </div>
          )}

          {showOtp && (
            <div className="login-form">

              <label htmlFor="otp">OTP</label>

              <input
                type="text"
                id="otp"
                className="otp-input"
                placeholder="Enter OTP"
              />

            </div>
          )}

          <div className="login-buttons">

            <button
              type="button"
              className="back-button"
              onClick={() => {
                if (showOtp) {
                  setShowOtp(false)
                } else {
                  navigate('/', {
                    state: {
                      scrollY: location.state?.scrollY,
                    },
                  })
                }
              }}
            >
              BACK
            </button>

            {!showOtp && (
              <button
                type="button"
                onClick={handleGetOtp}
                className="otp-button"
              >
                GET OTP
              </button>
            )}

            {showOtp && (
              <button
                type="button"
                className="otp-button"
              >
                SUBMIT
              </button>
            )}

          </div>

        </div>

        <div className="login-footer">

          <p>
            Don't have an account?{' '}
            <span
              className="register-link"
              onClick={() => navigate('/register')}
            >
              Register
            </span>
          </p>

        </div>

      </div>

    </div>
  )
}

export default Login