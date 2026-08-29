import { useEffect, useState } from 'react'
import './FishFeed.css'

/* =========================================================
   Types
   ========================================================= */

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

type FeedRecommendation = {
  id: number

  feed_name: string
  feed_type?: string | null
  brand?: string | null

  fish?: number | string | null
  stage?: number | string | null
  stage_number?: number | null

  organic_suitability?: string | number | null
  stage_suitability?: string | number | null
  seasonal_suitability?: string | number | null
  special_period_suitability?: string | number | null
  effectiveness?: string | number | null
  cost_efficiency?: string | number | null

  description?: string | null
  recommended_usage?: string | null
  feeding_rate?: string | null
  price?: string | number | null

  image?: string | null

  [key: string]: unknown
}

type FishFeedProps = {
  fish: Fish | null
}


/* =========================================================
   API
   ========================================================= */

const API_BASE_URL =
  'http://127.0.0.1:8000/api'

const getStagesUrl = (
  fishId: number
) =>
  `${API_BASE_URL}/fish/${fishId}/stages/`

const getRecommendationsUrl = (
  fishId: number,
  stageId: number
) =>
  `${API_BASE_URL}/fish/${fishId}/stages/${stageId}/feed-recommendations/`
/* =========================================================
   Component
   ========================================================= */

