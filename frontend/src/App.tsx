import './App.css'
import { Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing/Landing'
import Login from './pages/Login/Login'
import Register from './pages/Register/Register'
import Farmer from './pages/Farmer/Farmer'

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

    </Routes>
  )
}

export default App