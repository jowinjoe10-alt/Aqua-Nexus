import { useEffect, useState } from 'react'

import './FarmerOrders.css'


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


function FarmerOrders() {

  const [orders, setOrders] =
    useState<Order[]>([])

  const [loading, setLoading] =
    useState(true)

  const [error, setError] =
    useState('')


  useEffect(() => {

    const loadOrders = async () => {

      try {

        const storedAccount =
          localStorage.getItem(
            'aquaNexusAccount'
          )

        if (!storedAccount) {

          setError(
            'Farmer account not found.'
          )

          setLoading(false)

          return
        }


        const account =
          JSON.parse(storedAccount)


        const response = await fetch(
          `http://127.0.0.1:8000/api/product/orders/farmer/?farmer_id=${account.id}`
        )


        const data =
          await response.json()


        if (!response.ok) {

          setError(
            'Failed to load orders.'
          )

          setLoading(false)

          return
        }


        setOrders(data)

      } catch (error) {

        console.error(
          'Orders error:',
          error
        )

        setError(
          'Unable to connect to the server.'
        )

      } finally {

        setLoading(false)

      }

    }


    loadOrders()

  }, [])


  return (

    <div className="farmer-orders-page">

      <div className="farmer-orders-container">

        <div className="farmer-orders-header">

          <span>
            AQUA NEXUS
          </span>

          <h1>
            My Orders
          </h1>

          <p>
            View your feed orders and their current status.
          </p>

        </div>


        {loading && (

          <div className="farmer-orders-message">

            Loading orders...

          </div>

        )}


        {!loading && error && (

          <div className="farmer-orders-message">

            {error}

          </div>

        )}


        {!loading &&
          !error &&
          orders.length === 0 && (

          <div className="farmer-orders-message">

            No orders found.

          </div>

        )}


        {!loading &&
          !error &&
          orders.length > 0 && (

          <div className="farmer-orders-list">

            {orders.map((order) => (

              <div
                key={order.id}
                className="farmer-order-card"
              >

                <div className="farmer-order-top">

                  <div>

                    <span className="farmer-order-label">
                      ORDER #{order.id}
                    </span>

                    <h2>
                      {order.product_name}
                    </h2>

                    <p>
                      {order.brand_name}
                    </p>

                  </div>


                  <span
                    className={`farmer-order-status ${order.status}`}
                  >
                    {order.status}
                  </span>

                </div>


                <div className="farmer-order-details">

                  <div>

                    <span>
                      Vendor
                    </span>

                    <strong>
                      {order.vendor_name}
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


                <div className="farmer-order-date">

                  Ordered on:{' '}

                  {new Date(
                    order.created_at
                  ).toLocaleString()}

                </div>

              </div>

            ))}

          </div>

        )}

      </div>

    </div>

  )

}


export default FarmerOrders