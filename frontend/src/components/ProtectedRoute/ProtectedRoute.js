import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { jwtDecode } from "jwt-decode";

const ProtectedRoute = ({ element, authorizedRoles }) => {
    const token = Cookies.get('token');

    if (!token) { //user not logged in
        return <Navigate to="/login" replace />;
    }

    const decodedToken = jwtDecode(token);
    const userType = decodedToken.role;

    if (!authorizedRoles.includes(userType)) { // incorrect user type
        return <Navigate to="/unauthorized" replace />; 
    } 

    return element
};

export default ProtectedRoute;