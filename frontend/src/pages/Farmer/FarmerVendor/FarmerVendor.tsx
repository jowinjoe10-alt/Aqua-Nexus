import { useEffect, useState } from 'react'
import './FarmerVendor.css'


type Product = {
  id: number
  vendor: number
  feed_type: string
  feed_name: string
  brand_name: string
  price: string
  protein_range: string
  pellet_size: string
  image: string | null
  description: string | null
  inventory: {
    id: number
    quantity: number
    updated_at: string
  } | null
}

type FarmerAccount = {
  id: number
  name: string
  email: string
  role: string
}

type FeedRecommendation = {
  id: number
  fish_stage?: number | null
  fish_name?: string | null
  stage_number?: number | null
  feed_name?: string | null
  feed_type?: string | null
  feed_form?: string | null
  protein_min?: number | null
  protein_max?: number | null
  particle_size_min?: number | null
  particle_size_max?: number | null
  organic?: boolean | null
}


type FarmerVendorProps = {
  initialSearchText?: string
  selectedFeed?: FeedRecommendation | null
}


function getRangeValues(value: string | null) {

  if (!value) {
    return null
  }


  const numbers = value.match(/\d+(\.\d+)?/g)


  if (!numbers || numbers.length === 0) {
    return null
  }


  if (numbers.length === 1) {

    const number = Number(numbers[0])

    return {
      min: number,
      max: number
    }

  }


  return {
    min: Number(numbers[0]),
    max: Number(numbers[1])
  }

}


