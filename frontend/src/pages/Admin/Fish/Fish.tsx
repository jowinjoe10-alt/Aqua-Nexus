import {
  useEffect,
  useState,
  type MouseEvent,
} from 'react'

import './Fish.css'
import FishForm from './FishForm'
import FishFeed from './FishFeed/FishFeed'


type Fish = {
  id: number
  name: string
  image: string | null
  water_type: string
  feeding_habit: string
  temperature_min: string
  temperature_max: string
  ph_min: string
  ph_max: string
  culture_period_days: number
  created_at: string
}


type FishStage = {
  id?: number
  fish?: number
  stage_number: number
  image: string | null
  duration_days: number
  min_weight: string
  max_weight: string
}


type FishTab =
  | 'General Info'
  | 'Stages'
  | 'Feed'


type SortType =
  | 'id_asc'
  | 'id_desc'
  | 'name_asc'
  | 'name_desc'


type FishProps = {
  onBack?: () => void
}


function Fish({ onBack }: FishProps) {

  const [fishes, setFishes] =
    useState<Fish[]>([])

  const [search, setSearch] =
    useState('')

  const [sort, setSort] =
    useState<SortType>('id_asc')

  const [sortDropdownOpen, setSortDropdownOpen] =
    useState(false)

  const [selectedFish, setSelectedFish] =
    useState<Fish | null>(null)

  const [activeTab, setActiveTab] =
    useState<FishTab>('General Info')

  const [editingFish, setEditingFish] =
    useState<Fish | null>(null)

  const [showFishForm, setShowFishForm] =
    useState(false)

  const [deleteFish, setDeleteFish] =
    useState<Fish | null>(null)

  const [loading, setLoading] =
    useState(true)

  const [error, setError] =
    useState('')

  const [stages, setStages] =
    useState<FishStage[]>([])


  /* =====================================================
     LOAD FISH
     ===================================================== */

  const loadFishes = () => {

    setLoading(true)
    setError('')

    const params =
      new URLSearchParams()

    if (search.trim()) {

      params.set(
        'search',
        search.trim()
      )

    }

    params.set(
      'sort',
      sort
    )

    fetch(
      `http://127.0.0.1:8000/api/fish/?${params.toString()}`
    )
      .then((response) => {

        if (!response.ok) {

          throw new Error(
            'Unable to get fishes'
          )

        }

        return response.json()

      })
      .then((data) => {

        setFishes(
          data.fishes ||
          data.results ||
          data ||
          []
        )

      })
      .catch((fetchError) => {

        console.error(
          'Error getting fishes:',
          fetchError
        )

        setError(
          'Unable to load fishes.'
        )

        setFishes([])

      })
      .finally(() => {

        setLoading(false)

      })

  }


  useEffect(() => {

    loadFishes()

  }, [search, sort])


  /* =====================================================
     LOAD SELECTED FISH STAGES
     ===================================================== */

  useEffect(() => {

    if (!selectedFish) {

      setStages([])

      return

    }

    fetch(
      `http://127.0.0.1:8000/api/fish/${selectedFish.id}/stages/`
    )
      .then((response) => {

        if (!response.ok) {

          throw new Error(
            'Unable to load stages.'
          )

        }

        return response.json()

      })
      .then((data) => {

        setStages(
          Array.isArray(data)
            ? data
            : data.results || []
        )

      })
      .catch((stageError) => {

        console.error(
          'Error loading stages:',
          stageError
        )

        setStages([])

      })

  }, [selectedFish])


  /* =====================================================
     FISH DETAILS
     ===================================================== */

  const handleFishClick = (
    fish: Fish
  ) => {

    setSelectedFish(fish)

    setActiveTab(
      'General Info'
    )

  }


  const handleDetailsBack = () => {

    setSelectedFish(null)

    setStages([])

  }


  /* =====================================================
     ADD FISH
     ===================================================== */

  const handleAddFish = () => {

    setEditingFish(null)

    setShowFishForm(true)

  }


  /* =====================================================
     EDIT FISH
     ===================================================== */

  const handleEditFish = (
    event: MouseEvent,
    fish: Fish
  ) => {

    event.stopPropagation()

    setSelectedFish(null)

    setEditingFish(fish)

    setShowFishForm(true)

  }


  /* =====================================================
     DELETE
     ===================================================== */

  const handleDeleteClick = (
    event: MouseEvent,
    fish: Fish
  ) => {

    event.stopPropagation()

    setDeleteFish(fish)

  }


  const handleConfirmDelete = () => {

    if (!deleteFish) {

      return

    }

    fetch(
      `http://127.0.0.1:8000/api/fish/${deleteFish.id}/`,
      {
        method: 'DELETE'
      }
    )
      .then((response) => {

        if (!response.ok) {

          throw new Error(
            'Unable to delete fish'
          )

        }

      })
      .then(() => {

        setDeleteFish(null)

        setSelectedFish(null)

        setStages([])

        loadFishes()

      })
      .catch((deleteError) => {

        console.error(
          'Error deleting fish:',
          deleteError
        )

        setError(
          'Unable to delete fish.'
        )

        setDeleteFish(null)

      })

  }


  /* =====================================================
     FORM COMPLETE
     ===================================================== */

  const handleFormComplete = () => {

    setShowFishForm(false)

    setEditingFish(null)

    loadFishes()

  }


  /* =====================================================
     FISH DETAILS PAGE
     ===================================================== */

  if (selectedFish) {

    return (

      <section className="admin-fish-card">

        <div className="admin-fish-details">

          <button
            type="button"
            className="admin-fish-back"
            onClick={handleDetailsBack}
          >
            ← Back
          </button>


          <div className="admin-fish-details-header">

            <div className="admin-fish-details-title">

              <h2>
                {selectedFish.name}
              </h2>

              <span className="admin-fish-details-id">
                Fish ID #{selectedFish.id}
              </span>

            </div>

          </div>


          {/* TABS */}

          <div className="admin-fish-details-tabs">

            <button
              type="button"
              className={
                activeTab === 'General Info'
                  ? 'admin-fish-details-tab active'
                  : 'admin-fish-details-tab'
              }
              onClick={() =>
                setActiveTab(
                  'General Info'
                )
              }
            >
              General Info
            </button>


            <button
              type="button"
              className={
                activeTab === 'Stages'
                  ? 'admin-fish-details-tab active'
                  : 'admin-fish-details-tab'
              }
              onClick={() =>
                setActiveTab('Stages')
              }
            >
              Stages
            </button>


            <button
             type="button"
             className={
               activeTab === 'Feed'
                 ? 'admin-fish-details-tab active'
                 : 'admin-fish-details-tab'
             }
             onClick={() =>
               setActiveTab('Feed')
             }
            >
             Feed
            </button>

          </div>


          {/* =================================================
              GENERAL INFO
              ================================================= */}

          {activeTab === 'General Info' && (

            <div className="admin-fish-general">

              <div className="admin-fish-detail-image-wrapper">

                {selectedFish.image ? (

                  <img
                    src={selectedFish.image}
                    alt={selectedFish.name}
                    className="admin-fish-detail-image"
                  />

                ) : (

                  <span className="admin-fish-no-image">
                    No image available
                  </span>

                )}

              </div>


              <div className="admin-fish-general-data">

                <div className="admin-fish-data-item">

                  <span className="admin-fish-data-label">
                    Fish Name
                  </span>

                  <span className="admin-fish-data-value">
                    {selectedFish.name}
                  </span>

                </div>


                <div className="admin-fish-data-item">

                  <span className="admin-fish-data-label">
                    Water Type
                  </span>

                  <span className="admin-fish-data-value">
                    {selectedFish.water_type}
                  </span>

                </div>


                <div className="admin-fish-data-item">

                  <span className="admin-fish-data-label">
                    Feeding Habit
                  </span>

                  <span className="admin-fish-data-value">
                    {selectedFish.feeding_habit}
                  </span>

                </div>


                <div className="admin-fish-data-item">

                  <span className="admin-fish-data-label">
                    Temperature Range
                  </span>

                  <span className="admin-fish-data-value">

                    {selectedFish.temperature_min}
                    {' '}°C –{' '}
                    {selectedFish.temperature_max}
                    {' '}°C

                  </span>

                </div>


                <div className="admin-fish-data-item">

                  <span className="admin-fish-data-label">
                    pH Range
                  </span>

                  <span className="admin-fish-data-value">

                    {selectedFish.ph_min}
                    {' '}–{' '}
                    {selectedFish.ph_max}

                  </span>

                </div>


                <div className="admin-fish-data-item">

                  <span className="admin-fish-data-label">
                    Culture Period
                  </span>

                  <span className="admin-fish-data-value">

                    {selectedFish.culture_period_days}
                    {' '}days

                  </span>

                </div>

              </div>

            </div>

          )}


          {/* =================================================
              STAGES
              ================================================= */}

          {activeTab === 'Stages' && (

            <div className="admin-fish-stages">

              <h3>
                Fish Stages
              </h3>


              {stages.length === 0 ? (

                <p>
                  No stage information available.
                </p>

              ) : (

                <div className="admin-fish-stage-list">

                  {stages.map((stage) => (

                    <div
                      key={
                        stage.id ||
                        stage.stage_number
                      }
                      className="admin-fish-stage-item"
                    >

                      <h4>
                        Stage {stage.stage_number}
                      </h4>


                      {stage.image ? (

                        <img
                          src={stage.image}
                          alt={
                            `Stage ${stage.stage_number}`
                          }
                          className="admin-fish-stage-image"
                        />

                      ) : (

                        <div className="admin-fish-stage-no-image">
                          No image available
                        </div>

                      )}


                      <div className="admin-fish-stage-data">

                        <div>

                          <span>
                            Duration
                          </span>

                          <strong>
                            {stage.duration_days}
                            {' '}days
                          </strong>

                        </div>


                        <div>

                          <span>
                            Weight Range
                          </span>

                          <strong>

                            {stage.min_weight}
                            {' '}g
                            {' '}–{' '}
                            {stage.max_weight}
                            {' '}g

                          </strong>

                        </div>

                      </div>

                    </div>

                  ))}

                </div>

              )}

            </div>

          )}
          
          {activeTab === 'Feed' && (
            <FishFeed fish={selectedFish} />
          )}

        </div>

      </section>

    )

  }


  /* =====================================================
     FISH FORM
     ===================================================== */

  if (showFishForm) {

    return (

      <section className="admin-fish-card">

        <div className="admin-fish-form-page">

          <button
            type="button"
            className="admin-fish-back"
            onClick={() => {

              setShowFishForm(false)

              setEditingFish(null)

            }}
          >
            ← Back
          </button>


          <div className="admin-fish-form-wrapper">

            <FishForm
              fish={editingFish}
              onComplete={
                handleFormComplete
              }
              onCancel={() => {

                setShowFishForm(false)

                setEditingFish(null)

              }}
            />

          </div>

        </div>

      </section>

    )

  }


  /* =====================================================
     MAIN FISH PAGE
     ===================================================== */

  return (

    <section className="admin-fish-card">

      <div className="admin-fish-header">

        <div className="admin-fish-header-content">

          <h2>
            Fish
          </h2>

          <p>
            Manage fish master data.
          </p>

        </div>

      </div>


      {/* ERROR */}

      {error && (

        <div className="admin-fish-error">
          {error}
        </div>

      )}


      {/* SEARCH + SORT */}

      <div className="admin-fish-controls">

        <div className="admin-fish-search">

          <input
            type="text"
            placeholder="Search fish by name..."
            value={search}
            onChange={(event) =>
              setSearch(
                event.target.value
              )
            }
          />

        </div>


        <div className="admin-fish-sort">

          <button
            type="button"
            className="admin-fish-sort-select"
            onClick={() =>
              setSortDropdownOpen(
                (current) => !current
              )
            }
            aria-haspopup="true"
            aria-expanded={
              sortDropdownOpen
            }
          >

            <span>
              Sort
            </span>

            <span className="admin-fish-sort-arrow">

              {sortDropdownOpen
                ? '▴'
                : '▾'}

            </span>

          </button>


          {sortDropdownOpen && (

            <div className="admin-fish-sort-options">

              <button
                type="button"
                className={
                  sort === 'id_asc'
                    ? 'selected'
                    : ''
                }
                onClick={() => {

                  setSort('id_asc')

                  setSortDropdownOpen(false)

                }}
              >
                ID: Ascending
              </button>


              <button
                type="button"
                className={
                  sort === 'id_desc'
                    ? 'selected'
                    : ''
                }
                onClick={() => {

                  setSort('id_desc')

                  setSortDropdownOpen(false)

                }}
              >
                ID: Descending
              </button>


              <button
                type="button"
                className={
                  sort === 'name_asc'
                    ? 'selected'
                    : ''
                }
                onClick={() => {

                  setSort('name_asc')

                  setSortDropdownOpen(false)

                }}
              >
                Name: A - Z
              </button>


              <button
                type="button"
                className={
                  sort === 'name_desc'
                    ? 'selected'
                    : ''
                }
                onClick={() => {

                  setSort('name_desc')

                  setSortDropdownOpen(false)

                }}
              >
                Name: Z - A
              </button>

            </div>

          )}

        </div>

      </div>


      {/* FISH LIST */}

      <div className="admin-fish-list">

        {loading && (

          <div className="admin-fish-loading">
            Loading fishes...
          </div>

        )}


        {!loading &&
          fishes.map((fish) => (

            <div
              key={fish.id}
              className="admin-fish-item"
              role="button"
              tabIndex={0}
              onClick={() =>
                handleFishClick(fish)
              }
              onKeyDown={(event) => {

                if (
                  event.key === 'Enter' ||
                  event.key === ' '
                ) {

                  event.preventDefault()

                  handleFishClick(fish)

                }

              }}
            >

              <div className="admin-fish-item-id">
                #{fish.id}
              </div>


              <div className="admin-fish-item-name">
                {fish.name}
              </div>


              <div className="admin-fish-actions">

                <button
                  type="button"
                  className="admin-fish-edit"
                  aria-label={
                    `Edit ${fish.name}`
                  }
                  onClick={(event) =>
                    handleEditFish(
                      event,
                      fish
                    )
                  }
                >
                  ⋮
                </button>


                <button
                  type="button"
                  className="admin-fish-delete"
                  aria-label={
                    `Delete ${fish.name}`
                  }
                  onClick={(event) =>
                    handleDeleteClick(
                      event,
                      fish
                    )
                  }
                >
                  🗑
                </button>

              </div>

            </div>

          ))}


        {!loading &&
          fishes.length === 0 && (

            <div className="admin-fish-empty">
              No fishes found.
            </div>

          )}

      </div>


      {/* ADD FISH */}

      <div className="admin-fish-add-wrapper">

        <button
          type="button"
          className="admin-fish-add-button"
          onClick={handleAddFish}
        >

          <span className="admin-fish-add-icon">
            +
          </span>

          <span>
            Add Fish
          </span>

        </button>

      </div>


      {/* DELETE CONFIRMATION */}

      {deleteFish && (

        <div
          className="admin-fish-delete-overlay"
          onClick={() =>
            setDeleteFish(null)
          }
        >

          <div
            className="admin-fish-delete-dialog"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            <h3>
              Delete Fish?
            </h3>


            <p>

              Are you sure you want to delete
              {' '}

              <strong>
                {deleteFish.name}
              </strong>

              ?

            </p>


            <div className="admin-fish-delete-actions">

              <button
                type="button"
                className="admin-fish-cancel-delete"
                onClick={() =>
                  setDeleteFish(null)
                }
              >
                Cancel
              </button>


              <button
                type="button"
                className="admin-fish-confirm-delete"
                onClick={
                  handleConfirmDelete
                }
              >
                Delete
              </button>

            </div>

          </div>

        </div>

      )}

    </section>

  )

}


export default Fish