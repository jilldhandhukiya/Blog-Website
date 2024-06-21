import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';

const ProtectedRoute = ({ component: Component }) => {
    const { auth } = useContext(AuthContext);
  
    return auth ? <Component UserInfo={auth}/> : <Navigate to="/login" />;
  };
  
  export default ProtectedRoute;