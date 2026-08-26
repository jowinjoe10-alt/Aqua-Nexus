import { useState } from 'react'
import './Product.css'

type Product = {
  name: string
  description: string
  organic: boolean
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

function Product() {

  const [searchText, setSearchText] =
    useState('')

  const [selectedProduct, setSelectedProduct] =
    useState<Product | null>(null)

  const searchResults = productList.filter(
    (product) =>
      product.name
        .toLowerCase()
        .includes(searchText.toLowerCase())
  )

  return (
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

      {!selectedProduct &&
        !searchText && (

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
  )
}

export default Product