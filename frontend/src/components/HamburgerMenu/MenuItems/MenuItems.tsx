import { useNavigate } from 'react-router-dom'
import './MenuItems.css'


type MenuItemsProps = {
  role: 'farmer' | 'vendor' | 'admin'

  onAdminSectionChange?: (
    section: 'Farmer' | 'Vendor' | 'Admin'
  ) => void
}


function MenuItems({
  role,
  onAdminSectionChange
}: MenuItemsProps) {

  const navigate = useNavigate()


  /* ============================= */
  /* Sign Out                      */
  /* ============================= */

  const handleSignOut = () => {

    localStorage.removeItem(
      'aquaNexusAccount'
    )

    localStorage.removeItem(
      'aquaNexusProfileImage'
    )

    navigate('/login')
  }


  /* ============================= */
  /* Profile                       */
  /* ============================= */

  const handleProfile = () => {

    navigate(
      `/profile?role=${role}`
    )
  }


  /* ============================= */
  /* Admin Section                 */
  /* ============================= */

  const handleAdminSection = (
    section: 'Farmer' | 'Vendor' | 'Admin'
  ) => {

    if (onAdminSectionChange) {

      onAdminSectionChange(
        section
      )

    }

  }


  return (

    <nav className="menu-items">


      {/* ============================= */}
      {/* Profile                       */}
      {/* ============================= */}

      <button
        type="button"
        className="side-menu-item"
        onClick={handleProfile}
      >
        Profile
      </button>


      {/* ============================= */}
      {/* Chat                          */}
      {/* ============================= */}

      <button
        type="button"
        className="side-menu-item"
        onClick={() => {

          console.log(
            `Chat selected for ${role}`
          )

        }}
      >
        Chat
      </button>


      {/* ============================= */}
      {/* Orders                        */}
      {/* ============================= */}

      <button
        type="button"
        className="side-menu-item"
        onClick={() => {

          console.log(
            `Orders selected for ${role}`
          )

        }}
      >
        Orders
      </button>


      {/* ============================= */}
      {/* Subscriptions                 */}
      {/* ============================= */}

      <button
        type="button"
        className="side-menu-item"
        onClick={() => {

          console.log(
            `Subscriptions selected for ${role}`
          )

        }}
      >
        Subscriptions
      </button>


      {/* ============================= */}
      {/* Admin Navigation              */}
      {/* ============================= */}

      {role === 'admin' && (

        <>

          <button
            type="button"
            className="side-menu-item"
            onClick={() =>
              handleAdminSection(
                'Farmer'
              )
            }
          >
            Farmer
          </button>


          <button
            type="button"
            className="side-menu-item"
            onClick={() =>
              handleAdminSection(
                'Vendor'
              )
            }
          >
            Vendor
          </button>


          <button
            type="button"
            className="side-menu-item"
            onClick={() =>
              handleAdminSection(
                'Admin'
              )
            }
          >
            Admin
          </button>

        </>

      )}


      {/* ============================= */}
      {/* Sign Out                      */}
      {/* ============================= */}

      <button
        type="button"
        className="side-menu-item sign-out"
        onClick={handleSignOut}
      >
        Sign Out
      </button>

    </nav>

  )
}


export default MenuItems