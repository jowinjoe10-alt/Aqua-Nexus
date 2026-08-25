import { Navigate } from 'react-router-dom'

type ProtectedRouteProps = {
  children: React.ReactNode
  role?: 'farmer' | 'vendor'
}

function ProtectedRoute({
  children,
  role,
}: ProtectedRouteProps) {

  const storedAccount =
    localStorage.getItem('aquaNexusAccount')

  if (!storedAccount) {
    return <Navigate to="/login" replace />
  }

  try {
    const account = JSON.parse(
      storedAccount
    )

    if (role && account.role !== role) {

      if (account.role === 'farmer') {
        return (
          <Navigate
            to="/farmer"
            replace
          />
        )
      }

      if (account.role === 'vendor') {
        return (
          <Navigate
            to="/vendor"
            replace
          />
        )
      }

      return (
        <Navigate
          to="/login"
          replace
        />
      )
    }

    return children

  } catch (error) {

    localStorage.removeItem(
      'aquaNexusAccount'
    )

    return (
      <Navigate
        to="/login"
        replace
      />
    )
  }
}

export default ProtectedRoute