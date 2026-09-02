import { useState } from 'react'
import './FarmerVendor.css'


function FarmerVendor() {

  const [searchText, setSearchText] = useState('')

  const [sortOption, setSortOption] =
    useState('')


  return (

    <section className="farmer-vendor">

      {/* ============================= */}
      {/* Vendor Header                 */}
      {/* ============================= */}

      <div className="farmer-vendor-header">

        <h2>
          Vendors
        </h2>

      </div>


      {/* ============================= */}
      {/* Search and Sort               */}
      {/* ============================= */}

      <div className="farmer-vendor-controls">

        <div className="farmer-vendor-search">

          <span className="farmer-vendor-search-icon">
            ⌕
          </span>

          <input
            type="text"
            placeholder="Search by feed name / vendor name"
            value={searchText}
            onChange={(event) =>
              setSearchText(event.target.value)
            }
          />

        </div>


        <div className="farmer-vendor-sort">

          <label htmlFor="vendor-sort">
            Sort
          </label>

          <select
            id="vendor-sort"
            value={sortOption}
            onChange={(event) =>
              setSortOption(event.target.value)
            }
          >

            <option value="">
              Sort
            </option>

            <option value="low-to-high">
              Price low to high
            </option>

            <option value="high-to-low">
              Price high to low
            </option>

          </select>

        </div>

      </div>


      {/* ============================= */}
      {/* Vendor Content                 */}
      {/* ============================= */}

      <div className="farmer-vendor-content">

        <p className="farmer-vendor-empty-message">

          Search for a feed or vendor to see
          available products.

        </p>

      </div>

    </section>

  )

}


export default FarmerVendor