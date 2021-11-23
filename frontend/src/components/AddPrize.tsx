import React, { useState } from 'react';
import { HackathonDetailsProps } from './HackathonDetails';
import { Button, Form, Icon, Input, Message, TextArea } from 'semantic-ui-react';
import { useMoralis } from 'react-moralis';
import * as HackaABI from '../contracts/Hacka.json';
import { AddPrizeData } from '../models/hackathon.types';

export function AddPrize({ hackathonMetadata }: HackathonDetailsProps) {
  const { enableWeb3, Moralis } = useMoralis();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showSpinner, setShowSpinner] = useState(false);

  const defaultValues: AddPrizeData = {
    name: '',
    description: '',
    amount: 100000,
  };
  const [data, setData] = useState(defaultValues);

  const handleMoralisError = (err: string[] | Error | any) => {
    console.log(err);
    if (Array.isArray(err)) {
      err = err[0];
    }

    setError(err?.message || err?.error || '' + err);
    setShowSpinner(false);
  };

  const handleMoralisSuccess = (result: any) => {
    setSuccess(result?.transactionHash);
    setShowSpinner(false);
  };

  const addPrize = async (data: AddPrizeData) => {
    console.log('Creating', data);
    setError('');

    const options = {
      contractAddress: HackaABI.address,
      abi: HackaABI.abi,
      functionName: 'addPrize',
      msgValue: data.amount * 1000000000,
      params: {
        _amount: data.amount * 1000000000,
        _hackathonId: hackathonMetadata?.id?.toString(),
        _name: data.name.trim(),
        _description: data.description.trim(),
      },
    };
    try {
      const tx = await (Moralis as any).executeFunction(options);
      handleMoralisSuccess(tx);
    } catch (e: any) {
      handleMoralisError(e);
    }
  };

  const handleChange = (e: any, { name, value }: any) => {
    if (name === 'amount') {
      value = parseInt(value, 10);
    }
    setData({ ...data, [name]: value });
  };

  const handleSubmit = async () => {
    await enableWeb3();
    try {
      if (data.name.trim().length < 8) {
        throw new Error('Name must be at least 8 characters long');
      }
      if (data.description.trim().length < 16) {
        throw new Error('Description must be at least 16 characters long');
      }
      if (data.amount < 100000) {
        throw new Error('Amount must be at least 100,000 gwei');
      }
      setShowSpinner(true);
      await addPrize(data);
    } catch (e: any) {
      console.log(e);
      setError(e?.message || e?.error || e?.toString() || '' + e);
    } finally {
      setShowSpinner(false);
    }
  };

  return success ? (
    <>
      <p>
        Congratulations, you have added a new prize to hackathon <strong>{hackathonMetadata?.name}</strong> (id = {hackathonMetadata?.id.toString()}). For more
        details, see tx hash <code>{success}</code>.
      </p>
    </>
  ) : (
    <>
      <h1>Add a new prize to the hackathon</h1>
      <p>
        You're about to set a prize to your hackathon <strong>{hackathonMetadata?.name}</strong> (id = {hackathonMetadata?.id.toString()}).
      </p>
      <p>
        You will need to define the prize reward in gwei and this amount will be transferred to the smart contract after you confirm it in your wallet. You will
        not be able to change this reward later, so be careful.
      </p>
      {error && (
        <Message color="red">
          <h3>Error!</h3>
          {error}
        </Message>
      )}

      <Form onSubmit={handleSubmit}>
        <Form.Field>
          <label>
            Prize name:
            <Input name="name" value={data.name} onChange={handleChange} />
          </label>
          <p className="form-help">
            Short and to the point, e.g. <em>Grand Prize</em>.
          </p>
        </Form.Field>
        <Form.Field>
          <label>
            Description:
            <TextArea name="description" onChange={handleChange} value={data.description} />
          </label>
          <p className="form-help">Describe who's eligible for this prize, what are the conditions to win it etc.</p>
        </Form.Field>
        <Form.Field>
          <label>
            Prize reward in gwei:
            <Input name="amount" value={data.amount} onChange={handleChange} type="number" />
          </label>
        </Form.Field>

        <Button size="massive" color="pink" disabled={showSpinner}>
          {showSpinner ? <Icon name="spinner" loading /> : 'Add this prize!'}
        </Button>
      </Form>
    </>
  );
}
