import { useEffect, useState } from 'react'
import '../Farmer/Farmer.css'
import './Vendor.css'
import HamburgerMenu from '../../components/HamburgerMenu/HamburgerMenu'

type Product = {
  name: string
  description: string
  organic: boolean
}

type Account = {
  id: number
  name: string
  gmail: string
  role: string
  city: string
  state: string
}

const productList: Product[] = [
  {
    name: 'Organic Tilapia Feed',
    description:
      'Feed suitable for Tilapia farming.',
    organic: true,
  },
  {
    name: 'Floating Fish Feed',
    description:
      'General floating feed for freshwater fish.',
    organic: false,
  },
  {
    name: 'Premium Growth Feed',
    description:
      'Feed designed to support fish growth.',
    organic: false,
  },
]

function Vendor() {
  const [activeSection, setActiveSection] =
    useState('Products')

  const [searchText, setSearchText] =
    useState('')

  const [selectedProduct, setSelectedProduct] =
    useState<Product | null>(null)

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

  const searchResults = productList.filter(
    (product) =>
      product.name
        .toLowerCase()
        .includes(searchText.toLowerCase())
  )

  /* ============================= */
  /* Load Account                   */
  /* ============================= */

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

      setCity(parsedAccount.city || '')
      setState(parsedAccount.state || '')

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

  /* ============================= */
  /* Save Location                  */
  /* ============================= */

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

  return (
    <div className="vendor-page">

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
              Your location helps Aqua Nexus
              provide local information and
              connect you with nearby customers.
            </p>

            <div className="location-form">

              <label htmlFor="vendor-city">
                City
              </label>

              <input
                type="text"
                id="vendor-city"
                placeholder="Enter your city"
                value={city}
                onChange={(event) => {
                  setCity(event.target.value)
                  setLocationError('')
                }}
              />

              <label htmlFor="vendor-state">
                State
              </label>

              <input
                type="text"
                id="vendor-state"
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
      {/* Vendor Header                 */}
      {/* ============================= */}

      <header className="vendor-header">

        <HamburgerMenu
          role="vendor"
          city={city}
          state={state}
        />

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

      <nav className="vendor-navigation">

        <button
          type="button"
          className={`nav-button ${
            activeSection === 'Products'
              ? 'active'
              : ''
          }`}
          onClick={() =>
            setActiveSection('Products')
          }
        >
          Products
        </button>

        <button
          type="button"
          className={`nav-button ${
            activeSection === 'Orders'
              ? 'active'
              : ''
          }`}
          onClick={() =>
            setActiveSection('Orders')
          }
        >
          Orders
        </button>

        <button
          type="button"
          className={`nav-button ${
            activeSection === 'Subscriptions'
              ? 'active'
              : ''
          }`}
          onClick={() =>
            setActiveSection('Subscriptions')
          }
        >
          Subscriptions
        </button>

      </nav>

      {/* ============================= */}
      {/* Main Content                  */}
      {/* ============================= */}

      <main className="vendor-content">

        {/* ============================= */}
        {/* Products Section              */}
        {/* ============================= */}

        {activeSection === 'Products' && (

          <section className="vendor-products-card">

            <h2>
              Products
            </h2>

            {/* Product Search */}

            <div className="vendor-search">

              <span className="search-icon">
                ⌕
              </span>

              <input
                type="text"
                placeholder="Search for products..."
                value={searchText}
                onChange={(event) => {
                  setSearchText(
                    event.target.value
                  )

                  setSelectedProduct(null)
                }}
              />

            </div>

            {/* Search Results */}

            {searchText &&
              !selectedProduct && (

                <div className="product-results">

                  {searchResults.length > 0 ? (

                    searchResults.map(
                      (product) => (

                        <button
                          type="button"
                          key={product.name}
                          className="product-result"
                          onClick={() => {

                            setSelectedProduct(
                              product
                            )

                            setSearchText(
                              product.name
                            )

                          }}
                        >
                          {product.name}
                        </button>

                      )
                    )

                  ) : (

                    <p className="product-no-result">
                      No products found.
                    </p>

                  )}

                </div>

              )}

            {/* Selected Product */}

            {selectedProduct && (

              <div className="product-details">

                <h3>
                  {selectedProduct.name}
                </h3>

                <p>
                  {selectedProduct.description}
                </p>

                <p>
                  <strong>
                    Organic:
                  </strong>{' '}

                  {selectedProduct.organic
                    ? 'Yes'
                    : 'No'}
                </p>

                <button
                  type="button"
                  className="manage-product-button"
                >
                  Manage Product
                </button>

              </div>

            )}

            {/* Empty State */}

            {!selectedProduct && !searchText && (

              <>

                <p className="vendor-empty-message">
                  Search for products to manage
                  your feed inventory
                </p>

                <div className="vendor-empty-visual">

                  <div className="product-visual">
                    📦
                  </div>

                </div>

              </>

            )}

            {/* Add Product */}

            <button
              type="button"
              className="add-product-button"
            >
              + Add Product
            </button>

          </section>

        )}

        {/* ============================= */}
        {/* Orders Section                */}
        {/* ============================= */}

        {activeSection === 'Orders' && (

          <section className="vendor-section-placeholder">

            <h2>
              Orders
            </h2>

            <p>
              Your customer orders will appear here.
            </p>

          </section>

        )}

        {/* ============================= */}
        {/* Subscriptions Section         */}
        {/* ============================= */}

        {activeSection === 'Subscriptions' && (

          <section className="vendor-section-placeholder">

            <h2>
              Subscriptions
            </h2>

            <p>
              Your active feed subscriptions
              will appear here.
            </p>

          </section>

        )}

      </main>

    </div>
  )
}

export default Vendor