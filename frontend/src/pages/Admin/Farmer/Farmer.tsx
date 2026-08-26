import { useEffect, useState } from 'react'
import './Farmer.css'
import AccountManagement from '../../../components/AccountManagement/AccountManagement'


function Farmer() {

  const [managementType, setManagementType] =
    useState<'Farmer' | 'Fishes'>('Farmer')

  const [dropdownOpen, setDropdownOpen] =
    useState(false)

  const [period, setPeriod] =
    useState<
      'Total' |
      'Weekly' |
      'Monthly' |
      'Daily'
    >('Total')

  const [periodDropdownOpen, setPeriodDropdownOpen] =
    useState(false)

  const [farmerCount, setFarmerCount] =
    useState(0)

  const [showFarmerMessage, setShowFarmerMessage] =
    useState(false)

  const [showFarmerAccounts, setShowFarmerAccounts] =
    useState(false)


  /* ============================= */
  /* Get Farmer Count              */
  /* ============================= */

  useEffect(() => {

    fetch(
      `http://127.0.0.1:8000/api/admin/farmer-stats/?period=${period.toLowerCase()}`
    )
      .then((response) => {

        if (!response.ok) {

          throw new Error(
            'Unable to get farmer statistics'
          )

        }

        return response.json()

      })
      .then((data) => {

        setFarmerCount(
          data.farmers
        )

      })
      .catch((error) => {

        console.error(
          'Error getting farmer statistics:',
          error
        )

      })

  }, [period])


  /* ============================= */
  /* Farmer Accounts               */
  /* ============================= */

  if (showFarmerAccounts) {

    return (

      <section className="admin-farmer-card">

        <AccountManagement
           role="farmer"
           onBack={() =>
             setShowFarmerAccounts(false)
           }
        />

      </section>

    )

  }


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

                setManagementType(
                  'Farmer'
                )

                setDropdownOpen(
                  false
                )

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

                setManagementType(
                  'Fishes'
                )

                setDropdownOpen(
                  false
                )

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

          <div className="admin-farmer-header">

            <div>

              <h2>
                Farmer
              </h2>

              <p>
                Manage and monitor farmer activity.
              </p>

            </div>


            {/* ============================= */}
            {/* Period Dropdown                */}
            {/* ============================= */}

            <div className="admin-farmer-period">

              <button
                type="button"
                className="admin-farmer-period-select"
                onClick={() =>
                  setPeriodDropdownOpen(
                    (current) => !current
                  )
                }
                aria-haspopup="true"
                aria-expanded={
                  periodDropdownOpen
                }
              >

                <span>
                  {period}
                </span>

                <span>

                  {periodDropdownOpen
                    ? '▴'
                    : '▾'}

                </span>

              </button>


              {periodDropdownOpen && (

                <div className="admin-farmer-period-options">

                  <button
                    type="button"
                    onClick={() => {

                      setPeriod(
                        'Total'
                      )

                      setPeriodDropdownOpen(
                        false
                      )

                    }}
                  >
                    Total
                  </button>


                  <button
                    type="button"
                    onClick={() => {

                      setPeriod(
                        'Weekly'
                      )

                      setPeriodDropdownOpen(
                        false
                      )

                    }}
                  >
                    Weekly
                  </button>


                  <button
                    type="button"
                    onClick={() => {

                      setPeriod(
                        'Monthly'
                      )

                      setPeriodDropdownOpen(
                        false
                      )

                    }}
                  >
                    Monthly
                  </button>


                  <button
                    type="button"
                    onClick={() => {

                      setPeriod(
                        'Daily'
                      )

                      setPeriodDropdownOpen(
                        false
                      )

                    }}
                  >
                    Daily
                  </button>

                </div>

              )}

            </div>

          </div>


          {/* ============================= */}
          {/* Statistics                     */}
          {/* ============================= */}

          <div className="admin-farmer-stats">


            {/* ============================= */}
            {/* Farmers                        */}
            {/* ============================= */}

            <div
              className="admin-farmer-stat-card"

              onMouseEnter={() =>
                setShowFarmerMessage(
                  true
                )
              }

              onMouseLeave={() =>
                setShowFarmerMessage(
                  false
                )
              }

              onDoubleClick={() =>
                setShowFarmerAccounts(
                  true
                )
              }

            >

              {/* ============================= */}
              {/* Hover Message                  */}
              {/* ============================= */}

              {showFarmerMessage && (

                <div className="admin-farmer-hover-message">

                  Double tap to reach Farmer management.

                </div>

              )}


              <span className="admin-farmer-stat-icon">

                ♙

              </span>


              <span className="admin-farmer-stat-title">

                Farmers

              </span>


              <strong>

                {farmerCount}

              </strong>

            </div>


            {/* ============================= */}
            {/* Orders                         */}
            {/* ============================= */}

            <div className="admin-farmer-stat-card">

              <span className="admin-farmer-stat-icon">

                ◫

              </span>


              <span className="admin-farmer-stat-title">

                Orders

              </span>


              <strong>

                0

              </strong>

            </div>


            {/* ============================= */}
            {/* Subscriptions                  */}
            {/* ============================= */}

            <div className="admin-farmer-stat-card">

              <span className="admin-farmer-stat-icon">

                ↻

              </span>


              <span className="admin-farmer-stat-title">

                Subscriptions

              </span>


              <strong>

                0

              </strong>

            </div>

          </div>

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