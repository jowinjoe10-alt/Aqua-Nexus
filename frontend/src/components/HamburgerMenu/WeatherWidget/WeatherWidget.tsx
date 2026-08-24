import { useEffect, useState } from 'react'
import './WeatherWidget.css'

type WeatherWidgetProps = {
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

function WeatherWidget({
  city,
  state,
}: WeatherWidgetProps) {

  const [weather, setWeather] =
    useState<WeatherData | null>(null)

  const [weatherLoading, setWeatherLoading] =
    useState(false)

  const [weatherError, setWeatherError] =
    useState('')

  useEffect(() => {

    if (
      !city.trim() ||
      !state.trim()
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

        const cityName = city.trim()
        const stateName = state.trim()

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

  }, [city, state])

  const weatherDisplay =
    weather
      ? getWeatherDisplay(
          weather.weatherCode,
          weather.isDay
        )
      : null

  return (
    <div className="menu-widget weather-widget">

      <span className="menu-widget-title">
        WEATHER
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
              {city && state
                ? `${city}, ${state}`
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
              {city}, {state}
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
              {city && state
                ? `${city}, ${state}`
                : 'Location unavailable'}
            </div>

          </div>

        </div>

      )}

    </div>
  )
}

export default WeatherWidget