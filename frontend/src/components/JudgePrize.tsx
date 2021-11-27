import { Button, Container, Message, Rating, Table } from 'semantic-ui-react';
import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useMoralis, useWeb3ExecuteFunction } from 'react-moralis';
import { ApiContext } from '../hooks/ApiContext';
import { HackathonSubmission } from '../models/hackathon.types';
import { getAllPrizeSubmissions } from '../models/prize';
import * as HackaABI from '../contracts/Hacka.json';

export function JudgePrize() {
  const { Moralis, user, enableWeb3 } = useMoralis();
  const params: { hackathonId: string, prizeId: string } = useParams();
  const [scores, setScores] = useState<number[]>([]);
  const { setShowSpinner } = useContext(ApiContext);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [success, setSuccess] = useState<boolean>(false);
  const [error, setError] = useState('');
  const { fetch } = useWeb3ExecuteFunction({
    abi: HackaABI.abi,
    contractAddress: HackaABI.address,
    functionName: 'voteOnProjects',
  });


  useEffect(() => {
    if (!user?.get('ethAddress')) {
      return;
    }

    setShowSpinner(true);

    getAllPrizeSubmissions(Moralis, params.hackathonId, params.prizeId)
      .then((submissions) => {
        setSubmissions(submissions);
        setScores(Array(submissions.length).fill(0));
      })
      .finally(() => {
        setShowSpinner(false);
      });
  }, [params.hackathonId, params.prizeId, user, Moralis, setShowSpinner]);

  const saveRating = (idx: number, rating: string | number | undefined) => {
    if (!rating) {
      rating = 0;
    }
    const newRatings = [...scores];
    newRatings[idx] = +rating;
    setScores(newRatings);
  };

  const handleMoralisError = (err: string[] | Error | any) => {
    console.log('err');
    console.log(err);
    if (Array.isArray(err)) {
      err = err[0];
    }

    setError(err?.message || err?.error || '' + err);
    setShowSpinner(false);
  };

  const handleMoralisSuccess = (result: any) => {
    console.log('result');
    console.log(result);
    setSuccess(true);
    setShowSpinner(false);
  };

  const handleSubmit = async () => {
    console.log(scores);
    setError('');
    setShowSpinner(true);

    await enableWeb3();

    await fetch({
      params: {
        params: {
          _hackathonId: params.hackathonId,
          _prizeId: params.prizeId,
          _votes: scores,
        },
      },
      onError: handleMoralisError,
      onSuccess: handleMoralisSuccess,
    });
  };

  if (success) {
    return (
      <Container>
        <h1>Great, your votes have been saved!</h1>
      </Container>
    );
  }

  return (
    <Container>
      <h1>Judge submissions for this prize</h1>
      <p>
        Please rate each project according to this scale:<br />
        <Rating defaultRating={0} maxRating={5} disabled /> - project does not meet minimum criteria of the prize, e.g. prize sponsor's technology is not used at all<br />
        <Rating defaultRating={1} maxRating={5} disabled /> - project is eligible for the prize, but its quality is low or it doesn't introduce any innovation<br />
        <Rating defaultRating={2} maxRating={5} disabled /> <br />
        <Rating defaultRating={3} maxRating={5} disabled /> <br />
        <Rating defaultRating={4} maxRating={5} disabled /> <br />
        <Rating defaultRating={5} maxRating={5} disabled /> - top quality, great idea and execution overall, no serious shortcomings<br />
      </p>
      <Table celled inverted>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Id</Table.HeaderCell>
            <Table.HeaderCell>Name</Table.HeaderCell>
            <Table.HeaderCell>Description</Table.HeaderCell>
            <Table.HeaderCell>Rating</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {submissions.map((row: HackathonSubmission, idx) => (
            <Table.Row key={idx}>
              <Table.Cell>{row.id.toString()}</Table.Cell>
              <Table.Cell>{row.name}</Table.Cell>
              <Table.Cell>{row.description}</Table.Cell>
              <Table.Cell>
                <Rating maxRating={5} onRate={(e, { rating }) => saveRating(idx, rating)} />
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
      {error && (
        <Message color="red">
          <h3>Error!</h3>
          {error}
        </Message>
      )}
      <Button size="massive" color="pink" onClick={handleSubmit}>Submit your ratings</Button>
    </Container>
  );
}
