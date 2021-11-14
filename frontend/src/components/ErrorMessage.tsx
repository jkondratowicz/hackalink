import { Icon, Message } from 'semantic-ui-react';
import React, { ComponentProps } from 'react';

function ErrorMessage(props: ComponentProps<any>) {
  return (
    props.children ? (
      <Message negative icon>
        <Icon name='exclamation triangle' />
        <Message.Content>
          <Message.Header>Error!</Message.Header>
          {props.children}
        </Message.Content>
      </Message>
    ) : <></>
  );
}

export default ErrorMessage;
