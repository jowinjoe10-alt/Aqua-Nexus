import { useEffect, useState } from 'react'
import './Vendor.css'
import AccountManagement from '../../../components/AccountManagement/AccountManagement'


type VendorManagementType =
  'Vendor' |
  'Products'


type Period =
  'Total' |
  'Weekly' |
  'Monthly' |
  'Daily'


type Product = {
  id: number
  fish_name: string
  fish_stage: number
  stage_number: number
  feed_name: string | null
  feed_type: string | null
  feed_form: string
  protein_min: string
  protein_max: string
  particle_size_min: string
  particle_size_max: string
  is_organic: boolean
  created_at: string
  updated_at: string
}


const ADMIN_PRODUCTS_URL =
  'http://127.0.0.1:8000/api/fish/admin/products/'


function Vendor() {

  const [managementType, setManagementType] =
    useState<VendorManagementType>('Vendor')


  const [selectedProductStage, setSelectedProductStage] =
    useState<number | null>(null)


  const [dropdownOpen, setDropdownOpen] =
    useState(false)


  const [period, setPeriod] =
    useState<Period>('Total')


  const [periodDropdownOpen, setPeriodDropdownOpen] =
    useState(false)


  const [vendorCount, setVendorCount] =
    useState(0)


  const [showVendorMessage, setShowVendorMessage] =
    useState(false)


  const [showVendorAccounts, setShowVendorAccounts] =
    useState(false)


  /* ============================= */
  /* Product State                  */
  /* ============================= */

  const [products, setProducts] =
    useState<Product[]>([])


  const [productSearch, setProductSearch] =
    useState('')


  const [productsLoading, setProductsLoading] =
    useState(false)


  const [productsError, setProductsError] =
    useState('')


  const [selectedProduct, setSelectedProduct] =
    useState<Product | null>(null)


  const [editingProduct, setEditingProduct] =
    useState<Product | null>(null)


  const [deleteProduct, setDeleteProduct] =
    useState<Product | null>(null)


  const [productSaving, setProductSaving] =
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
  /* Load Products                 */
  /* ============================= */

  useEffect(() => {

    if (managementType !== 'Products') {
      return
    }


    setProductsLoading(true)
    setProductsError('')


    fetch(
      ADMIN_PRODUCTS_URL
    )
      .then((response) => {

        if (!response.ok) {

          throw new Error(
            'Unable to get products'
          )

        }

        return response.json()

      })
      .then((data) => {

        setProducts(data)

      })
      .catch((error) => {

        console.error(
          'Error getting products:',
          error
        )

        setProductsError(
          'Unable to load products.'
        )

      })
      .finally(() => {

        setProductsLoading(false)

      })

  }, [managementType])


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


  /* ============================= */
  /* Product Search                */
  /* ============================= */

  const searchedProducts =
    products.filter((product) => {

      const search =
        productSearch
          .trim()
          .toLowerCase()


      if (!search) {
        return true
      }


      const feedName =
        product.feed_name
          ?.toLowerCase() || ''


      const fishName =
        product.fish_name
          ?.toLowerCase() || ''


      return (
        feedName.includes(search) ||
        fishName.includes(search)
      )

    })


  /* ============================= */
  /* Products For Selected Stage   */
  /* ============================= */

  const stageProducts =
    searchedProducts.filter(
      (product) =>
        product.stage_number ===
        selectedProductStage
    )


  /* ============================= */
  /* Delete Product                */
  /* ============================= */

  const handleDeleteProduct = async () => {

    if (!deleteProduct) {
      return
    }


    setProductSaving(true)


    try {

      const response =
        await fetch(
          `${ADMIN_PRODUCTS_URL}${deleteProduct.id}/`,
          {
            method: 'DELETE',
          }
        )


      if (!response.ok) {

        throw new Error(
          'Unable to delete product'
        )

      }


      setProducts(
        (currentProducts) =>
          currentProducts.filter(
            (product) =>
              product.id !==
              deleteProduct.id
          )
      )


      if (
        selectedProduct?.id ===
        deleteProduct.id
      ) {

        setSelectedProduct(null)

      }


      if (
        editingProduct?.id ===
        deleteProduct.id
      ) {

        setEditingProduct(null)

      }


      setDeleteProduct(null)

    } catch (error) {

      console.error(
        'Delete product error:',
        error
      )

      alert(
        'Unable to delete product.'
      )

    } finally {

      setProductSaving(false)

    }

  }


  /* ============================= */
  /* Edit Product                 */
  /* ============================= */

  const handleEditProduct =
    async () => {

      if (!editingProduct) {
        return
      }


      setProductSaving(true)


      try {

        const response =
          await fetch(
            `${ADMIN_PRODUCTS_URL}${editingProduct.id}/`,
            {
              method: 'PATCH',

              headers: {
                'Content-Type':
                  'application/json',
              },

              body: JSON.stringify({

                feed_name:
                  editingProduct.feed_name,

                feed_type:
                  editingProduct.feed_type,

                feed_form:
                  editingProduct.feed_form,

                protein_min:
                  editingProduct.protein_min,

                protein_max:
                  editingProduct.protein_max,

                particle_size_min:
                  editingProduct.particle_size_min,

                particle_size_max:
                  editingProduct.particle_size_max,

                is_organic:
                  editingProduct.is_organic,

              }),

            }
          )


        if (!response.ok) {

          throw new Error(
            'Unable to update product'
          )

        }


        const updatedProduct:
          Product =
            await response.json()


        setProducts(
          (currentProducts) =>
            currentProducts.map(
              (product) =>
                product.id ===
                updatedProduct.id
                  ? updatedProduct
                  : product
            )
        )


        setSelectedProduct(
          updatedProduct
        )


        setEditingProduct(
          null
        )

      } catch (error) {

        console.error(
          'Edit product error:',
          error
        )

        alert(
          'Unable to update product.'
        )

      } finally {

        setProductSaving(false)

      }

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

                setSelectedProductStage(
                  null
                )

                setDropdownOpen(
                  false
                )

              }}
            >
              Vendor
            </button>


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

                setSelectedProductStage(
                  null
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

          <div className="admin-vendor-stats">


            {/* Vendors */}

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


            {/* Orders */}

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


            {/* Subscriptions */}

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


          {/* ============================= */}
          {/* Product Header                 */}
          {/* ============================= */}

          <div className="admin-products-header">

            <div>

              <h2>
                Products
              </h2>

              <p>
                Manage feed products by fish stage.
              </p>

            </div>

          </div>


          {/* ============================= */}
          {/* Product Search                 */}
          {/* ============================= */}

          <div className="admin-product-search">

            <input
              type="text"
              placeholder="Search by feed name or fish name..."
              value={productSearch}
              onChange={(event) =>
                setProductSearch(
                  event.target.value
                )
              }
            />

          </div>


          {/* ============================= */}
          {/* Loading                        */}
          {/* ============================= */}

          {productsLoading && (

            <div className="admin-product-message">
              Loading products...
            </div>

          )}


          {/* ============================= */}
          {/* Error                          */}
          {/* ============================= */}

          {!productsLoading &&
            productsError && (

              <div className="admin-product-message">

                {productsError}

              </div>

            )}


          {/* ============================= */}
          {/* Search / Stage Selection       */}
          {/* ============================= */}

          {!productsLoading &&
            !productsError &&
            selectedProductStage === null && (

             <>
              {/* Search Results */}
              {productSearch.trim() ? (

                <div className="admin-product-search-results">

                  <h3 className="admin-product-search-title">
                    Search Results
                  </h3>

                  {searchedProducts.length === 0 ? (

                   <p className="admin-product-stage-message">
                     No products found.
                   </p>

                  ) : (

                   <div className="admin-product-grid">

                     {searchedProducts.map(
                       (product) => (

                        <div
                          key={product.id}
                          className="admin-product-card"
                          onClick={() =>
                            setSelectedProduct(product)
                          }
                        >

                          <div className="admin-product-card-top">

                            <span>
                              #{product.id}
                            </span>

                            <button
                              type="button"
                              className="admin-product-delete-button"
                              onClick={(event) => {

                                event.stopPropagation()

                                setDeleteProduct(product)

                              }}
                              aria-label="Delete product"
                            >
                             🗑
                            </button>

                          </div>

                          <h4>
                           {product.feed_name ||
                              'Unnamed Feed'}
                          </h4>

                          <p>
                            {product.fish_name}
                          </p>

                        </div>

                       )
                     )}

            </div>

          )}

                </div>

              ) : (

        /* Stage Selection */

                <div className="admin-product-stages">

                 {[1, 2, 3, 4, 5, 6].map(
                   (stage) => (

                     <button
                       key={stage}
                       type="button"
                       className="admin-product-stage-card"
                       onClick={() => {

                         setProductSearch('')

                         setSelectedProductStage(stage)

                       }}
                     >

                      <span>
                        Stage {stage}
                      </span>

                     </button>

                   )
                 )}

                </div>

              )}

           </>
          )}


          {/* ============================= */}
          {/* Selected Stage                 */}
          {/* ============================= */}

          {!productsLoading &&
            !productsError &&
            selectedProductStage !== null && (

              <div>


                {/* Back */}

                <button
                  type="button"
                  className="admin-product-back-button"
                  onClick={() => {

                    setSelectedProductStage(
                      null
                    )

                    setProductSearch('')

                  }}
                >
                  ← Back
                </button>


                {/* Stage Title */}

                <h3 className="admin-product-stage-title">
                  Stage {selectedProductStage}
                </h3>


                {/* ============================= */}
                {/* Product Cards                  */}
                {/* ============================= */}

                {stageProducts.length === 0 ? (

                  <p className="admin-product-stage-message">
                    No products found for Stage {selectedProductStage}.
                  </p>

                ) : (

                  <div className="admin-product-grid">

                    {stageProducts.map(
                      (product) => (

                        <div
                          key={product.id}
                          className="admin-product-card"
                          onClick={() =>
                            setSelectedProduct(
                              product
                            )
                          }
                        >

                          <div className="admin-product-card-top">

                            <span>
                              #{product.id}
                            </span>

                            <button
                              type="button"
                              className="admin-product-delete-button"
                              onClick={(event) => {

                                event.stopPropagation()

                                setDeleteProduct(
                                  product
                                )

                              }}
                              aria-label="Delete product"
                            >
                              🗑
                            </button>

                          </div>


                          <h4>
                            {product.feed_name ||
                              'Unnamed Feed'}
                          </h4>


                          <p>
                            {product.fish_name}
                          </p>

                        </div>

                      )
                    )}

                  </div>

                )}

              </div>

            )}

        </div>

      )}


      {/* ============================= */}
      {/* Product Details Modal         */}
      {/* ============================= */}

      {selectedProduct && (

        <div
          className="admin-product-modal-overlay"
          onClick={() =>
            setSelectedProduct(null)
          }
        >

          <div
            className="admin-product-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            <button
              type="button"
              className="admin-product-modal-close"
              onClick={() =>
                setSelectedProduct(null)
              }
            >
              ×
            </button>


            <h2>
              Product Details
            </h2>


            <div className="admin-product-details">


              <div>
                <span>ID</span>
                <strong>
                  #{selectedProduct.id}
                </strong>
              </div>


              <div>
                <span>Fish</span>
                <strong>
                  {selectedProduct.fish_name}
                </strong>
              </div>


              <div>
                <span>Stage</span>
                <strong>
                  Stage {selectedProduct.stage_number}
                </strong>
              </div>


              <div>
                <span>Feed Name</span>
                <strong>
                  {selectedProduct.feed_name ||
                    '—'}
                </strong>
              </div>


              <div>
                <span>Feed Type</span>
                <strong>
                  {selectedProduct.feed_type ||
                    '—'}
                </strong>
              </div>


              <div>
                <span>Feed Form</span>
                <strong>
                  {selectedProduct.feed_form}
                </strong>
              </div>


              <div>
                <span>Protein</span>
                <strong>
                  {selectedProduct.protein_min}
                  {' - '}
                  {selectedProduct.protein_max}
                </strong>
              </div>


              <div>
                <span>Particle Size</span>
                <strong>
                  {selectedProduct.particle_size_min}
                  {' - '}
                  {selectedProduct.particle_size_max}
                </strong>
              </div>


              <div>
                <span>Organic</span>
                <strong>
                  {selectedProduct.is_organic
                    ? 'Yes'
                    : 'No'}
                </strong>
              </div>


              <div>
                <span>Created At</span>
                <strong>
                  {new Date(
                    selectedProduct.created_at
                  ).toLocaleString()}
                </strong>
              </div>


              <div>
                <span>Updated At</span>
                <strong>
                  {new Date(
                    selectedProduct.updated_at
                  ).toLocaleString()}
                </strong>
              </div>


            </div>


            <div className="admin-product-modal-actions">

              <button
                type="button"
                onClick={() => {

                  setEditingProduct(
                    selectedProduct
                  )

                  setSelectedProduct(
                    null
                  )

                }}
              >
                Edit
              </button>


              <button
                type="button"
                onClick={() => {

                  setDeleteProduct(
                    selectedProduct
                  )

                  setSelectedProduct(
                    null
                  )

                }}
              >
                Delete
              </button>

            </div>

          </div>

        </div>

      )}


      {/* ============================= */}
      {/* Edit Product Modal            */}
      {/* ============================= */}

      {editingProduct && (

        <div
          className="admin-product-modal-overlay"
          onClick={() =>
            setEditingProduct(null)
          }
        >

          <div
            className="admin-product-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            <button
              type="button"
              className="admin-product-modal-close"
              onClick={() =>
                setEditingProduct(null)
              }
            >
              ×
            </button>


            <h2>
              Edit Product
            </h2>


            <div className="admin-product-edit-form">


              <label>
                Feed Name

                <input
                  type="text"
                  value={
                    editingProduct.feed_name || ''
                  }
                  onChange={(event) =>
                    setEditingProduct({
                      ...editingProduct,
                      feed_name:
                        event.target.value
                    })
                  }
                />

              </label>


              <label>
                Feed Type

                <input
                  type="text"
                  value={
                    editingProduct.feed_type || ''
                  }
                  onChange={(event) =>
                    setEditingProduct({
                      ...editingProduct,
                      feed_type:
                        event.target.value
                    })
                  }
                />

              </label>


              <label>
                Feed Form

                <input
                  type="text"
                  value={
                    editingProduct.feed_form
                  }
                  onChange={(event) =>
                    setEditingProduct({
                      ...editingProduct,
                      feed_form:
                        event.target.value
                    })
                  }
                />

              </label>


              <label>
                Protein Minimum

                <input
                  type="number"
                  step="0.01"
                  value={
                    editingProduct.protein_min
                  }
                  onChange={(event) =>
                    setEditingProduct({
                      ...editingProduct,
                      protein_min:
                        event.target.value
                    })
                  }
                />

              </label>


              <label>
                Protein Maximum

                <input
                  type="number"
                  step="0.01"
                  value={
                    editingProduct.protein_max
                  }
                  onChange={(event) =>
                    setEditingProduct({
                      ...editingProduct,
                      protein_max:
                        event.target.value
                    })
                  }
                />

              </label>


              <label>
                Particle Size Minimum

                <input
                  type="number"
                  step="0.01"
                  value={
                    editingProduct.particle_size_min
                  }
                  onChange={(event) =>
                    setEditingProduct({
                      ...editingProduct,
                      particle_size_min:
                        event.target.value
                    })
                  }
                />

              </label>


              <label>
                Particle Size Maximum

                <input
                  type="number"
                  step="0.01"
                  value={
                    editingProduct.particle_size_max
                  }
                  onChange={(event) =>
                    setEditingProduct({
                      ...editingProduct,
                      particle_size_max:
                        event.target.value
                    })
                  }
                />

              </label>


              <label className="admin-product-checkbox">

                <input
                  type="checkbox"
                  checked={
                    editingProduct.is_organic
                  }
                  onChange={(event) =>
                    setEditingProduct({
                      ...editingProduct,
                      is_organic:
                        event.target.checked
                    })
                  }
                />

                Organic

              </label>


            </div>


            <div className="admin-product-modal-actions">

              <button
                type="button"
                onClick={() =>
                  setEditingProduct(null)
                }
              >
                Cancel
              </button>


              <button
                type="button"
                onClick={
                  handleEditProduct
                }
                disabled={
                  productSaving
                }
              >
                {productSaving
                  ? 'Saving...'
                  : 'Save Changes'}
              </button>

            </div>

          </div>

        </div>

      )}


      {/* ============================= */}
      {/* Delete Confirmation           */}
      {/* ============================= */}

      {deleteProduct && (

        <div
          className="admin-product-modal-overlay"
          onClick={() =>
            setDeleteProduct(null)
          }
        >

          <div
            className="admin-product-delete-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            <h2>
              Delete Product?
            </h2>


            <p>
              Are you sure you want to delete
              this product?
            </p>


            <strong>
              {deleteProduct.feed_name ||
                'Unnamed Feed'}
            </strong>


            <p>
              #{deleteProduct.id}
              {' · '}
              {deleteProduct.fish_name}
            </p>


            <div className="admin-product-modal-actions">

              <button
                type="button"
                onClick={() =>
                  setDeleteProduct(null)
                }
                disabled={
                  productSaving
                }
              >
                Cancel
              </button>


              <button
                type="button"
                onClick={
                  handleDeleteProduct
                }
                disabled={
                  productSaving
                }
              >
                {productSaving
                  ? 'Deleting...'
                  : 'Delete'}
              </button>

            </div>

          </div>

        </div>

      )}

    </section>

  )
}


export default Vendor