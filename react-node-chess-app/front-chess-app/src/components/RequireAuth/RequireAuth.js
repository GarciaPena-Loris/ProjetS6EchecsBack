import React from 'react';
import { Navigate } from 'react-router-dom';

const RequireAuth = (Component) => {
    console.log('RequireAuth:');
    const isAuthenticated = sessionStorage.getItem('token') != null;
    return isAuthenticated ? (<Component/>) : (<Navigate to="/connexion" replace />);
};

export default RequireAuth;