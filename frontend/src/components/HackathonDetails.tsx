import React from 'react';
import { HackathonMetadata, HackathonStage } from '../models/hackathon';
import { List } from 'semantic-ui-react';
import moment from 'moment';

export interface HackathonDetailsProps {
  hackathonMetadata?: HackathonMetadata;
}

export function HackathonDetails({ hackathonMetadata }: HackathonDetailsProps) {
  if (!hackathonMetadata?.id?.toString()) {
    return <></>;
  }

  return (
    <>
      <h1>Hackathon details</h1>
      <List>
        <List.Item>
          <List.Content>
            <List.Header>
              ID:
            </List.Header>
            <List.Description>
              {hackathonMetadata?.id?.toString()}
            </List.Description>
          </List.Content>
        </List.Item>
        <List.Item>
          <List.Content>
            <List.Header>
              Name:
            </List.Header>
            <List.Description>
              {hackathonMetadata.name}
            </List.Description>
          </List.Content>
        </List.Item>
        <List.Item>
          <List.Content>
            <List.Header>
              Stage:
            </List.Header>
            <List.Description>
              {HackathonStage[hackathonMetadata.stage]}
            </List.Description>
          </List.Content>
        </List.Item>
        <List.Item>
          <List.Content>
            <List.Header>
              Start date:
            </List.Header>
            <List.Description>
              {moment(hackathonMetadata.timestampStart * 1000).format('YYYY-MM-DD HH:mm')}
            </List.Description>
          </List.Content>
        </List.Item>
        <List.Item>
          <List.Content>
            <List.Header>
              End date:
            </List.Header>
            <List.Description>
              {moment(hackathonMetadata.timestampEnd * 1000).format('YYYY-MM-DD HH:mm')}
            </List.Description>
          </List.Content>
        </List.Item>
        <List.Item>
          <List.Content>
            <List.Header>
              Judging period:
            </List.Header>
            <List.Description>
              {hackathonMetadata.judgingPeriod} days
            </List.Description>
          </List.Content>
        </List.Item>
        <List.Item>
          <List.Content>
            <List.Header>
              URL:
            </List.Header>
            <List.Description>
              <a href={hackathonMetadata.url} target="_blank" rel="noreferrer">{hackathonMetadata.url}</a>
            </List.Description>
          </List.Content>
        </List.Item>
      </List>
    </>
  );
}
