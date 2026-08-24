import './App.css'
import { Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing/Landing'
import Login from './pages/Login/Login'
import Register from './pages/Register/Register'
import Farmer from './pages/Farmer/Farmer'
import Vendor from './pages/Vendor/Vendor'
import Profile from './pages/Profile/Profile'

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
        element={<Farmer />}
      />

      <Route
        path="/profile"
        element={<Profile />}
      />

      <Route
        path="/vendor"
        element={<Vendor />}
      />

    </Routes>
  )
}

export default App