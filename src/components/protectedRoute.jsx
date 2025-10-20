import React from 'react'
import { Navigate } from 'react-router-dom'
import { useContext } from 'react'
import { AuthContext } from '../Context/authContext'
import Loader from './Loader'

const protectedRoute = ({children}) => {
  const { isLogin , isLoading } = useContext(AuthContext);

  if (isLoading) {
    return <Loader />;
  }

  console.log("ProtectedRoute - isLogin:", isLogin);

  if (!isLogin) {
    return <Navigate to="/login" replace />;
  }

  return children;

}

export default protectedRoute
