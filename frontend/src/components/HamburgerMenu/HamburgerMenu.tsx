import { useState } from 'react'
import DateTimeWidget from './DateTimeWidget/DateTimeWidget'
import WeatherWidget from './WeatherWidget/WeatherWidget'
import MenuItems from './MenuItems/MenuItems'
import './HamburgerMenu.css'

type HamburgerMenuProps = {
  role: 'farmer' | 'vendor' | 'admin'
  city: string
  state: string
  onAdminSectionChange?: (
    section: 'Farmer' | 'Vendor' | 'Admin'
  ) => void
}

function HamburgerMenu({
  role,
  city,
  state,
  onAdminSectionChange,
}: HamburgerMenuProps) {

  const [menuOpen, setMenuOpen] =
    useState(false)

  const handleAdminSectionChange = (
    section: 'Farmer' | 'Vendor' | 'Admin'
  ) => {

    if (onAdminSectionChange) {
      onAdminSectionChange(section)
    }

    setMenuOpen(false)
  }

  return (
    <>
      <button
        type="button"
        className="menu-button"
        onClick={() => setMenuOpen(true)}
        aria-label="Open menu"
      >
        ☰
      </button>

      {menuOpen && (
        <div
          className="menu-overlay"
          onClick={() => setMenuOpen(false)}
        ></div>
      )}

      {menuOpen && (
        <aside className="side-menu">

          <button
            type="button"
            className="side-menu-close"
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
          >
            ×
          </button>

          <div className="side-menu-widgets">

            <DateTimeWidget />

            <WeatherWidget
              city={city}
              state={state}
            />

          </div>

          <MenuItems
            role={role}
            onAdminSectionChange={
              handleAdminSectionChange
            }
          />

        </aside>
      )}
    </>
  )
}

export default HamburgerMenu