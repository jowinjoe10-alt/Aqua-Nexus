import { useEffect, useState } from 'react'
import './FarmerPond.css'

import {
  calculateFeedRequirement,
  formatFeedAmount
} from '../../utils/feedCalculation'


/* =========================================================
   Types
   ========================================================= */

type FeedRecommendation = {

  id: number

  fish_stage: number

  fish_name: string

  stage_number: number

  feed_name: string | null

  feed_type: string | null

  feed_form: string

  protein_min: string

  protein_max: string

  particle_size_min: string

  particle_size_max: string

  organic: boolean

}


type PondRecommendation = {
 
  id: string
 
  feed_name: string
 
  fish_name: string
 
  stage_number: number
 
  required_min: string
 
  required_max: string
 
  organic: boolean
 
  feed_type: string | null
 
  protein_min: string
 
  protein_max: string
 
  particle_size_min: string
 
  particle_size_max: string

}


interface FarmerPondProps {
  onGoToVendor: (
    recommendation: PondRecommendation
  ) => void
}



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

}


type FishStage = {

  id: number

  fish: number

  stage_number: number

  image: string | null

  duration_days: number

  min_weight: string | null

  max_weight: string | null

}


type PondFish = {

  id: number

  pond: number

  fish: number

  fish_name: string

  quantity: number

  current_stage: number

  stage_number: number

  min_weight: string | null

  max_weight: string | null

  feed_recommendations: FeedRecommendation[]

  stage_started_at: string

  created_at: string

  updated_at: string

}


type Pond = {

  id: number

  farmer: number

  name: string

  created_at: string

  updated_at: string

  fish: PondFish[]

}



