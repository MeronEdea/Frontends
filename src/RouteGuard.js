import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import { isAuthenticated, getUserRole } from 'authService';

function RouteGuard({ component: Component, allowedRoles, ...rest }) {
  const isAuthenticatedUser = isAuthenticated();
  const userRole = getUserRole();

  // Check if user is authenticated
  if (!isAuthenticatedUser) {
    return <Redirect to="/login" />;
  }

  // Check if the route is allowed for the user's role
  if (!allowedRoles.includes(userRole)) {
    return <Redirect to="/unauthorized" />;
  }

  return <Route {...rest} render={(props) => <Component {...props} />} />;
}

export default RouteGuard;
