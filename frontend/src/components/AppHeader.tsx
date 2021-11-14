import { NavLink } from 'react-router-dom';
import { Icon } from 'semantic-ui-react';
import AuthStatus from './AuthStatus';

function AppHeader() {
  return (
    <div className="ui fixed inverted menu">
      <div className="ui container">
        <NavLink
          exact
          to="/"
          className="item"
          activeClassName="active"
        >
          <Icon name="home" size="small" />
          Home
        </NavLink>
        <NavLink
          exact
          to="/create-hackathon"
          className="item"
          activeClassName="active"
        >
          <Icon name="add circle" size="small" />
          Create hackathon
        </NavLink>
        <AuthStatus />
      </div>
    </div>
  );
}

export default AppHeader;
