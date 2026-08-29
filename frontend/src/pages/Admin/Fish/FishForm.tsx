import { useEffect, useState } from "react";
import "./FishForm.css";
import FishFeed from "./FishFeed/FishFeed";


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


type FishFormProps = {
  fish: Fish | null
  onComplete: () => void
  onCancel: () => void
}


type FishFormTab =
  | 'General Info'
  | 'Stages'
  | 'Feed'


type FishStage = {
  id?: number
  fish?: number
  stage_number: number
  image: string | null
  duration_days: number
  min_weight: string
  max_weight: string
}


function FishForm({
  fish,
  onComplete,
  onCancel
}: FishFormProps) {

  /* ============================= */
  /* Form State                    */
  /* ============================= */

  const [activeTab, setActiveTab] =
    useState<FishFormTab>(
      'General Info'
    )

  const [name, setName] =
    useState('')

  const [waterType, setWaterType] =
    useState('')

  const [feedingHabit, setFeedingHabit] =
    useState('')

  const [temperatureMin, setTemperatureMin] =
    useState('')

  const [temperatureMax, setTemperatureMax] =
    useState('')

  const [phMin, setPhMin] =
    useState('')

  const [phMax, setPhMax] =
    useState('')

  const [culturePeriodDays, setCulturePeriodDays] =
    useState('')


  /* ============================= */
  /* Fish Image                    */
  /* ============================= */

  const [image, setImage] =
    useState<File | null>(null)

  const [existingImage, setExistingImage] =
    useState<string | null>(null)

  const [previewImage, setPreviewImage] =
    useState<string | null>(null)


  /* ============================= */
  /* Request State                 */
  /* ============================= */

  const [loading, setLoading] =
    useState(false)

  const [error, setError] =
    useState('')


  /* ============================= */
  /* Stage State                   */
  /* ============================= */

  const [stages, setStages] =
    useState<FishStage[]>([])

  const [stageImages, setStageImages] =
    useState<Record<number, File | null>>({})


  /* ============================= */
  /* Create Empty Stages           */
  /* ============================= */

  const createEmptyStages = (): FishStage[] => {

    return Array.from(
      { length: 6 },
      (_, index) => ({
        stage_number: index + 1,
        image: null,
        duration_days: 0,
        min_weight: '',
        max_weight: ''
      })
    )

  }


  /* ============================= */
  /* Load Fish                     */
  /* ============================= */

  useEffect(() => {

    setActiveTab(
      'General Info'
    )

    setError('')

    if (!fish) {

      setName('')
      setWaterType('')
      setFeedingHabit('')

      setTemperatureMin('')
      setTemperatureMax('')

      setPhMin('')
      setPhMax('')

      setCulturePeriodDays('')

      setImage(null)
      setExistingImage(null)
      setPreviewImage(null)

      setStageImages({})

      setStages(
        createEmptyStages()
      )

      return
    }


    setName(
      fish.name
    )

    setWaterType(
      fish.water_type
    )

    setFeedingHabit(
      fish.feeding_habit
    )

    setTemperatureMin(
      fish.temperature_min
    )

    setTemperatureMax(
      fish.temperature_max
    )

    setPhMin(
      fish.ph_min
    )

    setPhMax(
      fish.ph_max
    )

    setCulturePeriodDays(
      String(
        fish.culture_period_days
      )
    )

    setExistingImage(
      fish.image
    )

    setImage(null)
    setPreviewImage(null)
    setStageImages({})


    /* ============================= */
    /* Load Existing Stages           */
    /* ============================= */

    fetch(
      `http://127.0.0.1:8000/api/fish/${fish.id}/stages/`
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

        const loadedStages =
          Array.isArray(data)
            ? data
            : data.results || []

        setStages(
          loadedStages
        )

      })
      .catch((stageError) => {

        console.error(
          'Error loading fish stages:',
          stageError
        )

        setStages(
          createEmptyStages()
        )

      })

  }, [fish])


  /* ============================= */
  /* Fish Image Preview            */
  /* ============================= */

  useEffect(() => {

    if (!image) {

      setPreviewImage(null)

      return

    }


    const objectUrl =
      URL.createObjectURL(
        image
      )

    setPreviewImage(
      objectUrl
    )


    return () => {

      URL.revokeObjectURL(
        objectUrl
      )

    }

  }, [image])


  /* ============================= */
  /* Fish Image Selection          */
  /* ============================= */

  const handleImageChange = (
    event:
      React.ChangeEvent<HTMLInputElement>
  ) => {

    const selectedFile =
      event.target.files?.[0] ||
      null

    setImage(
      selectedFile
    )

  }


  /* ============================= */
  /* Stage Update                  */
  /* ============================= */

  const updateStage = (
    stageNumber: number,
    field:
      | 'min_weight'
      | 'max_weight',
    value: string
  ) => {

    setStages(
      (currentStages) =>
        currentStages.map(
          (stage) =>
            stage.stage_number ===
            stageNumber
              ? {
                  ...stage,
                  [field]: value
                }
              : stage
        )
    )

  }


  /* ============================= */
  /* Stage Image Selection         */
  /* ============================= */

  const handleStageImageChange = (
    stageNumber: number,
    file: File | null
  ) => {

    setStageImages(
      (current) => ({
        ...current,
        [stageNumber]: file
      })
    )

  }


  /* ============================= */
  /* Validation                    */
  /* ============================= */

  const validateForm = (): boolean => {

    if (!name.trim()) {

      setError(
        'Fish name is required.'
      )

      setActiveTab(
        'General Info'
      )

      return false

    }


    if (!waterType.trim()) {

      setError(
        'Water type is required.'
      )

      setActiveTab(
        'General Info'
      )

      return false

    }


    if (!feedingHabit.trim()) {

      setError(
        'Feeding habit is required.'
      )

      setActiveTab(
        'General Info'
      )

      return false

    }


    if (
      !temperatureMin ||
      !temperatureMax
    ) {

      setError(
        'Temperature range is required.'
      )

      setActiveTab(
        'General Info'
      )

      return false

    }


    if (
      !phMin ||
      !phMax
    ) {

      setError(
        'pH range is required.'
      )

      setActiveTab(
        'General Info'
      )

      return false

    }


    if (!culturePeriodDays) {

      setError(
        'Culture period is required.'
      )

      setActiveTab(
        'General Info'
      )

      return false

    }


    if (
      Number(temperatureMin) >
      Number(temperatureMax)
    ) {

      setError(
        'Minimum temperature cannot be greater than maximum temperature.'
      )

      setActiveTab(
        'General Info'
      )

      return false

    }


    if (
      Number(phMin) >
      Number(phMax)
    ) {

      setError(
        'Minimum pH cannot be greater than maximum pH.'
      )

      setActiveTab(
        'General Info'
      )

      return false

    }


    if (
      Number(culturePeriodDays) <= 0
    ) {

      setError(
        'Culture period must be greater than 0.'
      )

      setActiveTab(
        'General Info'
      )

      return false

    }


    for (const stage of stages) {

      if (
        stage.min_weight !== '' &&
        Number(stage.min_weight) < 0
      ) {

        setError(
          `Stage ${stage.stage_number} minimum weight cannot be negative.`
        )

        setActiveTab(
          'Stages'
        )

        return false

      }


      if (
        stage.max_weight !== '' &&
        Number(stage.max_weight) < 0
      ) {

        setError(
          `Stage ${stage.stage_number} maximum weight cannot be negative.`
        )

        setActiveTab(
          'Stages'
        )

        return false

      }


      if (
        stage.min_weight !== '' &&
        stage.max_weight !== '' &&
        Number(stage.min_weight) >
        Number(stage.max_weight)
      ) {

        setError(
          `Stage ${stage.stage_number} minimum weight cannot be greater than maximum weight.`
        )

        setActiveTab(
          'Stages'
        )

        return false

      }

    }


    return true

  }


  /* ============================= */
  /* Save Fish                     */
  /* ============================= */

  const handleSubmit = async (
    event:
      React.FormEvent<HTMLFormElement>
  ) => {

    event.preventDefault()

    setError('')


    if (!validateForm()) {

      return

    }


    const formData =
      new FormData()


    formData.append(
      'name',
      name.trim()
    )

    formData.append(
      'water_type',
      waterType.trim()
    )

    formData.append(
      'feeding_habit',
      feedingHabit.trim()
    )

    formData.append(
      'temperature_min',
      temperatureMin
    )

    formData.append(
      'temperature_max',
      temperatureMax
    )

    formData.append(
      'ph_min',
      phMin
    )

    formData.append(
      'ph_max',
      phMax
    )

    formData.append(
      'culture_period_days',
      culturePeriodDays
    )


    if (image) {

      formData.append(
        'image',
        image
      )

    }


    setLoading(true)


    try {

      /* ============================= */
      /* Fish Request                  */
      /* ============================= */

      const endpoint =
        fish
          ? `http://127.0.0.1:8000/api/fish/${fish.id}/`
          : 'http://127.0.0.1:8000/api/fish/'


      const response =
        await fetch(
          endpoint,
          {
            method:
              fish
                ? 'PATCH'
                : 'POST',

            body:
              formData
          }
        )


      if (!response.ok) {

        const data =
          await response
            .json()
            .catch(
              () => ({})
            )


        const message =
          data.detail ||
          data.name?.[0] ||
          data.image?.[0] ||
          data.water_type?.[0] ||
          data.feeding_habit?.[0] ||
          data.temperature_min?.[0] ||
          data.temperature_max?.[0] ||
          data.ph_min?.[0] ||
          data.ph_max?.[0] ||
          data.culture_period_days?.[0] ||
          'Unable to save fish.'


        throw new Error(
          message
        )

      }


      const savedFish =
        await response.json()


      const fishId =
        fish?.id ||
        savedFish.id


      if (!fishId) {

        throw new Error(
          'Fish was saved, but its ID was not returned.'
        )

      }


      /* ============================= */
      /* Save Six Stages               */
      /* ============================= */

      for (
        const stage
        of stages
      ) {

        const stageData =
          new FormData()


        stageData.append(
          'stage_number',
          String(
            stage.stage_number
          )
        )


        if (
          stage.min_weight !== ''
        ) {

          stageData.append(
            'min_weight',
            stage.min_weight
          )

        }


        if (
          stage.max_weight !== ''
        ) {

          stageData.append(
            'max_weight',
            stage.max_weight
          )

        }


        const stageImage =
          stageImages[
            stage.stage_number
          ] ||
          null


        if (stageImage) {

          stageData.append(
            'image',
            stageImage
          )

        }


        const stageEndpoint =
          stage.id
            ? `http://127.0.0.1:8000/api/fish/${fishId}/stages/${stage.id}/`
            : `http://127.0.0.1:8000/api/fish/${fishId}/stages/`


        const stageResponse =
          await fetch(
            stageEndpoint,
            {
              method:
                stage.id
                  ? 'PATCH'
                  : 'POST',

              body:
                stageData
            }
          )


        if (
          !stageResponse.ok
        ) {

          const stageErrorData =
            await stageResponse
              .json()
              .catch(
                () => ({})
              )


          const stageMessage =
            stageErrorData.detail ||
            stageErrorData.stage_number?.[0] ||
            stageErrorData.min_weight?.[0] ||
            stageErrorData.max_weight?.[0] ||
            stageErrorData.image?.[0] ||
            `Unable to save Stage ${stage.stage_number}.`


          throw new Error(
            stageMessage
          )

        }

      }


      onComplete()

    }
    catch (saveError) {

      console.error(
        'Error saving fish:',
        saveError
      )


      setError(
        saveError instanceof Error
          ? saveError.message
          : 'Unable to save fish.'
      )

    }
    finally {

      setLoading(false)

    }

  }


  /* ============================= */
  /* Display Fish Image            */
  /* ============================= */

  const displayImage =
    previewImage ||
    existingImage


  /* ============================= */
  /* Stage Duration                */
  /* ============================= */

  const calculatedStageDuration =
    culturePeriodDays
      ? Math.round(
          Number(
            culturePeriodDays
          ) / 6
        )
      : 0


  /* ============================= */
  /* Render                        */
  /* ============================= */

  return (

    <div
      className={
        fish
          ? 'admin-fish-form-wrapper admin-fish-edit-wrapper'
          : 'admin-fish-form-wrapper'
      }
    >

      {/* ============================= */}
      {/* Header                         */}
      {/* ============================= */}

      <div className="admin-fish-form-top">

        <div className="admin-fish-form-title">

          <h2>
            {fish
              ? fish.name
              : 'Add Fish'}
          </h2>


          {fish && (

            <span className="admin-fish-form-id">

              Fish ID #{fish.id}

            </span>

          )}

        </div>

      </div>


      {/* ============================= */}
      {/* Tabs                           */}
      {/* ============================= */}

      <div className="admin-fish-details-tabs">

         {/* General Info */}
        <button
          type="button"
          className={
            activeTab === 'General Info'
              ? 'admin-fish-details-tab active'
              : 'admin-fish-details-tab'
            }
            onClick={() => {
              setActiveTab('General Info')
              setError('')
            }}
        >
          General Info
        </button>


        {/* Stages */}
        <button
          type="button"
          className={
            activeTab === 'Stages'
              ? 'admin-fish-details-tab active'
              : 'admin-fish-details-tab'
          }
          onClick={() => {
            setActiveTab('Stages')
            setError('')
          }}
        >
          Stages
        </button>


        {/* Feed */}
        {fish && (
           <button
              type="button"
              className={
                activeTab === 'Feed'
                  ? 'admin-fish-details-tab active'
                  : 'admin-fish-details-tab'
              }
              onClick={() => {
                setActiveTab('Feed')
                setError('')
              }}
           >
             Feed
           </button>
        )}
      </div>





      {/* ============================= */}
      {/* Error                         */}
      {/* ============================= */}

      {error && (

        <div className="admin-fish-error">

          {error}

        </div>

      )}


      {/* ============================= */}
      {/* General Information            */}
      {/* ============================= */}

      {activeTab === 'General Info' && (

        <form
          onSubmit={handleSubmit}
          className="admin-fish-edit-form"
        >

          <div className="admin-fish-edit-general">

            {/* ============================= */}
            {/* Fish Image                     */}
            {/* ============================= */}

            <div className="admin-fish-edit-image-column">

              <div className="admin-fish-edit-image-wrapper">

                {displayImage ? (

                  <img
                    src={displayImage}
                    alt={
                      name ||
                      'Fish'
                    }
                    className="admin-fish-edit-image"
                  />

                ) : (

                  <div className="admin-fish-edit-no-image">

                    <span>
                      No image
                    </span>

                  </div>

                )}

              </div>


              <div className="admin-fish-edit-image-control">

                <label
                  htmlFor="fish-edit-image"
                  className="admin-fish-edit-image-button"
                >
                  {displayImage
                    ? 'Change Image'
                    : 'Add Image'}
                </label>


                <input
                  id="fish-edit-image"
                  type="file"
                  accept="image/*"
                  onChange={
                    handleImageChange
                  }
                  className="admin-fish-edit-image-input"
                />


                <span>
                  Optional
                </span>

              </div>

            </div>


            {/* ============================= */}
            {/* General Data                   */}
            {/* ============================= */}

            <div className="admin-fish-edit-data">

              {/* Fish Name */}

              <div className="admin-fish-edit-field">

                <label htmlFor="fish-name">
                  Fish Name
                </label>

                <input
                  id="fish-name"
                  type="text"
                  value={name}
                  onChange={(event) =>
                    setName(
                      event.target.value
                    )
                  }
                  placeholder="Enter fish name"
                />

              </div>


              {/* Water Type */}

              <div className="admin-fish-edit-field">

                <label htmlFor="fish-water-type">
                  Water Type
                </label>

                <input
                  id="fish-water-type"
                  type="text"
                  value={waterType}
                  onChange={(event) =>
                    setWaterType(
                      event.target.value
                    )
                  }
                  placeholder="e.g. Fresh Water"
                />

              </div>


              {/* Feeding Habit */}

              <div className="admin-fish-edit-field">

                <label htmlFor="fish-feeding-habit">
                  Feeding Habit
                </label>

                <input
                  id="fish-feeding-habit"
                  type="text"
                  value={feedingHabit}
                  onChange={(event) =>
                    setFeedingHabit(
                      event.target.value
                    )
                  }
                  placeholder="e.g. Omnivorous"
                />

              </div>


              {/* Temperature Range */}

              <div className="admin-fish-edit-field-group">

                <span className="admin-fish-edit-group-label">
                  Temperature Range
                </span>


                <div className="admin-fish-edit-range">

                  <div className="admin-fish-edit-field">

                    <label htmlFor="temperature-min">
                      Minimum
                    </label>


                    <div className="admin-fish-edit-input-unit">

                      <input
                        id="temperature-min"
                        type="number"
                        step="0.01"
                        value={temperatureMin}
                        onChange={(event) =>
                          setTemperatureMin(
                            event.target.value
                          )
                        }
                        placeholder="Minimum"
                      />

                      <span>
                        °C
                      </span>

                    </div>

                  </div>


                  <span className="admin-fish-edit-range-separator">
                    –
                  </span>


                  <div className="admin-fish-edit-field">

                    <label htmlFor="temperature-max">
                      Maximum
                    </label>


                    <div className="admin-fish-edit-input-unit">

                      <input
                        id="temperature-max"
                        type="number"
                        step="0.01"
                        value={temperatureMax}
                        onChange={(event) =>
                          setTemperatureMax(
                            event.target.value
                          )
                        }
                        placeholder="Maximum"
                      />

                      <span>
                        °C
                      </span>

                    </div>

                  </div>

                </div>

              </div>


              {/* pH Range */}

              <div className="admin-fish-edit-field-group">

                <span className="admin-fish-edit-group-label">
                  pH Range
                </span>


                <div className="admin-fish-edit-range">

                  <div className="admin-fish-edit-field">

                    <label htmlFor="ph-min">
                      Minimum
                    </label>


                    <input
                      id="ph-min"
                      type="number"
                      step="0.01"
                      value={phMin}
                      onChange={(event) =>
                        setPhMin(
                          event.target.value
                        )
                      }
                      placeholder="Minimum"
                    />

                  </div>


                  <span className="admin-fish-edit-range-separator">
                    –
                  </span>


                  <div className="admin-fish-edit-field">

                    <label htmlFor="ph-max">
                      Maximum
                    </label>


                    <input
                      id="ph-max"
                      type="number"
                      step="0.01"
                      value={phMax}
                      onChange={(event) =>
                        setPhMax(
                          event.target.value
                        )
                      }
                      placeholder="Maximum"
                    />

                  </div>

                </div>

              </div>


              {/* Culture Period */}

              <div className="admin-fish-edit-field">

                <label htmlFor="culture-period">
                  Culture Period
                </label>


                <div className="admin-fish-edit-input-unit">

                  <input
                    id="culture-period"
                    type="number"
                    min="1"
                    value={culturePeriodDays}
                    onChange={(event) =>
                      setCulturePeriodDays(
                        event.target.value
                      )
                    }
                    placeholder="Culture period"
                  />

                  <span>
                    days
                  </span>

                </div>

              </div>

            </div>

          </div>


          {/* ============================= */}
          {/* General Form Actions           */}
          {/* ============================= */}

          <div className="admin-fish-edit-actions">

            <button
              type="button"
              className="admin-fish-form-cancel"
              onClick={onCancel}
              disabled={loading}
            >
              Cancel
            </button>


            <button
              type="submit"
              className="admin-fish-form-submit"
              disabled={loading}
            >

              {loading
                ? 'Saving...'
                : fish
                  ? 'Save Changes'
                  : 'Add Fish'}

            </button>

          </div>

        </form>

      )}


      {/* ============================= */}
      {/* Stages                         */}
      {/* ============================= */}

      {activeTab === 'Stages' && (

        <div className="admin-fish-edit-stages">

          <h3>
            Fish Stages
          </h3>


          <p>
            Enter the weight range for each
            growth stage and optionally add
            a stage image. Stage duration is
            calculated automatically from the
            culture period.
          </p>


          <div className="admin-fish-stage-list">

            {stages.map((stage) => {

              const selectedStageImage =
                stageImages[
                  stage.stage_number
                ]


              return (

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


                  {/* ============================= */}
                  {/* Stage Image                    */}
                  {/* ============================= */}

                  <div className="admin-fish-stage-image-wrapper">

                    {selectedStageImage ? (

                      <img
                        src={
                          URL.createObjectURL(
                            selectedStageImage
                          )
                        }
                        alt={
                          `Stage ${stage.stage_number}`
                        }
                        className="admin-fish-stage-image"
                      />

                    ) : stage.image ? (

                      <img
                        src={stage.image}
                        alt={
                          `Stage ${stage.stage_number}`
                        }
                        className="admin-fish-stage-image"
                      />

                    ) : (

                      <div className="admin-fish-stage-no-image">

                        No image

                      </div>

                    )}

                  </div>


                  <div className="admin-fish-edit-field">

                    <label
                      htmlFor={`stage-image-${stage.stage_number}`}
                    >
                      Stage Image
                    </label>


                    <input
                      id={`stage-image-${stage.stage_number}`}
                      type="file"
                      accept="image/*"
                      onChange={(event) => {

                        const file =
                          event.target.files?.[0] ||
                          null

                        handleStageImageChange(
                          stage.stage_number,
                          file
                        )

                      }}
                    />

                  </div>


                  {/* ============================= */}
                  {/* Duration                       */}
                  {/* ============================= */}

                  <div className="admin-fish-edit-field">

                    <label>
                      Duration
                    </label>


                    <div className="admin-fish-edit-input-unit">

                      <input
                        type="number"
                        value={
                          calculatedStageDuration
                        }
                        readOnly
                      />

                      <span>
                        days
                      </span>

                    </div>

                  </div>


                  {/* ============================= */}
                  {/* Weight Range                   */}
                  {/* ============================= */}

                  <div className="admin-fish-edit-field-group">

                    <span className="admin-fish-edit-group-label">
                      Weight Range
                    </span>


                    <div className="admin-fish-edit-range">

                      <div className="admin-fish-edit-field">

                        <label
                          htmlFor={`stage-${stage.stage_number}-min`}
                        >
                          Minimum
                        </label>


                        <div className="admin-fish-edit-input-unit">

                          <input
                            id={`stage-${stage.stage_number}-min`}
                            type="number"
                            min="0"
                            step="0.01"
                            value={
                              stage.min_weight
                            }
                            onChange={(event) =>
                              updateStage(
                                stage.stage_number,
                                'min_weight',
                                event.target.value
                              )
                            }
                            placeholder="Minimum"
                          />

                          <span>
                            g
                          </span>

                        </div>

                      </div>


                      <span className="admin-fish-edit-range-separator">
                        –
                      </span>


                      <div className="admin-fish-edit-field">

                        <label
                          htmlFor={`stage-${stage.stage_number}-max`}
                        >
                          Maximum
                        </label>


                        <div className="admin-fish-edit-input-unit">

                          <input
                            id={`stage-${stage.stage_number}-max`}
                            type="number"
                            min="0"
                            step="0.01"
                            value={
                              stage.max_weight
                            }
                            onChange={(event) =>
                              updateStage(
                                stage.stage_number,
                                'max_weight',
                                event.target.value
                              )
                            }
                            placeholder="Maximum"
                          />

                          <span>
                            g
                          </span>

                        </div>

                      </div>

                    </div>

                  </div>

                </div>

              )

            })}

          </div>


          {/* ============================= */}
          {/* Stage Actions                  */}
          {/* ============================= */}

          <div className="admin-fish-edit-actions">

            <button
              type="button"
              className="admin-fish-form-cancel"
              onClick={onCancel}
              disabled={loading}
            >
              Cancel
            </button>


            <button
              type="button"
              className="admin-fish-form-submit"
              onClick={() => {

                setError('')

                const form =
                  document.querySelector(
                    '.admin-fish-edit-form'
                  ) as HTMLFormElement | null


                if (form) {

                  form.requestSubmit()

                }
                else {

                  setError(
                    'Please save the General Info first.'
                  )

                }

              }}
              disabled={loading}
            >

              {loading
                ? 'Saving...'
                : fish
                  ? 'Save Changes'
                  : 'Add Fish'}

            </button>

          </div>

        </div>

      )}
      
      
      {fish && activeTab === 'Feed' && (
        <FishFeed fish={fish} />
      )}


    </div>

  )

}


export default FishForm