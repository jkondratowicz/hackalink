import { NavLink } from 'react-router-dom';
import { Icon } from 'semantic-ui-react';
import AuthStatus from './AuthStatus';
import logo from '../assets/logo.png';
import { useMoralis } from 'react-moralis';

function AppHeader() {
  const { isAuthenticated } = useMoralis();
  return (
    <div className="ui fixed inverted menu borderlesss">
      <div className="ui container">
        <NavLink
          exact
          to="/"
          className="item logo"
          activeClassName="active"
        >
          <img src={logo} alt="Hacka.link" />
        </NavLink>
        { isAuthenticated ? (<>
          <NavLink
            exact
            to="/create-hackathon"
            className="item"
            activeClassName="active"
          >
            <Icon name="add circle" size="small" />
            Create hackathon
          </NavLink>
          <NavLink
            exact
            to="/organize"
            className="item"
            activeClassName="active"
          >
            <Icon name="cogs" size="small" />
            Organize
          </NavLink>
          <NavLink
            exact
            to="/organize"
            className="item"
            activeClassName="active"
          >
            <Icon name="gavel" size="small" />
            Judge
          </NavLink>
          <NavLink
            exact
            to="/organize"
            className="item"
            activeClassName="active"
          >
            <Icon name="code" size="small" />
            Participate
          </NavLink>
        </>) : <></> }
        <AuthStatus />
      </div>
    </div>
  );
}

export default AppHeader;
