import { Container } from 'semantic-ui-react';
import { NavLink } from 'react-router-dom';
import React from 'react';

export function Page404() {
  return (
    <Container>
      <h1>Oops, page not found, sorry!</h1>
      <NavLink to="/">
        Go back home
      </NavLink>
    </Container>
  );
}