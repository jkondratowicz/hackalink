import * as HackaABI from '../contracts/Hacka.json';
import { Button, Form, Input, Message } from 'semantic-ui-react';
import { useMoralis, useWeb3ExecuteFunction } from 'react-moralis';
import moment, { Moment } from 'moment';
import { Link } from 'react-router-dom';
import React, { useContext, useState } from 'react';
import { ApiContext } from '../hooks/ApiContext';
import Datetime from 'react-datetime';
import { CreateHackathonData } from '../models/hackathon.types';

export function CreateHackathon() {
  const { enableWeb3 } = useMoralis();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { setShowSpinner } = useContext(ApiContext);
  const { fetch } = useWeb3ExecuteFunction({
    abi: HackaABI.abi,
    contractAddress: HackaABI.address,
    functionName: 'createHackathon',
  });

  const defaultValues = {
    timestampStart: moment().add(7, 'days').unix(),
    timestampEnd: moment().add(28, 'days').unix(),
    name: '',
    url: 'https://',
    judgingPeriod: 3,
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

  const createHackathon = async (data: CreateHackathonData) => {
    console.log('Creating', data);
    await fetch({
      params: {
        params: {
          _timestampStart: data.timestampStart,
          _timestampEnd: data.timestampEnd,
          _name: data.name,
          _url: data.url,
          _judgingPeriod: data.judgingPeriod,
        },
      },
      onError: handleMoralisError,
      onSuccess: handleMoralisSuccess,
    });
  };

  const handleChange = (e: any, { name, value }: any) => {
    if (name === 'judgingPeriod') {
      value = parseInt(value, 10);
    }
    setData({ ...data, [name]: value });
  };

  const handleStartDateChange = (v: string | Moment) => {
    if (typeof v === 'string') {
      v = moment(v);
    }
    handleChange(null, { name: 'timestampStart', value: v.unix() });
  };

  const handleEndDateChange = (v: string | Moment) => {
    if (typeof v === 'string') {
      v = moment(v);
    }
    handleChange(null, { name: 'timestampEnd', value: v.unix() });
  };

  const handleSubmit = async () => {
    await enableWeb3();
    try {
      setShowSpinner(true);
      await createHackathon(data);
    } catch (e: any) {
      console.log(e);
      setError(e?.message || e?.error || e?.toString() || "" + e);
    } finally {
      setShowSpinner(false);
    }
  };

  return success ? (
    <>
      <Link to="/organize">Back to the list</Link>
      <p>
        Congratulations, your hackathon has been crated! For more details, see tx hash <code>{success}</code>.
      </p>
    </>
  ) : (
    <>
      <Link to="/organize">Back to the list</Link>
      <h1>Create a new hackathon</h1>
      {error && (
        <Message color="red">
          <h3>Error!</h3>
          {error}
        </Message>
      )}

      <Form onSubmit={handleSubmit}>
        <Form.Field>
          <label>
            Hackathon name:
            <Input name="name" value={data.name} onChange={handleChange} />
          </label>
          <p className="form-help">
            Make it catchy and unique, e.g. <em>Chainlink Spring 2022 Hackathon</em> :)
          </p>
        </Form.Field>
        <Form.Field>
          <label>
            Hackathon promo website URL:
            <Input name="url" value={data.url} onChange={handleChange} />
          </label>
          <p className="form-help">URL of a promotional website hosted by you. This is where you can post workshop schedule, sponsor info etc. </p>
        </Form.Field>
        <Form.Field>
          <label>
            Start date:
            <Datetime value={new Date(1000 * data.timestampStart)} onChange={handleStartDateChange} />
          </label>
          <p className="form-help">
            Hackathon will commence at this date. You won't be able to change hackathon's metadata, add new prizes etc. after this date.
          </p>
        </Form.Field>
        <Form.Field>
          <label>
            End date:
            <Datetime value={new Date(1000 * data.timestampEnd)} onChange={handleEndDateChange} />
          </label>
          <p className="form-help">Last moment for participants to send their submissions.</p>
        </Form.Field>
        <Form.Field>
          <label>
            Judging period (days):
            <Input name="judgingPeriod" value={data.judgingPeriod} onChange={handleChange} type="number" />
          </label>
          <p className="form-help">How long will the judges have to review and score all submissions.</p>
        </Form.Field>

        <Button size="massive" color="pink">
          Create a hackathon
        </Button>
      </Form>
    </>
  );
}
