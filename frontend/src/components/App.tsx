import React from 'react';
import { CreateHackathon } from './CreateHackathon';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import { Page404 } from './Page404';
import { HomePage } from './HomePage';
import { ApiContext } from '../hooks/ApiContext';
import GlobalSpinner from './GlobalSpinner';
import AppHeader from './AppHeader';
import { Organize } from './Organize';
import { Participate } from './Participate';
import 'react-datetime/css/react-datetime.css';
import { JudgeMain } from './JudgeMain';
import { JudgePrize } from './JudgePrize';
import { useMoralis } from 'react-moralis';
import { Dimmer, Loader } from 'semantic-ui-react';

function App() {
  const [showSpinner, setShowSpinner] = React.useState(false);
  const { isInitialized } = useMoralis();
  if (!isInitialized) {
    return <Dimmer active={true}>
      <Loader size='large' />
    </Dimmer>;
  }

  return (
    <ApiContext.Provider value={{ showSpinner, setShowSpinner }}>
      <div id="hacka-dapp" className="">
        <Router>
          <GlobalSpinner />
          <AppHeader />
          <section>
            <div className="ui main container">
              <Switch>
                <Route path="/" component={HomePage} exact />
                <PrivateRoute path="/participate" component={Participate} exact />
                <PrivateRoute path="/judge" component={JudgeMain} exact />
                <PrivateRoute path="/judge/:hackathonId/:prizeId" component={JudgePrize} exact />
                <PrivateRoute path="/organize" component={Organize} exact />
                <PrivateRoute path="/organize/create" component={CreateHackathon} exact />
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
