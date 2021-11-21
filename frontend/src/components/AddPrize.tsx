import React, { useContext, useState } from 'react';
import { HackathonDetailsProps } from './HackathonDetails';
import { Button, Form, Input, Message, TextArea } from 'semantic-ui-react';
import { useMoralis, useWeb3ExecuteFunction } from 'react-moralis';
import { ApiContext } from '../hooks/ApiContext';
import * as HackaABI from '../contracts/Hacka.json';
import { AddPrizeData } from '../models/hackathon.types';
import { isValidAddress } from '../models/address';

export function AddPrize({ hackathonMetadata }: HackathonDetailsProps) {
  const { enableWeb3 } = useMoralis();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { setShowSpinner } = useContext(ApiContext);
  const { fetch } = useWeb3ExecuteFunction({
    abi: HackaABI.abi,
    contractAddress: HackaABI.address,
    functionName: 'createHackathon',
  });

  const defaultValues: AddPrizeData = {
    name: '',
    description: '',
    amount: 1,
    judges: [
      ''
    ],
  };
  const [data, setData] = useState(defaultValues);

  const handleMoralisError = (err: string[] | Error | any) => {
    if (Array.isArray(err)) {
      err = err[0];
    }

    setError(err?.message || err?.error || '' + err);
  };

  const handleMoralisSuccess = (result: any) => {
    setSuccess(result?.transactionHash);
  };

  const addPrize = async (data: AddPrizeData) => {
    console.log('Creating', data);
    // TODO actually can't add judges, must use another step...
    // TODO actually send in MONEY
    await fetch({
      params: {
        params: {
          _amount: data.amount,
          _hackathonId: hackathonMetadata?.id?.toString(),
          _name: data.name.trim(),
          _description: data.description.trim(),
        },
      },
      onError: handleMoralisError,
      onSuccess: handleMoralisSuccess,
    });
  };

  const handleChange = (e: any, { name, value }: any) => {
    if (name === 'amount') {
      value = parseInt(value, 10);
    }
    setData({ ...data, [name]: value });
  };

  const setJudgeAddress = (idx: number, value: string) => {
    const newJudges = [...data.judges];
    newJudges[idx] = value;
    setData({
      ...data,
      judges: newJudges,
    });
  };

  const addJudge = () => {
    setData({
      ...data,
      judges: [...data.judges, ''],
    });
  };

  const handleSubmit = async () => {
    await enableWeb3();
    try {
      if (data.name.trim().length < 8) {
        throw new Error('Name must be at least 8 characters long');
      }
      if (data.description.trim().length < 16) {
        throw new Error('Description must be at least 8 characters long');
      }
      if (data.amount < 1000000) {
        throw new Error('Amount must be at least 1,000,000 gwei');
      }
      if (data.judges.filter(isValidAddress).length < 1) {
        throw new Error('At least one valid judge address is needed');
      }
      setShowSpinner(true);
      await addPrize(data);
    } catch (e: any) {
      console.log(e);
      setError(e?.message || e?.error || e?.toString() || "" + e);
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
        {
          data.judges.map((judge: string, idx) => (
            <Form.Field>
              <label>
                Wallet address of Judge {idx + 1}:
                <Input name={"judge" + idx} value={judge} onChange={(_, { value }) => setJudgeAddress(idx, value)} />
              </label>
            </Form.Field>
          ))
        }
        <Button color="blue" onClick={() => addJudge()}>Add another judge</Button>
        <Form.Field>
          <label>
            Prize reward in gwei:
            <Input name="amount" value={data.amount} onChange={handleChange} type="number" />
          </label>
        </Form.Field>

        <Button size="massive" color="pink">
          Add this prize!
        </Button>
      </Form>
    </>
  );
}
