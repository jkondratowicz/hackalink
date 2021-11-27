import { useMoralis } from 'react-moralis';
import { Button, Container, Table } from 'semantic-ui-react';
import React, { useContext, useEffect, useState } from 'react';
import { getJudgesHackathons } from '../models/hackathon';
import { ApiContext } from '../hooks/ApiContext';
import moment from 'moment';
import { HackathonPrize, HackathonStage } from '../models/hackathon.types';
import { Link } from 'react-router-dom';

export function JudgeMain() {
  const { Moralis, user } = useMoralis();
  const { setShowSpinner } = useContext(ApiContext);
  const [prizes, setPrizes] = useState<HackathonPrize[]>([]);
  useEffect(() => {
    if (!user?.get('ethAddress')) {
      return;
    }

    setShowSpinner(true);

    getJudgesHackathons(Moralis, user?.get('ethAddress'))
      .then(setPrizes)
      .finally(() => {
        setShowSpinner(false);
      });
  }, [user, Moralis, setShowSpinner]);

  return (
    <Container>
      <h1>List of prizes where you're a judge:</h1>
      <Table celled inverted>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Hackathon</Table.HeaderCell>
            <Table.HeaderCell>Prize</Table.HeaderCell>
            <Table.HeaderCell>Judging period</Table.HeaderCell>
            <Table.HeaderCell>Actions</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {prizes.map((row, idx) => (
            <Table.Row key={idx}>
              <Table.Cell>{row?.hackathon?.name} ({HackathonStage[row?.hackathon?.stage || 0]})</Table.Cell>
              <Table.Cell>{row.name}</Table.Cell>
              <Table.Cell>
                {moment((row?.hackathon?.timestampEnd || 0) * 1000).format('YYYY-MM-DD HH:mm')} + {row?.hackathon?.judgingPeriod} hours
              </Table.Cell>
              <Table.Cell>
                {row?.hackathon?.stage === HackathonStage.JUDGING && (
                  <Link to={`/judge/${row?.hackathon?.id}/${row.id}`}>
                    <Button
                      color="pink"
                    >
                      Judge submissions of this prize
                    </Button>
                  </Link>
                )}
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </Container>
  );
}
