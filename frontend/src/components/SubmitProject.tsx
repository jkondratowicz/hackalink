import React, { useState } from 'react';
import { HackathonDetailsProps } from './HackathonDetails';
import { Button, Checkbox, CheckboxProps, Form, Icon, Input, Message, TextArea } from 'semantic-ui-react';
import { useMoralis } from 'react-moralis';
import * as HackaABI from '../contracts/Hacka.json';
import { HackathonPrize, SubmitProjectData } from '../models/hackathon.types';
import { useUtils } from '../hooks/Utils';

export function SubmitProject({ hackathonMetadata }: HackathonDetailsProps) {
  const { enableWeb3, Moralis } = useMoralis();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showSpinner, setShowSpinner] = useState(false);
  const { formatWei } = useUtils();

  const defaultValues: SubmitProjectData = {
    name: '',
    description: '',
    prizes: [],
  };
  const [data, setData] = useState<SubmitProjectData>(defaultValues);

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

  const addSubmission = async (data: SubmitProjectData) => {
    console.log('Creating', data);
    setError('');

    const options = {
      contractAddress: HackaABI.address,
      abi: HackaABI.abi,
      functionName: 'submitProject',
      params: {
        _hackathonId: hackathonMetadata?.id?.toString(),
        _name: data.name.trim(),
        _description: data.description.trim(),
        _prizes: data.prizes,
      },
    };
    try {
      const tx = await (Moralis as any).executeFunction(options);
      await tx.re
      handleMoralisSuccess(tx);
    } catch (e: any) {
      handleMoralisError(e);
    }
  };

  const handleChange = (e: any, { name, value }: any) => {
    setData({ ...data, [name]: value });
  };

  const handlePrizeChange = (e: any, { checked, value }: CheckboxProps) => {
    const newPrizes = [...data.prizes];
    if (checked) {
      newPrizes.push('' + value);
    } else {
      newPrizes.splice(newPrizes.indexOf('' + value), 1);
    }
    setData({ ...data, prizes: newPrizes });
  };

  const isPrizeSelected = (row: HackathonPrize) => {
    const prizeId = row.id.toString();
    return data.prizes.includes(prizeId);
  };

  const handleSubmit = async () => {
    await enableWeb3();
    try {
      if (data.name.trim().length < 8) {
        throw new Error('Name must be at least 8 characters long');
      }
      if (data.description.trim().length < 16) {
        throw new Error('Description must be at least 32 characters long');
      }
      if (data.prizes.length < 1) {
        throw new Error('You must select at least one prize');
      }
      setShowSpinner(true);
      await addSubmission(data);
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
        Congratulations, your project has been submitted to hackathon <strong>{hackathonMetadata?.name}</strong> ({hackathonMetadata?.id.toString()}). Let's
        hope the judges like it!
      </p>
    </>
  ) : (
    <>
      <h1>Submit a project</h1>
      <p>
        You're about to submit a project to the hackathon <strong>{hackathonMetadata?.name}</strong> ({hackathonMetadata?.id.toString()}).
      </p>
      <p>
        In the description field please provide all the necessary details. Make sure your submission meets the requirements of the hackathon's organizer! In
        general it is recommended that your submission includes:
      </p>
      <ol>
        <li>Short description - "elevator pitch" of the real-life problem that your project attempts to solve.</li>
        <li>
          Technical details - what technologies, frameworks, libraries, external services etc. you've used to build your project. You can go into as much or as
          little details as you'd like, but it's recommended to at least describe the high level architecture of the solution.
        </li>
        <li>Link to the Git repository where judges can see the source code of your project. This is probably the most important part of your submission!</li>
        <li>Link to your solution deployed on the web if it's possible for the judges to actually play around with it.</li>
        <li>Link to a short video (e.g. YouTube, Vimeo etc.) where you describe your project.</li>
        <li>
          Plans for the future - if you plan to continue working on your project, e.g. release it for public use, add new features etc., don't be shy and let
          everyone know!
        </li>
      </ol>
      <p>Of course those are just our suggestions. Remember, your main goal is to catch judges' attention and wow them! Be creative!</p>
      {error && (
        <Message color="red">
          <h3>Error!</h3>
          {error}
        </Message>
      )}

      <Form onSubmit={handleSubmit}>
        <Form.Field>
          <label>
            Submission name:
            <Input name="name" value={data.name} onChange={handleChange} />
          </label>
          <p className="form-help">Think of a catchy name that best summarizes your project.</p>
        </Form.Field>
        <Form.Field>
          <label>
            Description:
            <TextArea name="description" onChange={handleChange} value={data.description} />
          </label>
          <p className="form-help">Please review our suggestions above. Use Markdown to format your description, include links, graphics etc.</p>
        </Form.Field>
        <Form.Field>
          <label>
            <p className="form-help">Please select at least one prize your project is eligible for:</p>
          </label>
          {hackathonMetadata?.prizes &&
            hackathonMetadata.prizes.map((prize) => (
              <label key={prize.id.toString()}>
                <Checkbox checked={isPrizeSelected(prize)} value={prize.id.toString()} onChange={handlePrizeChange} />
                {prize.name} <em>(prize of {formatWei(prize.reward)})</em>
              </label>
            ))}
        </Form.Field>

        <Button size="massive" color="pink" disabled={showSpinner}>
          {showSpinner ? <Icon name="spinner" loading /> : 'Submit your project!'}
        </Button>
      </Form>
    </>
  );
}