function FarmerVendor({
  initialSearchText = '',
  selectedFeed = null
}: FarmerVendorProps) {

  const [message, setMessage] =
    useState('')

  const [sendingMessage, setSendingMessage] =
    useState(false)

  const [messageError, setMessageError] =
    useState('')

  const [sortOption, setSortOption] =
    useState('')


  const [products, setProducts] =
    useState<Product[]>([])


  const [loading, setLoading] =
    useState(true)


  const [searchText, setSearchText] =
    useState(
      selectedFeed?.feed_name ||
      initialSearchText
    )


  const [error, setError] =
    useState('')


  const [selectedProduct, setSelectedProduct] =
    useState<Product | null>(null)


  const [quantity, setQuantity] =
    useState(1)

  const [account, setAccount] =
    useState<FarmerAccount | null>(null)

    useEffect(() => {

    if (selectedFeed?.feed_name) {

      setSearchText(
        selectedFeed.feed_name
      )

    } else {

      setSearchText(
        initialSearchText
      )

    }

  }, [
    selectedFeed,
    initialSearchText
  ])


  useEffect(() => {

    const savedAccount =
      localStorage.getItem(
        'aquaNexusAccount'
      )

    if (savedAccount) {

      try {

        const parsedAccount =
          JSON.parse(savedAccount)

        setAccount(
          parsedAccount
        )

      } catch (error) {

        console.error(
          'Account loading error:',
          error
        )

      }

    }

  }, [])
  /* ============================= */
  /* Load Products                 */
  /* ============================= */

  useEffect(() => {

    const loadProducts = async () => {

      try {

        const response = await fetch(
          'http://127.0.0.1:8000/api/product/'
        )


        if (!response.ok) {

          throw new Error(
            'Unable to load products'
          )

        }


        const data = await response.json()


        setProducts(data)

      } catch (error) {

        console.error(
          'Product loading error:',
          error
        )


        setError(
          'Unable to load products.'
        )

      } finally {

        setLoading(false)

      }

    }


    loadProducts()

  }, [])


  /* ============================= */
  /* Search Products               */
  /* ============================= */

  const filteredProducts =
    products.filter((product) => {

      if (selectedFeed) {

        /* ============================= */
        /* Feed Name                     */
        /* ============================= */

        if (
          selectedFeed.feed_name &&
          product.feed_name.toLowerCase() !==
          selectedFeed.feed_name.toLowerCase()
        ) {

          return false

        }


        /* ============================= */
        /* Feed Type                     */
        /* ============================= */

        if (
          selectedFeed.feed_type &&
          product.feed_type.toLowerCase() !==
          selectedFeed.feed_type.toLowerCase()
        ) {

          return false

        }


        /* ============================= */
        /* Protein                       */
        /* ============================= */

        if (
          selectedFeed.protein_min !== null &&
          selectedFeed.protein_min !== undefined &&
          selectedFeed.protein_max !== null &&
          selectedFeed.protein_max !== undefined
        ) {

          const recommendedProtein = {

            min: Number(
              selectedFeed.protein_min
            ),

            max: Number(
              selectedFeed.protein_max
            )

          }


          const productProtein =
            getRangeValues(
              product.protein_range
            )


          if (
            !productProtein ||
            productProtein.max < recommendedProtein.min ||
            productProtein.min > recommendedProtein.max
          ) {

            return false

          }

        }


        /* ============================= */
        /* Particle Size                 */
        /* ============================= */

        if (
          selectedFeed.particle_size_min !== null &&
          selectedFeed.particle_size_min !== undefined &&
          selectedFeed.particle_size_max !== null &&
          selectedFeed.particle_size_max !== undefined
        ) {

          const recommendedParticleSize = {

            min: Number(
              selectedFeed.particle_size_min
            ),

            max: Number(
              selectedFeed.particle_size_max
            )

          }


          const productParticleSize =
            getRangeValues(
              product.pellet_size
            )


          if (
            !productParticleSize ||
            productParticleSize.max < recommendedParticleSize.min ||
            productParticleSize.min > recommendedParticleSize.max
          ) {

            return false

          }

        }


        /* ============================= */
        /* Inventory                     */
        /* ============================= */

        if (
          !product.inventory ||
          product.inventory.quantity <= 0
        ) {

          return false

        }


        return true

      }


      const search =
        searchText.toLowerCase().trim()


      if (!search) {
        return true
      }


      return (
        product.feed_name
          .toLowerCase()
          .includes(search)
      )

    })


  /* ============================= */
  /* Sort Products                 */
  /* ============================= */

  const sortedProducts =
    [...filteredProducts].sort(
      (firstProduct, secondProduct) => {

        if (
          sortOption === 'low-to-high'
        ) {

          return (
            Number(firstProduct.price) -
            Number(secondProduct.price)
          )

        }


        if (
          sortOption === 'high-to-low'
        ) {

          return (
            Number(secondProduct.price) -
            Number(firstProduct.price)
          )

        }


        return 0

      }
    )


  /* ============================= */
  /* Select Product                */
  /* ============================= */

  const openProductDetails = (
    product: Product
  ) => {

    setSelectedProduct(product)

    setQuantity(1)

  }


  /* ============================= */
  /* Close Product Details         */
  /* ============================= */

  const closeProductDetails = () => {

    setSelectedProduct(null)

    setQuantity(1)

  }


  /* ============================= */
  /* Quantity Change               */
  /* ============================= */

  const handleQuantityChange = (
    value: string
  ) => {

    const newQuantity =
      Number(value)


    if (
      newQuantity >= 1 &&
      selectedProduct &&
      selectedProduct.inventory &&
      newQuantity <=
      selectedProduct.inventory.quantity
    ) {

      setQuantity(newQuantity)

    }

  }

  /* ============================= */
  /* Buy Product                   */
  /* ============================= */

  const handleBuy = async () => {

    console.log('BUY CLICKED')

    if (!selectedProduct) {

      console.log('STOPPED: No selected product')

      return

    }

    if (!account) {

      console.log('STOPPED: Farmer account not found')

      setMessageError('Farmer account not found.')

      return

    }

    if (!selectedProduct.inventory) {

      console.log('STOPPED: No inventory')

      setMessageError('Product inventory not available.')

      return

    }

    if (quantity <= 0) {

      console.log('STOPPED: Invalid quantity')

      setMessageError('Please select a valid quantity.')

      return

    }

    if (quantity > selectedProduct.inventory.quantity) {

      console.log('STOPPED: Quantity greater than inventory')

      setMessageError('Not enough inventory available.')

      return

    }

    setSendingMessage(true)
    setMessageError('')

    try {

      const response = await fetch(
        'http://127.0.0.1:8000/api/product/orders/',
        {
          method: 'POST',

          headers: {
            'Content-Type':
              'application/json',
          },

          body: JSON.stringify({

            farmer_id:
              account.id,

            vendor_id:
              selectedProduct.vendor,

            product_id:
              selectedProduct.id,

            quantity:
              quantity,

          }),
        }
      )

      const data = await response.json()

      console.log('Order response:', data)

      if (!response.ok) {

        setMessageError(
          data.error ||
          data.detail ||
          data.message ||
          'Failed to place order.'
        )

        return

      }

      console.log(
        'Order created successfully:',
        data
      )

      alert('Order placed successfully.')

      setSelectedProduct(null)
      setQuantity(1)

    } catch (error) {

      console.error(
        'Order error:',
        error
      )

      setMessageError(
        'Unable to connect to the server.'
      )

    } finally {

      setSendingMessage(false)

    }

  }

  /* ============================= */
  /* Total Price                   */
  /* ============================= */

  const totalPrice =
    selectedProduct
      ? Number(selectedProduct.price) *
        quantity
      : 0

  const handleSendMessage = async () => {

    console.log('SEND BUTTON CLICKED')

    if (!selectedProduct) {
      return
    }

    if (!account) {
      setMessageError(
        'Farmer account not found.'
      )

       return
    }

    if (!message.trim()) {
      setMessageError(
        'Please type a message.'
      )

      return
    }

    setSendingMessage(true)
    setMessageError('')

    try {

      const response = await fetch(
        'http://127.0.0.1:8000/api/product/chat/',
        {
          method: 'POST',

          headers: {
            'Content-Type':
              'application/json',
          },

          body: JSON.stringify({
            farmer_id:
              account.id,

            vendor_id:
              selectedProduct.vendor,

            product_id:
              selectedProduct.id,

            question:
              message.trim(),
          }),
        }
      )

      const data =
        await response.json()

      if (!response.ok) {

        setMessageError(
          data.error ||
          data.detail ||
          'Failed to send message.'
        )

        return
      }

      setMessage('')

      console.log(
        'Message sent successfully:',
        data
      )

    } catch (error) {

      console.error(
        'Send message error:',
        error
      )

      setMessageError(
        'Unable to connect to the server.'
      )

    } finally {

      setSendingMessage(false)

    }

  }

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
              setSearchText(
                event.target.value
              )
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
              setSortOption(
                event.target.value
              )
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
      {/* Product Details               */}
      {/* ============================= */}

      {selectedProduct && (

        <div className="farmer-vendor-details">


          <button
            className="farmer-vendor-close"
            onClick={closeProductDetails}
          >
            ×
          </button>


          {/* Product Image */}

          <div className="farmer-vendor-details-image">

            {selectedProduct.image ? (

              <img
                src={selectedProduct.image}
                alt={selectedProduct.feed_name}
              />

            ) : (

              <div className="farmer-vendor-product-placeholder">
                🐟
              </div>

            )}

          </div>


          {/* Product Details */}

          <div className="farmer-vendor-details-info">

            <h3>
              {selectedProduct.feed_name}
            </h3>

            <p>
              <strong>
                Brand:
              </strong>{' '}
              {selectedProduct.brand_name}
            </p>

            <p>
              <strong>
                Feed Type:
              </strong>{' '}
              {selectedProduct.feed_type}
            </p>

            <p>
              <strong>
                Price:
              </strong>{' '}
              ₹{selectedProduct.price}
            </p>

            <p>
              <strong>
                Protein:
              </strong>{' '}
              {selectedProduct.protein_range}
            </p>

            <p>
              <strong>
                Particle Size:
              </strong>{' '}
              {selectedProduct.pellet_size}
            </p>

            <p>
              <strong>
                Description:
              </strong>{' '}
              {selectedProduct.description ||
                'No description provided.'}
            </p>


            {/* Availability */}

            <p>

              <strong>
                Availability:
              </strong>{' '}

              {selectedProduct.inventory &&
                selectedProduct.inventory.quantity > 0
                ? 'Available'
                : 'Out of stock'}

            </p>


            {/* Available Quantity */}

            {selectedProduct.inventory &&
              selectedProduct.inventory.quantity > 0 && (

              <p>

                <strong>
                  Available Quantity:
                </strong>{' '}

                {selectedProduct.inventory.quantity}

              </p>

            )}


            {/* ============================= */}
            {/* Quantity                      */}
            {/* ============================= */}

            {selectedProduct.inventory &&
              selectedProduct.inventory.quantity > 0 && (

                <div className="farmer-vendor-quantity">

                  <label htmlFor="product-quantity">
                    Quantity
                  </label>

                  <input
                    id="product-quantity"
                    type="number"
                    min="1"
                    max={
                      selectedProduct.inventory.quantity
                    }
                    value={quantity}
                    onChange={(event) =>
                      handleQuantityChange(
                        event.target.value
                      )
                    }
                  />

                </div>

            )}


            {/* ============================= */}
            {/* Total Price                   */}
            {/* ============================= */}

            {selectedProduct.inventory &&
              selectedProduct.inventory.quantity > 0 && (

                <div className="farmer-vendor-total">

                  <span>
                    Total Price
                  </span>

                  <strong>
                    ₹{totalPrice.toFixed(2)}
                  </strong>

                </div>

            )}


            {/* ============================= */}
            {/* Buy / Subscribe               */}
            {/* ============================= */}

            <div className="farmer-vendor-actions">

              <button
                className="farmer-vendor-buy"
                onClick={handleBuy}
                disabled={
                  !selectedProduct.inventory ||
                  selectedProduct.inventory.quantity <= 0
                }
              >
                Buy
              </button>

              <button
                className="farmer-vendor-subscribe"
                disabled={
                  !selectedProduct.inventory ||
                  selectedProduct.inventory.quantity <= 0
                }
              >
                Subscribe
              </button>

            </div>


            {/* ============================= */}
            {/* Vendor Mobile                  */}
            {/* ============================= */}

            <div className="farmer-vendor-mobile">

              <strong>
                Vendor Mobile
              </strong>

              <div
                className="farmer-vendor-mobile-number"
                title="Mobile number will be displayed after the vendor accepts the order"
              >
                ●●●●●●●●●●

              </div>

              <span>
                Mobile number will be displayed
                after the vendor accepts the order.
              </span>

            </div>


            {/* ============================= */}
            {/* Chat                           */}
            {/* ============================= */}

            <div className="farmer-vendor-chat">

              <h4>
                Chat with Vendor
              </h4>

              <textarea
                placeholder="Type your message..."
                value={message}
                onChange={(event) => {

                 setMessage(
                   event.target.value
                 )

                 if (messageError) {
                    setMessageError('')
                 }

                }}
              />

              <button
                 type="button"
                onClick={handleSendMessage}
                disabled={sendingMessage}
              >
                {sendingMessage
                  ? 'Sending...'
                  : 'Send'}
              </button>


              {messageError && (

                <p className="farmer-vendor-chat-error">
                  {messageError}
                </p>

              )}

            </div>

          </div>

        </div>

      )}


      {/* ============================= */}
      {/* Vendor Content                */}
      {/* ============================= */}

      {!selectedProduct && (

        <div className="farmer-vendor-content">


          {/* Loading */}

          {loading && (

            <p className="farmer-vendor-empty-message">
              Loading products...
            </p>

          )}


          {/* Error */}

          {!loading && error && (

            <p className="farmer-vendor-empty-message">
              {error}
            </p>

          )}


          {/* No Products */}

          {!loading &&
            !error &&
            sortedProducts.length === 0 && (

              <p className="farmer-vendor-empty-message">

                {searchText
                  ? 'No matching products found.'
                  : 'No products are currently available.'}

              </p>

          )}


          {/* Product Cards */}

          {!loading &&
            !error &&
            sortedProducts.length > 0 && (

              <div className="farmer-vendor-products">

                {sortedProducts.map(
                  (product) => (

                    <div
                      className="farmer-vendor-product-card"
                      key={product.id}
                      onClick={() =>
                        openProductDetails(product)
                      }
                    >


                      {/* Product Image */}

                      <div className="farmer-vendor-product-image">

                        {product.image ? (

                          <img
                            src={product.image}
                            alt={product.feed_name}
                          />

                        ) : (

                          <div className="farmer-vendor-product-placeholder">
                            🐟
                          </div>

                        )}

                      </div>


                      {/* Product Information */}

                      <div className="farmer-vendor-product-info">

                        <h3>
                          {product.feed_name}
                        </h3>

                        <p>
                          <strong>
                            Brand:
                          </strong>{' '}
                          {product.brand_name}
                        </p>


                        {/* Inventory */}

                        {product.inventory &&
                          product.inventory.quantity > 0 ? (

                          <p className="farmer-vendor-stock">
                            Available
                          </p>

                        ) : (

                          <p className="farmer-vendor-out-of-stock">
                            Out of stock
                          </p>

                        )}

                      </div>

                    </div>

                  )
                )}

              </div>

          )}

        </div>

      )}

    </section>

  )

}


export default FarmerVendor