import { useState } from 'react'
import { createBrowserRouter , RouterProvider } from 'react-router-dom'
import Signup from './pages/signup'
import Login from './pages/Login'
import Home from './pages/Home'
import Dashboard from './pages/dashboard'


function App() {

  const router = createBrowserRouter([
    {
      path: '/signup',
      element: <Signup/>
    },
    {
      path: '/login',
      element: <Login/>
    },
    {
      path: '/',
      element: <Home/>
    },
    {
      path: '/dashboard',
      element: <Dashboard/>
    }
  ])

  return <RouterProvider router={router} />
}

export default App
