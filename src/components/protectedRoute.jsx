import React from 'react'
import { Navigate } from 'react-router-dom'
import { useContext } from 'react'
import { AuthContext } from '../Context/authContext'
import Loader from './Loader'

const protectedRoute = ({children}) => {
  const { isLogin , isLoading , user} = useContext(AuthContext);

  if (isLoading) {
    return <Loader />;
  }

  console.log("ProtectedRoute - isLogin:", isLogin);

  if (!isLogin) {
    alert("You must be logged in to access this page.");
    return <Navigate to="/login" replace />;
  }

  

  return children;

}

export default protectedRoute
