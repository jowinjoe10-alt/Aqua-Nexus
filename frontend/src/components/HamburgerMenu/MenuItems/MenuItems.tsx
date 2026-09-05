import { useNavigate } from 'react-router-dom'

import './MenuItems.css'


type MenuItemsProps = {
  role: 'farmer' | 'vendor' | 'admin'

  onChatSelect?: () => void

  onAdminSectionChange?: (
    section: 'Farmer' | 'Vendor' | 'Admin'
  ) => void
}


function MenuItems({
  role,
  onChatSelect
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
  /* Chat                          */
  /* ============================= */

  const handleChat = () => {

    if (onChatSelect) {

      onChatSelect()

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
        onClick={handleChat}
      >
        Chat
      </button>


      {/* ============================= */}
      {/* Orders                        */}
      {/* ============================= */}

      {role !== 'admin' && (

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

      )}


      {/* ============================= */}
      {/* Subscriptions                 */}
      {/* ============================= */}

      {role !== 'admin' && (

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

      )}


      {/* ============================= */}
      {/* Admin Navigation              */}
      {/* ============================= */}

      {role === 'admin' && (

        <>

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