import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import './styles/global.scss'
import { Home } from './pages/Home'
import { NewRoom } from './pages/NewRoom'
import { AuthContextProvider } from './contexts/AuthContext'
import { Room } from './pages/Room'
import { AdminRoom } from './pages/AdminRoom'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />
  },
  {
    path: 'rooms/news',
    element: <NewRoom />
  },
  {
    path: '/rooms/:id',
    element: <Room />
  },
  {
    path: '/admin/rooms/:id',
    element: <AdminRoom />
  }
])

function App() {
  return (
    <AuthContextProvider>
      <RouterProvider router={router} />
    </AuthContextProvider>
  )
}

export default App
