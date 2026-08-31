/* =========================================================
   Feed Calculation Utilities
   ========================================================= */


/* =========================================================
   Types
   ========================================================= */

export type FeedCalculationStage = {

  stage_number: number

  min_weight?: number | null

  max_weight?: number | null

}


/* =========================================================
   Feeding Rate
   ========================================================= */

export const getFeedingRate = (
  stage: FeedCalculationStage
) => {

  const minWeight =
    Number(
      stage.min_weight ?? 0
    )

  const maxWeight =
    Number(
      stage.max_weight ?? 0
    )

  const averageWeight =
    (minWeight + maxWeight) / 2


  /*
   * Approximate project-level
   * feeding model.
   *
   * Smaller fish generally require
   * a higher percentage of body weight
   * as feed.
   */

  if (averageWeight <= 0.1) {

    return {
      min: 8,
      max: 12
    }

  }


  if (averageWeight <= 2) {

    return {
      min: 6,
      max: 9
    }

  }


  if (averageWeight <= 20) {

    return {
      min: 4,
      max: 6
    }

  }


  if (averageWeight <= 80) {

    return {
      min: 2.5,
      max: 4
    }

  }


  if (averageWeight <= 250) {

    return {
      min: 2,
      max: 3
    }

  }


  return {
    min: 1.5,
    max: 2.5
  }

}


/* =========================================================
   Calculate Feed Requirement
   ========================================================= */

export const calculateFeedRequirement = (
  stage: FeedCalculationStage,
  fishCount: number
) => {

  if (!stage) {

    return null

  }


  if (
    !fishCount ||
    fishCount <= 0
  ) {

    return null

  }


  const minWeight =
    Number(
      stage.min_weight ?? 0
    )

  const maxWeight =
    Number(
      stage.max_weight ?? 0
    )


  if (
    minWeight <= 0 ||
    maxWeight <= 0
  ) {

    return null

  }


  /*
   * Average fish weight in grams.
   */

  const averageWeight =
    (minWeight + maxWeight) / 2


  /*
   * Total biomass in kilograms.
   *
   * fish count × average weight(g)
   * divided by 1000
   */

  const biomassKg =
    (
      fishCount *
      averageWeight
    ) / 1000


  /*
   * Approximate feeding rate.
   */

  const feedingRate =
    getFeedingRate(
      stage
    )


  /*
   * Feed requirement in kilograms/day.
   */

  const minimumFeed =
    biomassKg *
    (feedingRate.min / 100)

  const maximumFeed =
    biomassKg *
    (feedingRate.max / 100)


  /*
   * Round to 4 decimal places internally.
   */

  const roundedMin =
    Number(
      minimumFeed.toFixed(4)
    )

  const roundedMax =
    Number(
      maximumFeed.toFixed(4)
    )


  return {
    minimumFeed: roundedMin,
    maximumFeed: roundedMax
  }

}


/* =========================================================
   Feed Display Format
   ========================================================= */

export const formatFeedAmount = (
  amountKg: number,
  stage: FeedCalculationStage | null
) => {

  if (!stage) {

    return ''

  }


  /*
   * Stage 1–5 → grams
   */

  if (
    stage.stage_number <= 5
  ) {

    const amountGrams =
      amountKg * 1000

    return `${amountGrams.toFixed(2)} g`

  }


  /*
   * Stage 6 → kilograms
   */

  return `${amountKg.toFixed(2)} kg`

}