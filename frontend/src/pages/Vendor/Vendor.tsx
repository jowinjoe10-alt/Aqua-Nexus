import { useEffect, useState } from 'react'
import '../Farmer/Farmer.css'
import './Vendor.css'
import Product from './Product/Product'
import HamburgerMenu from '../../components/HamburgerMenu/HamburgerMenu'

type Account = {
  id: number
  name: string
  gmail: string
  role: string
  city: string
  state: string
}

type Order = {
  id: number
  farmer: number
  farmer_name: string
  vendor: number
  vendor_name: string
  product: number
  product_name: string
  brand_name: string
  quantity: number
  unit_price: string
  total_price: string
  status: string
  created_at: string
  updated_at: string
}


function Vendor() {

  const [receivingOrders, setReceivingOrders] =
    useState(true)

  const [receivingSubscriptions, setReceivingSubscriptions] =
    useState(true)

  const [activeSection, setActiveSection] =
    useState('Products')

  const [locationPopupOpen, setLocationPopupOpen] =
    useState(false)

  const [account, setAccount] =
    useState<Account | null>(null)

  const [orders, setOrders] =
  useState<Order[]>([])

const [ordersLoading, setOrdersLoading] =
  useState(false)

const [ordersError, setOrdersError] =
  useState('')

  const [city, setCity] = useState('')
  const [state, setState] = useState('')

  const [locationError, setLocationError] =
    useState('')

  const [locationSaving, setLocationSaving] =
    useState(false)


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
  /* Load Vendor Availability       */
  /* ============================= */

  useEffect(() => {

    if (!account) {
      return
    }

    const loadAvailability = async () => {

      try {

        const response = await fetch(
          `http://127.0.0.1:8000/api/product/vendor-availability/?vendor_id=${account.id}`
        )

        const data = await response.json()

        if (!response.ok) {

          console.error(
            'Unable to load vendor availability:',
            data
          )

          return
        }

        setReceivingOrders(
          data.orders_enabled
        )

        setReceivingSubscriptions(
          data.subscriptions_enabled
        )

      } catch (error) {

        console.error(
          'Availability error:',
          error
        )

      }

    }

    loadAvailability()

  }, [account])

  /* ============================= */
/* Load Vendor Orders             */
/* ============================= */

useEffect(() => {

  if (
    !account ||
    activeSection !== 'Orders'
  ) {
    return
  }

  const loadOrders = async () => {

    setOrdersLoading(true)
    setOrdersError('')

    try {

      const response = await fetch(
        `http://127.0.0.1:8000/api/product/orders/vendor/?vendor_id=${account.id}`
      )

      const data =
        await response.json()

      if (!response.ok) {

        setOrdersError(
          'Failed to load orders.'
        )

        return
      }

      setOrders(data)

    } catch (error) {

      console.error(
        'Vendor orders error:',
        error
      )

      setOrdersError(
        'Unable to connect to the server.'
      )

    } finally {

      setOrdersLoading(false)

    }

  }

  loadOrders()

}, [account, activeSection])
    /* ============================= */
  /* Update Vendor Availability     */
  /* ============================= */

  const updateAvailability = async (
    ordersEnabled: boolean,
    subscriptionsEnabled: boolean
  ) => {

    if (!account) {
      return
    }

    try {

      const response = await fetch(
        'http://127.0.0.1:8000/api/product/vendor-availability/',
        {
          method: 'PUT',

          headers: {
            'Content-Type': 'application/json',
          },

          body: JSON.stringify({
            vendor_id: account.id,
            orders_enabled: ordersEnabled,
            subscriptions_enabled:
              subscriptionsEnabled,
          }),
        }
      )

      const data = await response.json()

      if (!response.ok) {

        console.error(
          'Unable to update vendor availability:',
          data
        )

        return
      }

      setReceivingOrders(
        data.orders_enabled
      )

      setReceivingSubscriptions(
        data.subscriptions_enabled
      )

    } catch (error) {

      console.error(
        'Availability update error:',
        error
      )

    }
  }


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

          <Product />

        )}


        {/* ============================= */}
        {/* Orders Section                */}
        {/* ============================= */}

        {activeSection === 'Orders' && (

          <section className="vendor-section-placeholder">

            <div className="availability-header">

              <div
                className="availability-switch-wrapper"
                title="This will affect receiving orders."
              >

                <span className="availability-label">

                  {receivingOrders
                    ? 'ON'
                    : 'OFF'}

                </span>


                <button
                  type="button"
                  className={`availability-switch ${
                    receivingOrders
                      ? 'on'
                      : 'off'
                  }`}
                  onClick={() =>
                    updateAvailability(
                      !receivingOrders,
                      receivingSubscriptions
                    )
                  }
                  aria-label="Toggle receiving orders"
                >

                  <span className="availability-switch-knob" />

                </button>

              </div>

            </div>


            <div className="section-content">

              <h2>
                Orders
              </h2>


              {ordersLoading && (

                <p>
                  Loading orders...
                </p>

              )}


              {!ordersLoading && ordersError && (

                <p>
                 {ordersError}
                </p>

              )}


              {!ordersLoading &&
                !ordersError &&
                orders.length === 0 && (

                <p>
                  No customer orders yet.
                </p>

              )}

 
              {!ordersLoading &&
                !ordersError &&
                orders.length > 0 && (

                <div className="vendor-orders-list">

                  {orders.map((order) => (

                    <div
                      key={order.id}
                      className="vendor-order-card"
                    >

                      <div className="vendor-order-top">

                        <div>

                          <span className="vendor-order-label">
                            ORDER #{order.id}
                          </span>

                          <h3>
                            {order.product_name}
                          </h3>

                          <p>
                            {order.brand_name}
                          </p>

                        </div>


                        <span
                          className={`vendor-order-status ${order.status}`}
                        >
                          {order.status}
                        </span>

                      </div>


                      <div className="vendor-order-details">

                        <div>

                          <span>
                            Farmer
                          </span>

                          <strong>
                           {order.farmer_name}
                          </strong>

                        </div>


                        <div>

                          <span>
                            Quantity
                          </span>

                          <strong>
                            {order.quantity}
                          </strong>

                        </div>


                        <div>

                          <span>
                            Unit Price
                          </span>

                          <strong>
                            ₹{order.unit_price}
                          </strong>

                        </div>


                        <div>

                          <span>
                            Total
                          </span>

                          <strong>
                            ₹{order.total_price}
                          </strong>

                        </div>

                      </div>


                      <div className="vendor-order-date">

                        Ordered on:{' '}

                        {new Date(
                          order.created_at
                        ).toLocaleString()}

                      </div>


                      {order.status === 'pending' && (

                        <div className="vendor-order-actions">

                          <button
                            type="button"
                            className="vendor-order-accept"
                          >
                            Accept
                          </button>


                          <button
                            type="button"
                            className="vendor-order-decline"
                          >
                            Decline
                          </button>

                        </div>

                      )}

                    </div>

                  ))}

                </div>

              )}

            </div>

          </section>

        )}

        {/* ============================= */}
        {/* Subscriptions Section         */}
        {/* ============================= */}

        {activeSection === 'Subscriptions' && (

          <section className="vendor-section-placeholder">

            <div className="availability-header">

              <div
                className="availability-switch-wrapper"
                title="This will affect receiving orders and subscriptions."
              >

                <span className="availability-label">

                  {receivingSubscriptions
                    ? 'ON'
                    : 'OFF'}

                </span>


                <button
                  type="button"
                  className={`availability-switch ${
                    receivingSubscriptions
                      ? 'on'
                      : 'off'
                  }`}
                  onClick={() =>
                    updateAvailability(
                      receivingOrders,
                      !receivingSubscriptions
                    )
                  }
                  aria-label="Toggle receiving orders and subscriptions"
                >

                  <span className="availability-switch-knob" />

                </button>

              </div>

            </div>


            <div className="section-content">

              <h2>
                Subscriptions
              </h2>

              <p>
                Your active feed subscriptions
                will appear here.
              </p>

            </div>

          </section>

        )}

      </main>

    </div>

  )
}

export default Vendor