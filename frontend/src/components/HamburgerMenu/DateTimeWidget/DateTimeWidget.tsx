import { useEffect, useState } from 'react'
import './DateTimeWidget.css'

function DateTimeWidget() {
  const [currentDate, setCurrentDate] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDate(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const dayName = currentDate.toLocaleDateString(
    'en-IN',
    {
      weekday: 'long',
    }
  )

  const formattedDate = currentDate.toLocaleDateString(
    'en-IN',
    {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }
  )

  const formattedTime = currentDate.toLocaleTimeString(
    'en-IN',
    {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }
  )

  return (
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
  )
}

export default DateTimeWidget