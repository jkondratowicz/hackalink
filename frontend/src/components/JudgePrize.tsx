import { Container } from 'semantic-ui-react';
import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useMoralis } from 'react-moralis';
import { ApiContext } from '../hooks/ApiContext';
import { HackathonPrize } from '../models/hackathon.types';
import { getJudgesHackathons } from '../models/hackathon';
import { getAllPrizeSubmissions } from '../models/prize';

export function JudgePrize() {
  const params: { hackathonId: string, prizeId: string } = useParams();

  const { Moralis, user } = useMoralis();
  const { setShowSpinner } = useContext(ApiContext);
  const [submissions, setSubmissions] = useState<any[]>([]);
  useEffect(() => {
    if (!user?.get('ethAddress')) {
      return;
    }

    setShowSpinner(true);

    getAllPrizeSubmissions(Moralis, params.hackathonId, params.prizeId)
      .then(setSubmissions)
      .finally(() => {
        setShowSpinner(false);
      });
  }, [user, Moralis, setShowSpinner]);

  return (
    <Container>
      <h1>Judge submissions for this prize:</h1>

      // TODO
      <pre>
        {JSON.stringify(params, null, 2)}
      </pre>
      <pre>
        {JSON.stringify(submissions, null, 2)}
      </pre>
    </Container>
  );
}
