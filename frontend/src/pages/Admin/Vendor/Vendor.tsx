import { useEffect, useState } from 'react'
import './Vendor.css'
import AccountManagement from '../../../components/AccountManagement/AccountManagement'


type VendorManagementType =
  'Vendor' |
  'Products'


function Vendor() {

  const [managementType, setManagementType] =
    useState<VendorManagementType>('Vendor')

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

  const [vendorCount, setVendorCount] =
    useState(0)

  const [showVendorMessage, setShowVendorMessage] =
    useState(false)

  const [showVendorAccounts, setShowVendorAccounts] =
    useState(false)


  /* ============================= */
  /* Get Vendor Count              */
  /* ============================= */

  useEffect(() => {

    fetch(
      `http://127.0.0.1:8000/api/admin/vendor-stats/?period=${period.toLowerCase()}`
    )
      .then((response) => {

        if (!response.ok) {

          throw new Error(
            'Unable to get vendor statistics'
          )

        }

        return response.json()

      })
      .then((data) => {

        setVendorCount(
          data.vendors
        )

      })
      .catch((error) => {

        console.error(
          'Error getting vendor statistics:',
          error
        )

      })

  }, [period])


  /* ============================= */
  /* Vendor Accounts               */
  /* ============================= */

  if (showVendorAccounts) {

    return (

      <section className="admin-vendor-card">

        <AccountManagement
          role="vendor"
          onBack={() =>
             setShowVendorAccounts(false)
          }
        />

      </section>

    )

  }


  return (

    <section className="admin-vendor-card">


      {/* ============================= */}
      {/* Vendor / Products Switcher    */}
      {/* ============================= */}

      <div className="admin-vendor-switcher">

        <button
          type="button"
          className="admin-vendor-select"
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

          <span className="admin-vendor-arrow">

            {dropdownOpen
              ? '▴'
              : '▾'}

          </span>

        </button>


        {dropdownOpen && (

          <div className="admin-vendor-options">


            {/* ============================= */}
            {/* Vendor                         */}
            {/* ============================= */}

            <button
              type="button"
              className={
                managementType === 'Vendor'
                  ? 'selected'
                  : ''
              }
              onClick={() => {

                setManagementType(
                  'Vendor'
                )

                setDropdownOpen(
                  false
                )

              }}
            >
              Vendor
            </button>


            {/* ============================= */}
            {/* Products                       */}
            {/* ============================= */}

            <button
              type="button"
              className={
                managementType === 'Products'
                  ? 'selected'
                  : ''
              }
              onClick={() => {

                setManagementType(
                  'Products'
                )

                setDropdownOpen(
                  false
                )

              }}
            >
              Products
            </button>

          </div>

        )}

      </div>


      {/* ============================= */}
      {/* Vendor Management             */}
      {/* ============================= */}

      {managementType === 'Vendor' && (

        <div className="admin-vendor-content">


          <div className="admin-vendor-header">

            <div>

              <h2>
                Vendor
              </h2>

              <p>
                Manage and monitor vendor activity.
              </p>

            </div>


            {/* ============================= */}
            {/* Period Dropdown                */}
            {/* ============================= */}

            <div className="admin-vendor-period">

              <button
                type="button"
                className="admin-vendor-period-select"
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

                <div className="admin-vendor-period-options">


                  {/* ============================= */}
                  {/* Total                          */}
                  {/* ============================= */}

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


                  {/* ============================= */}
                  {/* Weekly                         */}
                  {/* ============================= */}

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


                  {/* ============================= */}
                  {/* Monthly                        */}
                  {/* ============================= */}

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


                  {/* ============================= */}
                  {/* Daily                          */}
                  {/* ============================= */}

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

          <div className="admin-vendor-stats">


            {/* ============================= */}
            {/* Vendors                        */}
            {/* ============================= */}

            <div
              className="admin-vendor-stat-card"

              onMouseEnter={() =>
                setShowVendorMessage(
                  true
                )
              }

              onMouseLeave={() =>
                setShowVendorMessage(
                  false
                )
              }

              onDoubleClick={() =>
                setShowVendorAccounts(
                  true
                )
              }

            >


              {/* ============================= */}
              {/* Hover Message                  */}
              {/* ============================= */}

              {showVendorMessage && (

                <div className="admin-vendor-hover-message">

                  Double tap to reach Vendor management.

                </div>

              )}


              <span className="admin-vendor-stat-icon">

                ♙

              </span>


              <span className="admin-vendor-stat-title">

                Vendors

              </span>


              <strong>

                {vendorCount}

              </strong>

            </div>


            {/* ============================= */}
            {/* Orders                         */}
            {/* ============================= */}

            <div className="admin-vendor-stat-card">

              <span className="admin-vendor-stat-icon">

                ◫

              </span>


              <span className="admin-vendor-stat-title">

                Orders

              </span>


              <strong>

                0

              </strong>

            </div>


            {/* ============================= */}
            {/* Subscriptions                  */}
            {/* ============================= */}

            <div className="admin-vendor-stat-card">

              <span className="admin-vendor-stat-icon">

                ↻

              </span>


              <span className="admin-vendor-stat-title">

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
      {/* Product Management             */}
      {/* ============================= */}

      {managementType === 'Products' && (

        <div className="admin-vendor-content">

          <h2>
            Products
          </h2>

          <p>
            Product master data management
            will appear here.
          </p>

        </div>

      )}

    </section>

  )
}


export default Vendor