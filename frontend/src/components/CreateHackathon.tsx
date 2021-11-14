import * as HackaABI from '../contracts/Hacka.json';
import { Button } from 'semantic-ui-react';
import { useMoralis, useWeb3ExecuteFunction } from 'react-moralis';
import moment from 'moment';
import { NavLink } from 'react-router-dom';
import React from 'react';

export function CreateHackathon() {
  const metadata = {
    _timestampStart: moment().add(2, 'days').unix(),
    _timestampEnd: moment().add(10, 'days').unix(),
    _name: 'random name',
    _url: 'https://localhost',
    _judgingPeriod: 3,
  };
  const { enableWeb3 } = useMoralis();
  const { data, error, fetch, isFetching, isLoading } = useWeb3ExecuteFunction({
    abi: HackaABI.abi,
    contractAddress: HackaABI.address,
    functionName: 'createHackathon',
  });
  const createHackathon = async () => {
    await enableWeb3();
    await fetch({
      params: {
        params: metadata,
      },
    });

  };

  return (
    <>
      <h1>CreateHackathon</h1>
      <Button onClick={createHackathon}>Create</Button>
      <pre>
        {JSON.stringify(
          {
            data,
            error,
            fetch,
            isFetching,
            isLoading,
            metadata,
          },
          null,
          2
        )}
      </pre>
      <NavLink to="/">
        <Button>Go back home</Button>
      </NavLink>
    </>
  );
}
