import { useNavigate } from 'react-router-dom'
import './MenuItems.css'

type MenuItemsProps = {
  role: 'farmer' | 'vendor' | 'admin'
}

function MenuItems({ role }: MenuItemsProps) {

  const navigate = useNavigate()

  const handleSignOut = () => {

    localStorage.removeItem(
      'aquaNexusAccount'
    )

    localStorage.removeItem(
      'aquaNexusProfileImage'
    )

    navigate('/login')
  }

  const handleProfile = () => {

    navigate(
      `/profile?role=${role}`
    )
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