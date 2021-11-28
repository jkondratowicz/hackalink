import React from 'react';
import { Grid, List, Segment } from 'semantic-ui-react';
import moment from 'moment';
import { HackathonMetadata, HackathonStage } from '../models/hackathon.types';
import { useMoralis } from 'react-moralis';
import { AddJudge } from './AddJudge';
import { useUtils } from '../hooks/Utils';

export interface HackathonDetailsProps {
  hackathonMetadata?: HackathonMetadata;
}

export function HackathonDetails({ hackathonMetadata }: HackathonDetailsProps) {
  const { user } = useMoralis();
  const { formatWei, areAddressesEqual } = useUtils();

  if (!hackathonMetadata?.id?.toString()) {
    return <></>;
  }

  const isOrganizer = areAddressesEqual(user?.get('ethAddress'), hackathonMetadata?.organizer);

  return (
    <>
      <Grid columns={2} divided>
        <Grid.Row>
          <Grid.Column>
            <h1>Hackathon details</h1>
            <List>
              <List.Item>
                <List.Content>
                  <List.Header>ID:</List.Header>
                  <List.Description>{hackathonMetadata?.id?.toString()}</List.Description>
                </List.Content>
              </List.Item>
              <List.Item>
                <List.Content>
                  <List.Header>Organizer address:</List.Header>
                  <List.Description>{hackathonMetadata?.organizer}</List.Description>
                </List.Content>
              </List.Item>
              <List.Item>
                <List.Content>
                  <List.Header>Name:</List.Header>
                  <List.Description>{hackathonMetadata.name}</List.Description>
                </List.Content>
              </List.Item>
              <List.Item>
                <List.Content>
                  <List.Header>Stage:</List.Header>
                  <List.Description>{HackathonStage[hackathonMetadata.stage]}</List.Description>
                </List.Content>
              </List.Item>
              <List.Item>
                <List.Content>
                  <List.Header>Start date:</List.Header>
                  <List.Description>{moment(hackathonMetadata.timestampStart * 1000).format('YYYY-MM-DD HH:mm')}</List.Description>
                </List.Content>
              </List.Item>
              <List.Item>
                <List.Content>
                  <List.Header>End date:</List.Header>
                  <List.Description>{moment(hackathonMetadata.timestampEnd * 1000).format('YYYY-MM-DD HH:mm')}</List.Description>
                </List.Content>
              </List.Item>
              <List.Item>
                <List.Content>
                  <List.Header>Judging period:</List.Header>
                  <List.Description>{hackathonMetadata.judgingPeriod} hours</List.Description>
                </List.Content>
              </List.Item>
              <List.Item>
                <List.Content>
                  <List.Header>URL:</List.Header>
                  <List.Description>
                    <a href={hackathonMetadata.url} target="_blank" rel="noreferrer">
                      {hackathonMetadata.url}
                    </a>
                  </List.Description>
                </List.Content>
              </List.Item>
            </List>
          </Grid.Column>
          <Grid.Column>
            <h1>Prizes</h1>
            {hackathonMetadata?.prizes?.length &&
              hackathonMetadata.prizes.map((prize) => (
                <Segment piled inverted key={prize.id.toString()}>
                  <List>
                    <List.Item>
                      <List.Content>
                        <List.Header>{prize.name}</List.Header>
                        <List.Description>{prize.description}</List.Description>
                      </List.Content>
                    </List.Item>
                    <List.Item>
                      <List.Content>
                        <List.Header>Prize amount:</List.Header>
                        <List.Description>{formatWei(prize.reward)}</List.Description>
                      </List.Content>
                    </List.Item>
                    <List.Item>
                      <List.Content>
                        <List.Header>Judges:</List.Header>
                        <List.Description>{prize.judges.length ? prize.judges.join(", ") : 'No judges so far...'}</List.Description>
                      </List.Content>
                    </List.Item>
                  </List>
                  {isOrganizer && hackathonMetadata.stage === HackathonStage.NEW && <><hr /><AddJudge hackathonMetadata={hackathonMetadata} prize={prize} /></>}
                </Segment>
              ))}
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </>
  );
}
