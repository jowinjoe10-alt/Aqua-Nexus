import './App.css'
import { Routes, Route } from 'react-router-dom'

import Landing from './pages/Landing/Landing'
import Login from './pages/Login/Login'
import Register from './pages/Register/Register'
import Farmer from './pages/Farmer/Farmer'
import Vendor from './pages/Vendor/Vendor'
import Admin from './pages/Admin/Admin'
import Profile from './pages/Profile/Profile'
import FarmerOrders from './pages/FarmerOrders/FarmerOrders'
import FarmerSubscriptions from './pages/Farmer/FarmerSubscriptions/FarmerSubscriptions'

import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute'

function App() {
  return (
    <Routes>

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

      <Route
        path="/farmer"
        element={
          <ProtectedRoute role="farmer">
            <Farmer />
          </ProtectedRoute>
        }
      />

      <Route
        path="/farmer/orders"
        element={
          <ProtectedRoute role="farmer">
            <FarmerOrders />
          </ProtectedRoute>
        }
      />

      <Route
        path="/farmer/subscriptions"
        element={
          <ProtectedRoute role="farmer">
            <FarmerSubscriptions />
          </ProtectedRoute>
        }
      />

      <Route
        path="/vendor"
        element={
          <ProtectedRoute role="vendor">
            <Vendor />
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin"
        element={
          <ProtectedRoute role="admin">
            <Admin />
          </ProtectedRoute>
        }
      />


    </Routes>
  )
}

export default App