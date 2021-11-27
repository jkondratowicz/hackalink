import { Container } from 'semantic-ui-react';
import React from 'react';
import { useParams } from 'react-router-dom';

export function JudgePrize() {
  const params = useParams();

  return (
    <Container>
      <h1>Judge submissions to this prize:</h1>
      <pre>
        {JSON.stringify(params, null, 2)}
      </pre>
    </Container>
  );
}
