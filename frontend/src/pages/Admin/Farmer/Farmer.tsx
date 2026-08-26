import { useState } from 'react'
import './Farmer.css'

function Farmer() {

  const [managementType, setManagementType] =
    useState<'Farmer' | 'Fishes'>('Farmer')

  const [dropdownOpen, setDropdownOpen] =
    useState(false)

  return (

    <section className="admin-farmer-card">

      {/* ============================= */}
      {/* Management Dropdown            */}
      {/* ============================= */}

      <div className="admin-farmer-switcher">

        <button
          type="button"
          className="admin-farmer-select"
          onClick={() =>
            setDropdownOpen(
              (current) => !current
            )
          }
          aria-haspopup="true"
          aria-expanded={dropdownOpen}
        >

          <span>
            {managementType}
          </span>

          <span className="admin-farmer-arrow">
            {dropdownOpen
              ? '▴'
              : '▾'}
          </span>

        </button>


        {dropdownOpen && (

          <div className="admin-farmer-options">

            <button
              type="button"
              className={
                managementType === 'Farmer'
                  ? 'selected'
                  : ''
              }
              onClick={() => {

                setManagementType('Farmer')
                setDropdownOpen(false)

              }}
            >
              Farmer
            </button>


            <button
              type="button"
              className={
                managementType === 'Fishes'
                  ? 'selected'
                  : ''
              }
              onClick={() => {

                setManagementType('Fishes')
                setDropdownOpen(false)

              }}
            >
              Fishes
            </button>

          </div>

        )}

      </div>


      {/* ============================= */}
      {/* Farmer Management              */}
      {/* ============================= */}

      {managementType === 'Farmer' && (

        <div className="admin-farmer-content">

          <h2>
            Farmer
          </h2>

          <p>
            Farmer management will appear here.
          </p>

        </div>

      )}


      {/* ============================= */}
      {/* Fish Management                */}
      {/* ============================= */}

      {managementType === 'Fishes' && (

        <div className="admin-farmer-content">

          <h2>
            Fishes
          </h2>

          <p>
            Fish master data management will appear here.
          </p>

        </div>

      )}

    </section>

  )
}

export default Farmer