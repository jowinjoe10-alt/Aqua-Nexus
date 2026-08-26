import { useEffect, useState } from 'react'
import './Admin.css'

import HamburgerMenu
  from '../../components/HamburgerMenu/HamburgerMenu'

import Farmer
  from './Farmer/Farmer'

import Vendor
  from './Vendor/Vendor'


type Account = {
  id: number
  name: string
  gmail: string
  role: string
  city: string
  state: string
}


function Admin() {

  const [activeSection, setActiveSection] =
    useState('Admin')


  const [locationPopupOpen, setLocationPopupOpen] =
    useState(false)


  const [account, setAccount] =
    useState<Account | null>(null)


  const [city, setCity] =
    useState('')


  const [state, setState] =
    useState('')


  const [locationError, setLocationError] =
    useState('')


  const [locationSaving, setLocationSaving] =
    useState(false)


  /* ============================= */
  /* Load Account                  */
  /* ============================= */

  useEffect(() => {

    const storedAccount =
      localStorage.getItem(
        'aquaNexusAccount'
      )


    if (!storedAccount) {
      return
    }


    try {

      const parsedAccount: Account =
        JSON.parse(storedAccount)


      setAccount(parsedAccount)


      setCity(
        parsedAccount.city || ''
      )


      setState(
        parsedAccount.state || ''
      )


      if (
        !parsedAccount.city?.trim() ||
        !parsedAccount.state?.trim()
      ) {

        setLocationPopupOpen(true)

      }


    } catch (error) {

      console.error(
        'Unable to read account information:',
        error
      )

    }

  }, [])


  /* ============================= */
  /* Save Location                 */
  /* ============================= */

  const handleSaveLocation = async () => {

    if (city.trim() === '') {

      setLocationError(
        'Enter your city'
      )

      return
    }


    if (state.trim() === '') {

      setLocationError(
        'Enter your state'
      )

      return
    }


    if (!account) {

      setLocationError(
        'Account information is unavailable'
      )

      return
    }


    setLocationError('')
    setLocationSaving(true)


    try {

      const response = await fetch(
        'http://127.0.0.1:8000/api/account/location/',
        {
          method: 'POST',

          headers: {
            'Content-Type':
              'application/json',
          },

          body: JSON.stringify({

            account_id: account.id,

            city: city.trim(),

            state: state.trim(),

          }),

        }
      )


      const data =
        await response.json()


      if (!response.ok) {

        setLocationError(
          data.message ||
          'Unable to save your location'
        )

        return
      }


      const updatedAccount: Account =
        data.account


      localStorage.setItem(
        'aquaNexusAccount',
        JSON.stringify(
          updatedAccount
        )
      )


      setAccount(
        updatedAccount
      )


      setCity(
        updatedAccount.city
      )


      setState(
        updatedAccount.state
      )


      setLocationPopupOpen(
        false
      )


    } catch (error) {

      console.error(
        'Location update error:',
        error
      )


      setLocationError(
        'Unable to connect to server'
      )


    } finally {

      setLocationSaving(false)

    }

  }


  return (

    <div className="admin-page">


      {/* ============================= */}
      {/* Location Popup                */}
      {/* ============================= */}

      {locationPopupOpen && (

        <div className="location-overlay">

          <div className="location-modal">

            <h2>
              Set Your Location
            </h2>


            <p className="location-description">
              Your location helps Aqua Nexus
              provide local information and
              connect you with nearby users.
            </p>


            <div className="location-form">

              <label htmlFor="admin-city">
                City
              </label>


              <input
                type="text"
                id="admin-city"
                placeholder="Enter your city"
                value={city}
                onChange={(event) => {

                  setCity(
                    event.target.value
                  )

                  setLocationError('')

                }}
              />


              <label htmlFor="admin-state">
                State
              </label>


              <input
                type="text"
                id="admin-state"
                placeholder="Enter your state"
                value={state}
                onChange={(event) => {

                  setState(
                    event.target.value
                  )

                  setLocationError('')

                }}
              />


              {locationError && (

                <p className="location-error">
                  {locationError}
                </p>

              )}


              <button
                type="button"
                className="location-continue-button"
                onClick={
                  handleSaveLocation
                }
                disabled={
                  locationSaving
                }
              >

                {locationSaving
                  ? 'Saving...'
                  : 'CONTINUE'}

              </button>

            </div>

          </div>

        </div>

      )}


      {/* ============================= */}
      {/* Admin Header                  */}
      {/* ============================= */}

      <header className="admin-header">

        <HamburgerMenu
          role="admin"
          city={city}
          state={state}
        />


        <h1>
          Aqua Nexus
        </h1>


        <button
          type="button"
          className="notification-button"
          aria-label="Notifications"
        >
          🔔
        </button>

      </header>


      {/* ============================= */}
      {/* Main Navigation               */}
      {/* ============================= */}

      <nav className="admin-navigation">

        <button
          type="button"
          className={`nav-button ${
            activeSection === 'Farmer'
              ? 'active'
              : ''
          }`}
          onClick={() =>
            setActiveSection(
              'Farmer'
            )
          }
        >
          Farmer
        </button>


        <button
          type="button"
          className={`nav-button ${
            activeSection === 'Vendor'
              ? 'active'
              : ''
          }`}
          onClick={() =>
            setActiveSection(
              'Vendor'
            )
          }
        >
          Vendor
        </button>


        <button
          type="button"
          className={`nav-button ${
            activeSection === 'Admin'
              ? 'active'
              : ''
          }`}
          onClick={() =>
            setActiveSection(
              'Admin'
            )
          }
        >
          Admin
        </button>

      </nav>


      {/* ============================= */}
      {/* Main Content                  */}
      {/* ============================= */}

      <main className="admin-content">


        {/* ============================= */}
        {/* Farmer                        */}
        {/* ============================= */}

        {activeSection === 'Farmer' && (

          <Farmer />

        )}


        {/* ============================= */}
        {/* Vendor                        */}
        {/* ============================= */}

        {activeSection === 'Vendor' && (

          <Vendor />

        )}


        {/* ============================= */}
        {/* Admin                         */}
        {/* ============================= */}

        {activeSection === 'Admin' && (

          <section
            className="admin-section-placeholder"
          >

            <div className="section-content">

              <h2>
                Admin
              </h2>

              <p>
                Admin management and
                master data will appear here.
              </p>

            </div>

          </section>

        )}

      </main>

    </div>

  )
}


export default Admin