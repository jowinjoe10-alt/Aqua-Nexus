import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Profile.css'

type Account = {
  id: number
  name: string
  gmail: string
  role: string
  city: string
  state: string
  mobile_number: string
  profile_picture: string
}

function Profile() {
  const navigate = useNavigate()

  const fileInputRef =
    useRef<HTMLInputElement | null>(null)

  const [account, setAccount] =
    useState<Account | null>(null)

  const [editing, setEditing] =
    useState(false)

  const [name, setName] =
    useState('')

  const [mobileNumber, setMobileNumber] =
    useState('')

  const [city, setCity] =
    useState('')

  const [state, setState] =
    useState('')

  const [profileImage, setProfileImage] =
    useState('')

  const [selectedImage, setSelectedImage] =
    useState('')

  const [selectedImageFile, setSelectedImageFile] =
    useState<File | null>(null)

  const [saving, setSaving] =
    useState(false)

  const [error, setError] =
    useState('')


  /* ============================= */
  /* Load Account                  */
  /* ============================= */

  useEffect(() => {

    const storedAccount =
      localStorage.getItem(
        'aquaNexusAccount'
      )

    if (!storedAccount) {
      navigate('/login')
      return
    }

    try {

      const parsedAccount: Account =
        JSON.parse(storedAccount)

      setAccount(parsedAccount)

      setName(
        parsedAccount.name || ''
      )

      setMobileNumber(
        parsedAccount.mobile_number || ''
      )

      setCity(
        parsedAccount.city || ''
      )

      setState(
        parsedAccount.state || ''
      )

      if (parsedAccount.profile_picture) {

        setProfileImage(
          parsedAccount.profile_picture
        )

      }

    } catch (error) {

      console.error(
        'Unable to load profile:',
        error
      )

      navigate('/login')
    }

  }, [navigate])


  /* ============================= */
  /* Edit Profile                  */
  /* ============================= */

  const handleEdit = () => {

    if (!account) {
      return
    }

    setName(
      account.name || ''
    )

    setMobileNumber(
      account.mobile_number || ''
    )

    setCity(
      account.city || ''
    )

    setState(
      account.state || ''
    )

    setSelectedImage('')
    setSelectedImageFile(null)

    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }

    setError('')

    setEditing(true)
  }


  /* ============================= */
  /* Cancel Editing                */
  /* ============================= */

  const handleCancel = () => {

    if (!account) {
      return
    }

    setName(
      account.name || ''
    )

    setMobileNumber(
      account.mobile_number || ''
    )

    setCity(
      account.city || ''
    )

    setState(
      account.state || ''
    )

    setSelectedImage('')
    setSelectedImageFile(null)

    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }

    setError('')

    setEditing(false)
  }


  /* ============================= */
  /* Select Profile Image          */
  /* ============================= */

  const handleImageChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {

    const file =
      event.target.files?.[0]

    if (!file) {
      return
    }

    if (!file.type.startsWith('image/')) {

      setError(
        'Please select a valid image file'
      )

      return
    }

    if (file.size > 5 * 1024 * 1024) {

      setError(
        'Profile picture must be smaller than 5 MB'
      )

      return
    }

    /*
     * Store the actual File object.
     * This is what Django receives.
     */

    setSelectedImageFile(file)

    console.log(
      'SELECTED FILE:',
      file
    )

    console.log(
      'FILE NAME:',
      file.name
    )

    console.log(
      'FILE TYPE:',
      file.type
    )

    console.log(
      'FILE SIZE:',
      file.size
    )


    /* ============================= */
    /* Create Preview                */
    /* ============================= */

    const reader =
      new FileReader()

    reader.onload = () => {

      const result =
        reader.result

      if (typeof result === 'string') {

        setSelectedImage(
          result
        )

      }

    }

    reader.readAsDataURL(file)

    setError('')
  }


  /* ============================= */
  /* Save Profile                  */
  /* ============================= */

  const handleSave = async () => {

    if (!account) {
      return
    }


    /* ============================= */
    /* Trim Values                  */
    /* ============================= */

    const trimmedName =
      name.trim()

    const trimmedMobileNumber =
      mobileNumber.trim()

    const trimmedCity =
      city.trim()

    const trimmedState =
      state.trim()


    /* ============================= */
    /* Validation                   */
    /* ============================= */

    if (!trimmedName) {

      setError(
        'Name is required'
      )

      return
    }

    if (!trimmedCity) {

      setError(
        'City is required'
      )

      return
    }

    if (!trimmedState) {

      setError(
        'State is required'
      )

      return
    }


    setError('')
    setSaving(true)


    try {

      /* ============================= */
      /* Create FormData              */
      /* ============================= */

      const formData =
        new FormData()


      formData.append(
        'account_id',
        String(account.id)
      )

      formData.append(
        'name',
        trimmedName
      )

      formData.append(
        'mobile_number',
        trimmedMobileNumber
      )

      formData.append(
        'city',
        trimmedCity
      )

      formData.append(
        'state',
        trimmedState
      )


      /* ============================= */
      /* Profile Picture              */
      /* ============================= */

      console.log(
        '================================'
      )

      console.log(
        'FILE BEFORE UPLOAD:',
        selectedImageFile
      )

      console.log(
        '================================'
      )


      if (selectedImageFile) {

        formData.append(
          'profile_picture',
          selectedImageFile,
          selectedImageFile.name
        )

      }


      /* ============================= */
      /* Inspect FormData             */
      /* ============================= */

      console.log(
        'FORM DATA CONTENTS:'
      )

      for (
        const [
          key,
          value
        ] of formData.entries()
      ) {

        if (value instanceof File) {

          console.log(
            key,
            `FILE: ${value.name}`,
            `TYPE: ${value.type}`,
            `SIZE: ${value.size}`
          )

        } else {

          console.log(
            key,
            value
          )

        }

      }


      /* ============================= */
      /* Send Request                 */
      /* ============================= */

      const response =
        await fetch(
          'http://127.0.0.1:8000/api/account/profile/',
          {
            method: 'POST',

            /*
             * Do NOT set Content-Type here.
             *
             * The browser automatically sets:
             *
             * multipart/form-data;
             * boundary=...
             */

            body: formData,
          }
        )


      /* ============================= */
      /* Read Response                */
      /* ============================= */

      const data =
        await response.json()


      console.log(
        'PROFILE API RESPONSE:',
        data
      )


      /* ============================= */
      /* Handle Error                 */
      /* ============================= */

      if (!response.ok) {

        setError(
          data.message ||
          'Unable to update profile'
        )

        return
      }


      /* ============================= */
      /* Updated Account              */
      /* ============================= */

      const updatedAccount: Account =
        data.account


      console.log(
        'UPDATED ACCOUNT:',
        updatedAccount
      )


      /* ============================= */
      /* Save Account                 */
      /* ============================= */

      localStorage.setItem(
        'aquaNexusAccount',
        JSON.stringify(
          updatedAccount
        )
      )


      setAccount(
        updatedAccount
      )


      setName(
        updatedAccount.name
      )

      setMobileNumber(
        updatedAccount.mobile_number || ''
      )

      setCity(
        updatedAccount.city
      )

      setState(
        updatedAccount.state
      )


      /* ============================= */
      /* Profile Picture URL          */
      /* ============================= */

      if (
        updatedAccount.profile_picture
      ) {

        setProfileImage(
          updatedAccount.profile_picture
        )

        console.log(
          'PROFILE PICTURE URL:',
          updatedAccount.profile_picture
        )

      }


      /* ============================= */
      /* Clear Selected Image         */
      /* ============================= */

      setSelectedImage('')
      setSelectedImageFile(null)

      if (fileInputRef.current) {

        fileInputRef.current.value = ''

      }


      setEditing(false)

    } catch (error) {

      console.error(
        'Profile update error:',
        error
      )

      setError(
        'Unable to connect to server'
      )

    } finally {

      setSaving(false)
    }

  }


  /* ============================= */
  /* Displayed Image              */
  /* ============================= */

  const displayedImage =
    selectedImage ||
    profileImage


  /* ============================= */
  /* Account Loading              */
  /* ============================= */

  if (!account) {
    return null
  }


  return (
    <div className="profile-page">

      {/* ============================= */}
      {/* Profile Card                  */}
      {/* ============================= */}

      <div className="profile-card">


        {/* ============================= */}
        {/* Header                        */}
        {/* ============================= */}

        <header className="profile-header">

          <button
            type="button"
            className="profile-back-button"
            onClick={() =>
              navigate(
                account.role === 'vendor'
                  ? '/vendor'
                  : '/farmer'
              )
            }
          >
            ←
          </button>


          <h1>
            {editing
              ? 'EDIT PROFILE'
              : 'PROFILE'}
          </h1>


          {!editing && (

            <button
              type="button"
              className="profile-edit-button"
              onClick={handleEdit}
              aria-label="Edit profile"
            >
              ✎
            </button>

          )}


          {editing && (

            <div className="profile-header-spacer">
            </div>

          )}

        </header>


        {/* ============================= */}
        {/* Profile Picture               */}
        {/* ============================= */}

        <div className="profile-picture-section">

          <div className="profile-picture">

            {displayedImage ? (

              <img
                src={displayedImage}
                alt="Profile"
              />

            ) : (

              <span className="profile-picture-placeholder">

                {account.name
                  ? account.name
                      .charAt(0)
                      .toUpperCase()
                  : '?'}

              </span>

            )}

          </div>


          {editing && (

            <>

              <button
                type="button"
                className="change-photo-button"
                onClick={() =>
                  fileInputRef.current?.click()
                }
              >
                Change Photo
              </button>


              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="profile-file-input"
                onChange={
                  handleImageChange
                }
              />

            </>

          )}

        </div>


        {/* ============================= */}
        {/* Profile Information           */}
        {/* ============================= */}

        <div className="profile-information">


          {/* Name */}

          <div className="profile-field">

            <label htmlFor="profile-name">
              Name
            </label>

            {editing ? (

              <input
                id="profile-name"
                type="text"
                value={name}
                onChange={(event) =>
                  setName(
                    event.target.value
                  )
                }
              />

            ) : (

              <p>
                {account.name}
              </p>

            )}

          </div>


          {/* Gmail */}

          <div className="profile-field">

            <label htmlFor="profile-gmail">
              Gmail
            </label>

            <div className="gmail-field">

              <p>
                {account.gmail}
              </p>

              {editing && (

                <span className="locked-label">
                  🔒 Cannot be changed
                </span>

              )}

            </div>

          </div>


          {/* Mobile Number */}

          <div className="profile-field">

            <div className="profile-mobile-label">

              <label
                htmlFor="profile-mobile"
                className="mobile-number-label"
              >
                Mobile Number
              </label>

            </div>

            {editing ? (

              <input
                id="profile-mobile"
                type="tel"
                inputMode="numeric"
                placeholder="Optional"
                value={mobileNumber}
                onChange={(event) => {

                  const value =
                    event.target.value

                  if (
                    /^[0-9+\-\s()]*$/.test(
                      value
                    )
                  ) {

                    setMobileNumber(
                      value
                    )

                  }

                }}
              />

            ) : (

              <p>
                {account.mobile_number ||
                  'Not provided'}
              </p>

            )}

          </div>


          {/* Account Type */}

          <div className="profile-field">

            <label>
              Account Type
            </label>

            <p className="profile-readonly-value">

              {account.role === 'farmer'
                ? 'Farmer'
                : account.role}

            </p>

          </div>


          {/* City */}

          <div className="profile-field">

            <label htmlFor="profile-city">
              City
            </label>

            {editing ? (

              <input
                id="profile-city"
                type="text"
                value={city}
                onChange={(event) =>
                  setCity(
                    event.target.value
                  )
                }
              />

            ) : (

              <p>
                {account.city ||
                  'Not provided'}
              </p>

            )}

          </div>


          {/* State */}

          <div className="profile-field">

            <label htmlFor="profile-state">
              State
            </label>

            {editing ? (

              <input
                id="profile-state"
                type="text"
                value={state}
                onChange={(event) =>
                  setState(
                    event.target.value
                  )
                }
              />

            ) : (

              <p>
                {account.state ||
                  'Not provided'}
              </p>

            )}

          </div>

        </div>


        {/* ============================= */}
        {/* Error                         */}
        {/* ============================= */}

        {error && (

          <p className="profile-error">
            {error}
          </p>

        )}


        {/* ============================= */}
        {/* Edit Buttons                  */}
        {/* ============================= */}

        {editing && (

          <div className="profile-action-buttons">

            <button
              type="button"
              className="profile-cancel-button"
              onClick={handleCancel}
              disabled={saving}
            >
              CANCEL
            </button>


            <button
              type="button"
              className="profile-save-button"
              onClick={handleSave}
              disabled={saving}
            >
              {saving
                ? 'SAVING...'
                : 'SAVE'}
            </button>

          </div>

        )}

      </div>

    </div>
  )
}

export default Profile