import { useEffect, useState } from 'react'
import './Farmer.css'
import { useNavigate } from 'react-router-dom'

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

type WeatherData = {
  temperature: number
  apparentTemperature: number
  humidity: number
  windSpeed: number
  weatherCode: number
  isDay: number
}

type WeatherDisplay = {
  icon: string
  condition: string
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



function getWeatherDisplay(
  weatherCode: number,
  isDay: number
): WeatherDisplay {

  if (weatherCode === 0) {
    return {
      icon: isDay ? '☀️' : '🌙',
      condition: isDay ? 'Clear sky' : 'Clear night',
    }
  }

  if (weatherCode === 1) {
    return {
      icon: isDay ? '🌤️' : '🌙',
      condition: 'Mainly clear',
    }
  }

  if (weatherCode === 2) {
    return {
      icon: '⛅',
      condition: 'Partly cloudy',
    }
  }

  if (weatherCode === 3) {
    return {
      icon: '☁️',
      condition: 'Overcast',
    }
  }

  if (weatherCode === 45 || weatherCode === 48) {
    return {
      icon: '🌫️',
      condition: 'Fog',
    }
  }

  if (
    weatherCode === 51 ||
    weatherCode === 53 ||
    weatherCode === 55
  ) {
    return {
      icon: '🌦️',
      condition: 'Drizzle',
    }
  }

  if (
    weatherCode === 56 ||
    weatherCode === 57
  ) {
    return {
      icon: '🌧️',
      condition: 'Freezing drizzle',
    }
  }

  if (
    weatherCode === 61 ||
    weatherCode === 63 ||
    weatherCode === 65
  ) {
    return {
      icon: '🌧️',
      condition: 'Rain',
    }
  }

  if (
    weatherCode === 66 ||
    weatherCode === 67
  ) {
    return {
      icon: '🌧️',
      condition: 'Freezing rain',
    }
  }

  if (
    weatherCode === 71 ||
    weatherCode === 73 ||
    weatherCode === 75 ||
    weatherCode === 77
  ) {
    return {
      icon: '❄️',
      condition: 'Snow',
    }
  }

  if (
    weatherCode === 80 ||
    weatherCode === 81 ||
    weatherCode === 82
  ) {
    return {
      icon: '🌦️',
      condition: 'Rain showers',
    }
  }

  if (
    weatherCode === 85 ||
    weatherCode === 86
  ) {
    return {
      icon: '🌨️',
      condition: 'Snow showers',
    }
  }

  if (
    weatherCode === 95 ||
    weatherCode === 96 ||
    weatherCode === 99
  ) {
    return {
      icon: '⛈️',
      condition: 'Thunderstorm',
    }
  }

  return {
    icon: '🌤️',
    condition: 'Current weather',
  }
}


function Farmer() {

  const navigate = useNavigate()

  const [activeSection, setActiveSection] = useState('Fish')

  const [searchText, setSearchText] = useState('')

  const [selectedFish, setSelectedFish] =
    useState<Fish | null>(null)

  const [menuOpen, setMenuOpen] = useState(false)

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

  const [currentDate, setCurrentDate] =
    useState(new Date())

  const [weather, setWeather] =
    useState<WeatherData | null>(null)

  const [weatherLoading, setWeatherLoading] =
    useState(false)

  const [weatherError, setWeatherError] =
    useState('')

  const searchResults = fishList.filter((fish) =>
    fish.name
      .toLowerCase()
      .includes(searchText.toLowerCase())
  )

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

    const timer = setInterval(() => {
      setCurrentDate(new Date())
    }, 1000)

    return () => clearInterval(timer)

  }, [])

  useEffect(() => {
    if (
      !account?.city?.trim() ||
      !account?.state?.trim()
    ) {
      setWeather(null)
      setWeatherError('')
      return
    }

    let cancelled = false

    const fetchWeather = async () => {
      setWeatherLoading(true)
      setWeatherError('')

      try {

        const cityName = account.city.trim()
        const stateName = account.state.trim()

        const geocodingUrl =
          `https://geocoding-api.open-meteo.com/v1/search` +
          `?name=${encodeURIComponent(cityName)}` +
          `&count=10` +
          `&language=en` +
          `&format=json` +
          `&countryCode=IN`

        const geocodingResponse =
          await fetch(geocodingUrl)

        if (!geocodingResponse.ok) {
          throw new Error(
            'Location service is unavailable'
          )
       }

       const geocodingData =
         await geocodingResponse.json()

       if (
         !geocodingData.results ||
         geocodingData.results.length === 0
       ) {
         throw new Error(
           `Could not find ${cityName}`
         )
       }

       const normalizedState =
         stateName
           .toLowerCase()
           .replace(/\s+/g, ' ')
           .trim()

       const matchingLocation =
         geocodingData.results.find(
           (result: {
             admin1?: string
             name?: string
           }) => {

             const resultState =
               result.admin1
                 ?.toLowerCase()
                 .replace(/\s+/g, ' ')
                 .trim()

             return (
               resultState === normalizedState
             )
           }
         ) ||
         geocodingData.results[0]

        if (
         typeof matchingLocation.latitude !== 'number' ||
         typeof matchingLocation.longitude !== 'number'
        ) {
          throw new Error(
            'Location coordinates are unavailable'
          )
        }

        const weatherUrl =
          `https://api.open-meteo.com/v1/forecast` +
          `?latitude=${matchingLocation.latitude}` +
          `&longitude=${matchingLocation.longitude}` +
          `&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,is_day` +
          `&timezone=auto`

        const weatherResponse =
          await fetch(weatherUrl)

        if (!weatherResponse.ok) {
          throw new Error(
            'Weather service is unavailable'
          )
        }

        const weatherData =
          await weatherResponse.json()

        if (
          !weatherData.current ||
          typeof weatherData.current.temperature_2m !== 'number'
        ) {
          throw new Error(
            'Weather data is unavailable'
         )
        }


        if (cancelled) {
          return
        }

        setWeather({
          temperature:
            weatherData.current.temperature_2m,

          apparentTemperature:
            weatherData.current.apparent_temperature,

          humidity:
            weatherData.current.relative_humidity_2m,

          windSpeed:
            weatherData.current.wind_speed_10m,

          weatherCode:
            weatherData.current.weather_code,

          isDay:
            weatherData.current.is_day,
        })

      } catch (error) {

        if (cancelled) {
          return
        }

        console.error(
          'Weather fetch error:',
          error
        )

        setWeather(null)

        if (error instanceof Error) {
          setWeatherError(error.message)
        } else {
          setWeatherError(
            'Unable to load weather'
          )
        }

       } finally {

         if (!cancelled) {
           setWeatherLoading(false)
         }

       }
      }

      fetchWeather()

      const weatherTimer =
       setInterval(
         fetchWeather,
         10 * 60 * 1000
       )


      return () => {
       cancelled = true
       clearInterval(weatherTimer)
      }

    }, [
      account?.city,
      account?.state,
    ])


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


  const dayName =
    currentDate.toLocaleDateString(
      'en-IN',
      {
        weekday: 'long',
      }
    )


  const formattedDate =
    currentDate.toLocaleDateString(
      'en-IN',
      {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      }
    )


  const formattedTime =
    currentDate.toLocaleTimeString(
      'en-IN',
      {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      }
    )




  const weatherDisplay =
    weather
      ? getWeatherDisplay(
          weather.weatherCode,
          weather.isDay
        )
      : null


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
      {/* Hamburger Menu               */}
      {/* ============================= */}

      {menuOpen && (
        <>

          <div
            className="menu-overlay"
            onClick={() =>
              setMenuOpen(false)
            }
          ></div>


          <aside className="side-menu">

            {/* Close Button */}

            <div className="side-menu-header">

              <button
                type="button"
                className="close-menu-button"
                onClick={() =>
                  setMenuOpen(false)
                }
                aria-label="Close menu"
              >
                ×
              </button>

            </div>


            {/* ============================= */}
            {/* Date / Time Widget             */}
            {/* ============================= */}

            <div className="side-menu-widgets">

              <div className="menu-widget date-widget">

                <span className="menu-widget-title">
                  {dayName}
                </span>

                <span className="menu-widget-value">
                  {formattedDate}
                </span>

                <span className="menu-widget-time">
                  {formattedTime}
                </span>

                <span className="menu-widget-subtext">
                  Local time
                </span>

              </div>


              {/* ============================= */}
              {/* Weather Widget                 */}
              {/* ============================= */}

              <div className="menu-widget weather-widget">

                <span className="menu-widget-title">
                  Weather
                </span>


                {weatherLoading && !weather && (

                  <div className="weather-widget-content">

                    <div className="weather-widget-icon">
                      ☁️
                    </div>

                    <div>

                      <div className="weather-widget-temperature">
                        --
                      </div>

                      <div className="weather-widget-condition">
                        Loading weather...
                      </div>

                      <div className="weather-widget-location">
                        {account?.city && account?.state
                          ? `${account.city}, ${account.state}`
                          : 'Location unavailable'}
                      </div>

                    </div>

                  </div>

                )}


                {weather && weatherDisplay && (

                  <div className="weather-widget-content">

                    <div className="weather-widget-icon">
                      {weatherDisplay.icon}
                    </div>

                    <div>

                      <div className="weather-widget-temperature">
                        {Math.round(
                          weather.temperature
                        )}°C
                      </div>

                      <div className="weather-widget-condition">
                        {weatherDisplay.condition}
                      </div>

                      <div className="weather-widget-location">
                        {account?.city}, {account?.state}
                      </div>

                    </div>

                  </div>

                )}


                {!weatherLoading && !weather && (

                  <div className="weather-widget-content">

                    <div className="weather-widget-icon">
                      ⚠️
                    </div>

                    <div>

                      <div className="weather-widget-temperature">
                        --
                      </div>

                      <div className="weather-widget-condition">
                        {weatherError ||
                          'Weather unavailable'}
                      </div>

                      <div className="weather-widget-location">
                        {account?.city && account?.state
                          ? `${account.city}, ${account.state}`
                          : 'Location unavailable'}
                      </div>

                    </div>

                  </div>

                )}

              </div>

            </div>


            {/* ============================= */}
            {/* Menu Navigation               */}
            {/* ============================= */}

            <nav className="side-menu-navigation">

              <button
                type="button"
                className="side-menu-item"
                onClick={() => navigate('/profile')}
              >
                Profile
              </button>

              <button
                type="button"
                className="side-menu-item"
              >
                Chat
              </button>

              <button
                type="button"
                className="side-menu-item"
              >
                Orders
              </button>

              <button
                type="button"
                className="side-menu-item"
              >
                Subscriptions
              </button>


              {/* Sign Out */}

              <button
                type="button"
                className="side-menu-item sign-out"
              >
                Sign Out
              </button>

            </nav>

          </aside>

        </>
      )}


      {/* ============================= */}
      {/* Farmer Header                 */}
      {/* ============================= */}

      <header className="farmer-header">

        <button
          type="button"
          className="menu-button"
          onClick={() =>
            setMenuOpen(
              (current) => !current
            )
          }
          aria-label={
            menuOpen
              ? 'Close menu'
              : 'Open menu'
          }
        >
          {menuOpen ? '×' : '☰'}
        </button>


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