import React from 'react';
import { Dimmer, Loader } from 'semantic-ui-react';
import { ApiContext } from '../hooks/ApiContext';

export default class GlobalSpinner extends React.Component {
  render() {
    return (
      <ApiContext.Consumer>
        {({showSpinner}) =>
          <Dimmer active={showSpinner}>
            <Loader size='large' />
          </Dimmer>
        }
      </ApiContext.Consumer>
    );
  }
}
