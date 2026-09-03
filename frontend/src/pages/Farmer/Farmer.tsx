import { useEffect, useState } from 'react'
import './Farmer.css'
import HamburgerMenu from '../../components/HamburgerMenu/HamburgerMenu'
import FarmerFeed from './FarmerFeed'
import FarmerPond from './FarmerPond'
import Notifications from '../../components/Notifications/Notifications'
import FarmerVendor from './FarmerVendor/FarmerVendor'

type Fish = {
  id: number
  name: string
  image: string | null
  water_type: string
  feeding_habit: string
  temperature_min: string
  temperature_max: string
  ph_min: string
  ph_max: string
  culture_period_days: number
}

type FeedRecommendation = {
  id: number
  fish_stage?: number | null
  fish_name?: string | null
  stage_number?: number | null
  feed_name?: string | null
  feed_type?: string | null
  feed_form?: string | null
  protein_min?: number | null
  protein_max?: number | null
  particle_size_min?: number | null
  particle_size_max?: number | null
  organic?: boolean | null
}

type Account = {
  id: number
  name: string
  gmail: string
  role: string
  city: string
  state: string
}


function Farmer() {

  const [activeSection, setActiveSection] = useState('Fish')

  const [showNotifications, setShowNotifications] =
    useState(false)

  const [searchText, setSearchText] = useState('')

  const [fishList, setFishList] = useState<Fish[]>([])

  const [fishLoading, setFishLoading] =
    useState(false)

  const [fishError, setFishError] =
    useState('')

  const [selectedFish, setSelectedFish] =
    useState<Fish | null>(null)

  const [showFarmerFeed, setShowFarmerFeed] =
    useState(false)

  const [selectedFeed, setSelectedFeed] =
  useState<FeedRecommendation | null>(null)

  const [locationPopupOpen, setLocationPopupOpen] =
    useState(false)

  const [vendorSearchText, setVendorSearchText] =
    useState('')

  const handleGoToVendor = (
    feed: FeedRecommendation
  ) => {
    setSelectedFeed(feed)
    setVendorSearchText(feed.feed_name || '')
    setActiveSection('Vendors')
  }
  
  const [account, setAccount] =
    useState<Account | null>(null)

  const [city, setCity] = useState('')

  const [state, setState] = useState('')

  const [locationError, setLocationError] =
    useState('')

  const [locationSaving, setLocationSaving] =
    useState(false)


  /* ============================= */
  /* Load Account                   */
  /* ============================= */

  useEffect(() => {

    const storedAccount =
      localStorage.getItem('aquaNexusAccount')

    if (!storedAccount) {
      return
    }

    try {

      const parsedAccount: Account =
        JSON.parse(storedAccount)

      setAccount(parsedAccount)

      setCity(parsedAccount.city || '')
      setState(parsedAccount.state || '')

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


  useEffect(() => {

    if (!searchText.trim() || selectedFish) {

      setFishList([])

      return

    }

    const searchFish = async () => {

      setFishLoading(true)
      setFishError('')

      try {

        const response = await fetch(
          `http://127.0.0.1:8000/api/fish/?search=${encodeURIComponent(
            searchText
          )}`
        )

        if (!response.ok) {

          throw new Error('Unable to load fishes')

        }

        const data = await response.json()

        setFishList(data)

      } catch (error) {

        console.error('Fish search error:', error)

        setFishError(
          'Unable to load fishes'
        )

        setFishList([])

      } finally {

        setFishLoading(false)

      }

    }

    searchFish()

  }, [searchText, selectedFish])


  /* ============================= */
  /* Save Location                  */
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
            'Content-Type': 'application/json',
          },

          body: JSON.stringify({
            account_id: account.id,
            city: city.trim(),
            state: state.trim(),
          }),
        }
      )

      const data = await response.json()

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
        JSON.stringify(updatedAccount)
      )

      setAccount(updatedAccount)

      setCity(updatedAccount.city)
      setState(updatedAccount.state)

      setLocationPopupOpen(false)

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

    <div className="farmer-page">

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

              Your location helps Aqua Nexus provide
              local weather information and improve
              recommendations relevant to your area.

            </p>

            <div className="location-form">

              <label htmlFor="farmer-city">
                City
              </label>

              <input
                type="text"
                id="farmer-city"
                placeholder="Enter your city"
                value={city}
                onChange={(event) => {
                  setCity(event.target.value)
                  setLocationError('')
                }}
              />

              <label htmlFor="farmer-state">
                State
              </label>

              <input
                type="text"
                id="farmer-state"
                placeholder="Enter your state"
                value={state}
                onChange={(event) => {
                  setState(event.target.value)
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
                onClick={handleSaveLocation}
                disabled={locationSaving}
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
      {/* Farmer Header                 */}
      {/* ============================= */}

      <header className="farmer-header">

        <HamburgerMenu
          role="farmer"
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
          onClick={() =>
            setShowNotifications(true)
          }
        >

          🔔

        </button>

      </header>


      {/* ============================= */}
      {/* Main Navigation               */}
      {/* ============================= */}

      <nav className="farmer-navigation">

        <button
          type="button"
          className={`nav-button ${
            activeSection === 'Fish'
              ? 'active'
              : ''
          }`}
          onClick={() =>
            setActiveSection('Fish')
          }
        >

          Fish

        </button>

        <button
          type="button"
          className={`nav-button ${
            activeSection === 'Pond'
              ? 'active'
              : ''
          }`}
          onClick={() =>
            setActiveSection('Pond')
          }
        >

          Pond

        </button>

        <button
          type="button"
          className={`nav-button ${
            activeSection === 'Vendors'
              ? 'active'
              : ''
          }`}
          onClick={() => {
           setSelectedFeed(null)
           setVendorSearchText('')
           setActiveSection('Vendors')
          }}
        >

          Vendors

        </button>

      </nav>


      {/* ============================= */}
      {/* Main Content                  */}
      {/* ============================= */}

      <main className="farmer-content">

        {showNotifications && account ? (

          <Notifications
            accountId={String(account.id)}
            onBack={() =>
              setShowNotifications(false)
            }
          />

        ) : (

          <>

            {/* ============================= */}
            {/* Fish Section                  */}
            {/* ============================= */}

            {activeSection === 'Fish' && (

              <section className="fish-card">

                <h2>
                  Fish
                </h2>

                <div className="fish-search">

                  <span className="search-icon">
                    ⌕
                  </span>

                  <input
                    type="text"
                    placeholder="Search for fish..."
                    value={searchText}
                    onChange={(event) => {
                      setSearchText(event.target.value)
                      setSelectedFish(null)
                      setShowFarmerFeed(false)
                    }}
                  />

                </div>


                {/* Search Results */}

                {searchText &&
                  !selectedFish && (

                    <div className="fish-results">

                      {fishLoading && (
                        <p>
                          Searching...
                        </p>
                      )}

                      {fishError && (
                        <p>
                          {fishError}
                        </p>
                      )}

                      {fishList.map(
                        (fish) => (

                          <button
                            type="button"
                            key={fish.name}
                            className="fish-result"
                            onClick={() => {

                              setSelectedFish(fish)

                              setSearchText(
                                fish.name
                              )

                            }}
                          >

                            {fish.name}

                          </button>

                        )
                      )}

                    </div>

                  )}


                {/* Selected Fish */}

                {selectedFish && !showFarmerFeed && (

                  <div className="fish-details">

                    <button
                      className="fish-back-button"
                      onClick={() => {
                        setSelectedFish(null)
                        setShowFarmerFeed(false)
                      }}
                    >

                      ← Back to Fish

                    </button>


                    <div className="fish-profile">

                      <div className="fish-profile-image">

                        {selectedFish.image && (

                          <img
                            src={selectedFish.image}
                            alt={selectedFish.name}
                          />

                        )}

                      </div>


                      <div className="fish-profile-info">

                        <p className="fish-profile-label">
                          General Information
                        </p>

                        <h2>
                          {selectedFish.name}
                        </h2>

                        <p className="fish-profile-subtitle">

                          Fish species information and general
                          farming requirements.

                        </p>

                      </div>

                    </div>


                    <div className="fish-section-title">

                      <h3>
                        General Details
                      </h3>

                    </div>


                    <div className="fish-info-grid">

                      <div className="fish-info-card">

                        <span>
                          Water Type
                        </span>

                        <strong>
                          {selectedFish.water_type}
                        </strong>

                      </div>


                      <div className="fish-info-card">

                        <span>
                          Feeding Habit
                        </span>

                        <strong>
                          {selectedFish.feeding_habit}
                        </strong>

                      </div>


                      <div className="fish-info-card">

                        <span>
                          Temperature
                        </span>

                        <strong>
                          {selectedFish.temperature_min}°C
                          {' – '}
                          {selectedFish.temperature_max}°C
                        </strong>

                      </div>


                      <div className="fish-info-card">

                        <span>
                          pH Range
                        </span>

                        <strong>
                          {selectedFish.ph_min}
                          {' – '}
                          {selectedFish.ph_max}
                        </strong>

                      </div>


                      <div className="fish-info-card fish-info-card-wide">

                        <span>
                          Culture Period
                        </span>

                        <strong>
                          {selectedFish.culture_period_days} days
                        </strong>

                      </div>

                    </div>


                    <div className="fish-continue-wrapper">

                      <button
                        type="button"
                        className="fish-continue-button"
                        onClick={() =>
                          setShowFarmerFeed(true)
                        }
                      >

                        Continue →

                      </button>

                    </div>

                  </div>

                )}


                {selectedFish && showFarmerFeed && (

                  <FarmerFeed
                    fish={selectedFish}
                    onBack={() =>
                      setShowFarmerFeed(false)
                    }
                    onFeedSelect={(feed) => {
                      setSelectedFeed(feed)
                      setActiveSection('Vendors')
                    }}
                  />

                )}


                {/* Empty State */}

                {!selectedFish && (

                  <>

                    <p className="fish-empty-message">

                      Search for fishes to get results

                    </p>


                    <div className="fish-empty-visual">

                      <div className="search-visual">

                        <span className="search-visual-icon">
                          ⌕
                        </span>

                      </div>

                      <span className="bubble bubble-one"></span>

                      <span className="bubble bubble-two"></span>

                      <span className="bubble bubble-three"></span>

                    </div>

                  </>

                )}

              </section>

            )}


            {/* ============================= */}
            {/* Pond Section                  */}
            {/* ============================= */}

            {activeSection === 'Pond' && (

              <FarmerPond
                 onGoToVendor={(recommendation) =>
                    handleGoToVendor({
                      id: Number(recommendation.id),
                      feed_name: recommendation.feed_name,
                      feed_type: recommendation.feed_type,
                      protein_min: Number(recommendation.protein_min),
                      protein_max: Number(recommendation.protein_max),
                      particle_size_min: Number(recommendation.particle_size_min),
                      particle_size_max: Number(recommendation.particle_size_max),
                    })
                 }
              />

            )}


            {/* ============================= */}
            {/* Vendors Section               */}
            {/* ============================= */}

            {activeSection === 'Vendors' && (

              <FarmerVendor
                selectedFeed={selectedFeed}
                initialSearchText={vendorSearchText}
              />

            )}

          </>

        )}

      </main>


    </div>

  )

}


export default Farmer