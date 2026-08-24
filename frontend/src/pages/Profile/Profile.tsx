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
}

function Profile() {
  const navigate = useNavigate()

  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const [account, setAccount] = useState<Account | null>(null)

  const [editing, setEditing] = useState(false)

  const [name, setName] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')

  const [profileImage, setProfileImage] = useState('')

  const [selectedImage, setSelectedImage] = useState('')


  /* ============================= */
  /* Load Account                  */
  /* ============================= */

  useEffect(() => {
    const storedAccount =
      localStorage.getItem('aquaNexusAccount')

    if (!storedAccount) {
      navigate('/login')
      return
    }

    try {
      const parsedAccount: Account =
        JSON.parse(storedAccount)

      setAccount(parsedAccount)

      setName(parsedAccount.name || '')
      setCity(parsedAccount.city || '')
      setState(parsedAccount.state || '')

      const storedImage =
        localStorage.getItem(
          'aquaNexusProfileImage'
        )

      if (storedImage) {
        setProfileImage(storedImage)
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

    setName(account.name || '')
    setCity(account.city || '')
    setState(account.state || '')

    setSelectedImage('')

    setEditing(true)
  }


  /* ============================= */
  /* Cancel Editing                */
  /* ============================= */

  const handleCancel = () => {
    if (!account) {
      return
    }

    setName(account.name || '')
    setCity(account.city || '')
    setState(account.state || '')

    setSelectedImage('')

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
      return
    }

    const reader = new FileReader()

    reader.onload = () => {

      const result =
        reader.result

      if (typeof result === 'string') {
        setSelectedImage(result)
      }

    }

    reader.readAsDataURL(file)
  }


  /* ============================= */
  /* Save                          */
  /* ============================= */

  const handleSave = () => {

    if (!account) {
      return
    }

    const updatedAccount: Account = {
      ...account,
      name: name.trim(),
      city: city.trim(),
      state: state.trim(),
    }

    localStorage.setItem(
      'aquaNexusAccount',
      JSON.stringify(updatedAccount)
    )

    setAccount(updatedAccount)

    if (selectedImage) {

      localStorage.setItem(
        'aquaNexusProfileImage',
        selectedImage
      )

      setProfileImage(selectedImage)
    }

    setSelectedImage('')

    setEditing(false)
  }


  /* ============================= */
  /* Current Image                 */
  /* ============================= */

  const displayedImage =
    selectedImage ||
    profileImage


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
            onClick={() => navigate('/farmer')}
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
            <div className="profile-header-spacer"></div>
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
                onChange={handleImageChange}
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
                  setName(event.target.value)
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


          {/* Role */}

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
                  setCity(event.target.value)
                }
              />

            ) : (

              <p>
                {account.city || 'Not provided'}
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
                  setState(event.target.value)
                }
              />

            ) : (

              <p>
                {account.state || 'Not provided'}
              </p>

            )}

          </div>

        </div>


        {/* ============================= */}
        {/* Edit Buttons                  */}
        {/* ============================= */}

        {editing && (

          <div className="profile-action-buttons">

            <button
              type="button"
              className="profile-cancel-button"
              onClick={handleCancel}
            >
              CANCEL
            </button>

            <button
              type="button"
              className="profile-save-button"
              onClick={handleSave}
            >
              SAVE
            </button>

          </div>

        )}


      </div>

    </div>
  )
}

export default Profile