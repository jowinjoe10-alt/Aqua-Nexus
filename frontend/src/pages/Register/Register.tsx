import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../shared/Auth.css'

function Register() {
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [accountType, setAccountType] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [error, setError] = useState('')
  const [registrationSuccessful, setRegistrationSuccessful] =
    useState(false)

  const handleRegister = async () => {
    if (name.trim() === '') {
      setError('Enter your name')
      return
    }

    if (!email.endsWith('@gmail.com')) {
      setError('Enter valid Gmail')
      return
    }

    if (accountType === '') {
      setError('Select an option')
      return
    }

    if (city.trim() === '') {
      setError('Enter your city')
      return
    }

    if (state.trim() === '') {
      setError('Enter your state')
      return
    }

    setError('')

    try {
      const response = await fetch(
        'http://localhost:8000/api/register/',
        {
          method: 'POST',

          headers: {
            'Content-Type': 'application/json',
          },

          body: JSON.stringify({
            name: name.trim(),
            gmail: email.trim().toLowerCase(),
            role: accountType,
            city: city.trim(),
            state: state.trim(),
          }),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        if (data.errors) {
          const firstError =
            Object.values(data.errors)[0]

          if (Array.isArray(firstError)) {
            setError(String(firstError[0]))
          } else {
            setError(String(firstError))
          }
        } else {
          setError(
            data.message ||
            'Registration failed'
          )
        }

        return
      }

      console.log(
        'Registration successful:',
        data
      )

      setRegistrationSuccessful(true)

      setTimeout(() => {
        navigate('/login')
      }, 2000)

    } catch (error) {
      console.error(
        'Registration error:',
        error
      )

      setError(
        'Unable to connect to the server'
      )
    }
  }

  return (
    <div className="login-page">

      <div className="ambient-shape shape-one"></div>
      <div className="ambient-shape shape-two"></div>
      <div className="ambient-shape shape-three"></div>

      <div className="login-box">

        <div className="login-content">

          <h2>REGISTER</h2>

          <div className="login-form">

            <label htmlFor="name">
              Name
            </label>

            <input
              type="text"
              id="name"
              placeholder="Enter your name"
              value={name}
              onChange={(event) =>
                setName(event.target.value)
              }
            />

            <label htmlFor="register-email">
              Gmail
            </label>

            <input
              type="email"
              id="register-email"
              placeholder="Enter your Gmail"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
            />

            <label>
              Account Type
            </label>

            <div className="account-type">

              <label className="role-option">

                <input
                  type="radio"
                  name="accountType"
                  value="farmer"
                  checked={
                    accountType === 'farmer'
                  }
                  onChange={(event) =>
                    setAccountType(
                      event.target.value
                    )
                  }
                />

                <span>
                  Farmer
                </span>

                <span className="role-tooltip">
                  Manages fish entries and purchases
                  feed from Vendors after going through
                  recommendations.
                </span>

              </label>

              <label className="role-option">

                <input
                  type="radio"
                  name="accountType"
                  value="vendor"
                  checked={
                    accountType === 'vendor'
                  }
                  onChange={(event) =>
                    setAccountType(
                      event.target.value
                    )
                  }
                />

                <span>
                  Vendor
                </span>

                <span className="role-tooltip">
                  Sells feed to Farmers and earns returns.
                </span>

              </label>

            </div>

            <label
              htmlFor="city"
              className="field-label-tooltip"
            >
              City

              <span className="field-tooltip">
                Your location helps Aqua Nexus provide
                local weather information, nearby
                vendor/customer availability, and
                location-based recommendations.
              </span>
            </label>

            <input
              type="text"
              id="city"
              placeholder="Enter your city"
              value={city}
              onChange={(event) =>
                setCity(event.target.value)
              }
            />

            <label htmlFor="state">
              State
            </label>

            <input
              type="text"
              id="state"
              placeholder="Enter your state"
              value={state}
              onChange={(event) =>
                setState(event.target.value)
              }
            />

            {error && (
              <p className="form-error">
                {error}
              </p>
            )}

          </div>

          <div className="login-buttons">

            <button
              type="button"
              className="back-button"
              onClick={() =>
                navigate('/login')
              }
            >
              BACK
            </button>

            <button
              type="button"
              className="otp-button"
              onClick={handleRegister}
            >
              REGISTER
            </button>

          </div>

        </div>

      </div>

      {/* ============================= */}
      {/* Registration Success Popup    */}
      {/* ============================= */}

      {registrationSuccessful && (
        <div className="success-overlay">

          <div className="success-popup">

            <div className="success-icon">
              ✓
            </div>

            <h3>
              Registration Successful
            </h3>

            <p>
              Your Aqua Nexus account has
              been created successfully.
            </p>

          </div>

        </div>
      )}

    </div>
  )
}

export default Register