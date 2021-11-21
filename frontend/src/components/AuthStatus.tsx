import React from 'react';
import { Button, Icon } from 'semantic-ui-react';
import { useMoralis } from 'react-moralis';
import makeBlockie from 'ethereum-blockies-base64';

export default function AuthStatus() {
  const { authenticate, isAuthenticated, user, logout } = useMoralis();

  return (
    <div className="right menu">
      {isAuthenticated && user ? (
        <>
          <a onClick={(e) => { e.preventDefault(); logout(); }} className="ui item" href="/">
            <Icon name="sign-out" size="small" />
            Sign out
          </a>
          <div className="username ui item">
            <img className="blockie" src={makeBlockie(user.get('ethAddress'))} alt={user.get('ethAddress')} /> {user.get('username')}
          </div>
        </>
      ) : (
        <Button onClick={() => authenticate()} className="ui item">
          <Icon name="sign-in" size="small" />
          Sign in
        </Button>
      )}
    </div>
  );
}
