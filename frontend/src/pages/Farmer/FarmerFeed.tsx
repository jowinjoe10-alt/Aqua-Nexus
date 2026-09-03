import { useEffect, useState } from 'react'

import './FarmerFeed.css'

import {
  calculateFeedRequirement as calculateFeedRequirementUtility,
  formatFeedAmount as formatFeedAmountUtility,
} from '../../utils/feedCalculation'


type Fish = {
  id: number
  name: string
  image?: string | null
}


type FishStage = {
  id: number
  stage_number: number
  image?: string | null
  duration_days?: number | null
  min_weight?: number | null
  max_weight?: number | null
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

  created_at?: string | null
  updated_at?: string | null
}


type FarmerFeedProps = {
  fish: Fish
  onBack?: () => void
  onFeedSelect?: (feed: FeedRecommendation) => void
}

function FarmerFeed({
  fish,
  onBack,
  onFeedSelect
}: FarmerFeedProps) {

  const [stages, setStages] =
    useState<FishStage[]>([])


  const [selectedStage, setSelectedStage] =
    useState<FishStage | null>(null)


  const [quantity, setQuantity] =
    useState('')


  const [feedRecommendations, setFeedRecommendations] =
    useState<FeedRecommendation[]>([])


  const [estimatedFeedMin, setEstimatedFeedMin] =
    useState<number | null>(null)


  const [estimatedFeedMax, setEstimatedFeedMax] =
    useState<number | null>(null)


  const [showResults, setShowResults] =
    useState(false)


  const [loading, setLoading] =
    useState(true)


  const [recommendationLoading, setRecommendationLoading] =
    useState(false)


  const [error, setError] =
    useState('')


  const [recommendationError, setRecommendationError] =
    useState('')


  /* ================================= */
  /* Load Fish Stages                  */
  /* ================================= */

  useEffect(() => {

    const loadStages = async () => {

      try {

        setLoading(true)

        setError('')

        const response = await fetch(
          `http://127.0.0.1:8000/api/fish/${fish.id}/stages/`
        )

        if (!response.ok) {

          throw new Error(
            'Failed to load fish stages.'
          )

        }

        const data = await response.json()

        const stageData =
          Array.isArray(data)
            ? data
            : data.results || []

        stageData.sort(
          (
            a: FishStage,
            b: FishStage
          ) =>
            a.stage_number -
            b.stage_number
        )

        setStages(stageData)

      } catch (err) {

        console.error(err)

        setError(
          'Unable to load fish stages.'
        )

      } finally {

        setLoading(false)

      }

    }

    loadStages()

  }, [fish.id])


  /* ================================= */
  /* Back To Fish                      */
  /* ================================= */

  const handleBack = () => {

     if (onBack) {
        onBack()
     }

  }


  /* ================================= */
  /* Stage Selection                   */
  /* ================================= */

  const handleStageSelect = (
    stage: FishStage
  ) => {

    setSelectedStage(stage)

    /*
     * Changing the stage means the old
     * calculation is no longer valid.
     */

    setShowResults(false)

    setEstimatedFeedMin(null)

    setEstimatedFeedMax(null)

    setFeedRecommendations([])

    setRecommendationError('')

  }


  /* ================================= */
  /* Quantity                          */
  /* ================================= */

  const handleQuantityChange = (
    value: string
  ) => {

    const numbersOnly =
      value.replace(/\D/g, '')

    if (numbersOnly.length <= 3) {

      setQuantity(numbersOnly)

    }

    /*
     * If the farmer changes the quantity
     * after seeing results, hide the old
     * calculation.
     */

    setShowResults(false)

    setEstimatedFeedMin(null)

    setEstimatedFeedMax(null)

  }


  /* ================================= */
  /* Calculate Feed                    */
  /* ================================= */

  const calculateFeedRequirement = () => {

    if (!selectedStage) {

      return

    }


    const fishCount =
      Number(quantity)


    if (
      !fishCount ||
      fishCount <= 0
    ) {

      return

    }


    const result =
      calculateFeedRequirementUtility(
        selectedStage,
        fishCount
      )


    if (!result) {

      return

    }


    setEstimatedFeedMin(
      result.minimumFeed
    )


    setEstimatedFeedMax(
      result.maximumFeed
    )


    setShowResults(true)

  }


  /* ================================= */
  /* Load Feed Recommendations         */
  /* ================================= */

  useEffect(() => {

    if (
      !showResults ||
      !selectedStage
    ) {

      return

    }


    const loadRecommendations =
      async () => {

        try {

          setRecommendationLoading(true)

          setRecommendationError('')

          const response =
            await fetch(
               `http://127.0.0.1:8000/api/fish/${fish.id}/stages/${selectedStage.id}/feed-recommendations/`
            )

          if (!response.ok) {

            throw new Error(
              'Failed to load feed recommendations.'
            )

          }

          const data =
          await response.json()

          const recommendationData =
            Array.isArray(data)
              ? data
              : data.results || []

          setFeedRecommendations(
            recommendationData
          )

        } catch (err) {

          console.error(err)

          setRecommendationError(
            'Unable to load recommended feeds.'
          )

        } finally {

          setRecommendationLoading(false)

        }

      }

    loadRecommendations()

  }, [
    showResults,
    selectedStage,
    fish.id
  ])


  /* ================================= */
  /* Validation                        */
  /* ================================= */

  const canCalculate =
    selectedStage !== null &&
    quantity.length > 0 &&
    Number(quantity) > 0


  /* ================================= */
  /* Render                            */
  /* ================================= */

  return (

    <section className="farmer-feed">


      {/* ================================= */}
      {/* Back Button                       */}
      {/* ================================= */}

      <button
        type="button"
        className="farmer-feed-back"
        onClick={handleBack}
      >

        ← Back to Fish

      </button>


      {/* ================================= */}
      {/* Header                            */}
      {/* ================================= */}

      <div className="farmer-feed-header">

        <span className="farmer-feed-label">

          FEEDING INFORMATION

        </span>


        <h2>

          {fish.name}

        </h2>


        <p>

          Select the current stage of your{' '}

          {fish.name} and enter the

          number of fish to get an

          estimated daily feed requirement

          and recommended feeds.

        </p>

      </div>


      {/* ================================= */}
      {/* Stage Selection                   */}
      {/* ================================= */}

      <div className="farmer-feed-section">

        <div className="farmer-feed-section-header">

          <h3>

            Select Fish Stage

          </h3>


          <p>

            Choose one stage that matches

            your fish.

          </p>

        </div>


        {/* Loading */}

        {loading && (

          <div className="farmer-feed-message">

            Loading stages...

          </div>

        )}


        {/* Error */}

        {!loading && error && (

          <div className="farmer-feed-message error">

            {error}

          </div>

        )}


        {/* No Stages */}

        {!loading &&

          !error &&

          stages.length === 0 && (

            <div className="farmer-feed-message">

              No stage information available.

            </div>

          )}


        {/* Stage Cards */}

        {!loading &&

          !error &&

          stages.length > 0 && (

            <div className="farmer-stage-grid">

              {stages.map(

                (stage) => {

                  const isSelected =
                    selectedStage?.id ===
                    stage.id


                  return (

                    <button
                      key={stage.id}
                      type="button"
                      className={
                        `farmer-stage-card ${
                          isSelected
                            ? 'selected'
                            : ''
                        }`
                      }
                      onClick={() =>
                        handleStageSelect(
                          stage
                        )
                      }
                    >


                      {/* Stage Image */}

                      <div className="farmer-stage-image">

                        {stage.image ? (

                          <img
                            src={stage.image}
                            alt={
                              `Stage ${stage.stage_number}`
                            }
                          />

                        ) : (

                          <div className="farmer-stage-image-placeholder">

                            Stage {stage.stage_number}

                          </div>

                        )}

                      </div>


                      {/* Stage Information */}

                      <div className="farmer-stage-content">

                        <div className="farmer-stage-title-row">

                          <h4>

                            Stage {stage.stage_number}

                          </h4>


                          <span
                            className={
                              `farmer-stage-radio ${
                                isSelected
                                  ? 'selected'
                                  : ''
                              }`
                            }
                          >

                            {isSelected
                              ? '✓'
                              : ''}

                          </span>

                        </div>


                        {/* Duration */}

                        {stage.duration_days != null && (

                          <p>

                            Duration:{' '}

                            {stage.duration_days}{' '}

                            days

                          </p>

                        )}


                        {/* Weight */}

                        {(stage.min_weight != null ||

                          stage.max_weight != null) && (

                          <p>

                            Weight:{' '}


                            {stage.stage_number === 6 ? (

                              <>

                                {stage.min_weight != null

                                  ? (

                                      stage.min_weight /

                                      1000

                                    ).toFixed(2)

                                  : '—'}


                                {' – '}


                                {stage.max_weight != null

                                  ? (

                                      stage.max_weight /

                                      1000

                                    ).toFixed(2)

                                  : '—'}


                                {' kg'}

                              </>

                            ) : (

                              <>

                                {stage.min_weight ?? '—'}

                                {' – '}

                                {stage.max_weight ?? '—'}

                                {' g'}

                              </>

                            )}

                          </p>

                        )}

                      </div>

                    </button>

                  )

                }

              )}

            </div>

          )}

      </div>


      {/* ================================= */}
      {/* Quantity                          */}
      {/* ================================= */}

      <div className="farmer-feed-section">

        <div className="farmer-feed-section-header">

          <h3>

            Number of Fish

          </h3>


          <p>

            Enter the number of fish in

            this stage.

          </p>

        </div>


        <div className="farmer-quantity-wrapper">

          <input
            type="text"
            inputMode="numeric"
            maxLength={3}
            value={quantity}
            onChange={(event) =>
              handleQuantityChange(
                event.target.value
              )
            }
            placeholder="Enter quantity"
            className="farmer-quantity-input"
          />


          <span className="farmer-quantity-unit">

            fish

          </span>

        </div>


        {/* ================================= */}
        {/* Okay Button                       */}
        {/* ================================= */}

        <div className="farmer-feed-action">

          <button
            type="button"
            className="farmer-feed-okay-button"
            disabled={!canCalculate}
            onClick={
              calculateFeedRequirement
            }
          >

            Okay →

          </button>

        </div>

      </div>


      {/* ================================= */}
      {/* Feed Results                       */}
      {/* ================================= */}

      {showResults &&

        estimatedFeedMin !== null &&

        estimatedFeedMax !== null && (

          <div className="farmer-feed-results">


            {/* ================================= */}
            {/* Estimated Feed                    */}
            {/* ================================= */}

            <div className="farmer-feed-estimate">

              <span className="farmer-feed-result-label">

                ESTIMATED DAILY FEED

              </span>


              <h3>

                {formatFeedAmountUtility(
                  estimatedFeedMin,
                  selectedStage
                )}

                {' – '}

                {formatFeedAmountUtility(
                  estimatedFeedMax,
                  selectedStage
                )}

                {' /day'}

              </h3>


              <p>

                Approximate feed requirement

                for {quantity} {fish.name}

                at Stage {selectedStage?.stage_number}.

              </p>


              <span className="farmer-feed-note">

                This is an estimated range and

                may vary depending on actual fish

                weight, feeding conditions and

                farming practices.

              </span>

            </div>


            {/* ================================= */}
            {/* Recommended Feeds                */}
            {/* ================================= */}

            <div className="farmer-recommendations">

              <div className="farmer-feed-section-header">

                <h3>

                  Recommended Feeds

                </h3>


                <p>

                  Feeds available for Stage{' '}

                  {selectedStage?.stage_number}.

                </p>

              </div>


              {/* Loading */}

              {recommendationLoading && (

                <div className="farmer-feed-message">

                  Loading recommended feeds...

                </div>

              )}


              {/* Error */}

              {!recommendationLoading &&

                recommendationError && (

                  <div className="farmer-feed-message error">

                    {recommendationError}

                  </div>

                )}


              {/* No Recommendations */}

              {!recommendationLoading &&

                !recommendationError &&

                feedRecommendations.length === 0 && (

                  <div className="farmer-feed-message">

                    No feed recommendations are

                    available for this stage.

                  </div>

                )}


              {/* Recommendation Cards */}

              {!recommendationLoading &&

                !recommendationError &&

                feedRecommendations.length > 0 && (

                  <div className="farmer-recommendation-grid">

                    {feedRecommendations.map(

                      (feed) => (

                        <button
                          key={feed.id}
                          type="button"
                          className="farmer-recommendation-card"
                          onClick={() => {
                            if (onFeedSelect) {
                              onFeedSelect(feed)
                            }
                          }}
                        >

                          {/* Top */}

                          <div className="farmer-recommendation-top">

                            <span className="farmer-recommendation-stage">

                              Stage{' '}

                              {selectedStage?.stage_number}

                            </span>

                          </div>


                          {/* Feed Name */}

                          <h4>

                            {feed.feed_name ||

                              'Feed Product'}

                          </h4>


                          {/* Fish */}

                          <div className="farmer-recommendation-fish">

                            {feed.fish_name ||

                              fish.name}

                          </div>


                          {/* Details */}

                          <div className="farmer-recommendation-details">


                            {/* Feed Type */}

                            {feed.feed_type && (

                              <div className="farmer-recommendation-row">

                                <span>

                                  Feed Type

                                </span>

                                <strong>

                                  {feed.feed_type}

                                </strong>

                              </div>

                            )}


                            {/* Feed Form */}

                            {feed.feed_form && (

                              <div className="farmer-recommendation-row">

                                <span>

                                  Feed Form

                                </span>

                                <strong>

                                  {feed.feed_form}

                                </strong>

                              </div>

                            )}


                            {/* Protein */}

                            {(feed.protein_min != null ||

                              feed.protein_max != null) && (

                              <div className="farmer-recommendation-row">

                                <span>

                                  Protein

                                </span>

                                <strong>

                                  {feed.protein_min ?? '—'}

                                  {' – '}

                                  {feed.protein_max ?? '—'}

                                  {' %'}

                                </strong>

                              </div>

                            )}


                            {/* Particle Size */}

                            {(feed.particle_size_min != null ||

                              feed.particle_size_max != null) && (

                              <div className="farmer-recommendation-row">

                                <span>

                                  Particle Size

                                </span>

                                <strong>

                                  {feed.particle_size_min ?? '—'}

                                  {' – '}

                                  {feed.particle_size_max ?? '—'}

                                </strong>

                              </div>

                            )}


                            {/* Organic */}

                            {feed.organic != null && (

                              <div className="farmer-recommendation-row">

                                <span>

                                  Organic

                                </span>

                                <strong>

                                  {feed.organic

                                    ? 'Yes'

                                    : 'No'}

                                </strong>

                              </div>

                            )}

                          </div>

                        </button>

                      )

                    )}

                  </div>

                )}

            </div>

          </div>

        )}

    </section>

  )

}


export default FarmerFeed