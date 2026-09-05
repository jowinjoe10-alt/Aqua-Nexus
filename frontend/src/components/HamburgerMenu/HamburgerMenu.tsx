import { useState } from 'react'

import DateTimeWidget from './DateTimeWidget/DateTimeWidget'
import WeatherWidget from './WeatherWidget/WeatherWidget'
import MenuItems from './MenuItems/MenuItems'
import Chat from './Chat/Chat'

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


  const [showChat, setShowChat] =
    useState(false)


  /* ============================= */
  /* Admin Section                 */
  /* ============================= */

  const handleAdminSectionChange = (
    section: 'Farmer' | 'Vendor' | 'Admin'
  ) => {

    if (onAdminSectionChange) {

      onAdminSectionChange(
        section
      )

    }

    setMenuOpen(false)

  }


  /* ============================= */
  /* Chat                          */
  /* ============================= */

  const handleChatSelect = () => {

    setShowChat(true)

    setMenuOpen(false)

  }


  /* ============================= */
  /* Close Chat                    */
  /* ============================= */

  const handleChatClose = () => {

    setShowChat(false)

  }


  return (

    <>


      {/* ================================= */}
      {/* Hamburger Button                  */}
      {/* ================================= */}

      <button
        type="button"
        className="menu-button"
        onClick={() => setMenuOpen(true)}
        aria-label="Open menu"
      >
        ☰
      </button>


      {/* ================================= */}
      {/* Menu Overlay                      */}
      {/* ================================= */}

      {menuOpen && (

        <div
          className="menu-overlay"
          onClick={() => setMenuOpen(false)}
        ></div>

      )}


      {/* ================================= */}
      {/* Side Menu                         */}
      {/* ================================= */}

      {menuOpen && (

        <aside className="side-menu">


          <button
            type="button"
            className="side-menu-close"
            onClick={() =>
              setMenuOpen(false)
            }
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

            onChatSelect={
              handleChatSelect
            }

            onAdminSectionChange={
              handleAdminSectionChange
            }
          />


        </aside>

      )}


      {/* ================================= */}
      {/* Farmer / Vendor Chat              */}
      {/* ================================= */}

      {showChat &&
        (
          role === 'farmer' ||
          role === 'vendor'
        ) && (

        <div className="chat-screen">


          <button
            type="button"
            className="chat-close-button"
            onClick={
              handleChatClose
            }
            aria-label="Close chat"
          >
            ×
          </button>


          <Chat
            role={role}
          />


        </div>

      )}


      {/* ================================= */}
      {/* Admin Chat                        */}
      {/* ================================= */}

      {showChat &&
        role === 'admin' && (

        <div className="chat-screen">


          <button
            type="button"
            className="chat-close-button"
            onClick={
              handleChatClose
            }
            aria-label="Close chat"
          >
            ×
          </button>


          <div className="chat-container">


            <div className="chat-header">

              <span className="chat-eyebrow">
                AQUA NEXUS
              </span>


              <h2>
                Admin Chat
              </h2>


              <p>
                Admin chat functionality will be
                connected separately.
              </p>

            </div>


          </div>


        </div>

      )}


    </>

  )

}


export default HamburgerMenu