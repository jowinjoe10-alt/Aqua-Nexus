import { useState } from 'react'
import './Vendor.css'

type VendorManagementType =
  | 'Vendor'
  | 'Products'

function Vendor() {

  const [managementType, setManagementType] =
    useState<VendorManagementType>('Vendor')

  const [dropdownOpen, setDropdownOpen] =
    useState(false)


  const handleSelect = (
    type: VendorManagementType
  ) => {

    setManagementType(type)

    setDropdownOpen(false)

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

            {/* Vendor */}

            <button
              type="button"
              className={
                managementType === 'Vendor'
                  ? 'selected'
                  : ''
              }
              onClick={() =>
                handleSelect('Vendor')
              }
            >
              Vendor
            </button>


            {/* Products */}

            <button
              type="button"
              className={
                managementType === 'Products'
                  ? 'selected'
                  : ''
              }
              onClick={() =>
                handleSelect('Products')
              }
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

          <h2>
            Vendor
          </h2>

          <p>
            Vendor management will appear here.
          </p>

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