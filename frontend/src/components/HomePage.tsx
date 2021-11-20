import { ByMoralis, useMoralis } from 'react-moralis';
import { Container } from 'semantic-ui-react';
import React from 'react';

export function HomePage() {
  const { isAuthenticated, user } = useMoralis();
  return (
    <Container>
      {isAuthenticated && user ? (
        <>
          <h1>Welcome {user.get('username')}</h1>
          <pre>
              {JSON.stringify(user, null, 2)}
          </pre>
        </>
      ) : (
        <>
          <h1>Welcome!</h1>
          <p>Please sign in using the button in the top right.</p>
        </>
      )}
      <hr />
      <ByMoralis width={200} variant="dark" />
      <hr />
      <button className="ui red button">Red</button>
      <button className="ui orange button">Orange</button>
      <button className="ui yellow button">Yellow</button>
      <button className="ui olive button">Olive</button>
      <button className="ui green button">Green</button>
      <button className="ui teal button">Teal</button>
      <button className="ui blue button">Blue</button>
      <button className="ui violet button">Violet</button>
      <button className="ui purple button">Purple</button>
      <button className="ui pink button">Pink</button>
      <button className="ui brown button">Brown</button>
      <button className="ui grey button">Grey</button>
      <button className="ui black button">Black</button>
      <hr />
      <button className="ui inverted button">Standard</button>
      <button className="ui inverted primary button">Primary</button>
      <button className="ui inverted secondary button">Secondary</button>
      <button className="ui inverted red button">Red</button>
      <button className="ui inverted orange button">Orange</button>
      <button className="ui inverted yellow button">Yellow</button>
      <button className="ui inverted olive button">Olive</button>
      <button className="ui inverted green button">Green</button>
      <button className="ui inverted teal button">Teal</button>
      <button className="ui inverted blue button">Blue</button>
      <button className="ui inverted violet button">Violet</button>
      <button className="ui inverted purple button">Purple</button>
      <button className="ui inverted pink button">Pink</button>
      <button className="ui inverted brown button">Brown</button>
      <button className="ui inverted grey button">Grey</button>
      <button className="ui inverted black button">Black</button>
      <hr />
      <div className="ui input">
        <input type="text" placeholder="Search..." />
      </div>
      <hr />
      <div className="ui form">
        <textarea />
      </div>
    </Container>
  );
}
