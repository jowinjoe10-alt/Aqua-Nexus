import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import '../shared/Auth.css'

function Login() {
  const navigate = useNavigate()
  const location = useLocation()

  const [showOtp, setShowOtp] = useState(false)
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [emailError, setEmailError] = useState('')
  const [otpError, setOtpError] = useState('')
  const [resendCooldown, setResendCooldown] = useState(0)
  const [resendsRemaining, setResendsRemaining] = useState(3)
  const [resendError, setResendError] = useState('')

  useEffect(() => {
    if (resendCooldown <= 0) {
      return
    }

    const timer = setInterval(() => {
     setResendCooldown((current) => current - 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [resendCooldown])

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
          gmail: email.trim().toLowerCase(),
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

const handleVerifyOtp = async () => {
  if (!otp || otp.length !== 6) {
    setOtpError('Enter valid OTP')
    return
  }

  setOtpError('')

  try {
    const response = await fetch(
      'http://127.0.0.1:8000/api/login/verify-otp/',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          gmail: email.trim().toLowerCase(),
          otp: otp,
        }),
      }
    )

    const data = await response.json()

    if (!response.ok) {
      setOtpError(data.message)
      return
    }

    localStorage.setItem(
      'aquaNexusAccount',
      JSON.stringify(data.account)
    )

    if (data.account.role === 'vendor') {
      navigate('/vendor')
    } else {
      navigate('/farmer')
    }

  } catch (error) {
    setOtpError('Unable to connect to server')
    console.error(error)
  }
}

const handleResendOtp = async () => {
  if (resendCooldown > 0 || resendsRemaining === 0) {
    return
  }

  setResendError('')

  try {
    const response = await fetch(
      'http://127.0.0.1:8000/api/login/resend-otp/',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          gmail: email.trim().toLowerCase(),
        }),
      }
    )

    const data = await response.json()

    if (!response.ok) {
      setResendError(data.message)
      return
    }

    setResendsRemaining((current) => current - 1)
    setResendCooldown(30)

  } catch (error) {
    setResendError('Unable to connect to server')
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
                value={otp}
                onChange={(event) => setOtp(event.target.value)}
              />
              {otpError && (
                <p className="email-error">{otpError}</p>
              )}
              <div className="resend-row">

               <button
                 type="button"
                 className="resend-link"
                 onClick={handleResendOtp}
                 disabled={resendCooldown > 0 || resendsRemaining === 0}
               >
                 {resendCooldown > 0
                   ? `Resend OTP in ${resendCooldown}s`
                   : 'Resend OTP'}
               </button>

               <span className="resend-count">
                 {resendsRemaining}/3 resends remaining
               </span>

              </div>

              {resendError && (
                <p className="email-error">{resendError}</p>
              )}
            </div>
          )}

          <div className="login-buttons">

            <button
              type="button"
              className="back-button"
              onClick={() => {
                if (showOtp) {
                 setShowOtp(false)
                 setOtp('')
                 setOtpError('')
                 setResendError('')
                 setResendCooldown(0)
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
                onClick={handleVerifyOtp}
              >
                SUBMIT
              </button>
            )}

          </div>

        </div>
         {!showOtp && (
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
         )}

      </div>

    </div>
  )
}

export default Login