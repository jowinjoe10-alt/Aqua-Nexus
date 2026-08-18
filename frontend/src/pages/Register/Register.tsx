import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../shared/Auth.css'
import './Register.css'

function Register() {
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [accountType, setAccountType] = useState('')
  const [error, setError] = useState('')

  const handleRegister = () => {
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

    setError('')
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

            <label htmlFor="name">Name</label>

            <input
              type="text"
              id="name"
              placeholder="Enter your name"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />

            <label htmlFor="register-email">Gmail</label>

            <input
              type="email"
              id="register-email"
              placeholder="Enter your Gmail"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />

            <label>Account Type</label>

            <div className="account-type">

              <label className="role-option">

                <input
                  type="radio"
                  name="accountType"
                  value="farmer"
                  checked={accountType === 'farmer'}
                  onChange={(event) => setAccountType(event.target.value)}
                />

                <span>Farmer</span>

                <span className="role-tooltip">
                  Manages fish entries and purchases feed from Vendors after going through recommendations.
                </span>

              </label>

              <label className="role-option">

                <input
                  type="radio"
                  name="accountType"
                  value="vendor"
                  checked={accountType === 'vendor'}
                  onChange={(event) => setAccountType(event.target.value)}
                />

                <span>Vendor</span>

                <span className="role-tooltip">
                  Sells feed to Farmers and earns returns.
                </span>

              </label>

            </div>

            {error && (
              <p className="form-error">{error}</p>
            )}

          </div>

          <div className="login-buttons">

            <button
              type="button"
              className="back-button"
              onClick={() => navigate('/login')}
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

    </div>
  )
}

export default Register