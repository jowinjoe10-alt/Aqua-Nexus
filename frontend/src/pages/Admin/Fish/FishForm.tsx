import {
  useEffect,
  useState
} from 'react'

import './Fish.css'


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
  /* Image                         */
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

  }, [fish])


  /* ============================= */
  /* Image Preview                 */
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
  /* Image Selection               */
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
  /* Form Validation               */
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


    return true

  }


  /* ============================= */
  /* Submit                        */
  /* ============================= */

  const handleSubmit = (
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


    /*
     * Image remains optional.
     *
     * For an existing fish:
     * - existing image stays unchanged
     *   when no new image is selected.
     *
     * - a new image replaces it when
     *   the admin selects one.
     */

    if (image) {

      formData.append(
        'image',
        image
      )

    }


    setLoading(true)


    const endpoint =
      fish
        ? `http://127.0.0.1:8000/api/fish/${fish.id}/`
        : 'http://127.0.0.1:8000/api/fish/'


    fetch(
      endpoint,
      {
        method:
          fish
            ? 'PATCH'
            : 'POST',

        body: formData
      }
    )
      .then((response) => {

        if (!response.ok) {

          return response
            .json()
            .then((data) => {

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

            })
            .catch((error) => {

              if (
                error instanceof Error &&
                error.message !==
                  'Unable to save fish.'
              ) {

                throw error

              }


              throw new Error(
                'Unable to save fish.'
              )

            })

        }


        return response.json()

      })
      .then(() => {

        onComplete()

      })
      .catch((saveError) => {

        console.error(
          'Error saving fish:',
          saveError
        )


        setError(
          saveError instanceof Error
            ? saveError.message
            : 'Unable to save fish.'
        )

      })
      .finally(() => {

        setLoading(false)

      })

  }


  /* ============================= */
  /* Display Image                 */
  /* ============================= */

  const displayImage =
    previewImage ||
    existingImage


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

        <button
          type="button"
          className={
            activeTab === 'General Info'
              ? 'admin-fish-details-tab active'
              : 'admin-fish-details-tab'
          }
          onClick={() => {

            setActiveTab(
              'General Info'
            )

            setError('')

          }}
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
          onClick={() => {

            setActiveTab(
              'Stages'
            )

            setError('')

          }}
        >
          Stages
        </button>

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
            {/* Image                          */}
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


              {/* ============================= */}
              {/* Image Control                  */}
              {/* ============================= */}

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

              {/* ============================= */}
              {/* Fish Name                      */}
              {/* ============================= */}

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


              {/* ============================= */}
              {/* Water Type                     */}
              {/* ============================= */}

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


              {/* ============================= */}
              {/* Feeding Habit                  */}
              {/* ============================= */}

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


              {/* ============================= */}
              {/* Temperature Range              */}
              {/* ============================= */}

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


              {/* ============================= */}
              {/* pH Range                      */}
              {/* ============================= */}

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


              {/* ============================= */}
              {/* Culture Period                 */}
              {/* ============================= */}

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
          {/* Form Actions                   */}
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
            Stages
          </h3>


          <p>

            Stage information and feed
            recommendations will be added later.

          </p>


          <p>

            The six fish growth stages,
            stage images, and stage-specific
            feed recommendations will be
            configured here.

          </p>

        </div>

      )}

    </div>

  )

}


export default FishForm