function FarmerPond({
  onGoToVendor
}: FarmerPondProps) {
/* =========================================================
   Component
   ========================================================= */


  /* =======================================================
     Pond State
     ======================================================= */

  const [ponds, setPonds] =
    useState<Pond[]>([])

  const [showAddPond, setShowAddPond] =
    useState(false)

  const [pondName, setPondName] =
    useState('')

  const [error, setError] =
    useState('')

  const [loading, setLoading] =
    useState(true)


  /* =======================================================
     Selected Pond
     ======================================================= */

  const [selectedPond, setSelectedPond] =
    useState<Pond | null>(null)


  /* =======================================================
     Add Fish State
     ======================================================= */

  const [showAddFish, setShowAddFish] =
    useState(false)

  const [fishList, setFishList] =
    useState<Fish[]>([])

  const [stages, setStages] =
    useState<FishStage[]>([])

  const [selectedFish, setSelectedFish] =
    useState<Fish | null>(null)

  const [selectedStage, setSelectedStage] =
    useState<FishStage | null>(null)

  const [fishQuantity, setFishQuantity] =
    useState('')

  const [fishError, setFishError] =
    useState('')

  const [fishLoading, setFishLoading] =
    useState(false)


  /* =========================================================
     Pond Feed Recommendations
     ========================================================= */

  const [pondRecommendations, setPondRecommendations] =
    useState<PondRecommendation[]>([])

  const [recommendationLoading, setRecommendationLoading] =
    useState(false)

  const [recommendationError, setRecommendationError] =
    useState('')

  const [recommendationIndex, setRecommendationIndex] =
    useState(0)


  /* =========================================================
     Get Farmer ID
     ========================================================= */

  const getFarmerId = () => {

    const account =
      localStorage.getItem(
        'aquaNexusAccount'
      )


    if (!account) {

      return null

    }


    const accountData =
      JSON.parse(account)


    if (
      accountData.role !== 'farmer'
    ) {

      return null

    }


    return String(
      accountData.id
    )

  }


  /* =========================================================
     Load Ponds
     ========================================================= */

  const loadPonds = async () => {

    const farmerId =
      getFarmerId()


    if (!farmerId) {

      setError(
        'Farmer information was not found.'
      )

      setLoading(false)

      return

    }


    try {

      const response =
        await fetch(
          `/api/pond/?farmer_id=${farmerId}`
        )


      if (!response.ok) {

        throw new Error(
          'Failed to load ponds.'
        )

      }


      const data =
        await response.json()


      setPonds(data)

    } catch (error) {

      console.error(error)

      setError(
        'Unable to load ponds.'
      )

    } finally {

      setLoading(false)

    }

  }


  /* =========================================================
     Load Ponds On Page Load
     ========================================================= */

  useEffect(() => {

    loadPonds()

  }, [])


  /* =========================================================
     Add Pond
     ========================================================= */

  const handleAddPond = async () => {

    const trimmedName =
      pondName.trim()


    if (!trimmedName) {

      setError(
        'Please enter a pond name.'
      )

      return

    }


    const farmerId =
      getFarmerId()


    if (!farmerId) {

      setError(
        'Farmer information was not found.'
      )

      return

    }


    try {

      const response =
        await fetch(
          '/api/pond/',
          {
            method: 'POST',

            headers: {
              'Content-Type':
                'application/json'
            },

            body: JSON.stringify({
              farmer:
                Number(farmerId),

              name:
                trimmedName
            })
          }
        )


      const responseText =
        await response.text()


      console.log(
        'POND CREATE STATUS:',
        response.status
      )


      console.log(
        'POND CREATE RESPONSE:',
        responseText
      )


      if (!response.ok) {

        throw new Error(
          `Pond creation failed: ${response.status} - ${responseText}`
        )

      }


      const newPond =
        JSON.parse(responseText)


      setPonds(
        (currentPonds) => [
          ...currentPonds,
          newPond
        ]
      )


      setPondName('')

      setError('')

      setShowAddPond(false)


    } catch (error) {

      console.error(error)

      setError(
        'Unable to create pond.'
      )

    }

  }


  /* =========================================================
     Cancel Add Pond
     ========================================================= */

  const handleCancelAddPond = () => {

    setPondName('')

    setError('')

    setShowAddPond(false)

  }


  /* =========================================================
     Delete Pond
     ========================================================= */

  const handleDeletePond = async (
    pondId: number
  ) => {

    const confirmed =
      window.confirm(
        'Are you sure you want to delete this pond?'
      )


    if (!confirmed) {

      return

    }


    try {

      const response =
        await fetch(
          `/api/pond/${pondId}/`,
          {
            method: 'DELETE'
          }
        )


      if (!response.ok) {

        throw new Error(
          'Failed to delete pond.'
        )

      }


      setPonds(
        (currentPonds) =>
          currentPonds.filter(
            (pond) =>
              pond.id !== pondId
          )
      )


      if (
        selectedPond &&
        selectedPond.id === pondId
      ) {

        setSelectedPond(null)

        setPondRecommendations([])

      }


    } catch (error) {

      console.error(error)

      setError(
        'Unable to delete pond.'
      )

    }

  }


  /* =========================================================
     Open Pond Details
     ========================================================= */

  const handleViewDetails = (
    pond: Pond
  ) => {

    setSelectedPond(pond)

    setShowAddFish(false)

    setFishError('')

    setRecommendationIndex(0)

  }


  /* =========================================================
     Back To Pond List
     ========================================================= */

  const handleBackToPonds = () => {

    setSelectedPond(null)

    setShowAddFish(false)

    setSelectedFish(null)

    setSelectedStage(null)

    setStages([])

    setFishQuantity('')

    setFishError('')

    setPondRecommendations([])

    setRecommendationError('')

    setRecommendationIndex(0)

  }


  /* =========================================================
     Load All Fish
     ========================================================= */

  const loadFish = async () => {

    setFishLoading(true)


    try {

      const response =
        await fetch(
          '/api/fish/'
        )


      if (!response.ok) {

        throw new Error(
          'Failed to load fish.'
        )

      }


      const data =
        await response.json()


      setFishList(data)


    } catch (error) {

      console.error(error)

      setFishError(
        'Unable to load fish.'
      )


    } finally {

      setFishLoading(false)

    }

  }


  /* =========================================================
     Open Add Fish
     ========================================================= */

  const handleOpenAddFish = () => {

    setShowAddFish(true)

    setSelectedFish(null)

    setSelectedStage(null)

    setStages([])

    setFishQuantity('')

    setFishError('')

    loadFish()

  }


  /* =========================================================
     Select Fish
     ========================================================= */

  const handleSelectFish = async (
    fish: Fish
  ) => {

    setSelectedFish(fish)

    setSelectedStage(null)

    setFishQuantity('')

    setFishError('')


    try {

      const response =
        await fetch(
          `/api/fish/${fish.id}/stages/`
        )


      if (!response.ok) {

        throw new Error(
          'Failed to load stages.'
        )

      }


      const data =
        await response.json()


      setStages(data)


    } catch (error) {

      console.error(error)

      setFishError(
        'Unable to load fish stages.'
      )

    }

  }


  /* =========================================================
     Select Stage
     ========================================================= */

  const handleSelectStage = (
    stage: FishStage
  ) => {

    setSelectedStage(stage)

    setFishError('')

  }


  /* =========================================================
     Add Fish To Pond
     ========================================================= */

  const handleAddFish = async () => {

    if (!selectedPond) {

      return

    }


    if (!selectedFish) {

      setFishError(
        'Please select a fish.'
      )

      return

    }


    if (!selectedStage) {

      setFishError(
        'Please select a stage.'
      )

      return

    }


    const quantity =
      Number(fishQuantity)


    if (
      !fishQuantity ||
      quantity <= 0
    ) {

      setFishError(
        'Please enter a valid quantity.'
      )

      return

    }


    try {

      const response =
        await fetch(
          `/api/pond/${selectedPond.id}/fish/`,
          {
            method: 'POST',

            headers: {
              'Content-Type':
                'application/json'
            },

            body: JSON.stringify({

              fish:
                selectedFish.id,

              quantity:
                quantity,

              current_stage:
                selectedStage.id,

              stage_started_at:
                new Date().toISOString()

            })
          }
        )


      if (!response.ok) {

        throw new Error(
          'Failed to add fish.'
        )

      }


      const newPondFish =
        await response.json()


      const updatedPond = {

        ...selectedPond,

        fish: [
          ...selectedPond.fish,
          newPondFish
        ]

      }


      setSelectedPond(
        updatedPond
      )


      setPonds(
        (currentPonds) =>
          currentPonds.map(
            (pond) =>
              pond.id === selectedPond.id
                ? updatedPond
                : pond
          )
      )


      setSelectedFish(null)

      setSelectedStage(null)

      setStages([])

      setFishQuantity('')

      setFishError('')

      setShowAddFish(false)


    } catch (error) {

      console.error(error)

      setFishError(
        'Unable to add fish to the pond.'
      )

    }

  }


  /* =========================================================
     Load Pond Feed Recommendations
     ========================================================= */

  const loadPondRecommendations = async (
    pondFish: PondFish[]
  ) => {

    if (pondFish.length === 0) {

      setPondRecommendations([])

      setRecommendationError('')

      setRecommendationIndex(0)

      return

    }


    try {

      setRecommendationLoading(true)

      setRecommendationError('')


      const recommendationGroups =
        await Promise.all(

          pondFish.map(
            async (pondFishItem) => {


              /* =========================================
                 Load Current Stage
                 ========================================= */

              const stageResponse =
                await fetch(
                  `/api/fish/${pondFishItem.fish}/stages/${pondFishItem.current_stage}/`
                )


              if (!stageResponse.ok) {

                throw new Error(
                  `Failed to load stage for ${pondFishItem.fish_name}.`
                )

              }


              const stage =
                await stageResponse.json()


              /* =========================================
                 Calculate Required Feed
                 ========================================= */

              const calculation =
                calculateFeedRequirement(
                  stage,
                  pondFishItem.quantity
                )


              if (!calculation) {

                return []

              }


              /* =========================================
                 Load Recommendations
                 ========================================= */

              const recommendationResponse =
                await fetch(
                  `/api/fish/${pondFishItem.fish}/stages/${pondFishItem.current_stage}/feed-recommendations/`
                )


              if (!recommendationResponse.ok) {

                throw new Error(
                  `Failed to load recommendations for ${pondFishItem.fish_name}.`
                )

              }


              const recommendationData =
                await recommendationResponse.json()


              const feeds: FeedRecommendation[] =
                Array.isArray(
                  recommendationData
                )
                  ? recommendationData
                  : recommendationData.results || []


              /* =========================================
                 Create Recommendation Cards
                 ========================================= */

              return feeds.map(
                (feed) => {

                  return {

                    id:
                      `${pondFishItem.id}-${feed.id}`,

                    feed_name:
                      feed.feed_name ||
                      'Feed Product',

                    fish_name:
                      feed.fish_name ||
                      pondFishItem.fish_name,

                    stage_number:
                      feed.stage_number ||
                      pondFishItem.stage_number,

                    required_min:
                      formatFeedAmount(
                        calculation.minimumFeed,
                        stage
                      ),

                    required_max:
                      formatFeedAmount(
                        calculation.maximumFeed,
                        stage
                      ),

                    organic:
                      feed.organic,

                    feed_type:
                      feed.feed_type,

                    protein_min:
                      feed.protein_min,

                    protein_max:
                      feed.protein_max,

                    particle_size_min:
                      feed.particle_size_min,

                    particle_size_max:
                      feed.particle_size_max,

                  }

                }
              )

            }
          )

        )


      /* =========================================
         Flatten Recommendation Groups
         ========================================= */

      const flattenedRecommendations =
        recommendationGroups.flat()


      setPondRecommendations(
        flattenedRecommendations
      )


      setRecommendationIndex(0)


    } catch (error) {

      console.error(
        'Pond recommendation error:',
        error
      )


      setPondRecommendations([])


      setRecommendationError(
        'Unable to load recommended feeds.'
      )


    } finally {

      setRecommendationLoading(false)

    }

  }


  /* =========================================================
     Load Recommendations When Pond Changes
     ========================================================= */

  useEffect(() => {

    if (!selectedPond) {

      setPondRecommendations([])

      setRecommendationError('')

      setRecommendationIndex(0)

      return

    }


    loadPondRecommendations(
      selectedPond.fish
    )

  }, [selectedPond])


  /* =========================================================
     Recommendation Navigation
     ========================================================= */

  const visibleRecommendationCount =
    4


  const canMoveNext =
    recommendationIndex +
      visibleRecommendationCount <
    pondRecommendations.length


  const canMovePrevious =
    recommendationIndex > 0


  const handleRecommendationNext = () => {

    if (!canMoveNext) {

      return

    }


    setRecommendationIndex(
      (currentIndex) =>
        currentIndex + 1
    )

  }


  const handleRecommendationPrevious = () => {

    if (!canMovePrevious) {

      return

    }


    setRecommendationIndex(
      (currentIndex) =>
        currentIndex - 1
    )

  }


  /* =========================================================
     Cancel Add Fish
     ========================================================= */

  const handleCancelAddFish = () => {

    setShowAddFish(false)

    setSelectedFish(null)

    setSelectedStage(null)

    setStages([])

    setFishQuantity('')

    setFishError('')

  }


  /* =========================================================
     Loading
     ========================================================= */

  if (loading) {

    return (

      <div className="farmer-pond-container">

        <div className="farmer-pond-empty">

          <h3>
            Loading Ponds...
          </h3>

        </div>

      </div>

    )

  }


  /* =========================================================
     Pond Details Page
     ========================================================= */

  if (selectedPond) {

    return (

      <div className="farmer-pond-container">


        {/* =================================================
           Details Header
           ================================================= */}

        <div className="farmer-pond-header">

          <div>

            <span className="farmer-pond-eyebrow">
              AQUA NEXUS
            </span>

            <h2>
              {selectedPond.name}
            </h2>

            <p>
              Manage the fish in this pond
              and monitor their feeding
              requirements.
            </p>

          </div>


          <button
            type="button"
            className="farmer-pond-add-button"
            onClick={
              handleBackToPonds
            }
          >
            ← Back to Ponds
          </button>

        </div>


        {/* =================================================
           Add Fish Button
           ================================================= */}

        {!showAddFish && (

          <button
            type="button"
            className="farmer-pond-add-button"
            onClick={
              handleOpenAddFish
            }
          >
            + Add Fish
          </button>

        )}


        {/* =================================================
           Add Fish Section
           ================================================= */}

        {showAddFish && (

          <div className="farmer-pond-form-card">


            <div className="farmer-pond-form-header">

              <span className="farmer-pond-form-eyebrow">
                POND FISH
              </span>

              <h3>
                Add Fish
              </h3>

            </div>


            {/* Fish Selection */}

            <div className="farmer-pond-form-group farmer-pond-fish-selection-group">

              <label>
                Select Fish
              </label>


              {fishLoading && (

                <p>
                  Loading fish...
                </p>

              )}


              {!fishLoading && (

                <div className="farmer-pond-fish-grid">

                  {fishList.map(
                    (fish) => (

                      <button
                        key={fish.id}
                        type="button"
                        className={`farmer-pond-fish-option ${
                          selectedFish?.id === fish.id
                            ? 'selected'
                            : ''
                        }`}
                        onClick={() =>
                          handleSelectFish(
                            fish
                          )
                        }
                      >

                        {fish.image && (

                          <img
                            src={
                              fish.image
                            }
                            alt={
                              fish.name
                            }
                            width="60"
                          />

                        )}

                        <span>
                          {fish.name}
                        </span>

                      </button>

                    )
                  )}

                </div>

              )}

            </div>


            {/* Selected Fish */}

            {selectedFish && (

              <div>

                <div className="farmer-pond-selected-fish">

                  <span>
                    Selected Fish
                  </span>

                  <h4>
                    {selectedFish.name}
                  </h4>

                </div>


                {/* Stage Selection */}

                <div className="farmer-pond-form-group farmer-pond-stage-selection-group">

                  <label>
                    Select Stage
                  </label>


                  <div className="farmer-pond-stage-grid">

                    {stages.map(
                      (stage) => (

                        <button
                          key={stage.id}
                          type="button"
                          className={`farmer-pond-stage-option ${
                            selectedStage?.id === stage.id
                              ? 'selected'
                              : ''
                          }`}
                          onClick={() =>
                            handleSelectStage(
                              stage
                            )
                          }
                        >

                          {stage.image && (

                            <img
                              src={
                                stage.image
                              }
                              alt={`Stage ${stage.stage_number}`}
                              width="80"
                            />

                          )}

                          <span>
                            Stage {
                              stage.stage_number
                            }
                          </span>

                        </button>

                      )
                    )}

                  </div>

                </div>


                {/* Quantity */}

                <div className="farmer-pond-form-group">

                  <label
                    htmlFor="fish-quantity"
                  >
                    Quantity
                  </label>

                  <input
                    id="fish-quantity"
                    type="number"
                    min="1"
                    value={
                      fishQuantity
                    }
                    onChange={(event) =>
                      setFishQuantity(
                        event.target.value
                      )
                    }
                    placeholder="Enter quantity"
                  />

                </div>

              </div>

            )}


            {/* Error */}

            {fishError && (

              <div className="farmer-pond-error">

                {fishError}

              </div>

            )}


            {/* Actions */}

            <div className="farmer-pond-form-actions">

              <button
                type="button"
                className="farmer-pond-cancel-button"
                onClick={
                  handleCancelAddFish
                }
              >
                Cancel
              </button>


              <button
                type="button"
                className="farmer-pond-save-button"
                onClick={
                  handleAddFish
                }
              >
                Save Fish
              </button>

            </div>


          </div>

        )}


        {/* =================================================
           Fish In Pond
           ================================================= */}

        {!showAddFish &&
          selectedPond.fish.length === 0 && (

          <div className="farmer-pond-empty">

            <div className="farmer-pond-empty-icon">
              +
            </div>

            <h3>
              No Fish Added
            </h3>

            <p>
              Add fish to this pond to
              start managing their stages
              and feed requirements.
            </p>

            <button
              type="button"
              className="farmer-pond-empty-button"
              onClick={
                handleOpenAddFish
              }
            >
              Add Fish
            </button>

          </div>

        )}


        {!showAddFish &&
          selectedPond.fish.length > 0 && (

          <div>

            <h3>
              Fish in this Pond
            </h3>


            <div className="farmer-pond-grid">

              {selectedPond.fish.map(
                (pondFish) => (

                  <div
                    key={
                      pondFish.id
                    }
                    className="farmer-pond-card"
                  >

                    <div className="farmer-pond-card-header">

                      <div>

                        <span className="farmer-pond-card-label">
                          FISH
                        </span>

                        <h3>
                          {
                            pondFish.fish_name
                          }
                        </h3>

                      </div>

                    </div>


                    <div className="farmer-pond-info">

                      <div className="farmer-pond-info-item">

                        <span>
                          Quantity
                        </span>

                        <strong>
                          {
                            pondFish.quantity
                          }
                        </strong>

                      </div>


                      <div className="farmer-pond-info-item">

                        <span>
                          Stage
                        </span>

                        <strong>
                          Stage {
                            pondFish.stage_number
                          }
                        </strong>

                      </div>


                      <div className="farmer-pond-info-item">

                        <span>
                          Added
                        </span>

                        <strong>
                          {new Date(
                            pondFish.created_at
                          ).toLocaleDateString()}
                        </strong>

                      </div>

                    </div>

                  </div>

                )
              )}

            </div>


            {/* =================================================
               Recommended Feeds
               ================================================= */}

            <div className="farmer-pond-recommendations">


              <div className="farmer-pond-recommendations-header">

                <h3>
                  Recommended Feeds
                </h3>

                <p>
                  Based on the fish, stage and
                  quantity in this pond.
                </p>

              </div>


              {/* Loading */}

              {recommendationLoading && (

                <div className="farmer-pond-recommendation-empty">

                  Loading recommended feeds...

                </div>

              )}


              {/* Error */}

              {!recommendationLoading &&
                recommendationError && (

                <div className="farmer-pond-recommendation-empty">

                  {recommendationError}

                </div>

              )}


              {/* No Recommendations */}

              {!recommendationLoading &&
                !recommendationError &&
                pondRecommendations.length === 0 && (

                <div className="farmer-pond-recommendation-empty">

                  No feed recommendations are
                  available for the fish in this pond.

                </div>

              )}


              {/* Recommendation Cards */}

              {!recommendationLoading &&
                !recommendationError &&
                pondRecommendations.length > 0 && (

                <div className="farmer-pond-recommendation-wrapper">


                  {/* Previous */}

                  {canMovePrevious && (

                    <button
                      type="button"
                      className="farmer-pond-recommendation-arrow previous"
                      onClick={
                        handleRecommendationPrevious
                      }
                      aria-label="Previous recommendations"
                    >
                      ←
                    </button>

                  )}


                  {/* Cards */}

                  <div className="farmer-pond-recommendation-grid">

                    {pondRecommendations
                      .slice(
                        recommendationIndex,
                        recommendationIndex +
                          visibleRecommendationCount
                      )
                      .map(
                        (recommendation) => (

                          <div
                            key={recommendation.id}
                            className="farmer-pond-recommendation-card"
                            onClick={() => 
                              onGoToVendor(
                                recommendation
                              )
                            }
                          >


                            <div className="farmer-pond-recommendation-card-top">

                              <div>

                                <span className="farmer-pond-recommendation-label">
                                  FEED
                                </span>

                                <h4>
                                  {
                                    recommendation.feed_name
                                  }
                                </h4>

                                <p>
                                  {
                                    recommendation.fish_name
                                  }
                                </p>

                              </div>


                              <span className="farmer-pond-recommendation-badge">

                                {recommendation.organic
                                  ? 'Organic'
                                  : 'Recommended'}

                              </span>

                            </div>


                            <div className="farmer-pond-recommendation-details">


                              <div>

                                <span>
                                  STAGE
                                </span>

                                <strong>
                                  Stage {
                                    recommendation.stage_number
                                  }
                                </strong>

                              </div>


                              <div>

                                <span>
                                  REQUIRED PER DAY
                                </span>

                                <strong>
                                  {
                                    recommendation.required_min
                                  }
                                  {' – '}
                                  {
                                    recommendation.required_max
                                  }
                                </strong>

                              </div>


                            </div>


                          </div>

                        )
                      )}

                  </div>


                  {/* Next */}

                  {canMoveNext && (

                    <button
                      type="button"
                      className="farmer-pond-recommendation-arrow next"
                      onClick={
                        handleRecommendationNext
                      }
                      aria-label="Next recommendations"
                    >
                      →
                    </button>

                  )}


                </div>

              )}

            </div>


          </div>

        )}


      </div>

    )

  }


  /* =========================================================
     Main Pond Page
     ========================================================= */

  return (

    <div className="farmer-pond-container">


      {/* =================================================
         Header
         ================================================= */}

      <div className="farmer-pond-header">

        <div>

          <span className="farmer-pond-eyebrow">
            AQUA NEXUS
          </span>

          <h2>
            My Ponds
          </h2>

          <p>
            Manage your ponds and monitor
            your aquaculture activities.
          </p>

        </div>


        <button
          type="button"
          className="farmer-pond-add-button"
          onClick={() =>
            setShowAddPond(true)
          }
        >
          + Add Pond
        </button>

      </div>


      {/* =================================================
         Add Pond Form
         ================================================= */}

      {showAddPond && (

        <div className="farmer-pond-form-card">


          <div className="farmer-pond-form-header">

            <span className="farmer-pond-form-eyebrow">
              NEW POND
            </span>

            <h3>
              Add Pond
            </h3>

          </div>


          <div className="farmer-pond-form-group">

            <label htmlFor="pond-name">
              Pond Name
            </label>

            <input
              id="pond-name"
              type="text"
              value={pondName}
              onChange={(event) =>
                setPondName(
                  event.target.value
                )
              }
              placeholder="Enter pond name"
              autoFocus
            />

          </div>


          {error && (

            <div className="farmer-pond-error">

              {error}

            </div>

          )}


          <div className="farmer-pond-form-actions">

            <button
              type="button"
              className="farmer-pond-cancel-button"
              onClick={
                handleCancelAddPond
              }
            >
              Cancel
            </button>


            <button
              type="button"
              className="farmer-pond-save-button"
              onClick={
                handleAddPond
              }
            >
              Save Pond
            </button>

          </div>


        </div>

      )}


      {/* =================================================
         Empty State
         ================================================= */}

      {ponds.length === 0 && (

        <div className="farmer-pond-empty">

          <div className="farmer-pond-empty-icon">
            +
          </div>

          <h3>
            No Ponds Added
          </h3>

          <p>
            Create your first pond to
            start managing your
            aquaculture activities.
          </p>

          <button
            type="button"
            className="farmer-pond-empty-button"
            onClick={() =>
              setShowAddPond(true)
            }
          >
            Add Your First Pond
          </button>

        </div>

      )}


      {/* =================================================
         Pond Cards
         ================================================= */}

      {ponds.length > 0 && (

        <div className="farmer-pond-grid">

          {ponds.map(
            (pond) => (

              <div
                key={pond.id}
                className="farmer-pond-card"
              >


                {/* Card Header */}

                <div className="farmer-pond-card-header">

                  <div>

                    <span className="farmer-pond-card-label">
                      POND
                    </span>

                    <h3>
                      {pond.name}
                    </h3>

                  </div>

                </div>


                {/* Pond Information */}

                <div className="farmer-pond-info">


                  <div className="farmer-pond-info-item">

                    <span>
                      Fish
                    </span>

                    <strong>
                      {
                        pond.fish.length
                      }
                    </strong>

                  </div>


                  <div className="farmer-pond-info-item">

                    <span>
                      Pond ID
                    </span>

                    <strong>
                      #{pond.id}
                    </strong>

                  </div>


                  <div className="farmer-pond-info-item">

                    <span>
                      Created
                    </span>

                    <strong>
                      {new Date(
                        pond.created_at
                      ).toLocaleDateString()}
                    </strong>

                  </div>


                </div>


                {/* Actions */}

                <div className="farmer-pond-card-actions">


                  <button
                    type="button"
                    className="farmer-pond-view-button"
                    onClick={() =>
                      handleViewDetails(
                        pond
                      )
                    }
                  >
                    View Details →
                  </button>


                  <button
                    type="button"
                    className="farmer-pond-delete-button"
                    onClick={() =>
                      handleDeletePond(
                        pond.id
                      )
                    }
                  >
                    Delete
                  </button>


                </div>


              </div>

            )
          )}

        </div>

      )}


    </div>

  )

}


export default FarmerPond