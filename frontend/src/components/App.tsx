import React from 'react';
import { CreateHackathon } from './CreateHackathon';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import { Page404 } from './Page404';
import { HomePage } from './HomePage';
import { ApiContext } from '../hooks/ApiContext';
import GlobalSpinner from './GlobalSpinner';
import AppHeader from './AppHeader';

function App() {
  const [showSpinner, setShowSpinner] = React.useState(false);
  return (
    <ApiContext.Provider value={ { showSpinner, setShowSpinner } }>
      <div id="hacka-dapp" className="">
        <Router>
          <GlobalSpinner />
          <AppHeader />
          <section>
            <div className="ui main container">
              <Switch>
                <Route path="/" component={HomePage} exact />
                <PrivateRoute path="/create-hackathon" component={CreateHackathon} exact />
                <Route component={Page404} />
              </Switch>
            </div>
          </section>
        </Router>
      </div>
    </ApiContext.Provider>
  );
}

export default App;
