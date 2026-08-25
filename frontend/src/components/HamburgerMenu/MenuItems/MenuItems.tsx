import { useNavigate } from 'react-router-dom'
import './MenuItems.css'

type MenuItemsProps = {
  role: 'farmer' | 'vendor'
}

function MenuItems({ role }: MenuItemsProps) {
  const navigate = useNavigate()

  const handleSignOut = () => {
    localStorage.removeItem('aquaNexusAccount')
    localStorage.removeItem('aquaNexusProfileImage')

    navigate('/login')
  }

  return (
    <nav className="menu-items">

      <button
        type="button"
        className="side-menu-item"
        onClick={() =>
          navigate(
            role === 'vendor'
              ? '/profile?role=vendor'
              : '/profile?role=farmer'
          )
        }
      >
        Profile
      </button>

      <button
        type="button"
        className="side-menu-item"
        onClick={() => {
          console.log(`Chat selected for ${role}`)
        }}
      >
        Chat
      </button>

      <button
        type="button"
        className="side-menu-item"
        onClick={() => {
          console.log(`Orders selected for ${role}`)
        }}
      >
        Orders
      </button>

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