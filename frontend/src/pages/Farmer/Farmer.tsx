import { useEffect, useState } from 'react'
import './Farmer.css'
import HamburgerMenu from '../../components/HamburgerMenu/HamburgerMenu'

type Fish = {
  name: string
  scientificName: string
  description: string
  habitat: string
}

type Account = {
  id: number
  name: string
  gmail: string
  role: string
  city: string
  state: string
}

const fishList: Fish[] = [
  {
    name: 'Tilapia',
    scientificName: 'Oreochromis niloticus',
    description:
      'A freshwater fish commonly cultivated in aquaculture.',
    habitat: 'Freshwater',
  },
  {
    name: 'Rohu',
    scientificName: 'Labeo rohita',
    description:
      'A freshwater carp widely cultivated in South Asia.',
    habitat: 'Freshwater',
  },
  {
    name: 'Catla',
    scientificName: 'Catla catla',
    description:
      'A major freshwater carp commonly cultivated in South Asia.',
    habitat: 'Freshwater',
  },
]

function Farmer() {
  const [activeSection, setActiveSection] = useState('Fish')

  const [searchText, setSearchText] = useState('')

  const [selectedFish, setSelectedFish] =
    useState<Fish | null>(null)

  const [locationPopupOpen, setLocationPopupOpen] =
    useState(false)

  const [account, setAccount] =
    useState<Account | null>(null)

  const [city, setCity] = useState('')

  const [state, setState] = useState('')

  const [locationError, setLocationError] =
    useState('')

  const [locationSaving, setLocationSaving] =
    useState(false)

  const searchResults = fishList.filter((fish) =>
    fish.name
      .toLowerCase()
      .includes(searchText.toLowerCase())
  )

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
          onClick={() =>
            setActiveSection('Vendors')
          }
        >
          Vendors
        </button>

      </nav>

      {/* ============================= */}
      {/* Main Content                  */}
      {/* ============================= */}

      <main className="farmer-content">

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
                  setSearchText(
                    event.target.value
                  )

                  setSelectedFish(null)
                }}
              />

            </div>

            {/* Search Results */}

            {searchText &&
              !selectedFish && (

                <div className="fish-results">

                  {searchResults.map(
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

            {selectedFish && (

              <div className="fish-details">

                <h3>
                  {selectedFish.name}
                </h3>

                <p>
                  <strong>
                    Scientific Name:
                  </strong>{' '}

                  {selectedFish.scientificName}
                </p>

                <p>
                  <strong>
                    Habitat:
                  </strong>{' '}

                  {selectedFish.habitat}
                </p>

                <p>
                  {selectedFish.description}
                </p>

              </div>

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

          <section className="section-placeholder">

            <h2>
              Pond
            </h2>

          </section>

        )}

        {/* ============================= */}
        {/* Vendors Section               */}
        {/* ============================= */}

        {activeSection === 'Vendors' && (

          <section className="section-placeholder">

            <h2>
              Vendors
            </h2>

          </section>

        )}

      </main>

    </div>
  )
}

export default Farmer