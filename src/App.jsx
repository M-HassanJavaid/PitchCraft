import { useState, useEffect } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Signup from './pages/signup'
import Login from './pages/Login'
import Home from './pages/Home'
import Dashboard from './pages/dashboard'
import Loader from './components/Loader'
import StartupData from './pages/startupData.jsx'

import { AuthContext } from './Context/authContext'

import { checkUserAuth } from './functions/checkAuth.js'

import  ProtectedRoute  from './components/protectedRoute.jsx'

function App() {

  const [isLogin, setIsLogin] = useState(false);
  const [user, setUser] = useState({ name: '', email: '', uid: '' })
  const [isLoading, setIsLoading] = useState(true)

  async function waitForUser() {
    try {
      let user = await checkUserAuth();
      if (user) {
        setIsLogin(true);
        setUser({
          name: user.displayName,
          email: user.email,
          uid: user.uid
        });
        console.log("User is logged in:", user);
      }

    } catch (error) {
      alert("Error checking user authentication: " + error.message);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    waitForUser();
  }, [])


  if (isLoading) {
    return <Loader />
  }


  const router = createBrowserRouter([
    {
      path: '/signup',
      element: <Signup />
    },
    {
      path: '/login',
      element: <Login />
    },
    {
      path: '/',
      element: (
        <ProtectedRoute>
          <Home />
        </ProtectedRoute>
      )
    },
    {
      path: '/dashboard',
      element: (
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      )
    },
    {
      path:'/startup/:id',
      element: (
        <ProtectedRoute>
          <StartupData />
        </ProtectedRoute>
      )
    }
  ])

  return (
    <AuthContext.Provider value={{ isLogin, setIsLogin, user, setUser, isLoading, setIsLoading }}>
      <RouterProvider router={router} />
    </AuthContext.Provider>

  )
}

export default App
