import React from 'react';
import { Navigate } from 'react-router-dom';

const RequireAuth = (WrappedComponent) => {
    const isAuthenticated = sessionStorage.getItem('token') != null;
    return isAuthenticated ? (<WrappedComponent/>) : (<Navigate to="/connexion" replace />);
};

export default RequireAuth;