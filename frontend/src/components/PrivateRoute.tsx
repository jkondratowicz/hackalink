import React from 'react';
import { Route, RouteProps, Redirect } from 'react-router-dom';
import { useMoralis } from 'react-moralis';

export const PrivateRoute = (props: RouteProps) => {
  const { isAuthenticated } = useMoralis();

  if (isAuthenticated) {
    return <Route {...props} />;
  }

  return <Redirect to="/" />;
};

export default PrivateRoute;
