import React from 'react';
import PropTypes from 'prop-types';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

function PrivateRoute({ children, allowedRoles }) {
  const token = localStorage.getItem('token');

  if (!token) {
    return <Navigate to="/" />;
  }

  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    if (decoded.exp > currentTime && allowedRoles.includes(decoded.role)) {
      return children;
    } else {
      return <Navigate to="/" />;
    }
  } catch (err) {
    return <Navigate to="/" />;
  }
}

PrivateRoute.propTypes = {
  children: PropTypes.node.isRequired,
  allowedRoles: PropTypes.arrayOf(PropTypes.string).isRequired
};

export default PrivateRoute;
