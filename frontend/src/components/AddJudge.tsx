import React, { useState } from 'react';
import { Button, Form, Icon, Input, Message } from 'semantic-ui-react';
import { useMoralis, useWeb3ExecuteFunction } from 'react-moralis';
import * as HackaABI from '../contracts/Hacka.json';
import { HackathonMetadata, HackathonPrize } from '../models/hackathon.types';
import { useUtils } from '../hooks/Utils';

export interface AddJudgeProps {
  hackathonMetadata: HackathonMetadata;
  prize: HackathonPrize;
}

export function AddJudge({ hackathonMetadata, prize }: AddJudgeProps) {
  const { enableWeb3, user } = useMoralis();
  const { isValidAddress } = useUtils();
  const [error, setError] = useState('');
  const [showSpinner, setShowSpinner] = useState(false);
  const { fetch } = useWeb3ExecuteFunction({
    abi: HackaABI.abi,
    contractAddress: HackaABI.address,
    functionName: 'addJudge',
  });

  const [data, setData] = useState(user?.get('ethAddress'));

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
    setData('');
    setShowSpinner(false);
  };

  const addJudge = async () => {
    console.log('Creating', data);
    setError('');

    await fetch({
      params: {
        params: {
          _hackathonId: hackathonMetadata?.id?.toString(),
          _prizeId: prize?.id?.toString(),
          _judge: data.trim(),
        },
      },
      onError: handleMoralisError,
      onSuccess: handleMoralisSuccess,
    });
  };

  const handleChange = (e: any, { value }: any) => {
    setData(value);
  };

  const handleSubmit = async () => {
    await enableWeb3();
    try {
      if (!isValidAddress(data)) {
        throw new Error('Not a valid wallet addres...');
      }
      setShowSpinner(true);
      await addJudge();
    } catch (e: any) {
      console.log(e);
      setError(e?.message || e?.error || e?.toString() || '' + e);
    } finally {
      setShowSpinner(false);
    }
  };

  return (
    <>
      {error && (
        <Message color="red">
          <h3>Error!</h3>
          {error}
        </Message>
      )}

      <Form onSubmit={handleSubmit}>
        <Form.Field>
          <label>
            <Input name="address" value={data} onChange={handleChange} size="mini" />
          </label>
        </Form.Field>
        <Button size="small" color="pink" disabled={showSpinner}>
          {showSpinner ? <Icon name="spinner" loading /> : 'Add judge to this prize'}
        </Button>
      </Form>
    </>
  );
}