function FishFeed({
  fish
}: FishFeedProps) {

  /* =======================================================
     Navigation State
     ======================================================= */

  const [selectedStage, setSelectedStage] =
    useState<FishStage | null>(null)

  const [selectedRecommendation, setSelectedRecommendation] =
    useState<FeedRecommendation | null>(null)


  /* =======================================================
     Stage State
     ======================================================= */

  const [stages, setStages] =
    useState<FishStage[]>([])

  const [loadingStages, setLoadingStages] =
    useState(false)


  /* =======================================================
     Recommendation State
     ======================================================= */

  const [recommendations, setRecommendations] =
    useState<FeedRecommendation[]>([])

  const [loadingRecommendations, setLoadingRecommendations] =
    useState(false)


  /* =======================================================
     Error State
     ======================================================= */

  const [error, setError] =
    useState('')


  /* =======================================================
     Load Fish Stages
     ======================================================= */

  useEffect(() => {

    if (!fish) {

      setStages([])
      setSelectedStage(null)
      setSelectedRecommendation(null)
      setRecommendations([])
      return

    }

    setSelectedStage(null)
    setSelectedRecommendation(null)
    setRecommendations([])
    setError('')
    setLoadingStages(true)

    fetch(
      getStagesUrl(fish.id)
    )
      .then((response) => {

        if (!response.ok) {

          throw new Error(
            'Unable to load fish stages.'
          )

        }

        return response.json()

      })
      .then((data) => {

        const loadedStages: FishStage[] =
          Array.isArray(data)
            ? data
            : data.results || []

        const sortedStages =
          [...loadedStages].sort(
            (a, b) =>
              a.stage_number -
              b.stage_number
          )

        setStages(sortedStages)

      })
      .catch((stageError) => {

        console.error(
          'Error loading fish stages:',
          stageError
        )

        setError(
          'Unable to load fish stages.'
        )

        setStages([])

      })
      .finally(() => {

        setLoadingStages(false)

      })

  }, [fish])


  /* =======================================================
     Load Feed Recommendations
     ======================================================= */

  const loadRecommendations = async (
  stage: FishStage
) => {

  if (!fish) {
    return
  }

  if (!stage.id) {
    setError('Unable to identify the selected stage.')
    return
  }

  setSelectedStage(stage)
  setSelectedRecommendation(null)
  setRecommendations([])
  setError('')
  setLoadingRecommendations(true)

  try {

    const response = await fetch(
      getRecommendationsUrl(
        fish.id,
        stage.id
      )
    )

    if (!response.ok) {

      const data =
        await response
          .json()
          .catch(() => ({}))

      throw new Error(
        data.detail ||
        'Unable to load feed recommendations.'
      )
    }

    const data =
      await response.json()

    const loadedRecommendations:
      FeedRecommendation[] =
      Array.isArray(data)
        ? data
        : data.results || []

    setRecommendations(
      loadedRecommendations
    )

  } catch (recommendationError) {

    console.error(
      'Error loading feed recommendations:',
      recommendationError
    )

    setError(
      recommendationError instanceof Error
        ? recommendationError.message
        : 'Unable to load feed recommendations.'
    )

  } finally {

    setLoadingRecommendations(false)

  }
}


  /* =======================================================
     Back To Stages
     ======================================================= */

  const handleBackToStages = () => {

    setSelectedStage(null)
    setSelectedRecommendation(null)
    setRecommendations([])
    setError('')

  }


  /* =======================================================
     Back To Recommendations
     ======================================================= */

  const handleBackToRecommendations = () => {

    setSelectedRecommendation(null)
    setError('')

  }


  /* =======================================================
     Helper Functions
     ======================================================= */

  const formatValue = (
    value: unknown
  ) => {

    if (
      value === null ||
      value === undefined ||
      value === ''
    ) {

      return 'Not specified'

    }

    return String(value)

  }


  const getSuitabilityClass = (
    value: unknown
  ) => {

    const normalized =
      String(value)
        .toLowerCase()
        .trim()

    if (
      normalized === 'high' ||
      normalized === 'excellent' ||
      normalized === 'very high'
    ) {

      return 'high'

    }

    if (
      normalized === 'medium' ||
      normalized === 'moderate'
    ) {

      return 'medium'

    }

    if (
      normalized === 'low' ||
      normalized === 'poor'
    ) {

      return 'low'

    }

    return ''

  }


  const renderSuitability = (
    label: string,
    value: unknown
  ) => {

    return (

      <div className="fish-feed-detail-row">

        <span className="fish-feed-detail-label">
          {label}
        </span>

        <span
          className={
            `fish-feed-suitability ` +
            getSuitabilityClass(value)
          }
        >
          {formatValue(value)}
        </span>

      </div>

    )

  }


  /* =======================================================
     No Fish
     ======================================================= */

  if (!fish) {

    return (

      <div className="fish-feed-empty">

        <h3>
          Feed Recommendations
        </h3>

        <p>
          Save the fish first to view
          feed recommendations.
        </p>

      </div>

    )

  }


  /* =======================================================
     Loading Stages
     ======================================================= */

  if (loadingStages) {

    return (

      <div className="fish-feed-loading">

        <div className="fish-feed-loading-spinner" />

        <p>
          Loading feed stages...
        </p>

      </div>

    )

  }


  /* =======================================================
     LEVEL 3
     Complete Recommendation Details
     ======================================================= */

  if (
    selectedRecommendation &&
    selectedStage
  ) {

    const recommendationIndex =
      recommendations.findIndex(
        (recommendation) =>
          recommendation.id ===
          selectedRecommendation.id
      )

    return (

      <div className="fish-feed-container">

        {/* Back */}

        <button
          type="button"
          className="fish-feed-back-button"
          onClick={
            handleBackToRecommendations
          }
        >
          ← Back to Recommendations
        </button>


        {/* Header */}

        <div className="fish-feed-header">

          <div>

            <span className="fish-feed-eyebrow">
              {fish.name}
            </span>

            <h3>
              Feed Recommendation
            </h3>

            <p>
              Stage {selectedStage.stage_number}
            </p>

          </div>

        </div>


        {/* Complete Details Card */}

        <div className="fish-feed-detail-card">

          {/* Image */}

          <div className="fish-feed-detail-image-wrapper">

            {selectedRecommendation.image ? (

              <img
                src={
                  selectedRecommendation.image
                }
                alt={
                  selectedRecommendation.feed_name
                }
                className="fish-feed-detail-image"
              />

            ) : (

              <div className="fish-feed-detail-no-image">
                No image
              </div>

            )}

          </div>


          {/* Main Information */}

          <div className="fish-feed-detail-content">

            <div className="fish-feed-detail-title-row">

              <div>

                <span className="fish-feed-rank">

                  Recommendation #
                  {recommendationIndex + 1}

                </span>

                <h3>
                  {
                    selectedRecommendation.feed_name
                  }
                </h3>

              </div>

            </div>


            {/* Basic Details */}

            <div className="fish-feed-basic-details">

              <div>

                <span>
                  Fish
                </span>

                <strong>
                  {fish.name}
                </strong>

              </div>


              <div>

                <span>
                  Stage
                </span>

                <strong>
                  Stage {
                    selectedStage.stage_number
                  }
                </strong>

              </div>


              <div>

                <span>
                  Feed Type
                </span>

                <strong>
                  {
                    formatValue(
                      selectedRecommendation.feed_type
                    )
                  }
                </strong>

              </div>


              <div>

                <span>
                  Brand
                </span>

                <strong>
                  {
                    formatValue(
                      selectedRecommendation.brand
                    )
                  }
                </strong>

              </div>

            </div>


            {/* Recommendation Factors */}

            <div className="fish-feed-section">

              <h4>
                Recommendation Factors
              </h4>

              {renderSuitability(
                'Organic Suitability',
                selectedRecommendation
                  .organic_suitability
              )}

              {renderSuitability(
                'Stage Suitability',
                selectedRecommendation
                  .stage_suitability
              )}

              {renderSuitability(
                'Seasonal Suitability',
                selectedRecommendation
                  .seasonal_suitability
              )}

              {renderSuitability(
                'Special / Breeding Period',
                selectedRecommendation
                  .special_period_suitability
              )}

              {renderSuitability(
                'Effectiveness',
                selectedRecommendation
                  .effectiveness
              )}

              {renderSuitability(
                'Cost Efficiency',
                selectedRecommendation
                  .cost_efficiency
              )}

            </div>


            {/* Usage */}

            <div className="fish-feed-section">

              <h4>
                Recommended Usage
              </h4>

              <p>
                {
                  formatValue(
                    selectedRecommendation
                      .recommended_usage
                  )
                }
              </p>

            </div>


            {/* Feeding Rate */}

            {selectedRecommendation.feeding_rate && (

              <div className="fish-feed-section">

                <h4>
                  Feeding Rate
                </h4>

                <p>
                  {
                    selectedRecommendation
                      .feeding_rate
                  }
                </p>

              </div>

            )}


            {/* Price */}

            {
              selectedRecommendation.price !== null &&
              selectedRecommendation.price !== undefined && (

                <div className="fish-feed-section">

                  <h4>
                    Cost
                  </h4>

                  <p>
                    ₹
                    {
                      formatValue(
                        selectedRecommendation.price
                      )
                    }
                  </p>

                </div>

              )
            }


            {/* Description */}

            <div className="fish-feed-section">

              <h4>
                Description
              </h4>

              <p>
                {
                  formatValue(
                    selectedRecommendation
                      .description
                  )
                }
              </p>

            </div>

          </div>

        </div>

      </div>

    )

  }


  /* =======================================================
     LEVEL 2
     Recommendation Cards
     ======================================================= */

  if (selectedStage) {

    return (

      <div className="fish-feed-container">

        {/* Back */}

        <button
          type="button"
          className="fish-feed-back-button"
          onClick={
            handleBackToStages
          }
        >
          ← Back to Stages
        </button>


        {/* Header */}

        <div className="fish-feed-header">

          <div>

            <span className="fish-feed-eyebrow">
              {fish.name}
            </span>

            <h3>
              Stage {selectedStage.stage_number}
            </h3>

            <p>
              Select a feed recommendation
              to view complete details.
            </p>

          </div>

        </div>


        {/* Error */}

        {error && (

          <div className="fish-feed-error">
            {error}
          </div>

        )}


        {/* Loading */}

        {loadingRecommendations && (

          <div className="fish-feed-loading">

            <div className="fish-feed-loading-spinner" />

            <p>
              Loading recommendations...
            </p>

          </div>

        )}


        {/* No Recommendations */}

        {!loadingRecommendations &&
          !error &&
          recommendations.length === 0 && (

          <div className="fish-feed-empty">

            <h3>
              No Recommendations
            </h3>

            <p>
              No feed recommendations have
              been configured for this stage yet.
            </p>

          </div>

        )}


        {/* Recommendation Cards */}

        {!loadingRecommendations &&
          recommendations.length > 0 && (

          <div className="fish-feed-recommendation-grid">

            {recommendations.map(
              (recommendation, index) => (

              <button
                type="button"
                key={
                  recommendation.id
                }
                className="fish-feed-recommendation-card"
                onClick={() =>
                  setSelectedRecommendation(
                    recommendation
                  )
                }
              >

                {/* Image */}

                <div className="fish-feed-card-image-wrapper">

                  {recommendation.image ? (

                    <img
                      src={
                        recommendation.image
                      }
                      alt={
                        recommendation.feed_name
                      }
                      className="fish-feed-card-image"
                    />

                  ) : (

                    <div className="fish-feed-card-no-image">
                      No image
                    </div>

                  )}

                </div>


                {/* Card Content */}

                <div className="fish-feed-card-content">

                  <span className="fish-feed-card-rank">
                    Recommendation #{index + 1}
                  </span>

                  <h4>
                    {
                      recommendation.feed_name
                    }
                  </h4>


                  {recommendation.feed_type && (

                    <span className="fish-feed-card-type">
                      {
                        recommendation.feed_type
                      }
                    </span>

                  )}


                  {/* Main Ranking Factors */}

                  <div className="fish-feed-card-factors">

                    {recommendation
                      .organic_suitability && (

                      <div>

                        <span>
                          Organic
                        </span>

                        <strong>
                          {
                            recommendation
                              .organic_suitability
                          }
                        </strong>

                      </div>

                    )}


                    {recommendation
                      .stage_suitability && (

                      <div>

                        <span>
                          Stage
                        </span>

                        <strong>
                          {
                            recommendation
                              .stage_suitability
                          }
                        </strong>

                      </div>

                    )}


                    {recommendation
                      .seasonal_suitability && (

                      <div>

                        <span>
                          Seasonal
                        </span>

                        <strong>
                          {
                            recommendation
                              .seasonal_suitability
                          }
                        </strong>

                      </div>

                    )}


                    {recommendation
                      .effectiveness && (

                      <div>

                        <span>
                          Effectiveness
                        </span>

                        <strong>
                          {
                            recommendation
                              .effectiveness
                          }
                        </strong>

                      </div>

                    )}

                  </div>


                  <span className="fish-feed-view-details">
                    View Complete Details →
                  </span>

                </div>

              </button>

            ))}

          </div>

        )}

      </div>

    )

  }


  /* =======================================================
     LEVEL 1
     Six Stage Cards
     ======================================================= */

  return (

    <div className="fish-feed-container">

      {/* Header */}

      <div className="fish-feed-header">

        <div>

          <span className="fish-feed-eyebrow">
            {fish.name}
          </span>

          <h3>
            Feed Recommendations
          </h3>

          <p>
            Select a growth stage to view
            suitable feed recommendations.
          </p>

        </div>

      </div>


      {/* Error */}

      {error && (

        <div className="fish-feed-error">
          {error}
        </div>

      )}


      {/* Six Stage Cards */}

      <div className="fish-feed-stage-grid">

        {stages.map((stage) => (

          <button
            type="button"
            key={
              stage.id ||
              stage.stage_number
            }
            className="fish-feed-stage-card"
            onClick={() =>
              loadRecommendations(stage)
            }
          >

            {/* Stage Image */}

            <div className="fish-feed-stage-image-wrapper">

              {stage.image ? (

                <img
                  src={stage.image}
                  alt={
                    `Stage ${stage.stage_number}`
                  }
                  className="fish-feed-stage-image"
                />

              ) : (

                <div className="fish-feed-stage-no-image">
                  Stage {stage.stage_number}
                </div>

              )}

            </div>


            {/* Stage Information */}

            <div className="fish-feed-stage-content">

              <span className="fish-feed-stage-number">
                STAGE {stage.stage_number}
              </span>

              <h4>
                Stage {stage.stage_number}
              </h4>


              {stage.duration_days > 0 && (

                <div className="fish-feed-stage-info">

                  <span>
                    Duration
                  </span>

                  <strong>
                    {stage.duration_days} days
                  </strong>

                </div>

              )}


              {
                (
                  stage.min_weight ||
                  stage.max_weight
                ) && (

                  <div className="fish-feed-stage-info">

                    <span>
                      Weight
                    </span>

                    <strong>

                      {stage.min_weight || '0'}

                      {' – '}

                      {stage.max_weight || '—'}

                      {' g'}

                    </strong>

                  </div>

                )
              }


              <span className="fish-feed-stage-arrow">
                View Feeds →
              </span>

            </div>

          </button>

        ))}

      </div>


      {/* No Stages */}

      {stages.length === 0 &&
        !error && (

        <div className="fish-feed-empty">

          <h3>
            No Stages Available
          </h3>

          <p>
            Add the six fish stages first
            to configure feed recommendations.
          </p>

        </div>

      )}

    </div>

  )

}


/* =========================================================
   Single Default Export
   ========================================================= */

export default FishFeed