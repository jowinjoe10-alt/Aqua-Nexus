import './App.css'
import { Routes, Route } from 'react-router-dom'

import Landing from './pages/Landing/Landing'
import Login from './pages/Login/Login'
import Register from './pages/Register/Register'
import Farmer from './pages/Farmer/Farmer'
import Vendor from './pages/Vendor/Vendor'
import Profile from './pages/Profile/Profile'

import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute'

function App() {
  return (
    <Routes>

      {/* ============================= */}
      {/* Public Routes                 */}
      {/* ============================= */}

      <Route
        path="/"
        element={<Landing />}
      />

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/register"
        element={<Register />}
      />


      {/* ============================= */}
      {/* Farmer                        */}
      {/* ============================= */}

      <Route
        path="/farmer"
        element={
          <ProtectedRoute role="farmer">
            <Farmer />
          </ProtectedRoute>
        }
      />


      {/* ============================= */}
      {/* Vendor                        */}
      {/* ============================= */}

      <Route
        path="/vendor"
        element={
          <ProtectedRoute role="vendor">
            <Vendor />
          </ProtectedRoute>
        }
      />


      {/* ============================= */}
      {/* Profile                       */}
      {/* ============================= */}

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />

    </Routes>
  )
}

export default App