import { useEffect, useState } from 'react'

import './FarmerSubscriptions.css'
import { useNavigate } from 'react-router-dom'


type Subscription = {
  id: number
  farmer: number
  farmer_name: string
  vendor: number
  vendor_name: string
  product: number
  product_name: string
  brand_name: string
  status: string
  created_at: string
  updated_at: string
}


function FarmerSubscriptions() {

  const [subscriptions, setSubscriptions] =
    useState<Subscription[]>([])

  const [loading, setLoading] =
    useState(true)

  const [error, setError] =
    useState('')

  const navigate = useNavigate()


  useEffect(() => {

    const loadSubscriptions = async () => {

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
          `http://127.0.0.1:8000/api/product/subscriptions/farmer/?farmer_id=${account.id}`
        )


        const data =
          await response.json()


        if (!response.ok) {

          setError(
            'Failed to load subscriptions.'
          )

          setLoading(false)

          return
        }


        setSubscriptions(data)

      } catch (error) {

        console.error(
          'Subscriptions error:',
          error
        )

        setError(
          'Unable to connect to the server.'
        )

      } finally {

        setLoading(false)

      }

    }


    loadSubscriptions()

  }, [])


  return (

    <div className="farmer-subscriptions-page">

      <div className="farmer-subscriptions-container">


        <div className="farmer-subscriptions-header">

          <span>
            AQUA NEXUS
          </span>

          <h1>
            My Subscriptions
          </h1>

          <p>
            View your feed subscriptions and their current status.
          </p>

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="back-button"
          >
            ← Back
          </button>

        </div>


        {loading && (

          <div className="farmer-subscriptions-message">

            Loading subscriptions...

          </div>

        )}


        {!loading && error && (

          <div className="farmer-subscriptions-message">

            {error}

          </div>

        )}


        {!loading &&
          !error &&
          subscriptions.length === 0 && (

          <div className="farmer-subscriptions-message">

            No subscriptions found.

          </div>

        )}


        {!loading &&
          !error &&
          subscriptions.length > 0 && (

          <div className="farmer-subscriptions-list">

            {subscriptions.map((subscription) => (

              <div
                key={subscription.id}
                className="farmer-subscription-card"
              >

                <div className="farmer-subscription-top">

                  <div>

                    <span className="farmer-subscription-label">
                      SUBSCRIPTION #{subscription.id}
                    </span>

                    <h2>
                      {subscription.product_name}
                    </h2>

                    <p>
                      {subscription.brand_name}
                    </p>

                  </div>


                  <span
                    className={`farmer-subscription-status ${subscription.status}`}
                  >
                    {subscription.status}
                  </span>

                </div>


                <div className="farmer-subscription-details">

                  <div>

                    <span>
                      Vendor
                    </span>

                    <strong>
                      {subscription.vendor_name}
                    </strong>

                  </div>


                  <div>

                    <span>
                      Product
                    </span>

                    <strong>
                      {subscription.product_name}
                    </strong>

                  </div>


                  <div>

                    <span>
                      Brand
                    </span>

                    <strong>
                      {subscription.brand_name}
                    </strong>

                  </div>

                </div>


                <div className="farmer-subscription-date">

                  Subscribed on:{' '}

                  {new Date(
                    subscription.created_at
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


export default FarmerSubscriptions