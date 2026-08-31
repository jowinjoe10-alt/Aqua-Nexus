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
  min_weight: string | null
  max_weight: string | null
}

type FeedRecommendation = {
  id: number

  fish_stage?: number | null
  fish_name?: string | null
  stage_number?: number | null

  feed_name?: string | null
  feed_type?: string | null
  feed_form?: string | null

  protein_min?: number | string | null
  protein_max?: number | string | null

  particle_size_min?: number | string | null
  particle_size_max?: number | string | null

  organic?: boolean | null

  created_at?: string | null
  updated_at?: string | null
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

function FarmerFeed({
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

      setError(
        'Unable to identify the selected stage.'
      )

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


  const formatRange = (
    min: unknown,
    max: unknown,
    unit = ''
  ) => {

    const hasMin =
      min !== null &&
      min !== undefined &&
      min !== ''

    const hasMax =
      max !== null &&
      max !== undefined &&
      max !== ''

    if (!hasMin && !hasMax) {
      return 'Not specified'
    }

    if (hasMin && hasMax) {

      return `${min} – ${max}${unit}`

    }

    if (hasMin) {

      return `${min}${unit}`

    }

    return `${max}${unit}`

  }


  const getOrganicText = (
    value: boolean | null | undefined
  ) => {

    if (value === true) {
      return 'Yes'
    }

    if (value === false) {
      return 'No'
    }

    return 'Not specified'

  }


  const getOrganicClass = (
    value: boolean | null | undefined
  ) => {

    if (value === true) {
      return 'organic-yes'
    }

    if (value === false) {
      return 'organic-no'
    }

    return ''

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
                    formatValue(
                      selectedRecommendation.feed_name
                    )
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
                  Feed Form
                </span>

                <strong>
                  {
                    formatValue(
                      selectedRecommendation.feed_form
                    )
                  }
                </strong>

              </div>

            </div>


            {/* Feed Specifications */}

            <div className="fish-feed-section">

              <h4>
                Feed Specifications
              </h4>


              {/* Protein */}

              <div className="fish-feed-detail-row">

                <span className="fish-feed-detail-label">
                  Protein
                </span>

                <span>
                  {
                    formatRange(
                      selectedRecommendation.protein_min,
                      selectedRecommendation.protein_max,
                      '%'
                    )
                  }
                </span>

              </div>


              {/* Particle Size */}

              <div className="fish-feed-detail-row">

                <span className="fish-feed-detail-label">
                  Particle Size
                </span>

                <span>
                  {
                    formatRange(
                      selectedRecommendation.particle_size_min,
                      selectedRecommendation.particle_size_max,
                      ' mm'
                    )
                  }
                </span>

              </div>


              {/* Organic */}

              <div className="fish-feed-detail-row">

                <span className="fish-feed-detail-label">
                  Organic Feed
                </span>

                <span
                  className={
                    `fish-feed-suitability ` +
                    getOrganicClass(
                      selectedRecommendation.organic
                    )
                  }
                >
                  {
                    getOrganicText(
                      selectedRecommendation.organic
                    )
                  }
                </span>

              </div>

            </div>


            {/* Feed Information */}

            <div className="fish-feed-section">

              <h4>
                Feed Information
              </h4>

              <p>
                This feed is configured as a
                recommendation for {fish.name}
                during Stage {
                  selectedStage.stage_number
                }.
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

                {/* Card Content */}

                <div className="fish-feed-card-content">

                  <span className="fish-feed-card-rank">
                    Recommendation #{index + 1}
                  </span>

                  <h4>
                    {
                      formatValue(
                        recommendation.feed_name
                      )
                    }
                  </h4>


                  {/* Feed Type */}

                  {recommendation.feed_type && (

                    <span className="fish-feed-card-type">
                      {
                        recommendation.feed_type
                      }
                    </span>

                  )}


                  {/* Main Feed Information */}

                  <div className="fish-feed-card-factors">

                    <div>

                      <span>
                        Form
                      </span>

                      <strong>
                        {
                          formatValue(
                            recommendation.feed_form
                          )
                        }
                      </strong>

                    </div>


                    <div>

                      <span>
                        Protein
                      </span>

                      <strong>
                        {
                          formatRange(
                            recommendation.protein_min,
                            recommendation.protein_max,
                            '%'
                          )
                        }
                      </strong>

                    </div>


                    <div>

                      <span>
                        Particle Size
                      </span>

                      <strong>
                        {
                          formatRange(
                            recommendation.particle_size_min,
                            recommendation.particle_size_max,
                            ' mm'
                          )
                        }
                      </strong>

                    </div>


                    <div>

                      <span>
                        Organic
                      </span>

                      <strong
                        className={
                          getOrganicClass(
                            recommendation.organic
                          )
                        }
                      >
                        {
                          getOrganicText(
                            recommendation.organic
                          )
                        }
                      </strong>

                    </div>

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


      {/* Stage Cards */}

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


              {/* Duration */}

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


              {/* Weight */}

              {
                (
                  stage.min_weight !== null &&
                  stage.min_weight !== undefined
                ) ||
                (
                  stage.max_weight !== null &&
                  stage.max_weight !== undefined
                ) ? (

                  <div className="fish-feed-stage-info">

                    <span>
                      Weight
                    </span>

                    <strong>

                      {
                        stage.min_weight ||
                        '0'
                      }

                      {' – '}

                      {
                        stage.max_weight ||
                        '—'
                      }

                      {' g'}

                    </strong>

                  </div>

                ) : null
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

export default FarmerFeed