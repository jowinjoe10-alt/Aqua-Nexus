import { useEffect, useState } from 'react'
import './Product.css'


type Product = {
  id: number
  feed_type: string
  feed_name: string
  brand_name: string
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


function Product() {

  // =====================================
  // Current Vendor Account
  // =====================================

  const [accountId, setAccountId] =
    useState<number | null>(null)


  // =====================================
  // Search
  // =====================================

  const [searchText, setSearchText] =
    useState('')


  // =====================================
  // Product Data
  // =====================================

  const [products, setProducts] =
    useState<Product[]>([])

  const [productLoading, setProductLoading] =
    useState(false)

  const [productError, setProductError] =
    useState('')


  // =====================================
  // Add / Edit Product
  // =====================================

  const [showProductForm, setShowProductForm] =
    useState(false)

  const [editingProduct, setEditingProduct] =
    useState<Product | null>(null)


  // =====================================
  // Product Form
  // =====================================

  const [feedType, setFeedType] =
    useState('')

  const [feedName, setFeedName] =
    useState('')

  const [brandName, setBrandName] =
    useState('')

  const [proteinRange, setProteinRange] =
    useState('')

  const [pelletSize, setPelletSize] =
    useState('')

  const [productImage, setProductImage] =
    useState<File | null>(null)

  const [description, setDescription] =
    useState('')

  const [inventory, setInventory] =
    useState('')


  // =====================================
  // Feed Type / Feed Name
  // =====================================

  const [feedTypes, setFeedTypes] =
    useState<string[]>([])

  const [feedNames, setFeedNames] =
    useState<string[]>([])


  const [feedTypeLoading, setFeedTypeLoading] =
    useState(false)

  const [feedNameLoading, setFeedNameLoading] =
    useState(false)


  // =====================================
  // Save Loading
  // =====================================

  const [savingProduct, setSavingProduct] =
    useState(false)


  // =====================================
  // Delete Loading
  // =====================================

  const [deletingProductId, setDeletingProductId] =
    useState<number | null>(null)


  // =====================================
  // Delete Confirmation
  // =====================================

  const [deleteProduct, setDeleteProduct] =
    useState<Product | null>(null)


  // =====================================
  // Load Current Vendor Account
  // =====================================

  useEffect(() => {

    const storedAccount =
      localStorage.getItem('aquaNexusAccount')


    if (!storedAccount) {

      setProductError(
        'Account information is unavailable.'
      )

      return
    }


    try {

      const account =
        JSON.parse(storedAccount)


      if (!account.id) {

        setProductError(
          'Vendor account information is unavailable.'
        )

        return
      }


      setAccountId(account.id)

    } catch (error) {

      console.error(
        'Unable to read account information:',
        error
      )

      setProductError(
        'Unable to read account information.'
      )

    }

  }, [])


  // =====================================
  // Load Products
  // =====================================

  useEffect(() => {

    if (accountId === null) {
      return
    }


    const loadProducts = async () => {

      setProductLoading(true)

      setProductError('')


      try {

        const response = await fetch(
          `http://127.0.0.1:8000/api/product/?account_id=${accountId}`
        )


        if (!response.ok) {

          throw new Error(
            'Unable to load products.'
          )

        }


        const data =
          await response.json()


        setProducts(data)

      } catch (error) {

        console.error(
          'Product loading error:',
          error
        )


        setProducts([])


        setProductError(
          'Unable to load products.'
        )

      } finally {

        setProductLoading(false)

      }

    }


    loadProducts()

  }, [accountId])


  // =====================================
  // Load Feed Types
  // =====================================

  useEffect(() => {

    const loadFeedTypes = async () => {

      setFeedTypeLoading(true)


      try {

        const response = await fetch(
          'http://127.0.0.1:8000/api/product/feed-types/'
        )


        if (!response.ok) {

          throw new Error(
            'Unable to load feed types.'
          )

        }


        const data =
          await response.json()


        setFeedTypes(data)

      } catch (error) {

        console.error(
          'Feed type loading error:',
          error
        )


        setFeedTypes([])

      } finally {

        setFeedTypeLoading(false)

      }

    }


    loadFeedTypes()

  }, [])


  // =====================================
  // Load Feed Names
  // =====================================

  useEffect(() => {

    if (!feedType) {

      setFeedNames([])

      return
    }


    const loadFeedNames = async () => {

      setFeedNameLoading(true)


      try {

        const response = await fetch(
          `http://127.0.0.1:8000/api/product/feed-names/?feed_type=${encodeURIComponent(feedType)}`
        )


        if (!response.ok) {

          throw new Error(
            'Unable to load feed names.'
          )

        }


        const data =
          await response.json()


        setFeedNames(data)

      } catch (error) {

        console.error(
          'Feed name loading error:',
          error
        )


        setFeedNames([])

      } finally {

        setFeedNameLoading(false)

      }

    }


    loadFeedNames()

  }, [feedType])


  // =====================================
  // Search Results
  // =====================================

  const displayedProducts =
    products.filter(
      (product) =>
        product.feed_name
          .toLowerCase()
          .includes(
            searchText.toLowerCase()
          )
    )


  // =====================================
  // Clear Product Form
  // =====================================

  const clearProductForm = () => {

    setFeedType('')

    setFeedName('')

    setBrandName('')

    setProteinRange('')

    setPelletSize('')

    setProductImage(null)

    setDescription('')

    setInventory('')

    setEditingProduct(null)

  }


  // =====================================
  // Open Add Product
  // =====================================

  const openAddProduct = () => {

    clearProductForm()

    setShowProductForm(true)

  }


  // =====================================
  // Open Edit Product
  // =====================================

  const openEditProduct = (
    product: Product
  ) => {

    setEditingProduct(product)

    setFeedType(product.feed_type)

    setFeedName(product.feed_name)

    setBrandName(product.brand_name)

    setProteinRange(product.protein_range)

    setPelletSize(product.pellet_size)

    setProductImage(null)

    setDescription(
      product.description || ''
    )

    setInventory(
      product.inventory
        ? String(product.inventory.quantity)
        : '0'
    )

    setShowProductForm(true)

  }


  // =====================================
  // Close Product Form
  // =====================================

  const closeProductForm = () => {

    if (savingProduct) {
      return
    }


    setShowProductForm(false)

    clearProductForm()

  }


  // =====================================
  // Save Product
  // =====================================

  const saveProduct = async () => {

    // -----------------------------
    // Account Validation
    // -----------------------------

    if (accountId === null) {

      alert(
        'Vendor account information is unavailable.'
      )

      return
    }


    // -----------------------------
    // Validation
    // -----------------------------

    if (!feedType) {

      alert(
        'Please select a feed type.'
      )

      return
    }


    if (!feedName) {

      alert(
        'Please select a feed name.'
      )

      return
    }


    if (!brandName.trim()) {

      alert(
        'Please enter brand name.'
      )

      return
    }


    if (!proteinRange.trim()) {

      alert(
        'Please enter protein range.'
      )

      return
    }


    if (!pelletSize.trim()) {

      alert(
        'Please enter pellet size.'
      )

      return
    }


    if (!inventory) {

      alert(
        'Please enter inventory quantity.'
      )

      return
    }


    if (Number(inventory) < 0) {

      alert(
        'Inventory quantity cannot be negative.'
      )

      return
    }


    // -----------------------------
    // FormData
    // -----------------------------

    const formData =
      new FormData()


    formData.append(
      'account_id',
      String(accountId)
    )


    formData.append(
      'feed_type',
      feedType
    )


    formData.append(
      'feed_name',
      feedName
    )


    formData.append(
      'brand_name',
      brandName.trim()
    )


    formData.append(
      'protein_range',
      proteinRange.trim()
    )


    formData.append(
      'pellet_size',
      pelletSize.trim()
    )


    formData.append(
      'inventory_quantity',
      inventory
    )


    if (productImage) {

      formData.append(
        'image',
        productImage
      )

    }


    formData.append(
      'description',
      description.trim()
    )


    // -----------------------------
    // Save Product
    // -----------------------------

    setSavingProduct(true)


    try {

      // =================================
      // EDIT PRODUCT
      // =================================

      if (editingProduct) {

        const response = await fetch(
          `http://127.0.0.1:8000/api/product/${editingProduct.id}/?account_id=${accountId}`,
          {
            method: 'PATCH',
            body: formData,
          }
        )


        const data =
          await response.json()


        if (!response.ok) {

          console.error(
            'Product update error:',
            data
          )


          alert(
            'Unable to update product.'
          )

          return
        }


        // -----------------------------
        // Update Product In State
        // -----------------------------

        setProducts(
          (currentProducts) =>
            currentProducts.map(
              (product) =>
                product.id === editingProduct.id
                  ? data
                  : product
            )
        )


        alert(
          'Product updated successfully.'
        )

      }

      // =================================
      // ADD PRODUCT
      // =================================

      else {

        const response = await fetch(
          'http://127.0.0.1:8000/api/product/',
          {
            method: 'POST',
            body: formData,
          }
        )


        const data =
          await response.json()


        if (!response.ok) {

          console.error(
            'Product save error:',
            data
          )


          alert(
            'Unable to save product.'
          )

          return
        }


        // -----------------------------
        // Add New Product To State
        // -----------------------------

        setProducts(
          (currentProducts) => [
            ...currentProducts,
            data,
          ]
        )


        alert(
          'Product saved successfully.'
        )

      }


      // -----------------------------
      // Close Form
      // -----------------------------

      setShowProductForm(false)

      clearProductForm()


    } catch (error) {

      console.error(
        'Product save error:',
        error
      )


      alert(
        editingProduct
          ? 'Unable to update product.'
          : 'Unable to save product.'
      )

    } finally {

      setSavingProduct(false)

    }

  }


  // =====================================
  // Delete Product
  // =====================================

  const confirmDeleteProduct = async () => {

    if (!deleteProduct) {
      return
    }


    if (accountId === null) {

      alert(
        'Vendor account information is unavailable.'
      )

      return
    }


    setDeletingProductId(
      deleteProduct.id
    )


    try {

      const response = await fetch(
        `http://127.0.0.1:8000/api/product/${deleteProduct.id}/?account_id=${accountId}`,
        {
          method: 'DELETE',
        }
      )


      if (!response.ok) {

        let errorData = null

        try {

          errorData =
            await response.json()

        } catch {
          // No response body
        }


        console.error(
          'Product delete error:',
          errorData
        )


        alert(
          'Unable to delete product.'
        )

        return
      }


      // -----------------------------
      // Remove Product From State
      // -----------------------------

      setProducts(
        (currentProducts) =>
          currentProducts.filter(
            (product) =>
              product.id !== deleteProduct.id
          )
      )


      alert(
        'Product deleted successfully.'
      )


    } catch (error) {

      console.error(
        'Product delete error:',
        error
      )


      alert(
        'Unable to delete product.'
      )

    } finally {

      setDeletingProductId(null)

      setDeleteProduct(null)

    }

  }


  // =====================================
  // Render
  // =====================================

  return (

    <section className="vendor-products-card">


      <h2>
        Products
      </h2>


      {/* =====================================
          Product Search
      ===================================== */}

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

          }}
        />

      </div>


      {/* =====================================
          Product Loading
      ===================================== */}

      {productLoading && (

        <p className="product-loading">
          Loading products...
        </p>

      )}


      {/* =====================================
          Product Error
      ===================================== */}

      {productError && (

        <p className="product-error">
          {productError}
        </p>

      )}


      {/* =====================================
          Product Cards
      ===================================== */}

      {!productLoading &&
        displayedProducts.length > 0 && (

          <div className="product-results">

            {displayedProducts.map(
              (product) => (

                <div
                  key={product.id}
                  className="product-result"
                >

                  {/* -----------------------------
                      Product Information
                  ----------------------------- */}

                  <div className="product-card-content">


                    <h3>
                      {product.feed_name}
                    </h3>


                    <p>

                      <strong>
                        Feed Type:
                      </strong>{' '}

                      {product.feed_type}

                    </p>


                    <p>

                      <strong>
                        Brand:
                      </strong>{' '}

                      {product.brand_name}

                    </p>


                    <p>

                      <strong>
                        Protein:
                      </strong>{' '}

                      {product.protein_range}

                    </p>


                    <p>

                      <strong>
                        Pellet Size:
                      </strong>{' '}

                      {product.pellet_size}

                    </p>


                    <p>

                      <strong>
                        Inventory:
                      </strong>{' '}

                      {product.inventory
                        ? product.inventory.quantity
                        : 0}

                    </p>


                    {product.description && (

                      <p>

                        <strong>
                          Description:
                        </strong>{' '}

                        {product.description}

                      </p>

                    )}

                  </div>


                  {/* -----------------------------
                      Product Actions
                  ----------------------------- */}

                  <div className="product-actions">


                    <button
                      type="button"
                      className="edit-product-button"
                      onClick={() => {

                        openEditProduct(
                          product
                        )

                      }}
                    >
                      Edit
                    </button>


                    <button
                      type="button"
                      className="delete-product-button"
                      onClick={() => {

                        setDeleteProduct(
                          product
                        )

                      }}
                      disabled={
                        deletingProductId === product.id
                      }
                    >
                      {deletingProductId === product.id
                        ? 'Deleting...'
                        : 'Delete'}
                    </button>


                  </div>


                </div>

              )
            )}

          </div>

        )}


      {/* =====================================
          No Search Results
      ===================================== */}

      {!productLoading &&
        searchText.trim() &&
        displayedProducts.length === 0 && (

          <div className="product-results">

            <p className="product-no-result">
              No products found.
            </p>

          </div>

        )}


      {/* =====================================
          Empty State
      ===================================== */}

      {!productLoading &&
        !searchText.trim() &&
        products.length === 0 &&
        !productError && (

          <>

            <p className="vendor-empty-message">
              No products added yet.
            </p>


            <div className="vendor-empty-visual">

              <div className="product-visual">
                📦
              </div>

            </div>

          </>

        )}


      {/* =====================================
          Add Product Button
      ===================================== */}

      <button
        type="button"
        className="add-product-button"
        onClick={openAddProduct}
      >
        + Add Product
      </button>


      {/* =====================================
          Add / Edit Product Form
      ===================================== */}

      {showProductForm && (

        <div className="add-product-card">


          <h3>
            {editingProduct
              ? 'Edit Product'
              : 'Add Product'}
          </h3>


          {/* =====================================
              Feed Type
          ===================================== */}

          <label>
            Feed Type
          </label>


          <select
            value={feedType}
            onChange={(event) => {

              setFeedType(
                event.target.value
              )

              setFeedName('')

            }}
          >

            <option value="">
              {feedTypeLoading
                ? 'Loading feed types...'
                : 'Select Feed Type'}
            </option>


            {feedTypes.map(
              (type) => (

                <option
                  key={type}
                  value={type}
                >
                  {type}
                </option>

              )
            )}

          </select>


          {/* =====================================
              Feed Name
          ===================================== */}

          <label>
            Feed Name
          </label>


          <select
            value={feedName}
            disabled={
              !feedType ||
              feedNameLoading
            }
            onChange={(event) => {

              setFeedName(
                event.target.value
              )

            }}
          >

            <option value="">
              {feedNameLoading
                ? 'Loading feed names...'
                : 'Select Feed Name'}
            </option>


            {feedNames.map(
              (name) => (

                <option
                  key={name}
                  value={name}
                >
                  {name}
                </option>

              )
            )}

          </select>


          {/* =====================================
              Brand Name
          ===================================== */}

          <label>
            Brand Name
          </label>


          <input
            type="text"
            value={brandName}
            onChange={(event) => {

              setBrandName(
                event.target.value
              )

            }}
            placeholder="Enter brand name"
          />


          {/* =====================================
              Protein Range
          ===================================== */}

          <label>
            Protein Range
          </label>


          <input
            type="text"
            value={proteinRange}
            onChange={(event) => {

              setProteinRange(
                event.target.value
              )

            }}
            placeholder="Example: 30-35%"
          />


          {/* =====================================
              Pellet Size
          ===================================== */}

          <label>
            Pellet Size
          </label>


          <input
            type="text"
            value={pelletSize}
            onChange={(event) => {

              setPelletSize(
                event.target.value
              )

            }}
            placeholder="Example: 2 mm"
          />


          {/* =====================================
              Image
          ===================================== */}

          <label>
            Image (Optional)
          </label>


          <input
            type="file"
            accept="image/*"
            onChange={(event) => {

              const file =
                event.target.files?.[0] || null

              setProductImage(file)

            }}
          />


          {/* =====================================
              Description
          ===================================== */}

          <label>
            Description (Optional)
          </label>


          <textarea
            value={description}
            onChange={(event) => {

              setDescription(
                event.target.value
              )

            }}
            placeholder="Enter product description"
          />


          {/* =====================================
              Inventory
          ===================================== */}

          <label>
            Inventory
          </label>


          <input
            type="number"
            min="0"
            value={inventory}
            onChange={(event) => {

              setInventory(
                event.target.value
              )

            }}
            placeholder="Enter inventory quantity"
          />


          {/* =====================================
              Buttons
          ===================================== */}

          <div className="add-product-actions">


            <button
              type="button"
              onClick={closeProductForm}
              disabled={savingProduct}
            >
              Cancel
            </button>


            <button
              type="button"
              onClick={saveProduct}
              disabled={savingProduct}
            >
              {savingProduct
                ? 'Saving...'
                : editingProduct
                  ? 'Save Changes'
                  : 'Save Product'}
            </button>


          </div>


        </div>

      )}


      {/* =====================================
          Delete Confirmation
      ===================================== */}

      {deleteProduct && (

        <div className="delete-confirmation">


          <div className="delete-confirmation-card">


            <h3>
              Delete Product?
            </h3>


            <p>
              Are you sure you want to delete
              <strong>
                {' '}
                {deleteProduct.feed_name}
              </strong>
              ?
            </p>


            <div className="delete-confirmation-actions">


              <button
                type="button"
                onClick={() => {

                  setDeleteProduct(null)

                }}
                disabled={
                  deletingProductId !== null
                }
              >
                Cancel
              </button>


              <button
                type="button"
                onClick={confirmDeleteProduct}
                disabled={
                  deletingProductId !== null
                }
              >
                {deletingProductId !== null
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


export default Product